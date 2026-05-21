const router = require("express").Router();
const auth = require("../middlewares/auth");
const adminOnly = require("../middlewares/admin");
const c = require("../controllers/dashboardController");

router.get("/summary", auth, adminOnly, c.summary);

module.exports = router;
const router = require("express").Router();
const auth = require("../middlewares/auth");
const c = require("../controllers/dashboardController");

router.get("/summary", auth, c.summary);

module.exports = router;
