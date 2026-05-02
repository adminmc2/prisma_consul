/**
 * PRISMA Consul - Express Server
 *
 * Serves 3 frontend apps + API backend:
 *   /              → Marketing landing page
 *   /apex          → APEX Discovery Form
 *   /hub           → PRISMA Hub
 *   /api/*         → REST API
 */

const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const cors = require('./middleware/cors');
const portalRoutes = require('./routes/portal');
const apexRoutes = require('./routes/apex');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────

app.use(cors);

// JSON body parser (skip multipart — handled by portal upload)
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  }
  express.json({ limit: '50mb' })(req, res, next);
});

// Raw body capture for multipart (portal-upload needs it)
app.use((req, res, next) => {
  if (!req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  }
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    req.rawBody = Buffer.concat(chunks);
    next();
  });
});

// ── API Routes ─────────────────────────────────────────

app.use('/api', portalRoutes);   // /api/portal-auth, /api/portal-upload, /api/portal-files
app.use('/api', apexRoutes);     // /api/research-company, /api/generate-questions, /api/submit-form
app.use('/api', aiRoutes);       // /api/groq-chat, /api/groq-whisper

// ── Static Files ───────────────────────────────────────

const projectRoot = path.join(__dirname, '..');

// Web pública (landing + legales + assets compartidos: /css, /js, /images).
// Subpaso 2.1 de Fase 2 (v3.3.25): el static principal pasa a servir desde /web.
app.use(express.static(path.join(projectRoot, 'web'), {
  index: 'index.html',
  extensions: ['html']
}));

// APEX Discovery — sigue en /apex/ hasta el subpaso 2.4. Mount dedicado para
// que sus assets locales (form.css, form.js, fonts/, signal-detector.js)
// sigan resolviéndose tras reapuntar el static principal a /web.
app.use('/apex', express.static(path.join(projectRoot, 'apex'), {
  index: 'index.html',
  extensions: ['html']
}));

// PRISMA Hub — portal/index.html sigue ahí hasta el subpaso 2.3. Mount
// dedicado para los iframes de análisis ARMC bajo /portal/analisis/...
app.use('/portal', express.static(path.join(projectRoot, 'portal'), {
  extensions: ['html']
}));

// SPA routes
app.get('/hub', (req, res) => {
  res.sendFile(path.join(projectRoot, 'portal', 'index.html'));
});

// Fallback
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(projectRoot, 'web', 'index.html'));
});

// ── Start ──────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`PRISMA Consul server running on port ${PORT}`);
  console.log(`  Landing:       http://localhost:${PORT}`);
  console.log(`  APEX:          http://localhost:${PORT}/apex`);
  console.log(`  PRISMA Hub:    http://localhost:${PORT}/hub`);
  console.log(`  API:           http://localhost:${PORT}/api/*`);
});
