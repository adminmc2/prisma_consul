# Plan archivo a archivo de Fase 2

**Fecha:** 2026-04-29
**Versión del repo a la que aplica:** desde commit `d10b4ff` (`v3.3.3`) hacia adelante.
**Cierra el bloque C de Fase 1.** Combina (1) clasificación archivo por archivo y (2) plan secuencial de movimientos físicos, en un único documento auditable.

---

## 1. Propósito

Documentar **qué se mueve, dónde se mueve, en qué orden**, y **qué se queda igual**, para que la ejecución de Fase 2 sea totalmente determinista y auditable. Cada movimiento físico debe poder hacerse sin romper ARMC en ningún momento intermedio.

---

## 2. Estructura objetivo (referencia)

Definida en `MODELO-DOMINIO.md` §5. Resumen:

```
/web/                               ← web pública
/prisma-apex/                       ← sistema interno
   /core/
      /discovery-engine/            ← motor común (era /apex/)
      /modelo-fases/                ← (placeholder)
      /motor-entregables/           ← (placeholder)
      /gestion-archivos/            ← (placeholder)
      /gestion-clientes/            ← (placeholder)
      /registro-rutas/              ← (referencia documental; impl viva en portal/index.html)
   /verticales/
      /clinica-multi/
         /discovery-pack/           ← (placeholder Fase 3)
         /entrevistas/              ← (placeholder Fase 3)
         /entregables/plantillas/   ← (placeholder Fase 3)
         /operacion/                ← (placeholder)
      /clinica-personal/            ← (placeholder Fase 3)
      /distribuidor/                ← (placeholder Fase 3)
   /clientes-publicados/
      /armc/                        ← entregables ARMC servidos al cliente
   /admin/                          ← (placeholder)
/server/                            ← backend Express (sin cambios estructurales)
/shared/                            ← assets comunes (fuentes, CSS común)
/.claude/                           ← (no commiteado, ya en .gitignore)
```

**Lo que NO se construye en Fase 2** (queda como placeholder vacío para Fase 3+):
- contenidos reales de `clinica-personal` y `distribuidor`.
- plantillas por vertical (`entregables/plantillas/`).
- módulos `core/*` distintos de `discovery-engine` y `registro-rutas` (que ya existe inline en `portal/index.html`).

---

## 3. Clasificación archivo por archivo (tabla maestra)

Las 97 entradas del `git ls-files` clasificadas. Categorías:

- **MOVE** = se mueve a la ubicación nueva durante Fase 2.
- **STAY** = se queda en su ubicación actual.
- **EXPORT** = sale del repo hacia `prisma-consulting`.
- **DELETE** = se elimina (no aplicable a ningún archivo en este plan).

### 3.1 Web pública → `/web/`

| Archivo actual | Categoría | Destino |
|---|---|---|
| `index.html` | MOVE | `web/index.html` |
| `aviso-legal.html` | MOVE | `web/aviso-legal.html` |
| `cookies.html` | MOVE | `web/cookies.html` |
| `privacidad.html` | MOVE | `web/privacidad.html` |
| `css/styles.css` | MOVE | `web/css/styles.css` |
| `js/main.js` | MOVE | `web/js/main.js` |
| `images/` (22 archivos: logos, team, videos, hero) | MOVE | `web/images/` |

**Total:** 28 archivos a `/web/`.

### 3.2 Sistema interno → `/prisma-apex/`

#### 3.2.1 Hub SPA y sus assets globales

| Archivo actual | Categoría | Destino |
|---|---|---|
| `portal/index.html` | MOVE | `prisma-apex/index.html` |
| `portal/analisis/GUIA-NUEVAS-SECCIONES.md` | MOVE | `prisma-apex/clientes-publicados/GUIA-NUEVAS-SECCIONES.md` |

#### 3.2.2 Entregables ARMC publicados → `/prisma-apex/clientes-publicados/armc/`

| Archivo actual | Categoría | Destino |
|---|---|---|
| `portal/analisis/armc/index.html` | MOVE | `prisma-apex/clientes-publicados/armc/index.html` |
| `portal/analisis/armc/css/estilos-prisma.css` | MOVE | `prisma-apex/clientes-publicados/armc/css/estilos-prisma.css` |
| `portal/analisis/armc/diagramas/flujo-atención-paciente.html` | MOVE | `prisma-apex/clientes-publicados/armc/diagramas/flujo-atención-paciente.html` |
| `portal/analisis/armc/diagramas/flujo-ceo.html` | MOVE | `prisma-apex/clientes-publicados/armc/diagramas/flujo-ceo.html` |
| `portal/analisis/armc/diagramas/flujo-cirujano.html` | MOVE | idem |
| `portal/analisis/armc/diagramas/flujo-cosmiatra.html` | MOVE | idem |
| `portal/analisis/armc/diagramas/flujo-enfermero.html` | MOVE | idem |
| `portal/analisis/armc/diagramas/flujo-primer-ayudante.html` | MOVE | idem |
| `portal/analisis/armc/diagramas/flujo-tricologia.html` | MOVE | idem |
| `portal/analisis/armc/diagramas/template-diagrama.html` | MOVE | idem |
| `portal/analisis/armc/diagnostico/cadena-causal.html` | MOVE | `prisma-apex/clientes-publicados/armc/diagnostico/cadena-causal.html` |
| `portal/analisis/armc/diagnostico/embudo-operativo.html` | MOVE | idem |
| `portal/analisis/armc/diagnostico/mapa-fricciones.html` | MOVE | idem |
| `portal/analisis/armc/diagnostico/matriz-dolor-proceso.html` | MOVE | idem |
| `portal/analisis/armc/diagnostico/resumen-ejecutivo.html` | MOVE | idem |
| `portal/analisis/armc/blueprint/automatizaciones.html` | MOVE | `prisma-apex/clientes-publicados/armc/blueprint/automatizaciones.html` |
| `portal/analisis/armc/blueprint/fases-implementacion.html` | MOVE | idem |
| `portal/analisis/armc/blueprint/flujos-to-be.html` | MOVE | idem |
| `portal/analisis/armc/blueprint/kpis-objetivo.html` | MOVE | idem |
| `portal/analisis/armc/blueprint/modelo-datos.html` | MOVE | idem |

**Total ARMC:** 20 archivos.

#### 3.2.3 Discovery (motor APEX) → `/prisma-apex/core/discovery-engine/`

| Archivo actual | Categoría | Destino |
|---|---|---|
| `apex/index.html` | MOVE | `prisma-apex/core/discovery-engine/index.html` |
| `apex/form.css` | MOVE | `prisma-apex/core/discovery-engine/form.css` |
| `apex/form.js` | MOVE | `prisma-apex/core/discovery-engine/form.js` |
| `apex/signal-detector.js` | MOVE | `prisma-apex/core/discovery-engine/signal-detector.js` |
| `apex/fonts/Phosphor.ttf` | MOVE | `shared/fonts/phosphor/Phosphor.ttf` (compartido con Hub si aplica) |
| `apex/fonts/Phosphor.woff` | MOVE | `shared/fonts/phosphor/Phosphor.woff` |
| `apex/fonts/Phosphor.woff2` | MOVE | `shared/fonts/phosphor/Phosphor.woff2` |
| `apex/fonts/phosphor.css` | MOVE | `shared/fonts/phosphor/phosphor.css` |

**Decisión sobre fuentes Phosphor:** se centralizan en `/shared/fonts/phosphor/`. Hoy solo las usa `/apex/`, pero `portal/index.html` también referencia íconos Phosphor (vía clases `ph ph-*`). Centralizar evita duplicación cuando el Hub se reorganice y permite reutilización futura por verticales nuevas. Las referencias `<link rel="stylesheet" href="fonts/phosphor.css">` en `apex/index.html` se actualizarán a la nueva ruta dentro del subpaso correspondiente.

### 3.3 Backend Express → `/server/` (sin cambios estructurales)

| Archivo actual | Categoría | Destino |
|---|---|---|
| `server/server.js` | STAY (con modificaciones en código — sección 5) | `server/server.js` |
| `server/package.json` | STAY | sin cambios |
| `server/package-lock.json` | STAY | sin cambios |
| `server/schema.sql` | STAY | sin cambios estructurales |
| `server/middleware/cors.js` | STAY | idem |
| `server/middleware/auth.js` | STAY | idem |
| `server/routes/portal.js` | STAY | idem (cambios funcionales en sprints posteriores) |
| `server/routes/apex.js` | STAY | idem |
| `server/routes/ai.js` | STAY | idem |
| `server/lib/fetch-timeout.js` | STAY | idem |
| `server/lib/google-drive.js` | STAY | idem |
| `server/lib/pain-knowledge-base.js` | STAY | sin cambios en Fase 2; re-evaluar mover a `prisma-consulting` en sprint posterior |
| `server/scripts/migrate-roles.js` | STAY | utilidad operativa del backend, no del cliente |
| `server/scripts/upload-interviews.js` | STAY | idem |

**Total:** 14 archivos backend, todos STAY.

### 3.4 Scripts cliente-específicos → exportar a `prisma-consulting`

| Archivo actual | Categoría | Destino |
|---|---|---|
| `scripts/delete-armc-duplicates.js` | EXPORT | `prisma-consulting/scripts/clientes/armc/delete-duplicates.js` |
| `scripts/list-armc-files.js` | EXPORT | `prisma-consulting/scripts/clientes/armc/list-files.js` |
| `scripts/move-armc-patient-data.js` | EXPORT | `prisma-consulting/scripts/clientes/armc/move-patient-data.js` |
| `scripts/rename-armc-files.js` | EXPORT | `prisma-consulting/scripts/clientes/armc/rename-files.js` |
| `scripts/revert-armc-patient-data.js` | EXPORT | `prisma-consulting/scripts/clientes/armc/revert-patient-data.js` |
| `scripts/update-armc-doctypes.js` | EXPORT | `prisma-consulting/scripts/clientes/armc/update-doctypes.js` |

**Justificación:** son scripts one-off de **gestión de archivos del cliente ARMC** (deduplicación, renombrado, organización de datos personales en Drive). No son código del producto Prisma APEX; son **operaciones de consultoría** sobre los datos de un cliente concreto. Pertenecen a `prisma-consulting/scripts/clientes/[cliente]/`.

**Total exportado:** 6 archivos.

### 3.5 Documentación de cliente → exportar a `prisma-consulting`

| Archivo actual | Categoría | Destino |
|---|---|---|
| `docs/VALIDACION-CATALOGO-ARMC.md` | EXPORT | `prisma-consulting/clientes/armc/VALIDACION-CATALOGO.md` |

**Justificación:** documento de validación del catálogo de servicios de ARMC, fruto de la entrevista CEO 2026-04-15. Es **trabajo de consultoría sobre un cliente concreto**, no documentación del producto. Pertenece al repo de metodología y trabajo por cliente.

**Total exportado:** 1 archivo.

### 3.6 Documentación canónica del repo → STAY (raíz)

| Archivo actual | Categoría | Notas |
|---|---|---|
| `README.md` | STAY | actualizar texto en Fase 2 para reflejar nueva estructura |
| `CLAUDE.md` | STAY | sección "Directory Structure" actualizada en Fase 2 |
| `CHANGELOG.md` | STAY | inmutable hacia atrás; entradas nuevas reflejan los movimientos |
| `MODELO-DOMINIO.md` | STAY | canónico |
| `CONTRATOS.md` | STAY | canónico |
| `GLOSARIO.md` | STAY | canónico |
| `ECOSISTEMA.md` | STAY | canónico |
| `REGISTRO-RUTAS.md` | STAY | canónico de la capa de registro |
| `REVIEW-PRISMA-APEX.md` | STAY (temporal) | se elimina al cierre del Sprint A según su propia sección 13 |
| `.gitignore` | STAY | |
| `.env.example` | STAY | |
| `package.json` (raíz) | STAY | |
| `package-lock.json` (raíz) | STAY | |
| `.github/dependabot.yml` | STAY | |

**Total raíz:** 14 archivos.

### 3.7 Documentación operativa → STAY (`/docs/`)

| Archivo actual | Categoría | Notas |
|---|---|---|
| `docs/NOMENCLATURA.md` | STAY | taxonomía de nombres de documentos del Hub, transversal al producto |
| `docs/VALIDACION-BLOQUE-B-REGISTRO-RUTAS.md` | STAY | checklist operativo del bloque B |
| `docs/REPORTE-BLOQUE-B-REGISTRO-RUTAS.md` | STAY | reporte de ejecución |
| `docs/PLAN-FASE2.md` | STAY (este documento) | |

**Total docs/:** 4 archivos (sin contar el `VALIDACION-CATALOGO-ARMC.md` ya marcado EXPORT).

### 3.8 Resumen de la clasificación

| Categoría | Archivos | Destino |
|---|---|---|
| MOVE → `web/` | 28 | web pública |
| MOVE → `prisma-apex/clientes-publicados/armc/` | 20 | entregables ARMC |
| MOVE → `prisma-apex/index.html` | 1 | Hub SPA |
| MOVE → `prisma-apex/clientes-publicados/GUIA-NUEVAS-SECCIONES.md` | 1 | guía operativa |
| MOVE → `prisma-apex/core/discovery-engine/` | 4 | motor APEX |
| MOVE → `shared/fonts/phosphor/` | 4 | fuentes compartidas |
| STAY | 32 | backend, docs canónicos, configs |
| EXPORT → `prisma-consulting` | 7 | scripts ARMC + validación catálogo |
| **TOTAL** | **97** | |

---

## 4. Plan secuencial de movimientos físicos

**Principio rector:** ARMC no se rompe en ningún momento intermedio. Después de cada subpaso, los smoke tests del bloque B (sección 5 del checklist) deben seguir pasando.

**Rama de trabajo:** `dev`. Cada subpaso es un commit propio. Despliegue a `dev.prismaconsul.com` tras cada subpaso para validación runtime humana.

### Subpaso 2.1 — Crear `/web/` y mover landing + legales

**Movimientos:**
- `index.html` → `web/index.html`
- `aviso-legal.html` → `web/aviso-legal.html`
- `cookies.html` → `web/cookies.html`
- `privacidad.html` → `web/privacidad.html`
- `css/` → `web/css/`
- `js/` → `web/js/`
- `images/` → `web/images/`

**Cambio de servidor (`server.js`):**
- `app.use(express.static(projectRoot, ...))` → `app.use(express.static(path.join(projectRoot, 'web'), ...))`.
- Mantener handler `/hub` apuntando a `portal/index.html` (todavía no movido).
- Mantener handler `/apex` apuntando a `apex/index.html` (todavía no movido).

**Validación runtime (smoke tests obligatorios):**
- `prismaconsul.com/` carga la landing.
- `prismaconsul.com/aviso-legal`, `/cookies`, `/privacidad` cargan.
- Assets de la landing (`/css/styles.css?v=147`, `/js/main.js`, `/images/...`) responden 200.
- `/hub` y `/apex` siguen funcionando (todavía no se han movido).

**Riesgo:** alto. Cualquier path relativo en HTML que no use rutas absolutas se rompe. Mitigación: revisar que `web/index.html` use rutas absolutas (`/css/`, `/js/`, `/images/`) — el servidor reapuntado las resuelve correctamente.

**Despliegue obligatorio en dev** + sesión humana mínima en `dev.prismaconsul.com/` antes de seguir.

### Subpaso 2.2 — Mover entregables ARMC bajo `/prisma-apex/clientes-publicados/`

**Movimientos:**
- `portal/analisis/armc/` → `prisma-apex/clientes-publicados/armc/` (20 archivos).
- `portal/analisis/GUIA-NUEVAS-SECCIONES.md` → `prisma-apex/clientes-publicados/GUIA-NUEVAS-SECCIONES.md`.

**Cambio de servidor (`server.js`):**
- Añadir nuevo `express.static` montado en `/publicados`:
  ```javascript
  app.use('/publicados', express.static(path.join(projectRoot, 'prisma-apex', 'clientes-publicados')));
  ```
- Añadir redirect 301 desde URL legacy:
  ```javascript
  app.get('/portal/analisis/:cliente/*', (req, res) => {
    res.redirect(301, req.path.replace('/portal/analisis/', '/publicados/'));
  });
  ```

**Cambio en frontend (`portal/index.html`):**
- Actualizar `ANALISIS_REGISTRY` a la nueva URL canónica:
  ```javascript
  const ANALISIS_REGISTRY = {
    armc: {
      diagramas:   '/publicados/armc/diagramas/',
      diagnostico: '/publicados/armc/diagnostico/',
      blueprint:   '/publicados/armc/blueprint/'
    }
  };
  ```

**Validación runtime obligatoria:**
- URL nueva responde: `/publicados/armc/diagramas/flujo-cirujano.html` → 200.
- URL legacy redirige: `/portal/analisis/armc/diagramas/flujo-cirujano.html` → 301 → 200.
- SPA Hub abre los iframes con la nueva URL canónica.
- Smoke tests del bloque B (cliente + admin × 3 items) PASS en local y en dev.

**Riesgo:** medio-alto. La SPA debe consultar el registry actualizado. Como ya está implementado el registry (bloque A), el cambio es solo de valores en `ANALISIS_REGISTRY`. Mitigación: redirect 301 cubre cualquier consumidor externo (correos, marcadores).

### Subpaso 2.3 — Mover `portal/index.html` → `prisma-apex/index.html`

**Movimientos:**
- `portal/index.html` → `prisma-apex/index.html`.

**Cambio de servidor:**
- Handler `/hub` reapunta:
  ```javascript
  app.get('/hub', (req, res) => {
    res.sendFile(path.join(projectRoot, 'prisma-apex', 'index.html'));
  });
  ```

**Validación runtime obligatoria:**
- `/hub` sigue cargando la SPA del Hub idéntica.
- Smoke tests del bloque B PASS.
- Login de cliente y admin funcionan.

**Riesgo:** bajo. Solo cambia el `sendFile` del handler.

### Subpaso 2.4 — Mover `apex/` → `prisma-apex/core/discovery-engine/`

**Movimientos:**
- `apex/index.html` → `prisma-apex/core/discovery-engine/index.html`.
- `apex/form.css` → idem.
- `apex/form.js` → idem.
- `apex/signal-detector.js` → idem.

**Cambio de servidor:**
- Añadir handler explícito `/apex`:
  ```javascript
  app.get('/apex', (req, res) => {
    res.sendFile(path.join(projectRoot, 'prisma-apex', 'core', 'discovery-engine', 'index.html'));
  });
  ```
- (El antiguo serving por `extensions: ['html']` ya no aplica porque `web/` no contiene `apex.html`.)

**Validación runtime obligatoria:**
- `prismaconsul.com/apex` carga el formulario discovery.
- El formulario completa el flujo (research-company, generate-questions, submit-form) idéntico.
- Endpoints API responden con shapes intactas (`/api/research-company`, `/api/generate-questions`, `/api/submit-form`, `/api/groq-chat`, `/api/groq-whisper`).

**Riesgo:** medio. El formulario APEX usa muchas referencias internas. Mitigación: mantener todos los archivos juntos en la carpeta nueva — no romper rutas relativas internas.

### Subpaso 2.5 — Centralizar fuentes Phosphor en `/shared/`

**Movimientos:**
- `apex/fonts/` → `shared/fonts/phosphor/` (4 archivos).

**Cambios en frontend:**
- `prisma-apex/core/discovery-engine/index.html`: actualizar `<link>` a `/shared/fonts/phosphor/phosphor.css`.
- `prisma-apex/index.html` (Hub): si referenciaba `apex/fonts/...`, actualizar.

**Cambio de servidor:**
- Añadir static para `/shared`:
  ```javascript
  app.use('/shared', express.static(path.join(projectRoot, 'shared')));
  ```

**Validación runtime obligatoria:**
- Iconos Phosphor (clases `ph ph-*`) renderizan en el Hub y en el formulario discovery.

**Riesgo:** bajo. Si los iconos no aparecen, retroceder hasta encontrar la referencia rota.

### Subpaso 2.6 — Migración aditiva de BD

**Migraciones SQL** (sin destruir nada):

```sql
-- Cliente
CREATE TABLE clientes (...)              -- según MODELO-DOMINIO.md §5.2
INSERT INTO clientes (nombre, ...)
SELECT DISTINCT empresa FROM portal_users WHERE empresa IS NOT NULL AND empresa != '';

-- ClientMembership
CREATE TABLE client_memberships (...)
-- Sincronización inicial desde role legacy

-- Engagements
CREATE TABLE engagements (...)
-- Migración en dos pasos según MODELO-DOMINIO.md §11.2

-- Entrevistas, Entregables (placeholders, sin datos iniciales)
CREATE TABLE entrevistas (...)
CREATE TABLE entregables (...)

-- Columnas transitorias en portal_users
ALTER TABLE portal_users ADD COLUMN cliente_id INT REFERENCES clientes(id);
ALTER TABLE portal_users ADD COLUMN active_engagement_id INT REFERENCES engagements(id);

-- Columna canónica en portal_files
ALTER TABLE portal_files ADD COLUMN engagement_id INT REFERENCES engagements(id);
```

**Validación runtime obligatoria:**
- Tablas legacy (`portal_users`, `portal_files`, `portal_activity_log`, `apex_submissions`) siguen funcionando idéntico.
- Login, upload de archivos, listado, actualización, panel de actividad — todos PASS.
- Tablas nuevas accesibles vía consulta SQL pero **no** consumidas por código de Sprint A.

**Riesgo:** alto si la migración rompe consultas existentes. Mitigación: estrictamente aditiva. Hacer `pg_dump` antes en Neon.

### Subpaso 2.7 — Actualizar `domain-sync.js` (skeleton)

**Crear** `server/lib/domain-sync.js` con las funciones definidas en `MODELO-DOMINIO.md` §6.6:

```javascript
function getClienteFromUser(userId) { ... }
function getActiveEngagement(userId) { ... }
function syncLegacyUserUpdate(userId, fields) { ... }
function syncEngagementUpdate(engagementId, fields) { ... }
function syncClienteUpdate(clienteId, fields) { ... }
```

**Estado en Fase 2:** funciones existen pero **no son llamadas** por el código todavía. Los endpoints siguen escribiendo solo a tablas legacy. La integración progresiva es trabajo de sprints posteriores.

**Validación runtime:** ninguna pertenece a este subpaso (no se cambia comportamiento).

**Riesgo:** ninguno (código nuevo no invocado).

### Subpaso 2.8 — Actualizar `CLAUDE.md` "Directory Structure"

**Cambio documental:** la sección "Directory Structure" del `CLAUDE.md` raíz refleja la estructura post-Fase 2 real.

**Riesgo:** ninguno.

### Subpaso 2.9 — Exportar archivos a `prisma-consulting`

**Movimientos físicos** (de este repo a `prisma-consulting`):
- `scripts/delete-armc-duplicates.js` → `prisma-consulting/scripts/clientes/armc/delete-duplicates.js`
- `scripts/list-armc-files.js` → `prisma-consulting/scripts/clientes/armc/list-files.js`
- `scripts/move-armc-patient-data.js` → `prisma-consulting/scripts/clientes/armc/move-patient-data.js`
- `scripts/rename-armc-files.js` → `prisma-consulting/scripts/clientes/armc/rename-files.js`
- `scripts/revert-armc-patient-data.js` → `prisma-consulting/scripts/clientes/armc/revert-patient-data.js`
- `scripts/update-armc-doctypes.js` → `prisma-consulting/scripts/clientes/armc/update-doctypes.js`
- `docs/VALIDACION-CATALOGO-ARMC.md` → `prisma-consulting/clientes/armc/VALIDACION-CATALOGO.md`

**Implementación:**
1. Copiar los 7 archivos a `prisma-consulting` (en su rama `dev` correspondiente).
2. Hacer commit en `prisma-consulting` que registre la incorporación.
3. Borrar los 7 archivos de `web-de-prisma`.
4. Hacer commit en `web-de-prisma` que registre la salida.
5. Ambos commits referencian al otro por hash.

**Validación:** los scripts ARMC se ejecutan correctamente desde `prisma-consulting` (probar al menos `list-files.js`).

**Riesgo:** los scripts dependen de `.env` con `GOOGLE_SERVICE_ACCOUNT_KEY` y `GOOGLE_DRIVE_FOLDER_ID`. Decisión: esas credenciales se replican en `prisma-consulting/.env` (no commiteado).

---

## 5. Cambios al `server.js` (resumen consolidado)

Todos los cambios al `server/server.js` durante Fase 2 quedan capturados en un solo archivo. Son acumulativos a lo largo de los subpasos:

```javascript
// Estado final esperado tras todos los subpasos:

const projectRoot = path.join(__dirname, '..');

// Static de la web pública
app.use(express.static(path.join(projectRoot, 'web'), {
  index: 'index.html',
  extensions: ['html']
}));

// Static de los entregables publicados al cliente
app.use('/publicados', express.static(
  path.join(projectRoot, 'prisma-apex', 'clientes-publicados'),
  { extensions: ['html'] }
));

// Static de assets compartidos (fuentes, etc.)
app.use('/shared', express.static(path.join(projectRoot, 'shared')));

// Redirect 301 desde URL legacy de entregables
app.get('/portal/analisis/:cliente/*', (req, res) => {
  res.redirect(301, req.path.replace('/portal/analisis/', '/publicados/'));
});

// SPA del Hub
app.get('/hub', (req, res) => {
  res.sendFile(path.join(projectRoot, 'prisma-apex', 'index.html'));
});

// SPA del discovery
app.get('/apex', (req, res) => {
  res.sendFile(path.join(projectRoot, 'prisma-apex', 'core', 'discovery-engine', 'index.html'));
});

// API routes (sin cambios)
app.use('/api', portalRoutes);
app.use('/api', apexRoutes);
app.use('/api', aiRoutes);

// Fallback
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(projectRoot, 'web', 'index.html'));
});
```

---

## 6. Tests de regresión por subpaso

Cada subpaso debe terminar con esta verificación mínima antes de pasar al siguiente:

| Verificación | Subpasos donde aplica |
|---|---|
| Landing carga (`/`) | 2.1, 2.5, 2.8 |
| Legales cargan (`/aviso-legal*`, etc.) | 2.1 |
| `/hub` carga la SPA del Hub | todos |
| `/apex` carga la SPA del discovery | 2.4, 2.5 |
| Login cliente funciona | 2.3, 2.6, 2.7 |
| Login admin funciona | 2.3, 2.6, 2.7 |
| Smoke tests del bloque B (6 verificaciones) | 2.2, 2.3, 2.6 |
| Endpoints API responden con shapes intactas (17 endpoints) | 2.6, 2.7 |
| Iconos Phosphor renderizan | 2.5 |
| Redirects 301 desde URL legacy de entregables | 2.2 |

---

## 7. Decisiones cerradas

| # | Decisión |
|---|---|
| PF2-1 | Web pública pasa a `web/`; servida por `express.static('web')` |
| PF2-2 | Hub SPA pasa a `prisma-apex/index.html`; servida por handler `/hub` explícito |
| PF2-3 | Discovery pasa a `prisma-apex/core/discovery-engine/`; servida por handler `/apex` explícito |
| PF2-4 | Entregables ARMC pasan a `prisma-apex/clientes-publicados/armc/`; servidos por `express.static('/publicados')` |
| PF2-5 | URL canónica de entregables es `/publicados/[cliente]/...`; URL legacy `/portal/analisis/[cliente]/...` redirige 301 indefinido |
| PF2-6 | Fuentes Phosphor centralizadas en `shared/fonts/phosphor/`; servidas por `/shared` |
| PF2-7 | Backend (`server/`) queda STAY con cambios en `server.js` consolidados en sección 5 |
| PF2-8 | Migración BD estrictamente aditiva (sección 4 subpaso 2.6) |
| PF2-9 | `domain-sync.js` se crea en Fase 2 pero sin invocar (skeleton); integración progresiva en sprints posteriores |
| PF2-10 | 6 scripts ARMC y `VALIDACION-CATALOGO-ARMC.md` se exportan a `prisma-consulting` |
| PF2-11 | `pain-knowledge-base.js` se queda en Fase 2; se reevalúa moverlo a `prisma-consulting` en sprint posterior |
| PF2-12 | Cada subpaso termina con despliegue a `dev.prismaconsul.com` y validación runtime humana |

---

## 8. Lo que NO está en este plan (pendiente de sprints posteriores)

- **Plantillas por vertical** (clinica-multi, clinica-personal, distribuidor) — Fase 3 de Sprint A.
- **Migración de uploads de cliente** Drive → IONOS — **Sprint B** (post-Sprint A).
- **Centralización de la lógica de autorización** — sprint posterior.
- **EngagementAccess** (rol por engagement) — depende de la centralización.
- **Cierre de campos legacy** en `portal_users` — sprint posterior.
- **Migración de `pain-knowledge-base.js`** a `prisma-consulting` — sprint posterior.
- **Operación continua** (fase 5 APEX) — sprint posterior.

---

## 9. Pendientes antes de ejecutar Fase 2

- Aprobación del revisor sobre este plan.
- Confirmación del usuario.
- Backup de Neon (`pg_dump`) antes de subpaso 2.6.
- Confirmación del acceso al repo `prisma-consulting` para subpaso 2.9.

---

**Fin del plan.**
