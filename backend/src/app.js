const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    cwd: process.cwd(),
    dirname: __dirname
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.json({ ok: true, database: "conectado", rows });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/resourceRoutes"));

const frontendPaths = [
  "/home/u953887285/domains/spadodoguinho.com.br/public_html",
  path.join(process.cwd(), "../public_html"),
  path.join(process.cwd(), "../public_html/.builds/source/repository/frontend/dist"),
  path.join(process.cwd(), "frontend/dist"),
  path.join(__dirname, "../../frontend/dist")
];

const frontendPath = frontendPaths.find((p) =>
  fs.existsSync(path.join(p, "index.html"))
);

app.get("/debug-paths", (req, res) => {
  res.json({
    cwd: process.cwd(),
    dirname: __dirname,
    frontendPath,
    tested: frontendPaths.map((p) => ({
      path: p,
      exists: fs.existsSync(p),
      index: fs.existsSync(path.join(p, "index.html"))
    }))
  });
});

if (frontendPath) {
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  app.get("*", (req, res) => {
    res.status(500).json({
      error: "Frontend não encontrado",
      tested: frontendPaths
    });
  });
}

module.exports = app;
