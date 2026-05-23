const router = require("express").Router();

const db = require("../config/db");
const customerAuth = require("../middlewares/customerAuth");

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

function paymentStatusFor(method) {
  const normalized = String(method || "presencial").toLowerCase();
  if (normalized === "presencial") return "pending";
  if (normalized === "pix") return "pending";
  if (normalized === "card") return "pending";
  return "pending";
}

router.use(customerAuth);

router.get("/me", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, phone, created_at FROM customers WHERE id = ? LIMIT 1", [req.customer.id]);
    return res.json(rows[0] || null);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/pets", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pets WHERE customer_id = ? ORDER BY id DESC", [req.customer.id]);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/pets", async (req, res) => {
  try {
    const { name, species, breed, age, weight, notes } = req.body || {};
    if (!name) return res.status(400).json({ error: "Informe o nome do pet." });

    const [result] = await db.query(
      "INSERT INTO pets (customer_id, name, species, breed, age, weight, notes, active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)",
      [req.customer.id, name, species || "Cachorro", breed || null, age || null, weight || null, notes || null]
    );

    const [rows] = await db.query("SELECT * FROM pets WHERE id = ? LIMIT 1", [result.insertId]);
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/appointments", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM appointments WHERE customer_id = ? ORDER BY id DESC", [req.customer.id]);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/appointments", async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { pet_id, pet_name, service_id, date, time, payment_method, notes } = req.body || {};

    if (!service_id || !date || !time) {
      await connection.rollback();
      return res.status(400).json({ error: "Serviço, data e horário são obrigatórios." });
    }

    const [customers] = await connection.query("SELECT id, name FROM customers WHERE id = ? LIMIT 1", [req.customer.id]);
    const customer = customers[0];

    const [services] = await connection.query("SELECT id, name, price, duration_minutes FROM services WHERE id = ? LIMIT 1", [service_id]);
    const service = services[0];

    if (!service) {
      await connection.rollback();
      return res.status(404).json({ error: "Serviço não encontrado." });
    }

    const duration = Number(service.duration_minutes || 60);
    const startTime = padTime(time);
    const endTime = addMinutes(startTime, duration);

    const [blocked] = await connection.query("SELECT id, reason FROM blocked_dates WHERE date = ? AND active = 1 LIMIT 1", [date]);
    if (blocked.length) {
      await connection.rollback();
      return res.status(409).json({ error: blocked[0].reason || "Esta data está bloqueada." });
    }

    const [existingAppointments] = await connection.query(
      `SELECT id, time, service_id FROM appointments WHERE date = ? AND status NOT IN ('canceled', 'cancelado') FOR UPDATE`,
      [date]
    );

    for (const item of existingAppointments) {
      const otherStart = padTime(item.time);
      if (!otherStart) continue;

      let otherDuration = 60;
      if (item.service_id) {
        const [otherServices] = await connection.query("SELECT duration_minutes FROM services WHERE id = ? LIMIT 1", [item.service_id]);
        otherDuration = Number(otherServices[0]?.duration_minutes || 60);
      }

      const otherEnd = addMinutes(otherStart, otherDuration);
      if (hasOverlap(startTime, endTime, otherStart, otherEnd)) {
        await connection.rollback();
        return res.status(409).json({ error: "Este horário acabou de ser ocupado. Escolha outro horário." });
      }
    }

    let finalPetName = pet_name || null;
    if (pet_id) {
      const [pets] = await connection.query("SELECT id, name FROM pets WHERE id = ? AND customer_id = ? LIMIT 1", [pet_id, req.customer.id]);
      if (!pets.length) {
        await connection.rollback();
        return res.status(403).json({ error: "Pet não pertence ao cliente." });
      }
      finalPetName = pets[0].name;
    }

    const normalizedPaymentMethod = payment_method || "presencial";
    const scheduledAt = `${date} ${startTime}:00`;

    const [result] = await connection.query(
      `INSERT INTO appointments
      (customer_id, pet_id, service_id, customer_name, pet_name, service_name, scheduled_at, date, time, status, payment_method, payment_status, price, notes, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 'pending', ?, ?, 1)`,
      [req.customer.id, pet_id || null, service.id, customer?.name || null, finalPetName, service.name, scheduledAt, date, startTime, normalizedPaymentMethod, service.price || 0, notes || null]
    );

    const appointmentId = result.insertId;

    await connection.query(
      `INSERT INTO payments (appointment_id, customer_id, amount, method, status, description, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [appointmentId, req.customer.id, service.price || 0, normalizedPaymentMethod, paymentStatusFor(normalizedPaymentMethod), `Pagamento do agendamento #${appointmentId}`, notes || null]
    );

    const [rows] = await connection.query("SELECT * FROM appointments WHERE id = ? LIMIT 1", [appointmentId]);
    await connection.commit();
    return res.status(201).json(rows[0]);
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

router.get("/payments", async (req, res) => {
  try {
    const [appointments] = await db.query("SELECT id FROM appointments WHERE customer_id = ?", [req.customer.id]);
    if (!appointments.length) return res.json([]);

    const ids = appointments.map((item) => item.id);
    const placeholders = ids.map(() => "?").join(",");
    const [rows] = await db.query(`SELECT * FROM payments WHERE appointment_id IN (${placeholders}) ORDER BY id DESC`, ids);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
