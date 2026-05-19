const db = require("../config/db");

async function safeCount(table) {
  try {
    const [[row]] = await db.query(`SELECT COUNT(*) total FROM ${table}`);
    return Number(row.total || 0);
  } catch {
    return 0;
  }
}

async function safeQuery(sql, params = []) {
  try {
    const [rows] = await db.query(sql, params);
    return rows;
  } catch (error) {
    console.error("Dashboard query error:", error.message);
    return [];
  }
}

exports.summary = async (_, res) => {
  try {
    const customers = await safeCount("customers");
    const pets = await safeCount("pets");
    const appointments = await safeCount("appointments");
    const vaccines = await safeCount("vaccines");

    const pendingRows = await safeQuery(
      "SELECT COUNT(*) total FROM appointments WHERE status IN ('pending','pendente')"
    );

    const confirmedRows = await safeQuery(
      "SELECT COUNT(*) total FROM appointments WHERE status IN ('confirmed','confirmado')"
    );

    const todayRows = await safeQuery(
      "SELECT COUNT(*) total FROM appointments WHERE DATE(scheduled_at) = CURDATE()"
    );

    const revenueRows = await safeQuery(
      `
      SELECT COALESCE(SUM(amount),0) total 
      FROM payments 
      WHERE status IN ('paid','pago') 
      AND type IN ('entrada','receita')
      `
    );

    const lowStockRows = await safeQuery(
      "SELECT COUNT(*) total FROM stock_items WHERE quantity <= min_quantity"
    );

    const byStatus = await safeQuery(`
      SELECT 
        COALESCE(status, 'pending') name,
        COUNT(*) value
      FROM appointments
      GROUP BY status
    `);

    const cashFlow = await safeQuery(`
      SELECT 
        DATE(created_at) day,
        COALESCE(SUM(CASE WHEN type IN ('entrada','receita') THEN amount ELSE 0 END),0) entradas,
        COALESCE(SUM(CASE WHEN type IN ('saida','despesa') THEN amount ELSE 0 END),0) saidas
      FROM payments
      GROUP BY DATE(created_at)
      ORDER BY day DESC
      LIMIT 14
    `);

    const popularServices = await safeQuery(`
      SELECT 
        s.name,
        COUNT(a.id) count
      FROM services s
      LEFT JOIN appointments a ON a.service_id = s.id
      GROUP BY s.id, s.name
      ORDER BY count DESC
      LIMIT 5
    `);

    const recentAppointments = await safeQuery(`
      SELECT 
        a.id,
        a.status,
        DATE_FORMAT(a.scheduled_at, '%d/%m/%Y %H:%i') dateLabel,
        COALESCE(c.name, 'Não informado') clientName,
        COALESCE(p.name, 'Não informado') petName,
        COALESCE(s.name, 'Não informado') serviceName
      FROM appointments a
      LEFT JOIN customers c ON c.id = a.customer_id
      LEFT JOIN pets p ON p.id = a.pet_id
      LEFT JOIN services s ON s.id = a.service_id
      ORDER BY a.scheduled_at DESC
      LIMIT 5
    `);

    const nextRows = await safeQuery(`
      SELECT 
        a.id,
        a.status,
        DATE_FORMAT(a.scheduled_at, '%d/%m/%Y %H:%i') dateLabel,
        COALESCE(c.name, 'Não informado') clientName,
        COALESCE(p.name, 'Não informado') petName,
        COALESCE(s.name, 'Não informado') serviceName
      FROM appointments a
      LEFT JOIN customers c ON c.id = a.customer_id
      LEFT JOIN pets p ON p.id = a.pet_id
      LEFT JOIN services s ON s.id = a.service_id
      WHERE a.scheduled_at >= NOW()
      ORDER BY a.scheduled_at ASC
      LIMIT 1
    `);

    return res.json({
      cards: {
        customers,
        pets,
        appointments,
        vaccines,
        todayAppointments: Number(todayRows[0]?.total || 0),
        pending: Number(pendingRows[0]?.total || 0),
        confirmed: Number(confirmedRows[0]?.total || 0),
        revenue: Number(revenueRows[0]?.total || 0),
        lowStock: Number(lowStockRows[0]?.total || 0),
      },
      byStatus,
      cashFlow: cashFlow.reverse(),
      popularServices,
      recentAppointments,
      nextAppointment: nextRows[0] || null,
    });
  } catch (error) {
    console.error("Erro dashboard summary:", error);
    return res.status(500).json({
      message: "Erro ao carregar dashboard",
    });
  }
};
