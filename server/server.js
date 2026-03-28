/**
 * PRISMA Consul - Express Server
 *
 * Serves 3 frontend apps + API backend:
 *   /              → Marketing landing page
 *   /apex          → APEX Discovery Form
 *   /documentacion → Portal de Documentos
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

app.use(express.static(projectRoot, {
  index: 'index.html',
  extensions: ['html']
}));

// SPA routes
app.get('/documentacion', (req, res) => {
  res.sendFile(path.join(projectRoot, 'portal', 'index.html'));
});

// Fallback
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(projectRoot, 'index.html'));
});

// ── Start ──────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`PRISMA Consul server running on port ${PORT}`);
  console.log(`  Landing:       http://localhost:${PORT}`);
  console.log(`  APEX:          http://localhost:${PORT}/apex`);
  console.log(`  Documentacion: http://localhost:${PORT}/documentacion`);
  console.log(`  API:           http://localhost:${PORT}/api/*`);
});
