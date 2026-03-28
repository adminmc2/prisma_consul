/**
 * CORS Middleware
 * Centraliza headers CORS para todas las rutas API
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
};

function cors(req, res, next) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.set(key, value);
  });
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
}

module.exports = cors;
