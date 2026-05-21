const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");

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

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/availability", require("./routes/availabilityRoutes"));
app.use("/api/mercadopago", require("./routes/mercadoPagoRoutes"));
app.use("/api/public-booking", require("./routes/publicBooking"));
app.use("/api", require("./routes/resourceRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"))

const frontendPath = path.resolve(
  process.env.FRONTEND_DIST ||
  path.join(__dirname, "../../frontend/dist")
);

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  const indexFile = path.join(frontendPath, "index.html");

  if (!fs.existsSync(indexFile)) {
    return res.status(404).json({
      message: "Frontend ainda não foi gerado. Rode npm run build na pasta frontend.",
    });
  }

  return res.sendFile(indexFile);
});

module.exports = app;
