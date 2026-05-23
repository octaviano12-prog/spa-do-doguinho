const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "spadodoguinho123";

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function removePassword(record) {
  if (!record) return record;
  const copy = { ...record };
  delete copy.password;
  return copy;
}

async function validatePassword(inputPassword, storedPassword) {
  if (!storedPassword) return false;

  const stored = String(storedPassword);
  const isHash = stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$");

  if (isHash) {
    return bcrypt.compare(String(inputPassword), stored);
  }

  return String(inputPassword) === stored;
}

router.get("/login", (req, res) => {
  res.json({
    ok: true,
    message: "Rota de login ativa. Use POST para autenticar."
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Informe e-mail e senha." });
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);

    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, error: "Usuário não encontrado." });
    }

    const user = users[0];
    const passwordOk = await validatePassword(password, user.password);

    if (!passwordOk) {
      return res.status(401).json({ success: false, error: "Senha inválida." });
    }

    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role || "admin",
      type: "admin"
    });

    return res.json({ success: true, token, user: removePassword(user) });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ success: false, error: error.message || "Erro interno no login." });
  }
});

router.post("/customer-register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Nome, e-mail e senha são obrigatórios."
      });
    }

    const [existing] = await db.query("SELECT id FROM customers WHERE email = ? LIMIT 1", [email]);

    if (existing && existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: "Já existe um cliente cadastrado com este e-mail."
      });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const [result] = await db.query(
      "INSERT INTO customers (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone || null, passwordHash]
    );

    const [rows] = await db.query("SELECT * FROM customers WHERE id = ? LIMIT 1", [result.insertId]);
    const customer = rows[0];

    const token = createToken({
      id: customer.id,
      email: customer.email,
      role: "customer",
      type: "customer"
    });

    return res.status(201).json({ success: true, token, customer: removePassword(customer) });
  } catch (error) {
    console.error("Erro no cadastro do cliente:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Erro interno no cadastro do cliente."
    });
  }
});

router.post("/customer-login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Informe e-mail e senha." });
    }

    const [customers] = await db.query("SELECT * FROM customers WHERE email = ? LIMIT 1", [email]);

    if (!customers || customers.length === 0) {
      return res.status(401).json({ success: false, error: "Cliente não encontrado." });
    }

    const customer = customers[0];
    const passwordOk = await validatePassword(password, customer.password);

    if (!passwordOk) {
      return res.status(401).json({ success: false, error: "Senha inválida." });
    }

    const token = createToken({
      id: customer.id,
      email: customer.email,
      role: "customer",
      type: "customer"
    });

    return res.json({ success: true, token, customer: removePassword(customer) });
  } catch (error) {
    console.error("Erro no login do cliente:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Erro interno no login do cliente."
    });
  }
});

module.exports = router;
