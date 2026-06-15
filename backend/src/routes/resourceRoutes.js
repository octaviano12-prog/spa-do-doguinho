const router = require("express").Router();
const auth = require("../middlewares/auth");
const crud = require("../controllers/crudController");
const db = require("../config/db");

const resources = {
  users: "users",
  customers: "customers",
  pets: "pets",
  services: "services",
  appointments: "appointments",
  payments: "payments",
  paymentSettings: "payment_settings",
  cash: "cash_movements",
  cashClosings: "cash_closings",
  stock: "stock_items",
  stock_items: "stock_items",
  stockMovements: "stock_movements",
  vaccines: "vaccines",
  vaccinations: "vaccinations",
  serviceHistory: "service_history",
  gallery: "gallery",
  availability: "availability",
  availabilityRules: "availability_rules",
  blockedDates: "blocked_dates",
  settings: "site_settings",
  siteProfile: "site_profile",
  activityLogs: "activity_logs"
};

function quoteIdentifier(value) {
  return `\`${String(value).replace(/`/g, "``")}\``;
}

function normalizeAppointmentStatus(status) {
  const value = String(status || "").trim().toLowerCase();
  const statuses = {
    pending: "pending",
    pendente: "pending",
    confirmed: "confirmed",
    confirmado: "confirmed",
    completed: "completed",
    complete: "completed",
    concluido: "completed",
    concluído: "completed",
    finalizado: "completed",
    canceled: "canceled",
    cancelled: "canceled",
    cancelado: "canceled"
  };
  return statuses[value] || "";
}

function normalizePaymentMethod(method) {
  const value = String(method || "").trim().toLowerCase();
  const methods = {
    pix: "pix",
    dinheiro: "cash",
    cash: "cash",
    especie: "cash",
    espécie: "cash",
    cartao: "card",
    cartão: "card",
    card: "card",
    credito: "card",
    crédito: "card",
    debito: "card",
    débito: "card"
  };
  return methods[value] || "";
}

async function updateKnownColumns(table, whereSql, whereParams, payload) {
  const columns = await crud.getTableColumns(table);
  const keys = Object.keys(payload).filter((key) => columns.has(key));

  if (!keys.length) return false;

  const setSql = keys.map((key) => `${quoteIdentifier(key)} = ?`).join(", ");
  const values = keys.map((key) => payload[key] === "" ? null : payload[key]);
  await db.query(`UPDATE ${quoteIdentifier(table)} SET ${setSql} WHERE ${whereSql}`, [...values, ...whereParams]);
  return true;
}

router.patch("/appointments/:id/status", auth, async (req, res) => {
  try {
    const appointmentId = Number(req.params.id);
    const status = normalizeAppointmentStatus(req.body?.status);

    if (!appointmentId) return res.status(400).json({ error: "Agendamento invalido." });
    if (!status) return res.status(400).json({ error: "Status invalido." });

    const [existing] = await db.query("SELECT id FROM appointments WHERE id = ? LIMIT 1", [appointmentId]);
    if (!existing.length) return res.status(404).json({ error: "Agendamento nao encontrado." });

    const updated = await updateKnownColumns("appointments", "id = ?", [appointmentId], { status });
    if (!updated) return res.status(400).json({ error: "Nao foi possivel atualizar o status." });

    const [rows] = await db.query("SELECT * FROM appointments WHERE id = ? LIMIT 1", [appointmentId]);
    return res.json(rows[0]);
  } catch (error) {
    console.error("Atualizar status do agendamento:", error);
    return res.status(500).json({ error: "Erro ao atualizar status do agendamento." });
  }
});

router.post("/payments/:id/mark-paid", auth, async (req, res) => {
  try {
    const paymentId = Number(req.params.id);
    const method = normalizePaymentMethod(req.body?.method || req.body?.payment_method);

    if (!paymentId) return res.status(400).json({ error: "Pagamento invalido." });
    if (!method) return res.status(400).json({ error: "Informe dinheiro, cartao ou pix." });

    const [payments] = await db.query("SELECT * FROM payments WHERE id = ? LIMIT 1", [paymentId]);
    const payment = payments[0];
    if (!payment) return res.status(404).json({ error: "Pagamento nao encontrado." });

    const paidAt = new Date();
    await updateKnownColumns("payments", "id = ?", [paymentId], {
      status: "paid",
      method,
      payment_method: method,
      paid_at: paidAt
    });

    if (payment.appointment_id) {
      await updateKnownColumns("appointments", "id = ?", [payment.appointment_id], {
        payment_status: "paid",
        payment_method: method,
        paid_at: paidAt
      });
    }

    const [rows] = await db.query("SELECT * FROM payments WHERE id = ? LIMIT 1", [paymentId]);
    return res.json({ ...rows[0], ok: true });
  } catch (error) {
    console.error("Marcar pagamento como pago:", error);
    return res.status(500).json({ error: "Erro ao marcar pagamento como pago." });
  }
});

Object.entries(resources).forEach(([route, table]) => {
  router.get(`/${route}`, auth, crud.list(table));
  router.get(`/${route}/:id`, auth, crud.getOne(table));
  router.post(`/${route}`, auth, crud.create(table));
  router.put(`/${route}/:id`, auth, crud.update(table));
  router.delete(`/${route}/:id`, auth, crud.remove(table));
});

module.exports = router;
