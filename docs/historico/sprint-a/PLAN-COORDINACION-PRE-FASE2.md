# Plan de Coordinacion Pre-Fase 2

> **Documento histórico — Sprint A.** Trabajo ya ejecutado o decisión ya cerrada. Cierre formal de Sprint A: 2026-05-05. Movido a `docs/historico/sprint-a/` en el slice de consolidación post-Sprint A. Las referencias internas reflejan el estado en el momento de redacción y no se actualizan al nuevo path.

> **Estado: CERRADO en `v3.3.22` (2026-05-01).**
>
> Este documento queda como historial del proceso de coordinación pre-Fase 2. Todos los problemas operativos descritos (E01, E02, E03) fueron absorbidos en el merge `65c1301` (reconciliación Git `main` → `dev`) y cerrados estructuralmente con la promoción a `main` y el despliegue a producción del baseline `v3.3.22`. C11 del review queda cerrado. No es un plan vivo.
>
> El siguiente trabajo (Fase 2 cuando se autorice + cualquier release intermedio) opera en el modo de dos carriles formalizado en `CLAUDE.md` ("Modo de trabajo en dos carriles"), no bajo este plan.
>
> **Addendum local (2026-05-01):** la carpeta principal del usuario (`/Users/armandocruz/Documents/PRISMA CONSUL/PHARMA/web-de-prisma`) también quedó realineada no destructivamente al baseline `d06ef6e`. El WIP previo se preservó en stash etiquetado y backup temporal externo. El desfase local deja de ser un tema operativo abierto.
>
> **Addendum local (2026-05-02, HEAD operativo `v3.3.24`):** tras los patches sucesivos `v3.3.23` y `v3.3.24`, la carpeta principal local se vuelve a alinear no destructivamente al nuevo HEAD operativo. Se preserva el WIP residual (sync ya publicado + diff vs nuevo bump) en un nuevo stash etiquetado, sin tocar el stash anterior. Los dos carriles (`prisma-carril-repo-next`, `prisma-carril-contenido-next`) dejan de estar en `detached HEAD` y pasan a operar sobre las ramas locales reales `chore/fase2-repo-base-v3.3.24` y `chore/fase2-contenido-base-v3.3.24`.

## 1. Proposito

Este documento define el orden operativo minimo para dejar `web-de-prisma` en un estado limpio antes de ejecutar la Fase 2 del Sprint A.

No redefine `docs/PLAN-FASE2.md`. Su trabajo es otro: evitar que la ejecucion de Fase 2 arranque sobre ramas divergidas, ownership ambiguo del repo o cambios paralelos que vuelvan opaco el historial.

## 2. Estado actual verificado

- `origin/main`: `d06ef6e` — `v3.3.22` (`baseline pre-Fase 2 ya publicado en producción`)
- `origin/dev`: `d06ef6e` — `v3.3.22` (`baseline pre-Fase 2 ya publicado en dev`)
- `main...dev`: `0 0`
- Fase 1: cerrada formalmente por revision
- Baseline pre-Fase 2: cerrado, desplegado y validado en `dev.prismaconsul.com` y `prismaconsul.com`
- Carpeta principal local: realineada no destructivamente al baseline `d06ef6e`; WIP previo preservado en stash etiquetado + backup temporal externo

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

1. Congelar cambios paralelos de contenido en este repo hasta cerrar la validacion. **Estado: completado durante el cierre baseline `v3.3.22`.**
2. Trabajar desde `dev` limpio y actualizado (`git fetch origin`). **Estado: completado.**
3. Crear una rama o `git worktree` temporal de integracion desde `origin/dev`. **Estado: completado.**
4. Mergear `origin/main` dentro de esa rama temporal. **Estado: completado en `65c1301`.**
5. Resolver conflictos con esta politica. **Estado: completado, todos los conflictos resueltos a favor de `dev` y los auto-merges ya coincidian con `dev`.**
6. Desplegar `origin/dev` reconciliado a `dev.prismaconsul.com`. **Estado: completado en `v3.3.21`, revalidado y absorbido en el baseline `v3.3.22`.**
7. Ejecutar validacion humana minima de los puntos afectados por la integracion. **Estado: completado con validación técnica + validación visual posterior del usuario.**
8. Mantener un solo agente escritor hasta cerrar esa validacion. **Estado: completado; a partir del baseline `v3.3.22` el trabajo pasa al modo de dos carriles.**
9. Realinear no destructivamente la carpeta principal local al baseline oficial. **Estado: completado con stash etiquetado + backup temporal + fast-forward a `d06ef6e`.**
10. Solo entonces arrancar el subpaso 2.1 de `docs/PLAN-FASE2.md`. **Estado: pendiente únicamente de autorización explícita.**

## 7. Definicion de orden suficiente

Se considera que el repo ya esta ordenado para Fase 2 cuando se cumplan todas estas condiciones:

- `origin/dev` ya absorbio el catch-up de `origin/main`.
- `origin/main` y `origin/dev` comparten el mismo baseline publicado.
- No hay segundo agente escribiendo el repo en paralelo.
- `git status` esta limpio en la rama operativa.
- `git stash list` esta vacio.
- `REVIEW-PRISMA-APEX.md` refleja el estado post-integracion.
- `dev.prismaconsul.com` corre la rama reconciliada y fue validada despues de esa integracion.
- La carpeta principal local ya no introduce desfase respecto al baseline oficial o, si conserva WIP, este queda explícitamente preservado fuera del carril activo.

## 8. Fuera de alcance de este plan

- Guardrails shell anti-credenciales-en-URL.
- Runbooks detallados de incidente GitHub.
- Cambios del Sprint B.
- Ejecucion fisica de los subpasos de Fase 2.

Esos temas siguen siendo importantes, pero no deben mezclarse con la limpieza operativa que necesitamos antes de mover estructura.