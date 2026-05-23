---
name: revisar-docs
description: Audita la coherencia de la documentación del repo (CLAUDE.md, README.md, docs canónicos y guías) contra el estado real del código y el árbol de archivos. Detecta rutas muertas, estados de transición ya superados y versiones descuadradas. Úsalo tras cualquier cambio estructural, antes de cerrar un slice, o cuando se sospeche deriva documental.
---

# Revisar documentación — auditoría de coherencia

Codifica el método de la auditoría documental del Bloque 1. Su trabajo es
**contrastar lo que la documentación dice contra lo que el repo realmente es**, y
reportar la deriva — no corregirla sin aprobación.

## Cuándo usarlo

- Después de mover, renombrar o eliminar carpetas/archivos estructurales.
- Antes de cerrar un slice que tocó estructura, rutas o serving.
- Cuando una fase del proyecto se da por ejecutada (lo que era "futuro" pasa a "hecho").
- De forma periódica, como chequeo de salud documental.

## Alcance

**Dentro:** todo `.md` de la raíz y de `docs/`, más el `README.md` de cualquier
módulo (`prisma-apex/core/*/README.md`).

**Fuera:** `docs/historico/**` y `REVIEW-PRISMA-APEX.md` — histórico cerrado, no se audita.

## Método — paso a paso

1. **Fijar el estado real del repo (la verdad de contraste):**
   - Árbol de archivos: `git ls-files` sobre `web/`, `prisma-apex/`, `shared/`, `server/`, `docs/`.
   - Rutas y serving reales: leer `server/server.js` (`express.static`, `app.get`, `app.use`).
   - Versión vigente: la del campo "Versión actual" de `CLAUDE.md`.

2. **Por cada documento del alcance, anotar:**
   - **Tipo:** ¿describe el *repo/producto* o el *modo operativo*?
   - **Estado:** vigente · histórico · ejecutado (propuesta ya implementada).
   - **Referencias obsoletas:**
     - Rutas a carpetas/archivos que ya no existen en el árbol real.
     - Estados de transición ya superados (p. ej. "se introduce en fase 2" cuando
       fase 2 ya se ejecutó; "propuesta para revisión" cuando ya está implementada).
     - Números de línea de código que han derivado.
     - Contratos o rutas del sistema no registrados.

3. **Comprobar la consistencia de versión** en los 4 puntos canónicos + CHANGELOG:
   - Footer de `web/index.html` (`data-es`, `data-en`, texto visible).
   - Login del Hub: `.welcome-version` en `prisma-apex/index.html`.
   - Cabecera de la última entrada de `CHANGELOG.md`.
   - Campo "Versión actual" de `CLAUDE.md`.
   Las cuatro deben coincidir.

4. **Entregar un informe**: tabla por documento (tipo · estado · referencias
   obsoletas) + propuesta de correcciones agrupada por hito de riesgo creciente.

## Reglas

- **No editar documentos sin aprobación.** El skill audita y propone; la ejecución
  de las correcciones es un paso aparte, revisable por hito.
- **No inventar.** Si una referencia es ambigua, anotarla como duda, no asumir.
- **Distinguir deriva estructural de semántica.** La estructural (rutas, versiones)
  es objetiva; la semántica (tiempos verbales, estado) requiere criterio y se marca
  como tal.
- **Convención de cabecera de vigencia:** al proponer correcciones, recomendar que
  cada doc declare al inicio `Estado` y `Última verificación: AAAA-MM-DD`. El
  `README.md` de `prisma-apex/core/simulador-ux/` es el modelo de referencia.