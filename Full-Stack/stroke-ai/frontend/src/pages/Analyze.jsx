import Webcam from "react-webcam";
import { useRef, useState } from "react";
import { predict } from "../services/api";
import "../styles/analyze.css";
import Navbar from "../components/Navbar";
import StepIndicator from "../components/StepIndicator";

export default function Analyze() {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const [age, setAge] = useState("");
  const [hypertension, setHypertension] = useState("");
  const [gender, setGender] = useState("");
  const [diabetes, setDiabetes] = useState("");
  const [smoking, setSmoking] = useState("");
  const [activity, setActivity] = useState("");

  // Ambil foto dari webcam
  const capture = () => {
    const screenshot = webcamRef.current.getScreenshot();

    if (screenshot) {
      setImage(screenshot);
    }
  };

  // Upload foto dari device
  const handleUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const getColor = (level) => {
    if (level === "Tinggi") return "#ef4444";
    if (level === "Sedang") return "#f59e0b";
    return "#22c55e";
  };

  const handleAnalyze = async () => {
    if (!image) {
      alert("Silakan ambil atau upload foto terlebih dahulu.");
      return;
    }

    try {
      const res = await predict({
        image,
        age,
        hypertension,
        gender,
        diabetes,
        smoking,
        activity,
      });

      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Error kirim ke backend");
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
    Lengkapi data kesehatan dan ambil foto wajah untuk memulai analisis.
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
            Posisikan wajah di dalam area oval untuk hasil analisis yang lebih akurat
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
              onClick={() => fileInputRef.current.click()}
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

              <h4>Preview Foto Terpilih</h4>

              <img
                src={image}
                alt="preview"
                className="preview"
              />

              <button
                className="button-secondary"
                onClick={() => setImage(null)}
              >
                Hapus Foto
              </button>

            </div>
          )}

        </div>

        {/* CARD DATA PASIEN */}
        <div className="card form-card">

          <h2 className="card-title">
            Data Pasien
          </h2>

          <input
            className="input"
            type="number"
            placeholder="Umur"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <select
            className="select"
            value={hypertension}
            onChange={(e) => setHypertension(e.target.value)}
          >
            <option value="">Hipertensi</option>
            <option value="yes">Ya</option>
            <option value="no">Tidak</option>
          </select>

          <select
            className="select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Jenis Kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>

          <select
            className="select"
            value={diabetes}
            onChange={(e) => setDiabetes(e.target.value)}
          >
            <option value="">Diabetes</option>
            <option value="yes">Ya</option>
            <option value="no">Tidak</option>
          </select>

          <select
            className="select"
            value={smoking}
            onChange={(e) => setSmoking(e.target.value)}
          >
            <option value="">Merokok</option>
            <option value="yes">Ya</option>
            <option value="no">Tidak</option>
          </select>

          <select
            className="select"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            <option value="">Aktivitas Fisik</option>
            <option value="rendah">Rendah</option>
            <option value="sedang">Sedang</option>
            <option value="tinggi">Tinggi</option>
          </select>

          <button
            className="button analyze-btn"
            onClick={handleAnalyze}
          >
            Analisis Sekarang
          </button>

          {result && (
  <div className="result-card">

    <h2>📊 Hasil Analisis</h2>

    <div className="risk-circle">
      {result.risk_score}%
    </div>

    <h3
      style={{
        color: getColor(result.risk_level)
      }}
    >
      Risiko {result.risk_level}
    </h3>

    <p className="result-message">
      {result.message}
    </p>

    <div className="recommendation-box">
      <h4>Faktor Risiko</h4>

      <ul>
        {hypertension === "yes" && <li>Hipertensi</li>}
        {diabetes === "yes" && <li>Diabetes</li>}
        {smoking === "yes" && <li>Merokok</li>}
        {activity === "rendah" && <li>Aktivitas Fisik Rendah</li>}
        {Number(age) > 50 && <li>Usia di atas 50 tahun</li>}
      </ul>

      <h4>Rekomendasi</h4>

      <p>
        Jaga pola makan sehat, rutin berolahraga,
        kontrol tekanan darah, dan lakukan
        pemeriksaan kesehatan secara berkala.
      </p>
    </div>

  </div>
)}

        </div>

      </div>
    </div>
  );
}