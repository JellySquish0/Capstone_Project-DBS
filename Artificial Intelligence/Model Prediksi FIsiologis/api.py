from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(title="API Prediksi Risiko Stroke")

# 1. Konfigurasi CORS
""" app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) """

# 2. Muat Model dan Daftar Kolom
print("Sedang memuat model...")
model = joblib.load("model/model_stroke_risk.pkl") # Ganti dengan nama file .pkl modelmu
kolom_training = joblib.load("model/kolom_training.pkl") # Ganti dengan nama file .pkl kolommu
print("Model Siap!")

# 3. Format Input (Harus sama persis dengan X_mentah sebelum di-get_dummies)
class DataFitur(BaseModel):
    gender: str
    age: float
    hypertension: int
    heart_disease: int
    ever_married: str
    work_type: str
    Residence_type: str
    avg_glucose_level: float
    bmi: float
    smoking_status: str

# 4. Endpoint Prediksi
@app.post("/prediksi")
def prediksi_AI(data: DataFitur):
    try:
        # a. Ubah input ke DataFrame (hanya 1 baris)
        df_input = pd.DataFrame([data.dict()])
        
        # b. Lakukan get_dummies seperti saat training
        df_encoded = pd.get_dummies(df_input)
        
        # c. JURUS RAHASIA: Selaraskan kolom hasil get_dummies dengan kolom saat training
        # Kolom yang tidak ada akan diisi nilai 0 otomatis
        df_final = df_encoded.reindex(columns=kolom_training, fill_value=0)
        
        # d. Lakukan Prediksi
        hasil = model.predict(df_final)
        
        return {
            "status": "sukses",
            "hasil_prediksi": hasil[0] # Hasilnya 'Low Risk', 'Caution', atau 'High Risk'
        }
    except Exception as e:
        return {
            "status": "error",
            "pesan": str(e)
        }