const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---

// CORS
app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  });
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

// JSON body parser (skip multipart requests)
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

// --- Netlify Function Adapter ---

function netlifyAdapter(handlerPath) {
  const handler = require(handlerPath).handler;

  return async (req, res) => {
    // Build Netlify-compatible event object
    const event = {
      httpMethod: req.method,
      headers: req.headers,
      queryStringParameters: req.query || {},
      body: null,
      isBase64Encoded: false
    };

    // Handle body based on content type
    if (req.rawBody) {
      // Multipart: pass as base64 (same as Netlify)
      event.body = req.rawBody.toString('base64');
      event.isBase64Encoded = true;
    } else if (req.body) {
      event.body = JSON.stringify(req.body);
    }

    try {
      const result = await handler(event, {});

      // Set response headers
      if (result.headers) {
        Object.entries(result.headers).forEach(([key, value]) => {
          res.set(key, value);
        });
      }

      res.status(result.statusCode || 200).send(result.body);
    } catch (error) {
      console.error(`Error in ${handlerPath}:`, error);
      res.status(500).json({ error: error.message });
    }
  };
}

// --- API Routes ---

const functionsDir = path.join(__dirname, '..', 'netlify', 'functions');

// Portal
app.post('/api/portal-auth', netlifyAdapter(path.join(functionsDir, 'portal-auth')));
app.all('/api/portal-upload', netlifyAdapter(path.join(functionsDir, 'portal-upload')));
app.all('/api/portal-files', netlifyAdapter(path.join(functionsDir, 'portal-files')));

// APEX
app.post('/api/research-company', netlifyAdapter(path.join(functionsDir, 'research-company')));
app.post('/api/generate-questions', netlifyAdapter(path.join(functionsDir, 'generate-questions')));
app.post('/api/submit-form', netlifyAdapter(path.join(functionsDir, 'submit-form')));

// Groq
app.post('/api/groq-chat', netlifyAdapter(path.join(functionsDir, 'groq-chat')));
app.post('/api/groq-whisper', netlifyAdapter(path.join(functionsDir, 'groq-whisper')));

// --- Static Files ---

const projectRoot = path.join(__dirname, '..');

// Serve static files from project root
app.use(express.static(projectRoot, {
  index: 'index.html',
  extensions: ['html']
}));

// Route: /documentacion -> portal/index.html
app.get('/documentacion', (req, res) => {
  res.sendFile(path.join(projectRoot, 'portal', 'index.html'));
});

// Route: /apex -> apex/index.html (already handled by static)
// Route: / -> index.html (already handled by static)

// Fallback for SPA routes
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(projectRoot, 'index.html'));
});

// --- Start Server ---

app.listen(PORT, () => {
  console.log(`PRISMA Consul server running on port ${PORT}`);
  console.log(`  Landing:       http://localhost:${PORT}`);
  console.log(`  APEX:          http://localhost:${PORT}/apex`);
  console.log(`  Documentacion: http://localhost:${PORT}/documentacion`);
  console.log(`  API:           http://localhost:${PORT}/api/*`);
});
