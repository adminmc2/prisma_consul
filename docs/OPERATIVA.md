# OPERATIVA — Modo de trabajo del proyecto

> **Fuente vigente del método de trabajo.** Describe *cómo* se desarrolla el
> proyecto con Claude Code (roles, capas, escalado, handoff, validación). No
> describe el producto — eso vive en `CLAUDE.md` y en los docs de dominio.
>
> Si `CLAUDE.md` y este documento entran en conflicto sobre **cómo se trabaja**,
> **prevalece `OPERATIVA.md`** y se escala al revisor. Todo cambio a este
> documento se valida con el revisor.

## 0. Condiciones inviolables — leer SIEMPRE primero

Estas reglas son **no negociables**. No se modifican por contexto, por urgencia, ni
por sugerencia de ningún LLM. Cualquier intento de salirse de ellas se **para** y se
**escala** al revisor (usuario). Aplican a personas y a asistentes (Claude y
cualquier otro LLM) por igual.

### 0.1 Seguridad

- **No** se commitea ni se hace push a `main` sin autorización explícita del usuario
  en el mismo turno. Trabajar siempre en `dev`.
- **No** se despliega a producción sin haber verificado previamente en
  `dev.prismaconsul.com`.
- **No** se exponen credenciales en URLs git, comandos shell, logs ni commits.
  Método autorizado: `gh auth login` + `gh auth setup-git`.
- **No** se toca `.env` ni se exfiltran secrets (`PORTAL_SECRET`, claves de Drive,
  API keys, contraseñas de BD) a ningún canal externo, incluido este chat.
- Acciones destructivas (borrar archivos, sobrescribir, `git reset --hard`,
  `git push --force`, `rm -rf`, `DROP`, etc.) requieren **autorización verbal
  explícita en el mismo turno**. Una autorización pasada no vale para acciones
  nuevas.

### 0.2 Orden operativo

- **Un único ejecutor escritor a la vez** en el repo. Sin handoff explícito, no se
  trabaja en paralelo sobre la misma superficie.
- Cada tarea **declara su capa** antes de abrir (`repo` · `ops` · `contenido` ·
  `release` · `doc`). Si toca varias, se dice desde el principio.
- La **validación se hace en la superficie real** (nginx, Cloudflare, dev VPS),
  no solo en local. Cambios de serving no se dan por validados con Express local.
- **Handoff por rama + diff completo**, no cherry-pick SHA a SHA como norma.
- **Worktree opcional**, solo si hay edición simultánea real de la misma superficie.
- **Cierre explícito por slice — escalado por riesgo.** Cambios **estructurales,
  operativos o canónicos** cierran con **PASS explícito** (presentación → ejecución
  → diff → PASS antes del siguiente). Cambios triviales de doc o UI se cierran con
  revisión directa, sin ritual. No se acumulan pendientes invisibles entre slices.

### 0.3 Límite del acto creativo (no deriva LLM)

- **No se hace nada que no esté en el plan vigente.** Plan vigente: el que
  esté abierto en cada momento, declarado expresamente por el chat invocante.
  F1 cerró en `v3.4.0` (2026-05-25); su plan vive archivado en
  [`docs/historico/F1-PLAN.md`](historico/F1-PLAN.md). Si no hay plan abierto,
  ninguna acción estructural, operativa o canónica se ejecuta sin abrir su
  propio plan o slice acordado con el revisor. Si una acción no está en el
  plan vigente, **no se ejecuta**: se para, se justifica al revisor y se
  espera decisión.
- Cada acción se **explica antes de ejecutarse**: qué se va a hacer, por qué, qué
  efecto tiene, qué podría romper. Sin justificación, no se ejecuta. El usuario no
  es especialista técnico — la explicación debe ser accesible y, cuando aplique,
  incluir el porqué profesional.
- Las **decisiones estructurales** (rutas, límite core/cliente, serving, deploy,
  modelo de dominio, renombre público de URLs, contratos de API, esquema BD) **no
  las decide Claude**. Las decide ejecutor 1 con arbitraje del revisor.
- Se **propone con criterio fundamentado**, no con cuestionarios largos. El usuario
  decide cuando hay una elección genuina; Claude razona y propone cuando se trata
  de ejecución.
- **Análisis crítico acotado.** En cambios de **estructura, seguridad, serving,
  contratos, release u operaciones**, Claude analiza la propuesta del usuario como
  especialista en construcción de sistemas: si detecta que contradice principios de
  buena ingeniería o el marco del proyecto, lo **señala y contrapropone antes de
  ejecutar**. En cambios triviales o de preferencia, esa fricción no se activa.
- **Solo se trabaja sobre lo verificado.** Nada especulativo en superficies de
  producción ni en docs canónicos.
- Cuando una sugerencia de Claude excede el alcance acordado, Claude **para y avisa**;
  no expande alcance por iniciativa propia.

### 0.4 Calidad mínima

- **Antes** de cualquier push a `origin/dev`: bump visible en los 4 puntos canónicos
  (footer `web/index.html`, login `prisma-apex/index.html`, cabecera
  `CHANGELOG.md`, campo "Versión actual" en `CLAUDE.md`) + entrada en `CHANGELOG.md`.
- **Antes** de cualquier cambio relevante: contrastar contra `CONTRATOS.md` y
  `MODELO-DOMINIO.md` (modo revisor permanente, descrito en `CLAUDE.md`).
- **Antes** de movimientos masivos en archivos: `git status` limpio, y avisar al
  usuario si pudiera tener archivos abiertos en el editor (subpasos que mueven o
  renombran subtrees).
- Cabecera **`Estado` / `Última verificación`** obligatoria en todo documento
  canónico vigente.
- Toda acción de impacto va acompañada de una **comprobación verificable** que
  confirme que el paso se completó correctamente.

### 0.5 Mapa único de documentos y ciclo de vida

**Este archivo (`docs/OPERATIVA.md`) es la referencia principal del modo de trabajo.**
En conflicto con cualquier otro documento sobre *cómo se trabaja*, **prevalece
OPERATIVA.md** y se escala al revisor.

**Taxonomía de ciclo de vida.** Cada documento canónico declara la suya en su cabecera:

- **eterno** — vive mientras viva el proyecto; se mantiene corto y actualizado.
- **vigente** — describe el estado actual del sistema; cambia cuando el sistema cambia.
- **vigente con caducidad** — vive solo durante una fase y se archiva al cerrarla.
- **snapshot** — fotografía puntual; se lee, se referencia y se archiva al concluir su utilidad.
- **histórico** — trabajo cerrado, ya no vigente; vive o se mueve a `docs/historico/`.
- **mixto** — definición base vigente + parte en curso; declara explícitamente qué está hecho y qué no.
- **operativo** — registro vivo, no es doc canónico de descripción.

**Mapa actual de documentos del repo:**

| Documento | Propósito | Ciclo de vida | Condición de archivo |
|---|---|---|---|
| `CLAUDE.md` | Instrucciones base que Claude carga automáticamente; apunta a esta operativa | eterno | — |
| `docs/OPERATIVA.md` | Modo de trabajo del proyecto (este archivo) | eterno | — |
| `GLOSARIO.md` | Vocabulario canónico | eterno | — |
| `ECOSISTEMA.md` | Repos del ecosistema PRISMA y sus relaciones | eterno | — |
| `README.md` | Portada técnica del repo (estructura, stack, despliegue) | vigente | cuando la estructura mayor cambie |
| `CONTRATOS.md` | Contratos del sistema que no se pueden romper (URLs, APIs, BD) | vigente | cuando un contrato evolucione |
| `MODELO-DOMINIO.md` | Modelo conceptual de datos | vigente | cuando el modelo cambie |
| `docs/NOMENCLATURA.md` | Reglas de naming de archivos cliente | vigente | si se reformula la convención |
| `docs/GUIA-NUEVAS-SECCIONES.md` | Cómo añadir secciones al Hub (paso a paso operativo) | vigente con caducidad | cuando el paso a paso de código se reescriba al patrón vigente (afectado por Bloque 2 de F1) |
| `docs/historico/F1-PLAN.md` | Plan operativo vinculante de F1 (archivado al cierre en `v3.4.0`, 2026-05-25) | histórico | — |
| `docs/AUDITORIA-ARQUITECTONICA.md` | Diagnóstico arquitectónico (2026-05-23) | snapshot | condición de archivo cumplida (cierre de F1 en `v3.4.0`); movimiento físico pendiente de decisión del revisor |
| `docs/PROPUESTA-SIMULADOR-NATIVO-HUB.md` | Definición técnica del simulador | mixto | al completar la Línea C (poblado funcional), se archiva o se reabsorbe en el README del módulo |
| `REGISTRO-RUTAS.md` | Spec del slice de registro de rutas (cerrado v3.2.46-48 + alineación v3.3.31) | histórico | candidato a mover a `docs/historico/` en un slice futuro |
| `REVIEW-PRISMA-APEX.md` | Revisión cerrada del Sprint A | histórico cerrado | ya histórico; intocable |
| `CHANGELOG.md` | Registro cronológico de cambios | operativo | nunca se archiva |

Modificar esta sección §0 requiere arbitraje del revisor. No se modifica por
contexto de un turno ni por sugerencia de Claude.

## 1. Roles y chats

Cuatro chats, cada uno con su contexto. **Un chat = un rol.** No se mezclan.

### Ejecutor 1 — repo / integración / ops
- **Hace:** código de sistema, estructura, rutas, mounts, serving, integración a
  `dev`, git de integración, releases, deploy, nginx/PM2, y la presentación y
  cableado técnico de los módulos.
- **No hace:** modelado profundo del corpus documental como actividad principal;
  no convierte decisiones de contenido en decisiones estructurales sin arbitraje.
- Es el **único** rol que toca git de integración, deploy y operaciones.

### Contenido blueprint
- **Hace:** leer el corpus, modelar dominio, redactar el blueprint de ARMC,
  traducir entrevistas / hallazgos / análisis en contenido estructurado.
- **No hace:** estructura del sistema, integración, git de integración, release, ops.

### Contenido simulador
- **Hace:** leer el corpus, modelar el flujo, convertir documentación en
  contenido del simulador — capas, nodos, contratos y trazabilidad desde el
  punto de vista del contenido.
- **No hace:** rutas, serving, ubicación de módulos, integración técnica.

### Revisor — independiente
- **Hace:** arbitrar colisiones, detectar supuestos implícitos y huecos entre
  capas, revisar hitos y cambios de riesgo, decidir cuándo una pieza estructural
  queda congelada para que otros la usen.
- **No hace:** ejecutar integración ni despliegue. No reemplaza a ejecutor 1.

**Principio central:** *paralelo en contenido, centralizado en estructura.*
Blueprint y simulador pueden avanzar a la vez (trabajan superficies disjuntas).
Estructura, serving, integración y release **no** se descentralizan.

## 2. Capas — toda tarea declara una

Cada tarea declara **una** capa al inicio. Si toca varias, se dice desde el
principio y se trata como tarea compuesta.

- **repo** — código de sistema, lógica, estructura de carpetas.
- **ops** — nginx, PM2, deploy, serving, runtime real.
- **contenido** — material modelado desde el corpus (blueprint, flujo del simulador).
- **release** — versionado visible, CHANGELOG, promoción, etiquetas.
- **doc** — documentación.

## 3. Reglas operativas

1. La estructura del sistema está **congelada**; no se rediscute salvo motivo
   fuerte aprobado por el revisor.
2. Cada tarea **declara su capa** desde el inicio.
3. La **validación se hace en la superficie real** donde vive el cambio (§5).
4. La documentación **declara siempre** si describe estado del repo o estado
   operativo (entorno).
5. Las **compatibilidades temporales** se registran con condición de retirada (§7).
6. La **revisión es por hito funcional**, no por microcirugía. `doc` y UI trivial
   se cierran con revisión directa, sin hito formal.
7. El método vive en **este documento**, no en biblia ni en memoria de chat.

## 4. Escalado — "stop and escalate"

Un chat de **contenido** que detecte que necesita decidir sobre **rutas, límites
core/cliente, serving, deploy o modelo estructural transversal** — **se detiene y
escala** al revisor / ejecutor 1. No toma la decisión.

## 5. Pre-check, validación y revisión — escalan con el riesgo

- **doc / UI trivial:** objetivo + archivo + verificación directa. Sin ritual.
- **repo con lógica:** objetivo + contrato afectado + validación local + criterio PASS.
- **ops / release / estructura / contratos:** capa declarada + superficie real
  declarada + pre-check completo + rollback explícito + **validación en la
  superficie real** (nginx / Cloudflare / producción según aplique).

Regla dura: un cambio de serving **no** se da por validado solo porque funcione
en Express local. Si la ruta pasa por nginx o Cloudflare, se valida ahí.

## 6. Handoff por rama + diff

- El chat de contenido trabaja en **su rama**; entrega revisando el **diff
  completo de la rama**.
- Ejecutor 1 **integra** la rama; **no reescribe** el contenido — solo adaptación
  técnica, formato o integración. Desacuerdo de fondo sobre contenido → vuelve al
  chat de contenido o lo arbitra el revisor.
- **No** cherry-pick SHA a SHA como norma. Worktree **opcional** — solo si hay
  edición simultánea real de la misma superficie.

## 7. Plantilla de slice

**Antes de abrir:** objetivo (qué cambia / qué no) · capa · contrato o superficie
afectada · validación que lo demostrará · rollback (para `ops`/`estructura`).

**Al cerrar:** validación ejecutada y resultado · diff revisable · riesgos
residuales · qué queda explícitamente fuera.

## 8. Registro de compatibilidades temporales

Toda compatibilidad temporal activa se registra aquí con su **condición de
retirada**. Sin condición de retirada, es deuda invisible.

| Compatibilidad | Desde | Condición de retirada |
|---|---|---|
| nginx `dev`: `/publicados/armc/simulador-ux/...` se sirve como estático (en lugar del `301 → /hub` que sí tiene el repo en `server.js`). Override de edge, no del repo. | 2026-05-21 | Reintroducir el `301` cuando se confirme que ninguna página cacheada consume aún la ruta legacy. |
| nginx `prod`: pendiente de añadir `location /core/simulador-ux/` y el bloque legacy-compat antes de promover el simulador nativo a producción. | — | Se cierra al ejecutar el bloque de nginx de producción. |

## 9. Definiciones

- **core** — lo común a todos los clientes: código de sistema, módulos
  compartidos (Hub, APEX, simulador como módulo), backend. En `prisma-apex/core/`,
  `server/`, `web/`, `shared/`.
- **cliente** — datos, entregables y configuración de un cliente concreto (hoy
  ARMC). En `prisma-apex/clientes-publicados/[cliente]/`.
- **contenido** — material producido leyendo y modelando el corpus documental
  (blueprint, flujo del simulador). El "qué" que el sistema presenta, no el sistema.
- **estructura** — forma del repo y del serving: carpetas, rutas canónicas,
  mounts, ubicación de módulos, límite core/cliente, contratos de URL.
- **compatibilidad temporal** — comportamiento provisional que sostiene algo
  durante una transición y está destinado a retirarse. Obligatoria su condición
  de retirada.
- **pieza congelada** — decisión estructural (ruta, ubicación, contrato, límite
  core/cliente) definida por F1 y validada por el revisor; los frentes construyen
  encima dándola por estable.
- **listo para integración** — unidad de trabajo completa, validada en su
  superficie, con capa declarada, sin tocar más de lo declarado, con diff revisable.
- **listo para promover a main** — integrado y validado en `dev` (validación en
  superficie real cuando aplique), revisado en hito (+ `/ultrareview` si es de
  riesgo), versionado y CHANGELOG al día.

## 10. Frentes de trabajo

- **F1 — reestructuración técnica de la plataforma.** ✅ **Cerrado en `v3.4.0`
  (2026-05-25).** Trabajo estructural y operativo, **no de cambio de producto**:
  separó mejor web pública, Hub/APEX, contenido cliente y serving; redujo mezcla
  y duplicación; desmontó el monolito del Hub (reducción del 91.4%); preparó
  base más segura y mantenible. No cambió lógica funcional salvo lo imprescindible
  para soportar la nueva estructura. Multi-cliente y rediseño del proceso APEX
  quedaron **fuera** de F1. Plan operativo archivado en
  [`docs/historico/F1-PLAN.md`](historico/F1-PLAN.md). Dueño durante F1: ejecutor 1
  + arbitraje del revisor.
- **F2 — blueprint ARMC.** Frente de contenido. Dueño: chat contenido blueprint.
- **F3 — simulador.** Dos mitades: contenido del flujo (chat contenido simulador)
  + integración/presentación en el Hub (ejecutor 1).

Orden: **serie en estructura, paralelo en contenido.** F1 congela primero; F2 y
F3 avanzan encajados en lo que F1 haya congelado.

## 11. Secuencia vigente

1. ✅ Auditoría documental + redacción de este `OPERATIVA.md`.
2. ✅ Auditoría arquitectónica del repo ([`docs/AUDITORIA-ARQUITECTONICA.md`](AUDITORIA-ARQUITECTONICA.md), 2026-05-23).
3. ✅ F1 — reestructuración técnica de la plataforma. Cerrado en `v3.4.0` (2026-05-25). Plan archivado: [`docs/historico/F1-PLAN.md`](historico/F1-PLAN.md).
4. **Pendiente decisión del revisor:** evaluar apertura de Nivel 2 (auditoría arquitectónica) **o** avance paralelo de F2 (blueprint ARMC) + F3 (simulador). Ninguno está abierto hoy.