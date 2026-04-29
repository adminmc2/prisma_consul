/**
 * rename-armc-files.js
 *
 * Renombrado masivo de los 59 archivos de ARMC a la nueva nomenclatura.
 * Formato: 34_01_{TIPODOC}_V1_{DESCRIPTOR}_{VARIANTE}_{FECHA}.ext
 *
 * Acciones por archivo:
 *   1. Renombra el archivo en Google Drive (drive.files.update).
 *   2. Actualiza portal_files.file_name en Neon.
 *   3. NO toca display_name (se mantiene el original de ARMC).
 *   4. Registra la operación en portal_activity_log.
 *
 * Modo por defecto: DRY-RUN (no escribe nada, solo imprime).
 * Para ejecutar de verdad: añadir el flag --execute
 *
 * Uso:
 *   cd /Users/armandocruz/Documents/prisma\ consul\ projects/web-de-prisma
 *   node scripts/rename-armc-files.js            # dry-run
 *   node scripts/rename-armc-files.js --execute  # aplica cambios
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

const EXECUTE = process.argv.includes('--execute');
const ARMC_USER_ID = 3;

// ─────────────────────────────────────────────────────────────────────
// MAPA DE RENOMBRADO — 59 ARCHIVOS
// ─────────────────────────────────────────────────────────────────────
// Cada entrada: { driveId, oldName (esperado en BD), newName }
// Validación: si oldName no coincide con file_name en BD, se aborta.

const RENAMES = [
  // ── FACTURAS (4) ──────────────────────────────────────────
  { driveId: '1EcKhck9oehHJzaKTALb1jEOBPLwCGP1j', oldName: 'armc_001.pdf', newName: '34_01_FACTURA_V1_GMUNOZ_BASE_20260122.pdf' },
  { driveId: '1Xc18PpoMYfGP_aaN6IhRe-y3F3HUi6ym', oldName: 'armc_002.pdf', newName: '34_01_FACTURA_V1_RSOLIS_BASE_20260122.pdf' },
  { driveId: '1jiGf9Mow2xz4RHE7F60BtkOwxyAQOi4b', oldName: 'armc_003.pdf', newName: '34_01_FACTURA_V1_RGUTIERREZ_BASE_20260128.pdf' },
  { driveId: '1qG2I8rQsKm7kBYwtrjUTCaDJZNZi2dv3', oldName: 'armc_004.pdf', newName: '34_01_FACTURA_V1_CSKINFILL_BASE_20260221.pdf' },

  // ── RECETAS (3) ───────────────────────────────────────────
  { driveId: '1qn2NXqpz1NW31WqvvYe4N9tgfmMikuB3', oldName: 'armc_005.pdf', newName: '34_01_RECETA_V1_RINOPLASTIA_BASE_20260402.pdf' },
  { driveId: '1XGEtrluVsSCy9QUs8E_5Gc-RJaDUzj-X', oldName: 'armc_006.pdf', newName: '34_01_RECETA_V1_LIPOFACIALYENDOLIFTING_BASE_20260402.pdf' },
  { driveId: '1uT_bMkdTJIvQl0OMh9iotLGu2fLkIGIm', oldName: 'armc_007.pdf', newName: '34_01_RECETA_V1_ENBLANCO_BASE_20260402.pdf' },

  // ── DOCUMENTOS ÚNICOS (6) ─────────────────────────────────
  { driveId: '1hn73v6n4ifnRqYUsfeBvULMqcYMTkh41', oldName: 'armc_008.docx', newName: '34_01_CONSENTIMIENTO_V1_PEPTONAS_BASE_20260402.docx' },
  { driveId: '1fayFbH_eId6rONZmcIIZp-pWOg0sCBeS', oldName: 'armc_009.docx', newName: '34_01_CATALOGO_V1_PROCEDIMIENTOS_BASE_20260402.docx' },
  { driveId: '1Bck-we196rUOCXQDn9hgb8orS8akhRmk', oldName: 'armc_010.pdf',  newName: '34_01_HISTCLIN_V1_BASE_BASE_20260402.pdf' },
  { driveId: '1ytNJx7vOe3Ch6oAZQNh4k-ppPVVOM0DW', oldName: 'armc_011.docx', newName: '34_01_NOTAVUELO_V1_BASE_BASE_20260402.docx' },
  { driveId: '1fXg5wGz5dbPqBokfaWwASq8cPQAJ1qq3', oldName: 'armc_012.docx', newName: '34_01_CONSENTIMIENTO_V1_PUBLICACIONFOTOS_BASE_20260402.docx' },
  { driveId: '1b06B8ImekbJSkcUsseNOwD-sS1-5PYio', oldName: 'armc_013.docx', newName: '34_01_AVISOPRIV_V1_BASE_BASE_20260402.docx' },
  { driveId: '16IKd8_3UIkr3Vw4wMBg16z0M80XG0_ob', oldName: 'armc_014.docx', newName: '34_01_CONSENTIMIENTO_V1_GENERAL_BASE_20260402.docx' },

  // ── PNOs (12) ─────────────────────────────────────────────
  { driveId: '1yrtFDdYJZm3JvSwj3nW-b3eAob_RifkP', oldName: 'armc_015.docx', newName: '34_01_PNO_V1_TRICOLOGIA_BASE_20260402.docx' },
  { driveId: '13dFgbqvvLFzjDCxnvBQbR_PzzEp1sCGO', oldName: 'armc_016.docx', newName: '34_01_PNO_V1_OTOPLASTIA_BASE_20260402.docx' },
  { driveId: '1ofcEJpjznS2GO_Qjyhk2b1U5T3E5dkVg', oldName: 'armc_017.docx', newName: '34_01_PNO_V1_MASTOPEXIA_BASE_20260402.docx' },
  { driveId: '11RNS97kylOe-e-iBr_VVat6xj2Y3ShUz', oldName: 'armc_018.docx', newName: '34_01_PNO_V1_LIPOFACIALYENDOLIFTING_BASE_20260402.docx' },
  { driveId: '1YjCIY2JRN6Y255dTIt_PPCm6-m1hJtpZ', oldName: 'armc_019.docx', newName: '34_01_PNO_V1_BLEFAROPLASTIA_BASE_20260402.docx' },
  { driveId: '1d4boMLXTGrrc457vsHVwPilPJe74OoQH', oldName: 'armc_020.docx', newName: '34_01_PNO_V1_BICHECTOMIA_BASE_20260402.docx' },
  { driveId: '1_5sFiWbKDpdkH_dUf4WttNHmwkc_9A-T', oldName: 'armc_021.docx', newName: '34_01_PNO_V1_RFMICROAGUJAS_BASE_20260402.docx' },
  { driveId: '1pcgLfkvP-T-ibzg3oInMR2I2-oyA3An7', oldName: 'armc_022.docx', newName: '34_01_PNO_V1_TOXINABOTULINICA_BASE_20260402.docx' },
  { driveId: '1L1hq6ZMrsncDDfxjGkfuleWxoDNtPixN', oldName: 'armc_023.docx', newName: '34_01_PNO_V1_DERMATOCOSMETICA_BASE_20260402.docx' },
  { driveId: '1YE7JuPOcZ_C9G36qvFdd8jjHKb8bGagF', oldName: 'armc_024.docx', newName: '34_01_PNO_V1_LASERCO2_BASE_20260402.docx' },
  { driveId: '1Ufmd3IRmqUUV_pXchTMD-3aLp_8Raou8', oldName: 'armc_025.docx', newName: '34_01_PNO_V1_BIOESTIMULADOR_BASE_20260402.docx' },
  { driveId: '1UI-x2ql5xXzzwLewy9EMKkbFZfDWvBcP', oldName: 'armc_026.docx', newName: '34_01_PNO_V1_ACIDOHIALURONICO_BASE_20260402.docx' },

  // ── CONSENTIMIENTOS del bloque 2 abril (15) ───────────────
  { driveId: '1Q14xrtwxHMkuzQmA-V856kBWXdqMX0Fl', oldName: 'armc_027.docx', newName: '34_01_CONSENTIMIENTO_V1_TIRZEPATIDA_BASE_20260402.docx' },
  { driveId: '1-eiITn8rU8avl7DL67KN9NDF8C1iNA0n', oldName: 'armc_028.docx', newName: '34_01_CONSENTIMIENTO_V1_RINOPLASTIA_GENERICO_20260402.docx' },
  { driveId: '1p4tuyDsClyuPSeephXakEwHf-dsCGkhN', oldName: 'armc_029.docx', newName: '34_01_CONSENTIMIENTO_V1_OTOPLASTIA_GENERICO_20260402.docx' },
  { driveId: '1taFNfC6VNBp88x9MZaxc3jRQR5QKEf93', oldName: 'armc_030.docx', newName: '34_01_CONSENTIMIENTO_V1_MASTOPEXIA_GENERICO_20260402.docx' },
  { driveId: '15OmEiFk3Fgfgqcf1qa-JPykBKpf5tsZQ', oldName: 'armc_031.docx', newName: '34_01_CONSENTIMIENTO_V1_LIPOFACIAL_BASE_20260402.docx' },
  { driveId: '1PUKnt8Pj1i0tADhVaex7xYUc2kbXpD6u', oldName: 'armc_032.docx', newName: '34_01_CONSENTIMIENTO_V1_ENDOLIFTINGLASER_BASE_20260402.docx' },
  { driveId: '18gIMmCdOGzi-LVu8fhm_D6-24V2CP-wi', oldName: 'armc_033.docx', newName: '34_01_CONSENTIMIENTO_V1_LIFTINGFACIALLASER_BASE_20260402.docx' },
  { driveId: '14W444jZ_DFrLCMxiQgAyd1MOohVFCUIa', oldName: 'armc_034.docx', newName: '34_01_CONSENTIMIENTO_V1_BLEFAROPLASTIA_GENERICO_20260402.docx' },
  { driveId: '1DEErWyMsODZaKz_vO_wgC_CqG7ojst2a', oldName: 'armc_035.docx', newName: '34_01_CONSENTIMIENTO_V1_BICHECTOMIA_GENERICO_20260402.docx' },
  { driveId: '1pliw0Thd5lsKy0aioW06Hr_eY3Kd7FL6', oldName: 'armc_036.docx', newName: '34_01_CONSENTIMIENTO_V1_RFMICROAGUJAS_BASE_20260402.docx' },
  { driveId: '10WLmtEng0yl6nv66hKVGh-jyLdmIszu8', oldName: 'armc_037.docx', newName: '34_01_CONSENTIMIENTO_V1_LASERCO2_BASE_20260402.docx' },
  { driveId: '1Tg8OomWSfNVlZDCqp3NVcvP9fDaTVMQ8', oldName: 'armc_038.docx', newName: '34_01_CONSENTIMIENTO_V1_TOXINABOTULINICA_BASE_20260402.docx' },
  { driveId: '1tcloUa6PB-gOzReXiAp3aQf2I36cBSih', oldName: 'armc_040.docx', newName: '34_01_CONSENTIMIENTO_V1_BIOESTIMULADOR_BASE_20260402.docx' },
  { driveId: '17OdcSALv2iElwpIE9-hIIhBt6vNPL8lU', oldName: 'armc_041.docx', newName: '34_01_CONSENTIMIENTO_V1_ACIDOHIALURONICO_BASE_20260402.docx' },

  // ── EXPEDIENTES (4) ───────────────────────────────────────
  { driveId: '1qKVh2I6eOHFoQtPpb4FMNm7dja37vYDI', oldName: 'armc_042.pdf', newName: '34_01_EXPEDIENTE_V1_HIALURONICO_BASE_20260212.pdf' },
  { driveId: '1ap-9DhtosZGpsfpMfyvav2L3hfIUZXrh', oldName: 'armc_043.pdf', newName: '34_01_EXPEDIENTE_V1_HIALURONICOYTOXINABOTULINICA_BASE_20260318.pdf' },
  { driveId: '1YAPr6c1lfmxXRXn9ctQxLcVUhNKPrwE4', oldName: 'armc_044.pdf', newName: '34_01_EXPEDIENTE_V1_LIPOFACIALYBICHECTOMIA_BASE_20260220.pdf' },
  { driveId: '1GykVWFO0r6J58yCUsC_O5XzBC0qNDPNk', oldName: 'armc_045.pdf', newName: '34_01_EXPEDIENTE_V1_TOXINABOTULINICA_BASE_20260310.pdf' },

  // ── ORGANIGRAMA (1) ───────────────────────────────────────
  { driveId: '1ElEj7EOkpizFWnTPWKSc3RlwxLAEd5ZQ', oldName: 'armc_046.pdf', newName: '34_01_ORGANIGRAMA_V1_BASE_BASE_20260402.pdf' },

  // ── CONSENTIMIENTOS del bloque 7 abril (6) ────────────────
  { driveId: '1akQwje3nYgpHPtVRw20j_yznbsPIUQkf', oldName: 'armc_048.docx', newName: '34_01_CONSENTIMIENTO_V1_BRAQUIOPLASTIA_BASE_20260407.docx' },
  { driveId: '1QBY5eNk-5h7SgZ0rM62HadPRBwqei1YU', oldName: 'armc_049.docx', newName: '34_01_CONSENTIMIENTO_V1_BICHECTOMIA_FIGUEROA_20260407.docx' },
  { driveId: '14uGJT5Xyb0s_JQiu_3nvOxiSZNPpMKAf', oldName: 'armc_050.docx', newName: '34_01_CONSENTIMIENTO_V1_BLEFAROPLASTIA_FIGUEROA_20260407.docx' },
  { driveId: '1hSnPZk9-Nek-6DJD5cHwauzmhc1qHZzo', oldName: 'armc_051.docx', newName: '34_01_CONSENTIMIENTO_V1_MASTOPEXIA_FIGUEROA_20260407.docx' },
  { driveId: '1TJAdI5a7-dFrYX2yeoDEJpGZ8l35woDz', oldName: 'armc_052.docx', newName: '34_01_CONSENTIMIENTO_V1_OTOPLASTIA_FIGUEROA_20260407.docx' },
  { driveId: '1ZarYHle1WMxDasbI6uyGl4xsxxBXWpRi', oldName: 'armc_053.docx', newName: '34_01_CONSENTIMIENTO_V1_RINOPLASTIA_VARGAS_20260407.docx' },

  // ── ENTREVISTAS (8) — Google Docs nativos, sin extensión ──
  { driveId: '1cKncJhn3CJGSd-X4Ro8BnCHFSEBXdKHLt3GowTDnLZg', oldName: 'armc_ent_001', newName: '34_01_ENTREVISTA_V1_GABUSH_BASE_20260407' },
  { driveId: '1YIJ7Z5SoCwp4mXQ5OdypusAD_01Wj-4RLc_Xb3REMmQ', oldName: 'armc_ent_002', newName: '34_01_ENTREVISTA_V1_CARLOS_PARTE2_20260331' },
  { driveId: '1z1qEg_Nektx302MMMq2UxPOmcywIaRUlem-g51barXM', oldName: 'armc_ent_003', newName: '34_01_ENTREVISTA_V1_BRIZA_BASE_20260330' },
  { driveId: '1npUMzBdEuf-Aqoe2Hl0ERbMdLr7FFyFq8dFaWo6A6fc', oldName: 'armc_ent_004', newName: '34_01_ENTREVISTA_V1_CARLOS_PARTE1_20260327' },
  { driveId: '1fM3e6Xr0IeHNXLQnI7S7XHLU3VXhZeiohb_lV51tHgM', oldName: 'armc_ent_005', newName: '34_01_ENTREVISTA_V1_DIVANI_BASE_20260327' },
  { driveId: '1pjtY9dc1T1gC_coB9cSaV0_rSq-4uMSRKRUjPaC76iw', oldName: 'armc_ent_006', newName: '34_01_ENTREVISTA_V1_ELIAN_BASE_20260331' },
  { driveId: '1SCDSjoP3Mzr3M-6jIQX7dH-MFgGwi-9Nwj2GbRLBQGg', oldName: 'armc_ent_007', newName: '34_01_ENTREVISTA_V1_MARISELA_BASE_20260401' },
  { driveId: '19euMFxhnasmER73laduNfu488P539ZF577SDNIjU5gM', oldName: 'armc_ent_008', newName: '34_01_ENTREVISTA_V1_OSCAR_BASE_20260330' },
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
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`RENOMBRADO MASIVO DE ARCHIVOS ARMC — ${EXECUTE ? 'MODO REAL' : 'DRY-RUN'}`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total archivos a renombrar: ${RENAMES.length}`);
  console.log('');

  // Validación de unicidad de los nombres nuevos
  const uniqueNewNames = new Set(RENAMES.map(r => r.newName));
  if (uniqueNewNames.size !== RENAMES.length) {
    console.error('❌ Hay nombres nuevos duplicados en el mapa. Abortando.');
    process.exit(1);
  }
  // Validación de unicidad de los drive_ids
  const uniqueDriveIds = new Set(RENAMES.map(r => r.driveId));
  if (uniqueDriveIds.size !== RENAMES.length) {
    console.error('❌ Hay drive_ids duplicados en el mapa. Abortando.');
    process.exit(1);
  }
  console.log('✓ Validación de unicidad OK (nombres y drive_ids únicos)');
  console.log('');

  const sql = neon(process.env.DATABASE_URL);
  const drive = EXECUTE ? getDriveClient() : null;

  // Fase 1: validación previa — todos los oldName deben existir en BD y coincidir
  console.log('▶ Fase 1: validación previa contra BD');
  const errors = [];
  for (const r of RENAMES) {
    const rows = await sql`SELECT file_name, display_name, user_id FROM portal_files WHERE drive_file_id = ${r.driveId}`;
    if (!rows.length) {
      errors.push(`  ❌ ${r.oldName}: no existe en portal_files (drive_id ${r.driveId})`);
      continue;
    }
    const row = rows[0];
    if (row.user_id !== ARMC_USER_ID) {
      errors.push(`  ❌ ${r.oldName}: user_id=${row.user_id}, esperaba ${ARMC_USER_ID}`);
    }
    if (row.file_name !== r.oldName) {
      errors.push(`  ❌ ${r.oldName}: file_name en BD="${row.file_name}"`);
    }
  }
  if (errors.length) {
    console.error('❌ Validación falló:');
    errors.forEach(e => console.error(e));
    process.exit(1);
  }
  console.log(`✓ Los ${RENAMES.length} archivos existen en BD con los nombres esperados`);
  console.log('');

  // Fase 2: ejecución
  console.log(`▶ Fase 2: ${EXECUTE ? 'aplicando cambios' : 'simulación (dry-run)'}`);
  console.log('');

  let processed = 0;
  let failed = 0;

  for (const r of RENAMES) {
    const arrow = '→';
    console.log(`  [${String(processed + 1).padStart(2, '0')}/${RENAMES.length}] ${r.oldName}`);
    console.log(`        ${arrow} ${r.newName}`);

    if (!EXECUTE) {
      processed++;
      continue;
    }

    try {
      // 1. Renombrar en Drive
      await drive.files.update({
        fileId: r.driveId,
        requestBody: { name: r.newName },
        fields: 'id, name',
      });

      // 2. Actualizar portal_files.file_name (display_name intacto)
      await sql`UPDATE portal_files SET file_name = ${r.newName} WHERE drive_file_id = ${r.driveId}`;

      // 3. Log
      await sql`
        INSERT INTO portal_activity_log (user_id, action, details, ip_address)
        VALUES (
          ${ARMC_USER_ID},
          'rename_systematic',
          ${JSON.stringify({
            fileId: r.driveId,
            oldName: r.oldName,
            newName: r.newName,
            source: 'rename-armc-files.js',
          })},
          'localhost'
        )
      `;

      console.log(`        ✓ aplicado`);
      processed++;
    } catch (e) {
      console.error(`        ❌ error: ${e.message}`);
      failed++;
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('RESUMEN');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Procesados: ${processed}/${RENAMES.length}`);
  if (failed) console.log(`Fallos:     ${failed}`);
  console.log(`Modo:       ${EXECUTE ? 'REAL (cambios aplicados)' : 'DRY-RUN (sin cambios)'}`);

  if (!EXECUTE) {
    console.log('');
    console.log('Para ejecutar de verdad:');
    console.log('  node scripts/rename-armc-files.js --execute');
  } else {
    // Verificación post-ejecución
    console.log('');
    console.log('▶ Verificación post-ejecución');
    const result = await sql`
      SELECT COUNT(*)::int AS total,
             COUNT(CASE WHEN file_name LIKE '34_01_%' THEN 1 END)::int AS renamed
      FROM portal_files WHERE user_id = ${ARMC_USER_ID}
    `;
    console.log(`  ${result[0].renamed}/${result[0].total} archivos con nombre nuevo en BD`);
    if (result[0].renamed !== RENAMES.length || result[0].total !== RENAMES.length) {
      console.warn(`  ⚠ Esperado ${RENAMES.length}/${RENAMES.length}`);
    }
  }
}

main().catch((err) => {
  console.error('❌ Error fatal:', err.message);
  console.error(err.stack);
  process.exit(1);
});
