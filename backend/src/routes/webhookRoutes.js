const router = require("express").Router();
const db = require("../config/db");

async function getPaymentFromMercadoPago(paymentId, accessToken) {
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Erro ao consultar pagamento no Mercado Pago.");
  }
  return data;
}

function normalizeStatus(status) {
  const value = String(status || "pending").toLowerCase();
  if (["approved", "paid", "accredited"].includes(value)) return "paid";
  if (["cancelled", "canceled", "rejected"].includes(value)) return "canceled";
  if (["refunded", "charged_back"].includes(value)) return "refunded";
  return "pending";
}

router.get("/mercado-pago", (req, res) => {
  return res.json({
    ok: true,
    webhook: "mercado-pago",
    method: "GET test only",
    real_method: "POST",
    message: "Webhook Mercado Pago ativo. Configure esta URL no Mercado Pago usando evento payment."
  });
});

router.post("/mercado-pago", async (req, res) => {
  try {
    const body = req.body || {};
    const paymentId = body?.data?.id || body?.id || body?.resource?.split?.("/")?.pop?.();

    if (!paymentId) {
      return res.json({ ok: true, ignored: true, reason: "Sem payment id" });
    }

    const [settingsRows] = await db.query("SELECT access_token FROM payment_settings WHERE active = 1 ORDER BY id DESC LIMIT 1");
    const accessToken = settingsRows[0]?.access_token;

    if (!accessToken) {
      return res.json({ ok: true, ignored: true, reason: "Mercado Pago não configurado" });
    }

    const mpPayment = await getPaymentFromMercadoPago(paymentId, accessToken);
    const externalReference = mpPayment.external_reference;
    const status = normalizeStatus(mpPayment.status);

    const [payments] = await db.query(
      "SELECT * FROM payments WHERE mercado_pago_id = ? OR external_reference = ? LIMIT 1",
      [String(paymentId), String(externalReference || "")]
    );

    const payment = payments[0];
    if (!payment) {
      return res.json({ ok: true, ignored: true, reason: "Pagamento não encontrado" });
    }

    await db.query(
      "UPDATE payments SET status = ?, transaction_id = ?, paid_at = CASE WHEN ? = 'paid' THEN NOW() ELSE paid_at END WHERE id = ?",
      [status, String(paymentId), status, payment.id]
    );

    if (payment.appointment_id) {
      await db.query(
        "UPDATE appointments SET payment_status = ?, status = CASE WHEN ? = 'paid' THEN 'confirmed' ELSE status END WHERE id = ?",
        [status, status, payment.appointment_id]
      );
    }

    return res.json({ ok: true, payment_id: paymentId, status });
  } catch (error) {
    console.error("Webhook Mercado Pago:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
});

module.exports = router;
