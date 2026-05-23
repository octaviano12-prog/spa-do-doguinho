const router = require("express").Router();
const db = require("../config/db");

router.get("/services", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, description, price, duration, image_url, active FROM services WHERE active = 1 OR active IS NULL ORDER BY id DESC"
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
      "SELECT id, title, image_url, description, active FROM gallery WHERE active = 1 OR active IS NULL ORDER BY id DESC"
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
      "SELECT setting_key, setting_value FROM site_settings"
    );

    const settings = {};

    rows.forEach((item) => {
      settings[item.setting_key] = item.setting_value;
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
