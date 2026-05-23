const express = require("express");
const cors = require("cors");
const path = require("path");

const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

/* API */
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");

    res.json({
      ok: true,
      database: "conectado",
      rows
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      database: "erro",
      error: error.message
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api", resourceRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({
    error: "Rota API não encontrada"
  });
});

/* FRONTEND REACT */
const publicPath = path.join(__dirname, "../../public_html");

app.use(express.static(publicPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

/* ERRO */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Erro interno no servidor"
  });
});

module.exports = app;
