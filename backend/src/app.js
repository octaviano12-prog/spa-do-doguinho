const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, app: "SPA do Doguinho API funcionando" });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "API funcionando"
  });
});

module.exports = app;
