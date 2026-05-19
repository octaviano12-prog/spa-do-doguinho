const db = require("../config/db");

exports.summary = async (_, res) => {
  try {
    const [[customers]] = await db.query("SELECT COUNT(*) total FROM customers");
    const [[pets]] = await db.query("SELECT COUNT(*) total FROM pets");
    const [[appointments]] = await db.query("SELECT COUNT(*) total FROM appointments");
    const [[pending]] = await db.query("SELECT COUNT(*) total FROM appointments WHERE status IN ('pending','confirmed')");
    const [[revenue]] = await db.query("SELECT COALESCE(SUM(amount),0) total FROM payments WHERE status='paid'");
    const [[lowStock]] = await db.query("SELECT COUNT(*) total FROM stock_items WHERE quantity <= min_quantity");

    const [byStatus] = await db.query("SELECT status name, COUNT(*) value FROM appointments GROUP BY status");
    const [cashFlow] = await db.query(`
      SELECT DATE(created_at) day,
      SUM(CASE WHEN type='entrada' THEN amount ELSE 0 END) entradas,
      SUM(CASE WHEN type='saida' THEN amount ELSE 0 END) saidas
      FROM cash_movements
      GROUP BY DATE(created_at)
      ORDER BY day DESC
      LIMIT 14
    `);

    return res.json({
      cards: {
        customers: customers.total,
        pets: pets.total,
        appointments: appointments.total,
        pendingAppointments: pending.total,
        revenue: Number(revenue.total || 0),
        lowStock: lowStock.total
      },
      byStatus,
      cashFlow: cashFlow.reverse()
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao carregar dashboard" });
  }
};
