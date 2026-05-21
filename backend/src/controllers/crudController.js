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
  const values = keys.map((key) => {
    if (body[key] === "") return null;
    if (["scheduled_at", "paid_at"].includes(key) && typeof body[key] === "string") {
      return body[key].replace("T", " ");
    }
    return body[key];
  });
  return { keys, values };
}

exports.list = (table) => async (req, res) => {
  try {
    tableOrFail(table);
    const listSql = {
      pets: `
        SELECT p.*, c.name AS customer_name
        FROM pets p
        INNER JOIN customers c ON c.id = p.customer_id
        ORDER BY p.id DESC
      `,
      appointments: `
        SELECT
          a.*,
          c.name AS customer_name,
          p.name AS pet_name,
          s.name AS service_name,
          s.price AS service_price,
          DATE_FORMAT(a.scheduled_at, '%Y-%m-%d %H:%i') AS scheduled_label
        FROM appointments a
        INNER JOIN customers c ON c.id = a.customer_id
        INNER JOIN pets p ON p.id = a.pet_id
        INNER JOIN services s ON s.id = a.service_id
        ORDER BY a.scheduled_at DESC
      `,
      vaccines: `
        SELECT v.*, p.name AS pet_name, c.name AS customer_name
        FROM vaccines v
        INNER JOIN pets p ON p.id = v.pet_id
        INNER JOIN customers c ON c.id = p.customer_id
        ORDER BY v.id DESC
      `,
      payments: `
        SELECT pay.*, a.scheduled_at AS appointment_date
        FROM payments pay
        LEFT JOIN appointments a ON a.id = pay.appointment_id
        ORDER BY pay.id DESC
      `,
    };
    const [rows] = await db.query(listSql[table] || `SELECT * FROM ${table} ORDER BY id DESC`);
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
    if (table === "appointments" && (!req.body.customer_id || !req.body.pet_id || !req.body.service_id)) {
      return res.status(400).json({ message: "Selecione cliente, pet e serviço para agendar" });
    }
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
  const conn = await db.getConnection();
  try {
    tableOrFail(table);
    const id = req.params.id;

    await conn.beginTransaction();

    if (table === "customers") {
      await conn.query(
        `UPDATE payments pay
         INNER JOIN appointments a ON a.id = pay.appointment_id
         SET pay.appointment_id = NULL
         WHERE a.customer_id = ?`,
        [id]
      );
      await conn.query("DELETE FROM appointments WHERE customer_id = ?", [id]);
      await conn.query("DELETE FROM pets WHERE customer_id = ?", [id]);
      await conn.query("DELETE FROM customers WHERE id = ?", [id]);
    } else if (table === "pets") {
      await conn.query(
        `UPDATE payments pay
         INNER JOIN appointments a ON a.id = pay.appointment_id
         SET pay.appointment_id = NULL
         WHERE a.pet_id = ?`,
        [id]
      );
      await conn.query("DELETE FROM appointments WHERE pet_id = ?", [id]);
      await conn.query("DELETE FROM pets WHERE id = ?", [id]);
    } else if (table === "services") {
      await conn.query("UPDATE services SET active = 0 WHERE id = ?", [id]);
    } else {
      await conn.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
    }

    await conn.commit();
    return res.json({ message: "Removido com sucesso" });
  } catch (error) {
    await conn.rollback();
    return res.status(500).json({ message: "Erro ao remover registro", detail: error.message });
  } finally {
    conn.release();
  }
};
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
