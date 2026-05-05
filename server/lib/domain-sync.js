/**
 * Domain Sync — capa única de aplicación que sincroniza estado legacy ↔ nuevo
 *
 * Decisión cerrada (MODELO-DOMINIO.md §6.6): la sincronización entre las tablas
 * legacy (`portal_users`) y las nuevas (`clientes`, `engagements`) se implementa
 * en una sola capa de aplicación — este módulo helper de dominio — **no por
 * endpoint ni por trigger de BD**.
 *
 * Estado en Fase 2 (subpaso 2.7 / v3.3.39): este módulo existe y está exportado,
 * pero **NO es invocado por ningún endpoint todavía**. Los endpoints
 * `/api/portal-profile` y `/api/portal-users/:id` siguen escribiendo solo a
 * tablas legacy. El cableado progresivo del helper en rutas pertenece a un
 * slice posterior (post-2.9 / fase 3).
 *
 * Contrato (CONTRATOS.md CT-4): los endpoints actuales siguen aceptando
 * exactamente los mismos campos y no cambian su comportamiento. Cuando este
 * helper se cablée en rutas, la sincronización a `clientes` y `engagements`
 * será transparente para el consumidor.
 *
 * Cuando los campos legacy se cierren (sprint posterior), este helper se borra.
 */

const { neon } = require('@neondatabase/serverless');

// ── Helper local SQL ────────────────────────────────────
// Mismo patrón que server/routes/portal.js: instanciamos por llamada para
// evitar conexiones colgadas en entorno serverless.
function getSQL() {
  return neon(process.env.DATABASE_URL);
}

// ── Clasificación de campos ─────────────────────────────
// Estas listas son la fuente de verdad de "qué se sincroniza con qué" cuando
// el helper se cablée en rutas. Hoy se usan solo dentro de syncLegacyUserUpdate.

// Empresariales — cuando el usuario tenga cliente_id, se redirigen a la
// entidad `clientes`. Mientras no esté cableado, se siguen escribiendo en
// `portal_users` por las rutas existentes.
const FIELDS_EMPRESARIALES = [
  'empresa', 'rfc', 'direccion', 'ciudad', 'cp', 'telefono', 'sector'
];

// De fase / engagement — propagan a `engagements` cuando hay
// `active_engagement_id`.
const FIELDS_FASE = [
  'current_phase', 'profile_type', 'apex_submission_id'
];

// Personales — viven en `portal_users` directo, no se redirigen.
const FIELDS_PERSONALES = [
  'nombre', 'cargo', 'contacto_principal'
];

// ── Lecturas (MODELO-DOMINIO.md §6.6) ───────────────────

/**
 * Devuelve los datos empresariales canónicos del usuario.
 * Si el usuario tiene `cliente_id` → lee la fila de `clientes`.
 * Si no → cae al fallback con los campos legacy de `portal_users`,
 * tal como exige MODELO-DOMINIO.md §6.6 párrafo "getClienteFromUser".
 *
 * @param {number} userId
 * @returns {Promise<object|null>} fila canónica con shape de Cliente, o null si el usuario no existe
 */
async function getClienteFromUser(userId) {
  const sql = getSQL();
  const userRows = await sql`
    SELECT id, email, empresa, rfc, direccion, ciudad, cp, telefono, sector, cliente_id
    FROM portal_users WHERE id = ${userId}
  `;
  if (userRows.length === 0) return null;
  const u = userRows[0];

  if (u.cliente_id) {
    const cliRows = await sql`
      SELECT id, nombre, nombre_corto, tipo_negocio, rfc, direccion, ciudad, cp, telefono, sector, created_at
      FROM clientes WHERE id = ${u.cliente_id}
    `;
    if (cliRows.length > 0) return cliRows[0];
  }

  // Fallback legacy: shape compatible con `clientes` aunque viva en portal_users.
  return {
    id: null,
    nombre: u.empresa,
    nombre_corto: null,
    tipo_negocio: null,
    rfc: u.rfc,
    direccion: u.direccion,
    ciudad: u.ciudad,
    cp: u.cp,
    telefono: u.telefono,
    sector: u.sector,
    created_at: null,
    _source: 'legacy_portal_users',
  };
}

/**
 * Devuelve el engagement activo del usuario o `null` si no existe.
 * Resuelve por `portal_users.active_engagement_id` (puntero transitorio de
 * conveniencia documentado en MODELO-DOMINIO.md §6.5).
 *
 * @param {number} userId
 * @returns {Promise<object|null>}
 */
async function getActiveEngagement(userId) {
  const sql = getSQL();
  const rows = await sql`
    SELECT e.id, e.cliente_id, e.producto, e.vertical, e.fase_legacy_id,
           e.submission_id, e.created_at, e.closed_at
    FROM portal_users u
    LEFT JOIN engagements e ON e.id = u.active_engagement_id
    WHERE u.id = ${userId}
  `;
  if (rows.length === 0 || rows[0].id === null) return null;
  return rows[0];
}

// ── Escrituras (no integradas en rutas todavía) ─────────

/**
 * Sincroniza una actualización dirigida originalmente a `portal_users`.
 * Reglas (MODELO-DOMINIO.md §6.6):
 *   - Empresariales (FIELDS_EMPRESARIALES) → si el usuario tiene `cliente_id`,
 *     se redirigen a la entidad `clientes`; si no, permanecen en
 *     `portal_users` como hasta hoy.
 *   - De fase (FIELDS_FASE) → si el usuario tiene `active_engagement_id`,
 *     se propagan al `engagements` correspondiente; en paralelo, los
 *     campos legacy de `portal_users` también se escriben (regla MD-21:
 *     legacy convive con canónico durante Sprint A).
 *   - Personales (FIELDS_PERSONALES) → escritura directa a `portal_users`.
 *
 * Este helper NO se invoca todavía desde rutas; cuando se cablée, las rutas
 * `/api/portal-profile` (PATCH) y `/api/portal-users/:id` (PATCH) seguirán
 * aceptando el mismo body — el redirect a clientes/engagements será
 * transparente para el consumidor (CONTRATOS.md CT-4).
 *
 * @param {number} userId
 * @param {object} fields  subconjunto de campos legacy/empresariales/fase/personales
 * @returns {Promise<{userRow: object, clienteRow: object|null, engagementRow: object|null}>}
 *
 * @todo cableado en `server/routes/portal.js` líneas 154 (`PATCH /portal-profile`)
 *       y 500 (`PATCH /portal-users/:id`). Pendiente de paquete posterior; no
 *       forma parte del slice 2.7.
 */
async function syncLegacyUserUpdate(userId, fields) { // eslint-disable-line no-unused-vars
  // Skeleton — implementación efectiva queda pendiente del slice de cableado.
  // La firma y semántica quedan fijadas; no se ejecuta lógica todavía.
  throw new Error(
    'domain-sync.syncLegacyUserUpdate not wired yet (subpaso 2.7 v3.3.39 — skeleton)'
  );
}

/**
 * Sincroniza una actualización a `engagements` desde código nuevo (futuro
 * panel admin de engagements, futuro endpoint `/api/engagements/:id`).
 *
 * Regla (MODELO-DOMINIO.md §6.6): si los campos cambian valores que también
 * tienen reflejo legacy en `portal_users` (`current_phase`, `profile_type`,
 * `apex_submission_id`), debe propagarse el cambio a las filas de
 * `portal_users` con `active_engagement_id = engagementId`, hasta que los
 * campos legacy se retiren formalmente.
 *
 * @param {number} engagementId
 * @param {object} fields
 *
 * @todo no invocado por rutas. Reservado para el slice que abra el panel
 *       admin de engagements / endpoint nuevo.
 */
async function syncEngagementUpdate(engagementId, fields) { // eslint-disable-line no-unused-vars
  throw new Error(
    'domain-sync.syncEngagementUpdate not wired yet (subpaso 2.7 v3.3.39 — skeleton)'
  );
}

/**
 * Sincroniza una actualización a `clientes` desde código nuevo (futuro panel
 * admin de clientes, futuro endpoint `/api/clientes/:id`).
 *
 * Regla (MODELO-DOMINIO.md §6.6): los cambios en datos empresariales del
 * Cliente deben reflejarse en los `portal_users` que tengan `cliente_id =
 * clienteId`, manteniendo la compatibilidad con consumidores legacy hasta que
 * los campos empresariales de `portal_users` se retiren.
 *
 * @param {number} clienteId
 * @param {object} fields
 *
 * @todo no invocado por rutas. Reservado para el slice que abra el endpoint
 *       de clientes.
 */
async function syncClienteUpdate(clienteId, fields) { // eslint-disable-line no-unused-vars
  throw new Error(
    'domain-sync.syncClienteUpdate not wired yet (subpaso 2.7 v3.3.39 — skeleton)'
  );
}

module.exports = {
  // Lecturas (implementadas, listas para uso futuro)
  getClienteFromUser,
  getActiveEngagement,
  // Escrituras (skeleton — firma fija, lógica pendiente del slice de cableado)
  syncLegacyUserUpdate,
  syncEngagementUpdate,
  syncClienteUpdate,
  // Clasificación de campos (re-exportada para que el slice de cableado la use)
  FIELDS_EMPRESARIALES,
  FIELDS_FASE,
  FIELDS_PERSONALES,
};