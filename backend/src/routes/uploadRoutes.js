const router = require("express").Router();
const auth = require("../middlewares/auth");
const adminOnly = require("../middlewares/admin");
const upload = require("../middlewares/upload");

router.post("/", auth, adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Arquivo não enviado" });
  return res.json({ path: `/uploads/${req.file.filename}` });
});

module.exports = router;
const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post("/", auth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Arquivo não enviado" });
  return res.json({ path: `/uploads/${req.file.filename}` });
});

module.exports = router;
