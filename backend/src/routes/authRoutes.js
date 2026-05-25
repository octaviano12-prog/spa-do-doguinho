const express = require("express");
const router = express.Router();

const https = require("https");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "spadodoguinho123";
const DEFAULT_GOOGLE_CLIENT_ID = "453503592700-lu67c7lqje2cnla2mdj6111qrkluq2gu.apps.googleusercontent.com";
const GOOGLE_CLIENT_IDS = String(process.env.GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

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

function requestJson(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let raw = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        raw += chunk;
      });
      response.on("end", () => {
        try {
          const data = raw ? JSON.parse(raw) : {};

          if (response.statusCode >= 400) {
            const error = new Error(data.error_description || data.error || "Token Google inválido.");
            error.statusCode = 401;
            return reject(error);
          }

          return resolve(data);
        } catch (parseError) {
          return reject(parseError);
        }
      });
    });

    request.setTimeout(8000, () => {
      request.destroy(new Error("Tempo esgotado ao validar Google."));
    });
    request.on("error", reject);
  });
}

async function verifyGoogleCredential(credential) {
  if (!GOOGLE_CLIENT_IDS.length) {
    const error = new Error("Login com Google ainda não configurado no servidor.");
    error.statusCode = 503;
    throw error;
  }

  const tokenInfo = await requestJson(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
  );

  if (!GOOGLE_CLIENT_IDS.includes(tokenInfo.aud)) {
    const error = new Error("Token Google emitido para outro aplicativo.");
    error.statusCode = 401;
    throw error;
  }

  if (!["accounts.google.com", "https://accounts.google.com"].includes(tokenInfo.iss)) {
    const error = new Error("Emissor Google inválido.");
    error.statusCode = 401;
    throw error;
  }

  if (Number(tokenInfo.exp || 0) * 1000 < Date.now()) {
    const error = new Error("Sessão Google expirada. Tente novamente.");
    error.statusCode = 401;
    throw error;
  }

  if (String(tokenInfo.email_verified) !== "true") {
    const error = new Error("E-mail Google ainda não verificado.");
    error.statusCode = 401;
    throw error;
  }

  return {
    googleId: tokenInfo.sub,
    email: String(tokenInfo.email || "").toLowerCase(),
    name: tokenInfo.name || tokenInfo.given_name || "Cliente",
    picture: tokenInfo.picture || null
  };
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

    const normalizedEmail = String(email).toLowerCase();
    const [existing] = await db.query("SELECT id FROM customers WHERE email = ? LIMIT 1", [normalizedEmail]);

    if (existing && existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: "Já existe um cliente cadastrado com este e-mail."
      });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const [result] = await db.query(
      "INSERT INTO customers (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, normalizedEmail, phone || null, passwordHash]
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

    const normalizedEmail = String(email).toLowerCase();
    const [customers] = await db.query("SELECT * FROM customers WHERE email = ? LIMIT 1", [normalizedEmail]);

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

router.post("/customer-google", async (req, res) => {
  try {
    const { credential } = req.body || {};

    if (!credential) {
      return res.status(400).json({ success: false, error: "Token do Google não informado." });
    }

    const profile = await verifyGoogleCredential(credential);

    if (!profile.email) {
      return res.status(401).json({ success: false, error: "Não foi possível ler o e-mail do Google." });
    }

    const [existingCustomers] = await db.query("SELECT * FROM customers WHERE email = ? LIMIT 1", [profile.email]);
    let customer = existingCustomers?.[0];

    if (!customer) {
      const passwordHash = await bcrypt.hash(`${profile.googleId}:${Date.now()}`, 10);
      const [result] = await db.query(
        "INSERT INTO customers (name, email, phone, password) VALUES (?, ?, ?, ?)",
        [profile.name, profile.email, null, passwordHash]
      );
      const [rows] = await db.query("SELECT * FROM customers WHERE id = ? LIMIT 1", [result.insertId]);
      customer = rows[0];
    } else if (!customer.name && profile.name) {
      await db.query("UPDATE customers SET name = ? WHERE id = ?", [profile.name, customer.id]);
      customer = { ...customer, name: profile.name };
    }

    const token = createToken({
      id: customer.id,
      email: customer.email,
      role: "customer",
      type: "customer",
      provider: "google"
    });

    return res.json({ success: true, token, customer: removePassword(customer) });
  } catch (error) {
    console.error("Erro no login Google do cliente:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Erro interno no login com Google."
    });
  }
});

module.exports = router;
