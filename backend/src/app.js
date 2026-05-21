const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, app: "SPA do Doguinho API funcionando" });
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
      error: error.message
    });
  }
});

module.exports = app;
