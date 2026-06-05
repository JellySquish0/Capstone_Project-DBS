export default function StepIndicator() {
  return (
    <div className="steps">

      <div className="step">
        <div className="circle">1</div>
        <div className="step-label">
          Data Pasien
        </div>
      </div>

      <div className="step-line"></div>

      <div className="step">
        <div className="circle">2</div>
        <div className="step-label">
          Foto Wajah
        </div>
      </div>

      <div className="step-line"></div>

      <div className="step">
        <div className="circle">3</div>
        <div className="step-label">
          Hasil Analisis
        </div>
      </div>

    </div>
  );
}