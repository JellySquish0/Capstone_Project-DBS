import Webcam from "react-webcam";
import { useRef, useState } from "react";
import { predict } from "../services/api";

export default function Analyze() {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [age, setAge] = useState("");
  const [hypertension, setHypertension] = useState("");

  const capture = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
  };

  const getColor = (level) => {
  if (level === "Tinggi") return "red";
  if (level === "Sedang") return "orange";
  return "green";
};

  const handleAnalyze = async () => {
  try {
    const res = await predict({
      image: image,
      age: age,
      hypertension: hypertension,
    });

    setResult(res);
  } catch (err) {
    console.error(err);
    alert("Error kirim ke backend");
  }
};

  return (
  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <h1>Analisis Risiko Stroke</h1>

    <div style={{ marginBottom: "20px" }}>
  <input
    type="number"
    placeholder="Umur"
    value={age}
    onChange={(e) => setAge(e.target.value)}
    style={{ padding: "8px", marginRight: "10px" }}
  />

  <select
    value={hypertension}
    onChange={(e) => setHypertension(e.target.value)}
    style={{ padding: "8px" }}
  >
    <option value="">Hipertensi</option>
    <option value="yes">Ya</option>
    <option value="no">Tidak</option>
  </select>
</div>

    <Webcam
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      width={300}
    />

    <br /><br />

    <button onClick={capture}>Ambil Foto</button>

    <button onClick={handleAnalyze} style={{ marginLeft: "10px" }}>
      Analisis Sekarang
    </button>

    {/* PREVIEW GAMBAR */}
    {image && (
      <div style={{ marginTop: "20px" }}>
        <h3>Hasil Foto:</h3>
        <img src={image} alt="captured" width={300} />
      </div>
    )}

    {/* HASIL ANALISIS */}
    {result && (
      <div style={{
        marginTop: "20px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        width: "300px",
        marginLeft: "auto",
        marginRight: "auto"
      }}>
        <h3>Hasil Analisis</h3>
        <p><b>Risk Level:</b> {result.risk_level}</p>
        <p><b>Score:</b> {result.risk_score}</p>
        <p>{result.message}</p>
        <p style={{ color: getColor(result.risk_level) }}>
  <b>Risk Level:</b> {result.risk_level}
</p>
      </div>
    )}

  </div>
);
}