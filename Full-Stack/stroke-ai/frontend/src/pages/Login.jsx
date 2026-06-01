import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = () => {
  localStorage.setItem("isLoggedIn", "true");
  navigate("/dashboard");
};

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-card">

          <div className="login-icon">
            🧠
          </div>

          <h1 className="login-title">
            Selamat Datang
          </h1>

          <p className="login-subtitle">
            Masuk ke akun StrokeAI untuk mengakses dashboard dan hasil analisis.
          </p>

          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="login-button"
            onClick={handleLogin}
          >
            Masuk
          </button>

          <p className="login-footer">
            Demo Login StrokeAI
          </p>

        </div>

      </div>
    </div>
  );
}