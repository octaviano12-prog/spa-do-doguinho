require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./config/db");

async function main() {
  const name = process.argv[2] || "Administrador";
  const email = process.argv[3] || "admin@spadodoguinho.com.br";
  const password = process.argv[4] || "admin123456";

  const [exists] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
  if (exists.length) {
    console.log("Usuário admin já existe:", email);
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
    [name, email, hash]
  );

  console.log("Admin criado:", email, "senha:", password);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
