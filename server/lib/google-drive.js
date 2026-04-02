/**
 * Google Drive Client
 * Service Account con domain-wide delegation impersonando info@prismaconsul.com
 */

const { google } = require('googleapis');

function getDriveClient() {
  const keyJson = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const auth = new google.auth.GoogleAuth({
    credentials: keyJson,
    scopes: ['https://www.googleapis.com/auth/drive'],
    clientOptions: { subject: 'info@prismaconsul.com' }
  });
  return google.drive({ version: 'v3', auth });
}

/**
 * Obtiene o crea una subcarpeta para un usuario dentro de la carpeta raíz
 */
async function getOrCreateUserFolder(drive, parentFolderId, userId, userName) {
  // Buscar carpeta existente
  const query = `'${parentFolderId}' in parents and name = 'user_${userId}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const existing = await drive.files.list({ q: query, fields: 'files(id, name)' });

  if (existing.data.files.length > 0) {
    return existing.data.files[0].id;
  }

  // Crear carpeta nueva
  const folder = await drive.files.create({
    requestBody: {
      name: `user_${userId}`,
      description: userName || `Usuario ${userId}`,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId]
    },
    fields: 'id'
  });

  return folder.data.id;
}

/**
 * Lista archivos dentro de una carpeta
 */
async function listFilesInFolder(drive, folderId) {
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, size, mimeType, createdTime, webViewLink)',
    orderBy: 'createdTime desc',
    pageSize: 100
  });
  return response.data.files || [];
}

/**
 * Mueve un archivo a otra carpeta (para migración)
 */
async function moveFileToFolder(drive, fileId, newParentId) {
  const file = await drive.files.get({ fileId, fields: 'parents' });
  const previousParents = file.data.parents.join(',');
  await drive.files.update({
    fileId,
    addParents: newParentId,
    removeParents: previousParents,
    fields: 'id, parents'
  });
}

module.exports = { getDriveClient, getOrCreateUserFolder, listFilesInFolder, moveFileToFolder };
