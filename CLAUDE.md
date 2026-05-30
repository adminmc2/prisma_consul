# PRISMA Consul - Web Platform

> **⚠ LEER ANTES DE CUALQUIER ACCIÓN — Condiciones inviolables.**
> Antes de tocar nada en este repo, leer **[`docs/OPERATIVA.md` §0 — Condiciones
> inviolables](docs/OPERATIVA.md#0-condiciones-inviolables--leer-siempre-primero)**.
> Esas reglas son no negociables: seguridad, orden operativo, límite del acto
> creativo (no deriva LLM), calidad mínima y jerarquía de documentos. En conflicto
> con cualquier sección de este `CLAUDE.md`, **prevalecen las inviolables** y se
> escala al revisor.
>
> **Modo de trabajo vigente:** [`docs/OPERATIVA.md`](docs/OPERATIVA.md) (roles,
> capas, escalado, handoff, validación). En conflicto sobre *cómo se trabaja*,
> prevalece `OPERATIVA.md`.
>
> **Plan vigente:** ninguno abierto. F1 (reestructuración técnica) cerrado en
> `v3.4.0` (2026-05-25); plan archivado en
> [`docs/historico/F1-PLAN.md`](docs/historico/F1-PLAN.md). Cualquier acción
> estructural nueva requiere abrir su propio plan o slice acordado con el
> revisor antes de ejecutar.

## Project Overview

Marketing website + B2B discovery tool + document portal para PRISMA Consul (consultoría pharma/healthcare). Self-hosted en VPS IONOS. Live: `prismaconsul.com` · Dev: `dev.prismaconsul.com`.

## Ecosistema de repositorios

Este repo es uno de varios del sistema PRISMA: `web-de-prisma` (este), `prisma-trabajo-clientes`, `prisma-consulting`, `apex-agents`, `above-pharma` (ABBE), `prisma-server-ops`. Mapa completo, flujos cruzados y relaciones: ver [`ECOSISTEMA.md`](./ECOSISTEMA.md).

## Modo revisor permanente

Comportamiento base del workspace. Antes de aprobar cualquier cambio relevante (entregables nuevos, refactors, decisiones que afecten estructura/contratos/modelo), contrastar contra: (1) [`CONTRATOS.md`](./CONTRATOS.md) — sin romper contratos externos sin compensación explícita; (2) [`MODELO-DOMINIO.md`](./MODELO-DOMINIO.md) — coherencia con el modelo canónico; (3) buenas prácticas (minimal diff, separación de concerns, no expansión de scope); (4) impacto en verticales activas (`clinica-multi`, `clinica-personal`, `distribuidor`) y el cliente operativo actual (ARMC). No es skill invocable; es comportamiento base. No aplica a cambios triviales (bumps, typos, entradas de CHANGELOG).

## Architecture

Monorepo con 3 frontends servidos por un único Express: `/` (landing) · `/apex` (APEX Discovery, requiere login) · `/hub` (PRISMA Hub, requiere login) · `/api/*` (backend).

## Directory Structure

Estructura vigente (`v3.3.77`). URLs canónicas de entregables: `/publicados/[cliente]/...` (legacy `/portal/analisis/...` resuelve por 301). El simulador no tiene URL pública: se sirve bajo `/core/simulador-ux/...`.

```
web/                          # Web pública (landing + legales + css/js/images)
prisma-apex/
  index.html                  # PRISMA Hub — entrypoint (SPA)
  core/
    discovery-engine/         # APEX Discovery — servido en /apex
    simulador-ux/             # Simulador UX — módulo interno del Hub
  clientes-publicados/<cliente>/   # Entregables (diagramas, diagnóstico, blueprint)
shared/fonts/phosphor/        # Phosphor Icons — servido bajo /shared/fonts/phosphor/
server/                       # Express.js (server.js, middleware/, routes/, lib/, scripts/)
.env                          # Secrets (NOT committed)
```

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS. Fuentes Quicksand + Source Sans 3 (Google Fonts). Iconos Phosphor (local en `shared/fonts/phosphor/`; el Hub aún usa Phosphor por CDN).
- **Backend:** Express.js con rutas modulares (`server/routes/`).
- **Database:** Neon PostgreSQL (`apex_submissions`, `portal_users`, `portal_files`, `portal_activity_log` + tablas nuevas del modelo de dominio).
- **Auth:** JWT + bcryptjs, 24h. Roles admin/user. Auth compartida APEX/Hub.
- **APIs externas:** Groq (LLM + Whisper), Tavily (web search), Claude API.
- **File Storage:** Google Drive API via Service Account con domain-wide delegation.
- **Email:** Gmail SMTP via Nodemailer.

## Design System

- Tema dark: `--prisma-navy: #101B2C`, `--bg-primary: #1a2535`.
- Acento: `--tech-cyan: #31BEEF`. Secundarios: `--visionary-violet: #994E95`, `--soft-blue: #A1B8F2`. Texto: `--clinical-white: #FAF9F6`.
- Transiciones de pantalla: opacity + translateY 400ms ease (patrón APEX).
- Botones: `border-radius: 4px 25px 25px 4px` (primario), `25px 4px 4px 25px` (logout).

## Environment Variables

Requeridas en `.env` (NO committed). Solo nombres — valores en el VPS:

```
GROQ_API_KEY · TAVILY_API_KEY · CLAUDE_API_KEY · DATABASE_URL (Neon)
SMTP_USER · SMTP_PASS (Gmail) · PORTAL_SECRET (JWT)
GOOGLE_SERVICE_ACCOUNT_KEY · GOOGLE_DRIVE_FOLDER_ID
```

## Development

Arranque local rápido:

```bash
cd server && node server.js
# http://localhost:3000          Landing
# http://localhost:3000/apex     APEX form
# http://localhost:3000/hub      Hub
```

Para verificación visual real (SSL, nginx, BD y Drive idénticos a producción) usar **`dev.prismaconsul.com`** — único entorno donde validar cambios del Hub antes del merge a `main`. Despliegue: ver Git Workflow.

## Git Workflow

- **`main`** → Producción (`prismaconsul.com`). **NO trabajar directamente en main.**
- **`dev`** → Desarrollo (`dev.prismaconsul.com`). Todo cambio se hace aquí primero.

```bash
# 1. Trabajar en dev y desplegar a dev.prismaconsul.com
git checkout dev
# ... cambios ...
git push origin dev
ssh prisma@212.227.251.125 "cd ~/web-de-prisma-dev && git pull origin dev && pm2 restart prisma-dev"

# 2. Verificar en https://dev.prismaconsul.com

# 3. Promover a main y desplegar producción
git checkout main && git merge dev && git push
ssh prisma@212.227.251.125 "cd ~/web-de-prisma && git pull origin main && pm2 restart prisma-consul"

# 4. Volver a dev
git checkout dev
```

**Reglas:** nunca push directo a `main` sin verificar en `dev.prismaconsul.com`. Nunca editar código en el servidor — siempre desde local. Credenciales: `gh auth login` + `gh auth setup-git` (jamás en URLs ni shell).

## IONOS VPS

Runtime del repo en VPS IONOS (Ubuntu 24.04, IP `212.227.251.125`, nginx + Express + PM2). El mismo VPS sirve **producción** (`/home/prisma/web-de-prisma/`, PM2 `prisma-consul`, puerto 3000) y **desarrollo** (`/home/prisma/web-de-prisma-dev/`, PM2 `prisma-dev`, puerto 3001). Dev comparte BD y Drive con producción — cuidado al subir/borrar archivos en dev. Operación detallada del servidor (securización, stack, backups, deploy automático): repo `prisma-server-ops`.

## DNS y Cloudflare

DNS y proxy gestionados desde Cloudflare (nameservers `bruce.ns.cloudflare.com`, `cass.ns.cloudflare.com`). SSL/TLS mode **Full (Strict)** obligatorio (nginx tiene Let's Encrypt; "Flexible" genera redirect loop 301). Cualquier subdominio nuevo se crea en **Cloudflare**, no en IONOS. Registros y operación detallada en `prisma-server-ops`.

## Incidencia conocida — Movistar/Telefónica ↔ Cloudflare (2026-05-09)

- **Síntoma:** desde salidas Movistar/Telefónica en España, `prismaconsul.com` y `dev.prismaconsul.com` quedaban en timeout, mientras desde otras rutas cargaban.
- **Diagnóstico verificado:** DNS resolvía bien (`188.114.96.5`/`188.114.97.5`). TCP/443 a esas IPs anycast hacía timeout antes de TLS. El origen IONOS `212.227.251.125` respondía `HTTP/1.1 200 OK` directo. `mtr`/`traceroute` se perdían dentro de `AS3352` (Telefónica) antes de llegar a `AS13335` (Cloudflare). Cloudflare WARP funcionaba al cambiar la ruta.
- **Qué NO era:** ni bug del repo, ni del certificado Let's Encrypt, ni caída general de Cloudflare, ni del navegador.
- **Regla práctica:** si el origen IONOS responde `200` pero Cloudflare edge hace timeout desde una región concreta, tratar como **incidencia de red ISP ↔ Cloudflare**, no como caída de PRISMA.
- Mitigaciones operativas detalladas (pausar Cloudflare, DNS only, toggle Proxied, salida completa de Cloudflare) en `prisma-server-ops`.

## Versionado

Versionado Semántico (`MAJOR.MINOR.PATCH`). **Versión actual:** `v3.4.7`.

En cada cambio publicable actualizar la versión en los **4 puntos canónicos**: (1) footer de `web/index.html` (`footer__bottom`, en `data-es`, `data-en` y texto visible); (2) login de `prisma-apex/index.html` (`.welcome-version`); (3) cabecera de [`CHANGELOG.md`](./CHANGELOG.md) (entrada nueva); (4) este campo "Versión actual".

## Changelog

[`CHANGELOG.md`](./CHANGELOG.md) registra todos los cambios relevantes (fecha `[YYYY-MM-DD]` · categoría · descripción + porqué). Obligatorio actualizar en cada commit publicable.

## Common Gotchas (repo-wide)

- **Phosphor Icons** necesitan AMBAS clases: `ph ph-icon-name`. Prohibido unicode literal o entidades HTML para iconos en cualquier archivo del repo.
- **Backend deps:** instalar con `cd server && npm install`.
- **Caracteres españoles:** usar UTF-8 real, no escapes `\u00xx` en HTML.
- **SVG logo** (`logo_simbolo_V2.svg`) tiene viewBox con whitespace amplio — ajustar tamaño en CSS, no modificar el SVG.