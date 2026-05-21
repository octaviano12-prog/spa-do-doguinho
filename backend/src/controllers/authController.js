const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

function sign(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = "employee";
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Preencha nome, email e senha" });
    }

    const [exists] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length) return res.status(409).json({ message: "Email já cadastrado" });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hash, role]
    );

    const user = { id: result.insertId, name, email, role };
    return res.status(201).json({ token: sign(user), user });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao registrar usuário" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ message: "Credenciais inválidas" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Credenciais inválidas" });

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    return res.json({ token: sign(safeUser), user: safeUser });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao fazer login" });
  }
};

exports.me = async (req, res) => {
  return res.json({ user: req.user });
};
