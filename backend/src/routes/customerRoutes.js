const router = require("express").Router();

const db = require("../config/db");
const customerAuth = require("../middlewares/customerAuth");
const { createPixPayment } = require("../services/mercadoPagoService");
const { durationForService, estimatedBathTime, priceForService, sizeForDatabase } = require("../utils/pricing");

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

function normalizeMethod(method) {
  const value = String(method || "presencial").toLowerCase();
  if (["pix", "card", "presencial"].includes(value)) return value;
  return "presencial";
}

function paymentMethodAllowed(method, settings) {
  if (method === "pix") return Number(settings.pix_enabled ?? 1) === 1;
  if (method === "card") return Number(settings.card_enabled ?? 1) === 1;
  if (method === "presencial") return Number(settings.cash_enabled ?? 1) === 1;
  return false;
}

function calculatePaymentAmount(price, settings) {
  const fullPrice = Number(price || 0);
  if (Number(settings.deposit_required || 0) === 1 && Number(settings.deposit_percent || 0) > 0) {
    return Number(((fullPrice * Number(settings.deposit_percent || 0)) / 100).toFixed(2));
  }
  return fullPrice;
}

function placeholders(items) {
  return items.map(() => "?").join(",");
}

function groupBy(items, key) {
  return items.reduce((map, item) => {
    const value = item[key];
    if (value === undefined || value === null) return map;
    const id = Number(value);
    if (!map.has(id)) map.set(id, []);
    map.get(id).push(item);
    return map;
  }, new Map());
}

async function optionalQuery(sql, params, label) {
  try {
    const [rows] = await db.query(sql, params);
    return rows;
  } catch (error) {
    console.warn(`Nao foi possivel carregar ${label}:`, error.message);
    return [];
  }
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
    const { name, species, breed, age, weight, notes, size_category, estimated_bath_time } = req.body || {};
    if (!name) return res.status(400).json({ error: "Informe o nome do pet." });

    const finalSize = sizeForDatabase(size_category, weight);
    const finalBathTime = Number(estimated_bath_time || 0) || estimatedBathTime(finalSize);

    const [result] = await db.query(
      "INSERT INTO pets (customer_id, name, species, breed, age, weight, size_category, estimated_bath_time, notes, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)",
      [req.customer.id, name, species || "Cachorro", breed || null, age || null, weight || null, finalSize, finalBathTime, notes || null]
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

    if (!pet_id) {
      await connection.rollback();
      return res.status(400).json({ error: "Escolha ou cadastre um pet antes de agendar." });
    }

    const [settingsRows] = await connection.query("SELECT * FROM payment_settings WHERE active = 1 ORDER BY id DESC LIMIT 1");
    const paymentSettings = settingsRows[0] || { pix_enabled: 1, card_enabled: 1, cash_enabled: 1, deposit_required: 0, deposit_percent: 0 };
    const normalizedPaymentMethod = normalizeMethod(payment_method);

    if (!paymentMethodAllowed(normalizedPaymentMethod, paymentSettings)) {
      await connection.rollback();
      return res.status(400).json({ error: "Forma de pagamento indisponível no momento." });
    }

    const [customers] = await connection.query("SELECT id, name, email FROM customers WHERE id = ? LIMIT 1", [req.customer.id]);
    const customer = customers[0];

    const [services] = await connection.query(
      `SELECT id, name, price, duration_minutes, price_small, price_medium, price_large, price_giant,
              duration_small, duration_medium, duration_large, duration_giant
       FROM services
       WHERE id = ?
       LIMIT 1`,
      [service_id]
    );
    const service = services[0];

    if (!service) {
      await connection.rollback();
      return res.status(404).json({ error: "Serviço não encontrado." });
    }

    const [pets] = await connection.query(
      "SELECT id, name, weight, size_category, estimated_bath_time FROM pets WHERE id = ? AND customer_id = ? LIMIT 1",
      [pet_id, req.customer.id]
    );

    if (!pets.length) {
      await connection.rollback();
      return res.status(403).json({ error: "Pet não pertence ao cliente." });
    }

    const petRecord = pets[0];
    const finalPetName = petRecord.name || pet_name || null;
    const calculatedPrice = priceForService(service, petRecord);
    const duration = durationForService(service, petRecord);
    const startTime = padTime(time);
    const endTime = addMinutes(startTime, duration);

    const [blocked] = await connection.query("SELECT id, reason FROM blocked_dates WHERE date = ? AND active = 1 LIMIT 1", [date]);
    if (blocked.length) {
      await connection.rollback();
      return res.status(409).json({ error: blocked[0].reason || "Esta data está bloqueada." });
    }

    const [existingAppointments] = await connection.query(
      `SELECT a.id, a.time, a.scheduled_at, a.service_id, a.pet_id,
              s.duration_minutes, s.duration_small, s.duration_medium, s.duration_large, s.duration_giant,
              p.weight, p.size_category, p.estimated_bath_time
       FROM appointments a
       LEFT JOIN services s ON s.id = a.service_id
       LEFT JOIN pets p ON p.id = a.pet_id
       WHERE a.date = ? AND a.status NOT IN ('canceled', 'cancelado')
       FOR UPDATE`,
      [date]
    );

    for (const item of existingAppointments) {
      const otherStart = item.time ? padTime(item.time) : padTime(String(item.scheduled_at || "").slice(11, 16));
      if (!otherStart) continue;
      const otherDuration = durationForService(item, item);
      const otherEnd = addMinutes(otherStart, otherDuration);
      if (hasOverlap(startTime, endTime, otherStart, otherEnd)) {
        await connection.rollback();
        return res.status(409).json({ error: "Este horário acabou de ser ocupado. Escolha outro horário." });
      }
    }

    const scheduledAt = `${date} ${startTime}:00`;
    const paymentAmount = calculatePaymentAmount(calculatedPrice, paymentSettings);
    const isDeposit = Number(paymentSettings.deposit_required || 0) === 1;
    const paymentDescriptionPrefix = isDeposit ? "Sinal do agendamento #" : "Pagamento do agendamento #";

    const [result] = await connection.query(
      `INSERT INTO appointments
      (customer_id, pet_id, service_id, customer_name, pet_name, service_name, scheduled_at, date, time, status, payment_method, payment_status, price, notes, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 'pending', ?, ?, 1)`,
      [req.customer.id, petRecord.id, service.id, customer?.name || null, finalPetName, service.name, scheduledAt, date, startTime, normalizedPaymentMethod, calculatedPrice, notes || null]
    );

    const appointmentId = result.insertId;
    let pixData = null;
    let mercadoPagoId = null;
    let qrCode = null;
    let qrCodeBase64 = null;

    if (normalizedPaymentMethod === "pix" && paymentSettings.access_token) {
      pixData = await createPixPayment({
        accessToken: paymentSettings.access_token,
        amount: paymentAmount,
        description: `${paymentDescriptionPrefix}${appointmentId}`,
        payerEmail: customer?.email,
        payerName: customer?.name,
        externalReference: appointmentId
      });
      mercadoPagoId = pixData?.mercado_pago_id || null;
      qrCode = pixData?.qr_code || null;
      qrCodeBase64 = pixData?.qr_code_base64 || null;
    }

    await connection.query(
      `INSERT INTO payments (appointment_id, customer_id, amount, method, status, description, notes, mercado_pago_id, external_reference, qr_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [appointmentId, req.customer.id, paymentAmount, normalizedPaymentMethod, pixData?.status || "pending", `${paymentDescriptionPrefix}${appointmentId}`, notes || null, mercadoPagoId, String(appointmentId), qrCode]
    );

    const [rows] = await connection.query("SELECT * FROM appointments WHERE id = ? LIMIT 1", [appointmentId]);
    await connection.commit();

    return res.status(201).json({
      ...rows[0],
      payment: {
        amount: paymentAmount,
        method: normalizedPaymentMethod,
        status: pixData?.status || "pending",
        mercado_pago_id: mercadoPagoId,
        qr_code: qrCode,
        qr_code_base64: qrCodeBase64,
        ticket_url: pixData?.ticket_url || null
      }
    });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

router.get("/pet-records", async (req, res) => {
  try {
    const [pets] = await db.query("SELECT * FROM pets WHERE customer_id = ? ORDER BY id DESC", [req.customer.id]);
    if (!pets.length) return res.json([]);

    const petIds = pets.map((pet) => pet.id);
    const petPlaceholders = placeholders(petIds);

    const appointments = await optionalQuery(
      `SELECT a.*, COALESCE(s.name, a.service_name) AS service_name
       FROM appointments a
       LEFT JOIN services s ON s.id = a.service_id
       WHERE a.customer_id = ? AND a.pet_id IN (${petPlaceholders})
       ORDER BY a.scheduled_at DESC, a.date DESC, a.time DESC, a.id DESC`,
      [req.customer.id, ...petIds],
      "agendamentos por pet"
    );

    const appointmentIds = appointments.map((item) => item.id).filter(Boolean);
    let payments = [];

    if (appointmentIds.length) {
      payments = await optionalQuery(
        `SELECT pay.*, a.pet_id, COALESCE(s.name, a.service_name) AS service_name, a.date, a.time, a.scheduled_at
         FROM payments pay
         LEFT JOIN appointments a ON a.id = pay.appointment_id
         LEFT JOIN services s ON s.id = a.service_id
         WHERE pay.customer_id = ? AND pay.appointment_id IN (${placeholders(appointmentIds)})
         ORDER BY pay.id DESC`,
        [req.customer.id, ...appointmentIds],
        "pagamentos por pet"
      );
    }

    const vaccinationRows = await optionalQuery(
      `SELECT v.id, v.pet_id, v.vaccine_name, v.date, v.next_dose_date, v.notes, v.created_at, 'vaccinations' AS source_table
       FROM vaccinations v
       INNER JOIN pets p ON p.id = v.pet_id
       WHERE p.customer_id = ? AND v.pet_id IN (${petPlaceholders})
       ORDER BY v.next_dose_date ASC, v.date DESC, v.id DESC`,
      [req.customer.id, ...petIds],
      "vacinas por pet"
    );

    const legacyVaccines = await optionalQuery(
      `SELECT v.id, v.pet_id, v.name AS vaccine_name, v.applied_at AS date, v.next_due AS next_dose_date, v.notes, v.created_at, 'vaccines' AS source_table
       FROM vaccines v
       INNER JOIN pets p ON p.id = v.pet_id
       WHERE p.customer_id = ? AND v.pet_id IN (${petPlaceholders})
       ORDER BY v.next_due ASC, v.applied_at DESC, v.id DESC`,
      [req.customer.id, ...petIds],
      "vacinas legadas por pet"
    );

    const serviceHistory = await optionalQuery(
      `SELECT h.*, COALESCE(s.name, a.service_name) AS service_name
       FROM service_history h
       INNER JOIN pets p ON p.id = h.pet_id
       LEFT JOIN services s ON s.id = h.service_id
       LEFT JOIN appointments a ON a.id = h.appointment_id
       WHERE p.customer_id = ? AND h.pet_id IN (${petPlaceholders})
       ORDER BY h.date DESC, h.id DESC`,
      [req.customer.id, ...petIds],
      "historico por pet"
    );

    const appointmentsByPet = groupBy(appointments, "pet_id");
    const paymentsByPet = groupBy(payments, "pet_id");
    const vaccinationsByPet = groupBy([...vaccinationRows, ...legacyVaccines], "pet_id");
    const historyByPet = groupBy(serviceHistory, "pet_id");

    const records = pets.map((pet) => {
      const petId = Number(pet.id);
      const petAppointments = appointmentsByPet.get(petId) || [];
      const savedHistory = historyByPet.get(petId) || [];
      const fallbackHistory = petAppointments.map((appointment) => ({
        id: `appointment-${appointment.id}`,
        pet_id: appointment.pet_id,
        service_id: appointment.service_id,
        appointment_id: appointment.id,
        date: appointment.scheduled_at || appointment.date,
        professional: "SPA do Doguinho",
        service_name: appointment.service_name,
        notes: appointment.notes || "Registro gerado pelo agendamento.",
        status: appointment.status
      }));

      return {
        ...pet,
        appointments: petAppointments,
        payments: paymentsByPet.get(petId) || [],
        vaccinations: vaccinationsByPet.get(petId) || [],
        service_history: savedHistory.length ? savedHistory : fallbackHistory
      };
    });

    return res.json(records);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
