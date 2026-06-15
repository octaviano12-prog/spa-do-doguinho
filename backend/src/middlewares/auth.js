const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "spadodoguinho123";

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token nao enviado"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Token nao enviado"
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      error: "Token invalido"
    });
  }
};
