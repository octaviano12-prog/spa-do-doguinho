const router = require("express").Router();
const auth = require("../middlewares/auth");
const c = require("../controllers/mercadoPagoController");

router.post("/pix", auth, c.createPix);

module.exports = router;
