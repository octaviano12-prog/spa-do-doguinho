const router = require("express").Router();
const auth = require("../middlewares/auth");
const cascade = require("../controllers/cascadeController");

router.delete("/pets/:id/cascade", auth, cascade.deletePetCascade);
router.delete("/customers/:id/cascade", auth, cascade.deleteCustomerCascade);

module.exports = router;
