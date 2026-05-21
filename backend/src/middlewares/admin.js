module.exports = function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Acesso permitido apenas para administrador" });
  }
  return next();
};
