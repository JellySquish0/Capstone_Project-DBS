import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <nav className="navbar">

      <Link to="/dashboard" className="navbar-logo">
        🧠 StrokeAI
      </Link>

      <div className="navbar-menu">
        <Link to="/dashboard" className="navbar-link">
          Dashboard
        </Link>

        <Link to="/analysis" className="navbar-link">
          Analisis
        </Link>

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