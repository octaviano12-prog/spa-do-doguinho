const router = require("express").Router();
const auth = require("../middlewares/auth");
const c = require("../controllers/availabilityController");

router.get("/slots", auth, c.slots);

module.exports = router;
