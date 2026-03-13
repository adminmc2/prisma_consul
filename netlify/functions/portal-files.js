/**
 * Netlify Function: Portal Files (list, delete, rename) on Google Drive
 */

const jwt = require('jsonwebtoken');
const { google } = require('googleapis');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, DELETE, PATCH, OPTIONS',
  'Content-Type': 'application/json'
};

function verifyToken(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.slice(7), process.env.PORTAL_SECRET);
  } catch {
    return null;
  }
}

function getDriveClient() {
  const keyJson = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const auth = new google.auth.GoogleAuth({
    credentials: keyJson,
    scopes: ['https://www.googleapis.com/auth/drive'],
    clientOptions: { subject: 'info@prismaconsul.com' }
  });
  return google.drive({ version: 'v3', auth });
}

function getParam(event, key) {
  return (event.queryStringParameters || {})[key] || '';
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  const user = verifyToken(event);
  if (!user) {
    return {
      statusCode: 401,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'No autorizado' })
    };
  }

  const drive = getDriveClient();
  const action = getParam(event, 'action');
  const fileId = getParam(event, 'fileId');

  try {
    // ── DELETE ──
    if (event.httpMethod === 'DELETE' && action === 'delete' && fileId) {
      await drive.files.delete({ fileId });
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ ok: true })
      };
    }

    // ── RENAME ──
    if (event.httpMethod === 'PATCH' && action === 'rename' && fileId) {
      const body = JSON.parse(event.body || '{}');
      if (!body.name) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: 'Nombre requerido' })
        };
      }
      const response = await drive.files.update({
        fileId,
        requestBody: { name: body.name },
        fields: 'id, name'
      });
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ id: response.data.id, name: response.data.name })
      };
    }

    // ── LIST (GET) ──
    if (event.httpMethod === 'GET') {
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

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ files })
      };
    }

    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Portal files error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Error en operación de archivo' })
    };
  }
};
