# Simulador UX — ARMC

**Status:** En desarrollo | **Versión:** v3.3.59 | **Responsable:** Executor 3

---

## Propósito

Presentación interactiva del flujo operativo de ARMC con 3 capas:

1. **Capa 1 — UX (Grafo):** Visualización del flujo con nodos, relaciones y zoom. **NO EDITAR — Código congelado.**
2. **Capa 2 — Diccionario:** Eventos operativos, payloads JSON, y contratos de datos.
3. **Capa 3 — SQL:** Esquema de base de datos PostgreSQL que respalda el flujo.

---

## Estructura de Directorios

```
simulador-ux/
├── README.md                            ← Este archivo
├── index.html                           ← Shell (tabs, layout) — NO EDITAR
├── capa-1-ux/
│   └── index.html                       ← Grafo interactivo — NO EDITAR
├── capa-2-diccionario/
│   ├── index.html                       ← Contenedor Capa 2 (editable)
│   └── data.json                        ← Payload de eventos (editable)
└── capa-3-sql/
    ├── index.html                       ← Contenedor Capa 3 (editable)
    └── schema.sql                       ← Esquema BD (editable)
```

---

## Reglas de Contribución

### ✅ Executor 3 PUEDE EDITAR:

- **`capa-2-diccionario/index.html`** — Contenido HTML de la Capa 2 (eventos, payloads).
- **`capa-2-diccionario/data.json`** — Estructura de eventos operativos.
- **`capa-3-sql/index.html`** — Contenido HTML de la Capa 3 (descripciones, ejemplos).
- **`capa-3-sql/schema.sql`** — Definiciones de tablas SQL.
- **Este README** — Documentación y guía.

### ❌ Executor 3 NO PUEDE EDITAR:

- **`index.html`** (Shell) — Contiene lógica de tabs, layout flexbox, y estilos del contenedor.
- **`capa-1-ux/`** — Directorio bloqueado. Incluye grafo, zoom, drag, y signal-detector.

---

## Flujo de Trabajo

### Desarrollo Local (Executor 3)

Trabajas en el worktree dedicado `web-de-prisma-simulador-executor3`:

```bash
cd /Users/armandocruz/Documents/PRISMA\ CONSUL/PHARMA/web-de-prisma-simulador-executor3
git checkout chore/contenido-simulador-v3.3.59  # Rama de trabajo
```

### Editar Contenido

1. **Capa 2 (Diccionario):**
   - Abre `prisma-apex/clientes-publicados/armc/simulador-ux/capa-2-diccionario/index.html`
   - Reemplaza el placeholder `<!-- Executor 3: ... -->` con tu contenido HTML
   - Actualiza `data.json` con eventos operativos reales

2. **Capa 3 (SQL):**
   - Abre `prisma-apex/clientes-publicados/armc/simulador-ux/capa-3-sql/index.html`
   - Reemplaza el placeholder con tu contenido HTML (descripciones, ejemplos)
   - Actualiza `schema.sql` con DDL real

### Verificar Localmente

```bash
cd /Users/armandocruz/Documents/PRISMA\ CONSUL/PHARMA/web-de-prisma-simulador-executor3
node server/server.js  # Iniciar servidor Express local
```

Accede a:
- **Simulador completo:** `http://localhost:3000/publicados/armc/simulador-ux`
- **Capa 2 (aislada):** `http://localhost:3000/publicados/armc/simulador-ux/capa-2-diccionario`
- **Capa 3 (aislada):** `http://localhost:3000/publicados/armc/simulador-ux/capa-3-sql`

### Commit y Handoff

Cuando termines una sección:

```bash
git add prisma-apex/clientes-publicados/armc/simulador-ux/capa-2-diccionario
git commit -m "feat: Capa 2 diccionario — eventos operativos y payloads v3.3.59"
git log --oneline -5  # Obtén el SHA del commit
```

Comunica al revisor:
- SHA del commit completado
- Qué contenido incluye (Capa 2, Capa 3, o ambas)
- Cualquier cambio en estructura o dependencias

---

## Versionado

El simulador forma parte de la versión principal del proyecto (`v3.3.59` actual).

**No cambiar la versión** sin aprobación del revisor. La versión se actualiza cuando:
- Se publica en `main` (producción)
- Se cierra un sprint completo
- Hay cambios significativos en la arquitectura o funcionalidad

---

## Troubleshooting

### Shell no carga / Tabs no funcionan
- **Causa:** `index.html` fue editado incorrectamente.
- **Solución:** Revertir desde Git: `git checkout index.html`

### Capa 2 / Capa 3 quedan en blanco
- **Causa:** `capa-2-diccionario/index.html` o `capa-3-sql/index.html` tiene HTML inválido.
- **Verificación:** Abre la consola del navegador (F12) — busca errores de sintaxis.

### Los estilos no se aplican
- **Causa:** Faltan las fuentes de Google Fonts o hay conflicto de CSS.
- **Verificación:** Inspecciona el archivo CSS incrustado — debe incluir `@import url('...')`

---

## Contacto

- **Revisor:** Para aprobar/integrar cambios a `main`
- **Executor 1 (Carril Repo):** Para cambios en el shell o infraestructura
- **Executor 2 (Carril Contenido):** Para integración con modelo de dominio

---

**Última actualización:** 2026-05-10 | **Preparado por:** Revisor | **Vigente para:** v3.3.59+
