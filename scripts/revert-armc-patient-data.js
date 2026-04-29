/**
 * revert-armc-patient-data.js
 *
 * Revierte el movimiento de las 4 facturas CFDI hecho por move-armc-patient-data.js.
 * Las devuelve a la carpeta principal de ARMC con su nombre antiguo (armc_001..004),
 * restaura las filas en portal_files y borra la subcarpeta _datos_paciente/.
 *
 * Para cada archivo:
 *   1. Renombra en Drive de vuelta a su nombre antiguo
 *   2. Lo mueve de _datos_paciente/ a la carpeta padre de ARMC
 *   3. Restaura la fila en portal_files
 *   4. Registra en portal_activity_log
 *
 * Después borra la subcarpeta _datos_paciente/ si quedó vacía.
 *
 * Uso:
 *   cd /Users/armandocruz/Documents/prisma\ consul\ projects/web-de-prisma
 *   node scripts/revert-armc-patient-data.js
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
const ARMC_USER_ID = 3;
const SUBFOLDER_ID = '1cwaVlXyYfjdvyJlLccGrxGdGJ1rBNj9p'; // _datos_paciente/

// Datos originales (antes del movimiento). file_size en bytes (sacado del search_files inicial).
const TARGETS = [
  {
    driveId: '1EcKhck9oehHJzaKTALb1jEOBPLwCGP1j',
    currentName: 'ARMC_FACTURA_GUILLERMO_MUNOZ_20260122.pdf',
    originalName: 'armc_001.pdf',
    displayName: 'GUILLERMO MUÑOZ S. ENERO 2026 (2)',
    docType: 'general',
    mimeType: 'application/pdf',
    fileSize: 44000,
  },
  {
    driveId: '1Xc18PpoMYfGP_aaN6IhRe-y3F3HUi6ym',
    currentName: 'ARMC_FACTURA_ROSA_SOLIS_20260122.pdf',
    originalName: 'armc_002.pdf',
    displayName: 'ROSA M. SOLIS GONZALEZ ENERO 2026',
    docType: 'general',
    mimeType: 'application/pdf',
    fileSize: 43862,
  },
  {
    driveId: '1jiGf9Mow2xz4RHE7F60BtkOwxyAQOi4b',
    currentName: 'ARMC_FACTURA_REGINA_GUTIERREZ_20260128.pdf',
    originalName: 'armc_003.pdf',
    displayName: 'REGINA GUTIERREZ DE LA PARRA ENERO 2026',
    docType: 'general',
    mimeType: 'application/pdf',
    fileSize: 43000,
  },
  {
    driveId: '1qG2I8rQsKm7kBYwtrjUTCaDJZNZi2dv3',
    currentName: 'ARMC_FACTURA_CAROL_SKINFILL_20260221.pdf',
    originalName: 'armc_004.pdf',
    displayName: 'CAROL SKINFILL G. FEB. 2026',
    docType: 'general',
    mimeType: 'application/pdf',
    fileSize: 44000,
  },
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
  console.log('REVERTIR MOVIMIENTO DE FACTURAS A CARPETA PRINCIPAL');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  for (const target of TARGETS) {
    console.log(`▶ ${target.currentName}  →  ${target.originalName}`);

    // Verificar estado actual del archivo en Drive
    let meta;
    try {
      meta = await drive.files.get({ fileId: target.driveId, fields: 'id, name, parents, size' });
    } catch (e) {
      console.error(`  ❌ No se puede leer el archivo en Drive: ${e.message}`);
      process.exit(1);
    }

    if (meta.data.name !== target.currentName) {
      console.log(`  ⚠ El nombre actual no coincide: "${meta.data.name}". Continúo igualmente.`);
    }

    // Renombrar + mover de vuelta a la carpeta padre de ARMC
    const previousParents = meta.data.parents.join(',');
    await drive.files.update({
      fileId: target.driveId,
      requestBody: { name: target.originalName },
      addParents: ARMC_FOLDER_ID,
      removeParents: previousParents,
      fields: 'id, name, parents, size',
    });
    console.log(`  ✓ Renombrado y movido a carpeta principal de ARMC`);

    // Verificar que la fila no existe ya (idempotencia)
    const existing = await sql`SELECT id FROM portal_files WHERE drive_file_id = ${target.driveId}`;
    if (existing.length) {
      console.log(`  ⚠ Ya existe fila en portal_files. Saltando insert.`);
    } else {
      // Restaurar fila (sin id explícito — se autogenera nuevo)
      await sql`
        INSERT INTO portal_files (drive_file_id, user_id, file_name, display_name, file_size, mime_type, doc_type)
        VALUES (
          ${target.driveId},
          ${ARMC_USER_ID},
          ${target.originalName},
          ${target.displayName},
          ${target.fileSize},
          ${target.mimeType},
          ${target.docType}
        )
      `;
      console.log(`  ✓ Restaurada fila en portal_files`);
    }

    // Log
    await sql`
      INSERT INTO portal_activity_log (user_id, action, details, ip_address)
      VALUES (
        ${ARMC_USER_ID},
        'restore_to_hub',
        ${JSON.stringify({
          fileId: target.driveId,
          restoredName: target.originalName,
          fromName: target.currentName,
          reason: 'Reverted patient-data archival — files will be processed normally with new nomenclature',
        })},
        'localhost'
      )
    `;
    console.log(`  ✓ Registrado en portal_activity_log`);
    console.log('');
  }

  // Borrar subcarpeta vacía
  console.log('▶ Verificando subcarpeta _datos_paciente/');
  const childrenInSubfolder = await drive.files.list({
    q: `'${SUBFOLDER_ID}' in parents and trashed = false`,
    fields: 'files(id, name)',
  });
  if (childrenInSubfolder.data.files.length === 0) {
    await drive.files.delete({ fileId: SUBFOLDER_ID });
    console.log(`  ✓ Subcarpeta vacía eliminada`);
  } else {
    console.log(`  ⚠ Subcarpeta NO está vacía (${childrenInSubfolder.data.files.length} archivos). NO se borra.`);
    childrenInSubfolder.data.files.forEach(f => console.log(`    - ${f.name} (${f.id})`));
  }
  console.log('');

  // Verificación final
  const remaining = await sql`SELECT COUNT(*)::int AS cnt FROM portal_files WHERE user_id = ${ARMC_USER_ID}`;
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Archivos de ARMC en portal_files: ${remaining[0].cnt}`);
  console.log('(esperado: 59)');
  console.log('═══════════════════════════════════════════════════════════');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
