const passport = require('passport');
require('../config/Passport'); // Asegúrate de importar tu configuración de Passport

// Middleware para rutas que requieren autenticación
const authMiddleware = passport.authenticate('jwt', { session: false });

// Middleware para verificar el rol de administrador
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};


module.exports = {
  authMiddleware,
  adminMiddleware,
};
