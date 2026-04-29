/**
 * list-armc-files.js
 * Script de SOLO LECTURA para listar los archivos de ARMC del Hub.
 * No escribe nada. No envía nada fuera. Solo imprime.
 *
 * Uso:
 *   cd /Users/armandocruz/Documents/prisma\ consul\ projects/web-de-prisma
 *   node scripts/list-armc-files.js
 */

// Parse .env manually (avoids dotenv dependency)
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '..', '.env');
const envText = fs.readFileSync(envPath, 'utf8');
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const { neon } = require(path.join(__dirname, '..', 'server', 'node_modules', '@neondatabase', 'serverless'));

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL no está configurado en .env');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  // 1) Buscar el usuario ARMC
  const users = await sql`
    SELECT id, email, nombre, empresa, drive_folder_id, created_at
    FROM portal_users
    WHERE LOWER(email) = LOWER('armc@prismaconsul.com')
  `;

  if (!users.length) {
    console.error('❌ No se encontró usuario con email armc@prismaconsul.com');
    process.exit(1);
  }

  const armc = users[0];
  console.log('═══════════════════════════════════════════════════════════');
  console.log('USUARIO ARMC');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  id:              ${armc.id}`);
  console.log(`  email:           ${armc.email}`);
  console.log(`  nombre:          ${armc.nombre}`);
  console.log(`  empresa:         ${armc.empresa}`);
  console.log(`  drive_folder_id: ${armc.drive_folder_id}`);
  console.log(`  created_at:      ${armc.created_at}`);
  console.log('');

  // 2) Listar archivos de ARMC en portal_files
  const files = await sql`
    SELECT
      id,
      drive_file_id,
      file_name,
      display_name,
      doc_type,
      mime_type,
      file_size,
      created_at
    FROM portal_files
    WHERE user_id = ${armc.id}
    ORDER BY created_at ASC
  `;

  console.log('═══════════════════════════════════════════════════════════');
  console.log(`ARCHIVOS EN portal_files: ${files.length}`);
  console.log('═══════════════════════════════════════════════════════════');

  // 3) Agrupar por doc_type para ver la distribución
  const byType = {};
  let totalSize = 0;
  for (const f of files) {
    const t = f.doc_type || 'sin_tipo';
    if (!byType[t]) byType[t] = 0;
    byType[t]++;
    totalSize += Number(f.file_size || 0);
  }

  console.log('');
  console.log('Distribución por doc_type:');
  for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type.padEnd(25)} ${count}`);
  }
  console.log(`  ${'TOTAL'.padEnd(25)} ${files.length} archivos · ${(totalSize / 1024 / 1024).toFixed(1)} MB`);
  console.log('');

  // 4) Tabla compacta con drive_file_id
  console.log('Listado completo con drive_file_id:');
  console.log('');
  files.forEach((f, i) => {
    const num = String(i + 1).padStart(3, '0');
    const fname = (f.file_name || '').padEnd(20);
    const dname = (f.display_name || '(null)').slice(0, 60).padEnd(60);
    console.log(`  ${num} ${fname} ${f.drive_file_id.padEnd(35)} ${dname}`);
  });
  console.log('');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
