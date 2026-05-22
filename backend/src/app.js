const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    app: "SPA do Doguinho API funcionando"
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
      error: error.message
    });
  }
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/resourceRoutes"));

const frontendPath = path.join(process.cwd(), "../public_html");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

module.exports = app;
