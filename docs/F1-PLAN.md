# F1 — Reestructuración técnica de la plataforma

> **Estado:** plan operativo activo · **Apertura:** 2026-05-23 · **Vigencia:** hasta el cierre de F1.
> Este documento es **vinculante** durante F1. Toda decisión estructural se contrasta contra
> él. Las modificaciones del plan requieren arbitraje del revisor.
>
> Fuentes: propuesta del revisor (2026-05-23) + `docs/AUDITORIA-ARQUITECTONICA.md` +
> `docs/OPERATIVA.md`.

## 1. Definición y alcance

F1 **no es** "multi-cliente" ni rediseño del proceso APEX. F1 **es**:

- Separar mejor **web pública**, **Hub/APEX**, **contenido cliente** y **serving**.
- Reducir mezcla y duplicación en el código del Hub.
- Empezar a desmontar el monolito del Hub (`prisma-apex/index.html`, 3.830 líneas).
- Preparar una base más segura y mantenible.
- **No cambiar la lógica funcional del sistema** salvo lo imprescindible para soportar esa nueva estructura.

## 2. Principios fijos (no se discuten durante F1)

- Web pública, Hub/APEX y discovery se mantienen **funcionalmente intactos**.
- Decisiones estructurales: **exclusivas de ejecutor 1** con arbitraje del revisor.
- Contenido (chats blueprint y simulador): siguen **en paralelo**, no tocan estructura/serving/rutas/release/canónicos.
- **Paralelo en contenido, centralizado en estructura.**
- Modo revisor permanente sigue activo (`CLAUDE.md`).

## 3. Prohibiciones absolutas durante F1

- **No** cambiar lógica funcional del Hub o APEX (login, JWT, upload, BD, Drive, discovery flow).
- **No** cambiar URLs públicas (`/`, `/apex`, `/hub`, `/publicados`, `/api/*`, `/shared`, `/core/simulador-ux`).
- **No** cambiar contratos de los 17 endpoints API.
- **No** cambiar el esquema BD.
- **No** cambiar el contenido de los entregables ARMC.
- **No** refactorizar `form.js` del discovery (ya separado de su HTML; fuera de F1).
- **No** tocar el simulador (módulo aparte, nativizado recientemente; fuera de F1).
- **No** migrar a frameworks (React, Vue, etc.).
- **No** introducir build pipeline, tests automáticos ni CI (Niveles 2-3, fuera de F1).

## 4. Estructura común de cada slice

Todo slice de F1 declara, **antes de abrir**:

- **Capa**: `repo` · `ops` · `contenido` · `release` · `doc`.
- **Superficie afectada** (archivos concretos).
- **Antes/después** en una frase.
- **Prohibiciones específicas del slice** (qué no se toca dentro de la superficie).
- **Criterio PASS** explícito (qué validación demuestra el cierre).
- **Rollback** (cómo se revierte si algo falla).
- **Diff revisable** (qué tamaño se espera).

Al **cerrar**:

- Validación ejecutada con resultado.
- Diff completo del slice.
- Riesgos residuales.
- Qué queda fuera explícitamente.

## 5. Secuencia operativa

### Bloque 0 — Cierre del bloque documental (en curso)

| Slice | Acción | Prohibición específica |
|---|---|---|
| 0.1 | Hito C — cabeceras de estado en `REGISTRO-RUTAS.md` y `docs/PROPUESTA-SIMULADOR-NATIVO-HUB.md` | No mover archivos a `docs/historico/` |
| 0.2 | Bump único `v3.3.71` en los 4 puntos canónicos + entrada en CHANGELOG | No agrupar otros cambios no documentales |
| 0.3 | Commit + push a `origin/dev` (incluye el commit pendiente `98c2e8a`) | No promover a `main` |

**Criterio PASS del Bloque 0:**

- `/revisar-docs` estructural pasa limpio (cero rutas muertas en presente, cero "se introduce en fase 2" para tablas ya creadas).
- Versión coherente en los 4 puntos canónicos (`web/index.html`, `prisma-apex/index.html` login, `CHANGELOG.md` cabecera, `CLAUDE.md` "Versión actual").
- `CHANGELOG.md` con entrada del bloque documentando: auditoría, anti-drift (skill + hook), cabeceras de vigencia, auditoría arquitectónica, F1-PLAN.
- `git status` limpio, `dev` alineado con `origin/dev` tras push.
- Hook `recordar-revisar-docs.sh` dispara correctamente en el commit (verificación en vivo).

### Bloque 1 — Tooling y método Claude Code

Saneamiento de cómo Claude opera sobre el repo. **Riesgo de regresión: cero** (todo aditivo, no toca código de producto).

| Slice | Acción | Capa | Prohibición específica | PASS |
|---|---|---|---|---|
| 1.1 | Crear subagentes `auditor-slice` y `auditor-rutas` en `.claude/agents/`. El nombre `revisor` queda reservado al rol humano definido en `docs/OPERATIVA.md §1`; los subagentes se nombran por función, no por autoridad. | repo (Claude Code) | No tocar código de producto | Invocación produce salida coherente con prompt |
| 1.2 | Skills de flujo `/nuevo-cliente`, `/procesar-entrevista`, `/generar-entregable` — **APLAZADO con trigger**. Hoy el trabajo activo es F2 (blueprint) y F3 (simulador), no operación repetitiva multi-cliente; codificar estos flujos ahora sería documentar hipótesis (OPERATIVA §0.3). Trigger de reactivación: la primera entrevista procesada con pipeline automatizado Drive → Whisper → `prisma-trabajo-clientes`, una vez que `prisma-trabajo-clientes` exista y esté operativo; **o** al alta del segundo cliente posterior a ARMC. Mientras tanto, no se crean estos skills. | repo (Claude Code) | No crear los skills hasta cumplirse el trigger | (no aplica hasta reactivación) |
| 1.3 | Limpieza de `permissions.allow` (literales sed-versión → patrón general o script `scripts/bump-version.sh`) | repo (Claude Code) | No ampliar permisos a comandos no autorizados antes | `settings.json` válido (jq), hook PreToolUse sigue activo, ≤30 entradas en allow del proyecto |
| 1.4 | Hook validador de rutas en docs (PreToolUse en `git commit` sobre `*.md` que verifica rutas mencionadas contra el árbol) | repo (Claude Code) | No bloquear commits, solo avisar | Smoke: `.md` con ruta inexistente → avisa; sin ruta inexistente → no avisa |
| 1.5 | Statusline mínima (versión + rama) — opcional | repo (Claude Code) | No depender de comandos externos lentos | Statusline muestra `v3.3.7x` + `dev` |

**Criterio PASS del Bloque 1:**

- Subagentes y skills del método Claude operativos e invocables para el trabajo activo del bloque.
- Slice 1.2 registrado como **aplazado con trigger explícito y verificable**; no se afirma completitud sobre los skills operativos A/B/C mientras 1.2 permanezca aplazado.
- `permissions.allow` limpio y revisado.
- Hook validador funcionando en vivo.
- Bump menor PATCH al cierre.

**Skills pendientes con condición de creación (registrados aquí para no perder la necesidad, sin diseñar hoy):**

- `/trazar-blueprint-simulador` — mapearía proceso del blueprint a estados/capas del simulador. **Condición de creación:** blueprint ARMC o simulador con línea base cerrada y verificable (al menos uno de los dos).
- `/validar-coherencia-blueprint` — verificaría consistencia entre procesos objetivo, eventos e implementación. **Condición de creación:** misma condición anterior, además de que exista implementación contra la que validar.
- `/controlar-contratos-internos` — revisaría impactos sobre contratos internos de proceso/datos. **Condición de creación:** lista de contratos internos definida (hoy `CONTRATOS.md` cubre solo los externos).

Cada uno, cuando se cumpla su condición, se diseña como **slice propio** con su scoping (igual que se hizo con 1.1), no en bloque. No se añaden al Bloque 1 en curso.

### Bloque 2 — Saneamiento del monolito del Hub (sin cambio funcional)

| Slice | Acción | Superficie | Prohibición específica | PASS |
|---|---|---|---|---|
| 2.1 | Extraer `<style>` del Hub a `prisma-apex/hub.css`, enlazar con `<link>` | `prisma-apex/index.html` (líneas 30-1.298) | No tocar JS · no renombrar clases · no modificar HTML estructural | `/hub` abre idéntico visualmente (comparar con captura previa). Smoke en `dev.prismaconsul.com` |
| 2.2 | Extraer `<script>` por dominio a `hub-login.js`, `hub-tabs.js`, `hub-analisis.js`, `hub-admin.js`, `hub-helpers.js`. Commit por módulo. | `prisma-apex/index.html` (líneas 1.299-3.830) | No cambiar comportamiento · no refactorizar funciones · no renombrar identificadores | Login + 3 pestañas + abrir un análisis + admin "view as user" funcionan en `dev.prismaconsul.com` **tras cada commit** |
| 2.3 | Deduplicar `analisis*` vs `udAnalisis*` con factoría `crearControladorAnalisis(prefix)` | `hub-analisis.js` (post-2.2) | No cambiar comportamiento de ninguna de las dos vistas | Ambas vistas (usuario y admin-detail) funcionan idéntico tras el cambio; smoke completo |

**Criterio PASS del Bloque 2:**

- `prisma-apex/index.html` reduce ≥ 70% su tamaño actual.
- Comportamiento visible de `/hub` idéntico antes y después en `dev.prismaconsul.com`.
- Ningún ID DOM huérfano.
- Bump MINOR `v3.4.0` al cierre (refactor estructural visible).

## 6. Lo que queda **fuera** de F1

- Generar §Rutas y §BD desde el código (Nivel 2 auditoría arquitectónica).
- Separar `CLAUDE.md` vigente vs histórico (Nivel 2).
- Fragmentar `CHANGELOG.md` por sprint (Nivel 2).
- Tests Playwright + `node:test` (Nivel 3).
- CI mínimo en GitHub Actions (Nivel 3).
- Migración a componentes ESM con `<template>` (Nivel 3).
- Mover catálogos `PAIN_KNOWLEDGE_BASE` y `SITUACIONES` a JSON (Nivel 3).
- Refactor de `form.js` del discovery.
- Cualquier cambio funcional en el Hub, en APEX o en el simulador.

## 7. Coordinación

- **Ejecutor 1**: trabaja en `dev` desde la carpeta principal limpia. Es el único que toca git de integración, deploy, release, versionado visible, estructura.
- **Contenido blueprint (ejecutor 2)**: sigue en paralelo en su superficie de contenido. **NO** toca estructura/serving/rutas/release/canónicos.
- **Contenido simulador (ejecutor 3)**: igual.
- **Revisor**: valida cierre de cada Bloque, arbitra colisiones, especialmente si algún chat de contenido empuja una decisión estructural.

**Regla dura**: si una necesidad estructural emerge desde un chat de contenido → **stop & escalate** al revisor. No la decide el chat de contenido.

## 8. Comprobaciones profundas por cierre de Bloque

- **Bloque 0**: las cinco del §5 Bloque 0.
- **Bloque 1**: además — invocación real de cada subagente y skill nuevos con caso concreto. `permissions.allow` revisado entrada a entrada.
- **Bloque 2**: además — navegación visual exhaustiva en `dev.prismaconsul.com`. Comparar Hub usuario y admin contra captura previa al refactor. Verificar que ningún ID DOM quedó huérfano. Diff por slice ≤ 300 líneas netas (separación + reescritura mínima); si excede, fragmentar el slice.

## 9. Versionado

- **Bloque 0**: PATCH (`v3.3.71`).
- **Bloque 1**: PATCH(s) por slice o uno único al cierre, según ritmo de revisión.
- **Bloque 2**: MINOR al cierre (`v3.4.0`) por reestructuración estructural visible en el árbol.

## 10. Cierre de F1

F1 se considera cerrado cuando:

- Bloques 0, 1 y 2 cumplen su criterio PASS.
- `prisma-apex/index.html` deja de ser monolito (CSS y JS extraídos, duplicación `analisis`/`udAnalisis` eliminada).
- Subagentes y skills del método Claude operativos para el trabajo activo (slice 1.2 puede permanecer aplazado con trigger registrado; no bloquea el cierre de F1).
- Hook validador activo y probado en vivo.
- `v3.4.0` publicada en `dev` y verificada en `dev.prismaconsul.com`.

Tras el cierre de F1, se evalúa la apertura de Nivel 2 (auditoría arquitectónica) o el avance paralelo de F2 + F3 (contenido).