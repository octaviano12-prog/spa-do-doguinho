const db = require("../config/db");

const OPEN_HOUR = 8;
const CLOSE_HOUR = 18;
const STEP_MINUTES = 30;

function pad(n) {
  return String(n).padStart(2, "0");
}

exports.slots = async (req, res) => {
  try {
    const { date, service_id } = req.query;
    if (!date) return res.status(400).json({ message: "Informe a data em YYYY-MM-DD" });

    let duration = 30;
    if (service_id) {
      const [services] = await db.query("SELECT duration_minutes FROM services WHERE id = ?", [service_id]);
      if (services.length) duration = Number(services[0].duration_minutes || 30);
    }

    const [taken] = await db.query(
      "SELECT scheduled_at FROM appointments WHERE DATE(scheduled_at)=? AND status <> 'canceled'",
      [date]
    );
    const busy = new Set(taken.map((a) => new Date(a.scheduled_at).toISOString().slice(11, 16)));

    const slots = [];
    for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
      for (let m = 0; m < 60; m += STEP_MINUTES) {
        const time = `${pad(h)}:${pad(m)}`;
        slots.push({ time, available: !busy.has(time), duration_minutes: duration });
      }
    }
    return res.json(slots);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao calcular horários" });
  }
};
