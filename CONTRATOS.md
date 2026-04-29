# Contratos congelados — Prisma APEX

Inventario exhaustivo de los **contratos externos** del sistema: promesas que `web-de-prisma` mantiene a sus consumidores (navegadores, frontend SPAs, APIs externas, integraciones) y que **no deben romperse** durante la reorganización del Sprint A.

> Este documento cierra C09 del review. Es el gate funcional para pasar a Fase 2.
>
> Auditable como unidad independiente. Construido leyendo código real (`server/server.js`, `server/routes/*.js`, `server/middleware/auth.js`, `server/schema.sql`, `portal/index.html`, `portal/analisis/GUIA-NUEVAS-SECCIONES.md`).

---

## 1. Propósito

Documentar las **promesas técnicas** que el sistema hace al exterior. Cualquier cambio durante la reorganización debe contrastarse contra este inventario; si rompe un contrato listado, se requiere compensación explícita (redirect, alias, sincronización, etc.) o aprobación del cambio.

Cubre cinco tipos de contrato:

1. **URLs públicas** — direcciones a las que se accede desde el navegador.
2. **Endpoints de API** — direcciones internas que las SPAs usan para hablar con el servidor.
3. **Esquema de BD** — estructura de tablas que el código lee y escribe.
4. **Paths hardcodeados en frontend** — rutas a archivos físicos que el JavaScript construye literalmente.
5. **Documentación que asume estructura** — guías que dan instrucciones referenciando rutas concretas.

---

## 2. Cómo se usa este documento

- **Antes de cada cambio relevante** durante la reorganización: contrastar el cambio contra este inventario.
- **Si el cambio toca un contrato listado**: añadir compensación (redirect, alias, sincronización) y documentarla aquí.
- **Si el cambio modifica un contrato**: requiere aprobación explícita y entrada en CHANGELOG.
- **Modificar un contrato es distinto de romperlo**: modificarlo = cambio planificado con convivencia temporal viejo/nuevo; romperlo = cambio sin compatibilidad. **Solo se permite modificar.**

---

## 3. URLs públicas

URLs servidas por Express o redirigidas a través del stack nginx → Cloudflare → cliente.

### 3.1 Páginas estáticas (servidas por `express.static`)

| URL | Sirve | Mecanismo actual | Estado |
|---|---|---|---|
| `prismaconsul.com/` | `index.html` (landing) | `app.use(express.static(projectRoot, { index: 'index.html', extensions: ['html'] }))` en `server/server.js` | Frozen Sprint A |
| `prismaconsul.com/aviso-legal` o `/aviso-legal.html` | `aviso-legal.html` | `extensions: ['html']` permite ambos | Frozen Sprint A |
| `prismaconsul.com/cookies` o `/cookies.html` | `cookies.html` | idem | Frozen Sprint A |
| `prismaconsul.com/privacidad` o `/privacidad.html` | `privacidad.html` | idem | Frozen Sprint A |
| `prismaconsul.com/css/*` | `css/styles.css` y otros | static raíz | Frozen Sprint A |
| `prismaconsul.com/js/*` | scripts de marketing | static raíz | Frozen Sprint A |
| `prismaconsul.com/images/*` | logos, fotos, vídeos | static raíz | Frozen Sprint A |

**Implicación para fase 2:** cuando `express.static` se reapunte de `projectRoot` a `web/`, todas las URLs de arriba deben seguir respondiendo igual. La validación de fase 2 incluye comprobar las 7 rutas anteriores manualmente.

### 3.2 SPAs (handlers Express explícitos)

| URL | Sirve | Handler | Estado |
|---|---|---|---|
| `prismaconsul.com/apex` | `apex/index.html` (Discovery SPA) | servido por `express.static` con `extensions: ['html']` (la URL `/apex` → `apex/index.html`) | Frozen Sprint A |
| `prismaconsul.com/hub` | `portal/index.html` (Prisma APEX SPA) | `app.get('/hub', ...)` en `server.js:64` con `res.sendFile(...portal/index.html)` | Frozen Sprint A |

**Implicación para fase 2:** tras renombrar internamente `portal/` → `prisma-apex/` y `apex/` → `prisma-apex/core/discovery-engine/`, los handlers deben reapuntar al nuevo path físico **manteniendo las URLs públicas `/apex` y `/hub` idénticas**.

### 3.3 Entregables ARMC publicados (estado actual)

| URL | Sirve | Mecanismo | Estado |
|---|---|---|---|
| `prismaconsul.com/portal/analisis/armc/diagramas/*.html` | HTMLs de diagramas (flujo-ceo, flujo-cirujano, etc.) | `express.static` raíz | Frozen Sprint A; **migra a `/publicados/armc/...` en fase 2 con redirect 301** |
| `prismaconsul.com/portal/analisis/armc/diagnostico/*.html` | HTMLs de diagnóstico (resumen-ejecutivo, matriz-dolor, mapa-fricciones, embudo-operativo, cadena-causal) | `express.static` raíz | Idem |
| `prismaconsul.com/portal/analisis/armc/blueprint/*.html` | HTMLs de blueprint (modelo-datos, flujos-to-be, automatizaciones, fases-implementacion, kpis-objetivo) | `express.static` raíz | Idem |
| `prismaconsul.com/portal/analisis/armc/css/estilos-prisma.css` | Estilos de los HTMLs anteriores | `express.static` raíz | Idem |
| `prismaconsul.com/portal/analisis/armc/index.html` | Hub de análisis ARMC | `express.static` raíz | Idem |

**Implicación para fase 2:** estas URLs **se sustituyen** por `prismaconsul.com/publicados/armc/...` (contrato canónico — `MODELO-DOMINIO.md` sección 9). Las URLs antiguas se mantienen vivas vía **redirect 301** durante un periodo de transición indefinido para no romper enlaces externos (correos, documentos PDF que pudieran apuntar a la URL antigua).

### 3.4 Fallback

| URL | Comportamiento | Mecanismo | Estado |
|---|---|---|---|
| Cualquier URL no resuelta | HTTP 404 con `index.html` como cuerpo | `app.get('*', ...)` en `server.js:69-71` | Frozen Sprint A |

**Nota:** este fallback no es ideal (devuelve 404 con cuerpo de la landing, que puede confundir). Se mantiene tal cual durante Sprint A; mejora opcional fuera del alcance.

### 3.5 URLs gestionadas por Cloudflare/nginx (no por Express directamente)

| URL | Apunta a | Notas |
|---|---|---|
| `dev.prismaconsul.com/*` | VPS IONOS, instancia `prisma-dev` (puerto 3001) | Idéntica funcionalidad que producción; rama `dev` |
| `abbe.prismaconsul.com` | `mandocc2-abbe.hf.space` (HF Spaces) | Otro repo (`above-pharma`); fuera del alcance de la reorganización |

---

## 4. Endpoints de API

Express monta tres routers bajo `/api`: `portal.js`, `apex.js`, `ai.js` (`server/server.js:50-52`). El nombre real del endpoint = `path montado` + `path declarado en el router`.

**Convención sobre auth:**
- **Pública** = sin auth, accesible directamente.
- **Autenticada** = requiere `Authorization: Bearer <JWT>` válido. Middleware `auth` (`server/middleware/auth.js`).
- **Admin** = requiere `auth` + `requireAdmin` (`req.user.role === 'admin'`).

**JWT contract:** payload `{id, email, nombre, role}` firmado con `PORTAL_SECRET`, expiración 24h. Tokens sin `role` se tratan como `'user'` por compatibilidad (`auth.js:18`).

### 4.1 Portal — Auth (1)

#### `POST /api/portal-auth`
**Auth:** Pública.
**Request body:** `{ email, password }`.
**Response 200:** `{ token, id, email, nombre, role, current_phase, profile_type, apex_submission_id, empresa: { nombre, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector } }`.
**Response 400:** `{ error: 'Email y contraseña son requeridos' }`.
**Response 401:** `{ error: 'Credenciales incorrectas' }`.
**Response 500:** `{ error: 'Error...' }`.
**Side effects:** actualiza `last_login`; crea/asegura `drive_folder_id` en Drive vía service account; loggea actividad `'login'`.
**Consumer:** SPA del Hub (`portal/index.html`, formulario login).
**Estado:** Frozen Sprint A. La response shape se conserva; los campos `current_phase`, `profile_type`, `apex_submission_id` se siguen devolviendo como hoy aunque internamente vivan en `engagements` (sincronización vía `domain-sync.js` — `MODELO-DOMINIO.md` sección 6.6).

### 4.2 Portal — APEX results (1)

#### `GET /api/portal-apex-results?userId=<id>`
**Auth:** Autenticada. Si se pasa `userId` y el usuario es admin, devuelve los resultados del usuario indicado; si no es admin, ignora `userId` y devuelve los del propio usuario.
**Response 200:** `{ submission: <fila apex_submissions o null> }`.
**Response 500:** `{ error: 'Error al obtener resultados APEX' }`.
**Consumer:** SPA del Hub, sección de visualización de resultados discovery.
**Estado:** Frozen Sprint A. Cuando el modelo de Engagement esté operativo, este endpoint puede consultar vía Engagement → Submission, pero la response shape se conserva.

### 4.3 Portal — Profile (2)

#### `GET /api/portal-profile?userId=<id>`
**Auth:** Autenticada. Si admin + `userId`, devuelve perfil del usuario indicado.
**Response 200:** `{ user: { id, email, nombre, empresa, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector } }`.
**Response 404:** `{ error: 'Usuario no encontrado' }`.
**Consumer:** SPA del Hub, sección perfil del usuario y "view as user".
**Estado:** Frozen Sprint A. Tras introducir Cliente, los campos `empresa/rfc/direccion/...` se leen vía join con `clientes` cuando hay `cliente_id`; el shape de la response no cambia.

#### `PATCH /api/portal-profile`
**Auth:** Autenticada (edita el propio usuario, no admite `userId`).
**Request body:** subconjunto de `{ nombre, empresa, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector }`. Cualquier campo no enviado se conserva (lógica `COALESCE`).
**Response 200:** `{ user: <fila actualizada> }`.
**Side effects:** loggea actividad `'profile_updated'`.
**Consumer:** SPA del Hub, formulario edición de perfil.
**Estado:** Frozen Sprint A — **CONTRATO CRÍTICO**. Tras introducir Cliente, los campos empresariales (`empresa, rfc, direccion, ciudad, cp, telefono, sector`) se redirigen transparentemente a la entidad Cliente vía `domain-sync.js` (`MODELO-DOMINIO.md` sección 5.4 — write path sin regresión). El endpoint sigue aceptándolos exactamente como hoy.

### 4.4 Portal — Files (4)

#### `POST /api/portal-upload`
**Auth:** Autenticada. Admin puede subir para otro usuario pasando `userId` en el form.
**Request:** `multipart/form-data` con campos `file` (uno o más) y opcionales `userId` (admin), `docType`, `displayName`.
**Response 200:** `{ files: [{ id, name, driveName, size, createdTime, link }] }`.
**Response 400:** `{ error: 'No se recibió ningún archivo' }`.
**Side effects:** crea fichero en Drive (carpeta del usuario, generada si no existe); inserta en `portal_files`; loggea actividad `'upload'`.
**Consumer:** SPA del Hub, sección upload (drag & drop).
**Estado:** Frozen Sprint A. **Drive sigue siendo el almacén durante Sprint A.** Cambio a IONOS = Sprint B con compatibilidad propia.

#### `GET /api/portal-files?userId=<id>`
**Auth:** Autenticada. Admin + `userId` permite ver archivos de otro usuario.
**Response 200:** `{ files: [{ id, name, driveName, size, mimeType, createdTime, link, docType }] }`.
**Side effects:** lista archivos vía Drive API + enriquece con `display_name`/`doc_type` desde `portal_files`.
**Consumer:** SPA del Hub, listado de archivos.
**Estado:** Frozen Sprint A.

#### `DELETE /api/portal-files?fileId=<drive_file_id>`
**Auth:** Autenticada. Admin puede borrar cualquier fichero. Usuario normal solo los suyos.
**Response 200:** `{ ok: true }`.
**Response 403:** `{ error: 'No tienes permiso para eliminar este archivo' }`.
**Side effects:** borra de Drive; borra de `portal_files`; loggea actividad `'delete'`.
**Consumer:** SPA del Hub.
**Estado:** Frozen Sprint A.

#### `PATCH /api/portal-files?fileId=<drive_file_id>`
**Auth:** Autenticada. Admin puede renombrar cualquier fichero. Usuario normal solo los suyos.
**Request body:** `{ name }`.
**Response 200:** `{ id, name }`.
**Response 400:** `{ error: 'fileId y nombre requeridos' }`.
**Side effects:** actualiza `display_name` en `portal_files` (no toca el nombre real en Drive); loggea actividad `'rename'`.
**Consumer:** SPA del Hub.
**Estado:** Frozen Sprint A.

### 4.5 Portal — Admin: User management (3)

#### `GET /api/portal-users`
**Auth:** Admin.
**Response 200:** `{ users: [{ id, email, nombre, empresa, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector, role, current_phase, profile_type, apex_submission_id, created_at, last_login, file_count, total_size }] }`.
**Side effects:** ninguno.
**Consumer:** SPA del Hub, panel admin "Usuarios".
**Estado:** Frozen Sprint A. Tras introducir Cliente y Engagement, el shape se mantiene vía join con `clientes`/`engagements` y sincronización legacy.

#### `POST /api/portal-users`
**Auth:** Admin.
**Request body:** `{ email, password, nombre?, empresa?, rfc?, direccion?, ciudad?, cp?, telefono?, contacto_principal?, cargo?, sector? }`.
**Response 200:** `{ user: <fila creada con file_count: 0, total_size: 0> }`.
**Response 400:** `{ error: 'Email y contraseña son requeridos' }`.
**Response 409:** `{ error: 'Ya existe un usuario con ese email' }`.
**Side effects:** hashea password; crea fila `portal_users` con `role='user'`; crea carpeta Drive del usuario; loggea actividad `'user_created'`.
**Consumer:** SPA del Hub, panel admin creación de usuarios.
**Estado:** Frozen Sprint A. Tras introducir Cliente, este endpoint además crea/asocia el `cliente_id` mediante `domain-sync.js`.

#### `PATCH /api/portal-users/:id`
**Auth:** Admin.
**Request body:** subconjunto de `{ nombre, empresa, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector, current_phase, profile_type, apex_submission_id }`.
**Response 200:** `{ user: <fila actualizada> }`.
**Response 404:** `{ error: 'Usuario no encontrado' }`.
**Side effects:** loggea actividad `'user_updated'` con la lista de campos cambiados.
**Consumer:** SPA del Hub, panel admin edición de usuario y panel "Fase del Proceso".
**Estado:** Frozen Sprint A — **CONTRATO CRÍTICO**. Los campos `current_phase`, `profile_type`, `apex_submission_id` se siguen aceptando aquí; `domain-sync.js` propaga a `engagements`. Los campos empresariales se redirigen a `clientes`.

### 4.6 Portal — Admin: Activity log (1)

#### `GET /api/portal-activity?limit=<n>&offset=<n>&userId=<id>`
**Auth:** Admin.
**Response 200:** `{ activity: [{ id, action, details, ip_address, created_at, user_email, user_nombre }] }`.
**Side effects:** ninguno.
**Consumer:** SPA del Hub, panel admin "Actividad".
**Acciones registradas hoy:** `login`, `upload`, `delete`, `rename`, `user_created`, `user_updated`, `profile_updated`.
**Estado:** Frozen Sprint A.

### 4.7 APEX — Discovery flow (3)

#### `POST /api/research-company`
**Auth:** Pública.
**Request body:** `{ companyName?, website? }` (al menos uno).
**Response 200:**
```javascript
{
  success: true,
  profile: {
    empresa: { nombre, sector, descripcion_procesos, ... },
    detectado: {
      es_clinica: <boolean>,
      sector,
      tiene_equipo_campo,
      usa_crm_o_sistema,
      vende_a_credito,
      tiene_dashboards_reportes,
      confianza: <number>,
      ...
    }
  },
  searchedFor: <string>,        // companyName o website usado para la búsqueda
  hadWebSearch: <boolean>,       // true si Tavily devolvió resultados
  searchMethod: 'tavily' | 'none'
}
```
**Response 400:** `{ error: 'Company name or website required' }` — único path de error con código distinto de 200; ocurre cuando faltan ambos `companyName` y `website`.
**Response 200 (fallback en error):** ante cualquier excepción interna (Tavily caído, Groq error, etc.), el endpoint **devuelve HTTP 200** con payload de fallback:
```javascript
{
  success: false,
  error: <error.message>,
  profile: {
    empresa: { nombre: '', sector: null, descripcion_procesos: '' },
    detectado: { /* todos los campos en null o defaults conservadores */ }
  }
}
```
La SPA distingue éxito vs fallback por el flag `success` del payload, no por el status HTTP. Decisión histórica del backend para que el formulario nunca se rompa por un error externo.
**Side effects:** llamadas a Tavily y Groq; sin escritura en BD.
**Consumer:** SPA APEX (`apex/form.js`, paso de research).
**Estado:** Frozen Sprint A.
**Nota:** el campo `profile.detectado.es_clinica` clasifica al cliente como `clinica` o `distribuidor`, alimentando `profile_type` legacy.

#### `POST /api/generate-questions`
**Auth:** Pública.
**Request body:** `{ top4, rankOrder?, tipoNegocio?, researchProfile?, phase1Responses? }`.
**Response 200:** `{ success: true, questions: [{ texto, hint, profundiza_en, cruza_categorias, opciones: [{ texto, detecta, gravedad }] }], meta: {...} }`.
**Response 200 (fallback):** `{ success: false, error, questions: <fallback>, meta: { fallback: true } }`.
**Side effects:** llamada a Claude API (Anthropic); sin escritura en BD.
**Consumer:** SPA APEX, paso de preguntas adaptativas.
**Estado:** Frozen Sprint A.

#### `POST /api/submit-form`
**Auth:** Pública.
**Request body:** `formData` completo (objeto raíz). Campos canónicos consumidos:
- `id` (PK del submission, generado en cliente)
- `timestamp`
- `empresa.{nombre, contacto, email, whatsapp, tamaño, sector, tiene_campo, tecnologia_actual, motivacion, calidad_datos, pipeline_ventas, vende_credito, tiempo_reportes}`
- `investigacion_empresa`
- `tipo_negocio`
- `respuestas_fase1`, `respuestas_fase2`
- `swipe_situaciones`, `rank_order`, `preguntas_adaptativas`
- `pains_detectados_inicial`, `confirmacion_pains`, `pains_finales`
- `audio.{transcripcion, duracion_segundos}`
- `datos_uso.{team_size, roles, timeline, sistema_actual, ...}`
- `experiencias_sugeridas`, `plan_recomendado`

**Response 200:** `{ success: true, message: 'Formulario recibido correctamente', id: <formData.id> }`.
**Response 400:** `{ error: 'Email y nombre de contacto son requeridos' }`.
**Response 500:** `{ error: <error.message> }`.
**Side effects:**
1. Inserta una fila en `apex_submissions` con las 30 columnas (sección 5.4) — solo si `DATABASE_URL` está configurado.
2. Envía 2 emails vía Gmail SMTP (notificación a PRISMA + confirmación al cliente) — solo si `SMTP_USER`/`SMTP_PASS` están configurados. Errores de email se loggean pero no rompen la respuesta.

**Consumer:** SPA APEX, paso final de envío.
**Estado:** Frozen Sprint A. La columna `apex_submission_id` en `portal_users` se vincula manualmente con el `id` generado aquí (asignación posterior por admin).

### 4.8 AI — Groq proxy (2)

#### `POST /api/groq-chat`
**Auth:** Pública.
**Request body:** `{ messages, model?, temperature?, max_tokens? }` (formato OpenAI-style).
**Response 200:** estructura OpenAI-compatible (passthrough de Groq).
**Response 400:** `{ error: 'messages array is required' }`.
**Side effects:** proxy a Groq API.
**Consumer:** SPA APEX y posiblemente otras secciones del frontend que usen LLM.
**Estado:** Frozen Sprint A.

#### `POST /api/groq-whisper`
**Auth:** Pública.
**Request body:** `{ audioBase64, mimeType?, model?, language? }`.
**Response 200:** `{ text, ... }` (formato Whisper).
**Response 400:** `{ error: 'audioBase64 is required' }`.
**Side effects:** proxy a Groq Whisper API.
**Consumer:** SPA APEX, paso de grabación de audio.
**Estado:** Frozen Sprint A.

### 4.9 Resumen de endpoints (17)

| Categoría | # | Auth |
|---|---|---|
| Portal — Auth | 1 | Pública |
| Portal — APEX results | 1 | Auth |
| Portal — Profile | 2 | Auth |
| Portal — Files | 4 | Auth |
| Portal — Admin user mgmt | 3 | Admin |
| Portal — Admin activity | 1 | Admin |
| APEX — Discovery flow | 3 | Pública |
| AI — Groq proxy | 2 | Pública |
| **Total** | **17** | — |

---

## 5. Esquema de base de datos

Tablas en Neon PostgreSQL definidas en `server/schema.sql`. Todos los nombres de tabla y columna existentes son **contratos congelados durante Sprint A**: ninguno se borra, ninguno cambia de nombre. Solo se añaden nuevos.

### 5.1 `portal_users`

```sql
id SERIAL PRIMARY KEY
email TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL
nombre TEXT
empresa TEXT
rfc TEXT
direccion TEXT
ciudad TEXT
cp TEXT
telefono TEXT
contacto_principal TEXT
cargo TEXT
sector TEXT
role TEXT NOT NULL DEFAULT 'user'
current_phase INTEGER NOT NULL DEFAULT 1
profile_type TEXT NOT NULL DEFAULT 'clinica'
apex_submission_id TEXT
drive_folder_id TEXT
created_at TIMESTAMPTZ DEFAULT NOW()
last_login TIMESTAMPTZ
```

**Frozen.** Columnas que reciben atención especial durante la transición:
- `empresa`, `rfc`, `direccion`, `ciudad`, `cp`, `telefono`, `sector` → datos canónicos pasan a vivir en tabla `clientes` (fase 2). Aquí se conservan como legacy (`MODELO-DOMINIO.md` MD-2).
- `current_phase`, `profile_type`, `apex_submission_id` → datos canónicos pasan a `engagements`. Aquí se conservan como legacy (`MODELO-DOMINIO.md` MD-3, MD-5).
- `role` → fuente de verdad efectiva durante Sprint A (`MODELO-DOMINIO.md` MD-8).

**Columnas a añadir en fase 2** (todas nullable, no rompen):
- `cliente_id` (FK → `clientes`) — solo para `cliente_user`; NULL para `prisma_admin` (MD-20).
- `active_engagement_id` (FK → `engagements`) — solo para `cliente_user`; NULL para `prisma_admin` (MD-17, MD-20).

### 5.2 `portal_files`

```sql
id SERIAL PRIMARY KEY
drive_file_id TEXT UNIQUE NOT NULL
user_id INTEGER REFERENCES portal_users(id) ON DELETE SET NULL
file_name TEXT NOT NULL
display_name TEXT
file_size BIGINT DEFAULT 0
mime_type TEXT
doc_type TEXT DEFAULT 'general'
created_at TIMESTAMPTZ DEFAULT NOW()

INDEX idx_portal_files_user ON portal_files(user_id)
INDEX idx_portal_files_drive ON portal_files(drive_file_id)
```

**Frozen.** Columna a añadir en fase 2:
- `engagement_id` (FK → `engagements`) — canónico (los archivos pertenecen a un engagement).

**Nota:** la columna `drive_file_id` no cambia durante Sprint A. En Sprint B se generaliza a `tipo_almacenamiento` + `referencia_externa` (Drive o filesystem IONOS) — ese cambio queda fuera del alcance de Sprint A.

### 5.3 `portal_activity_log`

```sql
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES portal_users(id)
action TEXT NOT NULL
details JSONB
ip_address TEXT
created_at TIMESTAMPTZ DEFAULT NOW()

INDEX idx_activity_log_user ON portal_activity_log(user_id)
INDEX idx_activity_log_created ON portal_activity_log(created_at DESC)
```

**Frozen.** Acciones registradas hoy: `login`, `upload`, `delete`, `rename`, `user_created`, `user_updated`, `profile_updated`. Pueden añadirse más sin romper consumidores (la columna `action` es texto libre).

### 5.4 `apex_submissions`

**Nota crítica:** `server/schema.sql` está **desfasado** respecto al esquema vivo en Neon. El código real (`server/routes/apex.js` función `submit-form`) escribe **30 columnas** vía `INSERT INTO apex_submissions (...)`. La tabla tiene **31 columnas** en total (las 30 del INSERT más `created_at`, autoasignada por `DEFAULT NOW()`). De las 31 columnas reales, **5 no están documentadas en `schema.sql`**. El esquema autoritativo durante Sprint A es lo que el código escribe efectivamente en Neon, no el archivo `.sql`. Sincronizar `schema.sql` con la realidad es tarea de fase 2.

**Esquema completo real (31 columnas en la tabla; 30 escritas por el INSERT):**

```sql
-- Identidad y timestamp (2 — created_at autoasignada, no escrita por INSERT)
id                          TEXT PRIMARY KEY                              -- INSERT escribe
created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()        -- autoasignada

-- Datos de empresa (14 — todas escritas por INSERT)
empresa_nombre              TEXT
empresa_contacto            TEXT
empresa_email               TEXT NOT NULL
empresa_whatsapp            TEXT
empresa_tamano              TEXT
empresa_sector              TEXT
empresa_tiene_campo         TEXT
empresa_tecnologia_actual   JSONB
empresa_motivacion          JSONB
empresa_calidad_datos       TEXT
empresa_pipeline_ventas     JSONB
empresa_vende_credito       TEXT
empresa_tiempo_reportes     TEXT
investigacion_empresa       JSONB

-- Tipo y respuestas (6 — todas escritas por INSERT; 4 ausentes en schema.sql)
tipo_negocio                TEXT       -- ⚠ activa, ausente en schema.sql
respuestas_fase1            JSONB
swipe_situaciones           JSONB      -- ⚠ activa, ausente en schema.sql
rank_order                  JSONB      -- ⚠ activa, ausente en schema.sql
respuestas_fase2            JSONB
preguntas_adaptativas       JSONB      -- ⚠ activa, ausente en schema.sql

-- Pains (3 — todas escritas por INSERT)
pains_detectados_inicial    JSONB
confirmacion_pains          TEXT
pains_finales               JSONB

-- Audio (2 — todas escritas por INSERT)
audio_transcripcion         TEXT
audio_duracion_segundos     INTEGER

-- Datos de uso y recomendación (4 — todas escritas por INSERT; 1 ausente en schema.sql)
datos_uso                   JSONB      -- ⚠ activa, ausente en schema.sql
experiencias_sugeridas      JSONB
plan_recomendado            TEXT
raw_data                    JSONB

-- Total: 2 + 14 + 6 + 3 + 2 + 4 = 31 columnas en la tabla.
--        INSERT escribe 30 (todas excepto created_at).

INDEX idx_apex_submissions_email      ON apex_submissions(empresa_email)
INDEX idx_apex_submissions_created_at ON apex_submissions(created_at DESC)
INDEX idx_apex_submissions_sector     ON apex_submissions(empresa_sector)
```

**Frozen Sprint A.** No se modifica el contenido de la tabla en Sprint A. Sí se actualiza `schema.sql` en fase 2 para reflejar la realidad (acción documental, no de BD).

**Verificación:** las 5 columnas marcadas con ⚠ se confirman leyendo `server/routes/apex.js` función `submit-form`, sentencia `INSERT INTO apex_submissions (...)`. Si la tabla en Neon no las tuviera, el INSERT fallaría — el hecho de que el formulario funcione hoy demuestra que existen físicamente.

### 5.5 Tablas nuevas en fase 2 (aditivas)

`clientes`, `client_memberships`, `engagements`, `entrevistas`, `entregables`. Esquema detallado en `MODELO-DOMINIO.md` secciones 5.2 y 11.1. **Ningún consumidor existente las depende** — son aditivas puras.

---

## 6. Paths hardcodeados en frontend

Rutas físicas que el JavaScript del frontend construye literalmente y que dejan de funcionar si los archivos se mueven sin compensación.

### 6.1 Paths a entregables ARMC en `portal/index.html`

Tres constantes JavaScript declaradas como variables `const` en `portal/index.html`:

| Variable | Valor | Uso |
|---|---|---|
| `ANALISIS_BASE_PATH` | `'/portal/analisis/armc/diagramas/'` | concatenado con `s.file` (nombre del HTML) para abrir diagramas en iframe |
| `ANALISIS_DIAGNOSTICO_PATH` | `'/portal/analisis/armc/diagnostico/'` | concatenado con `s.file` para abrir HTMLs de diagnóstico |
| `ANALISIS_BLUEPRINT_PATH` | `'/portal/analisis/armc/blueprint/'` | concatenado con `s.file` para abrir HTMLs de blueprint |

**Detección:** búsqueda exhaustiva con `grep -rn "portal/analisis/armc"` confirma que estas 3 constantes son las únicas referencias hardcodeadas en el frontend. Otras referencias en `portal/analisis/GUIA-NUEVAS-SECCIONES.md` son documentación (sección 7).

**Estado:** estas constantes **fueron reemplazadas** por consultas a la **capa de registro de rutas** en v3.2.46-48 (ver `REGISTRO-RUTAS.md`). El refactor desacopló la SPA del path físico antes del movimiento de archivos previsto para fase 2.

**Forma actual implementada:**
```javascript
const ANALISIS_REGISTRY = {
  armc: {
    diagramas:   '/portal/analisis/armc/diagramas/',
    diagnostico: '/portal/analisis/armc/diagnostico/',
    blueprint:   '/portal/analisis/armc/blueprint/'
  }
};
function getAnalysisPaths(cliente) {
  const entry = ANALISIS_REGISTRY[cliente];
  if (!entry) { console.warn(`getAnalysisPaths: cliente "${cliente}" no registrado`); return null; }
  return entry;
}
const _armcPaths = getAnalysisPaths('armc');
// consumers: _armcPaths?.diagramas, _armcPaths?.diagnostico, _armcPaths?.blueprint
// viewers con guardia: if (!section || !section.path) return;
```

El registro es síncrono y embebido en el frontend (objeto JS literal en `portal/index.html`). Si crece, evoluciona a tabla/endpoint en sprints posteriores.

### 6.2 Otros paths

No se han detectado otros paths hardcodeados a artefactos físicos en el frontend de la SPA Hub o de la SPA APEX. Las referencias a CSS, JS, fuentes e imágenes son rutas relativas o canónicas que el `express.static` resuelve naturalmente.

**Auditoría adicional pendiente como cautela:** revisar `apex/form.js` (3500+ líneas) en fase 2 antes del movimiento físico de `apex/` → `prisma-apex/core/discovery-engine/`. Si hubiera paths del estilo `'/apex/...'` hardcodeados allí, recibirían el mismo tratamiento que los del Hub.

### 6.3 Nota técnica importante

Las cuatro fases legacy del sistema (`Formulario APEX`, `Documentación`, `Entrevistas`, `Análisis de flujos y procesos`) **derivan del fallback al perfil clínica del frontend** (`portal/index.html` define la lista de fases en código JS asumiendo `profile_type='clinica'`). Cuando entre la vertical distribuidor real, **probablemente las 4 fases visibles del panel admin cambiarán o se condicionarán por vertical**. Este punto no es un contrato funcional sino una nota técnica para fase 3 (cuando se cree la vertical distribuidor real).

---

## 7. Documentación que asume estructura

Archivos `.md` que dan instrucciones referenciando rutas físicas concretas. Si las rutas cambian, esta documentación queda desfasada.

### 7.1 `portal/analisis/GUIA-NUEVAS-SECCIONES.md`

**Contenido:** guía operativa para crear nuevas secciones de análisis (diagramas, diagnósticos, blueprint) en la estructura ARMC.

**Referencias detectadas con `grep -n "portal/analisis/armc"`:** múltiples (líneas 84, 130, 294 mencionadas por el revisor en revisiones previas).

**Acción requerida en fase 2:** actualizar todas las referencias para apuntar a la nueva estructura (`prisma-apex/clientes-publicados/[cliente]/...`) **simultáneamente** al movimiento de archivos. La guía debe quedar coherente al final de fase 2.

**Estado:** abierto. Acción de mantenimiento de fase 2.

### 7.2 `README.md`

**Contenido:** descripción breve del proyecto, posiblemente con referencias a estructura de carpetas.

**Acción requerida:** revisión y actualización en fase 2 si menciona paths antiguos. Si no los menciona, sin acción.

**Estado:** abierto. Auditoría rápida de fase 2.

### 7.3 `CLAUDE.md`

**Contenido:** instrucciones técnicas del proyecto. Sección "Directory Structure" actualmente lista la estructura legacy (`apex/`, `portal/`, etc.).

**Acción requerida:** actualizar la sección "Directory Structure" en fase 2 al final del movimiento físico para que refleje la nueva organización.

**Estado:** abierto. Acción de fase 2.

### 7.4 `CHANGELOG.md`

**Contenido:** historial de cambios. Las entradas históricas referencian paths antiguos.

**Acción:** **no se modifican** las entradas históricas. Son registro inmutable. Las entradas nuevas usarán los paths nuevos.

---

## 8. Redirects necesarios tras la reorganización

Resumen de redirects HTTP que el servidor debe servir tras fase 2 para preservar contratos sin romper enlaces externos.

### 8.1 Redirect 301 — Entregables ARMC

```javascript
// server.js (estado deseado tras fase 2)
app.get('/portal/analisis/:cliente/*', (req, res) => {
  const newPath = req.path.replace('/portal/analisis/', '/publicados/');
  res.redirect(301, newPath);
});
```

**Cobertura:** todas las rutas que comienzan por `/portal/analisis/[cualquier-cliente]/`. Suficiente para ARMC y futuros clientes.

**Validación de fase 2:** abrir cada uno de los HTMLs vía URL antigua y verificar que redirige correctamente al nuevo path.

### 8.2 Sin redirects para SPAs

Las URLs `/`, `/apex`, `/hub`, `/api/*`, `/aviso-legal*`, `/cookies*`, `/privacidad*` **no requieren redirect** porque su path público no cambia (solo cambian los path físicos internos en el repo).

---

## 9. Reglas de evolución de contratos

Modificar un contrato es legítimo y se hace cuando aporta valor; lo que no se permite es romperlo sin compatibilidad.

### 9.1 Patrón estándar para modificar un contrato

1. **Anunciar** el cambio (CHANGELOG, comunicación a consumidores externos si aplica).
2. **Mantener el contrato viejo funcionando** durante un periodo de transición razonable (3-6 meses por defecto; indefinido si no es costoso).
3. **Servir el nuevo contrato en paralelo**.
4. **Tras periodo de transición y verificación de que ya nadie consume el viejo**, retirarlo (o dejarlo indefinidamente como redirect/alias si el coste es cero).

### 9.2 Aplicado al Sprint A

- **Entregables ARMC** (sección 3.3): URL nueva canónica `/publicados/armc/...`. URL antigua `/portal/analisis/armc/...` redirige 301. Periodo de transición indefinido.
- **Endpoints de API** (sección 4): ninguno se renombra durante Sprint A. Todos siguen exactamente como hoy.
- **Schema BD** (sección 5): solo aditivo. Cierre de campos legacy queda fuera de Sprint A.

### 9.3 Cambios fuera de Sprint A que sí modificarán contratos

- **Sprint B (almacén Drive → IONOS):** la columna `drive_file_id` se generaliza. Plan de transición propio.
- **Sprint posterior (centralización auth):** el JWT puede dejar de incluir `role` cuando todos los consumidores usen `client_memberships`. Plan propio.
- **Sprint posterior (renombre público de `/hub`):** decisión de comunicación, no técnica. Plan propio.

---

## 10. Consumidores externos identificados

Lista de "quién usa qué" para validar que cada cambio considera a todos los afectados.

### 10.1 Frontend SPAs en este repo

| Consumer | Endpoints API que llama | URLs públicas que sirve |
|---|---|---|
| `apex/index.html` (Discovery SPA) | `/api/research-company`, `/api/generate-questions`, `/api/submit-form`, `/api/groq-chat`, `/api/groq-whisper` | `/apex` |
| `portal/index.html` (Hub SPA) | `/api/portal-auth`, `/api/portal-apex-results`, `/api/portal-profile` (GET/PATCH), `/api/portal-upload`, `/api/portal-files` (GET/DELETE/PATCH), `/api/portal-users` (GET/POST), `/api/portal-users/:id` (PATCH), `/api/portal-activity` | `/hub` y entregables ARMC vía iframe |

### 10.2 Frontend público

| Consumer | URLs |
|---|---|
| `index.html` (landing) | sirve sus propios assets en `/css/*`, `/js/*`, `/images/*`; enlaza externamente a `/apex` y `/hub` |
| Páginas legales (`aviso-legal.html`, `cookies.html`, `privacidad.html`) | sirven contenido estático sin dependencias externas |

### 10.3 Consumidores externos al repo

| Consumer | Qué consume | Mitigación si cambia |
|---|---|---|
| Clientes humanos | `/`, `/hub`, `/apex` (URLs guardadas en favoritos/correos) | Mantener congeladas durante Sprint A |
| Cliente humano (ARMC) | URLs de entregables `/portal/analisis/armc/...` posiblemente compartidas en correos | Redirect 301 indefinido a `/publicados/armc/...` |
| Buscadores (Google) | URLs públicas indexadas | Idem; redirects 301 actualizan el índice |
| Email transaccional | URLs en correos automatizados (si existen) | Auditar antes de cualquier renombre público; ninguno previsto Sprint A |

---

## 11. Decisiones cerradas

| # | Decisión |
|---|---|
| CT-1 | URLs públicas `/`, `/apex`, `/hub`, `/api/*`, `/aviso-legal*`, `/cookies*`, `/privacidad*`, `/css/*`, `/js/*`, `/images/*` **frozen durante Sprint A**. Ninguna se renombra. |
| CT-2 | URLs de entregables ARMC `/portal/analisis/armc/...` **se sustituyen por `/publicados/armc/...` en fase 2** con redirect 301 indefinido desde la URL antigua. |
| CT-3 | Los **17 endpoints API** (sección 4) **frozen durante Sprint A**: ningún endpoint se renombra ni cambia su shape de request/response. |
| CT-4 | Los endpoints `/api/portal-profile` (PATCH) y `/api/portal-users/:id` (PATCH) son **CONTRATOS CRÍTICOS**: siguen aceptando los campos empresariales y de fase exactamente como hoy; la sincronización a `clientes` y `engagements` es transparente vía `domain-sync.js`. |
| CT-5 | Las **4 tablas BD** existentes (`portal_users`, `portal_files`, `portal_activity_log`, `apex_submissions`) son **frozen durante Sprint A**: solo se añaden tablas y columnas nuevas (aditivas). |
| CT-6 | Las 5 tablas nuevas de fase 2 (`clientes`, `client_memberships`, `engagements`, `entrevistas`, `entregables`) son **aditivas**; ningún consumidor existente las depende. |
| CT-7 | Las 3 constantes hardcodeadas en `portal/index.html` (`ANALISIS_BASE_PATH`, `ANALISIS_DIAGNOSTICO_PATH`, `ANALISIS_BLUEPRINT_PATH`) **fueron reemplazadas por la capa de registro de rutas** (v3.2.46-47, `REGISTRO-RUTAS.md`): `ANALISIS_REGISTRY` + `getAnalysisPaths(cliente)` + consumers con optional chaining + guardia `if (!section.path)` en los 2 viewers. |
| CT-8 | `portal/analisis/GUIA-NUEVAS-SECCIONES.md`, `README.md` y la sección "Directory Structure" de `CLAUDE.md` **se actualizan en fase 2** simultáneamente al movimiento físico. |
| CT-9 | El `CHANGELOG.md` no se modifica retroactivamente. Entradas históricas son inmutables. |
| CT-10 | Cualquier cambio que **modifique** un contrato (no romperlo, modificarlo) requiere: anuncio en CHANGELOG + convivencia temporal viejo/nuevo + redirect/alias hasta retirada. |
| CT-11 | El JWT contract `{id, email, nombre, role}` **frozen durante Sprint A**. Centralización de auth queda fuera. |
| CT-12 | El payload del email de confirmación enviado por `/api/submit-form` es contrato implícito; cualquier cambio se documenta. |
| CT-13 | El comportamiento del fallback `app.get('*', ...)` (404 con cuerpo de landing) se mantiene. Mejora opcional fuera del alcance. |
| CT-14 | Las 4 fases legacy visibles en `portal/index.html` derivan del fallback clínica; **es nota técnica, no contrato funcional**. Cambios reales por vertical se contemplan en fase 3. |

---

## 12. Validación de fase 2

Estos son los tests manuales mínimos que **deben pasar** antes de aprobar el merge de fase 2 a `main`. Cubren los contratos listados en este documento.

### 12.1 URLs públicas

- [ ] `prismaconsul.com/` carga la landing.
- [ ] `prismaconsul.com/aviso-legal` y `/aviso-legal.html` cargan ambos.
- [ ] `prismaconsul.com/cookies` y `/cookies.html` cargan ambos.
- [ ] `prismaconsul.com/privacidad` y `/privacidad.html` cargan ambos.
- [ ] `prismaconsul.com/apex` carga la SPA Discovery.
- [ ] `prismaconsul.com/hub` carga la SPA Hub.
- [ ] `prismaconsul.com/css/styles.css` responde 200.
- [ ] `prismaconsul.com/js/main.js` responde 200.
- [ ] `prismaconsul.com/images/logos/...` responde 200.

### 12.2 Entregables ARMC (tras redirect 301)

- [ ] `prismaconsul.com/publicados/armc/diagramas/flujo-ceo.html` responde 200.
- [ ] `prismaconsul.com/portal/analisis/armc/diagramas/flujo-ceo.html` responde 301 → `/publicados/armc/diagramas/flujo-ceo.html`.
- [ ] Idem para los otros 6 diagramas (atencion-paciente, cirujano, enfermero, cosmiatra, primer-ayudante, tricologia).
- [ ] Idem para los 5 HTMLs de diagnóstico.
- [ ] Idem para los 5 HTMLs de blueprint.
- [ ] La SPA Hub abre los iframes correctamente con la nueva URL.

### 12.3 Endpoints API (cliente)

- [ ] `POST /api/portal-auth` con credenciales armc@ devuelve token + payload completo (incluyendo `current_phase`, `profile_type`, `apex_submission_id`, `empresa`).
- [ ] `GET /api/portal-profile` devuelve los datos del usuario.
- [ ] `PATCH /api/portal-profile` con cambio en `empresa` o `rfc` actualiza correctamente y devuelve la fila actualizada.
- [ ] `POST /api/portal-upload` sube archivo a Drive correctamente.
- [ ] `GET /api/portal-files` lista los archivos.
- [ ] `DELETE /api/portal-files?fileId=X` borra el archivo.
- [ ] `PATCH /api/portal-files?fileId=X` con `{name}` renombra el display_name.
- [ ] `GET /api/portal-apex-results` devuelve el submission del usuario si tiene `apex_submission_id`.

### 12.4 Endpoints API (admin)

- [ ] `POST /api/portal-auth` con credenciales info@ devuelve token con `role='admin'`.
- [ ] `GET /api/portal-users` devuelve listado completo con file_count y total_size.
- [ ] `POST /api/portal-users` crea un nuevo usuario y carpeta Drive.
- [ ] `PATCH /api/portal-users/:id` actualiza datos del usuario incluyendo `current_phase`, `profile_type`, `apex_submission_id`.
- [ ] `GET /api/portal-activity` devuelve el log de actividad.
- [ ] `GET /api/portal-files?userId=X` (admin) devuelve archivos del usuario X.
- [ ] `POST /api/portal-upload` con `userId` en form (admin) sube archivo para el usuario X.

### 12.5 Endpoints API (APEX flow)

- [ ] `POST /api/research-company` con `companyName` válido devuelve estructura con `detectado.es_clinica`.
- [ ] `POST /api/generate-questions` con `top4` válido devuelve `questions` array.
- [ ] `POST /api/submit-form` con `formData` válido inserta en `apex_submissions` y envía email.

### 12.6 Endpoints API (AI)

- [ ] `POST /api/groq-chat` con `messages` válido devuelve respuesta de Groq.
- [ ] `POST /api/groq-whisper` con audio en base64 devuelve transcripción.

### 12.7 Schema BD

- [ ] Tablas legacy (`portal_users`, `portal_files`, `portal_activity_log`, `apex_submissions`) intactas con todas sus columnas.
- [ ] Tablas nuevas (`clientes`, `client_memberships`, `engagements`, `entrevistas`, `entregables`) creadas.
- [ ] Migración de datos: 1 fila en `clientes` (ARMC), 1 fila en `engagements`, 2 filas en `client_memberships` (info@ y armc@).
- [ ] `portal_users.cliente_id` y `active_engagement_id` poblados según reglas (NULL para info@, set para armc@).

### 12.8 Sincronización (`domain-sync.js`)

- [ ] PATCH a `portal_users.empresa` propaga a `clientes.nombre` (cuando `cliente_id` no es NULL).
- [ ] PATCH a `portal_users.current_phase` propaga a `engagements.fase_legacy_id`.
- [ ] PATCH a `clientes.nombre` (vía nuevo endpoint admin) propaga a `portal_users.empresa` de los usuarios pertenecientes.

---

## 13. Pendientes de auditoría adicional en fase 2

Antes de ejecutar movimientos físicos en fase 2, se completan estas auditorías cortas:

- **Revisar `apex/form.js`** (3500+ líneas) en busca de paths hardcodeados a artefactos físicos. Si se encuentran, recibirán el mismo tratamiento que las constantes del Hub.
- **Revisar `apex/signal-detector.js`** y otros JS auxiliares.
- **Revisar `js/main.js`** (landing) por las dudas.
- **Buscar referencias a `portal/`** en general por `grep -rn "['\"]\/portal\/" --include="*.html" --include="*.js"`.

---

## 14. Estado del gate de Fase 2 y entregables restantes de Fase 1

**Regla operativa única (del `REVIEW-PRISMA-APEX.md` sección 7, gate vigente):**

> Fase 2 solo puede aprobarse cuando **C09** esté marcado como cerrado en el review. C04 ya está cerrado (v3.2.37). C10 debe quedar absorbido antes del **cierre total de Fase 1**.

Es decir: **el único bloqueante de Fase 2 es C09**. C10 y los entregables de la lista inferior no bloquean Fase 2 — bloquean el cierre total de Fase 1, que es un evento posterior a abrir Fase 2.

### 14.1 Gate de Fase 2

- ✅ **C01** (identidad canónica de Cliente) — cerrado en `MODELO-DOMINIO.md` v4.
- ✅ **C02** (compatibilidad Engagement / Vertical legacy) — cerrado en `MODELO-DOMINIO.md` v4.
- ✅ **C03** (serving de clientes-publicados) — cerrado en `MODELO-DOMINIO.md` v4.
- ✅ **C04** (alineación de `ECOSISTEMA.md`) — cerrado en v3.2.37.
- ✅ **C05** (regla de sincronización `client_membership`) — cerrado en `MODELO-DOMINIO.md` v4.
- 🟡 **C09** (inventario contractual real) — **propuesto cerrado por este documento**, pendiente validación del revisor.

Cuando el revisor confirme C09 → **Fase 2 desbloqueada**.

### 14.2 Entregables restantes de Fase 1 (para el cierre total, no para abrir Fase 2)

Estos entregables se completan en paralelo a Fase 2 o antes del cierre total de Fase 1; **no son prerrequisito de Fase 2**:

- ✅ **C10** — `GLOSARIO.md` (absorción del vocabulario canónico). Cerrado en v3.2.44.
- ✅ Capa de registro de rutas (especificación + implementación) — `REGISTRO-RUTAS.md` + refactor en `portal/index.html`. Cerrada en v3.2.46-48 (spec, impl, optional chaining + guardia en viewers, alineación canónica).
- 🔲 Smoke tests sobre el slice del registro (bloque B): entregable mixto, checklist + primera ejecución, separado en 3 bloques (locales, externos con credenciales — N/A para este slice, dev/VPS).
- 🔲 Clasificación archivo por archivo (qué se mueve, qué se queda, qué va a `prisma-consulting`).
- 🔲 Plan archivo a archivo de Fase 2 — aprobado por usuario antes de movimientos físicos.
- 🔲 Modo revisor permanente en `CLAUDE.md`.
- 🔲 Replicación de sección Ecosistema en `CLAUDE.md` de los otros repos del ecosistema.

**Nota operativa:** la capa de registro de rutas, ya implementada, era prerrequisito técnico para mover físicamente `portal/analisis/armc/` en Fase 2 sin romper la SPA. Con la capa lista, el movimiento físico se vuelve seguro. Smoke tests sobre el slice (bloque B) confirmarán que el comportamiento de ARMC sigue idéntico tras el refactor.

---

**Fin de CONTRATOS.md.**

Auditable como unidad. Tras revisión, se procede al siguiente entregable.
