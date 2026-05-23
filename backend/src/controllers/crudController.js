const db = require("../config/db");

const allowed = {
  users: ["name", "email", "password", "role", "phone", "avatar_url", "active"],
  customers: ["name", "phone", "email", "cpf", "address", "city", "state", "birth_date", "notes", "active"],
  pets: ["customer_id", "name", "species", "breed", "birth_date", "age", "sex", "weight", "color", "allergies", "behavior", "notes", "observations", "photo_url", "active"],
  services: ["name", "description", "price", "duration_minutes", "active", "benefits", "image_url", "category"],
  appointments: ["customer_id", "pet_id", "service_id", "scheduled_at", "date", "time", "status", "notes", "total_price", "price", "payment_status", "payment_method", "paid_at", "mercado_pago_id"],
  payments: ["appointment_id", "customer_id", "amount", "method", "type", "status", "description", "paid_at", "mercado_pago_id", "external_reference", "transaction_id", "qr_code", "notes"],
  payment_settings: ["provider", "access_token", "public_key", "pix_enabled", "card_enabled", "cash_enabled", "deposit_required", "deposit_percent", "active"],
  cash_movements: ["type", "amount", "method", "payment_method", "category", "description", "responsible", "created_by", "movement_date"],
  cash_closings: ["closing_date", "opening_amount", "total_income", "total_expense", "final_amount", "responsible", "notes"],
  stock_items: ["name", "category", "quantity", "min_quantity", "minimum_quantity", "cost_price", "sale_price", "price", "unit", "supplier", "barcode", "notes", "active"],
  stock_movements: ["stock_item_id", "type", "quantity", "reason", "description", "responsible"],
  vaccines: ["pet_id", "name", "applied_at", "next_due", "notes"],
  vaccinations: ["pet_id", "vaccine_name", "date", "next_dose_date", "notes"],
  service_history: ["pet_id", "service_id", "appointment_id", "date", "professional", "notes", "recommendations", "next_visit"],
  gallery: ["title", "image_url", "description", "category", "active", "display_order", "sort_order"],
  availability: ["weekday", "day_of_week", "enabled", "start_time", "end_time", "interval_minutes", "max_appointments_per_slot", "active", "notes"],
  availability_rules: ["date", "start_time", "end_time", "type", "reason", "active"],
  blocked_dates: ["date", "time", "reason", "active"],
  site_settings: ["setting_key", "setting_value"],
  site_profile: ["site_name", "site_slogan", "hero_title", "hero_subtitle", "hero_button_text", "hero_banner_url", "about_title", "about_main_text", "mission", "vision", "values", "about_image_url", "services_page_title", "services_text", "benefits_text", "testimonials_text", "contact_whatsapp", "contact_instagram", "contact_phone", "contact_email", "contact_address", "contact_hours", "contact_map_link", "footer_text", "primary_color", "secondary_color", "button_color", "background_color", "text_color", "logo_url", "theme_select", "card_border_radius", "card_shadow"],
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

const orderMap = {
  appointments: "a.scheduled_at DESC, a.id DESC",
  pets: "p.id DESC",
  payments: "pay.id DESC",
  service_history: "h.date DESC, h.id DESC",
  vaccinations: "v.next_dose_date ASC, v.id DESC",
  vaccines: "v.next_due ASC, v.id DESC",
  availability: "COALESCE(day_of_week, weekday) ASC, start_time ASC",
  availability_rules: "date DESC, id DESC",
  blocked_dates: "date DESC, id DESC",
  gallery: "sort_order ASC, id DESC"
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

function getBaseSelect(table) {
  return selectMap[table] || `SELECT * FROM ${table}`;
}

function getOrder(table) {
  return orderMap[table] || "id DESC";
}

exports.allowed = allowed;

exports.list = (table) => async (req, res) => {
  try {
    tableOrFail(table);
    const { q = "", active } = req.query;
    let sql = getBaseSelect(table);
    const params = [];
    const where = [];

    if (active !== undefined && allowed[table].includes("active")) {
      where.push(`${table === "appointments" ? "a" : table[0]}.active = ?`);
      params.push(active === "true" || active === "1" ? 1 : 0);
    }

    if (q && ["customers", "services", "stock_items", "gallery"].includes(table)) {
      where.push(`(name LIKE ? OR description LIKE ? OR notes LIKE ?)`);
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (where.length) sql += ` WHERE ${where.join(" AND ")}`;
    sql += ` ORDER BY ${getOrder(table)}`;

    const [rows] = await db.query(sql, params);
    return res.json(rows);
  } catch (error) {
    console.error("Erro ao listar:", table, error);
    return res.status(500).json({ message: "Erro ao listar registros", detail: error.message });
  }
};

exports.getOne = (table) => async (req, res) => {
  try {
    tableOrFail(table);
    const sql = `${getBaseSelect(table)} WHERE ${selectMap[table] ? (table === "appointments" ? "a" : table === "payments" ? "pay" : table === "service_history" ? "h" : "v") : table}.id = ?`;
    const [rows] = await db.query(sql, [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Registro não encontrado" });
    return res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar:", table, error);
    return res.status(500).json({ message: "Erro ao buscar registro", detail: error.message });
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
    console.error("Erro ao criar:", table, error);
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
    console.error("Erro ao atualizar:", table, error);
    return res.status(500).json({ message: "Erro ao atualizar registro", detail: error.message });
  }
};

exports.remove = (table) => async (req, res) => {
  try {
    tableOrFail(table);
    await db.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
    return res.json({ message: "Removido com sucesso" });
  } catch (error) {
    console.error("Erro ao remover:", table, error);
    return res.status(500).json({ message: "Erro ao remover registro", detail: error.message });
  }
};
