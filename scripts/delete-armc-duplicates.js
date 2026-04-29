/**
 * delete-armc-duplicates.js
 * Borra los duplicados exactos identificados en ARMC:
 *   - armc_047.docx (1GF9FD0ibsAzvsAuWQryPJt-IJWOXXePr) — duplicado de armc_008
 *   - armc_039.docx (1462Q6epK4IXcAvRkK0xFa-BpScx0sZ90) — duplicado de armc_037
 *
 * Acciones por archivo:
 *   1. Borra el archivo en Google Drive
 *   2. Borra la fila correspondiente en portal_files
 *   3. Registra una entrada en portal_activity_log
 *
 * Uso:
 *   cd /Users/armandocruz/Documents/prisma\ consul\ projects/web-de-prisma
 *   node scripts/delete-armc-duplicates.js
 */

const fs = require('fs');
const path = require('path');

// Cargar .env manualmente
const envPath = path.join(__dirname, '..', '.env');
const envText = fs.readFileSync(envPath, 'utf8');
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const { neon } = require(path.join(__dirname, '..', 'server', 'node_modules', '@neondatabase', 'serverless'));
const { google } = require(path.join(__dirname, '..', 'server', 'node_modules', 'googleapis'));

const TARGETS = [
  { driveId: '1GF9FD0ibsAzvsAuWQryPJt-IJWOXXePr', expectedName: 'armc_047.docx', reason: 'duplicado exacto de armc_008.docx (3. CI peptonas)' },
  { driveId: '1462Q6epK4IXcAvRkK0xFa-BpScx0sZ90', expectedName: 'armc_039.docx', reason: 'duplicado exacto de armc_037.docx (3. CI LASER CO2 FRACCIONADO)' },
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

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const drive = getDriveClient();

  console.log('═══════════════════════════════════════════════════════════');
  console.log('BORRADO DE DUPLICADOS ARMC');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  for (const target of TARGETS) {
    console.log(`▶ ${target.expectedName} (${target.driveId})`);
    console.log(`  Motivo: ${target.reason}`);

    // 1. Verificar que existe en BD y obtener metadata
    const rows = await sql`
      SELECT id, user_id, file_name, display_name
      FROM portal_files
      WHERE drive_file_id = ${target.driveId}
    `;

    if (!rows.length) {
      console.log(`  ⚠ No existe en portal_files. Saltando.`);
      console.log('');
      continue;
    }

    const file = rows[0];
    if (file.file_name !== target.expectedName) {
      console.log(`  ⚠ El nombre no coincide: BD dice "${file.file_name}", esperaba "${target.expectedName}". ABORTANDO por seguridad.`);
      process.exit(1);
    }

    console.log(`  BD: file_name="${file.file_name}", display_name="${file.display_name}", user_id=${file.user_id}`);

    // 2. Borrar de Google Drive
    try {
      await drive.files.delete({ fileId: target.driveId });
      console.log(`  ✓ Borrado de Google Drive`);
    } catch (e) {
      console.error(`  ❌ Error borrando de Drive: ${e.message}`);
      console.error(`  ABORTANDO. La fila de la BD NO se ha tocado.`);
      process.exit(1);
    }

    // 3. Borrar de portal_files
    await sql`DELETE FROM portal_files WHERE drive_file_id = ${target.driveId}`;
    console.log(`  ✓ Borrado de portal_files`);

    // 4. Log de actividad
    await sql`
      INSERT INTO portal_activity_log (user_id, action, details, ip_address)
      VALUES (
        ${file.user_id},
        'delete',
        ${JSON.stringify({
          fileId: target.driveId,
          fileName: file.file_name,
          displayName: file.display_name,
          reason: target.reason,
          source: 'cleanup-script',
        })},
        'localhost'
      )
    `;
    console.log(`  ✓ Registrado en portal_activity_log`);
    console.log('');
  }

  // 5. Verificación final: contar archivos restantes de ARMC
  const armcUser = await sql`SELECT id FROM portal_users WHERE LOWER(email) = 'armc@prismaconsul.com'`;
  const remaining = await sql`SELECT COUNT(*)::int AS cnt FROM portal_files WHERE user_id = ${armcUser[0].id}`;
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Archivos restantes de ARMC en portal_files: ${remaining[0].cnt}`);
  console.log('(esperado: 59, antes había 61)');
  console.log('═══════════════════════════════════════════════════════════');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
