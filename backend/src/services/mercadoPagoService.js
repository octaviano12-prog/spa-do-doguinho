async function createPixPayment({ accessToken, amount, description, payerEmail, payerName, externalReference }) {
  if (!accessToken) {
    return null;
  }

  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": `spa-doguinho-${externalReference}-${Date.now()}`
    },
    body: JSON.stringify({
      transaction_amount: Number(amount || 0),
      description: description || "Pagamento SPA do Doguinho",
      payment_method_id: "pix",
      external_reference: String(externalReference || ""),
      payer: {
        email: payerEmail || "cliente@spadodoguinho.com.br",
        first_name: payerName || "Cliente"
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Erro ao gerar PIX no Mercado Pago.");
  }

  return {
    mercado_pago_id: data.id,
    status: data.status || "pending",
    qr_code: data.point_of_interaction?.transaction_data?.qr_code || null,
    qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64 || null,
    ticket_url: data.point_of_interaction?.transaction_data?.ticket_url || null,
    raw: data
  };
}

module.exports = { createPixPayment };
