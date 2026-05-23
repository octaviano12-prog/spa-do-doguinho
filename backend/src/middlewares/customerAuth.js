const jwt = require("jsonwebtoken");

module.exports = function customerAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null;

    if (!token) {
      return res.status(401).json({ error: "Acesso do cliente não autorizado." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "spadodoguinho123");

    if (decoded.type !== "customer" && decoded.role !== "customer") {
      return res.status(403).json({ error: "Acesso restrito ao cliente." });
    }

    req.customer = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Sessão do cliente inválida." });
  }
};
