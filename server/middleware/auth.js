/**
 * Auth Middleware
 * Verifica JWT en header Authorization: Bearer <token>
 * Añade req.user con payload del token (id, email, nombre, role)
 */

const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const payload = jwt.verify(authHeader.slice(7), process.env.PORTAL_SECRET);
    // Compatibilidad: tokens antiguos sin role se tratan como 'user'
    payload.role = payload.role || 'user';
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }
  next();
}

module.exports = { auth, requireAdmin };
