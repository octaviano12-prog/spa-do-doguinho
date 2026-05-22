const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const db = require("../config/db");

/*
  Teste pelo navegador:
  GET /api/auth/login
*/
router.get("/login", (req, res) => {
  res.json({
    ok: true,
    message: "Rota de login ativa. Use POST para autenticar."
  });
});

/*
  Login real:
  POST /api/auth/login
*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Informe e-mail e senha."
      });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Usuário não encontrado."
      });
    }

    const user = users[0];

    if (String(password) !== String(user.password)) {
      return res.status(401).json({
        success: false,
        error: "Senha inválida."
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role || "admin"
      },
      process.env.JWT_SECRET || "spadodoguinho123",
      {
        expiresIn: "7d"
      }
    );

    delete user.password;

    return res.json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error("Erro no login:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Erro interno no login."
    });
  }
});

module.exports = router;
