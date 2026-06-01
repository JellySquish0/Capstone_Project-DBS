import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden"
      }}
    >
      <Navbar />

      <iframe
        src="http://localhost:8501"
        title="Stroke Dashboard"
        style={{
          width: "100%",
          height: "calc(100vh - 70px)",
          border: "none"
        }}
      />
    </div>
  );
}