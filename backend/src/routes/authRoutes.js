const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

    console.log("SENHA DIGITADA:", password);
    console.log("HASH BANCO:", user.password);

    const valid = await bcrypt.compare(
      password,
      user.password
    );

    console.log("VALID:", valid);

    if (!valid) {
      return res.status(401).json({
        error: "Senha inválida."
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      "spadodoguinho123",
      {
        expiresIn: "7d"
      }
    );

    delete user.password;

    res.json({
      success: true,
      token,
      user
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
