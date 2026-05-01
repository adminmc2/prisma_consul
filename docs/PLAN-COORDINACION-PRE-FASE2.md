# Plan de Coordinacion Pre-Fase 2

## 1. Proposito

Este documento define el orden operativo minimo para dejar `web-de-prisma` en un estado limpio antes de ejecutar la Fase 2 del Sprint A.

No redefine `docs/PLAN-FASE2.md`. Su trabajo es otro: evitar que la ejecucion de Fase 2 arranque sobre ramas divergidas, ownership ambiguo del repo o cambios paralelos que vuelvan opaco el historial.

## 2. Estado actual verificado

- `origin/main`: `e50e63f` — `v3.2.54` (`catch-up Diagnostico Integrado a produccion + correcciones del dictamen`)
- `origin/dev`: `65c1301` — `v3.3.20` (`merge Git main -> dev ya completado`)
- `main...dev`: `0 44`
- Fase 1: cerrada formalmente por revision
- Fase 2: autorizada por gate, pero **todavia no debe arrancar** hasta desplegar y validar el `dev` reconciliado

## 3. Problemas detectados

### E01. Publicaciones directas a `main` mientras `dev` seguia avanzando

No reabre Fase 1, pero crea divergencia operativa justo antes de una fase estructural delicada.

### E02. Dos agentes escritores sobre el mismo repo

Aunque no haya conflicto inmediato en cada commit, se pierde ownership claro del estado del repo, del review y del versionado.

### E03. Mezcla de dos tracks de versionado

`main` sigue publicando en `v3.2.x`; `dev` ya avanzo por `v3.3.x`. Esto es manejable, pero exige fusion consciente de `CHANGELOG.md` y no permite resolver conflictos "a ciegas".

### E04. Artefactos de control y artefactos de producto avanzando por canales distintos

`REVIEW-PRISMA-APEX.md`, `CHANGELOG.md`, `CLAUDE.md`, `index.html` y `portal/index.html` no pueden tratarse como simples bumps mecanicos cuando hay ramas divergidas. La comprobacion completa de ramas tambien muestra una superficie dual-modificada pequeña pero real en `.gitignore` y en 3 archivos blueprint de ARMC.

### E05. Riesgo de arrancar Fase 2 sin validar el `dev` reconciliado

Fase 2 mueve estructura fisica, serving y rutas. Aunque el catch-up Git `main` -> `dev` ya se completó, arrancarla sin validar el estado reconciliado en `dev.prismaconsul.com` seguiria multiplicando el coste de cada conflicto siguiente.

## 4. Que ya esta absorbido en `dev`

Los siguientes archivos del catch-up a produccion ya estan alineados semanticamente entre `origin/main` y `origin/dev`; no son el centro del problema actual:

- `docs/VALIDACION-CATALOGO-ARMC.md`
- `portal/analisis/armc/diagnostico/mapa-fricciones.html`
- `portal/analisis/armc/diagnostico/cadena-causal.html`
- `portal/analisis/armc/diagramas/flujo-atención-paciente.html`

La reconciliacion Git `main` -> `dev` ya fue ejecutada en el merge `65c1301`. La política aplicada dejó `dev` como árbol canónico para la superficie repo y para los 3 archivos blueprint evaluados. Las diferencias restantes entre ramas ya no son un conflicto pendiente a resolver, sino el delta normal de desarrollo sobre producción.

## 5. Politica operativa desde ahora

1. Un solo agente escritor a la vez en este repo.
2. El revisor actualiza `REVIEW-PRISMA-APEX.md`; el ejecutor no lo toca salvo instruccion explicita.
3. No se arranca Fase 2 hasta que `origin/dev` haya absorbido el catch-up de `origin/main` y el resultado reconciliado haya sido validado en `dev.prismaconsul.com`.
4. Si por urgencia se vuelve a publicar algo directo en `main`, el siguiente paso obligatorio es reconciliar ese cambio en `dev` antes de nuevos cambios estructurales.
5. No se hace merge sobre working tree sucio ni con stash como estrategia de coordinacion.
6. GitHub por HTTPS se usa con `gh auth login` + `gh auth setup-git`; nunca con credenciales en la URL del comando.

## 6. Secuencia obligatoria antes de Fase 2

1. Congelar cambios paralelos de contenido en este repo hasta cerrar la validacion.
2. Trabajar desde `dev` limpio y actualizado (`git fetch origin`).
3. Crear una rama o `git worktree` temporal de integracion desde `origin/dev`.
4. Mergear `origin/main` dentro de esa rama temporal. **Estado: completado en `65c1301`.**
5. Resolver conflictos con esta politica. **Estado: completado, todos los conflictos resueltos a favor de `dev` y los auto-merges ya coincidian con `dev`.**
6. Desplegar `origin/dev` reconciliado a `dev.prismaconsul.com`. **Estado: pendiente.**
7. Ejecutar validacion humana minima de los puntos afectados por la integracion. **Estado: pendiente.**
8. Mantener un solo agente escritor hasta cerrar esa validacion.
9. Solo entonces arrancar el subpaso 2.1 de `docs/PLAN-FASE2.md`.

## 7. Definicion de orden suficiente

Se considera que el repo ya esta ordenado para Fase 2 cuando se cumplan todas estas condiciones:

- `origin/dev` ya absorbio el catch-up de `origin/main`.
- No hay segundo agente escribiendo el repo en paralelo.
- `git status` esta limpio en la rama operativa.
- `git stash list` esta vacio.
- `REVIEW-PRISMA-APEX.md` refleja el estado post-integracion.
- `dev.prismaconsul.com` corre la rama reconciliada y fue validada despues de esa integracion.

## 8. Fuera de alcance de este plan

- Guardrails shell anti-credenciales-en-URL.
- Runbooks detallados de incidente GitHub.
- Cambios del Sprint B.
- Ejecucion fisica de los subpasos de Fase 2.

Esos temas siguen siendo importantes, pero no deben mezclarse con la limpieza operativa que necesitamos antes de mover estructura.