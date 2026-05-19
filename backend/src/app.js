const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : "*",
  credentials: true
}));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: "2mb" }));

app.use("/uploads", express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || "uploads")));

app.get("/health", (_, res) => res.json({ ok: true, app: "SPA do Doguinho API" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/availability", require("./routes/availabilityRoutes"));
app.use("/api/mercadopago", require("./routes/mercadoPagoRoutes"));
app.use("/api", require("./routes/resourceRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

app.use((_, res) => res.status(404).json({ message: "Rota não encontrada" }));

module.exports = app;
