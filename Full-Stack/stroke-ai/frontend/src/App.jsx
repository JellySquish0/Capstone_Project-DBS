import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Home from "./pages/Home";

const ProtectedRoute = ({ children }) => {

  const token =
    localStorage.getItem("token");

  return token
    ? children
    : <Navigate to="/" />;

};

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        {/* LOGIN */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* OPTIONAL LOGIN ROUTE */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ANALYSIS */}
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <Analyze />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;