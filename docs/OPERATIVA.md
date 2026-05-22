# OPERATIVA — Modo de trabajo del proyecto

> **Fuente vigente del método de trabajo.** Describe *cómo* se desarrolla el
> proyecto con Claude Code (roles, capas, escalado, handoff, validación). No
> describe el producto — eso vive en `CLAUDE.md` y en los docs de dominio.
>
> Si `CLAUDE.md` y este documento entran en conflicto sobre **cómo se trabaja**,
> **prevalece `OPERATIVA.md`** y se escala al revisor. Todo cambio a este
> documento se valida con el revisor.

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

- **F1 — diseño estructural objetivo del sistema.** Define la forma objetivo:
  límite core/cliente, rutas canónicas, ubicación de módulos, contrato de serving,
  modelo de cliente. Dentro de F1 se decide qué parte debe quedar preparada para
  multi-cliente — no implica implementar multi-tenant completo de inmediato.
  **Cierra con una lista de decisiones congeladas explícitas**, no con narrativa.
  Dueño: ejecutor 1 + arbitraje del revisor.
- **F2 — blueprint ARMC.** Frente de contenido. Dueño: chat contenido blueprint.
- **F3 — simulador.** Dos mitades: contenido del flujo (chat contenido simulador)
  + integración/presentación en el Hub (ejecutor 1).

Orden: **serie en estructura, paralelo en contenido.** F1 congela primero; F2 y
F3 avanzan encajados en lo que F1 haya congelado.

## 11. Secuencia vigente

1. Auditoría documental + redacción de este `OPERATIVA.md`.
2. F1 — diseño estructural objetivo (corto), cerrado como lista de decisiones congeladas.
3. F2 + F3 en paralelo, dentro de la forma congelada por F1.