# Changelog

Registro de cambios relevantes del proyecto PRISMA Consul.

## [2026-05-07] — v3.3.47

### Absorción del cuarto bloque de contenido del carril 2 (modelo de datos ARMC: refactor Diagnóstico y plan + Protocolo de Revisión + Terapéutica → Cita)

Cuarto paquete operativo de absorción de contenido del carril 2 sobre la base canónica `chore/fase2-contenido-base-v3.3.46` (abierta tras `v3.3.46`). Cherry-pick lineal con trazabilidad `-x` de **5 SHAs** desde `8f6592f` hasta `d59af80`. Todos tocan únicamente `prisma-apex/clientes-publicados/armc/blueprint/modelo-datos.html`. **Sin tocar backend, BD, nginx ni PM2.**

#### Bloque temático absorbido

- **Refactor "Diagnóstico y plan" (Paciente):** elimina 3 campos no aplicables; `Terapéutica` pasa a lista dinámica multi-línea.
- **Correctivo del refactor:** atiende dos hallazgos del revisor sobre catálogo y cirugía mayor.
- **Protocolo de Revisión — catálogo:** se puebla la tabla del blueprint con el catálogo confirmado (5 líneas + procedimientos).
- **Terapéutica → Cita:** la Terapéutica genera Cita en el momento de la evaluación con agendamiento embebido (`Operador`, `Fecha`, `Hora`).
- **Renombrado de rol:** "Médico responsable" → "Profesional asignado" en la nota Terapéutica → Cita.

Balance neto del bloque: total de campos pasa de `312` a `314` (cabecera y nota de cierre alineadas).

#### Commits absorbidos (cherry-pick `-x`, orden cronológico)

| Origen carril 2 | Resultado en `dev` | Asunto corto |
|---|---|---|
| `8f6592f` | `1e7e91b` | Refactor 'Diagnóstico y plan' (-3 campos + Terapéutica lista dinámica) |
| `b92da1a` | `30af4dd` | Correctivo sobre 8f6592f (catálogo + cirugía mayor) |
| `49d4d21` | `4c2e9ba` | Protocolo de Revisión — catálogo (5 líneas + procedimientos) |
| `59819e3` | `0587465` | Terapéutica → Cita: agendamiento embebido (Operador, Fecha, Hora) |
| `d59af80` | `3ed411e` | Médico responsable → Profesional asignado |

Diff total: 1 archivo, **+24 / -8 líneas** acumuladas en `prisma-apex/clientes-publicados/armc/blueprint/modelo-datos.html`.

#### Validación

- Paridad con punta v346 (`d59af80`) tras los 5 cherry-picks: byte-a-byte equivalente (`diff -q` vacío).
- Sanity HTML: balance `<script>`/`</script>` 2/2 idéntico a la base.
- Coherencia interna: cabecera (L46) y nota de cierre del documento ambas en `314` — sin desviación respecto a la fuente aprobada.
- Trazabilidad: cada commit conserva el footer `(cherry picked from commit …)`.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

#### Lo que NO entra en este slice

- Sin tocar backend, BD, PM2 ni nginx.
- Sin abrir limpieza adicional fuera de `modelo-datos.html`.
- Sin tocar el worktree v346 (`web-de-prisma-carril-contenido-v346`); queda como respaldo hasta cerrar verificación visual en DEV.
- Sin promoción a `main`; solo publicación a `dev`. Promoción sujeta a PASS visual humano.
- Sin abrir el siguiente frente del ejecutor 2 hasta cerrar absorción + deploy DEV + validación pública.

## [2026-05-07] — v3.3.46

### Absorción del tercer bloque de contenido del carril 2 (modelo de datos ARMC: contacto de emergencia + re-anclaje fotos clínicas + redacción 10.2/10.3)

Tercer paquete operativo de absorción de contenido del carril 2 sobre la base canónica `chore/fase2-contenido-base-v3.3.45` (abierta tras `v3.3.45`). Cherry-pick lineal con trazabilidad `-x` de **3 SHAs** desde `3079af6` hasta `1b6d6d2`. Todos tocan únicamente `prisma-apex/clientes-publicados/armc/blueprint/modelo-datos.html`. Se añade un commit propio del carril repo para alinear la cabecera del documento con la nota de cierre. **Sin tocar backend, BD, nginx ni PM2.**

#### Bloque temático absorbido

- **Renombrado de campo en Paciente:** `Familiar responsable` → `Contacto de emergencia`.
- **Re-anclaje de fotos clínicas:** vinculación de fotos a `Procedimiento` + `Línea de servicio` (en lugar de `Evaluación médica`); refleja el flujo real donde las fotos pertenecen al procedimiento, no a la evaluación inicial.
- **Alineación de redacción 10.2 / 10.3 (Procedimiento):** ajusta la formulación de subentidades a la nueva semántica.

El re-anclaje de fotos reduce el conteo total de campos de `313` a `312` por la pérdida del campo en Evaluación Médica que pasa al ámbito de Procedimiento sin duplicarse.

#### Commits absorbidos (cherry-pick `-x`, orden cronológico)

| Origen carril 2 | Resultado en `dev` | Asunto corto |
|---|---|---|
| `3079af6` | `d4d1c95` | Familiar responsable → Contacto de emergencia |
| `af759bf` | `cfda2ab` | Re-anclar fotos clínicas a Procedimiento + Línea de servicio |
| `1b6d6d2` | `49f6789` | Alinear redacción 10.2 / 10.3 a formulación nueva |

#### Patch propio del carril repo

- `2bbe0dc` content(modelo-datos): alinear cabecera "Campos definidos" 313 → 312 con la nota de cierre. Cierra una inconsistencia interna detectada tras la absorción: el bloque del carril 2 ajustó la nota de cierre del documento a `312 campos` pero no actualizó la cabecera, que seguía mostrando `313`. Este commit restaura la coherencia que el slice `v3.3.45` había establecido entre ambos puntos del documento.

Diff total: 1 archivo, **+17 / -14 líneas** acumuladas en `prisma-apex/clientes-publicados/armc/blueprint/modelo-datos.html`.

#### Validación

- Paridad con punta v345 (`1b6d6d2`) tras los 3 cherry-picks: byte-a-byte equivalente (`diff -q` vacío).
- Sanity HTML: balance `<script>`/`</script>` 2/2 idéntico a la base.
- Coherencia interna post-patch propio: cabecera (L46) y nota de cierre ambas en `312`.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

#### Lo que NO entra en este slice

- Sin tocar backend, BD, PM2 ni nginx.
- Sin abrir limpieza adicional fuera de `modelo-datos.html`.
- Sin tocar el worktree v345 (`web-de-prisma-carril-contenido-v345`); queda como respaldo hasta cerrar verificación visual en DEV.
- Sin promoción a `main`; solo publicación a `dev`.
- Sin reactivar al ejecutor 2 ni decidir frente siguiente — pendiente tras validación visual humana.

## [2026-05-07] — v3.3.45

### Patch correctivo de coherencia en modelo-datos.html (total de campos + redacción de captura de fotos)

Micro-slice de carril repo. **Sin reabrir Paciente para más modelado**; cierra incoherencias arrastradas tras la absorción del segundo bloque (`v3.3.44`).

#### Correcciones

- `prisma-apex/clientes-publicados/armc/blueprint/modelo-datos.html` línea 46 (cabecera del documento, contador "Campos definidos"): `260` → `313`.
- `prisma-apex/clientes-publicados/armc/blueprint/modelo-datos.html` línea 812 (nota de cierre): `Documento de referencia — 260 campos en 10 entidades` → `Documento de referencia — 313 campos en 10 entidades`.
- `prisma-apex/clientes-publicados/armc/blueprint/modelo-datos.html` línea 256 (campo "Fotos iniciales estandarizadas" de Paciente): se sustituye la coletilla fuerte de fotos por una redacción suavizada que separa flujo clínico (no depende de copias permanentes en galería o dispositivo personal) de detalles de persistencia local temporal (dependientes de la plataforma de captura). Mantiene la referencia a la sección "Captura de fotografías clínicas".

El total `313` resulta del conteo actual de las 10 entidades: Paciente 215, Cita 18, Procedimiento 13, Inventario 10, Comunicación 11, Documento 9, Señal de Inacción 8, Protocolo de Revisión 11, Log de Auditoría 9, Evaluación Clínica 9.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

#### Lo que NO entra en este slice

- Sin tocar backend, BD, PM2 ni nginx.
- Sin reabrir el bloque Paciente para añadir/quitar/modificar campos; este slice cierra incoherencias, no modela.
- Sin promoción a `main` en este slice — solo publicación a `dev`.

## [2026-05-06] — v3.3.44

### Absorción del segundo bloque de contenido del carril 2 (modelo de datos ARMC, expansión Paciente + Protocolo Revisión + Bloqueo HC)

Segundo paquete operativo de absorción de contenido del carril 2 sobre la base canónica `chore/fase2-contenido-base-v3.3.43` (abierta tras `v3.3.43`). Cherry-pick lineal con trazabilidad `-x` de **14 SHAs** desde `5e9f67c` hasta `5f882df` en una sola pasada. Todos tocan únicamente `prisma-apex/clientes-publicados/armc/blueprint/modelo-datos.html`. **Sin tocar backend, BD, nginx ni PM2.** Cambio puramente de contenido del modelo de datos ARMC; contratos visibles intactos.

#### Bloque temático absorbido

- **Domicilio binacional:** descomposición de `Domicilio` en campos separados con `País` (modelo binacional mínimo).
- **Identidad clínica:** `Originario` → `Nacionalidad` como selección binacional; `Fototipo Fitzpatrick` como selector visual con muestras de color.
- **Fotos clínicas:** captura nativa declarada como mecanismo del sistema; alineación con entidad `Procedimiento`; en `Protocolo de Revisión` placeholder *"Sets de fotografías por momento"* (Opción B).
- **Antecedentes ampliados:** 11 campos validados contra HC papel ARMC; granularización de `Exploración física`; `Enfermedades previas` como lista dinámica; refinado de 8 sistemas de revisión.
- **Plantillas de consentimiento:** consentimiento informado en iPad/tablet con autofill desde sistema.
- **Regla de bloqueo HC + COFEPRIS:** doble firma post-evaluación; visualización destacada; banners clarificados — la firma inmoviliza también los antecedentes.
- **Higiene visual:** sustitución de 7 iconos unicode introducidos en slices previos por Phosphor.

#### Commits absorbidos (cherry-pick `-x`, orden cronológico)

| Origen carril 2 | Resultado en `dev` | Asunto corto |
|---|---|---|
| `5e9f67c` | `b24d5d2` | Domicilio campos separados + País |
| `95b1ccb` | `8b8527d` | Domicilio binacional mínimo (corrección) |
| `f54d01e` | `c257d8a` | Fototipo Fitzpatrick selector visual |
| `484cb5c` | `86a73d9` | Captura nativa fotos clínicas |
| `1a66810` | `f9c8978` | 11 campos validados HC papel |
| `f098d77` | `3a30586` | Correctivo captura fotos + Procedimiento |
| `13ba3de` | `3e0d600` | Sets de fotografías por momento (Opción B) |
| `31c6337` | `ec3c3aa` | Contraste HC papel — 3 campos + 8 sistemas |
| `f11d8c7` | `ad2b55e` | Exploración física granular + Enfermedades dinámicas |
| `4ad1cd9` | `fedfc3f` | Plantillas consentimiento iPad/tablet |
| `56a4e00` | `798db0c` | Originario → Nacionalidad binacional |
| `4e13ffe` | `385d434` | Bloqueo HC + doble firma post-evaluación |
| `9481f53` | `0017824` | Sustituir 7 iconos unicode por Phosphor |
| `5f882df` | `c1c6ed5` | Banners de bloqueo HC clarificados |

Diff total: 1 archivo, **+161 / -50 líneas** acumuladas en `prisma-apex/clientes-publicados/armc/blueprint/modelo-datos.html`.

#### Paridad y validación

- Validación directa: archivo final en carril repo **byte-a-byte equivalente** al de la punta del worktree v343 (`5f882df`). `diff -q` sin diferencias.
- Sanity HTML mínimo: balance de `<script>`/`</script>` (2/2) idéntico a la base `36f9953`.
- Trazabilidad: cada commit conserva el footer `(cherry picked from commit …)` apuntando al SHA original del carril contenido.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

#### Lo que NO entra en este slice

- Sin tocar backend, BD, PM2 ni nginx.
- Sin abrir limpieza adicional fuera de `modelo-datos.html` (se respeta scope estricto: limpieza preexistente de unicode en otros archivos no entra aquí).
- Sin tocar el worktree v343 (`web-de-prisma-carril-contenido-v343`); queda como respaldo hasta cerrar verificación visual en DEV.
- Sin promoción a `main` hasta validación visual humana en `dev.prismaconsul.com`.
- Sin tocar el worktree viejo `prisma-carril-contenido-next` ni la rama `chore/fase2-contenido-base-v3.3.24` (referencia respaldada en `origin`).
- Sin reactivar al ejecutor 2 — sigue como pendiente operativo separado.

## [2026-05-06] — v3.3.43

### Absorción canónica del primer port de contenido del carril 2 (modelo de datos ARMC)

Primer paquete operativo de absorción de contenido tras el cierre de Sprint A. Cherry-pick lineal con trazabilidad `-x` de tres SHAs emitidos por el carril contenido sobre la nueva base canónica (`chore/fase2-contenido-base-v3.3.42`, abierta en el slice anterior). Todos tocan únicamente el archivo canónico vivo `prisma-apex/clientes-publicados/armc/blueprint/modelo-datos.html`. **Sin tocar backend, BD, nginx ni PM2.** Cambio puramente de contenido del modelo de datos ARMC; contratos visibles intactos.

#### Commits absorbidos (cherry-pick `-x`)

- `1cac771` → `6029b29`: `content(modelo-datos/Paciente): tipar 6 campos como selección explícita`
- `fe9c3d1` → `a91c6a5`: `content(modelo-datos/Documento): tipar Tipo y Estado + promover FK Procedimiento`
- `e38c020` → `6e2a9cd`: `content(modelo-datos/Señal de Inacción): tipar Tipo / Estado / Canal respuesta como selección explícita`

Diff total: 1 archivo, +10 / -10 líneas en `prisma-apex/clientes-publicados/armc/blueprint/modelo-datos.html`.

#### Trazabilidad

Cada commit absorbido conserva el footer `(cherry picked from commit …)` apuntando al SHA original del carril contenido. La rama de origen `chore/fase2-contenido-base-v3.3.42` queda respaldada en `origin` como referencia auditable.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

#### Cierre operativo

- **Push a `origin/dev`:** SHA local `cce789e5f7df1ca106f39b438a6c00210ce2aacc` publicado (`2549695..cce789e`).
- **Deploy DEV validado:** `~/web-de-prisma-dev` actualizado a `cce789e`; `prisma-dev` reiniciado; `dev.prismaconsul.com/` y `/hub` sirven `v3.3.43`; blueprint canónico `https://dev.prismaconsul.com/publicados/armc/blueprint/modelo-datos.html` accesible (HTTP 200).
- **Promoción fast-forward `dev` → `main`:** `main` y `origin/main` promovidos a `cce789e` (`2549695..cce789e`). Carpeta principal local devuelta a `dev` limpia.
- **Deploy PROD validado:** `~/web-de-prisma` del VPS actualizado a `cce789e`; `prisma-consul` reiniciado; `prismaconsul.com/` y `prismaconsul.com/hub` sirven `v3.3.43`; blueprint canónico `https://prismaconsul.com/publicados/armc/blueprint/modelo-datos.html` accesible (HTTP 200) con `Last-Modified: Wed, 06 May 2026 09:53:15 GMT` (timestamp del cherry-pick reciente). Marcadores `Paciente`/`Documento`/`Señal de Inacción` presentes (27 ocurrencias). `prisma-dev` y nginx no tocados.
- **SHA final en producción:** `cce789e5f7df1ca106f39b438a6c00210ce2aacc`. Cuatro refs (`dev`, `origin/dev`, `main`, `origin/main`) y `HEAD` PROD alineados.

#### Lo que NO entra en este slice

- Sin tocar backend, BD, PM2 ni nginx.
- Sin abrir slices de limpieza documental stale post-Fase-2 (MODELO-DOMINIO, CONTRATOS, REGISTRO-RUTAS) — pendientes para slice posterior.
- Sin borrar ramas locales: la rama vieja del carril contenido (`chore/fase2-contenido-base-v3.3.24`) ni las 9 ramas locales `chore/*` ya absorbidas hace tiempo en `dev`/`main`; todas quedan pendientes para un slice diferido de limpieza de ramas.
- Sin tocar el worktree huérfano `web-de-prisma-coordinacion.0tTOVc`.
- Sin reactivar al ejecutor 2 — sigue como pendiente operativo separado.

## [2026-05-05] — Consolidación documental post-Sprint A: archivado a `docs/historico/sprint-a/` (sin bump)

### Movimiento físico de documentación de coordinación, Variante B y validación a histórico

Tras la declaración formal de cierre de Sprint A (entrada inmediatamente posterior), se consolida la documentación ya ejecutada moviéndola físicamente al subdirectorio `docs/historico/sprint-a/` con marca visible al inicio de cada archivo. **Slice estrictamente documental**: sin tocar código, runtime, PM2, nginx ni BD; sin bump de versión visible.

#### Archivados a `docs/historico/sprint-a/`

- `docs/PLAN-COORDINACION-PRE-FASE2.md` → `docs/historico/sprint-a/PLAN-COORDINACION-PRE-FASE2.md`
- `docs/PLAN-FASE2.md` → `docs/historico/sprint-a/PLAN-FASE2.md`
- `docs/ANALISIS-ALTERNATIVAS-INFRA-SUBPASO-2.1.md` → `docs/historico/sprint-a/ANALISIS-ALTERNATIVAS-INFRA-SUBPASO-2.1.md`
- `docs/RUNBOOK-EJECUTOR-VARIANTE-B-SUBPASO-2.1.md` → `docs/historico/sprint-a/RUNBOOK-EJECUTOR-VARIANTE-B-SUBPASO-2.1.md`
- `docs/VALIDACION-BLOQUE-B-REGISTRO-RUTAS.md` → `docs/historico/sprint-a/VALIDACION-BLOQUE-B-REGISTRO-RUTAS.md`
- `docs/REPORTE-BLOQUE-B-REGISTRO-RUTAS.md` → `docs/historico/sprint-a/REPORTE-BLOQUE-B-REGISTRO-RUTAS.md`

Cada uno lleva ahora un banner explícito al inicio que lo identifica como documento histórico de Sprint A, indicando que las referencias internas reflejan el estado en el momento de redacción y no se actualizan al nuevo path.

#### Cambios en raíz

- `REVIEW-PRISMA-APEX.md`: pasa a **bitácora cerrada / no panel vivo**. Se añade banner bajo el título declarando el cierre, una línea bajo §3 que congela el estado global, y una nota de "Cierre de uso operativo" al final de §13. Las secciones 7 y 9 quedan intactas y congeladas en su estado de cierre — limpieza fina diferida a un slice posterior. Las tres referencias vivas del dictamen apuntan al nuevo path; las referencias de la bitácora histórica quedan como están (registro del momento).
- `CLAUDE.md`: una sola referencia viva actualizada — `docs/PLAN-COORDINACION-PRE-FASE2.md` → `docs/historico/sprint-a/PLAN-COORDINACION-PRE-FASE2.md`.
- `CHANGELOG.md`: entrada nueva (esta) separada del cierre operativo post-`v3.3.42`. Las entradas históricas previas no se reescriben — describen el estado en el momento de redacción.

#### Nuevo

- `docs/historico/README.md`: índice del histórico con enlaces internos al subdirectorio `sprint-a/` y nota explícita de que estos documentos no dirigen trabajo en curso.

#### Lo que NO entra en este slice

- No se mueven los documentos permanentes vivos en raíz: `CLAUDE.md`, `MODELO-DOMINIO.md`, `CONTRATOS.md`, `GLOSARIO.md`, `ECOSISTEMA.md`, `NOMENCLATURA.md`, `GUIA-NUEVAS-SECCIONES.md`.
- No se abre Sprint B.
- No se rediseña storage ni arquitectura.
- No se reactiva al ejecutor 2 — queda fijado como **siguiente paso autorizado** pero sin ejecutar dentro de este slice.
- No se hace limpieza masiva de §7 ni §9 de `REVIEW-PRISMA-APEX.md` — basta el banner de cierre.

#### Pendiente único restante

- Reactivación del ejecutor 2, sujeta a autorización específica.

## [2026-05-05] — Declaración formal de cierre de Sprint A (sin bump)

### Cierre de etapa y reclasificación de pendientes

Se declara cerrado el objetivo técnico y operativo de la reorganización Sprint A del repo `web-de-prisma`.

- La base actual queda considerada estable y funcional en su alcance vigente: web pública, Hub, discovery, serving, contratos visibles y paquete `v3.3.42` validado en dev y producción.
- Los pendientes remanentes se reclasifican como trabajo posterior no bloqueante del cierre base: reactivación del ejecutor 2, diseño detallado de Sprint B y decisiones operativas de negocio ARMC.
- Sin cambio de versión visible.

## [2026-05-05] — Cierre operativo post-v3.3.42 (sin bump)

### Cierre del paquete `v3.3.42`: push, deploy DEV, higiene checkout PROD, promoción main + deploy PROD

- **Push a `origin/dev`:** commit `f7d335d4ee39136c9a0e0394d29a2dd578955527` publicado en `origin/dev`.
- **Deploy DEV validado:** `prisma-dev` reiniciado; `dev.prismaconsul.com/` y `/hub` sirven `v3.3.42` ✓.
- **Higiene checkout PROD (`~/web-de-prisma`):** vestigio `images/datos.mp4` eliminado tras verificar SHA256 idéntico al canónico `web/images/videos/datos.mp4` (`7729ab6a…`); `git status` limpio. Sin impacto público: `https://prismaconsul.com/images/videos/datos.mp4` → 200, `https://prismaconsul.com/images/datos.mp4` → 404.
- **Promoción fast-forward `dev` → `main`:** `main` y `origin/main` promovidos por fast-forward a `f7d335d4`. Carpeta principal local devuelta a `dev` limpia.
- **Deploy PROD validado:** `~/web-de-prisma` del VPS actualizado a `f7d335d4`; `prisma-consul` reiniciado; `prismaconsul.com/` y `prismaconsul.com/hub` sirven `v3.3.42` ✓. `prisma-dev` y nginx no tocados.
- Sin cambio de versión visible adicional.
- Pendiente restante: reactivación del ejecutor 2, sujeta a autorización específica.

## [2026-05-05] — v3.3.42

### Cableado mínimo de `domain-sync.js` en los PATCH de portal (sincronización atómica)

Primer paquete operativo posterior al cierre de los 9 subpasos físicos de Fase 2. Slice **estrecho** sobre carril repo: implementa la lógica efectiva de `syncLegacyUserUpdate` en `server/lib/domain-sync.js` (skeleton desde 2.7) y la cablea en los dos únicos endpoints que escriben campos legacy: `PATCH /api/portal-profile` y `PATCH /api/portal-users/:id`. **Contrato externo intacto** (CT-4): mismo body aceptado, mismo shape de respuesta, mismos códigos HTTP, mismos `activity_log` actions. **Sin tocar esquema de Neon.**

#### `server/lib/domain-sync.js` — `syncLegacyUserUpdate` cableado

1. **Toda la lógica vive dentro de la transacción** — no hay lectura previa de `cliente_id` / `active_engagement_id` antes del `BEGIN`. El array de queries se construye según los flags `hasEmpresarial` y `hasFaseCanon` derivados del body, y los UPDATE a `clientes` y `engagements` resuelven el target con un subquery contra `portal_users` **dentro de la misma transacción**:
   - **`UPDATE portal_users`** siempre (regla MD-21: legacy convive con canónico). Semántica COALESCE: solo se tocan los campos cuyo valor es `!== undefined`.
   - **`UPDATE clientes`** si hay al menos un campo de `FIELDS_EMPRESARIALES` en el body. Mapeo: `empresa`→`clientes.nombre`; `rfc/direccion/ciudad/cp/telefono/sector` 1:1. Filtro: `WHERE id = (SELECT cliente_id FROM portal_users WHERE id = $userId)` — si el usuario no existe o no tiene `cliente_id`, el subquery devuelve `NULL` y el UPDATE no afecta filas.
   - **`UPDATE engagements`** si hay `current_phase` o `apex_submission_id` en el body. Mapeo: `current_phase`→`fase_legacy_id`; `apex_submission_id`→`submission_id`. Filtro análogo con `(SELECT active_engagement_id FROM portal_users WHERE id = $userId)`.
2. **404 preservado:** si el usuario no existe, el primer UPDATE devuelve 0 filas y los subqueries de los otros dos UPDATE devuelven `NULL` (UPDATE no afecta filas). El helper detecta `userRow=null` tras el COMMIT y devuelve `{userRow: null, clienteRow: null, engagementRow: null}`, que las rutas traducen a HTTP 404 con el mismo body que antes.
3. Si una de las escrituras falla, BEGIN/COMMIT hace rollback de todas. Como la decisión de "a qué cliente / a qué engagement escribir" se toma en SQL dentro de la transacción, no es posible que `cliente_id` / `active_engagement_id` cambien entre la decisión y la escritura.

**Decisión explícita — `profile_type` legacy-only.** Aunque `engagements.vertical` existe en el schema (2.6.c), el mapeo `profile_type`→`vertical` es una decisión de modelo (MD-4: `'clinica'`→`'clinica-multi'` solo asignación inicial, no default permanente; el mapeo no es 1:1 — `profile_type` tiene 2 valores legacy y `vertical` tiene 3 valores canónicos), no una propagación técnica automática. El helper escribe `profile_type` únicamente en `portal_users`. Cualquier canonicalización futura requiere autorización explícita del usuario en un slice posterior. Documentado en `MODELO-DOMINIO.md` §6.6 addendum y `CONTRATOS.md` (CT-4 + §12.8).

#### `server/routes/portal.js` — cableado de los dos PATCH

- **`PATCH /api/portal-profile`** (auth user): construye `allowed` con los 10 campos editables por el usuario (personales + empresariales, sin fase) y delega en el helper. La respuesta proyecta exactamente las mismas 12 claves que devolvía el `RETURNING` previo.
- **`PATCH /api/portal-users/:id`** (auth admin): construye `fields` con los 13 campos editables por admin (personales + empresariales + fase) y delega en el helper. La respuesta proyecta exactamente las mismas 9 claves que antes (`id, email, nombre, empresa, sector, current_phase, profile_type, apex_submission_id, role`). El `SELECT id` previo de existencia se elimina: el helper devuelve `userRow=null` cuando el `UPDATE portal_users ... RETURNING` no encuentra fila dentro de la transacción, preservando el 404.

#### Validación

- **Smoke funcional** contra Neon (6 escenarios + rollback, idempotencia confirmada — cero drift respecto a baseline):
  1. Admin sin `cliente_id`: `clienteRow=null`, `engagementRow=null` ✓
  2. Usuario inexistente: las 3 filas `null` (la transacción ejecuta sin afectar filas: subqueries devuelven `NULL`) ✓
  3. armc empresarial (txn 2 queries): `userRow.sector` y `clienteRow.sector` actualizados; `engagementRow=null` ✓
  4. armc fase canónica (txn 2 queries): `userRow.current_phase` y `engagementRow.fase_legacy_id` actualizados; `clienteRow=null` ✓
  5. armc `profile_type` solo: `userRow.profile_type` actualizado; `engagementRow=null`; **`engagements.vertical` invariante** (`clinica-multi` ↔ `clinica-multi` PASS) ✓
  6. armc combinada empresarial+fase (txn 3 queries atómicas): los 3 rows actualizados ✓
  7. **Test de atomicidad/rollback**: invocando `sql.transaction` con un `UPDATE portal_users` válido seguido de un `UPDATE` con columna inexistente, la transacción lanza y `portal_users.sector` permanece invariante (rollback efectivo) ✓
- **Smoke HTTP** sobre servidor local (PORT=3099) con JWT firmado:
  - `PATCH /api/portal-profile` (admin sin cliente_id): shape de respuesta = 12 claves esperadas ✓
  - `PATCH /api/portal-profile` (armc con cliente_id): shape = 12 claves esperadas ✓
  - `PATCH /api/portal-users/3` (admin actualiza `current_phase`/`profile_type`/`apex_submission_id` sobre armc): shape = 9 claves esperadas ✓
  - `PATCH /api/portal-users/99999`: status 404, body `{"error":"Usuario no encontrado"}` ✓

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

#### Documentación alineada

- `REVIEW-PRISMA-APEX.md`: §3 estado actualizado; §4.2 corregida (deja de decir "skeleton aún no cableada"); bitácora con entrada del slice.
- `CLAUDE.md`: línea de árbol de `domain-sync.js` actualizada (cableado en `v3.3.42`, sincronización atómica, `profile_type` legacy-only).
- `MODELO-DOMINIO.md`: addendum a §6.6 que registra la decisión `profile_type` legacy-only y la regla de atomicidad.
- `CONTRATOS.md`: CT-4 matizado, sección 12.8 actualizada con checklist real (qué se propaga, qué no, y por qué), nota en `/api/portal-auth` y en `PATCH /portal-users/:id` sobre `profile_type` legacy-only.

#### Lo que NO entra en este slice

- **No se toca esquema de Neon** (no se añaden columnas, no se modifica schema; cualquier canonicalización de `profile_type` requiere autorización explícita futura).
- No se cablean `syncClienteUpdate` ni `syncEngagementUpdate` como flujos autónomos (siguen como skeleton; reservados para endpoints `/api/clientes/:id` y `/api/engagements/:id` futuros).
- No se cambia el storage de archivos (Drive sigue siendo backend; cambio diferido a paquete posterior ya documentado).
- No se toca frontend, nginx, ni se reactiva al ejecutor 2.

## [2026-05-05] — Cierre operativo post-`v3.3.41` (sin bump)

Entrada documental de cierre del paquete operativo ejecutado y validado tras absorber los 9 subpasos físicos de Fase 2. **No es una versión nueva**: no hay bump, no se toca runtime ni `server.js`, no se toca `domain-sync.js`, no se toca Neon, no se toca `prisma-consulting`, no se reactiva al ejecutor 2.

### 1. Promoción `dev` → `main`

- `origin/main` alineado por fast-forward con `origin/dev` en el baseline `b61d00f4c789af28608ead8e4efe500c99f41a64`.
- Producción (`prismaconsul.com`) desplegada y sirviendo `v3.3.41` (mismo SHA en producción que en `dev`).

### 2. Alineación nginx de producción a Variante B

- `/etc/nginx/sites-enabled/prisma-consul` reescrito para replicar la Variante B ya vigente en `dev`:
  - `root /home/prisma/web-de-prisma/web` (web pública).
  - Aliases explícitos para `/apex` (→ `prisma-apex/core/discovery-engine`), `/hub` (→ `prisma-apex`), `/publicados/` (→ `prisma-apex/clientes-publicados/`), `/shared/` (→ `shared/`).
  - Redirect 301 `/portal/analisis/...` → `/publicados/...` operativo.
  - `/api/*` proxied a Express (PM2 `prisma-consul`, puerto 3000).
- Backup vigente: `/etc/nginx/sites-available/prisma-consul.bak-20260505-pre-fase2-replication`.

### 3. Micro-paquete nginx `404/410 text/plain` (dev y prod)

Aplicado en ambos sites (`/etc/nginx/sites-enabled/prisma-dev` y `/etc/nginx/sites-enabled/prisma-consul`) para alinear la capa nginx con el contrato Express de `v3.3.38` (`server.js` 404/410 text/plain):

- Nuevo named location interno `@plain404` (`internal; types { } default_type text/plain; return 404 "Not Found\n";`).
- `/apex/fonts/*` actualizado a `410 + text/plain` con body explícito (`Gone — Phosphor fonts moved to /shared/fonts/phosphor/ in v3.3.37\n`).
- Misses bajo `/apex` y `/hub` (`try_files ... =404`) reemplazados por `try_files ... @plain404` para devolver 404 + text/plain en lugar del HTML default de nginx.
- `nginx -t` OK + reload limpio en ambos sites.
- Validación curl en origen (bypass Cloudflare) y pública: 9/9 OK (410 fonts + 404 misses con `Content-Type: text/plain`; `/`, `/apex/`, `/hub/`, `/publicados/armc/` siguen 200; redirect legacy 301 operativo).
- Backups: `/etc/nginx/sites-available/prisma-dev.bak-20260505-text-plain`, `/etc/nginx/sites-available/prisma-consul.bak-20260505-text-plain`.

### 4. Higiene operativa del checkout `~/web-de-prisma-dev` del VPS

- Checkout remoto realineado a `b61d00f` (HEAD = baseline).
- `git status` limpio.
- Vestigio `~/web-de-prisma-dev/images/datos.mp4` eliminado **solo después** de verificar que era duplicado byte a byte del canónico `~/web-de-prisma-dev/web/images/videos/datos.mp4`, que sigue presente.
- Validación pública: ruta canónica `https://dev.prismaconsul.com/images/videos/datos.mp4` → 200; ruta vestigial `https://dev.prismaconsul.com/images/datos.mp4` → 404.

### Fuera de alcance de este cierre

- `server/lib/domain-sync.js` no se cablea (paquete específico posterior).
- Neon no se toca.
- Ejecutor 2 no se reactiva.
- Sin bump de versión visible: `web/index.html`, `prisma-apex/index.html` y `CLAUDE.md` mantienen `v3.3.41`. Esta entrada es documental, no funcional.

### Pendientes operativos vigentes

1. Cableado de `domain-sync.js` en rutas.
2. Reactivación del ejecutor 2.

## [2026-05-05] — v3.3.41

### Subpaso 2.9 de Fase 2 — exportar operación consultiva ARMC a `prisma-consulting`

Noveno y último subpaso físico de Fase 2. Slice **estrecho** sobre carril repo: saca de este repo lo que `docs/PLAN-FASE2.md` clasificó como **operación consultiva cliente-específica**, dejándolo en `prisma-consulting`. Sin tocar runtime del producto, sin tocar `server.js`, rutas, frontend, `nginx`, Neon ni reactivar al ejecutor 2.

#### Archivos exportados (7) — borrados de aquí, incorporados allá

- `scripts/delete-armc-duplicates.js`   → `prisma-consulting/scripts/clientes/armc/delete-duplicates.js`
- `scripts/list-armc-files.js`          → `prisma-consulting/scripts/clientes/armc/list-files.js`
- `scripts/move-armc-patient-data.js`   → `prisma-consulting/scripts/clientes/armc/move-patient-data.js`
- `scripts/rename-armc-files.js`        → `prisma-consulting/scripts/clientes/armc/rename-files.js`
- `scripts/revert-armc-patient-data.js` → `prisma-consulting/scripts/clientes/armc/revert-patient-data.js`
- `scripts/update-armc-doctypes.js`     → `prisma-consulting/scripts/clientes/armc/update-doctypes.js`
- `docs/VALIDACION-CATALOGO-ARMC.md`    → `prisma-consulting/clientes/armc/VALIDACION-CATALOGO.md`

`scripts/` queda vacío en este repo (git deja de rastrearlo). `pain-knowledge-base.js` y los 2 scripts de `server/scripts/` no se mueven (fuera de alcance per `docs/PLAN-FASE2.md`).

#### Cross-reference

- Commit espejo en `prisma-consulting` (rama `dev`): **`1e0ee7b8ccbe18361f5fc1e251b71b94659ab3ae`** — `feat: incorporar scripts y validación ARMC desde web-de-prisma (subpaso 2.9 Fase 2)`. Adapta paths mínimos (`.env` y resolución de deps) sin tocar lógica de negocio. Crea `package.json` con `@neondatabase/serverless` + `googleapis` y `package-lock.json`. Validado: `list-files.js` (solo lectura) corre desde `prisma-consulting` y devuelve los 63 archivos ARMC con su distribución por `doc_type`.

#### Cambios documentales en este repo

- `docs/NOMENCLATURA.md` (sección 12 "Referencias internas"): paths de `rename-armc-files.js` y `update-armc-doctypes.js` reapuntados a sus nuevas ubicaciones canónicas en `prisma-consulting/scripts/clientes/armc/...` con nota del subpaso 2.9 / `v3.3.41`.
- `REVIEW-PRISMA-APEX.md`: registra 2.9 absorbido y cierra Fase 2 a nivel de subpasos físicos en `dev` (2.1 a 2.9 completos).
- `CHANGELOG.md`: esta entrada.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

#### Lo que NO entra en este patch

- No se ejecutan scripts destructivos como parte de la validación (solo `list-files.js`, lectura).
- No se mueve `pain-knowledge-base.js` ni `server/scripts/` (fuera de alcance).
- No se toca `main`, producción runtime, BD, `server.js`, rutas, middleware, frontend, `shared/`, `prisma-apex/clientes-publicados/` ni `nginx`.
- No se reactiva al ejecutor 2.
- No se replica la estructura Fase 2 a producción (paquete específico aparte).

## [2026-05-05] — v3.3.40

### Subpaso 2.8 de Fase 2 — refresh final de `CLAUDE.md` Directory Structure

Octavo subpaso de Fase 2. Slice **estrecho** documental sobre carril repo: actualizar la sección "Directory Structure" de `CLAUDE.md` para reflejar el estado real del repo tras 2.1 a 2.7, conforme a `docs/PLAN-FASE2.md` subpaso 2.8. Sin tocar runtime, sin tocar BD, sin tocar nginx, sin reactivar al ejecutor 2, sin abrir 2.9.

#### Cambios `CLAUDE.md`

- **Cabecera "Directory Structure"** reescrita: pasa de "Estructura vigente desde el subpaso 2.5 (`v3.3.37`)" a "Estructura vigente tras los subpasos 2.1 a 2.7 de Fase 2 (`v3.3.40`)". Añade explicación explícita del subpaso 2.6 (migración aditiva de BD sobre Neon — 5 tablas nuevas + columnas transitorias; árbol de archivos sin cambios) y del subpaso 2.7 (helper `server/lib/domain-sync.js` skeleton no invocado).
- **Bloque `server/lib/`** del árbol: añadido `domain-sync.js` con descripción que indica `(Subpaso 2.7, v3.3.39 — skeleton, aún no invocado por rutas)`.
- **Tech Stack — línea Icons**: corregida referencia stale `apex/fonts/` (path eliminado en `v3.3.37`) → `shared/fonts/phosphor/`. Aclaración añadida: el discovery consume vía `/shared/fonts/phosphor/phosphor.css`; el Hub sigue cargando Phosphor por CDN.

#### Lo que NO entra en este slice

- No se mezcla 2.9 (export de scripts ARMC a `prisma-consulting`).
- No se toca código de `server/`, `web/`, `prisma-apex/`, `shared/` ni rutas.
- No se toca Neon ni el schema de BD.
- No se toca `nginx`.
- No se reactiva al ejecutor 2.
- No se hace limpieza física de directorios legacy filesystem-only (`apex/fonts/` vacío, `portal/analisis/` vacío) — fuera de alcance de un slice documental.
- No se reescriben otras secciones de `CLAUDE.md` fuera de las 3 zonas estructurales corregidas.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

## [2026-05-05] — v3.3.39

### Subpaso 2.7 de Fase 2 — `server/lib/domain-sync.js` skeleton

Séptimo subpaso de Fase 2. Slice **estrecho** sobre carril repo: crea el helper de dominio, lo deja exportado y documentado, **sin conectarlo todavía a rutas** ni cambiar comportamiento del sistema. Sin tocar `main`, sin tocar producción runtime, sin tocar BD (la BD ya quedó migrada en `v3.3.38` / subpaso 2.6).

#### Archivo nuevo

- **`server/lib/domain-sync.js`** — capa única de aplicación que sincronizará legacy ↔ nuevo cuando se cablée en rutas (decisión cerrada en `MODELO-DOMINIO.md` §6.6).

#### Funciones exportadas (5 + clasificación de campos)

Lecturas (implementadas):
- `getClienteFromUser(userId)` — devuelve la fila canónica de `clientes` si el usuario tiene `cliente_id`; cae a fallback con campos legacy de `portal_users` con shape compatible si no.
- `getActiveEngagement(userId)` — resuelve el engagement por `portal_users.active_engagement_id`; devuelve `null` si no hay.

Escrituras (skeleton, firma fija, lanzan `Error` "not wired yet"):
- `syncLegacyUserUpdate(userId, fields)` — preparada para el cableado en `PATCH /portal-profile` y `PATCH /portal-users/:id`. Documenta en código las 3 rutas de redirect (empresariales → `clientes`, fase → `engagements`, personales → `portal_users`).
- `syncEngagementUpdate(engagementId, fields)` — reservada para futuro panel/endpoint admin de engagements.
- `syncClienteUpdate(clienteId, fields)` — reservada para futuro panel/endpoint admin de clientes.

Constantes:
- `FIELDS_EMPRESARIALES`, `FIELDS_FASE`, `FIELDS_PERSONALES` — clasificación canónica de campos para el cableado posterior.

#### Estilo y patrón

CommonJS simple (`module.exports`), alineado con `server/lib/fetch-timeout.js` y `server/lib/google-drive.js`. Helper local `getSQL()` instancia `neon(process.env.DATABASE_URL)` por llamada — mismo patrón que `server/routes/portal.js` para evitar conexiones colgadas en serverless.

#### Lo que NO entra en este slice (alcance estrecho)

- **No se importa** `domain-sync.js` desde ninguna ruta.
- **No se modifica** SQL existente en `server/routes/portal.js` (líneas 154 y 500 intactas).
- **No cambian shapes** de respuesta de `/api/portal-profile` ni `/api/portal-users/:id`.
- **No se toca** la BD, `server/server.js`, middleware, frontend ni nginx.
- **No se mezcla** subpaso 2.8 ni 2.9.

#### Cierre del subpaso 2.6

`REVIEW-PRISMA-APEX.md` registra el cierre runtime de 2.6 (validación humana del flujo del Hub PASS sobre producción tras la migración aditiva ejecutada en `v3.3.38`). El backup pre-migración (`production-pre-2.6.dump` + `production-pre-2.6.sql`, 2026-05-05 07:43 UTC) se movió desde `/tmp` al almacenamiento durable de ops.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

## [2026-05-04] — v3.3.38

### Micro-paquete de higiene de serving — honestidad HTTP de rutas inexistentes + retiro explícito del subtree legacy `/apex/fonts/*`

Micro-paquete de higiene técnica acotada al estado post-2.5 en `dev`. **NO es subpaso 2.6 ni 2.9.** Sin tocar `main`, sin tocar producción, sin reactivar al ejecutor 2, sin mover scripts ARMC ni limpiar backups nginx, sin borrar manualmente directorios vacíos del filesystem.

#### Problemas que cierra

1. En `dev`, ciertas rutas inexistentes bajo `/apex/*` y `/hub/*` devolvían `200 text/html` con la landing en lugar de fallar de forma honesta. Esto degradaba la lectura de errores por parte de cualquier consumidor (browser intentaba parsear HTML como CSS/JS/imagen).
2. En Express seguía vivo el mount `app.use('/portal', express.static(...))` apuntando a `portal/` vacío — código muerto tras el subpaso 2.3.

#### Cambios `nginx` en `dev`

- **`location /apex { try_files $uri $uri/ =404; }`** (antes `/index.html`). Paths inexistentes bajo `/apex/*` ahora dan 404 honesto.
- **`location /hub { try_files $uri $uri/ =404; }`** (antes `/index.html`). Idem para `/hub/*`.
- **`location ~ ^/apex/fonts/ { return 410; }`** declarado *antes* del bloque `/apex` para tener prioridad. Marca el subtree retirado con **410 Gone** (mejor que 404 para señal explícita de retiro definitivo).
- **`location /portal/`** eliminado (era alias a directorio vacío).
- **Mantenido intacto:** `location ~ ^/portal/analisis/(.+)$ { return 301 /publicados/$1; }` — el redirect legacy sigue indispensable.
- Backup: `/etc/nginx/sites-available/prisma-dev.bak-20260504-subpaso-2.5h`.

#### Cambios `server/server.js`

- **Eliminado `app.use('/portal', express.static(portal/, ...))`** — código muerto.
- **Añadido handler 410** para `/apex/fonts/*` (regex) declarado **antes** del mount `/apex`. Devuelve `410 Gone` con body `text/plain` explicando dónde están las fuentes ahora.
- **Fallback `app.get('*', ...)` cambiado**: antes devolvía `404` con body HTML de la landing; ahora devuelve `404 Not Found` con body `text/plain`. Cierra el mismo problema de honestidad HTTP que la corrección nginx.
- **Mantenidos intactos:** redirect 301 regex `/portal/analisis/...`, mount `/apex` (discovery), mount `/shared`, mount `/publicados`, handler `/hub`, mounts API.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

#### Lo que NO entra en este patch

- No subpaso 2.6 (migración de BD).
- No subpaso 2.9 (export scripts ARMC).
- No limpieza de backups nginx anteriores.
- No `rm -rf` de `apex/` o `portal/` vacíos del filesystem.
- No corrección de la canonicalización `/apex` → `/apex/` (aceptada por dictamen).
- No se toca producción ni `main`.
- No se reactiva ejecutor 2.
- No se toca discovery logic, runtime del Hub, `/shared/`, `/publicados/` ni APIs.

## [2026-05-04] — v3.3.37

### Subpaso 2.5 de Fase 2 — Centralización de fuentes Phosphor del discovery en `shared/fonts/phosphor/`

Quinto movimiento físico de Fase 2. Se sacan las 4 fuentes Phosphor de la ubicación legacy `apex/fonts/` y se centralizan en una nueva ruta compartida `shared/fonts/phosphor/`, expuesta al navegador como `/shared/fonts/phosphor/...`. Sin tocar `main` ni producción. Sin reactivar al ejecutor 2.

#### Movimiento físico (`git mv`, historial preservado)

- `apex/fonts/Phosphor.ttf`   → `shared/fonts/phosphor/Phosphor.ttf`
- `apex/fonts/Phosphor.woff`  → `shared/fonts/phosphor/Phosphor.woff`
- `apex/fonts/Phosphor.woff2` → `shared/fonts/phosphor/Phosphor.woff2`
- `apex/fonts/phosphor.css`   → `shared/fonts/phosphor/phosphor.css`

`phosphor.css` no se edita: usa rutas relativas (`./Phosphor.woff2`, `./Phosphor.woff`, `./Phosphor.ttf`) que siguen resolviéndose porque CSS y binarios viajan juntos a la misma carpeta. `apex/` queda eliminado del árbol efectivo tras el move (sin archivos, sin tracking git).

#### Cambios `prisma-apex/core/discovery-engine/index.html`

- Línea 31: `<link rel="stylesheet" href="fonts/phosphor.css">` → `<link rel="stylesheet" href="/shared/fonts/phosphor/phosphor.css">`. URL pública absoluta para que el discovery cargue las fuentes desde la nueva ubicación canónica.

#### Cambios `server/server.js`

- Eliminado el mount legacy `/apex/fonts` (que en `v3.3.36` apuntaba a `apex/fonts/`).
- Añadido mount nuevo: `app.use('/shared', express.static(path.join(projectRoot, 'shared')))`.
- Mount general `/apex` se mantiene intacto (sirve discovery desde `prisma-apex/core/discovery-engine/`).
- `/hub`, `/publicados`, redirects 301 legacy y `/api/` no se tocan.

#### Cambios `nginx` en `dev`

- Eliminado `location /apex/fonts/`.
- Añadido `location /shared/` con `alias` a `/home/prisma/web-de-prisma-dev/shared/`.
- Resto de la config Variante B intacto.
- Backup: `/etc/nginx/sites-available/prisma-dev.bak-20260504-subpaso-2.5`.

#### Cambios documentales

- `CLAUDE.md`: Directory Structure refrescada — `apex/` ya no aparece (vacío post-move); aparece `shared/fonts/phosphor/` con sus 4 archivos.
- `CONTRATOS.md`: añadida sección 3.4 documentando `/shared/fonts/phosphor/*` como superficie pública nueva (4 URLs: `phosphor.css`, `Phosphor.woff2`, `Phosphor.woff`, `Phosphor.ttf`). Nota explícita: el Hub sigue cargando Phosphor desde CDN; cualquier app futura que use Phosphor debe consumir desde `/shared/...`.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual" + Directory Structure)
- `CHANGELOG.md` (esta cabecera)

#### Lo que NO entra en este patch

- No se toca el Hub runtime (sigue usando Phosphor por CDN).
- No se abre microparche correctivo para la canonicalización `/apex` → `/apex/` (decisión del revisor: aceptado como normalización técnica).
- No se toca `main` ni producción.
- No se reactiva ejecutor 2.
- No se arranca subpaso 2.6.

## [2026-05-04] — v3.3.36

### Subpaso 2.4 de Fase 2 — APEX Discovery movido a `prisma-apex/core/discovery-engine/`

Cuarto movimiento físico de Fase 2. El discovery engine deja la raíz `apex/` y pasa a `prisma-apex/core/discovery-engine/`. URL pública `/apex` se mantiene idéntica. `fonts/` **NO se centraliza** en este subpaso (queda para 2.5). Sin tocar `main` ni producción.

#### Movimiento físico (`git mv`, historial preservado)

- `apex/index.html`           → `prisma-apex/core/discovery-engine/index.html`
- `apex/form.css`             → `prisma-apex/core/discovery-engine/form.css`
- `apex/form.js`              → `prisma-apex/core/discovery-engine/form.js`
- `apex/signal-detector.js`   → `prisma-apex/core/discovery-engine/signal-detector.js`

`apex/` queda parcial: solo conserva `fonts/`. La centralización de fuentes pertenece al subpaso 2.5.

#### Cambios `server/server.js`

Sustituido el mount único `/apex` por dos mounts ordenados:

- **`app.use('/apex/fonts', express.static('apex/fonts'))`** — declarado primero. Preserva la ruta legacy `apex/fonts/` para que las referencias relativas `fonts/phosphor.css` del HTML del discovery sigan resolviéndose como `/apex/fonts/phosphor.css` sin tocar el HTML.
- **`app.use('/apex', express.static('prisma-apex/core/discovery-engine', { index: 'index.html', extensions: ['html'] }))`** — sirve el discovery desde su nueva ubicación. Se mantiene `express.static` (NO `sendFile`) para preservar la resolución automática de assets relativos `form.css`, `form.js`, `signal-detector.js`.

#### Cambios `nginx` en `dev`

- `location /apex/fonts/` con `alias` a `apex/fonts/` (legacy hasta 2.5).
- `location /apex` con `alias` reapuntado a `prisma-apex/core/discovery-engine/`.
- Resto de la config Variante B intacto (`/`, `/hub`, `/publicados/`, redirects 301, `/api/`).
- Backup: `/etc/nginx/sites-available/prisma-dev.bak-20260504-subpaso-2.4`.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual" + Directory Structure refrescada)
- `CHANGELOG.md` (esta cabecera)

#### Lo que NO entra en este patch

- No se centraliza `fonts/` (subpaso 2.5).
- No se toca `main` ni producción.
- No se reactiva ejecutor 2.
- No se toca runtime del Hub, `/hub`, `/publicados`, `ANALISIS_REGISTRY`.
- No se usa `app.get('/apex', sendFile ...)` — preservado `express.static` para no romper assets relativos.

## [2026-05-04] — v3.3.35

### Remate documental sobre `CONTRATOS.md` post-2.3 — cierre del saneamiento previo a 2.4

Micro-paquete de cierre del saneamiento documental iniciado en `v3.3.34`. Tras dictamen del revisor (PASS con remate pendiente, concentrado solo en `CONTRATOS.md`), se completan las 7 referencias residuales a `portal/index.html` o `portal/analisis/GUIA-NUEVAS-SECCIONES.md` que aún afirmaban presente canónico en lugar de contexto histórico. Sin cambios runtime, sin tocar `main` ni producción.

#### Líneas actualizadas en `CONTRATOS.md`

- **L511** (capa de registro de rutas): el objeto JS literal vive ahora en `prisma-apex/index.html`.
- **L521** (fases legacy): `prisma-apex/index.html` define la lista de fases.
- **L529** (sección 7.1, título): `docs/GUIA-NUEVAS-SECCIONES.md` (movida a `docs/` en `v3.3.31`).
- **L621** (tabla mapeo Hub SPA → endpoints): `prisma-apex/index.html` (Hub SPA — entrypoint movido en `v3.3.33`).
- **L651** (CT-7): contextualizado histórico — las constantes "vivían en `portal/index.html` hasta `v3.2.45`" y "el registro vive ahora en `prisma-apex/index.html` con valores `/publicados/[cliente]/...`".
- **L652** (CT-8): la sincronización documental se hace por subpaso (`v3.3.32` para 2.2, `v3.3.34` para 2.3); guía referenciada como `docs/GUIA-NUEVAS-SECCIONES.md`.
- **L658** (CT-14): `prisma-apex/index.html` (entrypoint del Hub desde `v3.3.33`).

Quedan 3 referencias a `portal/index.html` (L480, L651, L769) **en contexto histórico explícito** ("Estado legacy v3.2.45 y anterior", "que vivían… hasta v3.2.45", "Cerrada en v3.2.46-48"). Aceptables como registro histórico per regla del revisor.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

#### Lo que NO entra en este patch

- No se toca runtime (`server/server.js`, ANALISIS_REGISTRY, nginx).
- No se toca `main` ni producción.
- No se reactiva ejecutor 2.
- No se arranca subpaso 2.4.
- No se reescriben docs históricos.

## [2026-05-04] — v3.3.34

### Saneamiento documental post-2.3 — sincronizar fuentes vivas con el entrypoint del Hub en `prisma-apex/index.html`

Micro-paquete documental autorizado por dictamen del revisor sobre el subpaso 2.3 (PASS con deuda documental pendiente). Sin cambios runtime, sin tocar `main` ni producción. Cierra las referencias residuales a `portal/index.html` que aún figuraban como instrucción operativa o presente canónico en docs vivos.

#### Cambios documentales

- **`CLAUDE.md`** — Directory Structure refrescada: `prisma-apex/index.html` aparece como entrypoint del Hub; `portal/` documentado como vestigial post-2.3 (sin contenido propio, soporte vestigial para routing legacy). Punto 2 de la sección "Versionado" actualizado: la pantalla de login ahora vive en `prisma-apex/index.html`.
- **`docs/GUIA-NUEVAS-SECCIONES.md`** — instrucciones operativas actualizadas: registrar nuevas secciones en `prisma-apex/index.html`, no en `portal/index.html`. 4 puntos tocados (paso 2 de la guía + 3 referencias en el ejemplo completo de ARMC).
- **`docs/NOMENCLATURA.md`** — sección 10 paso 4 (alta de tipos nuevos) y sección 12 ("Código del Hub afectado") referencian `prisma-apex/index.html` con líneas exactas (1087-1119) preservadas.
- **`CONTRATOS.md`** — cabecera, tabla de URLs públicas (sección 3), sección 4.1 (consumer login) y título de sección 6.1 actualizados al estado vigente post-2.1/2.2/2.3. Implicación para Fase 2 reescrita: 2.1, 2.2 y 2.3 ya ejecutados en `dev`; pendiente 2.4. Replicación a producción documentada como paquete específico aparte.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

#### Lo que NO entra en este patch

- No se toca runtime (`server/server.js`, ANALISIS_REGISTRY, nginx).
- No se toca `main` ni producción.
- No se reactiva ejecutor 2.
- No se arranca subpaso 2.4.
- No se reescriben docs históricos (PLAN-FASE2.md, runbooks antiguos, entradas viejas del changelog) salvo donde alguna línea afirme presente canónico.

## [2026-05-04] — v3.3.33

### Subpaso 2.3 de Fase 2 — entrypoint del Hub movido a `prisma-apex/index.html`

Tercer movimiento físico de Fase 2. El entrypoint del Hub deja `portal/index.html` y pasa a `prisma-apex/index.html`. El handler `/hub` y la config nginx en `dev` se reapuntan a la nueva ubicación. Sin tocar `main` ni producción. Sin cambios funcionales en la SPA del Hub (mismo HTML).

#### Movimiento físico (`git mv`, historial preservado)

- **`portal/index.html`** → **`prisma-apex/index.html`**

`portal/` queda solo con el subdirectorio vacío `analisis/` (residual del subpaso 2.2; no rastreado por git).

#### Cambios `server/server.js`

- Handler `/hub` reapuntado: `res.sendFile(path.join(projectRoot, 'prisma-apex', 'index.html'))`.
- Mount `/portal` se conserva como soporte vestigial para los redirects 301 legacy del subpaso 2.2 (`/portal/analisis/...` → `/publicados/...`).

#### Cambios `nginx` en `dev`

- `location /hub` con `alias` reapuntado a `/home/prisma/web-de-prisma-dev/prisma-apex/`.
- Redirect 301 legacy `/portal/analisis/...` → `/publicados/...` se conserva intacto.
- Backup: `/etc/nginx/sites-available/prisma-dev.bak-20260504-subpaso-2.3`.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `prisma-apex/index.html` (welcome-version del Hub — antes en `portal/index.html`)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

#### Lo que NO entra en este patch

- No se toca producción (`prismaconsul.com`).
- No se toca `main`.
- No se reactiva ejecutor 2 ni se toman commits suyos posteriores a `a5fca31`.
- No se arranca subpaso 2.4 (movimiento de `apex/`).
- No se limpia `portal/analisis/` vacío (queda como residual; limpieza fuera de alcance).

## [2026-05-03] — v3.3.32

### Saneamiento documental post-2.2 — sincronizar fuentes contractuales con la URL canónica `/publicados/`

Micro-paquete documental tras el dictamen del revisor sobre el subpaso 2.2 (PASS con deuda documental pendiente). Sin cambios runtime, sin tocar `main` ni producción. Cierra los 3 findings de docs identificados.

#### Findings cerrados

- **Medium (CONTRATOS.md):** la sección que describe el `ANALISIS_REGISTRY` como "forma actual implementada" mostraba todavía `/portal/analisis/armc/...` cuando el código real ya usa `/publicados/armc/...` desde `v3.3.31`. Actualizado a la forma canónica vigente; añadida nota sobre el redirect 301 que cubre legacy.
- **Medium (`docs/GUIA-NUEVAS-SECCIONES.md`):** los ejemplos enseñaban a crear secciones nuevas con paths bajo `/portal/analisis/...`. Actualizadas las dos zonas mencionadas (líneas ~130 y ~344) a la URL canónica `/publicados/[cliente]/...`. Añadidas notas explícitas: el legacy sigue funcionando vía 301, pero **no debe usarse** para código nuevo. Se recomienda además el patrón `ANALISIS_REGISTRY` (capa de registro) sobre constantes ad-hoc.
- **Low (`CLAUDE.md` "Directory Structure"):** árbol stale (no reflejaba `web/` ni `prisma-apex/clientes-publicados/`). Refrescado para reflejar la estructura post-2.1/2.2, con marcadores de qué subpasos introdujeron cada bloque y nota sobre la URL canónica.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `portal/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

#### Lo que NO entra en este patch

- No se toca runtime (`server/server.js`, `portal/index.html` ANALISIS_REGISTRY, nginx).
- No se toca `main` ni producción.
- No se reactiva el ejecutor 2.
- No se arranca subpaso 2.3.

## [2026-05-03] — v3.3.31

### Subpaso 2.2 de Fase 2 — entregables ARMC bajo `/prisma-apex/clientes-publicados/` + URL canónica `/publicados/`

Primer movimiento físico de la jerarquía de cliente bajo la nueva estructura `prisma-apex/clientes-publicados/[cliente]/`, con URL pública canónica `/publicados/[cliente]/...` y compatibilidad legacy 301 desde `/portal/analisis/[cliente]/...`. Sin tocar producción ni `main`.

#### Absorción previa del freeze del carril contenido (3 SHAs autorizados)

- `50f39af` — content(modelo-datos/Paciente): correcciones post-CEO + alineación contadores
- `e7469f1` — content(modelo-datos/Paciente): Idioma preferido como selección explícita
- `a5fca31` — content(modelo-datos/Paciente): granularizar Antecedentes (secciones 3-6) como electivos

Cherry-picks limpios, sólo tocan `prisma-apex/clientes-publicados/armc/blueprint/modelo-datos.html` (post-move). Verificado: ninguna otra ruta arrastrada.

#### Movimientos físicos (`git mv`, historial preservado)

- **`portal/analisis/armc/`** → **`prisma-apex/clientes-publicados/armc/`** (20 archivos: 1 `index.html` + 8 diagramas + 5 diagnostico + 5 blueprint + 1 css)
- **`portal/analisis/GUIA-NUEVAS-SECCIONES.md`** → **`docs/GUIA-NUEVAS-SECCIONES.md`** (interna, NO bajo `/publicados/`)

`portal/analisis/` queda vacío tras el move.

#### Cambios `server/server.js`

- Nuevo mount estático: `app.use('/publicados', express.static(path.join(projectRoot, 'prisma-apex', 'clientes-publicados'), { extensions: ['html'] }))`.
- Redirect legacy 301 (fallback Express para local/sin nginx): `app.get(/^\/portal\/analisis\/(.+)$/, (req, res) => res.redirect(301, '/publicados/' + req.params[0]))`.
- Mount `/portal` se mantiene para servir `portal/index.html` (el Hub) hasta el subpaso 2.3.

#### Cambios `nginx` en `dev`

- Añadido `location /publicados/` con `alias /home/prisma/web-de-prisma-dev/prisma-apex/clientes-publicados/`.
- Añadido redirect 301 con prioridad sobre `/portal/`: `location ~ ^/portal/analisis/(.+)$ { return 301 /publicados/$1; }`.
- Backup: `/etc/nginx/sites-available/prisma-dev.bak-20260503-subpaso-2.2`.

#### Cambios frontend (`portal/index.html`)

- `ANALISIS_REGISTRY.armc.{diagramas,diagnostico,blueprint}` actualizado de `/portal/analisis/armc/...` a `/publicados/armc/...`. La SPA Hub abre los iframes ya desde la URL canónica.

#### Bump versión visible (4 puntos canónicos)

- `web/index.html` (footer landing)
- `portal/index.html` (welcome-version del Hub)
- `CLAUDE.md` (campo "Versión actual")
- `CHANGELOG.md` (esta cabecera)

#### Lo que NO entra en este patch

- No se toca producción (`prismaconsul.com`).
- No se toca `main`.
- No se reactiva al ejecutor 2 ni se toman commits suyos posteriores a `a5fca31`.
- No se ejecutan los subpasos 2.3+ (cada uno requerirá paquete propio).

## [2026-05-03] — v3.3.30

### Normalización operativa pre-2.2 y simplificación del modo de dos carriles

Patch documental y de higiene operativa. No ejecuta cambios runtime en `dev` ni en producción.

#### Ajuste realizado

- `CLAUDE.md` deja una sola política operativa vigente: la carpeta principal limpia y alineada pasa a ser la base oficial del carril repo sobre `dev`; el carril contenido permanece en un worktree dedicado; el handoff se congela por SHA aprobado y los worktrees extra quedan solo para auditoría, experimento o recuperación temporal.
- `CLAUDE.md` aclara además el reparto exacto de ejecución: el ejecutor 1 trabaja desde la carpeta principal sobre `dev` y el ejecutor 2 desde un worktree dedicado, donde puede dejar commits locales identificables para handoff sin asumir integración, push ni release.
- `REVIEW-PRISMA-APEX.md` se actualiza al estado real del proyecto: Fase 2 ya está iniciada, 2.1 ya fue absorbido en `origin/dev`, C12 deja de estar abierto y el siguiente subpaso autorizado pasa a ser 2.2.
- `docs/PLAN-FASE2.md` sincroniza su nota operativa con el estado real publicado (`v3.3.29`) y con el flujo simplificado de carriles antes de ejecutar 2.2.
- Se actualiza la versión visible del proyecto a `v3.3.30` en landing, portal, `CLAUDE.md` y `CHANGELOG.md`.

#### Estado tras este patch

- Queda una única base operativa clara para el carril repo antes de 2.2.
- El carril contenido queda congelado por SHA para evitar colisión con el movimiento estructural de 2.2.
- No se toca producción.

## [2026-05-03] — v3.3.29

### Publicación adicional en dev del carril contenido ARMC

Patch de contenido sobre `dev`. No toca producción.

#### Ajuste realizado

- Se corrigen los conteos del catálogo CEO de `~52` a `~53` en los diagramas de flujo afectados.
- `portal/analisis/armc/diagnostico/mapa-fricciones.html` corrige la nota final de fricciones transversales de `8` a `9`.
- `portal/analisis/armc/diagnostico/embudo-operativo.html` incorpora las 3 variantes de valoración post-CEO en la etapa de Conversión.
- Se actualiza la versión visible del proyecto a `v3.3.29` en landing, portal, `CLAUDE.md` y `CHANGELOG.md`.

#### Estado tras este patch

- `origin/dev` absorbe el contenido nuevo pendiente del carril 2 posterior al corte `v3.3.28`.
- Producción permanece intacta.

## [2026-05-03] — v3.3.28

### Clarificación operativa definitiva del modo de dos carriles

Patch documental de gobernanza. No ejecuta cambios runtime en `dev` ni en producción.

#### Ajuste realizado

- `CLAUDE.md` aclara que el carril repo gestiona la integración/publicación y que el carril contenido puede dejar paquetes cerrados en commits identificables sin asumir `push`, merge, deploy ni release.
- Se fija la operación base con **dos worktrees persistentes**, uno por carril; los worktrees extra quedan solo para auditorías o experimentos temporales.
- Se define que el handoff del carril contenido se congela por **SHA/commit aprobado** y no bloqueando toda la rama o todo el worktree.
- Se explicita que el carril repo integra ese SHA de forma serial mientras el carril contenido puede seguir avanzando en el mismo worktree con commits nuevos posteriores.
- Se añade la regla explícita del ejecutor 1: un estado probado en VPS o en rama de carril no cuenta como publicado hasta quedar absorbido en `origin/dev` y volver a validarse desde esa base publicada.
- `REVIEW-PRISMA-APEX.md` registra esta clarificación como regla operativa vigente.
- `REVIEW-PRISMA-APEX.md` registra además que el subpaso 2.1 ya tiene PASS técnico en `dev`, con absorción Git y validación visual aún pendientes antes del cierre final.

#### Estado tras este patch

- Queda cerrada la ambigüedad práctica entre trabajo paralelo y handoff entre carriles.
- El sistema operativo estándar pasa a ser: dos worktrees fijos, handoff por SHA, integración serial por el carril repo.
- No se toca producción.

## [2026-05-02] — v3.3.27

### Addendum operativo al runbook de Variante B + corrección del plan bajo nginx

Patch documental y de control. No ejecuta cambios runtime en `dev` ni en producción.

#### Ajuste realizado

- Se aceptan los gaps operativos bien fundados del ejecutor sobre el runbook de Variante B.
- `docs/RUNBOOK-EJECUTOR-VARIANTE-B-SUBPASO-2.1.md` se refuerza con:
  - inventario proactivo de rutas desde logs nginx antes del cambio
  - orden estricto de activación: config nueva preparada → repo actualizado → `pm2 restart prisma-dev` → activación nginx → `nginx -t` → reload
  - rollback completo: nginx + repo + PM2
  - definición explícita de `/hub` por serving directo desde nginx mientras 2.3 no lo mueva
  - nota operativa sobre Cloudflare para futura réplica a producción
- `docs/PLAN-FASE2.md` se corrige para que 2.1, 2.2, 2.3, 2.4 y 2.5 no vuelvan a asumir que `server.js` por sí solo resuelve los cambios de serving bajo la arquitectura Variante B.
- `REVIEW-PRISMA-APEX.md` registra la aceptación del addendum y mantiene C12 abierto hasta validación runtime PASS en `dev`.

#### Estado tras este patch

- La decisión sigue siendo Variante B.
- El runbook queda más seguro y menos ambiguo antes de ejecución.
- No se toca producción.

## [2026-05-02] — v3.3.26

### Eliminación del informe técnico redundante del ejecutor para 2.1

Patch documental mínimo. No ejecuta cambios runtime en `dev` ni en producción.

#### Ajuste realizado

- Se elimina `docs/INFORME-TECNICO-EJECUTOR-INFRA-2.1.md` por redundancia operativa.
- El documento ejecutable y vigente para el carril repo sigue siendo `docs/RUNBOOK-EJECUTOR-VARIANTE-B-SUBPASO-2.1.md`.
- La justificación comparativa de la decisión permanece en `docs/ANALISIS-ALTERNATIVAS-INFRA-SUBPASO-2.1.md`.

#### Estado tras este patch

- No cambia la decisión C12 ni el plan de ejecución de Variante B.
- No se toca `docs/PLAN-FASE2.md`.
- Se reduce duplicación documental antes de la ejecución del subpaso 2.1.

## [2026-05-02] — v3.3.25

### Selección operativa de Variante B + paquete documental de ejecución para 2.1

Patch documental y de control. No ejecuta cambios runtime en `dev` ni en producción por sí mismo. Su función es convertir la decisión del revisor sobre el bloqueo de infraestructura del subpaso 2.1 en documentación operativa coherente para el ejecutor.

#### Decisión registrada

- El bloqueo C12 deja de estar en fase de comparación y pasa a ejecución condicionada: el revisor/usuario selecciona la **Variante B** para retomar 2.1.
- Variante B significa: cambiar el `root` global del site de `dev` para que la web pública salga desde `/web/`, añadiendo excepciones explícitas para `/apex`, `/hub`, `/portal/` y `/api/`.
- La decisión sigue siendo **solo para `dev`** hasta completar validación runtime y evidencias de PASS.

#### Documentación sincronizada

- `docs/ANALISIS-ALTERNATIVAS-INFRA-SUBPASO-2.1.md`: conserva la comparativa pero deja marcada la decisión operativa final en favor de Variante B.
- `docs/INFORME-TECNICO-EJECUTOR-INFRA-2.1.md`: deja de recomendar Variante A y se alinea con la ejecución de Variante B.
- `docs/RUNBOOK-EJECUTOR-VARIANTE-B-SUBPASO-2.1.md`: nuevo procedimiento paso a paso para el ejecutor, con precondiciones, verificaciones, criterio de aborto y rollback.
- `docs/PLAN-FASE2.md`: el subpaso 2.1 ya no asume un cambio solo en Express; incorpora el cambio de `root` en nginx y sus excepciones explícitas.
- `REVIEW-PRISMA-APEX.md`: C12 actualizado con la variante elegida y nueva entrada de bitácora.

#### Estado tras este patch

- No hay despliegue ejecutado en este patch.
- No se toca producción.
- C12 sigue abierto hasta que el ejecutor complete el runbook y deje evidencia de validación PASS en `dev`.
- El siguiente movimiento permitido ya no es "elegir variante", sino ejecutar Variante B de forma controlada.

## [2026-05-02] — v3.3.24

### Cierre de ambigüedad v3.3.22/v3.3.23 + activación real de carriles + realineación final local

Patch documental/control mínimo. Sin contenido de producto, sin lógica APEX/Hub, sin backend, sin blueprint, sin ARMC. Cierra el último fleco operativo antes del arranque del primer slice de Fase 2.

#### Aclaración del baseline operativo

- **`v3.3.22`** queda registrado como el **baseline cerrado** del tramo pre-Fase 2 (el commit en el que `main` y `dev` se igualaron y producción se desplegó por primera vez tras la reconciliación).
- **`v3.3.23`** fue el **sync documental de cierre baseline + activación de carriles** sobre `v3.3.22` — base operativa previa.
- **`v3.3.24`** (este commit) es el **HEAD operativo real** desde el que arrancarán el primer slice de Fase 2 y el carril contenido.

Donde la documentación previa decía "Fase 2 arrancará desde `v3.3.22`", a partir de aquí debe leerse: el baseline es `v3.3.22`, la base operativa de arranque es el commit publicado más reciente (`v3.3.24` en este momento).

#### Activación real de los dos carriles

- Antes de este patch, los worktrees `prisma-carril-repo-next` y `prisma-carril-contenido-next` existían pero estaban en `detached HEAD`. Eso permite leer y compilar pero no permite commits limpios sin crear rama primero.
- En este patch se documenta y se ejecuta la convención: cada worktree de carril debe operar sobre una **rama local real** antes del primer commit. Ramas creadas a partir de `v3.3.24`:
  - **`chore/fase2-repo-base-v3.3.24`** en `prisma-carril-repo-next`
  - **`chore/fase2-contenido-base-v3.3.24`** en `prisma-carril-contenido-next`
- Ningún cambio se ejecuta dentro de esos carriles en este patch — solo quedan listos con rama activa.

#### Realineación final local

- La carpeta principal local (`/Users/armandocruz/Documents/PRISMA CONSUL/PHARMA/web-de-prisma`) se realinea al HEAD publicado de este patch (`v3.3.24`) de forma no destructiva (stash + fast-forward, sin `reset --hard`).
- Stash anterior (`stash@{0}` del 2026-05-01) **no se toca** salvo instrucción explícita.

#### Estado tras este patch

- C11 sigue cerrado. No se reabre.
- Modo de trabajo en dos carriles activo y formalizado en `CLAUDE.md` con regla explícita de "rama real antes del primer commit".
- Fase 2 sigue sin arrancar; el primer slice requerirá paquete específico que autorice los archivos y el alcance.

#### Cambios documentales (7 archivos del alcance)

- `REVIEW-PRISMA-APEX.md`: estado actualizado al HEAD operativo `v3.3.24`; aclaración v3.3.22/v3.3.23/v3.3.24; nota de carriles con rama real.
- `docs/PLAN-COORDINACION-PRE-FASE2.md`: nota de cierre actualizada al nuevo HEAD; sigue como historial.
- `docs/PLAN-FASE2.md`: la nota baseline cambia "Fase 2 arrancará desde `v3.3.22`" por "Fase 2 arrancará desde el HEAD operativo más reciente publicado (`v3.3.24` en este momento)".
- `CLAUDE.md`: regla "rama real antes del primer commit" añadida al modo de dos carriles + bump versión.
- `CHANGELOG.md`: esta entrada + bump cabecera.
- `index.html`, `portal/index.html`: bump versión visible.

## [2026-05-02] — v3.3.23

### Sync documental de cierre baseline + activación operativa de Fase 2

Sync documental final tras el cierre baseline `v3.3.22`. Solo cambios de control y documentación (review, planes, CLAUDE.md, CHANGELOG, versionado visible). Sin contenido de producto, sin lógica APEX/Hub, sin backend, sin blueprint, sin ARMC.

#### Estado del proyecto que este patch formaliza

- Baseline `v3.3.22` cerrado, desplegado en producción y validado técnicamente (HTTP, versión visible).
- Carpeta principal local del usuario alineada al baseline de forma no destructiva (preservación del WIP previo en `stash@{0}` + backup en `/tmp/wip-backup-main-folder-20260501-175601/`).
- Coordinación `main`/`dev`: cerrada. C11 sigue cerrado y no se reabre.
- Sync documental adicional del revisor (5 archivos) integrado formalmente al repo en este patch.

#### Activación operativa de Fase 2

- **Fase 2: autorizable.** Cuando se autorice arrancar el primer slice real, lo hará desde el commit `v3.3.23`.
- **Modo de dos carriles activo:**
  - Ejecutor 1 = repo / git / deploy / release.
  - Ejecutor 2 = contenido / texto / blueprint.
  - Revisor coordina y dictamina. Modo revisor permanente vigente.
- Worktrees limpios listos para arranque desde el baseline:
  - `/tmp/prisma-carril-repo-next` — base ejecutor 1.
  - `/tmp/prisma-carril-contenido-next` — base ejecutor 2.

#### Cambios documentales (5 archivos del sync del revisor + 4 del bump)

- `REVIEW-PRISMA-APEX.md`: sincronización del review tras el cierre baseline.
- `docs/PLAN-COORDINACION-PRE-FASE2.md`: ajustes de cierre.
- `docs/PLAN-FASE2.md`: notas adicionales para el arranque.
- `CLAUDE.md`: ajuste documental + bump de "Versión actual".
- `CHANGELOG.md`: ajuste de la entrada `v3.3.22` + esta entrada `v3.3.23`.
- `index.html`, `portal/index.html`: bump versión visible.

#### Lo que NO entra en este patch

- No se toca contenido ARMC ni blueprint de fondo.
- No se toca backend funcional.
- No se abre todavía un subpaso grande de Fase 2.

## [2026-05-01] — v3.3.22

### Cierre baseline pre-Fase 2 + publicación a producción + modo de trabajo en dos carriles

Cierre operativo del tramo pre-Fase 2. Promoción de `dev` a `main` por fast-forward, despliegue a producción, validación, y formalización del modo de trabajo en dos carriles para el siguiente tramo. Sin contenido nuevo de blueprint ni de análisis ARMC. Sin arranque de Fase 2.

#### Operaciones de release

- Reconciliación Git `main` → `dev` ya estaba realizada y desplegada en `dev.prismaconsul.com` en `v3.3.21` (`c6db329`).
- En este release: `origin/main` se promueve por fast-forward al commit del baseline `v3.3.22`, igualando `origin/dev` y `origin/main` en el mismo HEAD.
- Despliegue a producción (`prismaconsul.com`) ejecutado con el flujo estándar del repo (`git pull origin main` + `pm2 restart prisma-consul`).
- Validación HTTP post-despliegue: landing `/`, `/apex`, `/hub`, versión visible `v3.3.22` en footer y login del Hub.

#### Cambios documentales

- **`CLAUDE.md`**: nueva sección `## Modo de trabajo en dos carriles` (Ejecutor 1 = repo, Ejecutor 2 = contenido, Revisor = coordinación + dictamen). Bump del campo "Versión actual".
- **`REVIEW-PRISMA-APEX.md`**: cierre baseline registrado; estado actualizado para reflejar que la reconciliación Git ya quedó publicada en `main`. C11 (coordinación `main`/`dev`) deja de figurar como problema abierto.
- **`docs/PLAN-COORDINACION-PRE-FASE2.md`**: marcado como cerrado en su totalidad. Sirve como historial del proceso, no como plan vivo.
- **`docs/PLAN-FASE2.md`**: nota de baseline — Fase 2 sigue sin arrancar; cuando arranque lo hará desde el commit `v3.3.22` con los dos carriles ya formalizados.
- **`CHANGELOG.md`**: esta entrada.
- **`index.html`**, **`portal/index.html`**: bump de versión visible.

#### Lo que NO entra en este release

- No se toca contenido de blueprint ni análisis ARMC.
- No se toca lógica APEX ni Hub.
- No se toca backend funcional.
- No se arranca Fase 2.

#### Fuera de alcance — pendiente operativo

- Validación humana visual de `dev.prismaconsul.com` y `prismaconsul.com` post-despliegue: completada posteriormente por el usuario. No se reportaron regresiones visuales.
- Decisión sobre arranque de Fase 2 (requiere autorización explícita del revisor / usuario).
- Addendum posterior al release: la carpeta local principal del usuario se alineó no destructivamente al baseline `d06ef6e`. El WIP previo quedó preservado en stash etiquetado `WIP-pre-baseline-v3.3.22-main-folder-2026-05-01-17:56` y backup temporal en `/tmp/wip-backup-main-folder-20260501-175601/`. Los siguientes carriles siguen operando sobre worktrees limpios.

## [2026-05-01] — v3.3.21

### Coordinación pre-Fase 2 — reconciliación Git `main` → `dev` completada

Se completa la reconciliación Git entre `origin/main` (`v3.2.54`) y `origin/dev` (`v3.3.20`) mediante un merge histórico que preserva intacto el árbol canónico de `dev`. No introduce cambios funcionales nuevos; convierte el catch-up `main` → `dev` en un estado auditable y deja pendiente únicamente el despliegue/validación del `dev` reconciliado antes de arrancar Fase 2.

#### Documentación / coordinación

- **`docs/PLAN-COORDINACION-PRE-FASE2.md`**: actualizada para reflejar que el catch-up Git `main` → `dev` ya está completado (`65c1301`) y que el bloqueo restante antes de Fase 2 ya no es Git, sino validación del `dev` reconciliado.
- **`REVIEW-PRISMA-APEX.md`**: sincronizado con el nuevo estado operativo; C11 sigue abierto solo por despliegue/validación, R08 pasa de divergencia Git a riesgo de arrancar sin validar el entorno reconciliado, y se añade bitácora de la reconciliación completada.
- **`docs/PLAN-FASE2.md`**: actualiza los pendientes previos al subpaso 2.1 para que ya no pidan reabrir la reconciliación Git, sino desplegar y validar `origin/dev` reconciliado.
- **`CLAUDE.md`**: refina la regla operativa de Fase 2 para exigir `origin/dev` reconciliado y validado, no simplemente “sin divergencia” abstracta con `main`.

#### Versionado visible

- **`index.html`**: bump `v3.3.20` → `v3.3.21` en footer.
- **`portal/index.html`**: bump `v3.3.20` → `v3.3.21` en pantalla de login.
- **`CLAUDE.md`**: campo `Versión actual` actualizado a `v3.3.21`.

## [2026-05-01] — v3.3.20

### Coordinación pre-Fase 2 — sincronización del carril revisor sobre `dev`

Se integra en `dev` la capa de coordinación y revisión que faltaba después del saneamiento del carril repo (`v3.3.19`). No toca contenido funcional de negocio; deja explícito en el propio repositorio que Fase 2 sigue autorizada por gate, pero pausada hasta reconciliar `main` y `dev`.

#### Documentación / coordinación

- **`docs/PLAN-COORDINACION-PRE-FASE2.md`** (NUEVO en `dev`): define el orden operativo mínimo previo a Fase 2, la política de un solo agente escritor, la superficie real de divergencia entre ramas y la secuencia de integración pendiente.
- **`REVIEW-PRISMA-APEX.md`**: sincronizado con el estado real post-`v3.3.19`; se abre C11 como precondición operativa, se añade R08 y la bitácora deja explícito que el problema actual es de coordinación de ramas, no de cierre de Fase 1.
- **`docs/PLAN-FASE2.md`**: sección 9 ampliada con los pendientes operativos previos al subpaso 2.1 (`main`/`dev`, congelación de cambios paralelos, worktree limpio y validación en `dev.prismaconsul.com`).
- **`CLAUDE.md`**: se añade la sección `Coordinación Operativa Antes De Fase 2` con las reglas de convivencia entre ramas, agentes y credenciales Git.

#### Versionado visible

- **`index.html`**: bump `v3.3.19` → `v3.3.20` en footer.
- **`portal/index.html`**: bump `v3.3.19` → `v3.3.20` en pantalla de login.
- **`CLAUDE.md`**: campo `Versión actual` actualizado a `v3.3.20`.

## [2026-05-01] — v3.3.19

### Carril repo — Unificación técnica pre-Fase 2 (saneamiento de superficie compartida main ↔ dev)

Saneamiento técnico del repositorio para preparar la reconciliación entre las ramas `main` (v3.2.54) y `dev` (v3.3.18). Trabajo acotado a la superficie repo, sin tocar contenido ARMC ni blueprint, sin alterar documentación central.

#### Decisiones aplicadas (carril repo)

- **`.gitignore`**: prevalece la versión de `dev` (incorpora `.claude/` y `.vscode/` al bloque `# Editor / IDE local config`).
- **`CLAUDE.md`**: prevalece la estructura de `dev` (secciones `Ecosistema de repositorios` y `Modo revisor permanente`); campo "Versión actual" actualizado a `v3.3.19`.
- **`index.html`**: footer (`data-es`, `data-en`, texto visible) actualizado a `v3.3.19`.
- **`portal/index.html`**: prevalece la estructura de `dev` (capa de registro de rutas `ANALISIS_REGISTRY` + función `getAnalysisPaths()`, sección Blueprint en `ANALISIS_SECTIONS`, array `ANALISIS_BLUEPRINT`, guardas en visores); `welcome-version` actualizado a `v3.3.19`.
- **`CHANGELOG.md`**: fusión histórica acotada — `dev` como base + preservación verbatim de las 3 entradas exclusivas de `main` (`v3.2.52`, `v3.2.53`, `v3.2.54`) inyectadas en orden cronológico, sin renumerar y sin pérdida.

#### Fuera de alcance de este carril

- Reconciliación efectiva de ramas (merge, fast-forward, reset) — pendiente de paquete específico.
- Smoke runtime de `portal/index.html` tras la unificación — pendiente del carril de validación runtime.
- Blueprint, análisis ARMC, contenido narrativo y Sprint A documental — siguen en sus carriles propios.

## [2026-05-01] — v3.2.54

### Análisis ARMC — Catch-up del Diagnóstico Integrado a producción (Resumen Ejecutivo profundo + correcciones del dictamen)

Publicación a producción de las actualizaciones acumuladas en `dev` desde v3.2.53: revisión profunda del Resumen Ejecutivo (v3.3.15 + v3.3.16) + correcciones del dictamen de revisor (v3.3.18). 5 archivos consolidados. Cambios in-place, sin secciones nuevas (salvo el Hallazgo 06 dentro del Resumen Ejecutivo). No incluye trabajo de blueprint ni Sprint A — siguen solo en `dev`.

#### `portal/analisis/armc/diagnostico/resumen-ejecutivo.html` (catch-up de v3.3.15 + v3.3.16)

- **KPI "Fricciones documentadas"**: 42+ → **52+**.
- **Subtítulo**: precisado — "8 entrevistas en total" (1 por rol + 2ª entrevista CEO de validación del catálogo del 2026-04-15) + 3 cirujanos externos identificados sin entrevista directa.
- **Atribución cita central**: "7 entrevistas" → "8 entrevistas a 7 roles" (fix de coherencia v3.3.16).
- **Hallazgo 02 "Historia clínica es un registro muerto"**: evidencia ampliada con gaps documentales confirmados por la 2ª entrevista CEO — lipoenzimas sin CI específico, PNO de obesidad pendiente.
- **Hallazgo 03**: título reescrito a "Retención del 10% — catálogo amplio infrautilizado". Cuerpo ampliado con catálogo confirmado (5 líneas, ~52 procedimientos, 16 servicios oficiales infrautilizados).
- **Hallazgo 05 "Fotos clínicas dispersas"**: 4+ → **5+ dispositivos** (incluida Elián con celular + iPad + cámara especializada).
- **Hallazgo 06 NUEVO**: "Catálogo oficial confirmado pero invisible al mercado" (5 → 6 hallazgos principales).
- **Voces del equipo**: añadida cita de Marisela de la 2ª entrevista CEO.
- **Conclusión**: ampliada con catálogo definitivo + visibilizar catálogo + bloque amarillo destacado con C07/C08 pendientes.

#### `portal/analisis/armc/diagnostico/mapa-fricciones.html` (correcciones del dictamen v3.3.18)

- **KPI fricciones transversales**: 42+ → **52+** (sincronización con Resumen Ejecutivo).
- **Fricción "Fotos clínicas dispersas"**: "4+ teléfonos personales" → "5+ dispositivos personales" con desglose explícito (Gabriel, Divani, Óscar, Brisa y Elián + iPad + cámara especializada).

#### `portal/analisis/armc/diagnostico/cadena-causal.html` (corrección del dictamen v3.3.18)

- **Nodo D1 "Fotos en X dispositivos"**: 4+ → **5+** (sincronización).

#### `portal/analisis/armc/diagramas/flujo-atención-paciente.html` (correcciones del dictamen v3.3.18)

- **Handoff Carlos → Cirujano externo**: reformulado para que el as-is no afirme ownership. Antes decía "Carlos coordinaría la 2ª valoración"; ahora dice "Cirujano externo (...) — handoff hipotético, no validado: alguien debe coordinar... la hipótesis de trabajo es que recae en Carlos pero NO consta como ownership confirmado". C08 explícitamente marcado como abierto.
- **Fricción "Coordinación con cirujanos externos"**: reformulada igual — "Quién agenda esa derivación está abierto — la hipótesis de trabajo es Carlos pero NO está validado por la CEO".

#### `docs/VALIDACION-CATALOGO-ARMC.md` (correcciones del dictamen v3.3.18)

- **Fila 3.6 sobre masajes post-quirúrgicos**: corregida contradicción interna del documento. La fila decía "incluidos en cirugía, no se cobran aparte" pero la sección 5.3 del mismo documento contenía la corrección de la CEO afirmando que SÍ se cobran aparte. Fila 3.6 ahora alineada con 5.3.
- **Encabezado**: actualizada "Última actualización" a 2026-04-30. Estado pasa a "validado con la CEO en reunión 2026-04-15. 32/32 preguntas resueltas. 2 puntos derivados quedan abiertos en REVIEW-PRISMA-APEX C07 y C08".

## [2026-04-30] — v3.3.18

### Análisis ARMC — Correcciones tras dictamen de revisor (Hallazgo Alta + 2 Media + 1 Baja)

Aplicación de las correcciones del dictamen externo sobre el primer pase post-CEO. 6 ediciones in-place sobre 4 archivos. **NO se modifica `REVIEW-PRISMA-APEX.md`** — es propiedad del usuario/otro agente y queda fuera del scope del asistente.

#### `docs/VALIDACION-CATALOGO-ARMC.md` (2 ediciones)

- **Hallazgo Alta — fila 3.6 sobre masajes post-quirúrgicos**: corregida la contradicción interna del documento. La fila decía "incluidos en cirugía, no se cobran aparte" pero la sección 5.3 del mismo documento contiene la corrección de la CEO afirmando que SÍ se cobran aparte. La fila 3.6 ahora refleja la versión correcta de 5.3 y deja constancia explícita de que 5.3 prevalece. El derivado en `flujo-cirujano.html` ya estaba alineado con la versión correcta.
- **Hallazgo Baja — encabezado**: actualizada "Última actualización" de 2026-04-15 a 2026-04-30 con detalle de las correcciones aplicadas. Estado pasa de "en proceso de validación" a "validado con la CEO en reunión 2026-04-15. 32/32 preguntas resueltas. 2 puntos derivados quedan abiertos en REVIEW-PRISMA-APEX C07 y C08".

#### `portal/analisis/armc/diagnostico/mapa-fricciones.html` (2 ediciones)

- **Hallazgo Media #1 — KPI fricciones transversales**: 42+ → **52+** (sincronización con el Resumen Ejecutivo).
- **Hallazgo Media #1 — fricción "Fotos clínicas dispersas"**: "4+ teléfonos personales" → "**5+ dispositivos personales**" (Gabriel, Divani, Óscar, Brisa y Elián, además del iPad personal de Elián y la cámara especializada de tricología).

#### `portal/analisis/armc/diagnostico/cadena-causal.html` (1 edición)

- **Hallazgo Media #1 — nodo D1**: "Fotos en 4+ dispositivos personales" → "Fotos en **5+** dispositivos personales".

#### `portal/analisis/armc/diagramas/flujo-atención-paciente.html` (2 ediciones)

- **Hallazgo Media #2 — handoff Carlos → Cirujano externo (línea 600)**: reformulado para que el as-is no afirme ownership. Antes decía "Carlos coordinaría la 2ª valoración"; ahora dice "Cirujano externo (...) — handoff hipotético, no validado: alguien debe coordinar... la hipótesis de trabajo es que recae en Carlos pero no consta como ownership confirmado". C08 explícitamente marcado como abierto.
- **Hallazgo Media #2 — fricción "Coordinación con cirujanos externos sin sistema" (línea 667)**: reformulado igual — "Quién agenda esa derivación está abierto — la hipótesis de trabajo es Carlos pero NO está validado por la CEO".

**No se aplica** la corrección de versión stale en `REVIEW-PRISMA-APEX.md` que sugería el dictamen — ese archivo es propiedad del otro agente. Si requiere actualización, debe hacerse fuera del scope del asistente. Pendiente menor: catch-up retroactivo sobre el commit `785d90c` del flujo-enfermero (no tuvo bump propio en su momento). Documentado aquí como nota.

## [2026-04-30] — v3.3.17

### Cierre formal de Fase 1 — Sprint A bloque D validado en los 4 repos hermanos

Cierre formal de Fase 1 del Sprint A tras validación durable del bloque D-3 (replicación de la sección "Ecosistema de repositorios" en los repos hermanos) por parte del revisor:

- **`above-pharma`** — validado previamente en commit propio del repo
- **`apex-agents`** — validado en `7205be7`
- **`prisma-consulting`** — validado en `9ed1324`
- **`prisma-server-ops`** — validado en `2249f78`

Con la validación de `prisma-server-ops` desaparece el último bloqueo señalado en `REVIEW-PRISMA-APEX.md` ("integración durable en los 3 repos hermanos"). El propio review ya fue sincronizado por el revisor para reflejar el cierre.

#### Repositorio (sin cambios de código)

- `index.html`: bump de versión en footer (`data-es`, `data-en` y texto visible)
- `portal/index.html`: bump de versión en pantalla de login (`.welcome-version`)
- `CLAUDE.md`: bump del campo "Versión actual"
- `CHANGELOG.md`: esta entrada

#### Estado del Sprint A

- `MODELO-DOMINIO.md`, `ECOSISTEMA.md`, `CONTRATOS.md`, `GLOSARIO.md`: aprobados
- Bloques A, B, C y D: cerrados con PASS
- **Fase 1: cerrada formalmente**
- **Fase 2: desbloqueada y autorizada**, pendiente de ejecución controlada conforme a `docs/PLAN-FASE2.md` con validación runtime específica por subpaso

#### Notas

- El endurecimiento operativo de credenciales GitHub, runbooks específicos y posibles guardrails preventivos quedan como **follow-up separado**, fuera del alcance de este cierre y sin alterar el dictamen de Fase 1.
- Colisión de versionado: el slot `v3.3.16` quedó ocupado por una sesión paralela (`d7f24fd`, fix Resumen Ejecutivo); se promueve al siguiente disponible `v3.3.17` conforme a la convención de no pre-reservar números.

## [2026-04-30] — v3.3.16

### Fix Resumen Ejecutivo — atribución del hallazgo central coherente con 8 entrevistas

Corrección menor de coherencia tras v3.3.15. La atribución de la cita del hallazgo central decía "7 entrevistas" cuando ya el subtítulo refleja "8 entrevistas en total". Se actualiza para mantener consistencia.

#### `portal/analisis/armc/diagnostico/resumen-ejecutivo.html` (1 edición)

- Atribución de la cita del hallazgo central: "Conclusión del análisis cruzado, 7 entrevistas" → "Conclusión del análisis cruzado, **8 entrevistas a 7 roles**". Coherente con el subtítulo (que ya refleja las 8 entrevistas: 1 por rol + 2ª entrevista CEO de validación del catálogo).

## [2026-04-30] — v3.3.15

### Análisis ARMC — Revisión profunda del Resumen Ejecutivo a la luz de la 2ª entrevista CEO

Tras completar el primer pase post-entrevista CEO en los 7 flujos por rol y en la documentación transversal de cirujanos externos, el Resumen Ejecutivo del Diagnóstico Integrado quedaba desfasado. 8 actualizaciones in-place dentro de secciones existentes — sin cambios estructurales, salvo la incorporación de un 6º hallazgo principal que destaca la fricción del catálogo invisible.

#### `portal/analisis/armc/diagnostico/resumen-ejecutivo.html` (8 ediciones)

- **KPI "Fricciones documentadas"**: 42+ → **52+** (refleja las ~10 fricciones nuevas añadidas durante el primer pase post-CEO).
- **Subtítulo**: precisado — "8 entrevistas en total" (1 por rol + 2ª entrevista CEO de validación del catálogo del 2026-04-15) + 3 cirujanos externos identificados sin entrevista directa.
- **Hallazgo 02 "Historia clínica es un registro muerto"**: evidencia ampliada con 2 gaps documentales confirmados por la 2ª entrevista CEO — lipoenzimas faciales/corporales sin CI específico estandarizado y manejo integral de obesidad sin PNO formal redactado.
- **Hallazgo 03**: título reescrito de "Retención del 10% — aparatología parada" a "Retención del 10% — catálogo amplio infrautilizado". Cuerpo ampliado con el catálogo confirmado por la CEO: 5 líneas con ~52 procedimientos, de los cuales 16 servicios oficiales (Aparatología 7 + Cosmiatría 9) están infrautilizados. Fricción DOBLE: del rol y del catálogo.
- **Hallazgo 05 "Fotos clínicas dispersas"**: 4+ → 5+ dispositivos (incluida Elián con celular + iPad personal + cámara especializada).
- **Hallazgo 06 NUEVO**: "Catálogo oficial confirmado pero invisible al mercado" — 5 líneas con 52 procedimientos oficiales pero promoción real cubre solo ~7 (Cosmiatría, Aparatología, Tricología, hallazgos nuevos no se promocionan). Causa estructural directa de la subutilización del rol Cosmiatra y de la baja retención. Total hallazgos principales: 5 → 6.
- **Voces del equipo**: añadida cita de Marisela de la 2ª entrevista CEO — "Primero, aunque quieran alguna liposucción, primero la hacen con nosotros" (sobre la valoración previa obligatoria como Variante A).
- **Conclusión**: ampliada con (a) catálogo definitivo confirmado por la CEO (5 líneas, 52 procedimientos, 3 cirujanos externos), (b) la solución APEX no solo modela D1 sino que también debe visibilizar el catálogo completo, (c) bloque amarillo destacado con las 2 decisiones pendientes de cerrar con la propia CEO (C07 — costo 2ª valoración pre-cirugía con externo; C08 — quién agenda Variantes B/C y leads de obesidad). Trazadas en `REVIEW-PRISMA-APEX.md` Sección 7.

## [2026-04-30] — v3.3.14

### Análisis ARMC — Documentación transversal de cirujanos externos (Opción A)

Tras decidir NO crear un perfil/flujo separado para los 3 cirujanos externos (Figueroa, Vargas, Ducón) — porque no han sido entrevistados directamente y crear un flujo "ground truth" sin entrevista rompería el patrón de los demás —, se documentan de forma transversal en blueprint, diagnóstico y flujo del Cirujano. Cambios in-place dentro de secciones existentes — sin cambios estructurales, sin perfil nuevo.

#### Blueprint (3 archivos)

- **`portal/analisis/armc/blueprint/modelo-datos.html`** (RBAC): añadida fila nueva en tabla "Cirujano externo subcontratado (sub-rol)" con acceso restringido a su propio expediente. Nota explicativa con los 3 nombres confirmados (Figueroa, Vargas, Ducón) y referencias a REVIEW-PRISMA-APEX C07/C08.
- **`portal/analisis/armc/blueprint/flujos-to-be.html`** (card Cirujano): añadido item en columna To-Be — sub-rol Cirujano externo con acceso limitado al expediente del paciente que él mismo opera.
- **`portal/analisis/armc/blueprint/fases-implementacion.html`** (F1): RBAC ampliado mencionando el sub-rol Cirujano externo + nuevo item "Modelado de Personal Externo subcontratado + protocolo de derivación 2ª valoración pre-cirugía (Variante B). Cierra C07 y C08".

#### Diagnóstico (2 archivos)

- **`portal/analisis/armc/diagnostico/mapa-fricciones.html`**: añadida fricción transversal nº 9 — "Coordinación con cirujanos externos sin canal formal" (3 roles: Atención, Cirujano, CEO). Contador actualizado 8 → 9.
- **`portal/analisis/armc/diagnostico/resumen-ejecutivo.html`**: subtítulo actualizado para incluir los 3 cirujanos externos identificados. Bloque destacado nuevo en el hallazgo central documenta personal externo, decisión de quedarse con expediente/CI originales, y referencia a la fricción transversal nº 9.

#### Flujo por rol (1 archivo)

- **`portal/analisis/armc/diagramas/flujo-cirujano.html`** (Slide Perfil): añadida entrada "Procedimientos que NO realiza Gabriel (derivados a cirujanos externos)" — rinoplastia (Vargas/Ducón), mastopexía y abdominoplastía (Figueroa). Cierra el bucle visualmente sin contradecir la decisión previa de excluir externos del flujo de Gabriel.

**Decisión registrada**: NO se crea perfil/flujo separado para los cirujanos externos. Justificación: los flujos por rol son patrimonio de las entrevistas directas; crear uno sin entrevista contaminaría la calidad. Si en el futuro se entrevista a alguno de los externos, sí se podrá crear su flujo propio.

## [2026-04-30] — v3.3.13

### Análisis ARMC — Flujo CEO (Marisela) post-2ª entrevista (validación catálogo)

Cierre del primer pase con la propia CEO. El flujo de Marisela ya existía desde la entrevista de descubrimiento operativo, pero faltaba absorber los hallazgos de la 2ª entrevista (validación de catálogo del 2026-04-15) que ella misma protagonizó. Cambios in-place dentro de secciones existentes — sin cambios estructurales.

#### `portal/analisis/armc/diagramas/flujo-ceo.html` (8 ediciones)

- **Slide "Perfil y rol"**, entrada Responsabilidades: aclarado que las valoraciones corresponden a la Variante A (Marisela O Divani — gratuita); las Variantes B y C no involucran a Marisela.
- **Slide "Expansión y servicios"**, entrada cirugía plástica: ampliada con los 3 cirujanos externos confirmados — Dr. Figueroa (mastopexia, abdominoplastía), Dra. Vargas (rinoplastia), Dr. Ducón (rinoplastia, hallazgo nuevo). Los externos se quedan con expediente y CI originales.
- **Slide "Captación y flujo del paciente"**, paso 2 del flujo de 10 pasos: ampliado con las 3 variantes A/B/C de la consulta de valoración.
- **Slide "Retención — problema central"**, entrada "Servicios disponibles no ofrecidos": contextualizada con catálogo oficial — la aparatología infrautilizada son 7 servicios oficiales de Línea 3, los faciales son parte de Cosmiatría (Línea 4) con 9 servicios + sublíneas. Brisa los puede operar todos. 16 servicios oficiales ignorados en oferta y promoción.
- **Slide "Expediente y regulación"**: añadida entrada nueva sobre 2 gaps documentales identificados en la 2ª entrevista CEO — lipoenzimas activas sin CI estandarizado, PNO de manejo de obesidad pendiente de redacción. Marisela se comprometió a verificar ambos.
- **Sección "Vacíos de información"**: añadido nuevo `<details>` "Vacíos resueltos por 2ª entrevista CEO — validación catálogo (5)" — catálogo definitivo de 5 líneas y ~52 procedimientos, personal externo identificado, 3 variantes de valoración, Cosmiatría y Tricología como líneas propias, manejo de obesidad confirmado.
- **Sección "Puntos de Handoff"**: añadido handoff Marisela/Divani → Cirujanos externos (Figueroa/Vargas/Ducón) para Variante B de valoración pre-cirugía. Marca pendiente de C08 (quién agenda B/C/leads obesidad).
- **Sección "Fricciones identificadas"**: añadidas 2 fricciones nuevas — (a) catálogo oficial confirmado pero promoción restringida a ~7 procedimientos en pautas Meta (Cosmiatría, Aparatología, Tricología y hallazgos nuevos no se promocionan); (b) decisiones pendientes de la propia CEO — C07 (costo 2ª valoración pre-cirugía con externo) y C08 (quién agenda B/C/leads obesidad). Bloquean el modelado del flujo de agendamiento en APEX.

**Cierre completo del primer pase post-entrevista CEO**: 7 flujos revisados (los 6 roles operativos + la propia CEO). Carlos y Gabriel ya en producción; los 5 restantes pendientes de publicar.

## [2026-04-30] — v3.3.12

### Análisis ARMC — Flujo Tricología (Elián) post-entrevista CEO

Sexto y último rol revisado a la luz de la entrevista CEO 2026-04-15. Tricología es rol moderadamente afectado: la CEO confirma el área como línea propia (línea 5 del catálogo) con 8 servicios oficiales y aclara aspectos clave del manejo de obesidad/tirzepatida que Elián lidera. El cambio 4 cierra el solapamiento Divani/Elián identificado en la revisión anterior. Cambios in-place dentro de secciones existentes — sin cambios estructurales.

#### `portal/analisis/armc/diagramas/flujo-tricologia.html` (6 ediciones)

- **Slide "Perfil y rol"**, entrada "Área capilar opera de forma separada": ampliada con confirmación CEO de Tricología regenerativa como línea propia (línea 5) con 8 servicios oficiales — antes estaba dentro de "Otros".
- **Slide "Tratamientos capilares"**, entrada "Microinjerto y prótesis capilares: aún NO activos": ampliada con confirmación CEO de la separación oficial "Consulta capilar regenerativa" vs "Implante capilar = 🔮 futuro" (antes era un solo ítem ambiguo en el catálogo).
- **Slide "Control de peso: consulta y tratamiento"**, entrada "ÁREA ADICIONAL: también lleva control de peso": ampliada con confirmación CEO de que Elián lidera el manejo integral de obesidad oficial dentro de Medicina Estética (línea 2). Servicio activo. ⚠️ Falta PNO formal.
- **Slide "Control de peso: bitácora y equipo"**, entrada "Divani puede poner la inyección si Elián no está": añadido contexto que cierra el solapamiento Divani/Elián identificado en el flujo del Primer Ayudante — el reparto es Elián = principal (consulta, dieta, dosis), Divani = respaldo via bitácora compartida (solo aplicación cuando Elián no está).
- **Sección "Vacíos de información"**: añadido nuevo `<details>` "Vacíos resueltos por otras entrevistas (3)" siguiendo el patrón estándar — Tricología como línea propia con 8 servicios, Implante capilar = futuro confirmado, manejo de obesidad ubicado en Medicina Estética con PNO pendiente.
- **Sección "Fricciones identificadas"**: añadida fricción nueva — "Manejo de obesidad activo sin PNO formal" (Elián lidera el servicio sin Procedimiento Normalizado de Operación documentado, mismo patrón que las lipoenzimas sin CI).

**Cierre del primer pase de revisión post-entrevista CEO**: 6 roles completos en `dev` (Carlos, Gabriel, Óscar, Brisa, Divani, Elián). Carlos y Gabriel ya en producción; los 4 restantes pendientes de publicar.

## [2026-04-30] — v3.2.53

### Análisis ARMC — Documentación transversal de cirujanos externos en producción (parcial — Opción A)

Publicación a producción de la documentación transversal de los 3 cirujanos externos (Figueroa, Vargas, Ducón) bajo la Opción A (no se crea perfil/flujo separado). De las 6 ediciones aplicadas en `dev` (v3.3.14), esta publicación trae a producción solo las 3 que NO son de blueprint, manteniendo la regla histórica de que el blueprint vive solo en `dev`.

#### Diagnóstico (2 archivos)

- **`portal/analisis/armc/diagnostico/mapa-fricciones.html`**: añadida fricción transversal nº 9 — "Coordinación con cirujanos externos sin canal formal" (3 roles: Atención, Cirujano, CEO). Contador actualizado 8 → 9.
- **`portal/analisis/armc/diagnostico/resumen-ejecutivo.html`**: subtítulo actualizado para incluir los 3 cirujanos externos identificados. Bloque destacado nuevo en el hallazgo central documenta personal externo, decisión de quedarse con expediente/CI originales, y referencia a la fricción transversal nº 9.

#### Flujo por rol (1 archivo)

- **`portal/analisis/armc/diagramas/flujo-cirujano.html`** (Slide Perfil): añadida entrada "Procedimientos que NO realiza Gabriel (derivados a cirujanos externos)" — rinoplastia (Vargas/Ducón), mastopexía y abdominoplastía (Figueroa). Cierra el bucle visualmente sin contradecir la decisión previa de excluir externos del flujo de Gabriel.

**No se publican a producción** (siguen solo en `dev`):
- `portal/analisis/armc/blueprint/modelo-datos.html` (RBAC con sub-rol Cirujano externo)
- `portal/analisis/armc/blueprint/flujos-to-be.html` (card Cirujano con item To-Be sub-rol externo)
- `portal/analisis/armc/blueprint/fases-implementacion.html` (F1 con item Modelado de Personal Externo)

Justificación: regla histórica del proyecto — el blueprint vive solo en `dev`, no en producción (commit `3a2b92e Remove blueprint section from production`).

## [2026-04-30] — v3.2.52

### Análisis ARMC — Publicación a producción de los 5 flujos restantes post-entrevista CEO

Cierre del primer pase de revisión de los 7 flujos a la luz de la entrevista CEO 2026-04-15. Esta publicación trae a producción los 5 flujos restantes (Óscar, Brisa, Divani, Elián, CEO Marisela). Carlos y Gabriel ya estaban en producción desde v3.2.45 y v3.2.46. Cambios in-place dentro de secciones existentes — sin cambios estructurales. No incluye trabajo de reorganización Sprint A (CONTRATOS, MODELO-DOMINIO, ECOSISTEMA, REVIEW-PRISMA-APEX, GLOSARIO, REGISTRO-RUTAS, PLAN-FASE2) que sigue solo en `dev`.

#### `portal/analisis/armc/diagramas/flujo-enfermero.html` (3 ediciones)

- Slide "Post-procedimiento y seguimiento", entrada "Masajes ultrasonido post-lipo → Brisa": añadida confirmación CEO de que estos masajes son procedimientos cobrados aparte (no incluidos en cirugía).
- Sección "Vacíos de información": añadido segundo bloque `<details>` "Vacíos resueltos por otras entrevistas (1)" siguiendo el patrón estándar — los 2 procedimientos nuevos del catálogo (lifting facial láser, bruxismo) que Óscar tendrá que preparar.
- Sección "Fricciones identificadas por análisis": añadida fricción nueva — lipoenzimas activas sin consentimiento informado estandarizado.

#### `portal/analisis/armc/diagramas/flujo-cosmiatra.html` (5 ediciones)

- Slide "Brisa: Perfil y rol", entrada SUBUTILIZACIÓN: ampliada con catálogo CEO — Cosmiatría línea propia con 9 servicios + Brisa también opera Aparatología (7 servicios) = 16 servicios oficiales vs 3-4 reales. Subutilización DOBLE.
- Slide "Tratamientos y aparatología", entrada Protocolo post-lipo: añadida confirmación CEO de masajes cobrados aparte.
- Sección "Vacíos de información": añadido `<details>` "Vacíos resueltos por otras entrevistas (3)" — Cosmiatría como línea propia, sublíneas melasma/acné con cobro por sesión, masajes reductivos = futuro.
- Sección "Fricciones identificadas", fricción "Rol subutilizado": ampliada con confirmación CEO del alcance oficial del rol.
- Sección "Fricciones identificadas": añadida fricción nueva — "Catálogo de Cosmiatría confirmado pero invisible al paciente" (causa estructural de la subutilización).

#### `portal/analisis/armc/diagramas/flujo-primer-ayudante.html` (4 ediciones)

- Slide "Valoraciones": Variante A confirmada (Marisela O Divani); B y C no involucran a Divani.
- Slide "Procedimientos": entrada tirzepatida ampliada con confirmación CEO (Elián lidera obesidad); solapamiento marcado como pendiente aclarar.
- Sección "Vacíos resueltos por otras entrevistas": 2 → 5 entradas — Variante A, manejo de obesidad/PNO pendiente, procedimientos nuevos del catálogo que realiza Gabriel.
- Sección "Fricciones identificadas": +2 nuevas (solapamiento Divani/Elián en obesidad sin protocolo, tirzepatida sin PNO formal).

#### `portal/analisis/armc/diagramas/flujo-tricologia.html` (6 ediciones)

- Slide "Perfil y rol": Tricología confirmada como línea propia (línea 5) con 8 servicios oficiales.
- Slide "Tratamientos capilares": separación oficial Consulta capilar regenerativa vs Implante capilar (🔮 futuro).
- Slide "Control de peso (consulta)": Elián lidera obesidad dentro de Medicina Estética; falta PNO formal.
- Slide "Control de peso (bitácora)": contexto del reparto Elián/Divani via bitácora compartida (cierra solapamiento del flujo Primer Ayudante).
- Sección "Vacíos resueltos por otras entrevistas": nuevo `<details>` con 3 entradas (Tricología línea propia, Implante capilar futuro, manejo obesidad ubicación + PNO pendiente).
- Sección "Fricciones identificadas": +1 fricción nueva — "Manejo de obesidad activo sin PNO formal".

#### `portal/analisis/armc/diagramas/flujo-ceo.html` (8 ediciones)

- Slide "Perfil y rol": Variante A clarificada (Marisela O Divani).
- Slide "Expansión y servicios": 3 cirujanos externos confirmados (Figueroa, Vargas, Ducón).
- Slide "Captación y flujo del paciente": 3 variantes A/B/C de la valoración en paso 2.
- Slide "Retención": contextualizada con catálogo oficial — 16 servicios oficiales ignorados en oferta y promoción.
- Slide "Expediente y regulación": gaps documentales — lipoenzimas sin CI + PNO obesidad pendiente.
- Sección "Vacíos resueltos por 2ª entrevista CEO": nuevo `<details>` con 5 entradas (catálogo definitivo, personal externo, 3 variantes valoración, Cosmiatría/Tricología líneas propias, manejo obesidad).
- Sección "Puntos de Handoff": +1 handoff Marisela/Divani → Cirujanos externos (Variante B).
- Sección "Fricciones identificadas": +2 fricciones (catálogo confirmado pero promoción restringida + decisiones pendientes de la propia CEO C07/C08).

**Cierre completo del primer pase post-entrevista CEO en producción**: los 7 flujos (6 roles operativos + CEO) ya están actualizados en `prismaconsul.com`. Quedan pendientes para próximas iteraciones: flujo nuevo "Cirujanos externos" (Figueroa/Vargas/Ducón), validación con CEO de los puntos abiertos C07 (costo 2ª valoración pre-cirugía con externo) y C08 (quién agenda B/C/leads obesidad).

## [2026-04-29] — v3.3.11

### Análisis ARMC — Flujo Primer Ayudante (Divani) post-entrevista CEO

Quinto rol revisado a la luz de la entrevista CEO 2026-04-15. Divani es un rol moderadamente afectado: la CEO lo confirma como segundo punto de la Variante A de valoración y revela un solapamiento con Dra. Elián por el manejo de obesidad/tirzepatida. Cambios in-place dentro de secciones existentes — sin cambios estructurales.

#### `portal/analisis/armc/diagramas/flujo-primer-ayudante.html` (4 ediciones)

- **Slide "Valoraciones"**, entrada "Cuándo hace valoraciones": ampliada con confirmación CEO de la Variante A (Marisela o Divani, gratuita). Aclarado que las Variantes B (pre-cirugía con especialista externo Figueroa/Vargas/Ducón) y C (vía directa con Gabush $1,950) no involucran a Divani.
- **Slide "Procedimientos"**, entrada "Tratamiento para bajar de peso": ampliada con confirmación CEO de que el servicio de manejo de obesidad lo lidera la Dra. Elián. Marcado solapamiento Divani/Elián sin reparto documentado — pendiente aclarar quién atiende cuándo.
- **Sección "Vacíos de información"**, `<details>` "Vacíos resueltos por otras entrevistas": de 2 → 5 entradas. Añadidas 3 resueltas por la CEO: (a) Variante A confirmada, (b) manejo de obesidad como servicio activo con PNO formal pendiente (lidera Elián), (c) procedimientos nuevos del catálogo (lifting facial láser, bruxismo) que realiza Gabriel y no afectan a Divani.
- **Sección "Fricciones identificadas"**: añadidas 2 fricciones nuevas — (a) solapamiento Divani/Elián en manejo de obesidad sin protocolo formal (pacientes pueden recibir tirzepatida sin trazabilidad de quién indicó la dosis), (b) tirzepatida y manejo de obesidad activos sin PNO formal redactado (servicio sin documentación regulatoria estandarizada).

## [2026-04-29] — v3.3.10

### Sprint A fase 1 — Bloque D: Modo revisor permanente + Replicación Ecosistema en otros repos

Cierre del bloque D de Fase 1, último entregable interno antes del cierre formal de Fase 1. No toca código del producto.

- **`CLAUDE.md` (web-de-prisma)**: añadida nueva sección "Modo revisor permanente" justo después del "Ecosistema de repositorios". Comportamiento base del workspace durante Sprint A: antes de aprobar cualquier cambio importante, contrastar contra `CONTRATOS.md`, `MODELO-DOMINIO.md`, buenas prácticas y impacto en verticales activas. Vigente Fase 1+2+3+4; tras Sprint A+B se evalúa si se mantiene.
- **`above-pharma/CLAUDE.md`**: replicada sección breve "Ecosistema de repositorios" + enlace al canónico `web-de-prisma/ECOSISTEMA.md`. Working tree limpio, **commit `a7f85c6` pusheado a `origin/main` directamente**.
- **`apex-agents/CLAUDE.md`**, **`prisma-consulting/CLAUDE.md`**, **`prisma-server-ops/CLAUDE.md`**: replicada sección breve "Ecosistema de repositorios" en cada uno. **NO commiteados** porque los working trees de los 3 tienen trabajo en progreso del usuario (9, 2 y 4 archivos modificados respectivamente). La modificación queda como cambio adicional para que el usuario la integre con su WIP cuando decida, sin que el agente arrastre trabajo ajeno en un commit propio.

Estado por repo:

| Repo | Estado | Acción del usuario |
|---|---|---|
| `web-de-prisma` | ✅ commit + push (este) | ninguna |
| `above-pharma` | ✅ commit `a7f85c6` + push a main | ninguna |
| `apex-agents` | 🟡 modificación local lista (no commiteada) | revisar WIP local + integrar el cambio cuando decida commitear |
| `prisma-consulting` | 🟡 idem | idem |
| `prisma-server-ops` | 🟡 idem | idem |

Bloque D operativamente completo: el modo revisor permanente activado en el repo principal, y la sección Ecosistema replicada en 4 de 4 repos hermanos (1 commiteada, 3 listas para que el usuario integre cuando vea su WIP).

## [2026-04-29] — v3.3.9

### Sprint A fase 1 — Bloque C PASS + sincronización del review vivo

Aplicación del dictamen final del revisor sobre `v3.3.8`. No toca código del producto.

- **`docs/PLAN-FASE2.md`:** aceptado como cierre válido del bloque C. La clasificación archivo por archivo, la secuencia de subpasos y el serving final de `/apex` quedan internamente coherentes y alineados con los canónicos aprobados.
- **`REVIEW-PRISMA-APEX.md`:** estado global actualizado para reflejar `bloque C PASS`, reducción de abiertos al solo bloque D, y nueva entrada de bitácora autorizando el arranque de bloque D.
- **Versionado visible:** bump documental a `v3.3.9` en `index.html`, `portal/index.html` y `CLAUDE.md`.

**Veredicto:** bloque C `PASS`. Próximo entregable interno autorizado: **bloque D — modo revisor permanente en `CLAUDE.md` + replicación Ecosistema en los otros 4 repos**.

## [2026-04-29] — v3.3.8

### Sprint A fase 1 — Bloque C: coherencia interna de PLAN-FASE2.md sobre serving de /apex

Aplicación del último hallazgo del revisor sobre `v3.3.6`. No toca código del producto. La inconsistencia residual era textual: la corrección crítica del subpaso 2.4 (de `sendFile` a `static mount` para preservar assets relativos del discovery) no se había propagado al estado consolidado de la sección 5 ni a la decisión PF2-3.

- **`docs/PLAN-FASE2.md` sección 5 (Cambios al `server.js` consolidados)**: el bloque final de `/apex` reescrito de `app.get('/apex', sendFile)` a `app.use('/apex', express.static(...))` con comentario explícito advirtiendo que NO usar sendFile rompería los 4 assets relativos. Referencia cruzada al subpaso 2.4.
- **`docs/PLAN-FASE2.md` decisión PF2-3**: reescrita para reflejar que discovery se sirve por **static mount** bajo `/apex`, NO por handler explícito. Razón documentada inline: preservar la resolución de assets relativos (`form.css`, `form.js`, `signal-detector.js`) que el HTML consume.

Estado: bloque C internamente coherente. Espera del PASS final del revisor antes de arrancar bloque D.

## [2026-04-29] — v3.3.7

### Análisis ARMC — Flujo Cosmiatra (Brisa) post-entrevista CEO

Cuarto rol revisado a la luz de la entrevista CEO 2026-04-15. Cosmiatría es uno de los roles más afectados — la CEO confirmó Cosmiatría como línea propia (línea 4) con 9 servicios oficiales + 2 sublíneas (melasma, acné), y Brisa también opera Aparatología (línea 3, 7 servicios). El catálogo oficial le da 16 servicios disponibles vs los 3-4 reales que ejecuta. Cambios in-place dentro de secciones existentes — sin cambios estructurales.

#### `portal/analisis/armc/diagramas/flujo-cosmiatra.html` (5 ediciones)

- **Slide "Brisa: Perfil y rol"**, entrada SUBUTILIZACIÓN: ampliada con catálogo CEO (9 servicios cosmiatría + 7 aparatología = 16 oficiales vs 3-4 reales). La subutilización es DOBLE — del rol y del catálogo.
- **Slide "Tratamientos y aparatología"**, entrada Protocolo post-lipo (5 masajes semanales): añadida confirmación CEO de que estos masajes son procedimientos cobrados aparte (no incluidos en el precio de la cirugía).
- **Sección "Vacíos de información"**: añadido nuevo bloque `<details>` "Vacíos resueltos por otras entrevistas (3)" siguiendo el patrón estándar de Carlos, Gabriel y Óscar — Cosmiatría confirmada como línea propia con 9 servicios, sublíneas melasma y acné con cobro por sesión, masajes reductivos = futuro (no se ofrecen hoy).
- **Sección "Fricciones identificadas"**, fricción "Rol subutilizado": ampliada con confirmación CEO del alcance oficial del rol (16 servicios disponibles vs ejecución mínima).
- **Sección "Fricciones identificadas"**: añadida fricción nueva — "Catálogo de Cosmiatría confirmado pero invisible al paciente" (los 9 servicios + sublíneas no se promocionan, no aparecen en pautas Meta, sin agendamiento dedicado; causa estructural de la subutilización).

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
