const db = require("../config/db");

function padTime(value) {
  return String(value || "").slice(0, 5);
}

function addMinutes(time, minutes) {
  const [hour, minute] = padTime(time).split(":").map(Number);
  const date = new Date(2000, 0, 1, hour || 0, minute || 0, 0);
  date.setMinutes(date.getMinutes() + Number(minutes || 0));
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function timeToMinutes(time) {
  const [hour, minute] = padTime(time).split(":").map(Number);
  return (hour || 0) * 60 + (minute || 0);
}

function hasOverlap(startA, endA, startB, endB) {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(endA) > timeToMinutes(startB);
}

async function ensureLoyaltyTables(conn = db) {
  await conn.query(`CREATE TABLE IF NOT EXISTS loyalty_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    pet_id INT NOT NULL,
    service_id INT NOT NULL,
    name VARCHAR(160) NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(40) DEFAULT 'cash',
    payment_status VARCHAR(40) DEFAULT 'pending',
    status VARCHAR(40) DEFAULT 'active',
    notes TEXT NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_loyalty_customer (customer_id),
    INDEX idx_loyalty_pet (pet_id),
    INDEX idx_loyalty_service (service_id),
    INDEX idx_loyalty_status (status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  await conn.query(`CREATE TABLE IF NOT EXISTS loyalty_package_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    package_id INT NOT NULL,
    customer_id INT NOT NULL,
    pet_id INT NOT NULL,
    service_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    status VARCHAR(40) DEFAULT 'reserved',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_loyalty_slots_date_time (date, time),
    INDEX idx_loyalty_slots_package (package_id),
    INDEX idx_loyalty_slots_customer (customer_id),
    CONSTRAINT fk_loyalty_slots_package
      FOREIGN KEY (package_id) REFERENCES loyalty_packages(id)
      ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}

async function getLoyaltyBusySlots(date, conn = db) {
  const [rows] = await conn.query(
    `SELECT slot.id, slot.package_id, slot.date, slot.time, slot.duration_minutes, slot.status,
            pkg.name AS package_name, pkg.status AS package_status
     FROM loyalty_package_slots slot
     INNER JOIN loyalty_packages pkg ON pkg.id = slot.package_id
     WHERE slot.date = ?
       AND slot.status NOT IN ('canceled', 'cancelado')
       AND pkg.status NOT IN ('canceled', 'cancelado', 'inactive', 'inativo')`,
    [date]
  );

  return rows.map((slot) => {
    const start = padTime(slot.time);
    return {
      id: slot.id,
      package_id: slot.package_id,
      package_name: slot.package_name,
      start,
      end: addMinutes(start, Number(slot.duration_minutes || 60)),
      duration_minutes: Number(slot.duration_minutes || 60)
    };
  });
}

module.exports = {
  addMinutes,
  ensureLoyaltyTables,
  getLoyaltyBusySlots,
  hasOverlap,
  padTime,
  timeToMinutes
};
