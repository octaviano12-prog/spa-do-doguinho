const db = require("../config/db");

const allowed = {
  users: ["name", "email", "role"],
  customers: ["name", "phone", "email", "address", "notes"],
  pets: ["customer_id", "name", "species", "breed", "birth_date", "notes"],
  services: ["name", "price", "duration_minutes", "active", "description"],
  appointments: ["customer_id", "pet_id", "service_id", "scheduled_at", "status", "notes"],
  payments: ["appointment_id", "amount", "method", "status", "type", "description", "paid_at"],
  cash_movements: ["type", "amount", "method", "description", "created_by"],
  stock_items: ["name", "quantity", "min_quantity", "cost_price", "sale_price", "unit", "notes"],
  stock_movements: ["stock_item_id", "type", "quantity", "reason"],
  vaccines: ["pet_id", "name", "applied_at", "next_due", "notes"],
  gallery: ["title", "image_url", "description"],
  site_settings: ["setting_key", "setting_value"]
};

function tableOrFail(table) {
  if (!allowed[table]) throw new Error("Recurso inválido");
  return table;
}

function pickBody(table, body) {
  const keys = allowed[table].filter((key) => Object.prototype.hasOwnProperty.call(body, key));
  const values = keys.map((key) => body[key] === "" ? null : body[key]);
  return { keys, values };
}

exports.list = (table) => async (req, res) => {
  try {
    tableOrFail(table);
    const [rows] = await db.query(`SELECT * FROM ${table} ORDER BY id DESC`);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao listar registros" });
  }
};

exports.getOne = (table) => async (req, res) => {
  try {
    tableOrFail(table);
    const [rows] = await db.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Registro não encontrado" });
    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar registro" });
  }
};

exports.create = (table) => async (req, res) => {
  try {
    tableOrFail(table);
    const { keys, values } = pickBody(table, req.body);
    if (!keys.length) return res.status(400).json({ message: "Nenhum campo válido enviado" });

    const sql = `INSERT INTO ${table} (${keys.join(",")}) VALUES (${keys.map(() => "?").join(",")})`;
    const [result] = await db.query(sql, values);
    return res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar registro", detail: error.message });
  }
};

exports.update = (table) => async (req, res) => {
  try {
    tableOrFail(table);
    const { keys, values } = pickBody(table, req.body);
    if (!keys.length) return res.status(400).json({ message: "Nenhum campo válido enviado" });

    const sql = `UPDATE ${table} SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`;
    await db.query(sql, [...values, req.params.id]);
    return res.json({ message: "Atualizado com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar registro", detail: error.message });
  }
};

exports.remove = (table) => async (req, res) => {
  try {
    tableOrFail(table);
    await db.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
    return res.json({ message: "Removido com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao remover registro", detail: error.message });
  }
};
