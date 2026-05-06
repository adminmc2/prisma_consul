# PRISMA Consul - Web Platform

## Project Overview

Marketing website + B2B discovery tool + document portal for PRISMA Consul, a pharma/healthcare consulting company. Self-hosted on IONOS VPS.

**Live URL:** https://prismaconsul.com
**Hosting:** IONOS VPS (Ubuntu 24.04, nginx + Express.js + PM2)
**Database:** Neon PostgreSQL (serverless)
**File Storage:** Google Drive (via Workspace domain-wide delegation)

## Ecosistema de repositorios

Este repo es uno de varios que conforman el sistema PRISMA:

- **`web-de-prisma`** (este) — Web pública + Prisma APEX (sistema interno).
- **`prisma-trabajo-clientes`** (privado, NUEVO en fase 1) — Texto colaborativo de PRISMA por cliente: contratos, notas, transcripciones, drafts.
- **`prisma-consulting`** — Metodología APEX (frameworks, plantillas abstractas, dolores).
- **`apex-agents`** — Plataforma de agentes IA (CrewAI).
- **`above-pharma`** (ABBE) — Asistente de ventas Above Pharma (HF Spaces).
- **`prisma-server-ops`** — Operación del VPS IONOS (no es código de producto).

Mapa completo, flujos cruzados, convenciones y relaciones entre repos: ver [`ECOSISTEMA.md`](./ECOSISTEMA.md).

## Modo revisor permanente

**Comportamiento base del workspace durante la reorganización Sprint A.** Antes de aprobar cualquier cambio importante (nuevos entregables, refactors, decisiones que afecten estructura, contratos o modelo de dominio), contrastar el cambio contra:

1. **`CONTRATOS.md`** — verificar que no se rompe ningún contrato externo (URLs públicas, endpoints API, esquema BD, paths hardcodeados, documentación que asume estructura). Si el cambio toca un contrato listado, requerir compensación explícita (redirect, alias, sincronización) o aprobación del cambio.
2. **`MODELO-DOMINIO.md`** — verificar coherencia con el modelo canónico (entidades, relaciones, jerarquía Producto/Vertical/Engagement, separación canónico vs transitorio).
3. **Buenas prácticas de desarrollo** — minimal diff, separación de concerns, no expansion of scope sin justificación, alineación con la spec correspondiente.
4. **Impacto en verticales activas** — cualquier cambio se evalúa en términos de cómo afecta a `clinica-multi`, `clinica-personal` y `distribuidor`, y al cliente operativo actual (ARMC).

**Cuándo aplicar:** este modo se activa de forma implícita en todos los entregables de Sprint A. No es un skill explícito invocable; es comportamiento base del workspace que se observa **antes** de proponer cualquier cambio relevante.

**Cuándo NO aplicar:** cambios triviales (bumps de versión, ajustes de typos, entradas en CHANGELOG) no requieren contraste exhaustivo. La regla aplica al alcance de la decisión, no a cada línea editada.

**Ámbito temporal:** vigente durante todo Sprint A (incluye Fase 1, Fase 2, Fase 3 y Fase 4). Tras el cierre del Sprint A + Sprint B (`v4.0.0`), se evalúa si esta práctica se mantiene como base permanente del proyecto o si se relaja.

## Modo de trabajo en dos carriles

**Vigente desde el cierre baseline pre-Fase 2 (`v3.3.22`).**

- **Ejecutor 1 — carril repo:** trabaja en la carpeta principal sobre `dev`; gestiona git de integración, absorción de SHAs aprobados, deploy, release, infraestructura, versionado visible y reconciliación main/dev. No edita contenido narrativo ni blueprint salvo permiso explícito.
- **Ejecutor 2 — carril contenido:** trabaja en un worktree dedicado; desarrolla texto, blueprint, análisis ARMC, hallazgos y narrativa de entregables. Puede dejar commits locales identificables para handoff por SHA, pero no integra en `dev`, no hace push, no despliega, no publica releases ni toca el versionado visible.
- **Revisor:** coordina, dictamina, sincroniza review central. Sostiene el modo revisor permanente.

**Reglas operativas:**

- Los dos carriles trabajan en **superficies de checkout separadas**. Convención vigente: **carpeta principal limpia y alineada** = carril repo; **worktree dedicado** = carril contenido. Nunca sobre la misma superficie al mismo tiempo.
- La integración es **serial**: un carril completa, el revisor da PASS, el otro toma esa base y avanza. No hay merges paralelos sin dictamen.
- La carpeta principal del usuario (`/Users/armandocruz/Documents/PRISMA CONSUL/PHARMA/web-de-prisma`) **sí es la base oficial del carril repo y del release a `dev`**. Debe arrancar y cerrar cada slice limpia, alineada con `origin/dev` y operada solo por el ejecutor 1.
- El carril contenido opera en un **worktree dedicado** y sobre una **rama local real**; no toca git, deploy ni release.
- **Antes del primer commit de cualquier carril, la superficie correspondiente debe operar sobre una rama local real, no en `detached HEAD`.** Convención: el carril contenido usa `chore/fase2-contenido-base-vX.Y.Z`; el carril repo trabaja desde la carpeta principal sobre `dev`, salvo instrucción explícita del revisor.
- El handoff del carril contenido se congela por **SHA/commit aprobado**, no bloqueando toda la rama ni todo el worktree.
- Si un subpaso estructural mueve o renombra un subtree activo del carril contenido, el ejecutor 2 se pausa; el carril repo absorbe primero los SHAs aprobados y solo después ejecuta el movimiento estructural.
- Tras cada publicación en `dev`, realinear de inmediato la carpeta principal a `origin/dev`, confirmar que queda limpia y dejar cualquier worktree extra fuera de la operación normal.
- Los worktrees extra quedan solo para auditorías, experimentos o recuperación temporal; no son base normal de release.
- **Mitigación obligatoria al operar en la carpeta principal (carril repo).** Antes de iniciar cualquier slice del carril repo en la carpeta principal, el ejecutor 1 debe: (a) verificar `git status` limpio; (b) si hay WIP del usuario, **parar y reportar antes de tocar git**; (c) si el slice implica `git mv` masivos o cambios en archivos que el usuario pueda tener abiertos en el editor (especialmente subpasos físicos como 2.2, 2.3, 2.4 que mueven `portal/`, `apex/`, ARMC), **avisar al usuario antes de ejecutar** para que cierre o guarde sus pestañas; (d) tras el slice, devolver la carpeta principal a estado **limpio y alineado con `origin/dev`**.
- Cualquier cambio fuera del alcance del carril activo requiere parar y reportar.

## Architecture

This is a monorepo with 3 frontend apps sharing one Express.js backend:

```
/                        → Marketing landing page (prismaconsul.com)
/apex                    → APEX Discovery Form (prismaconsul.com/apex) — requiere login
/hub                     → PRISMA Hub (prismaconsul.com/hub) — requiere login
/api/*                   → Express.js API backend
```

## Directory Structure

> **Estructura vigente tras los subpasos 2.1 a 2.7 de Fase 2 (`v3.3.40`).** La web pública vive bajo `web/`, los entregables ARMC bajo `prisma-apex/clientes-publicados/armc/`, el entrypoint del Hub en `prisma-apex/index.html`, el discovery engine en `prisma-apex/core/discovery-engine/` y los recursos compartidos (fuentes Phosphor del discovery) bajo `shared/fonts/phosphor/`. El subpaso **2.6** (`v3.3.38`) ejecutó la **migración aditiva de BD** sobre Neon (5 tablas nuevas + columnas transitorias en `portal_users` y canónica en `portal_files`); el árbol de archivos no cambió. El subpaso **2.7** (`v3.3.39`) añadió el helper de dominio `server/lib/domain-sync.js` (skeleton, no invocado todavía). URL canónica de entregables: `/publicados/[cliente]/...` (legacy `/portal/analisis/[cliente]/...` resuelve vía redirect 301). URL pública del discovery `/apex` se mantiene idéntica. URL pública de recursos compartidos: `/shared/...`. `portal/` queda vestigial; `apex/` queda eliminado del árbol efectivo tras 2.5 (vacío, sin tracking git).

```
├── web/                        # Web pública (Subpaso 2.1, v3.3.25+)
│   ├── index.html              # Landing page
│   ├── aviso-legal.html        # Legal pages
│   ├── cookies.html
│   ├── privacidad.html
│   ├── css/styles.css
│   ├── js/main.js
│   └── images/                 # All media assets
│       ├── logos/              # SVG logos, favicon
│       ├── team/               # Team member photos
│       └── videos/             # Marketing videos
├── prisma-apex/                # Sistema interno PRISMA APEX (en construcción)
│   ├── index.html              # PRISMA Hub — entrypoint (Subpaso 2.3, v3.3.33)
│   ├── core/
│   │   └── discovery-engine/   # APEX Discovery — movido en Subpaso 2.4 (v3.3.36)
│   │       ├── index.html
│   │       ├── form.js         # Main form logic (~3500 lines)
│   │       ├── form.css
│   │       └── signal-detector.js
│   └── clientes-publicados/    # Entregables publicados por cliente (Subpaso 2.2, v3.3.31)
│       └── armc/               # ARMC — primer cliente
│           ├── index.html
│           ├── diagramas/      # 7 flujos por rol + template
│           ├── diagnostico/    # Resumen, fricciones, matriz, embudo, cadena causal
│           ├── blueprint/      # Modelo datos, flujos to-be, automatizaciones, fases, KPIs
│           └── css/
├── shared/                     # Recursos compartidos entre apps (Subpaso 2.5, v3.3.37)
│   └── fonts/
│       └── phosphor/           # Phosphor Icons del discovery — servido bajo /shared/fonts/phosphor/
│           ├── phosphor.css
│           ├── Phosphor.woff2
│           ├── Phosphor.woff
│           └── Phosphor.ttf
├── portal/                     # Vestigio post-2.3 (sin contenido propio; soporte vestigial para routing legacy)
│   └── analisis/               # Vacío — residual del subpaso 2.2
├── server/                     # Express.js backend
│   ├── server.js               # App setup, middleware, route mounting
│   ├── package.json            # All backend dependencies
│   ├── schema.sql              # PostgreSQL schema reference
│   ├── middleware/
│   │   ├── cors.js             # CORS headers (all routes)
│   │   └── auth.js             # JWT verification + requireAdmin middleware
│   ├── routes/
│   │   ├── portal.js           # Auth, upload, file management, user management, activity log
│   │   ├── apex.js             # Research, questions, form submission
│   │   └── ai.js               # Groq LLM chat + Whisper transcription
│   └── lib/
│       ├── pain-knowledge-base.js  # Pain/situation database (469 pains)
│       ├── google-drive.js     # Google Drive client + per-user folder helpers
│       ├── fetch-timeout.js    # Fetch wrapper with AbortController
│       └── domain-sync.js      # Capa única legacy ↔ nuevo. Skeleton en 2.7 (v3.3.39); cableado mínimo en v3.3.42 — `syncLegacyUserUpdate` invocado por `PATCH /api/portal-profile` y `PATCH /api/portal-users/:id`, sincronización atómica vía `sql.transaction()`. `profile_type` queda legacy-only en este slice (ver MD-4); `syncClienteUpdate` y `syncEngagementUpdate` siguen como skeleton.
├── .env                        # Secrets (NOT committed)
├── .gitignore
└── .github/
    └── dependabot.yml          # Weekly dependency monitoring
```

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (no frameworks)
- **Fonts:** Quicksand (headings) + Source Sans 3 (body) via Google Fonts
- **Icons:** Phosphor Icons (local font files in `shared/fonts/phosphor/` — centralizadas en el subpaso 2.5 / `v3.3.37`; el discovery las consume vía `/shared/fonts/phosphor/phosphor.css`. El Hub sigue usando Phosphor por CDN)
- **Backend:** Express.js with modular routes (server/routes/)
- **Database:** Neon PostgreSQL (`apex_submissions`, `portal_users`, `portal_files`, `portal_activity_log`)
- **Auth:** JWT (jsonwebtoken) + bcryptjs, 24h token expiry. Role-based: admin/user. Shared auth for APEX y Hub.
- **APIs:** Groq (LLM + Whisper), Tavily (web search), Claude API (questions)
- **File Storage:** Google Drive API via Service Account with domain-wide delegation
- **Email:** Gmail SMTP via Nodemailer

## Design System

- **Theme:** Dark (`--prisma-navy: #101B2C`, `--bg-primary: #1a2535`)
- **Accent:** `--tech-cyan: #31BEEF`
- **Secondary:** `--visionary-violet: #994E95`, `--soft-blue: #A1B8F2`
- **Text:** `--clinical-white: #FAF9F6`
- **Screen transitions:** opacity + translateY 400ms ease (APEX pattern)
- **Button styles:** `border-radius: 4px 25px 25px 4px` (primary), `25px 4px 4px 25px` (logout)

## Environment Variables

Required in `.env` on the VPS (`~/web-de-prisma/.env`):

```
# APIs
GROQ_API_KEY=
TAVILY_API_KEY=
CLAUDE_API_KEY=

# Database
DATABASE_URL=              # Neon PostgreSQL connection string

# Email
SMTP_USER=                 # Gmail address
SMTP_PASS=                 # Gmail app password

# Portal
PORTAL_SECRET=             # JWT signing secret
GOOGLE_SERVICE_ACCOUNT_KEY= # Full JSON of Google SA credentials
GOOGLE_DRIVE_FOLDER_ID=    # Target Drive folder ID
```

## Key Patterns

### APEX Form Flow
Login → Welcome → Company Input → Research (Tavily+Groq) → Swipe Cards → MaxDiff → Top4 → Phase 1 Questions → Phase 2 Adaptive → Pains → Audio → Contact → Thank You

### Business Type System
- `SITUACIONES_DISTRIBUIDOR` (16 cards, IDs: A-P) for distributors/pharma
- `SITUACIONES_CLINICA` (16 cards, IDs: CA-CP) for clinics
- Type detected from `research-company.js` field `detectado.es_clinica`

### PRISMA Hub (Portal)
- Login → Role detection → Admin gets 3 tabs (Documentos, Usuarios, Actividad), User gets 1 tab (Documentos)
- Upload: Drag files → Stage with type classification → Click "Subir" → Upload to user's Google Drive subfolder
- Admin can "view as user" to see any client's files
- Admin can create new users from the Usuarios tab

### Google Drive Integration
- Service Account with domain-wide delegation impersonates `info@prismaconsul.com`
- Scope: `https://www.googleapis.com/auth/drive`
- Client ID for delegation: `105667745242936760421`
- Per-user subfolders: `GOOGLE_DRIVE_FOLDER_ID/user_{id}/` — each user's files are isolated

## Database Tables

### `apex_submissions`
Stores APEX form completions with company data, research results, responses, pains, and audio.

### `portal_users`
Portal login users with: `id, email, password_hash, nombre, empresa, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector, role, drive_folder_id, created_at, last_login`

### `portal_files`
File ownership tracking: `id, drive_file_id, user_id, file_name, file_size, mime_type, doc_type, created_at`

### `portal_activity_log`
Activity audit log: `id, user_id, action, details (JSONB), ip_address, created_at`
Actions: `login`, `upload`, `delete`, `rename`, `user_created`

## Portal Users

- **Admin:** info@prismaconsul.com (role: admin — dashboard completo con gestión de usuarios y actividad)
- **Client:** armc@prismaconsul.com (role: user — ARMC Aesthetic Rejuvenation Medical Center)

## Git Workflow

- **`main`** → Producción (`prismaconsul.com`). El VPS despliega desde aquí. **NO trabajar directamente en main.**
- **`dev`** → Desarrollo (`dev.prismaconsul.com`). Todos los cambios se hacen aquí primero.
- **GitHub se mantiene** como repositorio central, backup del código e historial de cambios.

### Flujo de trabajo

1. Trabajar siempre en `dev`
2. Commit en `dev` → push a GitHub → **desplegar en `dev.prismaconsul.com`** para probar visualmente
3. Verificar los cambios en `https://dev.prismaconsul.com`
4. Cuando esté verificado, fusionar a `main`: `git checkout main && git merge dev && git push`
5. Volver a `dev` para seguir: `git checkout dev`
6. Actualizar el servidor de producción: `ssh prisma@212.227.251.125 "cd ~/web-de-prisma && git pull origin main && pm2 restart prisma-consul"`

### Despliegue a dev.prismaconsul.com

```bash
# Tras hacer commit + push a rama dev:
git push origin dev
ssh prisma@212.227.251.125 "cd ~/web-de-prisma-dev && git pull origin dev && pm2 restart prisma-dev"
```

### Reglas

- Nunca hacer push directo a `main` sin haber probado en `dev.prismaconsul.com`
- Antes de fusionar a `main`, verificar que todo funciona en dev.prismaconsul.com
- Los commits en `dev` pueden ser frecuentes y granulares
- Los merges a `main` deben representar cambios completos y funcionales
- Nunca editar código directamente en el servidor — siempre desde local

### Coordinación Operativa Antes De Fase 2

- Tras el baseline `v3.3.22`, la coordinación `main`/`dev` previa a Fase 2 quedó cerrada. Cualquier nuevo arranque de Fase 2 o release intermedio opera desde ramas/worktrees limpios y bajo el modo de dos carriles; el historial de esa coordinación vive en `docs/historico/sprint-a/PLAN-COORDINACION-PRE-FASE2.md`.
- Si por urgencia se publica algo directo en `main`, el siguiente paso obligatorio es reconciliar ese cambio en `dev` antes de nuevos cambios estructurales o documentales relevantes.
- Solo un agente escritor a la vez en este repo. El revisor puede actualizar `REVIEW-PRISMA-APEX.md`, pero no debe coexistir con otro agente ejecutando cambios en paralelo sin handoff explícito.
- Nunca usar credenciales en URLs Git o comandos shell (`https://user:token@...`, `https://oauth2:...`, `x-access-token:`). Método autorizado: `gh auth login` + `gh auth setup-git`.

## Development

Hay dos formas de probar cambios antes de desplegar a producción:

### Opción A — Servidor local (rápido para cambios aislados)

```bash
# Start local dev server (Express)
cd server && node server.js

# Access apps locally
http://localhost:3000          # Landing page
http://localhost:3000/apex     # APEX form
http://localhost:3000/hub      # Hub
```

### Opción B — Entorno remoto `dev.prismaconsul.com` (recomendado)

Es un entorno real que sirve la rama `dev` desde el VPS, con SSL, nginx, BD y Drive **idénticos a producción**. Es el único entorno donde probar visualmente cambios del Hub antes del merge a `main`. Detalles y flujo de despliegue: ver sección "IONOS VPS (Producción y Desarrollo)".

## IONOS VPS (Producción y Desarrollo)

**VPS:** IONOS, Ubuntu 24.04, IP `212.227.251.125`
**Acceso:** `ssh prisma@212.227.251.125` (clave SSH, sin contraseña)
**Credenciales locales:** `.server-credentials` (en .gitignore)
**Stack:** nginx + Express.js + PM2 + Let's Encrypt SSL
**Backup:** Acronis Cyber Protect (agente instalado, backup semanal completo + diario incremental)

El mismo VPS sirve **dos entornos**:

### Producción — `prismaconsul.com` + `prismaconsul.com/hub`

- **Código:** `/home/prisma/web-de-prisma/` (rama `main`)
- **Proceso PM2:** `prisma-consul` (id 0) — Express en puerto 3000
- **Nginx:** bloque `server_name prismaconsul.com www.prismaconsul.com`
- **Despliegue:** `ssh prisma@212.227.251.125 "cd ~/web-de-prisma && git pull origin main && pm2 restart prisma-consul"`
- **SSL:** Let's Encrypt (certbot, renovación automática) + Cloudflare SSL Full (Strict)

### Desarrollo — `dev.prismaconsul.com` + `dev.prismaconsul.com/hub`

- **Código:** `/home/prisma/web-de-prisma-dev/` (rama `dev`)
- **Proceso PM2:** `prisma-dev` (id 1) — Express en puerto 3001
- **Config PM2:** `/home/prisma/ecosystem-dev.config.js` (apps → prisma-dev, script → /home/prisma/web-de-prisma-dev/server/server.js, cwd → /home/prisma/web-de-prisma-dev, env.PORT → 3001)
- **Nginx:** bloque dedicado en `/etc/nginx/sites-enabled/prisma-dev` con `server_name dev.prismaconsul.com`
- **Despliegue:** `ssh prisma@212.227.251.125 "cd ~/web-de-prisma-dev && git pull origin dev && pm2 restart prisma-dev"`
- **SSL:** Let's Encrypt independiente para `dev.prismaconsul.com` (certbot, renovación automática)
- **BD y Drive:** **comparte los de producción** (Neon + Google Drive). Cualquier cambio en dev toca datos reales de clientes — ten cuidado al subir/borrar archivos en dev.
- **Uso:** ver cambios en el Hub antes de desplegar a producción. Única URL donde verificar visualmente cambios del frontend en rama `dev`.

### DNS y Cloudflare

Los nameservers del dominio están en **Cloudflare** (migrados desde IONOS para soportar subdominios custom como `abbe.prismaconsul.com`).

- **Nameservers:** `bruce.ns.cloudflare.com`, `cass.ns.cloudflare.com`
- **SSL/TLS mode:** Full (Strict) — obligatorio porque nginx ya tiene Let's Encrypt. Si se pone "Flexible" se produce un redirect loop 301
- **Proxy:** Todos los registros A/CNAME con proxy activado (nube naranja)
- **Registros DNS:**
  - A `prismaconsul.com` → `212.227.251.125` (Proxied)
  - A `www` → `212.227.251.125` (Proxied)
  - A `dev` → `212.227.251.125` (Proxied)
  - CNAME `abbe` → `mandocc2-abbe.hf.space` (Proxied) — proyecto ABBE en HF Spaces
  - CNAME `_domainconnect` → `_domainconnect.ionos.com` (técnico IONOS)
  - MX → Google Workspace (`aspmx.l.google.com` + alternativas)
  - TXT → SPF (`v=spf1 include:_spf.google.com`) + Google site verification

**Importante:** Cualquier nuevo subdominio debe crearse en Cloudflare, no en IONOS. El panel DNS de IONOS ya no gestiona este dominio.

### Securización (COMPLETADO)

1. Usuario `prisma` con sudo (root SSH desactivado)
2. Clave SSH ed25519 (contraseñas SSH desactivadas)
3. Firewall UFW (puertos 22, 80, 443, 44445)
4. Fail2ban activo
5. Actualizaciones automáticas (`unattended-upgrades`)
6. DNSSEC activado

### Stack del servidor (COMPLETADO)

1. Node.js 22 LTS + npm
2. nginx como reverse proxy (estáticos + `/api/*` → Express)
3. Express.js con rutas modulares (`server/server.js` + `server/routes/`)
4. PM2 gestionando Express (auto-restart, boot startup)
5. SSL con Let's Encrypt (certbot, renovación automática cada 90 días)
6. Variables de entorno en `~/web-de-prisma/.env`

### Pendiente

- **Deploy automático** — Configurar git hook o script para que al hacer push a `main` el servidor se actualice solo

## Comunicación

- Antes de ejecutar cada paso, explicar **qué se va a hacer, por qué y qué efecto tiene**
- Las explicaciones deben ser para un **perfil no especialista técnico**: lenguaje claro, analogías cuando sea útil, sin asumir conocimientos previos de infraestructura o devops
- Además de la explicación sencilla, incluir siempre una **explicación profesional**: qué es el programa/herramienta técnicamente, qué hace, por qué se ha elegido frente a otras alternativas y qué beneficios aporta
- Cada acción (en el servidor, en el código, en la configuración) debe ir acompañada de una **comprobación verificable** que confirme que el paso se completó correctamente
- Tras cada acción relevante o de impacto, **analizar si es necesario actualizar**: CLAUDE.md, la memoria del proyecto, el changelog, `.gitignore`, variables de entorno u otra documentación del proyecto. No esperar a que se acumulen cambios — documentar al momento

## Versionado

La versión actual se muestra en el footer de `web/index.html`. Se usa **Versionado Semántico** (`MAJOR.MINOR.PATCH`):
- **MAJOR** — Cambio grande: rediseño, nueva arquitectura (v1 → v2 → v3)
- **MINOR** — Funcionalidad nueva (v3.0 → v3.1)
- **PATCH** — Correcciones, bugs, parches de seguridad (v3.0.0 → v3.0.1)

**Versión actual:** `v3.3.44`

Al hacer cualquier cambio, actualizar la versión en:
1. El footer de `web/index.html` (línea del `footer__bottom`, en `data-es`, `data-en` y el texto visible)
2. La pantalla de login de `prisma-apex/index.html` (elemento `.welcome-version`) — entrypoint del Hub desde el subpaso 2.3 (`v3.3.33`)
3. La cabecera del `CHANGELOG.md` (nueva entrada con la versión)
4. Este campo "Versión actual" en CLAUDE.md

## Changelog

El archivo `CHANGELOG.md` en la raíz del proyecto registra todos los cambios relevantes. **Es obligatorio actualizarlo en cada cambio** que se haga al proyecto — ya sea código, configuración, infraestructura o dependencias. Cada entrada debe incluir:
- Fecha (`[YYYY-MM-DD]`)
- Categoría (Seguridad, Infraestructura, Frontend, Backend, Repositorio, etc.)
- Descripción clara del cambio y por qué se hizo

## Common Gotchas

- Phosphor Icons need BOTH classes: `ph ph-icon-name`
- Backend deps: install with `cd server && npm install`
- Google Drive SA needs domain-wide delegation in Google Admin console
- Spanish characters: use real UTF-8 chars, not `\u00xx` escapes in HTML
- SVG logo (`logo_simbolo_V2.svg`) has large viewBox whitespace — handle sizing in CSS, don't modify the SVG
- APEX y PRISMA Hub comparten autenticación (`server/middleware/auth.js` + tabla `portal_users`)
- Auth middleware exports `{ auth, requireAdmin }` — auth verifica JWT, requireAdmin exige role='admin'
- Google Drive: cada usuario tiene su subcarpeta (`user_{id}/`). Los archivos se rastrean en `portal_files`
- JWT incluye `{id, email, nombre, role}` — tokens antiguos sin role se tratan como 'user'
