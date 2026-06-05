import Webcam from "react-webcam";
import { useRef, useState } from "react";
import { detectStroke } from "../services/detectionService";
import "../styles/analyze.css";
import Navbar from "../components/Navbar";
import StepIndicator from "../components/StepIndicator";

export default function Analyze() {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [age, setAge] = useState("");
  const [hypertension, setHypertension] = useState("");
  const [gender, setGender] = useState("");
  const [heart_disease, setheart_disease] = useState("");
  const [smoking, setSmoking] = useState("");
  const [activity, setActivity] = useState("");

  // Ambil foto dari webcam
  const capture = async () => {
    const screenshot = webcamRef.current?.getScreenshot();

    if (!screenshot) return;

    setImage(screenshot);

    try {
      const blob = await fetch(screenshot).then((res) => res.blob());

      const file = new File(
        [blob],
        "webcam.jpg",
        {
          type: "image/jpeg",
        }
      );

      setSelectedFile(file);
    } catch (error) {
      console.log("Error converting screenshot:", error);
    }
  };

  // Upload foto dari device
  const handleUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {

if (
  !age ||
  !gender ||
  !hypertension ||
  !heart_disease ||
  !smoking ||
  !activity
) {
  alert(
    "Mohon lengkapi seluruh data pasien terlebih dahulu."
  );
  return;
}

if (
  Number(age) < 1 ||
  Number(age) > 150
) {
  alert(
    "Umur harus antara 1 - 150 tahun."
  );
  return;
}

    if (!image) {
      alert("Silakan ambil atau upload foto terlebih dahulu.");
      return;
    }

    if (!selectedFile) {
      alert("File foto tidak ditemukan.");
      return;
    }
    
    if (
      !age ||
      Number(age) < 1 ||
      Number(age) > 150
    ) {
      alert(
        "Umur harus diisi antara 1 sampai 150 tahun."
      );
      return;
    }
    
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("image", selectedFile);

      formData.append(
        "gender",
        gender === "L" ? "Male" : "Female"
      );

      formData.append("age", age);

      formData.append(
        "hypertension",
        hypertension === "yes" ? 1 : 0
      );

      formData.append(
        "heart_disease",
        heart_disease === "yes" ? 1 : 0
      );

      formData.append(
        "ever_married",
        "Yes"
      );

      formData.append(
        "work_type",
        "Private"
      );

      formData.append(
        "residence_type",
        "Urban"
      );

      formData.append(
        "avg_glucose_level",
        120
      );

      formData.append(
        "bmi",
        25
      );

      formData.append(
        "smoking_status",
        smoking === "yes"
          ? "formerly smoked"
          : "never smoked"
      );

      const response =
  await detectStroke(formData);

setResult(response.data);
setLoading(false);

      console.log(response.data);
    } catch (error) {
      console.error(error);
      setLoading(false);

      alert(
        error?.response?.data?.message ||
        "Gagal analisis"
      );
    }
  };

  return (
    <div className="page-container">
      <Navbar />

      <StepIndicator />

      {/* HEADER */}
      <div className="hero">
        <h1 className="title">
          Analisis Risiko Stroke
        </h1>

        <p className="subtitle">
          Lengkapi data kesehatan dan ambil foto wajah
          untuk memulai analisis.
        </p>
      </div>

      {/* CONTENT */}
      <div className="analysis-container">

        {/* CARD KAMERA */}
        <div className="card camera-card">

          <h2 className="card-title">
            Kamera
          </h2>

          <p className="camera-note">
            Posisikan wajah di dalam area oval untuk
            hasil analisis yang lebih akurat
          </p>

          <div className="camera-wrapper">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam"
            />

            <div className="face-guide"></div>
          </div>

          <div className="tips">
            <p>✓ Wajah menghadap kamera</p>
            <p>✓ Pencahayaan cukup</p>
            <p>✓ Lepas masker atau penutup wajah</p>
          </div>

          <div className="button-group">
            <button
              className="button"
              onClick={capture}
            >
              Ambil Foto
            </button>

            <button
              className="button-secondary"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              Upload Foto
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleUpload}
              style={{ display: "none" }}
            />
          </div>

          {/* PREVIEW FOTO */}
          {image && (
            <div className="preview-section">
              <h4>
                Preview Foto Terpilih
              </h4>

              <img
                src={image}
                alt="preview"
                className="preview"
              />

              <button
                className="button-secondary"
                onClick={() => {
                  setImage(null);
                  setSelectedFile(null);
                  setResult(null);
                }}
              >
                Hapus Foto
              </button>
            </div>
          )}
        </div>

        {/* CARD DATA PASIEN */}
<div className="card form-card">

  <h2 className="card-title">
    Masukkan Data
  </h2>

  <label className="form-label">
  Umur
</label>

<input
  className="input"
  type="number"
  placeholder="Masukkan umur pasien"
  value={age}
  min="1"
  max="150"
  onChange={(e) => {
    const value = e.target.value;

    if (
      value === "" ||
      (Number(value) >= 1 &&
        Number(value) <= 150)
    ) {
      setAge(value);
    }
  }}
/>

  <label className="form-label">
  Hipertensi
</label>

<select
  className="select"
  value={hypertension}
  onChange={(e) =>
    setHypertension(e.target.value)
  }
>
  <option value="" disabled hidden></option>

  <option value="yes">
    Ya
  </option>

  <option value="no">
    Tidak
  </option>
</select>

  <label className="form-label">
  Jenis Kelamin
</label>

<select
  className="select"
  value={gender}
  onChange={(e) =>
    setGender(e.target.value)
  }
>
  <option value="" disabled hidden></option>

  <option value="L">
    Laki-laki
  </option>

  <option value="P">
    Perempuan
  </option>
</select>

  <label className="form-label">
  Diabetes
</label>

<select
  className="select"
  value={heart_disease}
  onChange={(e) =>
    setheart_disease(e.target.value)
  }
>
  <option value="" disabled hidden></option>

  <option value="yes">
    Ya
  </option>

  <option value="no">
    Tidak
  </option>
</select>

  <label className="form-label">
  Merokok
</label>

<select
  className="select"
  value={smoking}
  onChange={(e) =>
    setSmoking(e.target.value)
  }
>
  <option value="" disabled hidden></option>

  <option value="yes">
    Ya
  </option>

  <option value="no">
    Tidak
  </option>
</select>

  <label className="form-label">
  Aktivitas Fisik
</label>

<select
  className="select"
  value={activity}
  onChange={(e) =>
    setActivity(e.target.value)
  }
>
  <option value="" disabled hidden></option>

  <option value="rendah">
    Rendah
  </option>

  <option value="sedang">
    Sedang
  </option>

  <option value="tinggi">
    Tinggi
  </option>
</select>

  <button
  className="button analyze-btn"
  onClick={handleAnalyze}
  disabled={loading}
>
  {loading
    ? "⏳ Menganalisis..."
    : "🔍 Analisis Sekarang"}
</button>

          {result && (
  <div className="result-card">

    <div className="result-header">
      <h2>📊 Hasil Analisis NeuroFace</h2>

      <div
        className={`status-badge ${
          result.face_detection_result?.prediction ===
          "HEALTHY"
            ? "safe"
            : "danger"
        }`}
      >
        {
          result.face_detection_result?.prediction ===
          "HEALTHY"
            ? "🟢 Risiko Rendah"
            : "🔴 Risiko Tinggi"
        }
      </div>
    </div>

    <div className="analysis-section">

      <h3>🧠 Random Forest</h3>

      <p className="analysis-result">
        {result.randomforest_result}
      </p>

    </div>

    <div className="analysis-section">

      <h3>😊 Face Detection AI</h3>

      <p className="analysis-result">
        {
          result.face_detection_result
            ?.prediction
        }
      </p>

    </div>

    <div className="confidence-box">

      <div className="confidence-item">

        <span>
          Stroke Probability
        </span>

        <span>
          {(
            result.face_detection_result
              ?.confidence_stroke *
            100
          ).toFixed(2)}
          %
        </span>

      </div>

      <div className="progress">
        <div
          className="progress-red"
          style={{
            width: `${
              (
                result.face_detection_result
                  ?.confidence_stroke *
                100
              ).toFixed(2)
            }%`,
          }}
        ></div>
      </div>

      <div className="confidence-item">

        <span>
          Healthy Probability
        </span>

        <span>
          {(
            result.face_detection_result
              ?.confidence_healthy *
            100
          ).toFixed(2)}
          %
        </span>

      </div>

      <div className="progress">
        <div
          className="progress-green"
          style={{
            width: `${
              (
                result.face_detection_result
                  ?.confidence_healthy *
                100
              ).toFixed(2)
            }%`,
          }}
        ></div>
      </div>

    </div>

    <div className="ai-message">

      <h4>
        🤖 Kesimpulan AI
      </h4>

      <p>
        {
          result.face_detection_result
            ?.message
        }
      </p>

    </div>

    <div className="recommendation-box">

      <div className="medical-disclaimer">
  ⚠️ Hasil ini merupakan prediksi berbasis
  Artificial Intelligence (AI) dan tidak
  menggantikan diagnosis atau pemeriksaan
  medis oleh dokter. Gunakan hasil ini
  sebagai informasi awal untuk membantu
  deteksi dini risiko stroke.
</div>

  <h4>
    💡 Rekomendasi
  </h4>

  {result.face_detection_result?.prediction ===
  "STROKE" ? (

    <ul>
      <li>
        Segera konsultasikan hasil ini
        dengan dokter atau tenaga medis.
      </li>

      <li>
        Lakukan pemeriksaan lanjutan
        untuk memastikan kondisi
        kesehatan Anda.
      </li>

      <li>
        Pantau tekanan darah,
        kadar gula darah,
        dan kesehatan jantung secara rutin.
      </li>

      <li>
        Hindari merokok,
        konsumsi alkohol,
        serta makanan tinggi lemak.
      </li>

      <li>
        Jika mengalami gejala seperti
        wajah mencong, sulit bicara,
        atau kelemahan anggota tubuh,
        segera cari pertolongan medis.
      </li>
    </ul>

  ) : (

    <ul>
      <li>
        Pertahankan pola makan sehat.
      </li>

      <li>
        Rutin berolahraga minimal
        30 menit per hari.
      </li>

      <li>
        Lakukan pemeriksaan kesehatan
        secara berkala.
      </li>

      <li>
        Hindari merokok dan konsumsi
        alkohol berlebih.
      </li>

      <li>
        Pertahankan berat badan ideal
        dan kualitas tidur yang baik.
      </li>
    </ul>

  )}

</div>
  </div>
)}

        </div>
      </div>
    </div>
  );
}