# PRISMA Consul - Web Platform

## Project Overview

Marketing website + B2B discovery tool + document portal for PRISMA Consul, a pharma/healthcare consulting company. Deployed on Netlify with serverless backend.

**Live URL:** https://prismaconsul.com
**Hosting:** Netlify (auto-deploy from `main` branch)
**Database:** Neon PostgreSQL (serverless)
**File Storage:** Google Drive (via Workspace domain-wide delegation)

## Architecture

This is a monorepo with 3 frontend apps sharing one serverless backend:

```
/                        → Marketing landing page (prismaconsul.com)
/apex                    → APEX Discovery Form (prismaconsul.com/apex)
/documentacion           → Portal de Documentos (prismaconsul.com/documentacion)
/.netlify/functions/*    → Serverless API backend
```

## Directory Structure

```
├── index.html                  # Landing page
├── aviso-legal.html            # Legal pages
├── cookies.html
├── privacidad.html
├── css/styles.css              # Landing page styles
├── js/main.js                  # Landing page scripts
├── images/                     # All media assets
│   ├── logos/                  # SVG logos, favicon
│   ├── team/                   # Team member photos
│   └── videos/                 # Marketing videos
├── apex/                       # APEX Discovery Form (self-contained SPA)
│   ├── index.html
│   ├── form.js                 # Main form logic (~3500 lines)
│   ├── form.css
│   ├── signal-detector.js
│   └── fonts/                  # Phosphor Icons (local)
├── portal/                     # Portal de Documentos (single-file SPA)
│   └── index.html              # Login + document management panel
├── netlify/
│   └── functions/              # Serverless backend
│       ├── portal-auth.js      # JWT login (bcrypt + Neon DB)
│       ├── portal-upload.js    # Upload files to Google Drive
│       ├── portal-files.js     # List/delete/rename files on Drive
│       ├── research-company.js # Tavily + Groq company research
│       ├── generate-questions.js # Claude API adaptive questions
│       ├── submit-form.js      # Save form submission to Neon DB
│       ├── groq-chat.js        # Groq LLM wrapper
│       ├── groq-whisper.js     # Audio transcription (Whisper)
│       ├── lib/pain-knowledge-base.js # Pain/situation database
│       ├── schema.sql          # PostgreSQL schema reference
│       └── package.json        # Function dependencies
├── netlify.toml                # Build config, redirects, timeouts
├── .env                        # Secrets (NOT committed)
└── .gitignore
```

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (no frameworks)
- **Fonts:** Quicksand (headings) + Source Sans 3 (body) via Google Fonts
- **Icons:** Phosphor Icons (local font files in `apex/fonts/`)
- **Backend:** Netlify Functions (Node.js, esbuild bundler)
- **Database:** Neon PostgreSQL (`apex_submissions`, `portal_users`)
- **Auth:** JWT (jsonwebtoken) + bcryptjs, 24h token expiry
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

Required in `.env` (local) and Netlify dashboard (production):

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
Welcome → Company Input → Research (Tavily+Groq) → Swipe Cards → MaxDiff → Top4 → Phase 1 Questions → Phase 2 Adaptive → Pains → Audio → Contact → Thank You

### Business Type System
- `SITUACIONES_DISTRIBUIDOR` (16 cards, IDs: A-P) for distributors/pharma
- `SITUACIONES_CLINICA` (16 cards, IDs: CA-CP) for clinics
- Type detected from `research-company.js` field `detectado.es_clinica`

### Portal Upload Flow
Drag files → Stage with type classification → Click "Subir" → Upload to Google Drive

### Google Drive Integration
- Service Account with domain-wide delegation impersonates `info@prismaconsul.com`
- Scope: `https://www.googleapis.com/auth/drive`
- Client ID for delegation: `105667745242936760421`

## Database Tables

### `apex_submissions`
Stores APEX form completions with company data, research results, responses, pains, and audio.

### `portal_users`
Portal login users with: `id, email, password_hash, nombre, empresa, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector, created_at, last_login`

## Portal Users

- **Admin:** info@prismaconsul.com (can see all documents - admin dashboard pending)
- **Client:** armc@prismaconsul.com (ARMC Aesthetic Rejuvenation Medical Center)

## Development

```bash
# Start local dev server
npx netlify dev --port 8888

# Access apps locally
http://localhost:8888          # Landing page
http://localhost:8888/apex     # APEX form
http://localhost:8888/documentacion  # Portal
```

## Common Gotchas

- Phosphor Icons need BOTH classes: `ph ph-icon-name`
- `netlify/functions/package.json` deps installed by `@netlify/plugin-functions-install-core`
- Google Drive SA needs domain-wide delegation in Google Admin console
- Spanish characters: use real UTF-8 chars, not `\u00xx` escapes in HTML
- SVG logo (`logo_simbolo_V2.svg`) has large viewBox whitespace — handle sizing in CSS, don't modify the SVG
