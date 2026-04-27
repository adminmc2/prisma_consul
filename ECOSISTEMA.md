# Ecosistema de repositorios de PRISMA

Documento canónico que describe los repositorios que conforman el sistema PRISMA, qué hace cada uno, cuándo abrirlos y cómo se relacionan entre sí.

> Este documento se mantiene en `web-de-prisma/ECOSISTEMA.md` como fuente única. Cada repo del ecosistema referencia este archivo desde su `CLAUDE.md` mediante una sección breve "Ecosistema de repositorios".

---

## Mapa visual

```
                       PRISMA — ecosistema de repos
                       ────────────────────────────

  ┌──────────────────────────────────────────────────────────────┐
  │  web-de-prisma                                               │
  │  Web pública + Prisma APEX (sistema interno / Hub)           │
  │  · prismaconsul.com  · prismaconsul.com/hub  · /apex         │
  │  Contiene: código + entregables publicados versionados       │
  │  (prisma-apex/clientes-publicados/[cliente]/)                │
  └──────────────────────────────────────────────────────────────┘
                        │
                        │ desplegado en
                        ▼
  ┌──────────────────────────────────────────────────────────────┐
  │  Servidor Linux IONOS (producción y dev)                     │
  │  Runtime de Prisma APEX. Sirve la web y la API.              │
  │  Storage de uploads del cliente: NO aquí (ver Drive)         │
  └──────────────────────────────────────────────────────────────┘
                        ▲
                        │ operado y mantenido por
                        │
  ┌──────────────────────────────────────────────────────────────┐
  │  prisma-server-ops                                           │
  │  Gestión del VPS: seguridad, mantenimiento, runbooks         │
  └──────────────────────────────────────────────────────────────┘


  ┌──────────────────────────────────────────────────────────────┐
  │  prisma-trabajo-clientes  (privado, NUEVO en fase 1)         │
  │  Trabajo interno PRISMA por cliente: contratos, notas,       │
  │  transcripciones, drafts de entregables                      │
  └──────────────────────────────────────────────────────────────┘
                        │
                        │ cuando un trabajo está terminado
                        │ se publica al Hub (web-de-prisma)
                        ▼

  ┌──────────────────────────────────────────────────────────────┐
  │  prisma-consulting                                           │
  │  Metodología APEX: frameworks, plantillas abstractas, guías  │
  └──────────────────────────────────────────────────────────────┘


  ┌──────────────────────────────────────────────────────────────┐
  │  apex-agents                                                 │
  │  Plataforma de agentes IA (CrewAI, evaluación)               │
  └──────────────────────────────────────────────────────────────┘


  ┌──────────────────────────────────────────────────────────────┐
  │  above-pharma (ABBE)                                         │
  │  Asistente de ventas para Above Pharma (HF Spaces)           │
  └──────────────────────────────────────────────────────────────┘


  ┌──────────────────────────────────────────────────────────────┐
  │  Google Workspace Drive                                      │
  │  Audios y vídeos de entrevistas, grabaciones de Meet         │
  │  (no es un repo, pero forma parte del ecosistema operativo)  │
  └──────────────────────────────────────────────────────────────┘
```

---

## Repos uno por uno

### 1. `web-de-prisma`

**Propósito.** Web pública de PRISMA + Prisma APEX (sistema interno donde PRISMA gestiona a sus clientes y entrega APEX a cada uno).

**Cuándo abrirlo.**
- Trabajar en la web pública (landing, legales, marketing).
- Trabajar en el sistema Prisma APEX (login, gestión de archivos, plantillas, entregables).
- Trabajar en APEX-discovery (formulario de discovery).
- Editar plantillas de entregables por vertical (clínica multi, clínica personal, distribuidor).
- Desplegar cambios al VPS (rama `main` para producción, rama `dev` para `dev.prismaconsul.com`).

**Qué contiene.**
- Web pública (`/web/` tras reorganización).
- Prisma APEX (`/prisma-apex/` tras reorganización): núcleo común + verticales.
- Backend Express (`/server/`).
- Configuración Claude Code (`.claude/`).
- Documentación operativa: `CLAUDE.md`, `CHANGELOG.md`, `MODELO-DOMINIO.md`, `CONTRATOS.md`, `GLOSARIO.md`, `ECOSISTEMA.md` (este archivo).

**Conexiones con otros repos.**
- Recibe **publicaciones** de `prisma-trabajo-clientes` cuando un entregable termina.
- Lee plantillas abstractas de `prisma-consulting` (referencia conceptual; no dependencia de código directa hoy).
- Es **operado por** `prisma-server-ops` a nivel de infraestructura.
- Sirve los **agentes IA** desplegados en `apex-agents` cuando se integren en Prisma APEX.

---

### 2. `prisma-trabajo-clientes` (privado, NUEVO — se crea en fase 1)

**Propósito.** Material de trabajo PRISMA por cliente (texto colaborativo). No es producto entregado, es **trabajo en construcción**.

**Cuándo abrirlo.**
- Redactar o editar un contrato con un cliente.
- Tomar notas internas sobre el trabajo con un cliente.
- Guardar transcripciones de entrevistas (los audios viven en Drive).
- Trabajar drafts de entregables antes de publicarlos al Hub.
- Revisar el estado actual de un cliente (cada cliente tiene un `README.md`).

**Qué contiene.**
```
clientes/
├── armc/
│   ├── contrato/
│   ├── entrevistas/                  ← transcripciones .md (audios en Drive)
│   ├── borradores-entregables/
│   ├── notas-internas/
│   └── README.md
└── [otro-cliente]/
    └── ...
CONVENCIONES.md
README.md
```

**Conexiones con otros repos.**
- Cuando un draft termina → se **publica** como entregable a `web-de-prisma` (área de publicados del Hub en el servidor).
- Las transcripciones se generan a partir de audios que viven en Drive.
- Las plantillas abstractas que se rellenan en los drafts vienen conceptualmente de `prisma-consulting`.

**Notas.**
- Acceso: equipo PRISMA. Inicialmente 1 colaborador, todos a todo. Granularidad por cliente solo si crece el equipo.
- **No** se guardan binarios pesados (audios, vídeos): esos viven en Drive.

---

### 3. `prisma-consulting`

**Propósito.** Metodología APEX: frameworks reutilizables, catálogos de servicios, dolores tipificados, guías de entrevista, especificaciones de productos en estudio (NOVIA, Omia).

**Cuándo abrirlo.**
- Evolucionar la metodología APEX (cambiar la lista de dolores, refinar el catálogo).
- Preparar guías de entrevista para una vertical o subtipo nuevo.
- Trabajar specs de productos futuros (NOVIA, Omia).
- Consultar el catálogo de servicios APEX abstracto.

**Qué contiene.** (a verificar exhaustivamente en fase 1)
- Catálogo APEX y dolores.
- Guías de entrevista originales.
- Specs de productos en exploración.
- Guía de diseño visual de PRISMA.

**Conexiones con otros repos.**
- `web-de-prisma` consume conceptualmente las plantillas y dolores de aquí cuando se generan entregables.
- Algunos archivos que hoy viven en `web-de-prisma` (scripts one-off, validaciones de cliente) se moverán aquí en fase 2.

---

### 4. `apex-agents`

**Propósito.** Plataforma de agentes IA basada en CrewAI con dashboards y evaluación (DeepEval / promptfoo).

**Cuándo abrirlo.**
- Crear o modificar pipelines de agentes CrewAI.
- Trabajar en el dashboard de agentes.
- Configurar evaluaciones de calidad de los agentes.

**Conexiones con otros repos.**
- Cuando un agente se integra en Prisma APEX, se consume desde `web-de-prisma` (vía API).
- Independiente operativamente: tiene su propio despliegue.

---

### 5. `above-pharma` (ABBE)

**Propósito.** Asistente de ventas para Above Pharma. Chatbot desplegado en HF Spaces.

**Cuándo abrirlo.**
- Trabajar en el chatbot ABBE.
- Añadir productos a su knowledge base.
- Desplegar nueva versión a HF Spaces.

**Conexiones con otros repos.**
- Subdominio servido vía CNAME desde Cloudflare: `abbe.prismaconsul.com → mandocc2-abbe.hf.space`.
- Independiente del resto del ecosistema. Es producto autónomo.

---

### 6. `prisma-server-ops`

**Propósito.** Operación del VPS IONOS donde corre `web-de-prisma`. **No** contiene código de producto.

**Cuándo abrirlo.**
- Auditoría de seguridad o mantenimiento del servidor.
- Verificar backups (recordar: hay servidor IONOS dedicado a backups).
- Aplicar runbooks de incidente.
- Cambios en configuración de nginx, PM2, firewall, certbot, etc.

**Conexiones con otros repos.**
- Mantiene la infraestructura donde corre `web-de-prisma` (producción y dev).
- El backup periódico cubre datos del Hub.

---

## Servicios externos al ecosistema git

### Google Workspace Drive
- **Backend de almacenamiento de uploads del cliente** durante Sprint A (vía service account con domain-wide delegation; cada cliente tiene su subcarpeta `user_{id}/`).
- Audios y vídeos de entrevistas (Meet recordings nativos).
- Claude Code los lee vía MCP de Drive.
- No se duplican en git.
- En Sprint B (post-reorganización) los uploads del cliente migrarán a IONOS con espejo a Drive para acceso del cliente.

### Servidor IONOS de backup
- Backup periódico del VPS de producción.
- Configurado y mantenido aparte. Fuera del alcance de los repos git.

### Cloudflare
- DNS y proxy del dominio `prismaconsul.com`.
- Subdominios: `dev.prismaconsul.com`, `abbe.prismaconsul.com`.

### Neon PostgreSQL
- Base de datos serverless usada por `web-de-prisma`.
- Tablas: `apex_submissions`, `portal_users`, `portal_files`, `portal_activity_log` (más las que se añadan al introducir entidades `engagement`, `client_membership`, etc.).

---

## Flujos cruzados típicos

### Flujo A — Cliente nuevo entra al sistema

1. Cliente contacta a través de la web pública (`web-de-prisma`).
2. Se crea su ficha en Prisma APEX (`web-de-prisma`).
3. Cliente rellena formulario de discovery (`web-de-prisma`, motor común con discovery-pack según vertical).
4. PRISMA crea su carpeta en `prisma-trabajo-clientes` con la estructura estándar (`clientes/[nombre]/`).
5. PRISMA agenda entrevistas → grabaciones a Drive automáticamente vía Meet.

**Repos tocados:** `web-de-prisma`, `prisma-trabajo-clientes`. **Servicios:** Workspace.

### Flujo B — Procesar una entrevista

1. Audio en Drive (Meet o subido manualmente).
2. Claude (vía skill `/procesar-entrevista`) lee el audio del Drive (MCP).
3. Whisper transcribe → transcripción `.md` se guarda en `prisma-trabajo-clientes/clientes/[cliente]/entrevistas/`.
4. PRISMA anota y comenta el draft de la transcripción en GitHub.

**Repos tocados:** `prisma-trabajo-clientes`. **Servicios:** Drive, Whisper.

### Flujo C — Generar un entregable

1. PRISMA trabaja el draft del entregable en `prisma-trabajo-clientes/clientes/[cliente]/borradores-entregables/`.
2. Plantilla base viene de la vertical correspondiente en `web-de-prisma/prisma-apex/verticales/[vertical]/entregables/plantillas/`.
3. Cuando el entregable está terminado y revisado → el HTML renderizado se commitea en `web-de-prisma/prisma-apex/clientes-publicados/[cliente]/`.
4. Express lo sirve bajo `/publicados/[cliente]/...` (contrato canónico — ver `MODELO-DOMINIO.md` sección 9).
5. Cliente lo ve en su sesión del Hub.

**Repos tocados:** `prisma-trabajo-clientes`, `web-de-prisma`.

### Flujo D — Evolucionar la metodología

1. Aprendizajes de un engagement → se sintetizan como mejora de plantilla o catálogo.
2. La mejora abstracta y reutilizable va a `prisma-consulting`.
3. El reflejo en plantillas concretas usadas por el Hub va a `web-de-prisma/prisma-apex/verticales/[vertical]/entregables/plantillas/`.

**Repos tocados:** `prisma-consulting`, `web-de-prisma`.

### Flujo E — Mantenimiento de servidor

1. Auditoría programada o incidente.
2. Runbook en `prisma-server-ops`.
3. Aplicar al VPS de producción / dev.
4. Validar que `web-de-prisma` sigue operativo.

**Repos tocados:** `prisma-server-ops`. **Validación:** `web-de-prisma`.

---

## Lo que los repos NO comparten

- **No comparten código** directamente. Cada repo es autónomo.
- **No comparten dependencias npm** ni motor de build común. No hay monorepo workspace.
- **No comparten despliegue.** Cada repo se despliega independientemente.
- **Identidad visual común** (colores, fuentes, logos): hoy duplicada en cada repo donde aplica. Centralización pendiente como mejora futura, fuera del alcance.

---

## Convenciones comunes

- **Naming.** Producto = "APEX". Sistema interno de PRISMA = "Prisma APEX". Verticales = `clinica-multi`, `clinica-personal`, `distribuidor`.
- **Versionado semántico.** Todos los repos siguen `MAJOR.MINOR.PATCH`. Cada repo tiene su propia cadencia.
- **CHANGELOG.md.** Obligatorio en cada repo, actualizado con cada cambio relevante.
- **CLAUDE.md.** Cada repo tiene el suyo con instrucciones específicas y enlace a este `ECOSISTEMA.md`.

---

## Mantenimiento de este documento

- Fuente única: `web-de-prisma/ECOSISTEMA.md`.
- Cuando se añade o se retira un repo del ecosistema, se actualiza este archivo y se ajustan las referencias breves en los `CLAUDE.md` de los demás repos.
- Cuando un flujo cruzado cambia, se documenta aquí.
- No duplicar contenido. Si un repo necesita detalle propio, va en su `CLAUDE.md`, no aquí.
