import { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/login.css";

import {
  register
} from "../services/authServices";

export default function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister =
    async () => {

      try {

        await register(
          name,
          email,
          password
        );

        alert(
          "Registrasi berhasil"
        );

        setName("");
        setEmail("");
        setPassword("");

      } catch (error) {

        alert(
          error.response?.data
            ?.message ||
          "Registrasi gagal"
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
            Daftar Akun
          </h1>

          <p className="login-subtitle">
            Daftar ke akun NeuroFace untuk mengakses dashboard dan hasil analisis.
          </p>

          <input
            type="text"
            placeholder="Nama"
            className="login-input"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            className="login-button"
            onClick={handleRegister}
          >
            Daftar
          </button>

          <p className="login-footer">
            Sudah punya akun?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}