# server/ — Backend Express.js

Instrucciones locales para trabajar dentro de `server/`. El contexto repo-wide vive en el `CLAUDE.md` raíz; aquí solo el detalle fino del backend.

## Mapa de la carpeta

- `server.js` — entrypoint Express: middleware, mounts, rutas.
- `routes/` — rutas modulares: `portal.js` (auth + upload + users + activity log), `apex.js` (research Tavily+Groq, questions Claude, submit form + email), `ai.js` (passthrough Groq chat + Whisper).
- `middleware/` — `cors.js` (headers todas las rutas), `auth.js` (verificación JWT + `requireAdmin`).
- `lib/` — `google-drive.js` (cliente + helpers por usuario), `pain-knowledge-base.js` (catálogo de dolores), `fetch-timeout.js` (wrapper de `fetch` con `AbortController`), `domain-sync.js` (sincronización legacy ↔ modelo nuevo; ver estado abajo).
- `scripts/` — scripts puntuales de mantenimiento.
- `schema.sql` — referencia del esquema PostgreSQL.

## Auth (compartida APEX + Hub)

- Middleware en `auth.js`. Exporta `{ auth, requireAdmin }`. `auth` verifica JWT y rellena `req.user`; `requireAdmin` exige `role === 'admin'`.
- JWT shape: `{ id, email, nombre, role }`. Expira a 24h. Tokens antiguos sin `role` se tratan como `'user'`.
- Hash con `bcryptjs`. Secret de firma: `PORTAL_SECRET` (en `.env`).
- Misma tabla `portal_users` sirve a APEX y al Hub.

## Tablas Neon PostgreSQL

- `apex_submissions` — envíos completos del discovery (datos empresa, research, respuestas, dolores, audio).
- `portal_users` — login del portal: `id, email, password_hash, nombre, empresa, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector, role, drive_folder_id, created_at, last_login`.
- `portal_files` — propiedad de archivos: `id, drive_file_id, user_id, file_name, file_size, mime_type, doc_type, created_at`.
- `portal_activity_log` — auditoría: `id, user_id, action, details (JSONB), ip_address, created_at`. Acciones: `login`, `upload`, `delete`, `rename`, `user_created`.
- Tablas nuevas del modelo de dominio (`clientes`, `client_memberships`, `engagements`, `entrevistas`, `entregables`) — añadidas en migración aditiva `v3.3.38`. Ver `MODELO-DOMINIO.md` para shape canónico.

## Google Drive

- Service Account con domain-wide delegation impersonando `info@prismaconsul.com`. Scope `https://www.googleapis.com/auth/drive`.
- **Cada usuario tiene su subcarpeta** dentro de `GOOGLE_DRIVE_FOLDER_ID/user_{id}/`. Los archivos quedan aislados por usuario.
- Cada `portal_users` apunta a su carpeta vía `drive_folder_id`.
- Cambios de scope o de impersonación se hacen en Google Admin Console; el repo solo consume.

## `domain-sync.js`

Capa única legacy ↔ modelo nuevo. Estado real (`v3.3.42`):

- `syncLegacyUserUpdate` **cableado** — invocado por `PATCH /api/portal-profile` y `PATCH /api/portal-users/:id`, sincronización atómica vía `sql.transaction()`.
- `profile_type` queda **legacy-only** en este cableado (decisión MD-4; ver `MODELO-DOMINIO.md` §6.6 addendum).
- `syncClienteUpdate` y `syncEngagementUpdate` siguen como **skeleton** — no cableados todavía.

## Gotchas backend

- **Backend deps**: `cd server && npm install` (el `package.json` del backend vive aquí, no en raíz).
- **Contratos críticos** `PATCH /api/portal-profile` y `PATCH /api/portal-users/:id` siguen aceptando los campos empresariales y de fase exactamente como hoy; la sincronización a `clientes`/`engagements` es transparente vía `domain-sync.js` (ver `CONTRATOS.md` CT-4).
- **Endpoints API frozen durante Sprint A** (`CONTRATOS.md` CT-3). Ningún endpoint se renombra ni cambia su shape sin slice propio + compensación.
- **Esquema BD frozen durante Sprint A** (`CONTRATOS.md` CT-5): solo se añaden tablas/columnas nuevas, nunca se modifican las 4 existentes.
- **404 fallback**: `app.get('*', ...)` devuelve cuerpo de landing (`CONTRATOS.md` CT-13). Mantener.
