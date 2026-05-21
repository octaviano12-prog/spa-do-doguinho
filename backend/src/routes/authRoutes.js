const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("../config/db");

router.post("/login", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const login = email || username;

    if (!login || !password) {
      return res.status(400).json({
        error: "Informe e-mail/usuário e senha."
      });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1",
      [login, login]
    );

    if (!users.length) {
      return res.status(401).json({
        error: "Usuário não encontrado."
      });
    }

    const user = users[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        error: "Senha inválida."
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || "spadodoguinho123",
      { expiresIn: "7d" }
    );

    delete user.password;

    res.json({
      success: true,
      token,
      user
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
