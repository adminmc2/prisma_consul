# PRISMA Consul — Web Platform

Web de marketing + formulario de descubrimiento APEX + portal de documentos para [PRISMA Consul](https://prismaconsul.com), consultora especializada en pharma y healthcare.

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
| `/apex` | APEX Discovery Form | Formulario interactivo de descubrimiento empresarial |
| `/documentacion` | Portal de Documentos | Gestión de documentos por cliente (Google Drive) |
| `/api/*` | API REST | Backend compartido para las 3 apps |

## Estructura

```
├── index.html                     # Landing page
├── aviso-legal.html               # Páginas legales
├── cookies.html
├── privacidad.html
├── css/styles.css                 # Estilos landing
├── js/main.js                     # Scripts landing
├── images/
│   ├── logos/                     # SVG logos, favicons, OG image
│   ├── team/                      # Fotos del equipo
│   └── videos/                    # Videos de marketing
├── apex/                          # APEX Discovery Form (SPA)
│   ├── index.html
│   ├── form.js                    # Lógica principal (~3500 líneas)
│   ├── form.css
│   ├── signal-detector.js
│   └── fonts/                     # Phosphor Icons (local)
├── portal/                        # Portal de Documentos (SPA)
│   └── index.html
├── server/                        # Backend Express.js
│   ├── server.js                  # Setup, middleware, montaje de rutas
│   ├── package.json
│   ├── schema.sql                 # Esquema PostgreSQL de referencia
│   ├── middleware/
│   │   ├── cors.js                # CORS (todas las rutas)
│   │   └── auth.js                # Verificación JWT
│   ├── routes/
│   │   ├── portal.js              # Auth, upload, gestión de archivos
│   │   ├── apex.js                # Research, preguntas, submit
│   │   └── ai.js                  # Groq LLM + Whisper
│   └── lib/
│       ├── pain-knowledge-base.js # Base de 469 dolores empresariales
│       ├── google-drive.js        # Cliente Google Drive (Service Account)
│       └── fetch-timeout.js       # Fetch con AbortController
├── .env                           # Variables de entorno (no committed)
├── .gitignore
└── CLAUDE.md                      # Documentación técnica detallada
```

## Desarrollo local

```bash
# Instalar dependencias
cd server && npm install

# Arrancar servidor
npm run dev

# Acceder
http://localhost:3000              # Landing
http://localhost:3000/apex         # APEX
http://localhost:3000/documentacion # Portal
```

Requiere un archivo `.env` con las variables documentadas en `CLAUDE.md`.

## Despliegue

El VPS despliega desde la rama `main`. Ver `CLAUDE.md` para el flujo completo de git y despliegue.

```bash
# Flujo estándar
git checkout dev          # Trabajar en dev
# ... hacer cambios ...
git checkout main         # Cambiar a producción
git merge dev             # Fusionar
git push origin main      # Push a GitHub
# Actualizar VPS:
ssh prisma@<IP> "cd ~/web-de-prisma && git pull origin main && cd server && npm install && pm2 restart prisma-consul"
```

## Licencia

Propiedad de PRISMA Consul. Todos los derechos reservados.
