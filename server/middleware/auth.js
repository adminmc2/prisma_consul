/**
 * Auth Middleware
 * Verifica JWT en header Authorization: Bearer <token>
 * Añade req.user con payload del token
 */

const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    req.user = jwt.verify(authHeader.slice(7), process.env.PORTAL_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = auth;
