const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// test endpoint
app.get("/", (req, res) => {
  res.send("API jalan 🚀");
});

// endpoint untuk terima image
app.post("/predict", (req, res) => {
  const { image, age, hypertension } = req.body;

  console.log("Umur:", age);
  console.log("Image size:", image?.length);

  console.log("Age:", age);
  console.log("Hypertension:", hypertension);

  res.json({
    risk_score: 0.72,
    risk_level: "Sedang",
    message: "Backend berhasil menerima data",
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});