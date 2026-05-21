const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "Arquivo não enviado"
        });
      }

      res.json({
        success: true,
        file: req.file.filename,
        path: `/uploads/${req.file.filename}`
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
);

module.exports = router;
