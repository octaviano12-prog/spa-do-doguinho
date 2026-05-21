const db = require("../config/db");

exports.create = async (req, res) => {
  try {
    const {
      customer_name,
      pet_name,
      service_id,
      scheduled_at,
      notes,
    } = req.body;

    if (!customer_name || !pet_name || !service_id || !scheduled_at) {
      return res.status(400).json({
        message: "Preencha nome, pet, serviço e horário.",
      });
    }

    const [serviceRows] = await db.query(
      "SELECT id FROM services WHERE id = ? AND active = 1",
      [service_id]
    );

    if (!serviceRows.length) {
      return res.status(400).json({
        message: "Serviço indisponível para agendamento.",
      });
    }

    const [busyRows] = await db.query(
      "SELECT id FROM appointments WHERE scheduled_at = ? AND status NOT IN ('canceled', 'cancelado') LIMIT 1",
      [scheduled_at]
    );

    if (busyRows.length) {
      return res.status(409).json({
        message: "Horário já reservado. Escolha outro horário.",
      });
    }

    const [customerResult] = await db.query(
      "INSERT INTO customers (name, notes) VALUES (?, ?)",
      [customer_name, "Criado pelo agendamento público"]
    );

    const customerId = customerResult.insertId;

    const [petResult] = await db.query(
      "INSERT INTO pets (customer_id, name, species, notes) VALUES (?, ?, ?, ?)",
      [customerId, pet_name, "Cachorro", "Criado pelo agendamento público"]
    );

    const petId = petResult.insertId;

    const [appointmentResult] = await db.query(
      `
      INSERT INTO appointments
      (customer_id, pet_id, service_id, scheduled_at, status, notes)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        customerId,
        petId,
        service_id,
        scheduled_at,
        "pending",
        notes || "Agendamento criado pelo site público",
      ]
    );

    return res.status(201).json({
      message: "Agendamento criado com sucesso",
      appointment_id: appointmentResult.insertId,
      customer_id: customerId,
      pet_id: petId,
    });
  } catch (error) {
    console.error("Erro public booking:", error);

    return res.status(500).json({
      message: "Erro ao criar agendamento",
    });
  }
};
const db = require("../config/db");

exports.create = async (req, res) => {
  try {
    const {
      customer_name,
      pet_name,
      service_id,
      scheduled_at,
      notes,
    } = req.body;

    if (!customer_name || !pet_name || !service_id || !scheduled_at) {
      return res.status(400).json({
        message: "Preencha nome, pet, serviço e horário.",
      });
    }

    const [customerResult] = await db.query(
      "INSERT INTO customers (name, notes) VALUES (?, ?)",
      [customer_name, "Criado pelo agendamento público"]
    );

    const customerId = customerResult.insertId;

    const [petResult] = await db.query(
      "INSERT INTO pets (customer_id, name, species, notes) VALUES (?, ?, ?, ?)",
      [customerId, pet_name, "Cachorro", "Criado pelo agendamento público"]
    );

    const petId = petResult.insertId;

    const [appointmentResult] = await db.query(
      `
      INSERT INTO appointments
      (customer_id, pet_id, service_id, scheduled_at, status, notes)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        customerId,
        petId,
        service_id,
        scheduled_at,
        "pending",
        notes || "Agendamento criado pelo site público",
      ]
    );

    return res.status(201).json({
      message: "Agendamento criado com sucesso",
      appointment_id: appointmentResult.insertId,
      customer_id: customerId,
      pet_id: petId,
    });
  } catch (error) {
    console.error("Erro public booking:", error);

    return res.status(500).json({
      message: "Erro ao criar agendamento",
    });
  }
};
