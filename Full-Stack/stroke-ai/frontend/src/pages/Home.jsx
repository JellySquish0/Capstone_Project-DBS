import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}
      <nav className="home-navbar">

        <div className="logo">
          🧠 NeuroFace
        </div>

        <div className="nav-buttons">

          <Link to="/login">
            <button className="btn-login">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="btn-register">
              Daftar
            </button>
          </Link>

        </div>

      </nav>

      {/* ================= HERO ================= */}
      <section className="hero-section">

        <div className="hero-content">

          <div className="brain-logo">
            🧠
          </div>

          <h1>
            Deteksi Dini Risiko Stroke
            <br />
            Berbasis Artificial Intelligence
          </h1>

          <p>
            NeuroFace membantu melakukan analisis risiko stroke
            menggunakan kombinasi Machine Learning Random Forest,
            Facial Detection AI, dan data kesehatan pasien secara
            cepat, akurat, dan mudah digunakan.
          </p>

          <Link to="/register">
            <button className="hero-button">
              Mulai Sekarang
            </button>
          </Link>

        </div>

      </section>

      {/* ================= STATS ================= */}
      <section className="stats">

        <div className="stat-card">
          <h2>95%</h2>
          <p>Akurasi Prediksi AI</p>
        </div>

        <div className="stat-card">
          <h2>2 AI</h2>
          <p>Random Forest & Face Detection</p>
        </div>

        <div className="stat-card">
          <h2>24/7</h2>
          <p>Analisis Otomatis</p>
        </div>

        <div className="stat-card">
          <h2>100%</h2>
          <p>Berbasis Data Kesehatan</p>
        </div>

      </section>

      {/* ================= FEATURES ================= */}
      <section className="features">

        <h2>Fitur Unggulan</h2>

        <div className="feature-grid">

          <div className="feature-card">

            <h3>🤖 AI Prediction</h3>

            <p>
              Prediksi risiko stroke menggunakan model
              Machine Learning Random Forest yang telah
              dilatih menggunakan dataset kesehatan.
            </p>

          </div>

          <div className="feature-card">

            <h3>📸 Face Detection AI</h3>

            <p>
              Analisis kondisi wajah pasien menggunakan
              teknologi Computer Vision untuk membantu
              mendeteksi indikasi stroke.
            </p>

          </div>

          <div className="feature-card">

            <h3>📊 Dashboard Analytics</h3>

            <p>
              Menampilkan hasil analisis secara visual,
              informatif, dan mudah dipahami oleh pengguna.
            </p>

          </div>

        </div>

      </section>

      {/* ================= WORKFLOW ================= */}
      <section className="workflow">

        <h2>Cara Kerja NeuroFace</h2>

        <div className="steps">

          <div className="step">

            <span>1</span>

            <h4>Registrasi</h4>

            <p>
              Buat akun baru untuk mulai
              menggunakan sistem.
            </p>

          </div>

          <div className="step">

            <span>2</span>

            <h4>Input Data</h4>

            <p>
              Masukkan data kesehatan
              sesuai kondisi pasien.
            </p>

          </div>

          <div className="step">

            <span>3</span>

            <h4>Upload Foto</h4>

            <p>
              Unggah foto wajah pasien
              untuk analisis visual.
            </p>

          </div>

          <div className="step">

            <span>4</span>

            <h4>Hasil AI</h4>

            <p>
              Sistem menampilkan hasil
              prediksi dan analisis.
            </p>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="cta">

        <h2>
          Mulai Analisis Risiko Stroke Sekarang
        </h2>

        <p>
          Daftar akun gratis dan manfaatkan
          teknologi Artificial Intelligence
          untuk membantu deteksi dini risiko stroke.
        </p>

        <Link to="/register">

          <button className="cta-button">
            Daftar Gratis
          </button>

        </Link>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">

        <p>
          © 2026 NeuroFace | Capstone Project DBS Foundation
        </p>

      </footer>

    </div>
  );
}