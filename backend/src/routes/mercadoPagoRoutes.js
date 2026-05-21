const router = require("express").Router();
const auth = require("../middlewares/auth");
const adminOnly = require("../middlewares/admin");
const c = require("../controllers/mercadoPagoController");

router.post("/pix", auth, adminOnly, c.createPix);

module.exports = router;
const router = require("express").Router();
const auth = require("../middlewares/auth");
const c = require("../controllers/mercadoPagoController");

router.post("/pix", auth, c.createPix);

module.exports = router;
