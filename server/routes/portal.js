/**
 * Portal Routes
 * Auth (login), file upload (Google Drive), file management, user management, activity log
 */

const express = require('express');
const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Busboy = require('busboy');
const { Readable } = require('stream');
const { auth, requireAdmin } = require('../middleware/auth');
const { getDriveClient, getOrCreateUserFolder, listFilesInFolder } = require('../lib/google-drive');

const router = express.Router();

// ── Helpers ──────────────────────────────────────────────

function getSQL() {
  return neon(process.env.DATABASE_URL);
}

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
}

async function logActivity(sql, userId, action, details, ip) {
  try {
    await sql`INSERT INTO portal_activity_log (user_id, action, details, ip_address) VALUES (${userId}, ${action}, ${JSON.stringify(details)}, ${ip})`;
  } catch (e) {
    console.error('Activity log error:', e.message);
  }
}

async function ensureUserFolder(sql, drive, user) {
  if (user.drive_folder_id) return user.drive_folder_id;
  const folderId = await getOrCreateUserFolder(drive, process.env.GOOGLE_DRIVE_FOLDER_ID, user.id, user.nombre || user.email);
  await sql`UPDATE portal_users SET drive_folder_id = ${folderId} WHERE id = ${user.id}`;
  return folderId;
}

// ── LOGIN ──────────────────────────────────────────────

router.post('/portal-auth', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const secret = process.env.PORTAL_SECRET;
    if (!secret || !process.env.DATABASE_URL) {
      console.error('PORTAL_SECRET or DATABASE_URL not configured');
      return res.status(500).json({ error: 'Error de configuración del servidor' });
    }

    const sql = getSQL();

    const users = await sql`
      SELECT id, email, password_hash, nombre, empresa, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector, role, current_phase, profile_type, apex_submission_id, drive_folder_id
      FROM portal_users
      WHERE LOWER(email) = LOWER(${email})
    `;

    if (!users.length) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = users[0];
    const role = user.role || 'user';

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    await sql`UPDATE portal_users SET last_login = NOW() WHERE id = ${user.id}`;

    // Asegurar carpeta Drive del usuario
    const drive = getDriveClient();
    const driveFolderId = await ensureUserFolder(sql, drive, user);

    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombre, role },
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

    await logActivity(sql, user.id, 'login', { email: user.email }, getClientIP(req));

    res.json({ token, id: user.id, email: user.email, nombre: user.nombre, role, current_phase: user.current_phase, profile_type: user.profile_type, apex_submission_id: user.apex_submission_id, empresa });

  } catch (error) {
    console.error('Portal auth error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ── APEX RESULTS FOR USER ────────────────────────────────
router.get('/portal-apex-results', auth, async (req, res) => {
  try {
    const sql = getSQL();
    // Admin can view another user's APEX results
    let targetUserId = req.user.id;
    if (req.query.userId && req.user.role === 'admin') targetUserId = parseInt(req.query.userId);
    const users = await sql`SELECT apex_submission_id FROM portal_users WHERE id = ${targetUserId}`;
    if (!users.length || !users[0].apex_submission_id) {
      return res.json({ submission: null });
    }
    const subId = users[0].apex_submission_id;
    const rows = await sql`
      SELECT id, created_at, empresa_nombre, empresa_contacto, empresa_email, empresa_whatsapp,
             empresa_tamano, empresa_sector, investigacion_empresa,
             respuestas_fase1, respuestas_fase2,
             pains_detectados_inicial, confirmacion_pains, pains_finales,
             audio_transcripcion, experiencias_sugeridas, plan_recomendado
      FROM apex_submissions WHERE id = ${subId}
    `;
    if (!rows.length) return res.json({ submission: null });
    res.json({ submission: rows[0] });
  } catch (error) {
    console.error('APEX results error:', error);
    res.status(500).json({ error: 'Error al obtener resultados APEX' });
  }
});

// ── USER PROFILE ─────────────────────────────────────────
router.get('/portal-profile', auth, async (req, res) => {
  try {
    const sql = getSQL();
    // Admin can view another user's profile
    let targetUserId = req.user.id;
    if (req.query.userId && req.user.role === 'admin') targetUserId = parseInt(req.query.userId);
    const rows = await sql`SELECT id, email, nombre, empresa, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector FROM portal_users WHERE id = ${targetUserId}`;
    if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ user: rows[0] });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

router.patch('/portal-profile', auth, async (req, res) => {
  try {
    const sql = getSQL();
    const b = req.body;
    // Users can only edit these fields (not role, phase, etc.)
    const result = await sql`
      UPDATE portal_users SET
        nombre = COALESCE(${b.nombre !== undefined ? b.nombre : null}, nombre),
        empresa = COALESCE(${b.empresa !== undefined ? b.empresa : null}, empresa),
        rfc = COALESCE(${b.rfc !== undefined ? b.rfc : null}, rfc),
        direccion = COALESCE(${b.direccion !== undefined ? b.direccion : null}, direccion),
        ciudad = COALESCE(${b.ciudad !== undefined ? b.ciudad : null}, ciudad),
        cp = COALESCE(${b.cp !== undefined ? b.cp : null}, cp),
        telefono = COALESCE(${b.telefono !== undefined ? b.telefono : null}, telefono),
        contacto_principal = COALESCE(${b.contacto_principal !== undefined ? b.contacto_principal : null}, contacto_principal),
        cargo = COALESCE(${b.cargo !== undefined ? b.cargo : null}, cargo),
        sector = COALESCE(${b.sector !== undefined ? b.sector : null}, sector)
      WHERE id = ${req.user.id}
      RETURNING id, email, nombre, empresa, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector
    `;
    if (!result.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    await logActivity(sql, req.user.id, 'profile_updated', { changes: Object.keys(b) }, getClientIP(req));
    res.json({ user: result[0] });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

// ── FILE UPLOAD ────────────────────────────────────────

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: { 'content-type': req.headers['content-type'] }
    });

    const files = [];
    const fields = {};

    busboy.on('field', (name, value) => {
      fields[name] = value;
    });

    busboy.on('file', (fieldname, stream, info) => {
      const { filename, mimeType } = info;
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => {
        files.push({ fieldname, filename, mimeType, buffer: Buffer.concat(chunks) });
      });
    });

    busboy.on('finish', () => resolve({ files, fields }));
    busboy.on('error', reject);

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
    const { files, fields } = await parseMultipart(req);

    if (!files.length) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    const sql = getSQL();
    const drive = getDriveClient();

    // Obtener carpeta del usuario (o del usuario objetivo si admin sube para otro)
    let targetUserId = req.user.id;
    if (req.user.role === 'admin' && fields.userId) {
      targetUserId = parseInt(fields.userId);
    }

    const userRows = await sql`SELECT id, nombre, email, drive_folder_id FROM portal_users WHERE id = ${targetUserId}`;
    if (!userRows.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const targetUser = userRows[0];
    const userFolderId = await ensureUserFolder(sql, drive, targetUser);

    const uploaded = [];
    const docType = fields.docType || 'general';
    const displayName = fields.displayName || '';

    // Generate systematic prefix from user name/empresa
    const prefix = (targetUser.nombre || targetUser.email.split('@')[0])
      .toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'file';

    // Get current file count for sequencing
    const countRows = await sql`SELECT COUNT(*)::int AS cnt FROM portal_files WHERE user_id = ${targetUserId}`;
    let nextNum = (countRows[0]?.cnt || 0) + 1;

    for (const file of files) {
      // Systematic Drive name: prefix_001.ext
      const ext = file.filename.includes('.') ? '.' + file.filename.split('.').pop().toLowerCase() : '';
      const driveName = `${prefix}_${String(nextNum).padStart(3, '0')}${ext}`;
      const title = displayName || file.filename;

      const response = await drive.files.create({
        requestBody: {
          name: driveName,
          parents: [userFolderId]
        },
        media: {
          mimeType: file.mimeType,
          body: Readable.from(file.buffer)
        },
        fields: 'id, name, size, createdTime, webViewLink'
      });

      await sql`INSERT INTO portal_files (drive_file_id, user_id, file_name, display_name, file_size, mime_type, doc_type) VALUES (${response.data.id}, ${targetUserId}, ${driveName}, ${title}, ${parseInt(response.data.size || '0')}, ${file.mimeType}, ${docType})`;

      uploaded.push({
        id: response.data.id,
        name: title,
        driveName,
        size: response.data.size,
        createdTime: response.data.createdTime,
        link: response.data.webViewLink
      });

      nextNum++;
    }

    await logActivity(sql, req.user.id, 'upload', {
      files: uploaded.map(f => f.name),
      targetUserId,
      docType
    }, getClientIP(req));

    res.json({ files: uploaded });

  } catch (error) {
    console.error('Portal upload error:', error);
    res.status(500).json({ error: 'Error al subir archivo' });
  }
});

// ── FILE MANAGEMENT (list, delete, rename) ─────────────

router.get('/portal-files', auth, async (req, res) => {
  try {
    const sql = getSQL();
    const drive = getDriveClient();

    // Admin puede ver archivos de cualquier usuario con ?userId=X
    let targetUserId = req.user.id;
    if (req.user.role === 'admin' && req.query.userId) {
      targetUserId = parseInt(req.query.userId);
    }

    const userRows = await sql`SELECT id, drive_folder_id, nombre, email FROM portal_users WHERE id = ${targetUserId}`;
    if (!userRows.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const targetUser = userRows[0];
    const userFolderId = await ensureUserFolder(sql, drive, targetUser);

    const driveFiles = await listFilesInFolder(drive, userFolderId);

    // Enrich with display_name and doc_type from DB
    const dbFiles = await sql`SELECT drive_file_id, display_name, doc_type FROM portal_files WHERE user_id = ${targetUserId}`;
    const dbMap = {};
    dbFiles.forEach(f => { dbMap[f.drive_file_id] = f; });

    const files = driveFiles.map(f => ({
      id: f.id,
      name: dbMap[f.id]?.display_name || f.name,
      driveName: f.name,
      size: f.size ? parseInt(f.size) : 0,
      mimeType: f.mimeType,
      createdTime: f.createdTime,
      link: f.webViewLink,
      docType: dbMap[f.id]?.doc_type || 'general'
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

    const sql = getSQL();

    // Verificar propiedad (admin puede borrar cualquiera)
    if (req.user.role !== 'admin') {
      const ownership = await sql`SELECT id FROM portal_files WHERE drive_file_id = ${fileId} AND user_id = ${req.user.id}`;
      if (!ownership.length) {
        return res.status(403).json({ error: 'No tienes permiso para eliminar este archivo' });
      }
    }

    const drive = getDriveClient();

    // Obtener nombre antes de borrar para el log
    const fileInfo = await sql`SELECT file_name FROM portal_files WHERE drive_file_id = ${fileId}`;
    const fileName = fileInfo[0]?.file_name || 'desconocido';

    await drive.files.delete({ fileId });
    await sql`DELETE FROM portal_files WHERE drive_file_id = ${fileId}`;

    await logActivity(sql, req.user.id, 'delete', { fileId, fileName }, getClientIP(req));

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

    const sql = getSQL();

    // Verificar propiedad (admin puede renombrar cualquiera)
    if (req.user.role !== 'admin') {
      const ownership = await sql`SELECT id FROM portal_files WHERE drive_file_id = ${fileId} AND user_id = ${req.user.id}`;
      if (!ownership.length) {
        return res.status(403).json({ error: 'No tienes permiso para renombrar este archivo' });
      }
    }

    const oldInfo = await sql`SELECT display_name FROM portal_files WHERE drive_file_id = ${fileId}`;
    const oldName = oldInfo[0]?.display_name || '';

    // Only update display_name in DB — Drive keeps the systematic name
    await sql`UPDATE portal_files SET display_name = ${req.body.name} WHERE drive_file_id = ${fileId}`;

    await logActivity(sql, req.user.id, 'rename', { fileId, oldName, newName: req.body.name }, getClientIP(req));

    res.json({ id: fileId, name: req.body.name });

  } catch (error) {
    console.error('Portal files rename error:', error);
    res.status(500).json({ error: 'Error en operación de archivo' });
  }
});

// ── ADMIN: USER MANAGEMENT ─────────────────────────────

router.get('/portal-users', auth, requireAdmin, async (req, res) => {
  try {
    const sql = getSQL();

    const users = await sql`
      SELECT
        u.id, u.email, u.nombre, u.empresa, u.rfc, u.direccion, u.ciudad, u.cp,
        u.telefono, u.contacto_principal, u.cargo, u.sector,
        u.role, u.current_phase, u.profile_type, u.apex_submission_id, u.created_at, u.last_login,
        COUNT(f.id)::int AS file_count,
        COALESCE(SUM(f.file_size), 0)::bigint AS total_size
      FROM portal_users u
      LEFT JOIN portal_files f ON f.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;

    res.json({ users });

  } catch (error) {
    console.error('Portal users list error:', error);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
});

router.post('/portal-users', auth, requireAdmin, async (req, res) => {
  try {
    const { email, password, nombre, empresa, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const sql = getSQL();

    // Verificar que no exista
    const existing = await sql`SELECT id FROM portal_users WHERE LOWER(email) = LOWER(${email})`;
    if (existing.length) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO portal_users (email, password_hash, nombre, empresa, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector, role)
      VALUES (${email}, ${password_hash}, ${nombre || ''}, ${empresa || ''}, ${rfc || ''}, ${direccion || ''}, ${ciudad || ''}, ${cp || ''}, ${telefono || ''}, ${contacto_principal || ''}, ${cargo || ''}, ${sector || ''}, 'user')
      RETURNING id, email, nombre, empresa, sector, role, created_at
    `;

    // Crear carpeta en Drive para el nuevo usuario
    const drive = getDriveClient();
    const newUser = result[0];
    const driveFolderId = await getOrCreateUserFolder(drive, process.env.GOOGLE_DRIVE_FOLDER_ID, newUser.id, nombre || email);
    await sql`UPDATE portal_users SET drive_folder_id = ${driveFolderId} WHERE id = ${newUser.id}`;

    await logActivity(sql, req.user.id, 'user_created', { targetUserId: newUser.id, email }, getClientIP(req));

    res.json({ user: { ...newUser, file_count: 0, total_size: 0 } });

  } catch (error) {
    console.error('Portal create user error:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// ── ADMIN: UPDATE USER ────────────────────────────────

router.patch('/portal-users/:id', auth, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const sql = getSQL();

    const existing = await sql`SELECT id FROM portal_users WHERE id = ${userId}`;
    if (!existing.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const b = req.body;
    const result = await sql`
      UPDATE portal_users SET
        nombre = COALESCE(${b.nombre !== undefined ? b.nombre : null}, nombre),
        empresa = COALESCE(${b.empresa !== undefined ? b.empresa : null}, empresa),
        rfc = COALESCE(${b.rfc !== undefined ? b.rfc : null}, rfc),
        direccion = COALESCE(${b.direccion !== undefined ? b.direccion : null}, direccion),
        ciudad = COALESCE(${b.ciudad !== undefined ? b.ciudad : null}, ciudad),
        cp = COALESCE(${b.cp !== undefined ? b.cp : null}, cp),
        telefono = COALESCE(${b.telefono !== undefined ? b.telefono : null}, telefono),
        contacto_principal = COALESCE(${b.contacto_principal !== undefined ? b.contacto_principal : null}, contacto_principal),
        cargo = COALESCE(${b.cargo !== undefined ? b.cargo : null}, cargo),
        sector = COALESCE(${b.sector !== undefined ? b.sector : null}, sector),
        current_phase = COALESCE(${b.current_phase !== undefined ? b.current_phase : null}, current_phase),
        profile_type = COALESCE(${b.profile_type !== undefined ? b.profile_type : null}, profile_type),
        apex_submission_id = COALESCE(${b.apex_submission_id !== undefined ? b.apex_submission_id : null}, apex_submission_id)
      WHERE id = ${userId}
      RETURNING id, email, nombre, empresa, sector, current_phase, profile_type, apex_submission_id, role
    `;

    await logActivity(sql, req.user.id, 'user_updated', { targetUserId: userId, changes: Object.keys(b) }, getClientIP(req));

    res.json({ user: result[0] });

  } catch (error) {
    console.error('Portal update user error:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// ── ADMIN: ACTIVITY LOG ────────────────────────────────

router.get('/portal-activity', auth, requireAdmin, async (req, res) => {
  try {
    const sql = getSQL();
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = parseInt(req.query.offset) || 0;
    const userId = req.query.userId ? parseInt(req.query.userId) : null;

    let rows;
    if (userId) {
      rows = await sql`
        SELECT a.id, a.action, a.details, a.ip_address, a.created_at,
               u.email AS user_email, u.nombre AS user_nombre
        FROM portal_activity_log a
        LEFT JOIN portal_users u ON u.id = a.user_id
        WHERE a.user_id = ${userId}
        ORDER BY a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      rows = await sql`
        SELECT a.id, a.action, a.details, a.ip_address, a.created_at,
               u.email AS user_email, u.nombre AS user_nombre
        FROM portal_activity_log a
        LEFT JOIN portal_users u ON u.id = a.user_id
        ORDER BY a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    res.json({ activity: rows });

  } catch (error) {
    console.error('Portal activity error:', error);
    res.status(500).json({ error: 'Error al obtener actividad' });
  }
});

module.exports = router;
