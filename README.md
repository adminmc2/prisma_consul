# PRISMA Consul — Web Platform

> **Estado:** vigente · **Última verificación:** 2026-05-23.
> Portada técnica del repo. Se actualiza cuando la estructura mayor cambia.
> Ciclo de vida y mapa de todos los documentos: [`docs/OPERATIVA.md` §0.5](docs/OPERATIVA.md#05-mapa-único-de-documentos-y-ciclo-de-vida).

Web de marketing + formulario de descubrimiento APEX + sistema interno Prisma APEX para [PRISMA Consul](https://prismaconsul.com), consultora especializada en pharma y healthcare.

## Stack

- **Frontend:** HTML/CSS/JS vanilla (sin frameworks)
- **Backend:** Express.js con rutas modulares
- **Base de datos:** Neon PostgreSQL (serverless)
- **Almacenamiento:** Google Drive API (Service Account)
- **AI:** Groq (LLM + Whisper), Tavily (búsqueda web), Claude API (preguntas adaptativas)
- **Email:** Gmail SMTP via Nodemailer
- **Hosting:** IONOS VPS (Ubuntu 24.04, nginx + PM2 + Let's Encrypt SSL)

## Aplicaciones

| Ruta | App | Descripción |
|------|-----|-------------|
| `/` | Landing page | Web de marketing de PRISMA Consul |
| `/apex` | APEX Discovery | Formulario interactivo de descubrimiento empresarial |
| `/hub` | Prisma APEX (Hub) | Sistema interno: gestión de clientes, archivos y entregables (requiere login) |
| `/publicados/[cliente]/...` | Entregables | HTMLs de análisis publicados por cliente |
| `/api/*` | API REST | Backend compartido por las apps |

## Estructura

```
├── web/                          # Web pública (landing + legales)
│   ├── index.html
│   ├── aviso-legal.html
│   ├── cookies.html
│   ├── privacidad.html
│   ├── css/                      # Estilos de la landing
│   ├── js/                       # Scripts de la landing
│   └── images/
│       ├── logos/                # SVG logos, favicons, OG image
│       ├── team/                 # Fotos del equipo
│       └── videos/               # Videos de marketing
├── prisma-apex/                  # Sistema interno Prisma APEX
│   ├── index.html                # Hub — entrypoint (SPA, ~servida en /hub)
│   ├── core/                     # Núcleo común a todos los clientes
│   │   ├── discovery-engine/     # Formulario APEX Discovery (servido en /apex)
│   │   └── simulador-ux/         # Simulador UX — módulo interno del Hub
│   └── clientes-publicados/      # Entregables publicados por cliente
│       └── armc/                 # ARMC — primer cliente real
├── shared/                       # Recursos compartidos entre apps
│   └── fonts/phosphor/           # Phosphor Icons (servido en /shared/...)
├── server/                       # Backend Express.js
│   ├── server.js                 # Setup, middleware, montaje de rutas
│   ├── package.json
│   ├── schema.sql                # Esquema PostgreSQL de referencia
│   ├── middleware/
│   │   ├── cors.js               # CORS (todas las rutas)
│   │   └── auth.js               # Verificación JWT + requireAdmin
│   ├── routes/
│   │   ├── portal.js             # Auth, upload, gestión de archivos y usuarios
│   │   ├── apex.js               # Research, preguntas, submit
│   │   └── ai.js                 # Groq LLM + Whisper
│   ├── lib/
│   │   ├── pain-knowledge-base.js # Base de 469 dolores empresariales
│   │   ├── google-drive.js       # Cliente Google Drive (Service Account)
│   │   ├── fetch-timeout.js      # Fetch con AbortController
│   │   └── domain-sync.js        # Sincronización legacy ↔ modelo de dominio
│   └── scripts/                  # Scripts de mantenimiento puntual
├── docs/                         # Documentación operativa y guías
├── CLAUDE.md                     # Documentación técnica detallada
├── CHANGELOG.md
└── .env                          # Variables de entorno (no committed)
```

## Desarrollo local

```bash
# Instalar dependencias
cd server && npm install

# Arrancar servidor (modo watch)
npm run dev
# o bien: node server.js

# Acceder
http://localhost:3000              # Landing
http://localhost:3000/apex         # APEX Discovery
http://localhost:3000/hub          # Prisma APEX (Hub)
```

Requiere un archivo `.env` con las variables documentadas en `CLAUDE.md`.

## Despliegue

El VPS sirve dos entornos desde el mismo servidor: producción (`prismaconsul.com`, rama `main`) y desarrollo (`dev.prismaconsul.com`, rama `dev`). El flujo completo de git y despliegue está en `CLAUDE.md`.

```bash
# Flujo estándar: trabajar en dev, verificar en dev.prismaconsul.com, fusionar a main
git checkout dev
# ... hacer cambios ...
git push origin dev
ssh prisma@<IP> "cd ~/web-de-prisma-dev && git pull origin dev && pm2 restart prisma-dev"
# Verificado en dev → fusionar a main y desplegar producción (ver CLAUDE.md)
```

## Incidencia operativa conocida (2026-05-09)

Se registró un incidente regional entre **Movistar/Telefónica (AS3352)** y el prefijo anycast de **Cloudflare** que estaba sirviendo `prismaconsul.com` y `dev.prismaconsul.com`.

- El patrón correcto es: **DNS resuelve bien, Cloudflare edge hace timeout, origen IONOS responde 200 directo**.
- Eso significa que el problema puede ser de **ruta ISP ↔ Cloudflare**, no del repo, del VPS o del certificado.
- Si el sitio abre desde otros países/redes pero falla desde una ruta concreta en España, revisar primero conectividad a Cloudflare antes de tocar la aplicación.
- El detalle completo del diagnóstico, evidencias y mitigaciones operativas vive en `CLAUDE.md`.

## Licencia

Propiedad de PRISMA Consul. Todos los derechos reservados.