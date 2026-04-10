/**
 * Copy interview files from shared Google Drive folder to ARMC user's folder
 *
 * Run once: cd server && node scripts/upload-interviews.js
 *
 * What it does:
 * 1. Lists files in the shared Drive folder
 * 2. Copies each to the ARMC user's subfolder with armc_ent_NNN naming
 * 3. Registers each in portal_files with doc_type = 'entrevista'
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { neon } = require('@neondatabase/serverless');
const { google } = require('googleapis');

const SHARED_FOLDER_ID = '1DsAMV0ZKQ4smnI0oidzFspp5pi6cJqdD';
const TARGET_EMAIL = 'armc@prismaconsul.com';

function getDriveClient() {
  const keyJson = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const auth = new google.auth.GoogleAuth({
    credentials: keyJson,
    scopes: ['https://www.googleapis.com/auth/drive'],
    clientOptions: { subject: 'info@prismaconsul.com' }
  });
  return google.drive({ version: 'v3', auth });
}

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const drive = getDriveClient();

  // 1. Get ARMC user
  const users = await sql`SELECT id, email, nombre, drive_folder_id FROM portal_users WHERE LOWER(email) = LOWER(${TARGET_EMAIL})`;
  if (!users.length) {
    console.error('User not found:', TARGET_EMAIL);
    process.exit(1);
  }
  const user = users[0];
  console.log(`Usuario: ${user.nombre} (${user.email}), ID: ${user.id}`);

  // 2. Ensure user has a Drive folder
  let userFolderId = user.drive_folder_id;
  if (!userFolderId) {
    const query = `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and name = 'user_${user.id}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    const existing = await drive.files.list({ q: query, fields: 'files(id)' });
    if (existing.data.files.length > 0) {
      userFolderId = existing.data.files[0].id;
    } else {
      const folder = await drive.files.create({
        requestBody: {
          name: `user_${user.id}`,
          description: user.nombre || user.email,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
        },
        fields: 'id'
      });
      userFolderId = folder.data.id;
    }
    await sql`UPDATE portal_users SET drive_folder_id = ${userFolderId} WHERE id = ${user.id}`;
    console.log('Carpeta Drive:', userFolderId);
  } else {
    console.log('Carpeta Drive:', userFolderId);
  }

  // 3. List files in shared folder
  const sharedFiles = await drive.files.list({
    q: `'${SHARED_FOLDER_ID}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
    fields: 'files(id, name, size, mimeType)',
    orderBy: 'name',
    pageSize: 100
  });

  const files = sharedFiles.data.files || [];
  console.log(`\nArchivos encontrados: ${files.length}\n`);
  files.forEach((f, i) => console.log(`  ${i + 1}. ${f.name} (${f.mimeType})`));

  if (!files.length) {
    console.log('No hay archivos para copiar.');
    return;
  }

  // 4. Get next entrevista number
  const countRows = await sql`SELECT COUNT(*)::int AS cnt FROM portal_files WHERE user_id = ${user.id} AND doc_type = 'entrevista'`;
  let nextNum = (countRows[0]?.cnt || 0) + 1;

  // 5. Copy each file
  console.log('\nCopiando archivos...\n');
  const results = [];

  for (const file of files) {
    // Google Docs (application/vnd.google-apps.*) don't have file extensions
    const isGoogleDoc = file.mimeType.startsWith('application/vnd.google-apps.');
    let ext = '';
    if (!isGoogleDoc && file.name.includes('.')) {
      ext = '.' + file.name.split('.').pop().toLowerCase();
    }
    const driveName = `armc_ent_${String(nextNum).padStart(3, '0')}${ext}`;
    // Use full original name as display name
    const displayName = file.name.trim();

    try {
      const copied = await drive.files.copy({
        fileId: file.id,
        requestBody: {
          name: driveName,
          parents: [userFolderId]
        },
        fields: 'id, name, size, mimeType'
      });

      const fileSize = parseInt(copied.data.size || file.size || '0');

      await sql`INSERT INTO portal_files (drive_file_id, user_id, file_name, display_name, file_size, mime_type, doc_type) VALUES (${copied.data.id}, ${user.id}, ${driveName}, ${displayName}, ${fileSize}, ${file.mimeType}, 'entrevista')`;

      console.log(`  OK  ${driveName} -> "${displayName}"`);
      results.push({ driveName, displayName, id: copied.data.id });
      nextNum++;
    } catch (err) {
      console.error(`  ERR ${file.name}: ${err.message}`);
    }
  }

  // 6. Log activity
  try {
    await sql`INSERT INTO portal_activity_log (user_id, action, details) VALUES (${user.id}, 'upload', ${JSON.stringify({ files: results.map(r => r.displayName), docType: 'entrevista', method: 'bulk_copy_from_shared_folder' })})`;
  } catch (e) {
    console.error('Error logging activity:', e.message);
  }

  console.log(`\nCompletado: ${results.length}/${files.length} archivos copiados.`);
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
