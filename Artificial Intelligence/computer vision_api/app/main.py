"""
Stroke Detection API — FastAPI
Model: XGBoost + MediaPipe FaceLandmarker
Tim: Capstone_Project-DBS
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import cv2
import joblib
import os
import urllib.request
from pathlib import Path
from typing import Optional
import uvicorn

# ── MediaPipe imports ─────────────────────────────────────────────────────
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision
from mediapipe.tasks.python.vision import FaceLandmarker, FaceLandmarkerOptions, RunningMode

# ── App init ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="Stroke Detection API",
    description="Deteksi stroke dari gambar wajah menggunakan XGBoost + MediaPipe landmark asimetri wajah",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Paths ─────────────────────────────────────────────────────────────────
MODEL_DIR    = Path("models")
MODEL_PATH   = MODEL_DIR / "model_xgb.pkl"
SCALER_PATH  = MODEL_DIR / "scaler.pkl"
LANDMARKER_PATH = MODEL_DIR / "face_landmarker.task"
LANDMARKER_URL  = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"

# ── Global state ──────────────────────────────────────────────────────────
xgb_model  = None
scaler     = None
extractor  = None

# ── Pydantic response ─────────────────────────────────────────────────────
class PredictionResult(BaseModel):
    prediction: str           # "STROKE" or "HEALTHY"
    label: int                # 1 = stroke, 0 = healthy
    confidence_stroke: float  # probabilitas stroke (0–1)
    confidence_healthy: float
    message: str

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str

# ── Feature extraction (sama persis dengan notebook) ─────────────────────
def load_yolo_annotation(txt_path):
    try:
        with open(txt_path, 'r') as f:
            parts = f.read().strip().split()
        if len(parts) == 5:
            return [float(x) for x in parts]
    except:
        pass
    return None

def crop_with_annotation(img, txt_path, margin=0.15):
    ann = load_yolo_annotation(txt_path)
    if ann is None:
        return img
    h, w = img.shape[:2]
    _, cx, cy, bw, bh = ann
    x1 = max(0, int((cx - bw/2 - margin) * w))
    y1 = max(0, int((cy - bh/2 - margin) * h))
    x2 = min(w, int((cx + bw/2 + margin) * w))
    y2 = min(h, int((cy + bh/2 + margin) * h))
    if x2 <= x1 or y2 <= y1:
        return img
    return img[y1:y2, x1:x2]


class LandmarkExtractor:
    def __init__(self, model_path: str):
        base_options = mp_python.BaseOptions(model_asset_path=str(model_path))
        options = FaceLandmarkerOptions(
            base_options=base_options,
            running_mode=RunningMode.IMAGE,
            num_faces=1,
            min_face_detection_confidence=0.4,
            min_face_presence_confidence=0.4,
            output_face_blendshapes=False,
            output_facial_transformation_matrixes=False,
        )
        self.detector = FaceLandmarker.create_from_options(options)

    def extract_from_array(self, img: np.ndarray) -> Optional[np.ndarray]:
        """Ekstrak fitur dari numpy array gambar (BGR)."""
        img = cv2.resize(img, (256, 256))
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        h, w = rgb.shape[:2]
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        result = self.detector.detect(mp_image)
        if not result.face_landmarks:
            return None
        lm = result.face_landmarks[0]
        coords = np.array([[p.x * w, p.y * h] for p in lm])
        return self._compute_features(coords, h, w)

    def _compute_features(self, coords, h, w):
        feats = []
        LEFT_EYE    = [33, 160, 158, 133, 153, 144]
        RIGHT_EYE   = [362, 385, 387, 263, 373, 380]
        LEFT_BROW   = [70, 63, 105, 66, 107]
        RIGHT_BROW  = [300, 293, 334, 296, 336]
        LEFT_MOUTH  = [61, 185, 40, 39, 37]
        RIGHT_MOUTH = [291, 409, 270, 269, 267]
        LEFT_CHEEK  = [116, 123, 147, 213]
        RIGHT_CHEEK = [345, 352, 376, 433]
        NOSE_TIP    = 1

        def dist(a, b): return np.linalg.norm(coords[a] - coords[b])
        def cent(idx):  return np.mean(coords[idx], axis=0)

        midline_x = (coords[10][0] + coords[152][0]) / 2

        # Eye asymmetry
        lec = cent(LEFT_EYE);  rec = cent(RIGHT_EYE)
        for i in range(min(len(LEFT_EYE), len(RIGHT_EYE))):
            feats.append(abs(coords[LEFT_EYE[i]][1] - coords[RIGHT_EYE[i]][1]) / (h + 1e-6))
        # Eye openness
        eye_open_L = dist(LEFT_EYE[1],  LEFT_EYE[5])  / (dist(LEFT_EYE[0],  LEFT_EYE[3])  + 1e-6)
        eye_open_R = dist(RIGHT_EYE[1], RIGHT_EYE[5]) / (dist(RIGHT_EYE[0], RIGHT_EYE[3]) + 1e-6)
        feats.append(abs(eye_open_L - eye_open_R))
        # Brow
        lbc = cent(LEFT_BROW); rbc = cent(RIGHT_BROW)
        feats.append(abs(lbc[1] - rbc[1]) / (h + 1e-6))
        feats.append(abs(abs(lbc[0] - midline_x) - abs(rbc[0] - midline_x)) / (w + 1e-6))
        # Mouth corners
        lmc = cent(LEFT_MOUTH); rmc = cent(RIGHT_MOUTH)
        feats.append(lmc[1] / (h + 1e-6))
        feats.append(rmc[1] / (h + 1e-6))
        feats.append(abs(lmc[1] - rmc[1]) / (h + 1e-6))
        mouth_w_L = abs(lmc[0] - midline_x); mouth_w_R = abs(rmc[0] - midline_x)
        feats.append(abs(mouth_w_L - mouth_w_R) / (w + 1e-6))
        # Nasolabial
        nose_y = coords[NOSE_TIP][1]
        naso_L = abs(lmc[1] - nose_y); naso_R = abs(rmc[1] - nose_y)
        feats.append(abs(naso_L - naso_R) / (h + 1e-6))
        # Cosine similarity
        def cosine_sim(a, b):
            na = np.linalg.norm(a); nb = np.linalg.norm(b)
            if na < 1e-8 or nb < 1e-8: return 0.0
            return float(np.dot(a, b) / (na * nb))
        le_vecs = [coords[LEFT_EYE[i]] - lec  for i in range(len(LEFT_EYE))]
        re_vecs = [coords[RIGHT_EYE[i]] - rec for i in range(len(RIGHT_EYE))]
        eye_cos = np.mean([cosine_sim(le_vecs[i], re_vecs[i]) for i in range(min(len(le_vecs), len(re_vecs)))])
        lm_vecs = [coords[LEFT_MOUTH[i]] - lmc  for i in range(len(LEFT_MOUTH))]
        rm_vecs = [coords[RIGHT_MOUTH[i]] - rmc for i in range(len(RIGHT_MOUTH))]
        mouth_cos = np.mean([cosine_sim(lm_vecs[i], rm_vecs[i]) for i in range(min(len(lm_vecs), len(rm_vecs)))])
        lb_vecs = [coords[LEFT_BROW[i]] - lbc  for i in range(len(LEFT_BROW))]
        rb_vecs = [coords[RIGHT_BROW[i]] - rbc for i in range(len(RIGHT_BROW))]
        brow_cos = np.mean([cosine_sim(lb_vecs[i], rb_vecs[i]) for i in range(min(len(lb_vecs), len(rb_vecs)))])
        feats.extend([eye_cos, mouth_cos, brow_cos])
        # Cheek
        lcc = cent(LEFT_CHEEK); rcc = cent(RIGHT_CHEEK)
        feats.append(abs(lcc[1] - rcc[1]) / (h + 1e-6))
        # Landmark coords (68 titik utama)
        KEY_LM = list(range(0, 68))
        for i in KEY_LM:
            feats.append(coords[i][0] / (w + 1e-6))
            feats.append(coords[i][1] / (h + 1e-6))
        # Smile features
        SMILE_L = [61, 185, 40]
        SMILE_R = [291, 409, 270]
        sm_L = cent(SMILE_L); sm_R = cent(SMILE_R)
        feats.append(sm_L[1] / (h + 1e-6))
        feats.append(sm_R[1] / (h + 1e-6))
        feats.append(abs(sm_L[1] - sm_R[1]) / (h + 1e-6))
        curve_L = coords[61][1] - coords[185][1]
        curve_R = coords[291][1] - coords[409][1]
        feats.append(curve_L / (h + 1e-6))
        feats.append(curve_R / (h + 1e-6))
        feats.append(abs(curve_L - curve_R) / (h + 1e-6))
        lip_w_L = abs(coords[61][0] - midline_x)
        lip_w_R = abs(coords[291][0] - midline_x)
        feats.append(lip_w_L / (w + 1e-6))
        feats.append(lip_w_R / (w + 1e-6))
        feats.append(abs(lip_w_L - lip_w_R) / (w + 1e-6) if (lip_w_L + lip_w_R) > 0 else 0.0)
        cupid_h_L = coords[37][1]; cupid_h_R = coords[267][1]
        feats.append(abs(cupid_h_L - cupid_h_R) / (h + 1e-6))
        cupid_lat_L = abs(coords[37][0] - midline_x); cupid_lat_R = abs(coords[267][0] - midline_x)
        feats.append(abs(cupid_lat_L - cupid_lat_R) / (w + 1e-6))
        lip_area_L = lip_w_L * (abs(sm_L[1] - coords[37][1]) + 1e-6)
        lip_area_R = lip_w_R * (abs(sm_R[1] - coords[267][1]) + 1e-6)
        feats.append(lip_area_L / (lip_area_R + 1e-6))
        feats.append(abs(lip_area_L - lip_area_R) / (h * w + 1e-6))
        UPPER_LIP = 13; LOWER_LIP = 14
        mouth_open = abs(coords[UPPER_LIP][1] - coords[LOWER_LIP][1])
        feats.append(mouth_open / (h + 1e-6))
        feats.append(mouth_open)
        return np.array(feats, dtype=np.float32)


# ── Startup ───────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    global xgb_model, scaler, extractor

    MODEL_DIR.mkdir(exist_ok=True)

    # Download face landmarker jika belum ada
    if not LANDMARKER_PATH.exists():
        print("📥 Downloading FaceLandmarker model...")
        urllib.request.urlretrieve(LANDMARKER_URL, str(LANDMARKER_PATH))
        print("✅ FaceLandmarker downloaded.")

    # Load model & scaler
    if MODEL_PATH.exists() and SCALER_PATH.exists():
        xgb_model = joblib.load(MODEL_PATH)
        scaler    = joblib.load(SCALER_PATH)
        extractor = LandmarkExtractor(str(LANDMARKER_PATH))
        print("✅ XGBoost model & scaler loaded.")
    else:
        print("⚠️  model_xgb.pkl / scaler.pkl tidak ditemukan di folder models/")
        print("   Jalankan notebook Colab dulu, download outputs, lalu taruh di models/")


# ── Routes ────────────────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
def root():
    return {"message": "Stroke Detection API is running 🚀", "docs": "/docs"}


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health():
    return HealthResponse(
        status="ok",
        model_loaded=(xgb_model is not None),
        version="1.0.0",
    )


@app.post("/predict", response_model=PredictionResult, tags=["Prediction"])
async def predict(file: UploadFile = File(...)):
    """
    Upload gambar wajah (JPG/PNG), API akan mengembalikan prediksi stroke.
    - **prediction**: STROKE atau HEALTHY
    - **confidence_stroke**: probabilitas stroke (0.0 – 1.0)
    """
    if xgb_model is None or scaler is None or extractor is None:
        raise HTTPException(
            status_code=503,
            detail="Model belum dimuat. Pastikan model_xgb.pkl & scaler.pkl ada di folder models/"
        )

    # Validasi ekstensi
    allowed = {".jpg", ".jpeg", ".png", ".bmp"}
    suffix = Path(file.filename).suffix.lower()
    if suffix not in allowed:
        raise HTTPException(status_code=400, detail=f"Format file tidak didukung: {suffix}. Gunakan JPG/PNG.")

    # Baca gambar
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Gambar tidak bisa dibaca. Pastikan file valid.")

    # Ekstrak fitur
    features = extractor.extract_from_array(img)
    if features is None:
        raise HTTPException(status_code=422, detail="Wajah tidak terdeteksi dalam gambar. Coba gambar lain dengan wajah yang lebih jelas.")

    # Prediksi
    STROKE_THRESHOLD = 0.3
    feat_scaled = scaler.transform([features])
    prob = xgb_model.predict_proba(feat_scaled)[0]
    pred = 1 if prob[1] >= STROKE_THRESHOLD else 0

    return PredictionResult(
        prediction="STROKE" if pred == 1 else "HEALTHY",
        label=int(pred),
        confidence_stroke=round(float(prob[1]), 4),
        confidence_healthy=round(float(prob[0]), 4),
        message="⚠️ Terdeteksi indikasi stroke. Segera konsultasikan ke dokter." if pred == 1
                else "✅ Tidak terdeteksi indikasi stroke.",
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
