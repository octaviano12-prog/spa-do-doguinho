const router = require("express").Router();

const db = require("../config/db");
const customerAuth = require("../middlewares/customerAuth");

router.use(customerAuth);

router.get("/me", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, phone, created_at FROM customers WHERE id = ? LIMIT 1",
      [req.customer.id]
    );

    return res.json(rows[0] || null);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/pets", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM pets WHERE customer_id = ? ORDER BY id DESC",
      [req.customer.id]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/appointments", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM appointments WHERE customer_id = ? ORDER BY id DESC",
      [req.customer.id]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/payments", async (req, res) => {
  try {
    const [appointments] = await db.query(
      "SELECT id FROM appointments WHERE customer_id = ?",
      [req.customer.id]
    );

    if (!appointments.length) return res.json([]);

    const ids = appointments.map((item) => item.id);
    const placeholders = ids.map(() => "?").join(",");

    const [rows] = await db.query(
      `SELECT * FROM payments WHERE appointment_id IN (${placeholders}) ORDER BY id DESC`,
      ids
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
