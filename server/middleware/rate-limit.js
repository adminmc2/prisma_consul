/**
 * Rate Limiting — P-7
 * Límite por IP real sobre los 5 endpoints públicos del discovery
 * (sin login desde v3.5.0). Dos buckets en memoria por proceso:
 *   - heavyLimiter (15/h): research-company + generate-questions + submit-form
 *   - interactiveLimiter (60/h): groq-chat + groq-whisper
 *
 * La IP se deriva con keyGenerator explícito (CF-Connecting-IP →
 * X-Forwarded-For → req.ip); NO se usa trust proxy — decisión del
 * revisor en el cierre de P-7. Detrás de Cloudflare + nginx,
 * CF-Connecting-IP trae la IP real del visitante; en local no existe
 * y cae al fallback.
 */

const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

function clientIp(req) {
  return req.headers['cf-connecting-ip']
    || req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.ip
    || req.socket?.remoteAddress
    || 'unknown';
}

function makeLimiter(limit) {
  return rateLimit({
    windowMs: 60 * 60 * 1000,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    // Validaciones internas desactivadas: asumen el keyGenerator por
    // defecto basado en trust proxy, que aquí queda fuera del alcance.
    validate: false,
    // ipKeyGenerator normaliza IPv6 a subred /56 (evita eludir el
    // límite rotando direcciones dentro del mismo prefijo).
    keyGenerator: (req) => ipKeyGenerator(clientIp(req)),
    handler: (req, res) => {
      res.status(429).json({
        error: 'rate_limited',
        message: 'Has alcanzado el límite temporal de uso. Espera unos minutos e inténtalo de nuevo.'
      });
    }
  });
}

module.exports = {
  heavyLimiter: makeLimiter(15),
  interactiveLimiter: makeLimiter(60)
};
