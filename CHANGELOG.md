# Changelog

Registro de cambios relevantes del proyecto PRISMA Consul.

## [2026-04-29] — v3.3.6

### Sprint A fase 1 — Bloque C: 5 correcciones del revisor sobre PLAN-FASE2.md

Aplicación de los 5 hallazgos del revisor sobre `v3.3.5`. No toca código del producto.

- **Subpaso 2.4 (Alto)**: rediseñado para usar `app.use('/apex', express.static(...))` en lugar de `app.get('/apex', sendFile)`. El discovery usa rutas relativas a sus assets (`form.css`, `form.js`, `signal-detector.js`, `fonts/phosphor.css`); con `sendFile` el HTML cargaría pero los 4 assets darían 404. El static mount preserva la resolución de paths que tenía antes vía `express.static(projectRoot)`. Razón crítica de diseño documentada explícitamente.
- **Subpaso 2.6 (Alto)**: convertido de placeholders a **DDL exacto y ejecutable**. 8 sub-bloques (2.6.a-2.6.h) con `CREATE TABLE` completo para las 5 tablas nuevas (`clientes`, `client_memberships`, `engagements`, `entrevistas`, `entregables`), `ALTER TABLE` para columnas transitorias y canónica, migración inicial de datos en SQL ejecutable según regla MD-21 (1 engagement por cliente identificado), y queries de validación post-migración. Mitigación obligatoria: `pg_dump` antes de ejecutar.
- **Inventario 97→98 (Medio)**: corregido el conteo total. `git ls-files` real devuelve 98 archivos (no 97). Subtotal `images/` corregido a 23 (no 22) — error original venía de una entrada con tilde (`flujo-atención-paciente.html`) que aparecía duplicada en el conteo por escapado de caracteres. Tabla resumen 3.8 actualizada con totales exactos: 29 web/, 20 ARMC, 1 Hub, 1 GUIA (a docs/), 4 discovery, 4 phosphor, 32 STAY, 7 EXPORT = **98**.
- **GUIA-NUEVAS-SECCIONES.md (Medio)**: destino corregido a `docs/GUIA-NUEVAS-SECCIONES.md` en lugar de `prisma-apex/clientes-publicados/`. Razón: `clientes-publicados/` se sirve públicamente bajo `/publicados/[cliente]/...`; la guía es **documentación interna** (cómo crear nuevas secciones de análisis), no contenido para el cliente. Su lugar correcto es `docs/`. Corregido en sección 3.2.1, en subpaso 2.2 y en la tabla resumen 3.8.
- **Subpaso 2.5 (Bajo)**: aclarada la realidad del Hub respecto a Phosphor. El Hub carga Phosphor desde **CDN** (`https://unpkg.com/@phosphor-icons/web`); **solo el discovery** usa fuentes locales. La centralización en `/shared/fonts/phosphor/` afecta solo al discovery; el Hub no se toca en este subpaso. Validación post-2.5 actualizada: verificación positiva en discovery + verificación de regresión negativa en el Hub (que NO se rompió).

Estado: bloque C reabierto y corregido. Pausa antes de revalidación del revisor.

## [2026-04-29] — v3.3.5

### Sprint A fase 1 — Bloque C: Plan archivo a archivo de Fase 2

Cierre del bloque C de Fase 1: clasificación archivo por archivo del repo + plan secuencial de movimientos físicos para Fase 2. No toca código del producto.

- **`docs/PLAN-FASE2.md`** (NUEVO): documento único auditable que combina clasificación + plan en 9 secciones:
  1. Propósito.
  2. Estructura objetivo (referencia a `MODELO-DOMINIO.md` §5).
  3. **Clasificación archivo por archivo** de los 97 archivos del repo en 4 categorías (MOVE / STAY / EXPORT / DELETE):
     - 28 archivos MOVE → `web/` (web pública).
     - 26 archivos MOVE → `prisma-apex/` (Hub SPA, entregables ARMC, GUIA, discovery engine, fuentes Phosphor).
     - 4 archivos MOVE → `shared/fonts/phosphor/`.
     - 32 archivos STAY (backend, docs canónicos, configs).
     - 7 archivos EXPORT → `prisma-consulting` (6 scripts ARMC + VALIDACION-CATALOGO-ARMC.md).
  4. **Plan secuencial en 9 subpasos** (2.1 a 2.9), cada uno con: movimientos físicos, cambio de servidor, validación runtime obligatoria y riesgo. Diseñados para que ARMC no se rompa en ningún momento intermedio.
  5. Cambios consolidados a `server.js` (estado final esperado tras Fase 2).
  6. Tabla de tests de regresión por subpaso.
  7. **12 decisiones cerradas** (PF2-1 a PF2-12).
  8. Lo que NO está en el plan (pendiente de sprints posteriores: plantillas por vertical, migración de uploads Drive→IONOS, centralización auth, EngagementAccess, cierre legacy, operación continua).
  9. Pendientes antes de ejecutar: aprobación del revisor, confirmación del usuario, backup de Neon, confirmación de acceso a `prisma-consulting`.

Estado: **bloque C completado**. Plan listo para validación del revisor antes de ejecutar Fase 2. Próximo entregable interno autorizado tras aprobación: **bloque D — Modo revisor permanente en `CLAUDE.md` + Replicación Ecosistema en `CLAUDE.md` de los otros 4 repos**.

## [2026-04-29] — v3.3.4

### Sprint A fase 1 — sincronización del review vivo tras cierre aceptado del bloque B

Sincronización documental posterior al dictamen final del revisor. No toca código del producto.

- **`REVIEW-PRISMA-APEX.md`:** eliminadas referencias operativas stale que todavía dejaban el bloque B como pendiente. El estado vigente queda alineado con el cierre ya aceptado en `v3.3.3`: bloque B `PASS`, bloque C como siguiente entregable interno autorizado y lista de abiertos reducida a bloque C + tareas documentales remanentes.
- **`docs/VALIDACION-BLOQUE-B-REGISTRO-RUTAS.md`:** estado superior actualizado para dejar de figurar como “ejecución pendiente” y apuntar al reporte definitivo del bloque B.
- **Versionado visible:** bump documental a `v3.3.4` en `index.html`, `portal/index.html` y `CLAUDE.md`.

**Resultado:** el review vivo vuelve a ser coherente con `CHANGELOG.md`, el addendum del reporte del bloque B y el dictamen vigente del revisor.

## [2026-04-29] — v3.3.3

### Sprint A fase 1 — Bloque B PASS (sesión humana visual completada)

Cierre del bloque B con sesión humana en navegador real, según el plan de 3 pasos acordado en v3.3.2. No toca código del producto.

- **Sesión humana ejecutada:** ventana de incógnito de Chrome contra `https://dev.prismaconsul.com/hub`. Versión validada: `v3.3.1`.
- **Decisión operativa tomada en la sesión:** **Opción A — solo dev, omitiendo local**. Justificación documentada en el addendum: el slice es exclusivamente JavaScript de frontend; local y dev ejecutan código idéntico para este cambio; probar local sería redundante. Reduce el alcance del addendum de 12 a 6 verificaciones. Si el revisor considera que el umbral del checklist requiere los dos entornos, las 6 verificaciones de local pueden añadirse como complemento.
- **Resultado:** 6/6 verificaciones visuales PASS.
  - Dev cliente (`armc@prismaconsul.com`): Cirujano + Resumen Ejecutivo + Modelo de Datos → todos PASS.
  - Dev admin (`info@prismaconsul.com`): Cirujano + Resumen Ejecutivo + Modelo de Datos → todos PASS.
  - Errores en consola: solo el warning ignorable de iframe sandbox + ruido de extensión Norton ajeno a la app.
- **`docs/REPORTE-BLOQUE-B-REGISTRO-RUTAS.md`:** añadida sección "Addendum — sesión visual humana" con fecha, operador, decisión de alcance, resultados por sesión, errores observados (clasificados entre app vs no-app), y veredicto final. No se rehace el reporte original.
- **`REVIEW-PRISMA-APEX.md`:** estado global actualizado a "Bloque B PASS"; bitácora con nueva entrada documentando el cierre y autorizando el bloque C como próximo entregable interno.

**Veredicto: Bloque B PASS** (con decisión Opción A documentada). Próximo entregable interno autorizado: **bloque C — clasificación archivo por archivo + plan archivo a archivo de Fase 2.**

## [2026-04-29] — v3.3.2

### Sprint A fase 1 — Bloque B recategorizado a BLOCKED + dev desplegado al día

Aplicación del dictamen del revisor sobre la entrega v3.3.1: el bloque B no alcanza PASS porque falta sesión humana en navegador real con DevTools. Se recategoriza formalmente y se desbloquea el primer paso del plan de cierre (deploy de dev). No toca código del producto.

- **`docs/REPORTE-BLOQUE-B-REGISTRO-RUTAS.md` recategorizado**:
  - Matriz de 13 filas: 12 tests visuales pasan a `BLOCKED — visual humana pendiente`. Tests dev/VPS añaden segunda razón (`dev desfasado` al momento de la ejecución inicial — ya resuelto en este commit).
  - Test 7 (externos con credenciales) se mantiene como `N/A explícito` (aceptado por el revisor).
  - **Sección 3 (probe técnica `warn + null`) se mantiene como PASS 9/9** — aceptada como evidencia complementaria por el revisor.
  - Veredicto recategorizado: `Bloque B: BLOCKED — visual humana pendiente`.
  - Sección 8 nueva: plan de cierre en 3 pasos secuenciales (deploy dev, sesión humana mínima, addendum corto al reporte). No se rehace todo el bloque B.
- **`REVIEW-PRISMA-APEX.md`**:
  - Estado global actualizado: bloque B `BLOCKED`, no se arranca bloque C hasta cerrar B con sesión humana.
  - Bitácora: nueva entrada documentando el dictamen del revisor y el plan de 3 pasos.
- **Deploy de dev al estado actual** (paso 1 del plan, ejecutado en este commit):
  - `ssh prisma@212.227.251.125 && git pull origin dev && pm2 restart prisma-dev` ejecutado con éxito.
  - Verificación post-deploy: `https://dev.prismaconsul.com/hub` ahora sirve `v3.3.1` con el slice completo (registry + función + optional chaining + 2 guardias en viewers presentes y verificadas vía curl).

Pasos pendientes para cerrar bloque B (responsabilidad humana, no del agente):
1. ✅ Deploy de dev — hecho en este commit.
2. 🔲 Sesión humana mínima en navegador real con DevTools: 4 sesiones (local cliente, local admin, dev cliente, dev admin) × 3 items (Cirujano, Resumen Ejecutivo, Modelo de Datos) = 12 verificaciones visuales. Cada una verifica iframe carga y consola limpia.
3. 🔲 Addendum corto al `REPORTE-BLOQUE-B-REGISTRO-RUTAS.md` con resultado de cada verificación. Si todo PASS, bloque B queda cerrado y el agente puede arrancar bloque C.

## [2026-04-29] — v3.3.1

### Sprint A fase 1 — Bloque B ejecutado: smoke tests del slice del registro de rutas

Ejecución del checklist `docs/VALIDACION-BLOQUE-B-REGISTRO-RUTAS.md` por el ejecutor agente sobre el commit `ff8036b` (`v3.3.0`). No toca código del producto.

- **`docs/REPORTE-BLOQUE-B-REGISTRO-RUTAS.md`** (NUEVO): reporte completo del bloque B con la matriz de 13 filas más probe técnica del contrato `warn + null + optional chaining + guardia en viewers`.
  - **6/6 tests local** PASS. Servidor levantado en `localhost:3099`; los 3 entregables ARMC (`flujo-cirujano.html`, `resumen-ejecutivo.html`, `modelo-datos.html`) responden HTTP 200 con tamaños y títulos correctos. Vista cliente y admin equivalentes a nivel de URL del iframe (mismo `ANALISIS_SECTION_MAP`).
  - **Externos con credenciales: N/A explícito** y justificado (slice no toca Neon, Drive, SMTP, Tavily, Groq, Whisper).
  - **6/6 tests dev/VPS** PASS con observación: dev sirve `v3.2.47` (no `v3.3.0`). Para ARMC el comportamiento es idéntico (registry + optional chaining presentes); falta el commit `4d13851` con las 2 guardias defensivas en viewers — no bloquea la operativa.
  - **Probe técnica `warn + null`: 9/9 sub-tests PASS** ejecutados en Node aislado replicando el slice exacto del HTML. Confirma contrato end-to-end.
  - **Errores encontrados:** ninguno.
  - **Veredicto:** PASS con observación operativa documentada.
  - **Limitaciones del entorno del ejecutor** declaradas explícitamente: no hay navegador real con DevTools disponible; la validación visual humana del iframe queda fuera de alcance del agente. La evidencia se construye via HTTP+probe JS, que es estructuralmente equivalente para el caso ARMC actual pero no sustituye la confirmación visual humana si el revisor lo considera requisito.

Recomendación al revisor: si acepta la equivalencia HTTP+probe JS, el siguiente entregable interno es el bloque C (clasificación archivo por archivo + plan archivo a archivo de Fase 2). Si exige inspección visual con DevTools, esos 12 tests se recategorizan como `BLOCKED — visual humana pendiente` y la probe técnica queda como única evidencia ejecutable.

## [2026-04-29] — v3.3.0

### Sprint A fase 1 — bump MINOR (separación de track) + incorporación de docs/scripts

Bump MINOR para separar el track de Sprint A (`v3.3.x`) del versionado lineal de producción (`v3.2.x`). Resuelve la colisión de `v3.2.46` entre `main` (publicación cirujano post-CEO, commit `52d0049`) y `dev` (capa de registro de rutas, commit `7fb12b6`). El cierre final de Sprint A + Sprint B saltará a `v4.0.0` como ya estaba previsto. No toca código del producto.

- **Bump versión:** `v3.2.51` → `v3.3.0` en `index.html`, `portal/index.html`, `CLAUDE.md`. Las entradas históricas `v3.2.46`-`v3.2.51` del CHANGELOG se conservan como registro del trabajo de Sprint A en `dev`.
- **`docs/NOMENCLATURA.md`** (NUEVO en `dev`): taxonomía oficial de nombres de documentos PRISMA. Garantiza que cada archivo en el Hub tenga nombre único, auto-descriptivo y adecuado para entrenamiento de IA, búsqueda semántica y clasificación automática.
- **`portal/analisis/GUIA-NUEVAS-SECCIONES.md`** (NUEVO en `dev`): guía operativa para crear nuevas secciones de análisis y registrarlas en el Hub. Mencionada en `CONTRATOS.md` §7.1 como documentación que asume estructura legacy y se actualizará en fase 2 al mover los entregables a `prisma-apex/clientes-publicados/`.
- **`scripts/`** (NUEVO en `dev`): 6 scripts Node.js de mantenimiento ARMC (`list-armc-files.js`, `delete-armc-duplicates.js`, `rename-armc-files.js`, `update-armc-doctypes.js`, `move-armc-patient-data.js`, `revert-armc-patient-data.js`). Mencionados en `MODELO-DOMINIO.md` y `CONTRATOS.md` como scripts one-off que se clasificarán y eventualmente migrarán a `prisma-consulting` cuando se haga la clasificación archivo por archivo (bloque C de Fase 1).

## [2026-04-29] — v3.2.51

### Sprint A fase 1 — saneamiento del repo en `dev` tras divergencia con `main`

Saneamiento de tres problemas detectados al volver de `main` a `dev`. No toca código del producto.

- **`REVIEW-PRISMA-APEX.md`**: actualizado al estado más reciente del revisor (estaba desfasado en `dev` respecto al cierre del bloque A). El estado de aprobación, dictamen operativo, gates, riesgos y bitácora ahora reflejan que el bloque A está cerrado por revisión y que la base operativa del bloque B está definida en `docs/VALIDACION-BLOQUE-B-REGISTRO-RUTAS.md`.
- **`docs/VALIDACION-BLOQUE-B-REGISTRO-RUTAS.md`** (NUEVO en `dev`): checklist operativo del bloque B preparado por el revisor. Fija alcance, definición de hecho, prerrequisitos, muestra mínima, ejecución por bloques (locales, externos con credenciales `N/A`, dev/VPS), probe técnica opcional de `warn + null`, y matriz de reporte obligatoria.
- **`.gitignore`**: añadidas reglas para `.claude/` y `.vscode/` (configs de IDE local que no deben commitearse).

**Pendiente de decisión del usuario** (no se aplicó en este commit):
- Otros archivos untracked (`docs/NOMENCLATURA.md`, `portal/analisis/GUIA-NUEVAS-SECCIONES.md`, `scripts/`) — origen de otras sesiones, decisión de añadir queda al usuario.
- **Colisión de versión `v3.2.46`** entre `main` (publicación cirujano post-CEO, commit `52d0049`) y `dev` (capa de registro de rutas, commit `7fb12b6`). Cuando se mergee `dev → main` habrá conflicto en CHANGELOG, HTMLs y CLAUDE.md. Resolución requiere decisión sobre cómo renumerar versiones — no se aplica unilateralmente.

## [2026-04-28] — v3.2.50

### Sprint A fase 1 — CONTRATOS.md: 2 incoherencias textuales residuales

Cierre de las dos últimas incoherencias textuales señaladas por el revisor sobre v3.2.49: el preámbulo de §6.1 seguía describiendo las constantes legacy en presente y §14.1 mantenía C09 como "propuesto cerrado, pendiente validación". No toca código del producto.

- **`CONTRATOS.md` §6.1 (preámbulo, tabla y "Detección")**: añadida nota inicial "Estado actual (post v3.2.46-48): ya no hay paths hardcodeados". El bloque legacy queda etiquetado explícitamente como "Estado legacy (v3.2.45 y anterior)" para trazabilidad histórica del refactor. Tabla de variables marcada como "legacy". "Detección" reformulada en pasado ("eran" en lugar de "son"). El inventario legacy se conserva como referencia documental, no como descripción del código actual.
- **`CONTRATOS.md` §14.1**: C09 cambiado de 🟡 ("propuesto cerrado, pendiente validación") a ✅ ("cerrado en v3.2.43, validado por el revisor"). Frase "Cuando el revisor confirme C09 → Fase 2 desbloqueada" reemplazada por estado factual: "Gate de Fase 2: cumplido (v3.2.44). Fase 2 técnicamente desbloqueada desde el punto de vista de revisión".

Estado: bloque A cerrado completamente y sin incoherencias en `CONTRATOS.md`. Pausa antes de bloque B (smoke tests sobre el slice).

## [2026-04-28] — v3.2.49

### Sprint A fase 1 — CONTRATOS.md: residual de alineación canónica

Cierre del último residual señalado por el revisor sobre v3.2.48: dos pasajes de `CONTRATOS.md` seguían contradiciendo a CT-7 (ya factual) describiendo la capa de registro como trabajo pendiente. No toca código del producto.

- **`CONTRATOS.md` §6.1 ("Estado")**: cambiado de "estas constantes **deben reemplazarse**" (futuro) a "estas constantes **fueron reemplazadas** en v3.2.46-48". Bloque de "Forma esperada tras refactor" sustituido por "Forma actual implementada", reflejando el código real (`ANALISIS_REGISTRY` síncrono, `getAnalysisPaths` con warn+null, optional chaining en consumers, guardia en viewers) en lugar del placeholder hipotético `await getAnalysisRegistry({...})` que nunca se implementó así.
- **`CONTRATOS.md` §14.2 ("Entregables restantes de Fase 1")**: marcados como ✅ los entregables ya cerrados (C10 GLOSARIO.md en v3.2.44; capa de registro de rutas en v3.2.46-48). Bloque B (smoke tests) añadido como entregable abierto siguiente. "Nota operativa" final reformulada en pasado: la capa de registro era prerrequisito técnico, ya está implementada, smoke tests confirmarán comportamiento idéntico tras refactor.

Estado: bloque A literalmente cerrado. CONTRATOS.md sin contradicciones internas. Pausa antes de bloque B (smoke tests).

## [2026-04-28] — v3.2.48

### Sprint A fase 1 — Capa de registro: cierre del fleco de degradación + alineación canónicos

Cierra el último residual del bloque A señalado por el revisor: el contrato "warn + null sin excepción" no quedaba honrado end-to-end porque dos viewers (`analisisOpenItem`, `udAnalisisOpenItem`) construían el `src` del iframe sin guardia, generando URLs rotas tipo `'undefinedflujo-ceo.html'` en lugar de "sección vacía". Adicionalmente, alineación de los canónicos (`MODELO-DOMINIO.md`, `CONTRATOS.md`) que aún hablaban de las constantes hardcodeadas como si existieran.

- **`portal/index.html` — guardias en los 2 viewers**:
  - `analisisOpenItem` (vista cliente): `if (!section || !section.path) return;` añadido. Honra el contrato "sección vacía sin excepción ni iframe roto".
  - `udAnalisisOpenItem` (vista admin "view as user"): misma guardia.
- **`REGISTRO-RUTAS.md` sección 5**: ampliada para describir el contrato end-to-end en dos capas (optional chaining en `ANALISIS_SECTION_MAP` + guardia explícita en los 2 viewers).
- **`MODELO-DOMINIO.md` §9.1**: actualizada la mención a las 3 constantes legacy. Ahora indica que fueron reemplazadas por la capa de registro de rutas en v3.2.46-47, con referencia a `REGISTRO-RUTAS.md`.
- **`CONTRATOS.md` CT-7**: actualizada de "se reemplazan por la capa de registro de rutas (entregable propio, próximo)" a estado factual: "fueron reemplazadas (v3.2.46-47): `ANALISIS_REGISTRY` + `getAnalysisPaths` + consumers con optional chaining + guardia en los 2 viewers".

Estado: bloque A completamente cerrado. Pausa antes de bloque B (smoke tests sobre el slice).

## [2026-04-28] — v3.2.47

### Sprint A fase 1 — Capa de registro de rutas (2 ajustes del revisor sobre bloque A)

Ajustes localizados al bloque A tras la auditoría del revisor. No tocan código adicional ni amplían el slice.

- **`portal/index.html` (consumer end-to-end)**: añadido optional chaining (`?.`) en los 3 accesos del `ANALISIS_SECTION_MAP` a `_armcPaths.diagramas`/`.diagnostico`/`.blueprint`. Honra literalmente el contrato "warn + null, sin excepción" de la spec: si `getAnalysisPaths('armc')` devolviera `null` (cliente no registrado), las propiedades evaluarían a `undefined` sin lanzar `TypeError`. Cambio mínimo: 3 caracteres añadidos en 3 líneas.
- **`REGISTRO-RUTAS.md` sección 5 (comportamiento ante cliente no registrado)**: clarificado que los consumers honran el contrato end-to-end mediante optional chaining.
- **`REGISTRO-RUTAS.md` sección 6 (ejemplo de diff)**: muestra el optional chaining en el código "Después".
- **`REGISTRO-RUTAS.md` criterio 5 (aceptación)**: refinado para distinguir cambios de producto (un único archivo: `portal/index.html`) de la metadocumentación esperada del slice (`CHANGELOG.md`, `CLAUDE.md`, version strings, la propia spec). El criterio anterior era literalmente falso en su redacción aunque correcto en su intención.

## [2026-04-28] — v3.2.46

### Sprint A fase 1 — Capa de registro de rutas (spec + impl mínima)

Bloque A del cierre de Fase 1 según plan aprobado por revisor. Spec breve pegada a la implementación + refactor mínimo y local del slice. Único archivo de producto modificado: `portal/index.html`.

- **`REGISTRO-RUTAS.md`** (NUEVO): especificación canónica de la capa. 10 secciones cubriendo: propósito, fuente de verdad (objeto JS inline), shape mínima, función de resolución, comportamiento ante cliente o sección no registrados, constantes legacy reemplazadas, alcance excluido (sin backend, sin URLs, sin movimientos físicos, sin multi-vertical, sin sistema de plantillas), criterios de aceptación, plan de verificación post-impl (bloque B), y evolución futura fuera de scope.
- **`portal/index.html`**: implementación mínima.
  - Eliminadas las 3 constantes hardcodeadas legacy: `ANALISIS_BASE_PATH`, `ANALISIS_DIAGNOSTICO_PATH`, `ANALISIS_BLUEPRINT_PATH`.
  - Añadido `ANALISIS_REGISTRY` (objeto inline) como fuente de verdad de paths por cliente. Hoy una sola entrada: `armc`.
  - Añadida función `getAnalysisPaths(cliente)` con `console.warn` si cliente no registrado y retorno `null` (sin lanzar excepción).
  - Modificados los 3 consumers en `ANALISIS_SECTION_MAP` para resolver paths desde el registro vía un único lookup `_armcPaths = getAnalysisPaths('armc')`.
  - Paths exactos preservados: `/portal/analisis/armc/diagramas/`, `/portal/analisis/armc/diagnostico/`, `/portal/analisis/armc/blueprint/`. Sin normalización, sin reordenamiento.
  - Diff: +24 / -7 en un único archivo. Ningún otro flujo del Hub tocado (login, upload, perfil, panel admin, actividad).

Estado: **slice del registro implementado**. Pausa para revisión de spec + impl antes de bloque B (smoke tests sobre este slice).

## [2026-04-28] — v3.2.45

### Documentación — normalización del review vivo tras cierre de C09 y C10

Corrección del review vivo para que vuelva a reflejar sin contradicciones el estado ya aprobado por revisión. No toca código del producto.

- **`REVIEW-PRISMA-APEX.md`**: eliminadas referencias operativas obsoletas que seguían tratando `CONTRATOS.md` como siguiente entregable y C09/C10 como abiertos en varias secciones. Consolidado el estado real: C09 y C10 cerrados, gate de Fase 2 cumplido, Fase 1 todavía abierta por entregables internos.
- **`REVIEW-PRISMA-APEX.md`**: reintroducido el bloque explícito de comprobaciones runtime pendientes por subpaso (`Neon`, `Google Drive`, `Gmail SMTP`, `Tavily`, `Groq`, `Whisper`, serving en `dev.prismaconsul.com`, infraestructura `nginx`/`PM2`/`IONOS`).
- **`REVIEW-PRISMA-APEX.md`**: riesgos, absorción documental y bitácora alineados con el estado posterior a `GLOSARIO.md`.
- **`index.html` / `portal/index.html` / `CLAUDE.md`**: bump de versión a `v3.2.45`.

## [2026-04-27] — v3.2.44

### Documentación — GLOSARIO.md (cierre de C10) + actualización formal del review

Quinto entregable canónico de Sprint A fase 1. Cierra C10 y desbloquea formalmente el gate de Fase 2 (C09 + C10 cerrados). No toca código del producto.

- **`GLOSARIO.md`** (NUEVO): vocabulario canónico consolidado del proyecto. 15 secciones cubriendo: producto y sistema; modelo de datos; roles de usuario; términos arquitectónicos; términos legacy frozen Sprint A; ecosistema de 5 repositorios y servicios externos; términos de proceso; términos de contratos; términos de URLs específicas; términos de Claude Code; convenciones de naming; aclaraciones de qué NO es cada término; términos pendientes de definir; y regla de precedencia (el canónico manda sobre el glosario).
- **`REVIEW-PRISMA-APEX.md`**: C09 marcado Cerrado (formalización). C10 marcado Cerrado. Gate de Fase 2 actualizado: cumplido. Añadidas 2 entradas en bitácora documentando el cierre de C09 y C10. Aclarado que la verificación runtime es prerrequisito de cada subpaso de Fase 2 que toque contratos o sistemas externos, no gate global.

Estado: **Gate de Fase 2 cumplido**. Cierre total de Fase 1 sigue requiriendo entregables internos (capa de registro de rutas, smoke tests runtime, clasificación, plan archivo a archivo, modo revisor permanente, replicación Ecosistema).

## [2026-04-27] — v3.2.43

### Documentación — CONTRATOS.md (ajustes finales antes del cierre de C09)

Dos ajustes localizados al inventario de CONTRATOS.md tras la segunda auditoría del revisor. No tocan código del producto.

- **`CONTRATOS.md` sección 4.7 (`POST /api/research-company`)**: corregido el error path. La implementación no devuelve HTTP 500: ante cualquier excepción interna devuelve **HTTP 200 con payload de fallback** (`{ success: false, error, profile: <defaults> }`). La SPA distingue éxito vs fallback por el flag `success`, no por el status HTTP. Único path con código distinto de 200 es el `400` por entrada faltante. Verificado contra `server/routes/apex.js:332-348`.
- **`CONTRATOS.md` sección 5.4 (`apex_submissions`)**: limpiado el conteo interno. Aclarado que la tabla tiene **31 columnas** (las 30 escritas por el INSERT + `created_at` autoasignada). Rótulo "Pains (4)" corregido a "Pains (3)" — son 3 campos, no 4. Suma explícita al final del bloque para auditabilidad: `2 + 14 + 6 + 3 + 2 + 4 = 31`.

## [2026-04-27] — v3.2.42

### Documentación — CONTRATOS.md (correcciones del revisor)

Cuatro correcciones al inventario de CONTRATOS.md tras la auditoría del revisor. No tocan código del producto.

- **`CONTRATOS.md` sección 5.4 (`apex_submissions`)**: documentadas las 5 columnas activas que el código real escribe pero `server/schema.sql` no refleja (`tipo_negocio`, `swipe_situaciones`, `rank_order`, `preguntas_adaptativas`, `datos_uso`). Esquema completo elevado de 26 a 30 columnas marcadas con ⚠. Aclarado que `schema.sql` está desfasado y se actualiza en fase 2; el esquema autoritativo durante Sprint A es lo que el código escribe efectivamente en Neon.
- **`CONTRATOS.md` sección 4.7 (`POST /api/research-company`)**: shape de respuesta documentada exactamente como la sirve el código (`success`, `profile`, `searchedFor`, `hadWebSearch`, `searchMethod`).
- **`CONTRATOS.md` sección 4.7 (`POST /api/submit-form`)**: shape de respuesta corregida a `{ success: true, message, id }` (no incluye email de confirmación; los 2 emails son side effect, no payload). Request body detallado con campos canónicos del `formData`.
- **`CONTRATOS.md` sección 14**: alineada con el gate vigente del review. Regla operativa única: el único bloqueante de Fase 2 es C09. C10 y los demás entregables de Fase 1 son requisito del cierre total de Fase 1, no del gate de Fase 2. Aclarado que la capa de registro de rutas es prerrequisito técnico de un sub-paso de Fase 2 (mover `portal/analisis/armc/`), no del gate completo.

## [2026-04-27] — v3.2.41

### Documentación — CONTRATOS.md (cierre de C09)

Cuarto entregable canónico de Sprint A fase 1. Cierra C09 (gate funcional para pasar a Fase 2). No toca código del producto.

- **`CONTRATOS.md`** (NUEVO): inventario exhaustivo de contratos externos del sistema construido leyendo código real. Cubre 5 tipos de contrato con sus respectivos consumidores y reglas de evolución:
  - **URLs públicas** (sección 3): landing, legales, SPAs `/apex` y `/hub`, entregables ARMC actuales (con plan de redirect 301 a `/publicados/[cliente]/...` en fase 2), assets estáticos, fallback.
  - **Endpoints API** (sección 4): 17 endpoints reales documentados con auth, request/response shapes, side effects y consumers — `/api/portal-auth`, `/api/portal-apex-results`, `/api/portal-profile` (GET/PATCH), `/api/portal-upload`, `/api/portal-files` (GET/DELETE/PATCH), `/api/portal-users` (GET/POST), `/api/portal-users/:id` (PATCH), `/api/portal-activity`, `/api/research-company`, `/api/generate-questions`, `/api/submit-form`, `/api/groq-chat`, `/api/groq-whisper`. Marcados como CRÍTICOS los PATCH `portal-profile` y `portal-users/:id` (write path empresarial sin regresión).
  - **Esquema BD** (sección 5): 4 tablas legacy congeladas (`portal_users`, `portal_files`, `portal_activity_log`, `apex_submissions`); 5 tablas aditivas en fase 2 (`clientes`, `client_memberships`, `engagements`, `entrevistas`, `entregables`); columnas `cliente_id` y `active_engagement_id` en `portal_users` (transitorias, NULL para `prisma_admin`).
  - **Paths hardcodeados** (sección 6): 3 constantes en `portal/index.html` (`ANALISIS_BASE_PATH`, `ANALISIS_DIAGNOSTICO_PATH`, `ANALISIS_BLUEPRINT_PATH`) que se reemplazan por la capa de registro de rutas.
  - **Documentación** (sección 7): `GUIA-NUEVAS-SECCIONES.md`, `README.md`, `CLAUDE.md` (sección "Directory Structure") a actualizar en fase 2 simultáneamente al movimiento físico.
  - **Redirects** (sección 8): redirect 301 desde `/portal/analisis/[cliente]/*` a `/publicados/[cliente]/*`.
  - **Validación de fase 2** (sección 12): tests manuales mínimos cubriendo URLs públicas, entregables ARMC, endpoints cliente y admin, schema BD y sincronización `domain-sync.js`.
  - 14 decisiones cerradas (CT-1..CT-14).
- **`index.html` / `portal/index.html` / `CLAUDE.md`**: bump de versión a `v3.2.41`.

## [2026-04-27] — v3.2.40

### Documentación — Consolidación del criterio del revisor

Actualización del review vivo para dejar explícito qué se considera discrepancia activa y qué se considera histórico de revisión tras el cierre de C04. No toca código del producto.

- **`REVIEW-PRISMA-APEX.md`**: consolidado el criterio del revisor sobre discrepancias. Se fija que no hay discrepancia activa sobre C04, que las referencias antiguas en bitácora son histórico y que C09 queda como único bloqueante de Fase 2, mientras C10 permanece como absorción documental obligatoria antes del cierre total de Fase 1.
- **`index.html` / `portal/index.html` / `CLAUDE.md`**: bump de versión a `v3.2.40`.

## [2026-04-27] — v3.2.39

### Documentación — Cierre de C04 (alineación de ECOSISTEMA.md)

Tres ajustes documentales mínimos solicitados por el revisor para dejar cerrado el bloque de canónicos antes de pasar a `CONTRATOS.md`. No tocan código del producto.

- **`REVIEW-PRISMA-APEX.md`**: C04 marcado como Cerrado. Gate de Fase 2 actualizado: ahora bloqueada únicamente por C09 (CONTRATOS.md). R06 marcado como Mitigado. Añadida entrada en bitácora documentando el cierre.
- **`MODELO-DOMINIO.md`** (sección 15): eliminada la deuda residual sobre actualización de `ECOSISTEMA.md` (ya cumplida en v3.2.37).
- **`ECOSISTEMA.md`**: flujo de publicación de entregables reformulado para apuntar exclusivamente al repo (`web-de-prisma/prisma-apex/clientes-publicados/[cliente]/` servido por Express bajo `/publicados/[cliente]/...`), no al "área en el servidor".

## [2026-04-27] — v3.2.38

### Análisis ARMC — Flujo Atención al Paciente (Carlos) post-entrevista CEO

Cierre del primer pase de revisión del flujo de Carlos a la luz de la entrevista CEO 2026-04-15. Cambios in-place dentro de secciones existentes — sin secciones nuevas ni cambios estructurales.

- **`portal/analisis/armc/diagramas/flujo-atención-paciente.html`**:
  - Slide "Equipo de la clínica": entrada "Hermana de Gabo" reidentificada como **Dra. Elián Cabrera** (hija de Marisela) con su rol clínico (tricología + obesidad). Añadida nota: hoy los leads de obesidad NO entran por Carlos — los gestiona Elián al 100% (pendiente C08 si esto cambia con APEX). Añadido sub-bloque con cirujanos externos Figueroa/Vargas/Ducón (resuelto por entrevista CEO).
  - Slide "Flujo paciente nuevo", paso 10: redactado con las 3 variantes A/B/C de la consulta de valoración. Variante A general gratuita (Marisela/Divani), Variante B pre-cirugía con especialista externo (2ª valoración con costo pendiente — C07), Variante C vía directa con Dr. Cabrera por demanda del paciente desde el inicio = $1,950 (Marisela/Divani no intervienen).
  - Sección "Vacíos resueltos por otras entrevistas": 10 → 12 entradas. Añadidas 2 nuevas resueltas por la CEO: las 3 variantes A/B/C y el catálogo definitivo (5 líneas, ~52 procedimientos, hallazgos nuevos: bruxismo, abdominoplastía, lifting facial láser).
- **`docs/VALIDACION-CATALOGO-ARMC.md`**: revertida limpieza errónea de la fila B del bloque 3.7 — la entrevista CEO no precisa si la 2ª valoración con especialista externo es gratuita o de pago. Reabierta como pendiente apuntando a REVIEW-PRISMA-APEX C07. Clarificada fila C: Gabush hace la única valoración cuando el paciente lo pide desde el inicio, Marisela/Divani no intervienen.
- **`REVIEW-PRISMA-APEX.md`** (Sección 7): 2 puntos abiertos nuevos — C07 (costo 2ª valoración pre-cirugía con especialista externo) y C08 (quién agenda variantes B y C de valoración + leads de obesidad — decisión de proceso/sistema APEX).

## [2026-04-27] — v3.2.37

### Documentación — Sprint A fase 1 (definición y compatibilidad)

Primeros entregables auditables de la reorganización de Prisma APEX (plan v4.1, Sprint A). Cierran el modelo de dominio canónico y el mapa del ecosistema. No tocan código del producto.

- **`MODELO-DOMINIO.md`** (NUEVO): documento canónico del modelo conceptual del sistema. Define entidades (Cliente, Usuario, ClientMembership, Engagement, Vertical, Fase, Submission, Entrevista, Archivo, Entregable, Plantilla), relaciones canónicas y separación explícita entre modelo canónico y compatibilidad transitoria. Cierra los tres puntos bloqueantes del revisor: (1) identidad canónica de Cliente con read+write path sin regresión funcional, (2) compatibilidad legacy de Engagement/Vertical con las 4 fases legacy verbatim (`Formulario APEX`, `Documentación`, `Entrevistas`, `Análisis de flujos y procesos`) y migración en dos pasos, (3) serving explícito de entregables publicados bajo `/publicados/[cliente]/...`. 21 decisiones cerradas (MD-1..MD-21) tras 4 rondas de revisión.
- **`ECOSISTEMA.md`** (NUEVO): documento canónico del mapa de repositorios PRISMA y sus relaciones (5 repos + servicios externos). Incluye flujos cruzados (cliente nuevo, procesar entrevista, generar entregable, evolucionar metodología, mantenimiento) y convenciones comunes. Alineado con `MODELO-DOMINIO.md`: clarificada la separación entre runtime IONOS y storage backend Drive durante Sprint A.
- **`CLAUDE.md`**: añadida sección "Ecosistema de repositorios" con resumen breve y enlace a `ECOSISTEMA.md`.
- **`REVIEW-PRISMA-APEX.md`**: actualizado tras la aprobación de `MODELO-DOMINIO.md` v4. Se cerraron C01, C02, C03 y C05; Fase 2 sigue bloqueada por C04 y el nuevo C09 (`CONTRATOS.md`); se añadieron impactos posteriores sobre `GLOSARIO.md` y `ECOSISTEMA.md`; siguiente entregable obligatorio: `CONTRATOS.md`.

## [2026-04-27] — v3.2.36

### Documentación — Revisión Prisma APEX
- **REVIEW-PRISMA-APEX.md:** Creado documento vivo de revisión para centralizar el estado de la reorganización de Prisma APEX, las decisiones cerradas, los puntos condicionales, los gates entre fases, los riesgos activos y la bitácora de revisiones. Se actualizará después de cada revisión importante y se eliminará cuando su contenido quede absorbido por la documentación permanente del proyecto.

## [2026-04-27] — v3.2.35

### Documentación — Validación catálogo ARMC
- **docs/VALIDACION-CATALOGO-ARMC.md:** Limpieza de marcas ⏳ huérfanas en el cuerpo del documento para hacerlo coherente con el resumen final ("Pendientes: 0"). 7 entradas actualizadas: 3.8 Obesidad ubicada definitivamente dentro de Medicina estética; Abdominoplastía confirmada para añadir al catálogo (Línea 1, Dr. Figueroa) en hallazgos y tabla maestra (1.16); Opción C de la Sección 2.1 (5 líneas) marcada como ✅ CONFIRMADO; 2.3 (líneas obsoletas) cerrada como N/A por implicación de 2.2; Valoración pre-cirugía (3.7 B) confirmada como gratuita en ambas citas. Leyenda actualizada (eliminado símbolo ⏳ que ya no aplica)

## [2026-04-26] — v3.2.34

### Infraestructura / DNS
- **Migración DNS a Cloudflare:** Los nameservers del dominio `prismaconsul.com` se movieron de IONOS a Cloudflare (`bruce.ns.cloudflare.com`, `cass.ns.cloudflare.com`) como requisito para configurar el subdominio custom `abbe.prismaconsul.com` (proyecto ABBE en HF Spaces)
- **Registros DNS en Cloudflare:** Recreados todos los registros necesarios — A (`prismaconsul.com`, `www`, `dev`) → `212.227.251.125`, CNAME `abbe` → `mandocc2-abbe.hf.space`, MX → Google Workspace, TXT (SPF + Google verification)
- **Fix redirect loop (301):** Cambiado modo SSL/TLS en Cloudflare de "Flexible" a "Full (Strict)" para evitar bucle infinito de redirección HTTP↔HTTPS con nginx
- **Subdominio `abbe.prismaconsul.com`:** CNAME apuntando a HF Spaces (`mandocc2-abbe.hf.space`) para el proyecto ABBE

## [2026-04-15] — v3.2.33

### Blueprint ARMC
- **modelo-datos.html:** Renombrar campo 1.28 "Oposición a uso no clínico" → "Solo comunicaciones clínicas" con descripción positiva del Derecho de Oposición ARCO (LFPDPPP). Sin cambio en conteos (260)

## [2026-04-15] — v3.2.32

### Blueprint ARMC
- **modelo-datos.html:** Cita.Canal agendamiento: texto → enum (auto) portal-paciente/equipo-interno/presencial. Auto-detectado por el sistema. Sin cambio en conteos (260/18)

## [2026-04-15] — v3.2.31

### Blueprint ARMC
- **modelo-datos.html:** Eliminar campo redundante "Confirmación: automática/manual" de Cita (cubierto por Confirmación respondida + Recordatorio enviado). Cita 19→18 campos, modelo 261→260
- **fases-implementacion.html:** Sync Cita 19→18 campos, total 261→260 (2 refs)

## [2026-04-15] — v3.2.30

### Blueprint ARMC
- **modelo-datos.html:** Cita: +2 campos (Hora inicio real, Hora fin real), +1 estado (en-consulta). Lifecycle: Confirmada → En consulta → Completada. Duración estimada auto-sugerida desde PR.10. Cita 17→19 campos
- **modelo-datos.html:** Protocolo de Revisión: +1 campo PR.10 (Duración estimada por procedimiento). PR 9→10 campos
- **fases-implementacion.html:** Sync total 258→261 campos (2 refs)
- Total modelo: 258→261 campos

## [2026-04-15] — v3.2.29

### Blueprint ARMC
- **modelo-datos.html:** Corregir total de campos 210→258. El 210 contaba secciones agrupadas como 1 campo; el 258 cuenta campos individuales reales (Paciente=164, resto=94). Referencia: historia-clinica-campos.md
- **fases-implementacion.html:** Sync total 210→258 (2 refs)

## [2026-04-14] — v3.2.28

### Blueprint ARMC
- **modelo-datos.html:** Procedimiento completado: lifecycle 5 estados, 13 campos (7 metadatos + 6 clínicos), 9 sub-campos consentimiento informado, 7 relaciones. Campos reestructurados: -7 absorbidos por Protocolo de Revisión FK, +3 nuevos (FK Protocolo, Fecha realización, Satisfacción). 214→210 campos
- **fases-implementacion.html:** Sync conteo 216→210 campos (2 refs)

## [2026-04-14] — v3.2.27

### Blueprint ARMC
- **modelo-datos.html:** Eliminar firmas testigo 1/2 de evaluación HC (solo aplican en consentimiento informado NOM-004 10.1.1). Testigos no bloqueantes con alerta en Procedimiento. 216→214 campos

## [2026-04-14] — v3.2.26

### Blueprint ARMC
- **modelo-datos.html:** Cita expandida a 17 campos (ciclo de vida, tipos, 6 campos nuevos). 216 campos totales
- **automatizaciones.html:** +3 automatizaciones D1 (reagendamientos, post-cita, no-show/cancelaciones). 25 total
- **fases-implementacion.html:** +4 ítems F1 (Cita ampliada + 3 auto). 25 automatizaciones

## [2026-04-14] — v3.2.25

### Blueprint ARMC
- **fases-implementacion.html / automatizaciones.html:** Invitación automática a crear cuenta cuando lead agenda evaluación (D1+D3). Automatizaciones 21→22, D1 7→8. Sync conteos con modelo-datos v3.2.24: 210 campos, 10 entidades, PR 9 campos
- **modelo-datos.html:** Nota informativa en sección Evaluación agendada sobre invitación automática a crear cuenta

## [2026-04-14] — v3.2.24

### Blueprint ARMC
- **modelo-datos.html:** Nueva entidad Evaluación Clínica (9 campos, 17 escalas estandarizadas en 7 categorías). Campo PR.9 (escalas clínicas aplicables) en Protocolo de Revisión (8→9 campos). Relación Paciente +1 (6→7). Stats: 10 entidades, 210 campos. D2 actualizado con Evaluación Clínica

## [2026-04-14] — v3.2.23

### Blueprint ARMC
- **modelo-datos.html:** Diferenciados 3 niveles de firma en APEX. Campo 1.27 (Aviso de privacidad) cambiado de "firma" a "aceptación digital con auditoría" (2 checkboxes separados no pre-marcados + log: timestamp, IP/dispositivo, versión del aviso). Sección Firmas digitales reemplazada: tabla de 4 firmas HC → tabla de 3 niveles (aceptación digital, autógrafa digitalizada, FEA). Tabla "3 documentos del paciente" renombrada a "3 consentimientos" con nueva columna Mecanismo que diferencia aceptación digital vs firma autógrafa. Sin cambios en firmas HC (9.7-9.10) ni consentimiento informado (10.1)

## [2026-04-14] — v3.2.22

### Blueprint ARMC
- **modelo-datos.html:** Añadido campo 1.14 Tipo de interrogatorio (auto: Directo/Indirecto) en evaluación médica. Default "Directo", el médico cambia a "Indirecto" solo si tercero proporcionó info. Buena práctica clínica, no exigido NOM-004

## [2026-04-14] — v3.2.21

### Blueprint ARMC
- **modelo-datos.html:** Corrección Continuo 21→20 campos (conteo verificado: 4 clasificación + 7 fechas + 3 contadores + 4 proceso graduado + 1 historial + 1 notas)
- **fases-implementacion.html:** F1: +3 ítems (cifrado TLS/AES-256, autenticación/MFA, backups/DRP), modelo de datos con 9 nombres de entidades, Log Auditoría NOM-004/NOM-024, retención con 5 años general, prereq protocolos con umbrales/Protocolo de Revisión. F3: confirmación respondida movida de F1 a F3. Purga con detalle leads + usuarios

## [2026-04-14] — v3.2.20

### Frontend — PRISMA Hub (Blueprint)
- **Sincronización fases-implementacion.html con modelo de datos actualizado** — F1: +5 ítems (Log de Auditoría, inmutabilidad COFEPRIS, retención diferenciada, campo Cita confirmación respondida S2, catálogos CIE-10/CBCM) + prereq Matriz Cumplimiento NOM024, 168→200 campos en 9 entidades. F2: +3 ítems (entidad Señal de Inacción 8 campos, entidad Protocolo de Revisión 8 campos, campos Paciente proceso graduado). F3: +1 ítem (campos Comunicación newsletter + secuencia sin abrir S6). Total: 50→59 ítems

## [2026-04-13] — v3.2.19

### Frontend — PRISMA Hub (Blueprint)
- **Sincronización modelo-datos.html — 6 gaps resueltos** — 3 entidades nuevas: Señal de Inacción (8 campos, D2+D3, registro individual por señal S1-S8), Protocolo de Revisión (8 campos, D2, umbrales por procedimiento para proceso graduado), Log de Auditoría (9 campos, D1, append-only NOM-024). Paciente: 4 campos nuevos en Continuo (fase proceso graduado, fecha inicio fase, señales activas count, último tipo procedimiento) + 6ª relación (Señales de Inacción). Cita: +1 campo (confirmación respondida → S2). Comunicación: +2 campos (es newsletter, secuencia sin abrir → S6). Procedimiento: +relación Protocolo de Revisión. Stats: 6→9 entidades, 168→200 campos. Cobertura D1-D4 actualizada. NOM-024 referencia Log de Auditoría. Nota final con ecosistema §5B + §5B-2

## [2026-04-13] — v3.2.18

### Frontend — PRISMA Hub (Blueprint)
- **Actualización fases-implementacion.html** — Stats: automatizaciones 12→21. F1 expandida 8→19 ítems (lifecycle, 168 campos, IDs HC, firma digital, RBAC, NOM-004/024, LFPDPPP, 7 automáticos). F2 expandida 7→13 ítems (clasificación conductual A/B/C, 8 señales inacción, niveles riesgo, proceso graduado, 5 automáticos). F3 actualizada 6→8 ítems (canal switching, aviso privacidad LFPDPPP, 4 automáticos). F4 actualizada 6→10 ítems (13 fuentes, señales S1/S5/S6, 5 automáticos). Nota final con decisiones pendientes ARMC

## [2026-04-13] — v3.2.17

### Frontend — PRISMA Hub (Blueprint)
- **Actualización flujos-to-be.html** — Atención al Paciente: flujo lifecycle completo (Lead→Usuario→Evaluación→Paciente) con señales S2/S3 y aviso LFPDPPP. Cirujano: firma digital, HC inmutable NOM-004, addendum COFEPRIS, RBAC. Community Manager: aviso privacidad, canal switching S5, ajuste segmentación S6. Director: 25 KPIs, embudo completo, señales N1/N2, proceso graduado. Primer Ayudante/Cosmiatra/Tricóloga: notas RBAC. Stats: automatizaciones 12→21. Nota final añadida

## [2026-04-13] — v3.2.16

### Frontend — PRISMA Hub (Blueprint)
- **Actualización automatizaciones.html de 12 a 21** — 7 sin cambios, 4 modificadas (Confirmación citas +S2+Director, Clasificación pacientes nuevo trigger/acción conductual, Alerta inactivo → Proceso graduado 4 fases, Campaña reactivación nuevo trigger/acción), 1 con nota menor (Captura leads +nota API WhatsApp), 9 nuevas (D1: transición ciclo vida + verificación pre-consulta + purga LFPDPPP; D2: motor señales inacción + alertas nivel riesgo; D3: aviso privacidad; D4: seguimiento post-evaluación S1 + canal switching S5 + ajuste segmentación S6). Nueva sección "Sistema de Señales de Inacción" con tabla de 8 señales y diagrama de niveles de riesgo

## [2026-04-13] — v3.2.15

### Frontend — PRISMA Hub (Blueprint)
- **Actualización kpis-objetivo.html de 13 a 25 KPIs** — 9 sin cambios, 4 modificados (Pacientes clasificados nueva desc, Tasa de retención → Tasa de recurrencia, Pacientes reactivados → Efectividad de reactivación, Tasa de conversión nueva desc), 12 nuevos distribuidos en D1-D4. Nueva sección "Relación entre KPIs" con tabla de enriquecimiento. Nota final actualizada

### Infraestructura — SSL Dev
- **Configurado SSL para dev.prismaconsul.com** — Certificado Let's Encrypt con certbot. Antes, HTTPS caía en producción. Renovación automática vía certbot.timer. Caduca 12 julio 2026

## [2026-04-13] — v3.2.14

### Frontend — PRISMA Hub (Blueprint)
- **Reescritura completa modelo-datos.html** — Entidad Paciente con ciclo de vida de 4 etapas (Lead → Usuario → Evaluación agendada → Paciente), 168 campos organizados por 6 fases, 8 nuevas secciones regulatorias/técnicas (RBAC, firmas digitales, inmutabilidad, COFEPRIS, NOM-024, retención de datos), eliminación de entidad Lead (integrada en Paciente)

### Infraestructura — SSL Dev
- **Configurado SSL para dev.prismaconsul.com** — Certificado Let's Encrypt instalado con certbot. Antes, `https://dev.prismaconsul.com` caía en el bloque SSL de producción y servía archivos de main. Ahora sirve correctamente los archivos de dev. Renovación automática vía `certbot.timer` (2 ejecuciones/día). Caduca 12 julio 2026 (se renueva solo ~30 días antes)

## [2026-04-10] — v3.2.13

### Frontend — PRISMA Hub
- **Fix padding lateral en contenedores** — restaurado padding 1rem con width:100% y box-sizing:border-box. Los tabs de usuario no tienen panel-main, así que los contenedores necesitan su propio padding. Inputs ahora llenan todo el ancho con margen lateral correcto

## [2026-04-10] — v3.2.12

### Frontend — PRISMA Hub
- **Fix containers width** — todos los contenedores internos (profile, apex, entrevistas, análisis) ahora tienen `width: 100%` explícito para que se expandan correctamente dentro de los flex tabs. Corrige los inputs de Datos personales que no ocupaban el ancho completo

## [2026-04-10] — v3.2.11

### Frontend — PRISMA Hub
- **Perfil usuario responsive** — inputs de datos personales ahora ocupan 100% del ancho en móvil, contenido visible sin truncar (empresa, email, dirección, etc.)

## [2026-04-10] — v3.2.10

### Frontend — PRISMA Hub
- **Tabs como cajas en móvil** — las pestañas ahora se muestran como botones/cajas con fondo, borde y fondo cyan semitransparente en la activa, dentro de un contenedor con fondo oscuro y bordes redondeados. Mucho más claro visualmente que las tabs planas anteriores

## [2026-04-10] — v3.2.9

### Frontend — PRISMA Hub
- **Tabs responsive grid 2x2** — en móvil las pestañas (Dashboard/Usuarios y Perfil y proceso/Documentos/Formulario APEX/Análisis) pasan de scroll horizontal a cuadrícula 2x2 para que todas sean visibles sin deslizar. Nombres de archivo ahora hacen word-break en lugar de truncarse

## [2026-04-10] — v3.2.8

### Frontend — PRISMA Hub
- **Responsive completo** — corregido detalle de usuario para móviles: header con "Ver como cliente" a ancho completo, campos de perfil apilados verticalmente (label arriba, valor abajo), inputs al 100%, avatar reducido. También: staging items adaptables, dropzone compacta, users grid 1 columna, viewer de análisis compacto, botones wrap en 480px

## [2026-04-10] — v3.2.7

### Frontend — PRISMA Hub
- **Dashboard responsive** — corregido el dashboard admin para móviles: pipeline de clientes apila avatar+nombre arriba y dots de fases abajo, filas de actividad reciente se ajustan sin desbordamiento, stats y user cards admin compactos en pantallas pequeñas

## [2026-04-10] — v3.2.6

### Frontend — PRISMA Hub
- **Responsive/móvil** — reescritura completa de media queries para que PRISMA Hub sea usable en móviles: header reducido (60px→50px), logo escalado, botón logout más compacto, paddings reducidos, grid de análisis adaptativo (4→2→1 columna), tabs con scroll horizontal, tarjetas de usuario y archivos compactas, modales a pantalla completa en 480px, inputs al 100% de ancho

## [2026-04-10] — v3.2.5

### Frontend — Análisis de flujos (ARMC)
- **CEO/Dirección** — eliminado vacío pendiente "Volumen real de ventas y métricas de productos"

## [2026-04-10] — v3.2.4

### Frontend — Análisis de flujos (ARMC)
- **Tricología** — eliminados 10 vacíos pendientes (herramienta de agendamiento, pacientes no-show, coordinación con Gabriel, autonomía en precios, almacenamiento de contactos, herramienta PDFs, control de inventario, respaldo de fotos, propiedad del iPad, volumen control de peso)

## [2026-04-10] — v3.2.3

### Frontend — Análisis de flujos (ARMC)
- **Primer Ayudante** — eliminados 3 vacíos pendientes: proporción valoraciones Divani vs Maricela, proporción procedimientos Divani vs Gabriel, aceptación del paciente

## [2026-04-10] — v3.2.2

### Frontend — Análisis de flujos (ARMC)
- **Cosmiatra** — eliminado vacío pendiente "Historia estética separada" (confirmado: HC única para todos, no existe historia estética separada)

## [2026-04-10] — v3.2.1

### Frontend — Landing page
- **Fix sección contacto en pantallas altas** — la sección de contacto no se mostraba en monitores grandes porque la sección Nosotros (450vh) nunca salía completamente del viewport, dejando activos los elementos fijos (tarjeta de equipo, overlay de cierre) que tapaban el formulario. Ajustado el umbral de `sectionInViewport` y el trigger de reveal del contacto.
- **Cache bust main.js** — actualizado query string a v130 para forzar recarga del JS

### Frontend — Análisis de flujos (ARMC)
- **Cirujano** — eliminado vacío pendiente "Volumen exacto de procedimientos por semana" (no relevante)
- **Enfermero** — movido vacío "Las tres agendas — formato y gestión" de pendiente a resuelto (formato es físico)
- **Scrollbar unificado** — aplicado scrollbar PRISMA (cyan, 6px) en todas las páginas de análisis (diagnóstico y blueprint)

## [2026-04-04] — v3.2.0

### Frontend — PRISMA Hub (portal completo)
- **5 pestañas de cliente** — Formulario APEX, Datos personales, Documentos, Entrevistas, Análisis de flujos y procesos
- **Formulario APEX** — visualización de resultados vinculados al usuario (empresa, dolores aceptados/rechazados, plan)
- **Datos personales** — edición de perfil por el propio usuario, vista de solo lectura para admin
- **Documentos** — subida con título descriptivo obligatorio, nomenclatura sistemática automática (`prefijo_001.pdf`)
- **Entrevistas** — pestaña dedicada que filtra archivos con `doc_type = 'entrevista'`
- **Análisis** — placeholder para web en construcción
- **Código y nombre separados** — el código de archivo (ej. `armc_001.pdf`) se muestra como etiqueta cyan no editable, el nombre descriptivo es editable
- **Admin: detalle de usuario con 4 sub-pestañas** — Perfil y proceso, Documentos (con subida), Formulario APEX, Análisis
- **Admin: "Ver como cliente"** — vista de solo lectura del portal desde la perspectiva del cliente
- **Enlace PRISMA Hub en navegación** — acceso directo desde el menú principal de la web

### Backend
- **GET /api/portal-apex-results** — devuelve resultados APEX vinculados al usuario (soporta `?userId=X` para admin)
- **GET /api/portal-profile** — datos de perfil del usuario (soporta `?userId=X` para admin)
- **PATCH /api/portal-profile** — edición de perfil por el propio usuario (campos limitados, sin role/phase)
- **Upload mejorado** — `display_name` almacena título descriptivo, `file_name` almacena nombre sistemático, `drive_file_id` almacena ID real de Google Drive
- **Rename** — solo actualiza `display_name` en BD, no modifica el nombre en Drive

### Base de datos
- Columna `display_name` en `portal_files` para nombre descriptivo
- Columna `apex_submission_id` en `portal_users` para vincular resultados APEX
- 46 archivos migrados a nomenclatura sistemática (`prefijo_secuencia.ext`)
- Nombres descriptivos recuperados desde `originalFilename` de Google Drive

---

## [2026-04-02] — v3.1.0

### Backend
- **Sistema de roles** — campo `role` en `portal_users` (admin/user), middleware `requireAdmin`
- **Propiedad de archivos** — cada usuario tiene su subcarpeta en Google Drive (`user_{id}/`), tabla `portal_files` para rastreo
- **Log de actividad** — tabla `portal_activity_log` registra login, upload, delete, rename, user_created
- **Rutas admin** — `GET /api/portal-users`, `POST /api/portal-users`, `GET /api/portal-activity` (protegidas con requireAdmin)
- **Scoping de archivos** — usuarios solo ven/modifican sus propios archivos, admin puede ver todos

### Frontend
- **PRISMA Hub** — renombrado de "Portal de Documentos", ruta `/hub` en vez de `/documentacion`
- **Pestañas** — Documentos (todos), Usuarios (admin), Actividad (admin)
- **Vista "como usuario"** — admin puede seleccionar un cliente y ver su espacio de documentos
- **Crear usuarios** — modal para que admin cree nuevos perfiles de clientes
- **Log de actividad** — tabla cronológica con badges de color por tipo de acción

### Base de datos
- Migración: columnas `role` y `drive_folder_id` en `portal_users`
- Nuevas tablas: `portal_files`, `portal_activity_log`
- 46 archivos existentes migrados a subcarpeta del admin

### Infraestructura
- nginx actualizado: `/documentacion` → `/hub`

---

## [2026-03-28] — v3.0.1

### Seguridad
- **nodemailer** 6.10.1 → 8.0.4 — Corrige inyección de comandos SMTP, envío a dominios no intencionados, y DoS por parser de direcciones
- **path-to-regexp** 0.1.12 → 0.1.13 — Corrige denegación de servicio (ReDoS) por parámetros de ruta malformados

### Infraestructura
- Configurado **Dependabot** (`.github/dependabot.yml`) — monitoreo automático semanal de dependencias con notificaciones vía GitHub PR

### Frontend
- Añadido número de versión (`v3.0.1`) en el footer de la landing page

### Repositorio
- Implementado versionado semántico (SemVer) con instrucciones en CLAUDE.md
- Creado CHANGELOG.md para registro obligatorio de cambios
- Verificado y validado como repositorio independiente funcional (servidor arranca, rutas API responden, archivos estáticos se sirven, todas las variables de entorno presentes)
