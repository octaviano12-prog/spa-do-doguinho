const router = require("express").Router();
const c = require("../controllers/availabilityController");

// Público: usado pelo site para mostrar horários disponíveis
router.get("/slots", c.slots);

module.exports = router;
