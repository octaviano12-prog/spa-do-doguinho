const db = require("../config/db");

async function safeDelete(table, where, params) {
  await db.query(`DELETE FROM ${table} WHERE ${where}`, params);
}

exports.deletePetCascade = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const petId = req.params.id;
    await conn.beginTransaction();
    await conn.query("DELETE FROM appointments WHERE pet_id = ?", [petId]);
    await conn.query("DELETE FROM service_history WHERE pet_id = ?", [petId]);
    await conn.query("DELETE FROM vaccines WHERE pet_id = ?", [petId]);
    await conn.query("DELETE FROM vaccinations WHERE pet_id = ?", [petId]);
    const [result] = await conn.query("DELETE FROM pets WHERE id = ?", [petId]);
    await conn.commit();

    if (!result.affectedRows) return res.status(404).json({ message: "Pet não encontrado" });
    return res.json({ message: "Pet e vínculos removidos com sucesso" });
  } catch (error) {
    await conn.rollback();
    console.error("Erro cascade pet:", error);
    return res.status(500).json({ message: "Erro ao remover pet", detail: error.message });
  } finally {
    conn.release();
  }
};

exports.deleteCustomerCascade = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const customerId = req.params.id;
    await conn.beginTransaction();

    const [pets] = await conn.query("SELECT id FROM pets WHERE customer_id = ?", [customerId]);
    for (const pet of pets) {
      await conn.query("DELETE FROM appointments WHERE pet_id = ?", [pet.id]);
      await conn.query("DELETE FROM service_history WHERE pet_id = ?", [pet.id]);
      await conn.query("DELETE FROM vaccines WHERE pet_id = ?", [pet.id]);
      await conn.query("DELETE FROM vaccinations WHERE pet_id = ?", [pet.id]);
    }

    await conn.query("DELETE FROM appointments WHERE customer_id = ?", [customerId]);
    await conn.query("DELETE FROM pets WHERE customer_id = ?", [customerId]);
    const [result] = await conn.query("DELETE FROM customers WHERE id = ?", [customerId]);
    await conn.commit();

    if (!result.affectedRows) return res.status(404).json({ message: "Cliente não encontrado" });
    return res.json({ message: "Cliente e vínculos removidos com sucesso" });
  } catch (error) {
    await conn.rollback();
    console.error("Erro cascade cliente:", error);
    return res.status(500).json({ message: "Erro ao remover cliente", detail: error.message });
  } finally {
    conn.release();
  }
};
