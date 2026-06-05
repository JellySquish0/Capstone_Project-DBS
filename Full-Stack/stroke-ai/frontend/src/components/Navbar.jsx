import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">

      <NavLink to="/dashboard" className="navbar-logo">
        🧠 NeuroFace
      </NavLink>

      <div className="navbar-menu">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "navbar-link active-link"
              : "navbar-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/analysis"
          className={({ isActive }) =>
            isActive
              ? "navbar-link active-link"
              : "navbar-link"
          }
        >
          Analisis
        </NavLink>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
    </nav>
  );
}