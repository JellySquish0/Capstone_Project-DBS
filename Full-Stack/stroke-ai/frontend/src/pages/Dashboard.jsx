import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#eef4ff",
        padding: "40px 20px 80px"
      }}
    >
      <Navbar />

      <iframe
        src="https://dashboard-production-d32f.up.railway.app"
        title="Stroke Dashboard"
        style={{
          width: "100%",
          height: "calc(100vh - 140px)",
          border: "none",
          borderRadius: "18px",
          marginTop: "20px",
          background: "white"
        }}
      />
    </div>
  );
}