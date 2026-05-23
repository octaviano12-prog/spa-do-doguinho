const router = require("express").Router();
const db = require("../config/db");

router.get("/services", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM services ORDER BY id DESC"
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get("/gallery", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM gallery ORDER BY id DESC"
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get("/settings", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM site_settings ORDER BY id DESC"
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
