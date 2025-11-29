const jwt = require('jsonwebtoken');

// 1. Verificar si el usuario está logueado
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};

// 2. Verificar permisos específicos (Closure para pasar argumentos)
exports.hasPermission = (permissionRequired) => {
  return (req, res, next) => {
    // req.user debe haber sido llenado por verifyToken antes
    if (!req.user || !req.user.permisos.includes(permissionRequired)) {
      return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
    }
    next();
  }
};