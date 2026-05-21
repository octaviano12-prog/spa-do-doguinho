CREATE DATABASE IF NOT EXISTS spa_doguinho CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE spa_doguinho;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','employee') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(30),
  email VARCHAR(120),
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  species VARCHAR(80),
  breed VARCHAR(80),
  birth_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_minutes INT NOT NULL DEFAULT 30,
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  pet_id INT NOT NULL,
  service_id INT NOT NULL,
  scheduled_at DATETIME NOT NULL,
  status ENUM('pending','confirmed','done','canceled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(50),
  type ENUM('entrada','saida') DEFAULT 'entrada',
  status ENUM('paid','pending','refunded','canceled') DEFAULT 'paid',
  description TEXT,
  paid_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS cash_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('entrada','saida') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(50),
  description TEXT,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  min_quantity INT NOT NULL DEFAULT 0,
  cost_price DECIMAL(10,2) DEFAULT 0,
  sale_price DECIMAL(10,2) DEFAULT 0,
  unit VARCHAR(20) DEFAULT 'un',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stock_item_id INT NOT NULL,
  type ENUM('entrada','saida','ajuste') NOT NULL,
  quantity INT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (stock_item_id) REFERENCES stock_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vaccines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pet_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  applied_at DATE NOT NULL,
  next_due DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120),
  image_url VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(80) NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO services (name, description, price, duration_minutes, active)
VALUES
('Banho', 'Banho completo com carinho e segurança', 60.00, 60, 1),
('Tosa', 'Tosa higiênica ou completa', 80.00, 90, 1),
('Vacina', 'Registro de vacina e acompanhamento', 120.00, 30, 1);

INSERT INTO site_settings (setting_key, setting_value)
VALUES
('business_name', 'SPA do Doguinho'),
('theme', 'verde escuro e dourado')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
CREATE DATABASE IF NOT EXISTS spa_doguinho CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE spa_doguinho;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','employee') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(30),
  email VARCHAR(120),
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  species VARCHAR(80),
  breed VARCHAR(80),
  birth_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_minutes INT NOT NULL DEFAULT 30,
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  pet_id INT NOT NULL,
  service_id INT NOT NULL,
  scheduled_at DATETIME NOT NULL,
  status ENUM('pending','confirmed','done','canceled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (pet_id) REFERENCES pets(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(50),
  type ENUM('entrada','saida') DEFAULT 'entrada',
  status ENUM('paid','pending','refunded','canceled') DEFAULT 'paid',
  description TEXT,
  paid_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS cash_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('entrada','saida') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(50),
  description TEXT,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  min_quantity INT NOT NULL DEFAULT 0,
  cost_price DECIMAL(10,2) DEFAULT 0,
  sale_price DECIMAL(10,2) DEFAULT 0,
  unit VARCHAR(20) DEFAULT 'un',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stock_item_id INT NOT NULL,
  type ENUM('entrada','saida','ajuste') NOT NULL,
  quantity INT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (stock_item_id) REFERENCES stock_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vaccines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pet_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  applied_at DATE NOT NULL,
  next_due DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120),
  image_url VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(80) NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO services (name, description, price, duration_minutes, active)
VALUES
('Banho', 'Banho completo com carinho e segurança', 60.00, 60, 1),
('Tosa', 'Tosa higiênica ou completa', 80.00, 90, 1),
('Vacina', 'Registro de vacina e acompanhamento', 120.00, 30, 1);

INSERT INTO site_settings (setting_key, setting_value)
VALUES
('business_name', 'SPA do Doguinho'),
('theme', 'verde escuro e dourado')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
