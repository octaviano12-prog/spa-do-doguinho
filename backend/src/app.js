const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Backend SPA do Doguinho online"
  });
});

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

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Erro interno no servidor"
  });
});

module.exports = app;
