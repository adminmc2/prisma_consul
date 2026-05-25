# prisma-apex/ — Sistema interno PRISMA APEX

Instrucciones locales para trabajar dentro de `prisma-apex/`. El contexto repo-wide vive en el `CLAUDE.md` raíz; el detalle del backend que sirve este sistema vive en `server/CLAUDE.md`.

## Cuatro superficies internas

- **Hub** — `prisma-apex/index.html`. Entrypoint SPA del Hub (login + 3 pestañas admin / 1 pestaña user). Servido en `/hub`.
- **Discovery engine** — `prisma-apex/core/discovery-engine/`. Formulario APEX. Servido en `/apex`. Archivos: `index.html`, `form.js`, `form.css`, `signal-detector.js`.
- **Simulador UX** — `prisma-apex/core/simulador-ux/`. Módulo interno del Hub (Línea B, nativizado). **No tiene URL pública**; sus datos se sirven internamente bajo `/core/simulador-ux/...`. Estructura: `capa-1-ux/`, `capa-2-diccionario/`, `capa-3-sql/`, `mapa/`.
- **Entregables por cliente** — `prisma-apex/clientes-publicados/<cliente>/`. Hoy solo ARMC. Estructura: `diagramas/`, `diagnostico/`, `blueprint/`, `css/`. URL canónica: `/publicados/[cliente]/...` (legacy `/portal/analisis/...` resuelve por 301).

Cada superficie es independiente. **No mezclar lógica entre ellas** sin justificación explícita.

## Discovery — catálogos `SITUACIONES_*`

- `SITUACIONES_DISTRIBUIDOR` en `prisma-apex/core/discovery-engine/form.js:67` (16 cards, IDs A-P).
- `SITUACIONES_CLINICA` en `prisma-apex/core/discovery-engine/form.js:199` (16 cards, IDs CA-CP).
- La selección entre uno y otro se hace en cliente según el tipo de negocio detectado; el contrato JSON de detección lo emite el backend (`server/routes/apex.js`) y el cliente lo consume.
- `signal-detector.js` (mismo directorio) clasifica señales del formulario en cliente.

## Hub — modular desde `v3.4.0`

- `prisma-apex/index.html` es **HTML estructural** (330 líneas) que carga 5 archivos hermanos:
  - `hub.css` — estilos.
  - `hub-helpers.js` — utilidades transversales (formato, escape, iconos).
  - `hub-login.js` — auth, sesión, arranque del panel.
  - `hub-tabs.js` — navegación entre pestañas.
  - `hub-admin.js` — dominio admin + vistas del panel reutilizadas por `viewAsClient`.
  - `hub-analisis.js` — simulador (módulo nativo) + análisis (iframes ARMC) + `init()`.
- Orden de carga obligatorio: `helpers → login → tabs → admin → analisis`. El último ejecuta `init()` al final.
- Refactor cerrado en el Bloque 3 del F1 ([`docs/historico/F1-PLAN.md`](../docs/historico/F1-PLAN.md)); reducción del monolito −91.4%. Cualquier slice futuro sobre el Hub trabaja sobre esta estructura modular.
- El Hub también es entrypoint del registro de rutas (`ANALISIS_REGISTRY` + `getAnalysisPaths(cliente)` desde `v3.3.31`, hoy en `hub-analisis.js`). Ver `REGISTRO-RUTAS.md` y `CONTRATOS.md` CT-7.

## Gotchas de la superficie

- **El Hub aún usa Phosphor por CDN**, mientras que el discovery usa fuentes locales bajo `/shared/fonts/phosphor/`. Centralización pendiente.
- **No tocar el simulador desde fuera de su carpeta**: módulo aparte, nativizado recientemente. Cualquier cambio se abre como slice propio acordado con el revisor.
- **No tocar contenido de entregables ARMC** sin coordinación con el chat de contenido blueprint (`docs/OPERATIVA.md` §1).
- **Cambios visuales del Hub** se validan en `dev.prismaconsul.com`, no solo en local — el monolito mezcla muchas vistas y el smoke local es insuficiente.
