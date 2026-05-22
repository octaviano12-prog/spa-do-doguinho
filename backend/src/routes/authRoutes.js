const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const db = require("../config/db");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (!users.length) {
      return res.status(401).json({
        error: "Usuário não encontrado."
      });
    }

    const user = users[0];

    if (password !== user.password) {
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
    return res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
