const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : "*",
  credentials: true
}));

app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false
}));

app.use(express.json({ limit: "2mb" }));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || "uploads"))
);

app.get("/health", (_, res) => {
  res.json({ ok: true, app: "SPA do Doguinho API" });
});
const db = require("./config/db");

app.get("/api/health", async (_, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      error: error.message
    });
  }
});
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/availability", require("./routes/availabilityRoutes"));
app.use("/api/mercadopago", require("./routes/mercadoPagoRoutes"));
app.use("/api/public-booking", require("./routes/publicBooking"));
app.use("/api", require("./routes/resourceRoutes"));
app.use("/api", require("./routes/cascadeRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"))

const frontendPath = path.join(process.cwd(), "../public_html/.builds/source/repository/frontend/dist");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

module.exports = app;
