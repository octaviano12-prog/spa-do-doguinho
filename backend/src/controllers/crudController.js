const db = require("../config/db");

const allowed = {
  users: ["name", "email", "password", "role", "phone", "avatar_url", "active"],
  customers: ["name", "phone", "email", "password", "cpf", "address", "city", "state", "birth_date", "notes", "active"],
  pets: ["customer_id", "name", "species", "breed", "birth_date", "age", "sex", "weight", "size_category", "estimated_bath_time", "color", "allergies", "behavior", "notes", "observations", "photo_url", "active"],
  services: ["name", "description", "price", "duration_minutes", "active", "benefits", "image_url", "category", "price_small", "price_medium", "price_large", "price_giant", "duration_small", "duration_medium", "duration_large", "duration_giant"],
  appointments: ["customer_id", "pet_id", "service_id", "scheduled_at", "date", "time", "status", "notes", "total_price", "price", "payment_status", "payment_method", "paid_at", "mercado_pago_id"],
  payments: ["appointment_id", "customer_id", "amount", "method", "payment_method", "type", "status", "description", "paid_at", "mercado_pago_id", "external_reference", "transaction_id", "qr_code", "notes"],
  payment_settings: ["provider", "access_token", "public_key", "pix_enabled", "card_enabled", "cash_enabled", "deposit_required", "deposit_percent", "active"],
  cash_movements: ["type", "amount", "method", "payment_method", "category", "description", "responsible", "operator", "created_by", "movement_date", "date", "status"],
  cash_closings: ["closing_date", "date", "opening_amount", "initial_amount", "opening_balance", "total_income", "total_entries", "total_expense", "total_exits", "final_amount", "final_balance", "closing_amount", "expected_amount", "difference_amount", "responsible", "operator", "created_by", "status", "opened_at", "closed_at", "notes"],
  stock_items: ["name", "category", "quantity", "min_quantity", "minimum_quantity", "cost_price", "sale_price", "price", "unit", "supplier", "barcode", "notes", "active"],
  stock_movements: ["stock_item_id", "type", "quantity", "reason", "description", "responsible"],
  vaccines: ["pet_id", "name", "vaccine_name", "applied_at", "date", "next_due", "next_date", "next_dose_date", "notes"],
  vaccinations: ["pet_id", "vaccine_name", "name", "date", "applied_at", "next_dose_date", "next_date", "next_due", "notes"],
  service_history: ["pet_id", "service_id", "appointment_id", "date", "professional", "notes", "recommendations", "next_visit"],
  gallery: ["title", "image_url", "description", "category", "active", "display_order", "sort_order"],
  availability: ["weekday", "day_of_week", "enabled", "start_time", "end_time", "interval_minutes", "max_appointments_per_slot", "active", "notes"],
  availability_rules: ["date", "start_time", "end_time", "type", "reason", "active"],
  blocked_dates: ["date", "time", "reason", "active"],
  site_settings: ["setting_key", "setting_value"],
  site_profile: [
    "site_name", "site_slogan", "tagline", "hero_title", "hero_subtitle", "hero_button_text", "hero_banner_url", "hero_image_url",
    "about_title", "about_main_text", "mission", "vision", "values", "about_image_url",
    "services_page_title", "services_text", "benefits_text", "testimonials_text",
    "contact_whatsapp", "contact_instagram", "instagram", "facebook", "contact_phone", "contact_email", "contact_address", "contact_hours", "opening_hours", "contact_map_link",
    "footer_text", "primary_color", "secondary_color", "button_color", "background_color", "text_color", "logo_url", "theme_select", "card_border_radius", "card_shadow"
  ],
  activity_logs: ["user_id", "action", "entity", "entity_id", "description"]
};

const selectMap = {
  appointments: `
    SELECT a.*, c.name AS customer_name, c.phone AS customer_phone, p.name AS pet_name, s.name AS service_name, s.price AS service_price
    FROM appointments a
    LEFT JOIN customers c ON c.id = a.customer_id
    LEFT JOIN pets p ON p.id = a.pet_id
    LEFT JOIN services s ON s.id = a.service_id
  `,
  pets: `
    SELECT p.*, c.name AS customer_name, c.phone AS customer_phone
    FROM pets p
    LEFT JOIN customers c ON c.id = p.customer_id
  `,
  payments: `
    SELECT pay.*, c.name AS customer_name, p.name AS pet_name, s.name AS service_name
    FROM payments pay
    LEFT JOIN appointments a ON a.id = pay.appointment_id
    LEFT JOIN customers c ON c.id = a.customer_id
    LEFT JOIN pets p ON p.id = a.pet_id
    LEFT JOIN services s ON s.id = a.service_id
  `,
  service_history: `
    SELECT h.*, p.name AS pet_name, s.name AS service_name, c.name AS customer_name
    FROM service_history h
    LEFT JOIN pets p ON p.id = h.pet_id
    LEFT JOIN customers c ON c.id = p.customer_id
    LEFT JOIN services s ON s.id = h.service_id
  `,
  vaccinations: `
    SELECT v.*, p.name AS pet_name, c.name AS customer_name
    FROM vaccinations v
    LEFT JOIN pets p ON p.id = v.pet_id
    LEFT JOIN customers c ON c.id = p.customer_id
  `,
  vaccines: `
    SELECT v.*, p.name AS pet_name, c.name AS customer_name
    FROM vaccines v
    LEFT JOIN pets p ON p.id = v.pet_id
    LEFT JOIN customers c ON c.id = p.customer_id
  `
};

const aliasMap = {
  appointments: "a",
  pets: "p",
  payments: "pay",
  service_history: "h",
  vaccinations: "v",
  vaccines: "v"
};

const aliasTables = {
  a: "appointments",
  c: "customers",
  p: "pets",
  pay: "payments",
  s: "services",
  h: "service_history",
  v: "vaccinations"
};

const searchMap = {
  customers: ["name", "email", "phone", "cpf", "address", "city", "state", "notes"],
  services: ["name", "description", "benefits", "category"],
  stock_items: ["name", "category", "supplier", "barcode", "notes"],
  gallery: ["title", "description", "category"],
  pets: ["p.name", "p.species", "p.breed", "p.notes", "c.name", "c.phone"],
  appointments: ["c.name", "c.phone", "p.name", "s.name", "a.status", "a.notes"],
  payments: ["c.name", "p.name", "s.name", "pay.method", "pay.payment_method", "pay.status", "pay.description", "pay.notes"],
  vaccinations: ["p.name", "c.name", "v.vaccine_name", "v.name", "v.notes"],
  vaccines: ["p.name", "c.name", "v.name", "v.vaccine_name", "v.notes"]
};

const orderCandidates = {
  appointments: [["scheduled_at", "DESC"], ["date", "DESC"], ["time", "DESC"], ["id", "DESC"]],
  pets: [["id", "DESC"]],
  payments: [["paid_at", "DESC"], ["id", "DESC"]],
  cash_movements: [["movement_date", "DESC"], ["date", "DESC"], ["id", "DESC"]],
  cash_closings: [["closing_date", "DESC"], ["date", "DESC"], ["id", "DESC"]],
  service_history: [["date", "DESC"], ["id", "DESC"]],
  vaccinations: [["next_dose_date", "ASC"], ["next_date", "ASC"], ["date", "DESC"], ["id", "DESC"]],
  vaccines: [["next_due", "ASC"], ["next_date", "ASC"], ["applied_at", "DESC"], ["date", "DESC"], ["id", "DESC"]],
  availability: [["day_of_week", "ASC"], ["weekday", "ASC"], ["start_time", "ASC"], ["id", "DESC"]],
  availability_rules: [["date", "DESC"], ["id", "DESC"]],
  blocked_dates: [["date", "DESC"], ["id", "DESC"]],
  gallery: [["sort_order", "ASC"], ["display_order", "ASC"], ["id", "DESC"]]
};

const columnCache = new Map();

function tableOrFail(table) {
  if (!allowed[table]) throw new Error("Recurso invalido");
  return table;
}

function quoteIdentifier(value) {
  return `\`${String(value).replace(/`/g, "``")}\``;
}

function quoteTable(table) {
  tableOrFail(table);
  return quoteIdentifier(table);
}

async function getTableColumns(table) {
  tableOrFail(table);

  if (columnCache.has(table)) return columnCache.get(table);

  try {
    const [rows] = await db.query(`SHOW COLUMNS FROM ${quoteTable(table)}`);
    const columns = new Set(rows.map((row) => row.Field));
    columnCache.set(table, columns);
    return columns;
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE" || error.code === "ER_BAD_TABLE_ERROR") {
      const columns = new Set();
      columnCache.set(table, columns);
      return columns;
    }
    throw error;
  }
}

function qualify(table, column) {
  const alias = aliasMap[table];
  return alias ? `${alias}.${quoteIdentifier(column)}` : quoteIdentifier(column);
}

async function hasColumn(table, column) {
  const columns = await getTableColumns(table);
  return columns.has(column);
}

async function pickBody(table, body) {
  const columns = await getTableColumns(table);
  const keys = allowed[table].filter((key) => columns.has(key) && Object.prototype.hasOwnProperty.call(body, key));
  const values = keys.map((key) => body[key] === "" ? null : body[key]);
  return { keys, values };
}

function getBaseSelect(table) {
  return selectMap[table] || `SELECT * FROM ${quoteTable(table)}`;
}

async function getOrder(table) {
  const columns = await getTableColumns(table);
  const specs = (orderCandidates[table] || [["id", "DESC"]]).filter(([column]) => columns.has(column));
  return specs.map(([column, direction]) => `${qualify(table, column)} ${direction}`).join(", ");
}

async function getSearchColumns(table) {
  const configured = searchMap[table] || [];
  const resolved = [];

  for (const field of configured) {
    if (field.includes(".")) {
      const [alias, column] = field.split(".");
      const targetTable = aliasTables[alias];
      if (targetTable && await hasColumn(targetTable, column)) {
        resolved.push(`${alias}.${quoteIdentifier(column)}`);
      }
      continue;
    }

    if (await hasColumn(table, field)) {
      resolved.push(qualify(table, field));
    }
  }

  return resolved;
}

function isEmpty(value) {
  return value === undefined || value === null || value === "";
}

function normalizeAppointmentPayload(body) {
  const payload = { ...body };

  if (payload.scheduled_at) {
    const normalized = String(payload.scheduled_at).replace("T", " ");
    payload.scheduled_at = normalized.length === 16 ? `${normalized}:00` : normalized;
  }

  const date = payload.date ? String(payload.date).slice(0, 10) : "";
  const time = payload.time ? String(payload.time).slice(0, 5) : "";

  if (!payload.scheduled_at && date && time) payload.scheduled_at = `${date} ${time}:00`;
  if (payload.scheduled_at && !payload.date) payload.date = String(payload.scheduled_at).slice(0, 10);
  if (payload.scheduled_at && !payload.time) payload.time = String(payload.scheduled_at).slice(11, 16);
  if (payload.price !== undefined && payload.total_price === undefined) payload.total_price = payload.price;
  if (payload.total_price !== undefined && payload.price === undefined) payload.price = payload.total_price;

  return payload;
}

function validateAppointmentPayload(payload) {
  const required = ["customer_id", "pet_id", "service_id"];
  const missing = required.filter((key) => isEmpty(payload[key]));

  if (missing.length) {
    return `Agendamento precisa de cliente, pet e servico vinculados.`;
  }

  if (isEmpty(payload.scheduled_at) && (isEmpty(payload.date) || isEmpty(payload.time))) {
    return "Agendamento precisa de data e horario.";
  }

  return "";
}

function normalizeCashClosingPayload(body) {
  const payload = { ...body };

  if (payload.date && !payload.closing_date) payload.closing_date = payload.date;
  if (payload.closing_date && !payload.date) payload.date = payload.closing_date;
  if (payload.operator && !payload.responsible) payload.responsible = payload.operator;
  if (payload.responsible && !payload.operator) payload.operator = payload.responsible;
  if (payload.initial_amount !== undefined && payload.opening_amount === undefined) payload.opening_amount = payload.initial_amount;
  if (payload.opening_amount !== undefined && payload.initial_amount === undefined) payload.initial_amount = payload.opening_amount;
  if (payload.opening_balance !== undefined && payload.opening_amount === undefined) payload.opening_amount = payload.opening_balance;
  if (payload.opening_amount !== undefined && payload.opening_balance === undefined) payload.opening_balance = payload.opening_amount;
  if (payload.closing_amount !== undefined && payload.final_amount === undefined) payload.final_amount = payload.closing_amount;
  if (payload.final_amount !== undefined && payload.closing_amount === undefined) payload.closing_amount = payload.final_amount;
  if (payload.final_balance !== undefined && payload.final_amount === undefined) payload.final_amount = payload.final_balance;
  if (payload.final_amount !== undefined && payload.final_balance === undefined) payload.final_balance = payload.final_amount;
  if (payload.total_entries !== undefined && payload.total_income === undefined) payload.total_income = payload.total_entries;
  if (payload.total_income !== undefined && payload.total_entries === undefined) payload.total_entries = payload.total_income;
  if (payload.total_exits !== undefined && payload.total_expense === undefined) payload.total_expense = payload.total_exits;
  if (payload.total_expense !== undefined && payload.total_exits === undefined) payload.total_exits = payload.total_expense;
  if (payload.expected_amount !== undefined && payload.total_income === undefined) payload.total_income = payload.expected_amount;

  return payload;
}

function normalizeCashMovementPayload(body) {
  const payload = { ...body };

  if (payload.date && !payload.movement_date) payload.movement_date = payload.date;
  if (payload.movement_date && !payload.date) payload.date = payload.movement_date;
  if (payload.operator && !payload.responsible) payload.responsible = payload.operator;
  if (payload.responsible && !payload.operator) payload.operator = payload.responsible;
  if (payload.payment_method && !payload.method) payload.method = payload.payment_method;
  if (payload.method && !payload.payment_method) payload.payment_method = payload.method;

  return payload;
}

function normalizePayload(table, body) {
  if (table === "appointments") return normalizeAppointmentPayload(body || {});
  if (table === "cash_closings") return normalizeCashClosingPayload(body || {});
  if (table === "cash_movements") return normalizeCashMovementPayload(body || {});
  return { ...(body || {}) };
}

function sanitizeRecord(table, row) {
  if (!row || table !== "users") return row;
  const { password, ...safeRow } = row;
  return safeRow;
}

function sanitizeRows(table, rows) {
  return table === "users" ? rows.map((row) => sanitizeRecord(table, row)) : rows;
}

function toRecord(keys, values) {
  return keys.reduce((record, key, index) => ({ ...record, [key]: values[index] }), {});
}

function placeholders(values) {
  return values.map(() => "?").join(",");
}

async function getIds(conn, sql, params) {
  const [rows] = await conn.query(sql, params);
  return rows.map((row) => row.id).filter((id) => id !== undefined && id !== null);
}

async function deleteByColumn(conn, table, column, value) {
  if (!await hasColumn(table, column)) return;
  await conn.query(`DELETE FROM ${quoteTable(table)} WHERE ${quoteIdentifier(column)} = ?`, [value]);
}

async function deleteByColumnIn(conn, table, column, values) {
  if (!values.length || !await hasColumn(table, column)) return;
  await conn.query(`DELETE FROM ${quoteTable(table)} WHERE ${quoteIdentifier(column)} IN (${placeholders(values)})`, values);
}

async function deleteAppointmentCascade(id) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await deleteByColumn(conn, "payments", "appointment_id", id);
    await deleteByColumn(conn, "service_history", "appointment_id", id);
    const [result] = await conn.query("DELETE FROM appointments WHERE id = ?", [id]);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function deletePetCascade(id) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const appointmentIds = await getIds(conn, "SELECT id FROM appointments WHERE pet_id = ?", [id]);

    await deleteByColumnIn(conn, "payments", "appointment_id", appointmentIds);
    await deleteByColumnIn(conn, "service_history", "appointment_id", appointmentIds);
    await deleteByColumn(conn, "service_history", "pet_id", id);
    await deleteByColumn(conn, "vaccines", "pet_id", id);
    await deleteByColumn(conn, "vaccinations", "pet_id", id);
    await conn.query("DELETE FROM appointments WHERE pet_id = ?", [id]);
    const [result] = await conn.query("DELETE FROM pets WHERE id = ?", [id]);

    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function deleteCustomerCascade(id) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const petIds = await getIds(conn, "SELECT id FROM pets WHERE customer_id = ?", [id]);
    let appointmentIds = [];

    if (petIds.length) {
      appointmentIds = await getIds(
        conn,
        `SELECT id FROM appointments WHERE customer_id = ? OR pet_id IN (${placeholders(petIds)})`,
        [id, ...petIds]
      );
    } else {
      appointmentIds = await getIds(conn, "SELECT id FROM appointments WHERE customer_id = ?", [id]);
    }

    await deleteByColumnIn(conn, "payments", "appointment_id", appointmentIds);
    await deleteByColumn(conn, "payments", "customer_id", id);
    await deleteByColumnIn(conn, "service_history", "appointment_id", appointmentIds);
    await deleteByColumnIn(conn, "service_history", "pet_id", petIds);
    await deleteByColumnIn(conn, "vaccines", "pet_id", petIds);
    await deleteByColumnIn(conn, "vaccinations", "pet_id", petIds);
    await deleteByColumnIn(conn, "appointments", "id", appointmentIds);
    await conn.query("DELETE FROM pets WHERE customer_id = ?", [id]);
    const [result] = await conn.query("DELETE FROM customers WHERE id = ?", [id]);

    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function removeService(id) {
  try {
    const [result] = await db.query("DELETE FROM services WHERE id = ?", [id]);
    return { result, softDeleted: false };
  } catch (error) {
    const hasLinkedAppointments = error.code === "ER_ROW_IS_REFERENCED" || error.code === "ER_ROW_IS_REFERENCED_2";
    if (!hasLinkedAppointments || !await hasColumn("services", "active")) throw error;

    const [result] = await db.query("UPDATE services SET active = 0 WHERE id = ?", [id]);
    return { result, softDeleted: true };
  }
}

exports.allowed = allowed;
exports.getTableColumns = getTableColumns;

exports.list = (table) => async (req, res) => {
  try {
    tableOrFail(table);
    const { q = "", active } = req.query;
    let sql = getBaseSelect(table);
    const params = [];
    const where = [];

    if (active !== undefined && await hasColumn(table, "active")) {
      where.push(`${qualify(table, "active")} = ?`);
      params.push(active === "true" || active === "1" ? 1 : 0);
    }

    if (q) {
      const columns = await getSearchColumns(table);
      if (columns.length) {
        where.push(`(${columns.map((column) => `${column} LIKE ?`).join(" OR ")})`);
        params.push(...columns.map(() => `%${q}%`));
      }
    }

    if (where.length) sql += ` WHERE ${where.join(" AND ")}`;

    const order = await getOrder(table);
    if (order) sql += ` ORDER BY ${order}`;

    const [rows] = await db.query(sql, params);
    return res.json(sanitizeRows(table, rows));
  } catch (error) {
    console.error("Erro ao listar:", table, error);
    return res.status(500).json({ message: "Erro ao listar registros", detail: error.message });
  }
};

exports.getOne = (table) => async (req, res) => {
  try {
    tableOrFail(table);
    const sql = `${getBaseSelect(table)} WHERE ${qualify(table, "id")} = ?`;
    const [rows] = await db.query(sql, [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Registro nao encontrado" });
    return res.json(sanitizeRecord(table, rows[0]));
  } catch (error) {
    console.error("Erro ao buscar:", table, error);
    return res.status(500).json({ message: "Erro ao buscar registro", detail: error.message });
  }
};

exports.create = (table) => async (req, res) => {
  try {
    tableOrFail(table);
    const payload = normalizePayload(table, req.body || {});

    if (table === "appointments") {
      const validation = validateAppointmentPayload(payload);
      if (validation) return res.status(400).json({ message: validation });
    }

    const { keys, values } = await pickBody(table, payload);
    if (!keys.length) return res.status(400).json({ message: "Nenhum campo valido enviado" });

    const sql = `INSERT INTO ${quoteTable(table)} (${keys.map(quoteIdentifier).join(",")}) VALUES (${keys.map(() => "?").join(",")})`;
    const [result] = await db.query(sql, values);
    return res.status(201).json(sanitizeRecord(table, { id: result.insertId, ...toRecord(keys, values) }));
  } catch (error) {
    console.error("Erro ao criar:", table, error);
    return res.status(500).json({ message: "Erro ao criar registro", detail: error.message });
  }
};

exports.update = (table) => async (req, res) => {
  try {
    tableOrFail(table);
    const payload = normalizePayload(table, req.body || {});
    const { keys, values } = await pickBody(table, payload);
    if (!keys.length) return res.status(400).json({ message: "Nenhum campo valido enviado" });

    const sql = `UPDATE ${quoteTable(table)} SET ${keys.map((key) => `${quoteIdentifier(key)} = ?`).join(", ")} WHERE id = ?`;
    await db.query(sql, [...values, req.params.id]);
    return res.json({ message: "Atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar:", table, error);
    return res.status(500).json({ message: "Erro ao atualizar registro", detail: error.message });
  }
};

exports.remove = (table) => async (req, res) => {
  try {
    tableOrFail(table);
    let result;
    let softDeleted = false;

    if (table === "customers") result = await deleteCustomerCascade(req.params.id);
    else if (table === "pets") result = await deletePetCascade(req.params.id);
    else if (table === "appointments") result = await deleteAppointmentCascade(req.params.id);
    else if (table === "services") {
      const serviceResult = await removeService(req.params.id);
      result = serviceResult.result;
      softDeleted = serviceResult.softDeleted;
    } else {
      [result] = await db.query(`DELETE FROM ${quoteTable(table)} WHERE id = ?`, [req.params.id]);
    }

    if (!result.affectedRows) return res.status(404).json({ message: "Registro nao encontrado" });
    return res.json({ message: softDeleted ? "Servico vinculado a agendamentos, entao foi desativado com sucesso" : "Removido com sucesso" });
  } catch (error) {
    console.error("Erro ao remover:", table, error);
    return res.status(500).json({ message: "Erro ao remover registro", detail: error.message });
  }
};
