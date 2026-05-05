/**
 * Domain Sync — capa única de aplicación que sincroniza estado legacy ↔ nuevo
 *
 * Decisión cerrada (MODELO-DOMINIO.md §6.6): la sincronización entre las tablas
 * legacy (`portal_users`) y las nuevas (`clientes`, `engagements`) se implementa
 * en una sola capa de aplicación — este módulo helper de dominio — **no por
 * endpoint ni por trigger de BD**.
 *
 * Estado vigente (`v3.3.42`): el skeleton añadido en el subpaso 2.7
 * (`v3.3.39`) queda cableado por `syncLegacyUserUpdate`, invocado desde
 * `PATCH /api/portal-profile` y `PATCH /api/portal-users/:id`. Las otras
 * dos escrituras (`syncEngagementUpdate`, `syncClienteUpdate`) siguen
 * como skeleton — están reservadas para los endpoints `/api/engagements/:id`
 * y `/api/clientes/:id` que aún no existen.
 *
 * Contrato (CONTRATOS.md CT-4): los endpoints existentes siguen aceptando
 * exactamente los mismos campos y devolviendo el mismo shape; la
 * sincronización a `clientes` y `engagements` es transparente para el
 * consumidor.
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
// Fuente de verdad de "qué se sincroniza con qué". Consumidas por
// syncLegacyUserUpdate y disponibles para los próximos cableados de
// syncEngagementUpdate / syncClienteUpdate.

// Empresariales — se escriben siempre a `portal_users`; si el usuario
// tiene `cliente_id`, se reflejan también en `clientes` (mapeo
// `empresa`→`clientes.nombre`, resto 1:1).
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

// ── Escrituras ──────────────────────────────────────────
// `syncLegacyUserUpdate` cableado en `v3.3.42` (los dos PATCH del portal).
// `syncEngagementUpdate` y `syncClienteUpdate` siguen como skeleton — los
// endpoints que los invocarían (`/api/engagements/:id`, `/api/clientes/:id`)
// no existen todavía.

/**
 * Sincroniza una actualización dirigida originalmente a `portal_users`.
 * Reglas (MODELO-DOMINIO.md §6.6):
 *   - Empresariales (FIELDS_EMPRESARIALES) → siempre se escriben a
 *     `portal_users`; si el usuario tiene `cliente_id`, además se reflejan
 *     en `clientes` (mapeo: `empresa`→`clientes.nombre`; resto 1:1).
 *   - De fase con reflejo canónico (`current_phase`, `apex_submission_id`)
 *     → siempre se escriben a `portal_users`; si el usuario tiene
 *     `active_engagement_id`, además se reflejan en `engagements`
 *     (`current_phase`→`fase_legacy_id`, `apex_submission_id`→`submission_id`).
 *   - `profile_type` → **legacy-only en este slice**. Aunque `engagements.vertical`
 *     existe en el schema (2.6.c), el mapeo `profile_type`→`vertical` es una
 *     decisión de modelo (MD-4: `'clinica'`→`'clinica-multi'` solo como
 *     asignación inicial, no default permanente) y NO una propagación
 *     técnica automática. Se escribe únicamente en `portal_users` hasta
 *     que el usuario autorice explícitamente la canonicalización en un
 *     slice posterior.
 *   - Personales (FIELDS_PERSONALES) → escritura directa a `portal_users`.
 *
 * Regla MD-21: legacy convive con canónico durante Sprint A — la escritura
 * a `portal_users` nunca se omite, y el reflejo canónico se añade encima
 * cuando hay vínculo.
 *
 * Atomicidad: las escrituras a `portal_users`, `clientes` y `engagements`
 * se ejecutan en una sola transacción vía `sql.transaction([...])`. Para
 * evitar que la decisión de "a qué cliente / a qué engagement escribir"
 * caiga fuera de la transacción y produzca un COMMIT sobre targets
 * obsoletos si `cliente_id`/`active_engagement_id` cambian, los UPDATE
 * a `clientes` y `engagements` derivan esos identificadores con un
 * subquery contra `portal_users` **dentro de la propia transacción**.
 * Si una de las escrituras falla, ninguna se aplica.
 *
 * Cableado en `server/routes/portal.js`: `PATCH /api/portal-profile`
 * y `PATCH /api/portal-users/:id` (CONTRATOS.md CT-4 — body y respuesta
 * sin cambios para el consumidor).
 *
 * Semántica de COALESCE: solo se actualizan los campos cuyo valor en
 * `fields` sea distinto de `undefined`. Pasar `null` explícito tampoco
 * borra (mismo comportamiento que los PATCH legacy previos al cableado).
 *
 * @param {number} userId
 * @param {object} fields  subconjunto de campos legacy/empresariales/fase/personales
 * @returns {Promise<{userRow: object|null, clienteRow: object|null, engagementRow: object|null}>}
 */
async function syncLegacyUserUpdate(userId, fields) {
  const sql = getSQL();
  const f = fields || {};

  const hasEmpresarial = FIELDS_EMPRESARIALES.some(k => f[k] !== undefined);
  const hasFaseCanon   = f.current_phase !== undefined || f.apex_submission_id !== undefined;

  // Toda la lógica vive dentro de la transacción: NO hay lectura previa
  // de cliente_id/active_engagement_id. Los UPDATE a clientes y engagements
  // derivan el target con un subquery contra portal_users en la misma
  // transacción, así que no es posible que cambie entre la decisión y la
  // escritura. Si una falla, BEGIN…COMMIT hace rollback de todas.
  const queries = [];

  // (a) UPDATE portal_users — siempre. profile_type se escribe aquí y
  //     NO se propaga a engagements.vertical (legacy-only por decisión
  //     explícita de este slice; ver MD-4).
  queries.push(sql`
    UPDATE portal_users SET
      nombre              = COALESCE(${f.nombre             !== undefined ? f.nombre             : null}, nombre),
      empresa             = COALESCE(${f.empresa            !== undefined ? f.empresa            : null}, empresa),
      rfc                 = COALESCE(${f.rfc                !== undefined ? f.rfc                : null}, rfc),
      direccion           = COALESCE(${f.direccion          !== undefined ? f.direccion          : null}, direccion),
      ciudad              = COALESCE(${f.ciudad             !== undefined ? f.ciudad             : null}, ciudad),
      cp                  = COALESCE(${f.cp                 !== undefined ? f.cp                 : null}, cp),
      telefono            = COALESCE(${f.telefono           !== undefined ? f.telefono           : null}, telefono),
      contacto_principal  = COALESCE(${f.contacto_principal !== undefined ? f.contacto_principal : null}, contacto_principal),
      cargo               = COALESCE(${f.cargo              !== undefined ? f.cargo              : null}, cargo),
      sector              = COALESCE(${f.sector             !== undefined ? f.sector             : null}, sector),
      current_phase       = COALESCE(${f.current_phase      !== undefined ? f.current_phase      : null}, current_phase),
      profile_type        = COALESCE(${f.profile_type       !== undefined ? f.profile_type       : null}, profile_type),
      apex_submission_id  = COALESCE(${f.apex_submission_id !== undefined ? f.apex_submission_id : null}, apex_submission_id)
    WHERE id = ${userId}
    RETURNING id, email, nombre, empresa, rfc, direccion, ciudad, cp, telefono,
              contacto_principal, cargo, sector, role,
              current_phase, profile_type, apex_submission_id,
              cliente_id, active_engagement_id
  `);

  // (b) UPDATE clientes — el target se deriva con subquery contra
  //     portal_users dentro de la transacción. Si el usuario no existe
  //     o no tiene cliente_id, el subquery devuelve NULL y el UPDATE
  //     no afecta filas (RETURNING vacío → clienteRow=null).
  if (hasEmpresarial) {
    queries.push(sql`
      UPDATE clientes SET
        nombre    = COALESCE(${f.empresa   !== undefined ? f.empresa   : null}, nombre),
        rfc       = COALESCE(${f.rfc       !== undefined ? f.rfc       : null}, rfc),
        direccion = COALESCE(${f.direccion !== undefined ? f.direccion : null}, direccion),
        ciudad    = COALESCE(${f.ciudad    !== undefined ? f.ciudad    : null}, ciudad),
        cp        = COALESCE(${f.cp        !== undefined ? f.cp        : null}, cp),
        telefono  = COALESCE(${f.telefono  !== undefined ? f.telefono  : null}, telefono),
        sector    = COALESCE(${f.sector    !== undefined ? f.sector    : null}, sector)
      WHERE id = (SELECT cliente_id FROM portal_users WHERE id = ${userId})
      RETURNING id, nombre, nombre_corto, tipo_negocio, rfc, direccion, ciudad, cp, telefono, sector, created_at
    `);
  }

  // (c) UPDATE engagements — mismo patrón con subquery dentro de la
  //     transacción. profile_type se omite intencionalmente (ver
  //     decisión arriba).
  if (hasFaseCanon) {
    queries.push(sql`
      UPDATE engagements SET
        fase_legacy_id = COALESCE(${f.current_phase      !== undefined ? f.current_phase      : null}, fase_legacy_id),
        submission_id  = COALESCE(${f.apex_submission_id !== undefined ? f.apex_submission_id : null}, submission_id)
      WHERE id = (SELECT active_engagement_id FROM portal_users WHERE id = ${userId})
      RETURNING id, cliente_id, producto, vertical, fase_legacy_id, submission_id, created_at, closed_at
    `);
  }

  // Ejecución atómica: si una de las escrituras falla, ninguna se aplica.
  const results = await sql.transaction(queries);

  let idx = 0;
  const userRow = results[idx++][0] || null;
  // Si el usuario no existe, el primer UPDATE devolvió 0 filas y los
  // UPDATE a clientes/engagements (con subquery NULL) tampoco afectaron
  // nada. Salimos con los tres rows null para preservar el 404.
  if (!userRow) {
    return { userRow: null, clienteRow: null, engagementRow: null };
  }
  let clienteRow = null;
  let engagementRow = null;
  if (hasEmpresarial) {
    clienteRow = (results[idx++][0]) || null;
  }
  if (hasFaseCanon) {
    engagementRow = (results[idx++][0]) || null;
  }

  return { userRow, clienteRow, engagementRow };
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
  // Lecturas (implementadas)
  getClienteFromUser,
  getActiveEngagement,
  // Escrituras: syncLegacyUserUpdate cableado en v3.3.42 (los dos PATCH del
  // portal). syncEngagementUpdate y syncClienteUpdate siguen como skeleton
  // hasta que existan los endpoints que los invoquen.
  syncLegacyUserUpdate,
  syncEngagementUpdate,
  syncClienteUpdate,
  // Clasificación de campos (consumida por syncLegacyUserUpdate y disponible
  // para los próximos cableados de syncEngagementUpdate / syncClienteUpdate).
  FIELDS_EMPRESARIALES,
  FIELDS_FASE,
  FIELDS_PERSONALES,
};