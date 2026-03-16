/**
 * API: Portal File Upload to Google Drive
 * Recibe archivo multipart, valida JWT y sube a Google Drive
 */

const jwt = require('jsonwebtoken');
const Busboy = require('busboy');
const { google } = require('googleapis');
const { Readable } = require('stream');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: { 'content-type': event.headers['content-type'] || event.headers['Content-Type'] }
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

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body);

    const readable = new Readable();
    readable.push(body);
    readable.push(null);
    readable.pipe(busboy);
  });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const user = verifyToken(event);
  if (!user) {
    return {
      statusCode: 401,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'No autorizado' })
    };
  }

  try {
    const files = await parseMultipart(event);

    if (!files.length) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'No se recibió ningún archivo' })
      };
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

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ files: uploaded })
    };

  } catch (error) {
    console.error('Portal upload error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Error al subir archivo' })
    };
  }
};
