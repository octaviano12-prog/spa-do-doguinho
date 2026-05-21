// Base pronta para integração Mercado Pago PIX.
// Na Hostinger, crie a variável MP_ACCESS_TOKEN no .env.
// Depois você pode trocar esta simulação pela chamada oficial do Mercado Pago.

exports.createPix = async (req, res) => {
  const { amount, description = "SPA do Doguinho" } = req.body;
  if (!amount) return res.status(400).json({ message: "Informe o valor" });

  return res.json({
    status: "pending",
    amount,
    description,
    qr_code: "COLE_AQUI_O_CODIGO_PIX_RETORNADO_PELO_MERCADO_PAGO",
    qr_code_base64: null,
    message: "Endpoint preparado. Falta configurar MP_ACCESS_TOKEN e chamada oficial do Mercado Pago."
  });
};
