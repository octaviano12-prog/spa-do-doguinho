const express = require("express");
const cors = require("cors");
const path = require("path");

const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const customerRoutes = require("./routes/customerRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const cascadeRoutes = require("./routes/cascadeRoutes");
const loyaltyRoutes = require("./routes/loyaltyRoutes");
const upload = require("./middlewares/uploadMiddleware");
const db = require("./config/db");
const { durationForService } = require("./utils/pricing");
const { addMinutes, ensureLoyaltyTables, getLoyaltyBusySlots, hasOverlap } = require("./services/loyaltyService");

const app = express();

function padTime(value) {
  return String(value || "").slice(0, 5);
}

function timeToMinutes(time) {
  const [hour, minute] = padTime(time).split(":").map(Number);
  return (hour || 0) * 60 + (minute || 0);
}

function saoPauloNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(new Date()).reduce((map, part) => {
    map[part.type] = part.value;
    return map;
  }, {});

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour || 0) * 60 + Number(parts.minute || 0)
  };
}

function blockPastCustomerAppointment(req, res, next) {
  if (req.method !== "POST" || req.path !== "/appointments") return next();

  const selectedDate = String(req.body?.date || "").slice(0, 10);
  const selectedTime = padTime(req.body?.time);
  if (!selectedDate || !selectedTime) return next();

  const now = saoPauloNow();
  const isPastDate = selectedDate < now.date;
  const isPastTodaySlot = selectedDate === now.date && timeToMinutes(selectedTime) <= now.minutes;

  if (isPastDate || isPastTodaySlot) {
    return res.status(409).json({
      error: "Este horário já passou. Escolha outro horário disponível ou agende para outro dia."
    });
  }

  return next();
}

async function blockLoyaltyCustomerAppointment(req, res, next) {
  if (req.method !== "POST" || req.path !== "/appointments") return next();

  const selectedDate = String(req.body?.date || "").slice(0, 10);
  const selectedTime = padTime(req.body?.time);
  const serviceId = Number(req.body?.service_id);
  const petId = Number(req.body?.pet_id);

  if (!selectedDate || !selectedTime || !serviceId || !petId) return next();

  try {
    await ensureLoyaltyTables();

    const [[services], [pets]] = await Promise.all([
      db.query(
        `SELECT id, duration_minutes, duration_small, duration_medium, duration_large, duration_giant
         FROM services
         WHERE id = ?
         LIMIT 1`,
        [serviceId]
      ),
      db.query("SELECT id, weight, size_category, estimated_bath_time FROM pets WHERE id = ? LIMIT 1", [petId])
    ]);

    const duration = durationForService(services[0], pets[0]);
    const selectedEnd = addMinutes(selectedTime, duration);
    const busy = await getLoyaltyBusySlots(selectedDate);
    const occupied = busy.some((slot) => hasOverlap(selectedTime, selectedEnd, slot.start, slot.end));

    if (occupied) {
      return res.status(409).json({
        error: "Este horário está reservado para um pacote fidelidade. Escolha outro horário."
      });
    }

    return next();
  } catch (error) {
    console.error("Validar pacote fidelidade no agendamento:", error);
    return next();
  }
}

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
app.use("/api/public", publicRoutes);
app.use("/api/customer", blockPastCustomerAppointment, blockLoyaltyCustomerAppointment, customerRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", cascadeRoutes);
app.use("/api", loyaltyRoutes);
app.use("/api", resourceRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({
    error: "Rota API nao encontrada"
  });
});

/* FRONTEND REACT */
const publicPath = path.join(__dirname, "../../public_html");

app.use("/uploads", express.static(upload.uploadRoot));
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
