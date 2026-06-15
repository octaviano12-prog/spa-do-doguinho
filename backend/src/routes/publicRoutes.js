const router = require("express").Router();
const db = require("../config/db");
const { durationForService } = require("../utils/pricing");

function padTime(value) {
  return String(value || "").slice(0, 5);
}

function addMinutes(time, minutes) {
  const [hour, minute] = padTime(time).split(":").map(Number);
  const date = new Date(2000, 0, 1, hour || 0, minute || 0, 0);
  date.setMinutes(date.getMinutes() + Number(minutes || 0));
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function timeToMinutes(time) {
  const [hour, minute] = padTime(time).split(":").map(Number);
  return (hour || 0) * 60 + (minute || 0);
}

function hasOverlap(startA, endA, startB, endB) {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(endA) > timeToMinutes(startB);
}

router.get("/services", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM services ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/gallery", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM gallery ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/settings", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM site_settings ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/payment-settings", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT provider, public_key, pix_enabled, card_enabled, cash_enabled, deposit_required, deposit_percent, active
       FROM payment_settings
       WHERE active = 1
       ORDER BY id DESC
       LIMIT 1`
    );

    return res.json(rows[0] || {
      provider: "manual",
      public_key: "",
      pix_enabled: 1,
      card_enabled: 1,
      cash_enabled: 1,
      deposit_required: 0,
      deposit_percent: 0,
      active: 1
    });
  } catch (error) {
    return res.json({
      provider: "manual",
      public_key: "",
      pix_enabled: 1,
      card_enabled: 1,
      cash_enabled: 1,
      deposit_required: 0,
      deposit_percent: 0,
      active: 1
    });
  }
});

router.get("/available-slots", async (req, res) => {
  try {
    const { service_id, date, duration } = req.query;

    if (!service_id || !date) return res.status(400).json({ error: "service_id e date são obrigatórios." });

    const target = new Date(`${date}T00:00:00`);
    if (Number.isNaN(target.getTime())) return res.status(400).json({ error: "Data inválida." });

    const weekday = target.getDay();
    const [blocked] = await db.query("SELECT id, reason FROM blocked_dates WHERE date = ? AND active = 1 LIMIT 1", [date]);
    if (blocked.length) return res.json({ date, blocked: true, reason: blocked[0].reason || "Data bloqueada", slots: [] });

    const [services] = await db.query(
      `SELECT id, duration_minutes, duration_small, duration_medium, duration_large, duration_giant
       FROM services
       WHERE id = ?
       LIMIT 1`,
      [service_id]
    );
    const service = services[0];
    const requestedDuration = Number(duration || 0);
    const finalDuration = requestedDuration > 0 ? requestedDuration : durationForService(service, null);

    const [rules] = await db.query(
      `SELECT * FROM availability WHERE active = 1 AND (weekday = ? OR day_of_week = ?) ORDER BY start_time ASC`,
      [weekday, weekday]
    );

    if (!rules.length) return res.json({ date, blocked: false, reason: "Sem regra de disponibilidade para este dia", slots: [] });

    const [appointments] = await db.query(
      `SELECT a.id, a.time, a.scheduled_at, a.service_id, a.pet_id, a.status,
              s.duration_minutes, s.duration_small, s.duration_medium, s.duration_large, s.duration_giant,
              p.weight, p.size_category, p.estimated_bath_time
       FROM appointments a
       LEFT JOIN services s ON s.id = a.service_id
       LEFT JOIN pets p ON p.id = a.pet_id
       WHERE a.date = ? AND a.status NOT IN ('canceled', 'cancelado')`,
      [date]
    );

    const busy = [];
    for (const appointment of appointments) {
      const appointmentTime = appointment.time ? padTime(appointment.time) : padTime(String(appointment.scheduled_at || "").slice(11, 16));
      if (!appointmentTime) continue;
      const appointmentDuration = durationForService(appointment, appointment);
      busy.push({ start: appointmentTime, end: addMinutes(appointmentTime, appointmentDuration) });
    }

    const slots = [];
    for (const rule of rules) {
      const start = padTime(rule.start_time || "08:00");
      const end = padTime(rule.end_time || "18:00");
      const interval = Number(rule.interval_minutes || 60);
      let current = start;
      while (timeToMinutes(addMinutes(current, finalDuration)) <= timeToMinutes(end)) {
        const slotEnd = addMinutes(current, finalDuration);
        const occupied = busy.some((item) => hasOverlap(current, slotEnd, item.start, item.end));
        if (!occupied) slots.push({ time: current, label: current });
        current = addMinutes(current, interval);
      }
    }

    return res.json({ date, blocked: false, duration: finalDuration, slots });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
