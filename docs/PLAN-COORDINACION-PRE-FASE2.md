# Plan de Coordinacion Pre-Fase 2

## 1. Proposito

Este documento define el orden operativo minimo para dejar `web-de-prisma` en un estado limpio antes de ejecutar la Fase 2 del Sprint A.

No redefine `docs/PLAN-FASE2.md`. Su trabajo es otro: evitar que la ejecucion de Fase 2 arranque sobre ramas divergidas, ownership ambiguo del repo o cambios paralelos que vuelvan opaco el historial.

## 2. Estado actual verificado

- `origin/main`: `e50e63f` — `v3.2.54` (`catch-up Diagnostico Integrado a produccion + correcciones del dictamen`)
- `origin/dev`: `f1819ae` — `v3.3.19` (`carril repo ya integrado en dev`)
- `main...dev`: `15 43`
- Fase 1: cerrada formalmente por revision
- Fase 2: autorizada por gate, pero **todavia no debe arrancar** hasta ordenar la integracion entre ramas

## 3. Problemas detectados

### E01. Publicaciones directas a `main` mientras `dev` seguia avanzando

No reabre Fase 1, pero crea divergencia operativa justo antes de una fase estructural delicada.

### E02. Dos agentes escritores sobre el mismo repo

Aunque no haya conflicto inmediato en cada commit, se pierde ownership claro del estado del repo, del review y del versionado.

### E03. Mezcla de dos tracks de versionado

`main` sigue publicando en `v3.2.x`; `dev` ya avanzo por `v3.3.x`. Esto es manejable, pero exige fusion consciente de `CHANGELOG.md` y no permite resolver conflictos "a ciegas".

### E04. Artefactos de control y artefactos de producto avanzando por canales distintos

`REVIEW-PRISMA-APEX.md`, `CHANGELOG.md`, `CLAUDE.md`, `index.html` y `portal/index.html` no pueden tratarse como simples bumps mecanicos cuando hay ramas divergidas. La comprobacion completa de ramas tambien muestra una superficie dual-modificada pequeña pero real en `.gitignore` y en 3 archivos blueprint de ARMC.

### E05. Riesgo de arrancar Fase 2 sobre una base no reconciliada

Fase 2 mueve estructura fisica, serving y rutas. Empezarla antes de reconciliar `main` y `dev` multiplicaria el coste de cada conflicto siguiente.

## 4. Que ya esta absorbido en `dev`

Los siguientes archivos del catch-up a produccion ya estan alineados semanticamente entre `origin/main` y `origin/dev`; no son el centro del problema actual:

- `docs/VALIDACION-CATALOGO-ARMC.md`
- `portal/analisis/armc/diagnostico/mapa-fricciones.html`
- `portal/analisis/armc/diagnostico/cadena-causal.html`
- `portal/analisis/armc/diagramas/flujo-atención-paciente.html`

La divergencia real verificada entre `origin/main` y `origin/dev` tiene 25 rutas: 8 modificadas en ambas ramas y 17 altas solo en `dev`.

Los archivos modificados en ambas ramas que si requieren coordinacion explicita antes de seguir son:

- `.gitignore`
- `CHANGELOG.md`
- `CLAUDE.md`
- `index.html`
- `portal/index.html`
- `portal/analisis/armc/blueprint/fases-implementacion.html`
- `portal/analisis/armc/blueprint/flujos-to-be.html`
- `portal/analisis/armc/blueprint/modelo-datos.html`

Las 17 altas solo en `dev` (documentos canonicos de Sprint A, reporte/checklist del bloque B, guia de nuevas secciones y scripts auxiliares) no son conflicto puro, pero si forman parte de la carga de integracion cuando se reconcilien ramas.

Para la ejecucion actual del carril repo, el ejecutor 1 trabaja solo sobre la superficie tecnica compartida del repositorio: `.gitignore`, `CHANGELOG.md`, `CLAUDE.md`, `index.html` y `portal/index.html`. Los 3 archivos blueprint quedan fuera de este carril y se tratan despues en el carril de contenido.

## 5. Politica operativa desde ahora

1. Un solo agente escritor a la vez en este repo.
2. El revisor actualiza `REVIEW-PRISMA-APEX.md`; el ejecutor no lo toca salvo instruccion explicita.
3. No se arranca Fase 2 mientras `main` y `dev` sigan divergidos.
4. Si por urgencia se vuelve a publicar algo directo en `main`, el siguiente paso obligatorio es reconciliar ese cambio en `dev` antes de nuevos cambios estructurales.
5. No se hace merge sobre working tree sucio ni con stash como estrategia de coordinacion.
6. GitHub por HTTPS se usa con `gh auth login` + `gh auth setup-git`; nunca con credenciales en la URL del comando.

## 6. Secuencia obligatoria antes de Fase 2

1. Congelar cambios paralelos de contenido en este repo hasta cerrar la integracion.
2. Trabajar desde `dev` limpio y actualizado (`git fetch origin`).
3. Crear una rama o `git worktree` temporal de integracion desde `origin/dev`.
4. Mergear `origin/main` dentro de esa rama temporal.
5. Resolver conflictos con esta politica:
   - `.gitignore`: gana `dev`.
   - `CLAUDE.md`: gana `dev`.
   - `index.html`: gana `dev`.
   - `portal/index.html`: gana `dev`.
   - `portal/analisis/armc/blueprint/fases-implementacion.html`: gana `dev`.
   - `portal/analisis/armc/blueprint/flujos-to-be.html`: gana `dev`.
   - `portal/analisis/armc/blueprint/modelo-datos.html`: gana `dev`.
   - `CHANGELOG.md`: fusion manual. Conservar arriba el track `v3.3.x` de `dev`, y preservar como historial las publicaciones reales de `main` (`v3.2.52`, `v3.2.53`, `v3.2.54`).

En el primer corte operativo del carril repo, el revisor fijo estas decisiones: version visible `v3.3.19` para `index.html`, `portal/index.html` y `CLAUDE.md`; `CHANGELOG.md` se resuelve con fusion historica acotada, tomando `dev` como base y preservando las publicaciones directas a produccion `v3.2.52`, `v3.2.53` y `v3.2.54`.
6. Desplegar el resultado integrado a `dev.prismaconsul.com`.
7. Ejecutar validacion humana minima de los puntos afectados por la integracion.
8. Integrar la rama temporal de vuelta a `dev`.
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