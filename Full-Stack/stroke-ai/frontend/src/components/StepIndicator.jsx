export default function StepIndicator() {
  return (
    <div className="steps">

      <div className="step active">
        <div className="circle">1</div>
        <span>Data Pasien</span>
      </div>

      <div className="line"></div>

      <div className="step active">
        <div className="circle">2</div>
        <span>Foto Wajah</span>
      </div>

      <div className="line"></div>

      <div className="step">
        <div className="circle">3</div>
        <span>Hasil</span>
      </div>

    </div>
  );
}