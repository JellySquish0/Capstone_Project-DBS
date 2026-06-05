import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import { login } from "../services/authServices";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {

  try {

    const response =
  await login(
    email,
    password
  );

localStorage.setItem(
  "token",
  response.token
);

localStorage.setItem(
  "user",
  JSON.stringify(
    response.user
  )
);

navigate("/dashboard");

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Login gagal"
    );

  }

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
            Masuk ke akun NeuroFace untuk mengakses dashboard dan hasil analisis.
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
  Belum punya akun?{" "}
  <Link to="/register">
    Daftar
  </Link>
</p>

        </div>

      </div>
    </div>
  );
}