/**
 * Portal Routes
 * Auth (login), file upload (Google Drive), file management (list/delete/rename)
 */

const express = require('express');
const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Busboy = require('busboy');
const { Readable } = require('stream');
const auth = require('../middleware/auth');
const { getDriveClient } = require('../lib/google-drive');

const router = express.Router();

// ── LOGIN ──────────────────────────────────────────────

router.post('/portal-auth', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const secret = process.env.PORTAL_SECRET;
    const databaseUrl = process.env.DATABASE_URL;

    if (!secret || !databaseUrl) {
      console.error('PORTAL_SECRET or DATABASE_URL not configured');
      return res.status(500).json({ error: 'Error de configuración del servidor' });
    }

    const sql = neon(databaseUrl);

    const users = await sql`
      SELECT id, email, password_hash, nombre, empresa, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector
      FROM portal_users
      WHERE LOWER(email) = LOWER(${email})
    `;

    if (!users.length) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = users[0];

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    await sql`UPDATE portal_users SET last_login = NOW() WHERE id = ${user.id}`;

    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombre },
      secret,
      { expiresIn: '24h' }
    );

    const empresa = {
      nombre: user.empresa,
      rfc: user.rfc,
      direccion: user.direccion,
      ciudad: user.ciudad,
      cp: user.cp,
      telefono: user.telefono,
      contacto_principal: user.contacto_principal,
      cargo: user.cargo,
      sector: user.sector
    };

    res.json({ token, email: user.email, nombre: user.nombre, empresa });

  } catch (error) {
    console.error('Portal auth error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ── FILE UPLOAD ────────────────────────────────────────

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: { 'content-type': req.headers['content-type'] }
    });

    const files = [];

    busboy.on('file', (fieldname, stream, info) => {
      const { filename, mimeType } = info;
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => {
        files.push({ fieldname, filename, mimeType, buffer: Buffer.concat(chunks) });
      });
    });

    busboy.on('finish', () => resolve(files));
    busboy.on('error', reject);

    // req.rawBody is set by the raw body middleware in server.js
    if (req.rawBody) {
      const readable = new Readable();
      readable.push(req.rawBody);
      readable.push(null);
      readable.pipe(busboy);
    } else {
      req.pipe(busboy);
    }
  });
}

router.post('/portal-upload', auth, async (req, res) => {
  try {
    const files = await parseMultipart(req);

    if (!files.length) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    const drive = getDriveClient();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const uploaded = [];

    for (const file of files) {
      const response = await drive.files.create({
        requestBody: {
          name: file.filename,
          parents: [folderId]
        },
        media: {
          mimeType: file.mimeType,
          body: Readable.from(file.buffer)
        },
        fields: 'id, name, size, createdTime, webViewLink'
      });

      uploaded.push({
        id: response.data.id,
        name: response.data.name,
        size: response.data.size,
        createdTime: response.data.createdTime,
        link: response.data.webViewLink
      });
    }

    res.json({ files: uploaded });

  } catch (error) {
    console.error('Portal upload error:', error);
    res.status(500).json({ error: 'Error al subir archivo' });
  }
});

// ── FILE MANAGEMENT (list, delete, rename) ─────────────

router.get('/portal-files', auth, async (req, res) => {
  try {
    const drive = getDriveClient();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, size, mimeType, createdTime, webViewLink)',
      orderBy: 'createdTime desc',
      pageSize: 100
    });

    const files = (response.data.files || []).map(f => ({
      id: f.id,
      name: f.name,
      size: f.size ? parseInt(f.size) : 0,
      mimeType: f.mimeType,
      createdTime: f.createdTime,
      link: f.webViewLink
    }));

    res.json({ files });

  } catch (error) {
    console.error('Portal files list error:', error);
    res.status(500).json({ error: 'Error en operación de archivo' });
  }
});

router.delete('/portal-files', auth, async (req, res) => {
  try {
    const fileId = req.query.fileId;
    if (!fileId) {
      return res.status(400).json({ error: 'fileId requerido' });
    }

    const drive = getDriveClient();
    await drive.files.delete({ fileId });
    res.json({ ok: true });

  } catch (error) {
    console.error('Portal files delete error:', error);
    res.status(500).json({ error: 'Error en operación de archivo' });
  }
});

router.patch('/portal-files', auth, async (req, res) => {
  try {
    const fileId = req.query.fileId;
    if (!fileId || !req.body.name) {
      return res.status(400).json({ error: 'fileId y nombre requeridos' });
    }

    const drive = getDriveClient();
    const response = await drive.files.update({
      fileId,
      requestBody: { name: req.body.name },
      fields: 'id, name'
    });

    res.json({ id: response.data.id, name: response.data.name });

  } catch (error) {
    console.error('Portal files rename error:', error);
    res.status(500).json({ error: 'Error en operación de archivo' });
  }
});

module.exports = router;
