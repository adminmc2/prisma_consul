/**
 * move-armc-patient-data.js
 *
 * Mueve los archivos con datos personales de pacientes (facturas CFDI con RFC + nombre)
 * desde la carpeta principal de ARMC a una subcarpeta _datos_paciente/ dentro de la misma.
 *
 * Para cada archivo:
 *   1. Renombra en Google Drive a un nombre legible
 *   2. Lo mueve a la subcarpeta _datos_paciente/
 *   3. Elimina la fila de portal_files (queda fuera del flujo del Hub)
 *   4. Registra en portal_activity_log
 *
 * Si la subcarpeta no existe la crea.
 *
 * Uso:
 *   cd /Users/armandocruz/Documents/prisma\ consul\ projects/web-de-prisma
 *   node scripts/move-armc-patient-data.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envText = fs.readFileSync(envPath, 'utf8');
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const { neon } = require(path.join(__dirname, '..', 'server', 'node_modules', '@neondatabase', 'serverless'));
const { google } = require(path.join(__dirname, '..', 'server', 'node_modules', 'googleapis'));

const ARMC_FOLDER_ID = '1imrYtEJKYbns826WQ_EUznJlSuoUmqVU';
const SUBFOLDER_NAME = '_datos_paciente';

const TARGETS = [
  { driveId: '1EcKhck9oehHJzaKTALb1jEOBPLwCGP1j', currentName: 'armc_001.pdf', newName: 'ARMC_FACTURA_GUILLERMO_MUNOZ_20260122.pdf' },
  { driveId: '1Xc18PpoMYfGP_aaN6IhRe-y3F3HUi6ym', currentName: 'armc_002.pdf', newName: 'ARMC_FACTURA_ROSA_SOLIS_20260122.pdf' },
  { driveId: '1jiGf9Mow2xz4RHE7F60BtkOwxyAQOi4b', currentName: 'armc_003.pdf', newName: 'ARMC_FACTURA_REGINA_GUTIERREZ_20260128.pdf' },
  { driveId: '1qG2I8rQsKm7kBYwtrjUTCaDJZNZi2dv3', currentName: 'armc_004.pdf', newName: 'ARMC_FACTURA_CAROL_SKINFILL_20260221.pdf' },
];

function getDriveClient() {
  const keyJson = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const auth = new google.auth.GoogleAuth({
    credentials: keyJson,
    scopes: ['https://www.googleapis.com/auth/drive'],
    clientOptions: { subject: 'info@prismaconsul.com' },
  });
  return google.drive({ version: 'v3', auth });
}

async function getOrCreateSubfolder(drive, parentId, name) {
  // Buscar
  const existing = await drive.files.list({
    q: `'${parentId}' in parents and name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
  });
  if (existing.data.files.length > 0) {
    console.log(`  ✓ Subcarpeta ya existe: ${existing.data.files[0].id}`);
    return existing.data.files[0].id;
  }
  // Crear
  const folder = await drive.files.create({
    requestBody: {
      name,
      description: 'Datos personales de pacientes — fuera del corpus de entrenamiento IA',
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id',
  });
  console.log(`  ✓ Subcarpeta creada: ${folder.data.id}`);
  return folder.data.id;
}

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const drive = getDriveClient();

  console.log('═══════════════════════════════════════════════════════════');
  console.log('MOVER DATOS DE PACIENTES A SUBCARPETA _datos_paciente/');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  console.log('▶ Paso 1: subcarpeta');
  const subfolderId = await getOrCreateSubfolder(drive, ARMC_FOLDER_ID, SUBFOLDER_NAME);
  console.log('');

  console.log('▶ Paso 2: mover y renombrar archivos');
  console.log('');

  for (const target of TARGETS) {
    console.log(`  ${target.currentName}  →  ${target.newName}`);

    // Verificar BD
    const rows = await sql`
      SELECT id, user_id, file_name, display_name
      FROM portal_files
      WHERE drive_file_id = ${target.driveId}
    `;
    if (!rows.length) {
      console.log(`    ⚠ No existe en portal_files. Saltando.`);
      continue;
    }
    const file = rows[0];
    if (file.file_name !== target.currentName) {
      console.log(`    ❌ El nombre en BD no coincide: "${file.file_name}". ABORTANDO.`);
      process.exit(1);
    }

    // Obtener parents actuales
    const meta = await drive.files.get({ fileId: target.driveId, fields: 'parents' });
    const previousParents = meta.data.parents.join(',');

    // Renombrar + mover en una sola llamada
    await drive.files.update({
      fileId: target.driveId,
      requestBody: { name: target.newName },
      addParents: subfolderId,
      removeParents: previousParents,
      fields: 'id, name, parents',
    });
    console.log(`    ✓ Renombrado y movido en Drive`);

    // Eliminar de portal_files
    await sql`DELETE FROM portal_files WHERE drive_file_id = ${target.driveId}`;
    console.log(`    ✓ Eliminado de portal_files`);

    // Log
    await sql`
      INSERT INTO portal_activity_log (user_id, action, details, ip_address)
      VALUES (
        ${file.user_id},
        'archive_patient_data',
        ${JSON.stringify({
          fileId: target.driveId,
          oldName: target.currentName,
          newName: target.newName,
          oldDisplayName: file.display_name,
          movedTo: SUBFOLDER_NAME,
          reason: 'Contains patient PII (RFC + name) — excluded from IA training corpus',
        })},
        'localhost'
      )
    `;
    console.log(`    ✓ Registrado en portal_activity_log`);
    console.log('');
  }

  // Verificación final
  const armcUser = await sql`SELECT id FROM portal_users WHERE LOWER(email) = 'armc@prismaconsul.com'`;
  const remaining = await sql`SELECT COUNT(*)::int AS cnt FROM portal_files WHERE user_id = ${armcUser[0].id}`;
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Archivos restantes de ARMC en portal_files: ${remaining[0].cnt}`);
  console.log('(esperado: 55 — antes 59, menos 4 facturas archivadas)');
  console.log('═══════════════════════════════════════════════════════════');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
