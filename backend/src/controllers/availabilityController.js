const db = require("../config/db");

const OPEN_HOUR = 8;
const CLOSE_HOUR = 18;
const STEP_MINUTES = 30;

function pad(n) {
  return String(n).padStart(2, "0");
}

function toMinutes(time) {
  const [h, m] = String(time).split(":").map(Number);
  return h * 60 + m;
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function formatDateTime(date, time) {
  return `${date} ${time}:00`;
}

exports.slots = async (req, res) => {
  try {
    const { date, service_id } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "Informe a data em YYYY-MM-DD",
      });
    }

    let duration = 30;

    if (service_id) {
      const [services] = await db.query(
        "SELECT duration_minutes FROM services WHERE id = ?",
        [service_id]
      );

      if (services.length) {
        duration = Number(services[0].duration_minutes || 30);
      }
    }

    const [taken] = await db.query(
      `
      SELECT 
        a.scheduled_at,
        COALESCE(s.duration_minutes, ?) duration_minutes
      FROM appointments a
      LEFT JOIN services s ON s.id = a.service_id
      WHERE DATE(a.scheduled_at) = ?
      AND a.status NOT IN ('canceled', 'cancelado')
      `,
      [duration, date]
    );

    const busyRanges = taken.map((a) => {
      const d = new Date(a.scheduled_at);

      const start =
        d.getHours() * 60 +
        d.getMinutes();

      const busyDuration =
        Number(a.duration_minutes || duration || 30);

      return {
        start,
        end: start + busyDuration,
      };
    });

    const now = new Date();

    const isToday =
      date === now.toISOString().slice(0, 10);

    const slots = [];

    for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
      for (let m = 0; m < 60; m += STEP_MINUTES) {
        const time = `${pad(h)}:${pad(m)}`;

        const start = toMinutes(time);
        const end = start + duration;

        const insideBusinessHours =
          end <= CLOSE_HOUR * 60;

        const alreadyPast =
          isToday &&
          start <= now.getHours() * 60 + now.getMinutes();

        const hasConflict = busyRanges.some((busy) =>
          overlaps(start, end, busy.start, busy.end)
        );

        slots.push({
          time,
          scheduled_at: formatDateTime(date, time),
          available:
            insideBusinessHours &&
            !alreadyPast &&
            !hasConflict,
          duration_minutes: duration,
        });
      }
    }

    return res.json(slots);
  } catch (error) {
    console.error("Erro availability slots:", error);

    return res.status(500).json({
      message: "Erro ao calcular horários",
    });
  }
};
