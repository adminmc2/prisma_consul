/**
 * Migration: Add roles, file tracking, and activity log to PRISMA Hub
 *
 * Run once: cd server && node scripts/migrate-roles.js
 *
 * What it does:
 * 1. Adds 'role' and 'drive_folder_id' columns to portal_users
 * 2. Creates portal_files and portal_activity_log tables
 * 3. Sets info@prismaconsul.com as admin
 * 4. Creates Google Drive subfolders for each user
 * 5. Moves existing files to the admin's subfolder
 * 6. Registers existing files in portal_files
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { neon } = require('@neondatabase/serverless');
const { google } = require('googleapis');

async function getDrive() {
  const keyJson = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const auth = new google.auth.GoogleAuth({
    credentials: keyJson,
    scopes: ['https://www.googleapis.com/auth/drive'],
    clientOptions: { subject: 'info@prismaconsul.com' }
  });
  return google.drive({ version: 'v3', auth });
}

async function run() {
  const sql = neon(process.env.DATABASE_URL);
  const drive = await getDrive();
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  console.log('=== PRISMA Hub Migration: Roles + File Ownership ===\n');

  // Step 1: Schema changes
  console.log('1. Aplicando cambios de schema...');

  await sql`ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'`;
  await sql`ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS drive_folder_id TEXT`;
  console.log('   - Columnas role y drive_folder_id añadidas a portal_users');

  await sql`
    CREATE TABLE IF NOT EXISTS portal_files (
      id SERIAL PRIMARY KEY,
      drive_file_id TEXT UNIQUE NOT NULL,
      user_id INTEGER REFERENCES portal_users(id) ON DELETE SET NULL,
      file_name TEXT NOT NULL,
      file_size BIGINT DEFAULT 0,
      mime_type TEXT,
      doc_type TEXT DEFAULT 'general',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_portal_files_user ON portal_files(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_portal_files_drive ON portal_files(drive_file_id)`;
  console.log('   - Tabla portal_files creada');

  await sql`
    CREATE TABLE IF NOT EXISTS portal_activity_log (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES portal_users(id),
      action TEXT NOT NULL,
      details JSONB,
      ip_address TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_activity_log_user ON portal_activity_log(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_activity_log_created ON portal_activity_log(created_at DESC)`;
  console.log('   - Tabla portal_activity_log creada');

  // Step 2: Set admin role
  console.log('\n2. Configurando roles...');
  await sql`UPDATE portal_users SET role = 'admin' WHERE LOWER(email) = 'info@prismaconsul.com'`;
  console.log('   - info@prismaconsul.com → admin');

  // Step 3: Create Drive subfolders for all users
  console.log('\n3. Creando carpetas en Google Drive...');
  const users = await sql`SELECT id, email, nombre, drive_folder_id FROM portal_users`;

  let adminUser = null;
  for (const user of users) {
    if (user.drive_folder_id) {
      console.log(`   - ${user.email}: carpeta ya existe (${user.drive_folder_id})`);
      if (user.email.toLowerCase() === 'info@prismaconsul.com') adminUser = user;
      continue;
    }

    // Check if folder already exists
    const query = `'${rootFolderId}' in parents and name = 'user_${user.id}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    const existing = await drive.files.list({ q: query, fields: 'files(id)' });

    let folderId;
    if (existing.data.files.length > 0) {
      folderId = existing.data.files[0].id;
    } else {
      const folder = await drive.files.create({
        requestBody: {
          name: `user_${user.id}`,
          description: user.nombre || user.email,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [rootFolderId]
        },
        fields: 'id'
      });
      folderId = folder.data.id;
    }

    await sql`UPDATE portal_users SET drive_folder_id = ${folderId} WHERE id = ${user.id}`;
    console.log(`   - ${user.email}: carpeta user_${user.id} → ${folderId}`);

    if (user.email.toLowerCase() === 'info@prismaconsul.com') {
      adminUser = { ...user, drive_folder_id: folderId };
    }

    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 200));
  }

  // Step 4: Move existing root-level files to admin's folder
  console.log('\n4. Migrando archivos existentes...');

  if (!adminUser) {
    console.log('   ! No se encontró usuario admin, saltando migración de archivos');
  } else {
    // List files directly in root folder (not in subfolders)
    const rootFiles = await drive.files.list({
      q: `'${rootFolderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id, name, size, mimeType, createdTime)',
      pageSize: 100
    });

    const files = rootFiles.data.files || [];
    console.log(`   Encontrados ${files.length} archivos en la carpeta raíz`);

    for (const file of files) {
      // Move to admin folder
      try {
        await drive.files.update({
          fileId: file.id,
          addParents: adminUser.drive_folder_id,
          removeParents: rootFolderId,
          fields: 'id'
        });

        // Register in portal_files
        await sql`
          INSERT INTO portal_files (drive_file_id, user_id, file_name, file_size, mime_type)
          VALUES (${file.id}, ${adminUser.id}, ${file.name}, ${parseInt(file.size || '0')}, ${file.mimeType})
          ON CONFLICT (drive_file_id) DO NOTHING
        `;

        console.log(`   - ${file.name} → carpeta admin`);
      } catch (e) {
        console.error(`   ! Error moviendo ${file.name}:`, e.message);
      }

      await new Promise(r => setTimeout(r, 200));
    }
  }

  // Step 5: Verify
  console.log('\n5. Verificación...');
  const userCount = await sql`SELECT COUNT(*)::int as n FROM portal_users`;
  const adminCount = await sql`SELECT COUNT(*)::int as n FROM portal_users WHERE role = 'admin'`;
  const fileCount = await sql`SELECT COUNT(*)::int as n FROM portal_files`;
  const foldersSet = await sql`SELECT COUNT(*)::int as n FROM portal_users WHERE drive_folder_id IS NOT NULL`;

  console.log(`   Usuarios: ${userCount[0].n} (${adminCount[0].n} admin)`);
  console.log(`   Archivos registrados: ${fileCount[0].n}`);
  console.log(`   Usuarios con carpeta Drive: ${foldersSet[0].n}/${userCount[0].n}`);

  console.log('\n=== Migración completada ===');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
