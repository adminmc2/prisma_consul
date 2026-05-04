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

// Recursos compartidos entre apps — Subpaso 2.5 (v3.3.37): fuentes Phosphor del
// discovery centralizadas en shared/fonts/phosphor/. Mount expuesto bajo /shared.
app.use('/shared', express.static(path.join(projectRoot, 'shared')));

// /apex/fonts/* — Subpaso 2.5 (v3.3.37) movió las fuentes Phosphor a
// /shared/fonts/phosphor/. La micro-higiene de v3.3.38 marca el subtree
// retirado como 410 Gone (no 404) para que cualquier consumidor legacy
// reciba una señal clara de retiro definitivo en lugar de un 200 engañoso
// con HTML del discovery.
app.get(/^\/apex\/fonts\/.+$/, (req, res) => {
  res.status(410).type('text/plain').send('Gone — Phosphor fonts moved to /shared/fonts/phosphor/ in v3.3.37');
});

// APEX Discovery — vive en prisma-apex/core/discovery-engine/ desde Subpaso 2.4
// (v3.3.36). La URL pública /apex se mantiene idéntica.
app.use('/apex', express.static(path.join(projectRoot, 'prisma-apex', 'core', 'discovery-engine'), {
  index: 'index.html',
  extensions: ['html']
}));

// Mount /portal eliminado en la micro-higiene v3.3.38: portal/ está vacío
// tras el subpaso 2.3 (Hub movido a prisma-apex/index.html). Solo queda
// activo el redirect 301 legacy /portal/analisis/... gestionado más abajo.

// Entregables publicados por cliente — Subpaso 2.2 de Fase 2 (v3.3.31).
// URL canónica: /publicados/[cliente]/...
app.use('/publicados', express.static(path.join(projectRoot, 'prisma-apex', 'clientes-publicados'), {
  extensions: ['html']
}));

// Redirect legacy /portal/analisis/[cliente]/... → /publicados/[cliente]/...
// Fallback para entornos local/sin nginx; en remoto el redirect lo gestiona nginx.
app.get(/^\/portal\/analisis\/(.+)$/, (req, res) => {
  res.redirect(301, '/publicados/' + req.params[0]);
});

// SPA routes
// Subpaso 2.3 (v3.3.33): el Hub se sirve desde prisma-apex/index.html.
app.get('/hub', (req, res) => {
  res.sendFile(path.join(projectRoot, 'prisma-apex', 'index.html'));
});

// Fallback — micro-higiene v3.3.38: 404 honesto en text/plain. Antes devolvía
// el HTML de la landing como body, lo cual confundía al cliente cuando el
// path solicitado era un asset (browser parseaba HTML como CSS/JS/imagen).
app.get('*', (req, res) => {
  res.status(404).type('text/plain').send('Not Found');
});

// ── Start ──────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`PRISMA Consul server running on port ${PORT}`);
  console.log(`  Landing:       http://localhost:${PORT}`);
  console.log(`  APEX:          http://localhost:${PORT}/apex`);
  console.log(`  PRISMA Hub:    http://localhost:${PORT}/hub`);
  console.log(`  API:           http://localhost:${PORT}/api/*`);
});
