const router = require("express").Router();

const db = require("../config/db");
const auth = require("../middlewares/auth");
const { durationForService } = require("../utils/pricing");
const {
  addMinutes,
  ensureLoyaltyTables,
  getLoyaltyBusySlots,
  hasOverlap,
  padTime
} = require("../services/loyaltyService");

function moneyNumber(value) {
  return Number(String(value || 0).replace(",", ".")) || 0;
}

function normalizeStatus(value, fallback = "active") {
  const text = String(value || fallback).trim().toLowerCase();
  const map = {
    ativo: "active",
    active: "active",
    inativo: "inactive",
    inactive: "inactive",
    cancelado: "canceled",
    canceled: "canceled",
    cancelled: "canceled"
  };
  return map[text] || fallback;
}

function normalizePaymentStatus(value) {
  const text = String(value || "pending").trim().toLowerCase();
  if (["paid", "pago", "approved", "aprovado"].includes(text)) return "paid";
  if (["canceled", "cancelado", "cancelled"].includes(text)) return "canceled";
  return "pending";
}

function normalizePaymentMethod(value) {
  const text = String(value || "cash").trim().toLowerCase();
  const map = {
    pix: "pix",
    dinheiro: "cash",
    cash: "cash",
    cartao: "card",
    cartão: "card",
    card: "card",
    presencial: "cash"
  };
  return map[text] || "cash";
}

function todaySaoPaulo() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date()).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

async function validateBaseData(customerId, petId, serviceId) {
  const [[customers], [pets], [services]] = await Promise.all([
    db.query("SELECT id, name, phone, email FROM customers WHERE id = ? LIMIT 1", [customerId]),
    db.query("SELECT id, name, customer_id, weight, size_category, estimated_bath_time FROM pets WHERE id = ? LIMIT 1", [petId]),
    db.query(
      `SELECT id, name, price, duration_minutes, price_small, price_medium, price_large, price_giant,
              duration_small, duration_medium, duration_large, duration_giant
       FROM services
       WHERE id = ?
       LIMIT 1`,
      [serviceId]
    )
  ]);

  const customer = customers[0];
  const pet = pets[0];
  const service = services[0];

  if (!customer) return { error: "Cliente não encontrado." };
  if (!pet) return { error: "Pet não encontrado." };
  if (Number(pet.customer_id) !== Number(customerId)) return { error: "Este pet não pertence ao cliente selecionado." };
  if (!service) return { error: "Serviço não encontrado." };

  return { customer, pet, service };
}

function normalizeSlots(slots) {
  const list = Array.isArray(slots) ? slots : [];
  return list
    .map((slot) => ({
      date: String(slot.date || "").slice(0, 10),
      time: padTime(slot.time),
      notes: slot.notes || null
    }))
    .filter((slot) => slot.date && slot.time);
}

async function assertSlotsAvailable(slots, durationMinutes) {
  const today = todaySaoPaulo();

  for (const slot of slots) {
    if (slot.date < today) {
      return `A data ${slot.date} já passou.`;
    }

    const slotStart = padTime(slot.time);
    const slotEnd = addMinutes(slotStart, durationMinutes);

    const [blockedDates] = await db.query("SELECT id, reason FROM blocked_dates WHERE date = ? AND active = 1 LIMIT 1", [slot.date]);
    if (blockedDates.length) return blockedDates[0].reason || `A data ${slot.date} está bloqueada.`;

    const [appointments] = await db.query(
      `SELECT a.id, a.time, a.scheduled_at, a.service_id, a.pet_id,
              s.duration_minutes, s.duration_small, s.duration_medium, s.duration_large, s.duration_giant,
              p.weight, p.size_category, p.estimated_bath_time
       FROM appointments a
       LEFT JOIN services s ON s.id = a.service_id
       LEFT JOIN pets p ON p.id = a.pet_id
       WHERE a.date = ? AND a.status NOT IN ('canceled', 'cancelado')`,
      [slot.date]
    );

    for (const appointment of appointments) {
      const otherStart = appointment.time ? padTime(appointment.time) : padTime(String(appointment.scheduled_at || "").slice(11, 16));
      if (!otherStart) continue;
      const otherEnd = addMinutes(otherStart, durationForService(appointment, appointment));
      if (hasOverlap(slotStart, slotEnd, otherStart, otherEnd)) {
        return `O horário ${slotStart} em ${slot.date} já está ocupado por um agendamento.`;
      }
    }

    const loyaltyBusy = await getLoyaltyBusySlots(slot.date);
    const occupiedByPackage = loyaltyBusy.some((item) => hasOverlap(slotStart, slotEnd, item.start, item.end));
    if (occupiedByPackage) return `O horário ${slotStart} em ${slot.date} já está reservado por outro pacote.`;
  }

  return "";
}

router.use(auth);

router.get("/loyaltyPackages", async (req, res) => {
  try {
    await ensureLoyaltyTables();

    const [packages] = await db.query(
      `SELECT pkg.*, c.name AS customer_name, c.phone AS customer_phone, p.name AS pet_name, s.name AS service_name
       FROM loyalty_packages pkg
       LEFT JOIN customers c ON c.id = pkg.customer_id
       LEFT JOIN pets p ON p.id = pkg.pet_id
       LEFT JOIN services s ON s.id = pkg.service_id
       ORDER BY pkg.id DESC`
    );

    const packageIds = packages.map((item) => item.id);
    let slots = [];
    if (packageIds.length) {
      const placeholders = packageIds.map(() => "?").join(",");
      const [slotRows] = await db.query(
        `SELECT * FROM loyalty_package_slots WHERE package_id IN (${placeholders}) ORDER BY date ASC, time ASC, id ASC`,
        packageIds
      );
      slots = slotRows;
    }

    const slotsByPackage = slots.reduce((map, slot) => {
      const id = Number(slot.package_id);
      if (!map.has(id)) map.set(id, []);
      map.get(id).push(slot);
      return map;
    }, new Map());

    return res.json(packages.map((item) => ({ ...item, slots: slotsByPackage.get(Number(item.id)) || [] })));
  } catch (error) {
    console.error("Listar pacotes fidelidade:", error);
    return res.status(500).json({ error: "Erro ao carregar pacotes fidelidade.", detail: error.message });
  }
});

router.post("/loyaltyPackages", async (req, res) => {
  const connection = await db.getConnection();

  try {
    await ensureLoyaltyTables();

    const customerId = Number(req.body?.customer_id);
    const petId = Number(req.body?.pet_id);
    const serviceId = Number(req.body?.service_id);
    const slots = normalizeSlots(req.body?.slots);
    const price = moneyNumber(req.body?.price);
    const paymentMethod = normalizePaymentMethod(req.body?.payment_method);
    const paymentStatus = normalizePaymentStatus(req.body?.payment_status);
    const status = normalizeStatus(req.body?.status, "active");

    if (!customerId || !petId || !serviceId) return res.status(400).json({ error: "Selecione cliente, pet e serviço." });
    if (!slots.length) return res.status(400).json({ error: "Adicione pelo menos uma data e horário para o pacote." });
    if (price <= 0) return res.status(400).json({ error: "Informe o preço do pacote." });

    const base = await validateBaseData(customerId, petId, serviceId);
    if (base.error) return res.status(400).json({ error: base.error });

    const durationMinutes = Number(req.body?.duration_minutes || 0) || durationForService(base.service, base.pet);
    const availabilityError = await assertSlotsAvailable(slots, durationMinutes);
    if (availabilityError) return res.status(409).json({ error: availabilityError });

    await connection.beginTransaction();

    const startDate = slots.reduce((min, slot) => !min || slot.date < min ? slot.date : min, "");
    const endDate = slots.reduce((max, slot) => !max || slot.date > max ? slot.date : max, "");
    const packageName = req.body?.name || `Pacote ${base.service.name} - ${base.pet.name}`;

    const [packageResult] = await connection.query(
      `INSERT INTO loyalty_packages
       (customer_id, pet_id, service_id, name, price, payment_method, payment_status, status, notes, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customerId, petId, serviceId, packageName, price, paymentMethod, paymentStatus, status, req.body?.notes || null, startDate, endDate]
    );

    const packageId = packageResult.insertId;
    for (const slot of slots) {
      await connection.query(
        `INSERT INTO loyalty_package_slots
         (package_id, customer_id, pet_id, service_id, date, time, duration_minutes, status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'reserved', ?)`,
        [packageId, customerId, petId, serviceId, slot.date, `${slot.time}:00`, durationMinutes, slot.notes || null]
      );
    }

    await connection.query(
      `INSERT INTO payments (appointment_id, customer_id, amount, method, status, description, paid_at, notes, external_reference)
       VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        price,
        paymentMethod,
        paymentStatus,
        `Pacote fidelidade #${packageId} - ${packageName}`,
        paymentStatus === "paid" ? new Date() : null,
        req.body?.notes || null,
        `loyalty-package-${packageId}`
      ]
    );

    await connection.commit();

    const [rows] = await db.query("SELECT * FROM loyalty_packages WHERE id = ? LIMIT 1", [packageId]);
    return res.status(201).json(rows[0]);
  } catch (error) {
    await connection.rollback();
    console.error("Criar pacote fidelidade:", error);
    return res.status(500).json({ error: "Erro ao criar pacote fidelidade.", detail: error.message });
  } finally {
    connection.release();
  }
});

router.patch("/loyaltyPackages/:id/status", async (req, res) => {
  try {
    await ensureLoyaltyTables();
    const packageId = Number(req.params.id);
    const status = normalizeStatus(req.body?.status, "active");

    if (!packageId) return res.status(400).json({ error: "Pacote inválido." });

    await db.query("UPDATE loyalty_packages SET status = ? WHERE id = ?", [status, packageId]);
    if (status === "canceled" || status === "inactive") {
      await db.query("UPDATE loyalty_package_slots SET status = 'canceled' WHERE package_id = ?", [packageId]);
    } else {
      await db.query("UPDATE loyalty_package_slots SET status = 'reserved' WHERE package_id = ?", [packageId]);
    }

    const [rows] = await db.query("SELECT * FROM loyalty_packages WHERE id = ? LIMIT 1", [packageId]);
    return res.json(rows[0] || { id: packageId, status });
  } catch (error) {
    console.error("Atualizar pacote fidelidade:", error);
    return res.status(500).json({ error: "Erro ao atualizar pacote fidelidade." });
  }
});

router.delete("/loyaltyPackages/:id", async (req, res) => {
  try {
    await ensureLoyaltyTables();
    const packageId = Number(req.params.id);
    if (!packageId) return res.status(400).json({ error: "Pacote inválido." });

    await db.query("UPDATE loyalty_packages SET status = 'canceled' WHERE id = ?", [packageId]);
    await db.query("UPDATE loyalty_package_slots SET status = 'canceled' WHERE package_id = ?", [packageId]);
    return res.json({ message: "Pacote cancelado com sucesso." });
  } catch (error) {
    console.error("Cancelar pacote fidelidade:", error);
    return res.status(500).json({ error: "Erro ao cancelar pacote fidelidade." });
  }
});

module.exports = router;
