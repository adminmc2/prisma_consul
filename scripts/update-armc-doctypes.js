/**
 * update-armc-doctypes.js
 *
 * Actualiza portal_files.doc_type de los 59 archivos de ARMC a su categoría real,
 * eliminando el valor genérico 'general' y asignando el doc_type correspondiente
 * según el TIPODOC de la nueva nomenclatura.
 *
 * Mapeo:
 *   TIPODOC          → doc_type
 *   PNO              → pno
 *   CONSENTIMIENTO   → consentimiento
 *   HISTCLIN         → historia
 *   CATALOGO         → catalogo
 *   ORGANIGRAMA      → organizacional
 *   FACTURA          → factura
 *   ENTREVISTA       → entrevista
 *   EXPEDIENTE       → expediente      (categoría nueva)
 *   RECETA           → receta          (categoría nueva)
 *   NOTAVUELO        → nota_vuelo      (categoría nueva)
 *   AVISOPRIV        → aviso_privacidad (categoría nueva)
 *
 * IMPORTANTE: las categorías nuevas (expediente, receta, nota_vuelo, aviso_privacidad)
 * deben estar presentes en el frontend del Hub ANTES de ejecutar este script para
 * que los badges se muestren con etiqueta legible en la UI. Ya están desplegadas en
 * main (producción) y dev desde commit 186dd15 / 3d69c4b.
 *
 * Modo por defecto: DRY-RUN. Para ejecutar: añadir --execute.
 *
 * Uso:
 *   cd /Users/armandocruz/Documents/prisma\ consul\ projects/web-de-prisma
 *   node scripts/update-armc-doctypes.js            # dry-run
 *   node scripts/update-armc-doctypes.js --execute  # aplica cambios
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

const EXECUTE = process.argv.includes('--execute');
const ARMC_USER_ID = 3;

// Mapeo: drive_file_id → doc_type nuevo
// Los drive_ids coinciden con los del script rename-armc-files.js para asegurar trazabilidad.

const UPDATES = [
  // ── FACTURAS (4) → factura ──────────────────────────────
  { driveId: '1EcKhck9oehHJzaKTALb1jEOBPLwCGP1j', fileName: '34_01_FACTURA_V1_GMUNOZ_BASE_20260122.pdf', docType: 'factura' },
  { driveId: '1Xc18PpoMYfGP_aaN6IhRe-y3F3HUi6ym', fileName: '34_01_FACTURA_V1_RSOLIS_BASE_20260122.pdf', docType: 'factura' },
  { driveId: '1jiGf9Mow2xz4RHE7F60BtkOwxyAQOi4b', fileName: '34_01_FACTURA_V1_RGUTIERREZ_BASE_20260128.pdf', docType: 'factura' },
  { driveId: '1qG2I8rQsKm7kBYwtrjUTCaDJZNZi2dv3', fileName: '34_01_FACTURA_V1_CSKINFILL_BASE_20260221.pdf', docType: 'factura' },

  // ── RECETAS (3) → receta ────────────────────────────────
  { driveId: '1qn2NXqpz1NW31WqvvYe4N9tgfmMikuB3', fileName: '34_01_RECETA_V1_RINOPLASTIA_BASE_20260402.pdf', docType: 'receta' },
  { driveId: '1XGEtrluVsSCy9QUs8E_5Gc-RJaDUzj-X', fileName: '34_01_RECETA_V1_LIPOFACIALYENDOLIFTING_BASE_20260402.pdf', docType: 'receta' },
  { driveId: '1uT_bMkdTJIvQl0OMh9iotLGu2fLkIGIm', fileName: '34_01_RECETA_V1_ENBLANCO_BASE_20260402.pdf', docType: 'receta' },

  // ── CONSENTIMIENTO (peptonas) → consentimiento ──────────
  { driveId: '1hn73v6n4ifnRqYUsfeBvULMqcYMTkh41', fileName: '34_01_CONSENTIMIENTO_V1_PEPTONAS_BASE_20260402.docx', docType: 'consentimiento' },

  // ── CATALOGO → catalogo ─────────────────────────────────
  { driveId: '1fayFbH_eId6rONZmcIIZp-pWOg0sCBeS', fileName: '34_01_CATALOGO_V1_PROCEDIMIENTOS_BASE_20260402.docx', docType: 'catalogo' },

  // ── HISTORIA CLINICA → historia ─────────────────────────
  { driveId: '1Bck-we196rUOCXQDn9hgb8orS8akhRmk', fileName: '34_01_HISTCLIN_V1_BASE_BASE_20260402.pdf', docType: 'historia' },

  // ── NOTA VUELO → nota_vuelo ─────────────────────────────
  { driveId: '1ytNJx7vOe3Ch6oAZQNh4k-ppPVVOM0DW', fileName: '34_01_NOTAVUELO_V1_BASE_BASE_20260402.docx', docType: 'nota_vuelo' },

  // ── CONSENTIMIENTO publicación fotos → consentimiento ──
  { driveId: '1fXg5wGz5dbPqBokfaWwASq8cPQAJ1qq3', fileName: '34_01_CONSENTIMIENTO_V1_PUBLICACIONFOTOS_BASE_20260402.docx', docType: 'consentimiento' },

  // ── AVISO PRIVACIDAD → aviso_privacidad ─────────────────
  { driveId: '1b06B8ImekbJSkcUsseNOwD-sS1-5PYio', fileName: '34_01_AVISOPRIV_V1_BASE_BASE_20260402.docx', docType: 'aviso_privacidad' },

  // ── CONSENTIMIENTO GENERAL → consentimiento ─────────────
  { driveId: '16IKd8_3UIkr3Vw4wMBg16z0M80XG0_ob', fileName: '34_01_CONSENTIMIENTO_V1_GENERAL_BASE_20260402.docx', docType: 'consentimiento' },

  // ── PNOs (12) → pno ─────────────────────────────────────
  { driveId: '1yrtFDdYJZm3JvSwj3nW-b3eAob_RifkP', fileName: '34_01_PNO_V1_TRICOLOGIA_BASE_20260402.docx', docType: 'pno' },
  { driveId: '13dFgbqvvLFzjDCxnvBQbR_PzzEp1sCGO', fileName: '34_01_PNO_V1_OTOPLASTIA_BASE_20260402.docx', docType: 'pno' },
  { driveId: '1ofcEJpjznS2GO_Qjyhk2b1U5T3E5dkVg', fileName: '34_01_PNO_V1_MASTOPEXIA_BASE_20260402.docx', docType: 'pno' },
  { driveId: '11RNS97kylOe-e-iBr_VVat6xj2Y3ShUz', fileName: '34_01_PNO_V1_LIPOFACIALYENDOLIFTING_BASE_20260402.docx', docType: 'pno' },
  { driveId: '1YjCIY2JRN6Y255dTIt_PPCm6-m1hJtpZ', fileName: '34_01_PNO_V1_BLEFAROPLASTIA_BASE_20260402.docx', docType: 'pno' },
  { driveId: '1d4boMLXTGrrc457vsHVwPilPJe74OoQH', fileName: '34_01_PNO_V1_BICHECTOMIA_BASE_20260402.docx', docType: 'pno' },
  { driveId: '1_5sFiWbKDpdkH_dUf4WttNHmwkc_9A-T', fileName: '34_01_PNO_V1_RFMICROAGUJAS_BASE_20260402.docx', docType: 'pno' },
  { driveId: '1pcgLfkvP-T-ibzg3oInMR2I2-oyA3An7', fileName: '34_01_PNO_V1_TOXINABOTULINICA_BASE_20260402.docx', docType: 'pno' },
  { driveId: '1L1hq6ZMrsncDDfxjGkfuleWxoDNtPixN', fileName: '34_01_PNO_V1_DERMATOCOSMETICA_BASE_20260402.docx', docType: 'pno' },
  { driveId: '1YE7JuPOcZ_C9G36qvFdd8jjHKb8bGagF', fileName: '34_01_PNO_V1_LASERCO2_BASE_20260402.docx', docType: 'pno' },
  { driveId: '1Ufmd3IRmqUUV_pXchTMD-3aLp_8Raou8', fileName: '34_01_PNO_V1_BIOESTIMULADOR_BASE_20260402.docx', docType: 'pno' },
  { driveId: '1UI-x2ql5xXzzwLewy9EMKkbFZfDWvBcP', fileName: '34_01_PNO_V1_ACIDOHIALURONICO_BASE_20260402.docx', docType: 'pno' },

  // ── CONSENTIMIENTOS bloque 2 abril (14) → consentimiento ─
  { driveId: '1Q14xrtwxHMkuzQmA-V856kBWXdqMX0Fl', fileName: '34_01_CONSENTIMIENTO_V1_TIRZEPATIDA_BASE_20260402.docx', docType: 'consentimiento' },
  { driveId: '1-eiITn8rU8avl7DL67KN9NDF8C1iNA0n', fileName: '34_01_CONSENTIMIENTO_V1_RINOPLASTIA_GENERICO_20260402.docx', docType: 'consentimiento' },
  { driveId: '1p4tuyDsClyuPSeephXakEwHf-dsCGkhN', fileName: '34_01_CONSENTIMIENTO_V1_OTOPLASTIA_GENERICO_20260402.docx', docType: 'consentimiento' },
  { driveId: '1taFNfC6VNBp88x9MZaxc3jRQR5QKEf93', fileName: '34_01_CONSENTIMIENTO_V1_MASTOPEXIA_GENERICO_20260402.docx', docType: 'consentimiento' },
  { driveId: '15OmEiFk3Fgfgqcf1qa-JPykBKpf5tsZQ', fileName: '34_01_CONSENTIMIENTO_V1_LIPOFACIAL_BASE_20260402.docx', docType: 'consentimiento' },
  { driveId: '1PUKnt8Pj1i0tADhVaex7xYUc2kbXpD6u', fileName: '34_01_CONSENTIMIENTO_V1_ENDOLIFTINGLASER_BASE_20260402.docx', docType: 'consentimiento' },
  { driveId: '18gIMmCdOGzi-LVu8fhm_D6-24V2CP-wi', fileName: '34_01_CONSENTIMIENTO_V1_LIFTINGFACIALLASER_BASE_20260402.docx', docType: 'consentimiento' },
  { driveId: '14W444jZ_DFrLCMxiQgAyd1MOohVFCUIa', fileName: '34_01_CONSENTIMIENTO_V1_BLEFAROPLASTIA_GENERICO_20260402.docx', docType: 'consentimiento' },
  { driveId: '1DEErWyMsODZaKz_vO_wgC_CqG7ojst2a', fileName: '34_01_CONSENTIMIENTO_V1_BICHECTOMIA_GENERICO_20260402.docx', docType: 'consentimiento' },
  { driveId: '1pliw0Thd5lsKy0aioW06Hr_eY3Kd7FL6', fileName: '34_01_CONSENTIMIENTO_V1_RFMICROAGUJAS_BASE_20260402.docx', docType: 'consentimiento' },
  { driveId: '10WLmtEng0yl6nv66hKVGh-jyLdmIszu8', fileName: '34_01_CONSENTIMIENTO_V1_LASERCO2_BASE_20260402.docx', docType: 'consentimiento' },
  { driveId: '1Tg8OomWSfNVlZDCqp3NVcvP9fDaTVMQ8', fileName: '34_01_CONSENTIMIENTO_V1_TOXINABOTULINICA_BASE_20260402.docx', docType: 'consentimiento' },
  { driveId: '1tcloUa6PB-gOzReXiAp3aQf2I36cBSih', fileName: '34_01_CONSENTIMIENTO_V1_BIOESTIMULADOR_BASE_20260402.docx', docType: 'consentimiento' },
  { driveId: '17OdcSALv2iElwpIE9-hIIhBt6vNPL8lU', fileName: '34_01_CONSENTIMIENTO_V1_ACIDOHIALURONICO_BASE_20260402.docx', docType: 'consentimiento' },

  // ── EXPEDIENTES (4) → expediente ────────────────────────
  { driveId: '1qKVh2I6eOHFoQtPpb4FMNm7dja37vYDI', fileName: '34_01_EXPEDIENTE_V1_HIALURONICO_BASE_20260212.pdf', docType: 'expediente' },
  { driveId: '1ap-9DhtosZGpsfpMfyvav2L3hfIUZXrh', fileName: '34_01_EXPEDIENTE_V1_HIALURONICOYTOXINABOTULINICA_BASE_20260318.pdf', docType: 'expediente' },
  { driveId: '1YAPr6c1lfmxXRXn9ctQxLcVUhNKPrwE4', fileName: '34_01_EXPEDIENTE_V1_LIPOFACIALYBICHECTOMIA_BASE_20260220.pdf', docType: 'expediente' },
  { driveId: '1GykVWFO0r6J58yCUsC_O5XzBC0qNDPNk', fileName: '34_01_EXPEDIENTE_V1_TOXINABOTULINICA_BASE_20260310.pdf', docType: 'expediente' },

  // ── ORGANIGRAMA → organizacional ────────────────────────
  { driveId: '1ElEj7EOkpizFWnTPWKSc3RlwxLAEd5ZQ', fileName: '34_01_ORGANIGRAMA_V1_BASE_BASE_20260402.pdf', docType: 'organizacional' },

  // ── CONSENTIMIENTOS bloque 7 abril (6) → consentimiento ─
  { driveId: '1akQwje3nYgpHPtVRw20j_yznbsPIUQkf', fileName: '34_01_CONSENTIMIENTO_V1_BRAQUIOPLASTIA_BASE_20260407.docx', docType: 'consentimiento' },
  { driveId: '1QBY5eNk-5h7SgZ0rM62HadPRBwqei1YU', fileName: '34_01_CONSENTIMIENTO_V1_BICHECTOMIA_FIGUEROA_20260407.docx', docType: 'consentimiento' },
  { driveId: '14uGJT5Xyb0s_JQiu_3nvOxiSZNPpMKAf', fileName: '34_01_CONSENTIMIENTO_V1_BLEFAROPLASTIA_FIGUEROA_20260407.docx', docType: 'consentimiento' },
  { driveId: '1hSnPZk9-Nek-6DJD5cHwauzmhc1qHZzo', fileName: '34_01_CONSENTIMIENTO_V1_MASTOPEXIA_FIGUEROA_20260407.docx', docType: 'consentimiento' },
  { driveId: '1TJAdI5a7-dFrYX2yeoDEJpGZ8l35woDz', fileName: '34_01_CONSENTIMIENTO_V1_OTOPLASTIA_FIGUEROA_20260407.docx', docType: 'consentimiento' },
  { driveId: '1ZarYHle1WMxDasbI6uyGl4xsxxBXWpRi', fileName: '34_01_CONSENTIMIENTO_V1_RINOPLASTIA_VARGAS_20260407.docx', docType: 'consentimiento' },

  // ── ENTREVISTAS (8) → entrevista ────────────────────────
  { driveId: '1cKncJhn3CJGSd-X4Ro8BnCHFSEBXdKHLt3GowTDnLZg', fileName: '34_01_ENTREVISTA_V1_GABUSH_BASE_20260407', docType: 'entrevista' },
  { driveId: '1YIJ7Z5SoCwp4mXQ5OdypusAD_01Wj-4RLc_Xb3REMmQ', fileName: '34_01_ENTREVISTA_V1_CARLOS_PARTE2_20260331', docType: 'entrevista' },
  { driveId: '1z1qEg_Nektx302MMMq2UxPOmcywIaRUlem-g51barXM', fileName: '34_01_ENTREVISTA_V1_BRIZA_BASE_20260330', docType: 'entrevista' },
  { driveId: '1npUMzBdEuf-Aqoe2Hl0ERbMdLr7FFyFq8dFaWo6A6fc', fileName: '34_01_ENTREVISTA_V1_CARLOS_PARTE1_20260327', docType: 'entrevista' },
  { driveId: '1fM3e6Xr0IeHNXLQnI7S7XHLU3VXhZeiohb_lV51tHgM', fileName: '34_01_ENTREVISTA_V1_DIVANI_BASE_20260327', docType: 'entrevista' },
  { driveId: '1pjtY9dc1T1gC_coB9cSaV0_rSq-4uMSRKRUjPaC76iw', fileName: '34_01_ENTREVISTA_V1_ELIAN_BASE_20260331', docType: 'entrevista' },
  { driveId: '1SCDSjoP3Mzr3M-6jIQX7dH-MFgGwi-9Nwj2GbRLBQGg', fileName: '34_01_ENTREVISTA_V1_MARISELA_BASE_20260401', docType: 'entrevista' },
  { driveId: '19euMFxhnasmER73laduNfu488P539ZF577SDNIjU5gM', fileName: '34_01_ENTREVISTA_V1_OSCAR_BASE_20260330', docType: 'entrevista' },
];

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`ACTUALIZACIÓN DE DOC_TYPE — ${EXECUTE ? 'MODO REAL' : 'DRY-RUN'}`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total archivos a actualizar: ${UPDATES.length}`);
  console.log('');

  // Unicidad
  const uniqueIds = new Set(UPDATES.map(u => u.driveId));
  if (uniqueIds.size !== UPDATES.length) {
    console.error('❌ drive_ids duplicados en el mapa. Abortando.');
    process.exit(1);
  }
  console.log('✓ drive_ids únicos');

  // Distribución esperada
  const byType = {};
  UPDATES.forEach(u => { byType[u.docType] = (byType[u.docType] || 0) + 1; });
  console.log('');
  console.log('Distribución prevista de doc_type:');
  Object.entries(byType).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => {
    console.log(`  ${t.padEnd(20)} ${n}`);
  });
  console.log('');

  const sql = neon(process.env.DATABASE_URL);

  // Fase 1: validación previa — cada drive_id existe, pertenece a ARMC, y el file_name coincide
  console.log('▶ Fase 1: validación previa contra BD');
  const errors = [];
  for (const u of UPDATES) {
    const rows = await sql`SELECT file_name, doc_type, user_id FROM portal_files WHERE drive_file_id = ${u.driveId}`;
    if (!rows.length) {
      errors.push(`  ❌ ${u.fileName}: no existe en portal_files`);
      continue;
    }
    const row = rows[0];
    if (row.user_id !== ARMC_USER_ID) {
      errors.push(`  ❌ ${u.fileName}: user_id=${row.user_id}, esperaba ${ARMC_USER_ID}`);
    }
    if (row.file_name !== u.fileName) {
      errors.push(`  ❌ ${u.fileName}: file_name en BD="${row.file_name}"`);
    }
  }
  if (errors.length) {
    console.error('❌ Validación falló:');
    errors.forEach(e => console.error(e));
    process.exit(1);
  }
  console.log(`✓ Los ${UPDATES.length} archivos existen y coinciden con la BD`);
  console.log('');

  // Fase 2: estado actual
  const current = await sql`
    SELECT doc_type, COUNT(*)::int AS cnt
    FROM portal_files
    WHERE user_id = ${ARMC_USER_ID}
    GROUP BY doc_type
    ORDER BY cnt DESC
  `;
  console.log('▶ Estado actual de doc_type en BD:');
  current.forEach(r => console.log(`  ${(r.doc_type || 'NULL').padEnd(20)} ${r.cnt}`));
  console.log('');

  // Fase 3: ejecución
  console.log(`▶ Fase 3: ${EXECUTE ? 'aplicando UPDATEs' : 'simulación (dry-run)'}`);
  console.log('');

  let processed = 0;
  let failed = 0;

  for (const u of UPDATES) {
    const num = String(processed + 1).padStart(2, '0');
    console.log(`  [${num}/${UPDATES.length}] ${u.fileName.slice(0, 60).padEnd(60)} → ${u.docType}`);

    if (!EXECUTE) {
      processed++;
      continue;
    }

    try {
      await sql`UPDATE portal_files SET doc_type = ${u.docType} WHERE drive_file_id = ${u.driveId}`;
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
  console.log(`Procesados: ${processed}/${UPDATES.length}`);
  if (failed) console.log(`Fallos:     ${failed}`);
  console.log(`Modo:       ${EXECUTE ? 'REAL (cambios aplicados)' : 'DRY-RUN (sin cambios)'}`);

  if (!EXECUTE) {
    console.log('');
    console.log('Para ejecutar de verdad:');
    console.log('  node scripts/update-armc-doctypes.js --execute');
  } else {
    // Log de actividad único para toda la operación
    await sql`
      INSERT INTO portal_activity_log (user_id, action, details, ip_address)
      VALUES (
        ${ARMC_USER_ID},
        'bulk_doctype_update',
        ${JSON.stringify({
          total: UPDATES.length,
          distribution: byType,
          source: 'update-armc-doctypes.js',
        })},
        'localhost'
      )
    `;

    // Verificación post-ejecución
    console.log('');
    console.log('▶ Verificación post-ejecución');
    const after = await sql`
      SELECT doc_type, COUNT(*)::int AS cnt
      FROM portal_files
      WHERE user_id = ${ARMC_USER_ID}
      GROUP BY doc_type
      ORDER BY cnt DESC
    `;
    after.forEach(r => console.log(`  ${(r.doc_type || 'NULL').padEnd(20)} ${r.cnt}`));

    const hasGeneral = after.find(r => r.doc_type === 'general');
    if (hasGeneral) {
      console.warn(`  ⚠ Quedan ${hasGeneral.cnt} archivos con doc_type='general'`);
    } else {
      console.log('  ✓ Ningún archivo con doc_type=general');
    }
  }
}

main().catch((err) => {
  console.error('❌ Error fatal:', err.message);
  console.error(err.stack);
  process.exit(1);
});
