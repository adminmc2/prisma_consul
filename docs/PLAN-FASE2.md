# Plan archivo a archivo de Fase 2

**Fecha:** 2026-04-29
**Versión del repo a la que aplica:** desde commit `d10b4ff` (`v3.3.3`) hacia adelante.
**Cierra el bloque C de Fase 1.** Combina (1) clasificación archivo por archivo y (2) plan secuencial de movimientos físicos, en un único documento auditable.

---

> **Nota baseline (actualizada 2026-05-02, HEAD operativo `v3.3.24`).** Fase 2 **sigue sin arrancar**. `v3.3.22` quedó como **baseline cerrado** (estado en el que `origin/dev` y `origin/main` se igualaron tras la reconciliación + publicación). Tras `v3.3.22` se publicaron sucesivamente `v3.3.23` (sync documental + activación de carriles) y `v3.3.24` (cierre de ambigüedad + activación real de carriles + realineación local). **Cuando Fase 2 arranque, lo hará desde el HEAD operativo más reciente publicado en ese momento (en este momento `v3.3.24`).** La ejecución se hará en el **modo de dos carriles** definido en `CLAUDE.md` ("Modo de trabajo en dos carriles"): el ejecutor 1 opera el carril repo (estructura, paths, deploy) y el ejecutor 2 el carril contenido (texto, blueprint, ARMC). Cada carril debe operar sobre **rama local real** (no `detached HEAD`) antes del primer commit; ramas iniciales esperadas: `chore/fase2-repo-base-v3.3.24` y `chore/fase2-contenido-base-v3.3.24`. El subpaso 2.1 no se ejecuta hasta autorización explícita del revisor / usuario.

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

Las **98** entradas del `git ls-files` clasificadas (verificado el 2026-04-29 sobre commit `7fac2c5` y posteriores). Categorías:

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
| `images/` (23 archivos: logos, team, videos, hero) | MOVE | `web/images/` |

**Total:** 29 archivos a `/web/` (4 HTMLs + 1 css + 1 js + 23 images).

### 3.2 Sistema interno → `/prisma-apex/`

#### 3.2.1 Hub SPA y sus assets globales

| Archivo actual | Categoría | Destino |
|---|---|---|
| `portal/index.html` | MOVE | `prisma-apex/index.html` |
| `portal/analisis/GUIA-NUEVAS-SECCIONES.md` | MOVE | `docs/GUIA-NUEVAS-SECCIONES.md` (interna, NO bajo `/publicados`) |

**Razón del destino:** `clientes-publicados/` se sirve públicamente bajo `/publicados/[cliente]/...`. La guía es **documentación interna** dirigida a operadores del proyecto (cómo crear nuevas secciones de análisis); no es contenido para el cliente. Su lugar correcto es `docs/`, junto al resto de documentación interna del repo.

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

**Decisión sobre fuentes Phosphor:** hoy **el Hub usa Phosphor por CDN** (`portal/index.html` línea 28: `<script src="https://unpkg.com/@phosphor-icons/web"></script>`); **solo el discovery usa fuentes locales** vía `apex/fonts/phosphor.css`. La centralización en `/shared/fonts/phosphor/` se mantiene porque desacopla el discovery de su carpeta original (necesario para el subpaso 2.4) y deja la base lista para que verticales nuevas las consuman localmente sin depender de CDN externo. **No se cambia el Hub**: sigue usando CDN. El subpaso 2.5 actualiza solo las referencias del discovery.

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
| MOVE → `web/` | 29 | web pública (4 HTMLs + 1 css + 1 js + 23 images) |
| MOVE → `prisma-apex/clientes-publicados/armc/` | 20 | entregables ARMC (1 index + 1 css + 8 diagramas + 5 diagnostico + 5 blueprint) |
| MOVE → `prisma-apex/index.html` | 1 | Hub SPA |
| MOVE → `docs/GUIA-NUEVAS-SECCIONES.md` | 1 | guía operativa interna (NO bajo `/publicados`) |
| MOVE → `prisma-apex/core/discovery-engine/` | 4 | motor APEX |
| MOVE → `shared/fonts/phosphor/` | 4 | fuentes locales del discovery |
| STAY | 32 | 14 server + 9 docs canónicos raíz + 4 docs/ operativos + 2 configs + 2 packages + 1 .github |
| EXPORT → `prisma-consulting` | 7 | 6 scripts ARMC + `VALIDACION-CATALOGO-ARMC.md` |
| **TOTAL** | **98** | verificado contra `git ls-files | wc -l` |

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
- Añadir mounts explícitos para `/apex` y `/portal` para que local/dev sin nginx sigan siendo coherentes con el árbol físico.
- Mantener handler `/hub` apuntando a `portal/index.html` (todavía no movido).

**Cambio de infraestructura (Variante B, `dev` primero):**
- Verificar antes de tocar nginx el inventario real de rutas desde el `access_log` activo de `prisma-dev`; no basta con asumir las 11 superficies como lista cerrada.
- Preparar la nueva config nginx fuera de linea, mantener la activa intacta y usar este orden estricto en `dev`: **config nueva preparada → repo actualizado en `~/web-de-prisma-dev` → `pm2 restart prisma-dev` → activacion de la config nueva → `nginx -t` → reload**.
- Cambiar el `root` global del site nginx de `dev` para que apunte a `/home/prisma/web-de-prisma-dev/web/` tras desplegar el slice.
- Declarar excepciones explícitas para `/apex`, `/portal/`, `/api/` y `/hub` para que no dependan del nuevo `root` por defecto.
- Cerrar explicitamente `/hub` por serving directo desde nginx hacia `portal/index.html` mientras 2.3 no lo mueva; el handler de Express queda como fallback local/sin nginx.
- Respaldar la config activa de nginx antes de editarla y validar con `nginx -t` antes del reload.
- Seguir el procedimiento detallado de `docs/RUNBOOK-EJECUTOR-VARIANTE-B-SUBPASO-2.1.md`.

**Validación runtime (smoke tests obligatorios):**
- `prismaconsul.com/` carga la landing.
- `prismaconsul.com/aviso-legal`, `/cookies`, `/privacidad` cargan.
- Assets de la landing (`/css/styles.css?v=147`, `/js/main.js`, `/images/...`) responden 200.
- `/hub` y `/apex` siguen funcionando (todavía no se han movido).
- URLs legacy bajo `/portal/...` siguen funcionando tras el cambio de `root`.

**Riesgo:** medio-alto. El cambio de `root` global puede romper cualquier superficie no declarada como excepción. Mitigación: backup previo del site `prisma-dev`, inventario real desde logs, orden estricto repo→pm2→nginx, smoke tests con cache buster, rollback completo (nginx + repo + pm2) y nota explícita sobre Cloudflare si luego se replica a producción.

**Despliegue obligatorio en dev** + sesión humana mínima en `dev.prismaconsul.com/` antes de seguir.

### Subpaso 2.2 — Mover entregables ARMC bajo `/prisma-apex/clientes-publicados/`

**Movimientos:**
- `portal/analisis/armc/` → `prisma-apex/clientes-publicados/armc/` (20 archivos).
- `portal/analisis/GUIA-NUEVAS-SECCIONES.md` → `docs/GUIA-NUEVAS-SECCIONES.md` (interna, NO bajo `/publicados`).

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

**Cambio de infraestructura (Variante B ya activa):**
- Como `/publicados` vive fuera de `/web/`, añadir una excepción explícita en nginx para `/publicados` en `dev`/producción; el static mount de Express sigue siendo necesario para local y para entornos sin nginx, pero no basta por sí solo en el remoto.
- Como `/portal/` ya es una excepción explícita de nginx bajo Variante B, el redirect legacy `/portal/analisis/:cliente/*` debe reflejarse también en nginx o dejarse caer intencionalmente hacia Express. No asumir que el redirect de `server.js` se ejecutará en remoto si nginx consume `/portal/` antes.
- Validar tanto la URL nueva como la legacy con cache buster tras ajustar nginx.

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

**Cambio de infraestructura (Variante B ya activa):**
- Reapuntar la regla nginx que sirve `/hub` directamente para que deje de devolver `portal/index.html` y pase a devolver `prisma-apex/index.html`.
- El cambio del handler de Express sigue siendo necesario para local o entornos sin nginx, pero en `dev`/producción el comportamiento visible de `/hub` no cambia hasta ajustar nginx.

**Validación runtime obligatoria:**
- `/hub` sigue cargando la SPA del Hub idéntica.
- Smoke tests del bloque B PASS.
- Login de cliente y admin funcionan.

**Riesgo:** bajo. Solo cambia el `sendFile` del handler.

### Subpaso 2.4 — Mover `apex/` → `prisma-apex/core/discovery-engine/`

**Razón crítica de diseño:** el discovery actual (`apex/index.html`) usa **rutas relativas** para sus assets:
- `<link rel="stylesheet" href="fonts/phosphor.css">` (línea 31)
- `<link rel="stylesheet" href="form.css">` (línea 34)
- `<script src="signal-detector.js"></script>` (línea 1112)
- `<script src="form.js"></script>` (línea 1113)

Hoy funciona porque el repo entero se sirve por `express.static(projectRoot)` y los assets se resuelven relativos al HTML. Si en este subpaso usáramos `app.get('/apex', sendFile)`, el HTML cargaría pero los 4 assets darían 404. Por eso **NO se usa `sendFile` para `/apex`**; se usa **static mount** sobre la carpeta nueva.

**Movimientos:**
- `apex/index.html` → `prisma-apex/core/discovery-engine/index.html`.
- `apex/form.css` → idem.
- `apex/form.js` → idem.
- `apex/signal-detector.js` → idem.

**Cambio de servidor — static mount (NO sendFile):**

```javascript
// Antes (eliminado):
//   app.get('/apex', ...) ← NO usar; rompería los assets relativos

// Después:
app.use('/apex', express.static(
  path.join(projectRoot, 'prisma-apex', 'core', 'discovery-engine'),
  { index: 'index.html', extensions: ['html'] }
));
```

**Cambio de infraestructura (Variante B ya activa):**
- Reapuntar la excepción nginx de `/apex` desde el árbol viejo `apex/` al nuevo directorio `prisma-apex/core/discovery-engine/`.
- No asumir que el static mount de Express por sí solo cambiará el comportamiento de `dev`/producción bajo esta arquitectura; nginx sigue siendo la capa principal de serving para ese path.

Con `static` montado en `/apex`:
- `prismaconsul.com/apex` (sin trailing slash) → resuelve `index.html` por `index: 'index.html'`.
- `prismaconsul.com/apex/form.css` → resuelve `form.css` dentro de la carpeta.
- `prismaconsul.com/apex/form.js` → resuelve `form.js`.
- `prismaconsul.com/apex/signal-detector.js` → resuelve `signal-detector.js`.
- `prismaconsul.com/apex/fonts/phosphor.css` → seguirá funcionando hasta el subpaso 2.5 (donde fonts se centraliza en `/shared/`).

**Validación runtime obligatoria:**
- `prismaconsul.com/apex` carga el formulario discovery (HTML + CSS + JS + fonts visibles).
- En DevTools → Network: confirmar que `form.css`, `form.js`, `signal-detector.js`, `fonts/phosphor.css` responden 200, no 404.
- El formulario completa el flujo (research-company → generate-questions → submit-form) idéntico.
- Endpoints API responden con shapes intactas (`/api/research-company`, `/api/generate-questions`, `/api/submit-form`, `/api/groq-chat`, `/api/groq-whisper`).

**Riesgo:** medio. Si algún asset relativo no resuelve, el formulario aparece sin estilos o sin lógica. Mitigación: el static mount preserva exactamente la resolución de paths que tenía el `express.static(projectRoot)` original para esa carpeta.

### Subpaso 2.5 — Centralizar fuentes Phosphor del discovery en `/shared/`

**Alcance:** afecta **solo al discovery**. El Hub no se toca en este subpaso porque ya usa Phosphor por CDN (`https://unpkg.com/@phosphor-icons/web`) — no depende de las fuentes locales que se mueven.

**Movimientos:**
- `apex/fonts/Phosphor.ttf` → `shared/fonts/phosphor/Phosphor.ttf`
- `apex/fonts/Phosphor.woff` → `shared/fonts/phosphor/Phosphor.woff`
- `apex/fonts/Phosphor.woff2` → `shared/fonts/phosphor/Phosphor.woff2`
- `apex/fonts/phosphor.css` → `shared/fonts/phosphor/phosphor.css`

**Cambios en frontend:**
- `prisma-apex/core/discovery-engine/index.html` línea 31: `<link rel="stylesheet" href="fonts/phosphor.css">` → `<link rel="stylesheet" href="/shared/fonts/phosphor/phosphor.css">`.
- `prisma-apex/index.html` (Hub) **NO se toca**: sigue cargando Phosphor desde CDN.

**Cambio de servidor:**
- Añadir static para `/shared`:
  ```javascript
  app.use('/shared', express.static(path.join(projectRoot, 'shared')));
  ```

**Cambio de infraestructura (Variante B ya activa):**
- Añadir una excepción nginx explícita para `/shared`, porque tras mover las fuentes fuera de `/web/` ese path ya no quedará cubierto por el `root` global del site.
- El static mount de Express sigue siendo el contrato local/sin nginx; remoto requiere alineación explícita de nginx.

**Validación runtime obligatoria:**
- En el **discovery** (`prismaconsul.com/apex`): los iconos Phosphor (clases `ph ph-*`) renderizan correctamente. En DevTools → Network: confirmar que `/shared/fonts/phosphor/phosphor.css` y los archivos `.woff2`/`.woff`/`.ttf` responden 200.
- En el **Hub** (`prismaconsul.com/hub`): los iconos siguen renderizando idéntico (NO debe haber cambio porque sigue usando CDN). Esta verificación es de **regresión negativa**: confirma que NO se rompió el Hub mientras se reorganizaban las fuentes del discovery.

**Riesgo:** bajo. Si los iconos no aparecen en el discovery, la referencia `<link>` en su `index.html` quedó mal. Mitigación: verificar la ruta absoluta `/shared/fonts/phosphor/phosphor.css` exacta tras el cambio.

### Subpaso 2.6 — Migración aditiva de BD

**DDL exacto, ejecutable en este orden** (Neon SQL Editor o `psql`). Cada bloque es idempotente vía `IF NOT EXISTS` cuando aplica.

#### 2.6.a — Tabla `clientes`

```sql
CREATE TABLE IF NOT EXISTS clientes (
  id            SERIAL PRIMARY KEY,
  nombre        TEXT NOT NULL,
  nombre_corto  TEXT UNIQUE NOT NULL,
  tipo_negocio  TEXT NOT NULL CHECK (tipo_negocio IN ('clinica', 'distribuidor')),
  rfc           TEXT,
  direccion     TEXT,
  ciudad        TEXT,
  cp            TEXT,
  telefono      TEXT,
  sector        TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clientes_nombre_corto ON clientes(nombre_corto);
```

#### 2.6.b — Tabla `client_memberships`

```sql
CREATE TABLE IF NOT EXISTS client_memberships (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
  cliente_id  INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('prisma_admin', 'cliente_admin', 'cliente_user')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (usuario_id, cliente_id)
);

CREATE INDEX IF NOT EXISTS idx_client_memberships_usuario ON client_memberships(usuario_id);
CREATE INDEX IF NOT EXISTS idx_client_memberships_cliente ON client_memberships(cliente_id);
```

#### 2.6.c — Tabla `engagements`

```sql
CREATE TABLE IF NOT EXISTS engagements (
  id              SERIAL PRIMARY KEY,
  cliente_id      INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  producto        TEXT NOT NULL DEFAULT 'apex' CHECK (producto IN ('apex')),
  vertical        TEXT NOT NULL CHECK (vertical IN ('clinica-multi', 'clinica-personal', 'distribuidor')),
  fase_legacy_id  INTEGER NOT NULL CHECK (fase_legacy_id BETWEEN 1 AND 4),
  submission_id   TEXT REFERENCES apex_submissions(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  closed_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_engagements_cliente ON engagements(cliente_id);
CREATE INDEX IF NOT EXISTS idx_engagements_submission ON engagements(submission_id);
```

#### 2.6.d — Tabla `entrevistas`

```sql
CREATE TABLE IF NOT EXISTS entrevistas (
  id                       SERIAL PRIMARY KEY,
  engagement_id            INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  fecha                    DATE,
  participantes            TEXT,
  link_drive_audio         TEXT,
  path_transcripcion_repo  TEXT,
  created_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entrevistas_engagement ON entrevistas(engagement_id);
```

#### 2.6.e — Tabla `entregables`

```sql
CREATE TABLE IF NOT EXISTS entregables (
  id                SERIAL PRIMARY KEY,
  engagement_id     INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  tipo              TEXT NOT NULL,
  plantilla_origen  TEXT,
  path_servido      TEXT NOT NULL,
  version           INTEGER DEFAULT 1,
  publicado_en      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entregables_engagement ON entregables(engagement_id);
CREATE INDEX IF NOT EXISTS idx_entregables_path ON entregables(path_servido);
```

#### 2.6.f — Columnas transitorias en `portal_users` y canónica en `portal_files`

```sql
ALTER TABLE portal_users
  ADD COLUMN IF NOT EXISTS cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS active_engagement_id INTEGER REFERENCES engagements(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_portal_users_cliente ON portal_users(cliente_id);

ALTER TABLE portal_files
  ADD COLUMN IF NOT EXISTS engagement_id INTEGER REFERENCES engagements(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_portal_files_engagement ON portal_files(engagement_id);
```

#### 2.6.g — Migración inicial de datos (regla `MD-21`: 1 engagement por cliente)

```sql
-- 1. Crear cliente ARMC desde el primer portal_user con empresa no vacía
INSERT INTO clientes (nombre, nombre_corto, tipo_negocio, rfc, direccion, ciudad, cp, telefono, sector)
SELECT
  empresa, 'armc', 'clinica',
  rfc, direccion, ciudad, cp, telefono, sector
FROM portal_users
WHERE empresa IS NOT NULL AND empresa != '' AND role = 'user'
LIMIT 1
ON CONFLICT (nombre_corto) DO NOTHING;

-- 2. Asignar cliente_id a usuarios cliente_user (NO a admins)
UPDATE portal_users SET cliente_id = (SELECT id FROM clientes WHERE nombre_corto = 'armc')
WHERE role = 'user' AND empresa IS NOT NULL AND empresa != '';

-- 3. Crear UN engagement por cliente identificado
INSERT INTO engagements (cliente_id, producto, vertical, fase_legacy_id, submission_id)
SELECT
  c.id, 'apex',
  CASE WHEN u.profile_type = 'clinica' THEN 'clinica-multi' ELSE 'distribuidor' END,
  COALESCE(u.current_phase, 1),
  u.apex_submission_id
FROM clientes c
JOIN portal_users u ON u.cliente_id = c.id AND u.role = 'user'
WHERE NOT EXISTS (SELECT 1 FROM engagements WHERE cliente_id = c.id);

-- 4. active_engagement_id solo para cliente_users (admins quedan NULL)
UPDATE portal_users SET active_engagement_id = (
  SELECT e.id FROM engagements e WHERE e.cliente_id = portal_users.cliente_id LIMIT 1
)
WHERE role = 'user' AND cliente_id IS NOT NULL;

-- 5. ClientMemberships: prisma_admin para todos los admins en todos los clientes
INSERT INTO client_memberships (usuario_id, cliente_id, role)
SELECT u.id, c.id, 'prisma_admin'
FROM portal_users u CROSS JOIN clientes c
WHERE u.role = 'admin'
ON CONFLICT (usuario_id, cliente_id) DO NOTHING;

-- 6. ClientMemberships: cliente_user para cada usuario con cliente_id asignado
INSERT INTO client_memberships (usuario_id, cliente_id, role)
SELECT u.id, u.cliente_id, 'cliente_user'
FROM portal_users u
WHERE u.role = 'user' AND u.cliente_id IS NOT NULL
ON CONFLICT (usuario_id, cliente_id) DO NOTHING;
```

#### 2.6.h — Validación post-migración (queries esperadas)

```sql
-- Esperado: 1 cliente
SELECT COUNT(*) FROM clientes;

-- Esperado: 1 engagement
SELECT COUNT(*) FROM engagements;

-- Esperado: 2 memberships (1 prisma_admin info@, 1 cliente_user armc@)
SELECT u.email, c.nombre_corto, cm.role FROM client_memberships cm
  JOIN portal_users u ON u.id = cm.usuario_id
  JOIN clientes c ON c.id = cm.cliente_id;

-- Esperado: armc@ con cliente_id y active_engagement_id no NULL; info@ con ambos NULL
SELECT email, role, cliente_id, active_engagement_id FROM portal_users;
```

**Validación runtime obligatoria:**
- Tablas legacy (`portal_users`, `portal_files`, `portal_activity_log`, `apex_submissions`) siguen funcionando idéntico.
- Login, upload de archivos, listado, actualización, panel de actividad — todos PASS.
- Tablas nuevas accesibles vía consulta SQL pero **no** consumidas por código de Sprint A.
- Las queries de validación 2.6.h devuelven los conteos esperados.

**Riesgo:** alto si la migración rompe consultas existentes. Mitigación obligatoria:
1. **`pg_dump` completo de Neon** antes de ejecutar 2.6.a.
2. Ejecutar bloques en orden estricto (a → b → c → d → e → f → g → h).
3. Si cualquier bloque falla, detener inmediatamente y restaurar desde dump.

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

**Nota de arquitectura:** este bloque resume solo el contrato esperado de `server.js`. Bajo la Variante B adoptada para `dev`/producción, estos cambios no sustituyen la alineación equivalente en nginx para todo path público que viva fuera de `/web/` (`/hub`, `/apex`, `/publicados`, `/shared` y redirects legacy bajo `/portal/...`).

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

// SPA del discovery — static mount (preserva assets relativos: form.css, form.js,
// signal-detector.js). NO usar sendFile — rompería esos 4 assets. Ver subpaso 2.4.
app.use('/apex', express.static(
  path.join(projectRoot, 'prisma-apex', 'core', 'discovery-engine'),
  { index: 'index.html', extensions: ['html'] }
));

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
| PF2-1 | Web pública pasa a `web/`; local/sin nginx servida por `express.static('web')` y en `dev`/producción por nginx con `root` global apuntando a `/web` |
| PF2-2 | Hub SPA pasa a `prisma-apex/index.html`; local/sin nginx servida por handler `/hub` explícito y en `dev`/producción por regla nginx explícita para `/hub` |
| PF2-3 | Discovery pasa a `prisma-apex/core/discovery-engine/`; servido por **static mount** bajo `/apex` (`app.use('/apex', express.static(...))`), NO por `sendFile`, para preservar la resolución de assets relativos (`form.css`, `form.js`, `signal-detector.js`) que el HTML usa internamente |
| PF2-4 | Entregables ARMC pasan a `prisma-apex/clientes-publicados/armc/`; local/sin nginx servidos por `express.static('/publicados')` y en `dev`/producción por excepción nginx explícita para `/publicados` |
| PF2-5 | URL canónica de entregables es `/publicados/[cliente]/...`; URL legacy `/portal/analisis/[cliente]/...` redirige 301 indefinido, con alineación explícita de nginx bajo Variante B |
| PF2-6 | Fuentes Phosphor centralizadas en `shared/fonts/phosphor/`; local/sin nginx servidas por `/shared` y en `dev`/producción por excepción nginx explícita para `/shared` |
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

- `origin/dev` y `origin/main` ya están igualados en el baseline `v3.3.22`; no reabrir la reconciliación salvo conflicto nuevo.
- La carpeta principal local ya quedó alineada no destructivamente a `d06ef6e`; el WIP previo quedó preservado y no debe reintroducirse por accidente en el arranque de Fase 2.
- Activar los dos carriles sobre ramas y/o worktrees limpios antes de tocar el subpaso 2.1.
- Cualquier ajuste adicional previo a Fase 2 debe hacerse en rama o `worktree` temporal limpio; no sobre working tree sucio ni sobre un carril ajeno.
- Aprobación del revisor sobre este plan.
- Confirmación del usuario.
- Backup de Neon (`pg_dump`) antes de subpaso 2.6.
- Confirmación del acceso al repo `prisma-consulting` para subpaso 2.9.

---

**Fin del plan.**
