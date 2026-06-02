const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const upload = require("../middlewares/uploadMiddleware");

function requireAdmin(req, res, next) {
  const isAdmin = req.user?.type === "admin" || req.user?.role === "admin";

  if (!isAdmin) {
    return res.status(403).json({
      error: "Apenas administradores podem enviar imagens."
    });
  }

  return next();
}

router.post(
  "/:folder?",
  auth,
  requireAdmin,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "Arquivo nao enviado."
        });
      }

      return res.status(201).json({
        success: true,
        file: req.file.filename,
        original_name: req.file.originalname,
        mime_type: req.file.mimetype,
        size: req.file.size,
        path: req.file.relativePath,
        url: req.file.relativePath
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message || "Erro ao salvar imagem."
      });
    }
  }
);

module.exports = router;
