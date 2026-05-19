const router = require("express").Router();
const auth = require("../middlewares/auth");
const c = require("../controllers/dashboardController");

router.get("/summary", auth, c.summary);

module.exports = router;
