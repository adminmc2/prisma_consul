# Simulador UX — ARMC

**Status:** En desarrollo | **Versión:** v3.3.59 | **Responsable:** Executor 3

---

## Propósito

Presentación interactiva del flujo operativo de ARMC con 3 capas:

1. **Capa 1 — UX (Grafo):** Visualización interactiva del flujo con nodos, relaciones, zoom y estado visible de la simulación.
2. **Capa 2 — Diccionario:** Eventos operativos, payloads JSON, y contratos de datos.
3. **Capa 3 — SQL:** Esquema de base de datos PostgreSQL que respalda el flujo.

---

## Estructura de Directorios

```
simulador-ux/
├── README.md                            ← Este archivo
├── index.html                           ← Shell (tabs, layout) — editar solo si cambia navegación/layout
├── capa-1-ux/
│   └── index.html                       ← Grafo interactivo — editable
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

- **`capa-1-ux/index.html`** — Simulación interactiva de la Capa 1 (copy, flujo visible, estados, nodos y comportamiento de la experiencia).
- **`capa-2-diccionario/index.html`** — Contenido HTML de la Capa 2 (eventos, payloads).
- **`capa-2-diccionario/data.json`** — Estructura de eventos operativos.
- **`capa-3-sql/index.html`** — Contenido HTML de la Capa 3 (descripciones, ejemplos).
- **`capa-3-sql/schema.sql`** — Definiciones de tablas SQL.
- **Este README** — Documentación y guía.

### ❌ Executor 3 NO PUEDE EDITAR:

- **`index.html`** (Shell) — Contiene la navegación entre capas, layout flexbox y el contenedor general. Solo se toca si el cambio afecta al shell completo.

---

## Flujo de Trabajo

### Desarrollo Local (Executor 3)

Trabajas en el worktree dedicado `web-de-prisma-simulador-executor3`:

```bash
cd /Users/armandocruz/Documents/PRISMA\ CONSUL/PHARMA/web-de-prisma-simulador-executor3
git checkout chore/contenido-simulador-v3.3.59  # Rama de trabajo
```

### Editar Contenido

1. **Capa 1 (UX / Grafo):**
   - Abre `prisma-apex/clientes-publicados/armc/simulador-ux/capa-1-ux/index.html`
   - Ajusta copy, flujo visible y comportamiento interactivo de la simulación
   - Mantén coherencia con el shell y verifica que zoom, drag y estado visible sigan funcionando

2. **Capa 2 (Diccionario):**
   - Abre `prisma-apex/clientes-publicados/armc/simulador-ux/capa-2-diccionario/index.html`
   - Reemplaza el placeholder `<!-- Executor 3: ... -->` con tu contenido HTML
   - Actualiza `data.json` con eventos operativos reales

3. **Capa 3 (SQL):**
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
- **Capa 1 (aislada):** `http://localhost:3000/publicados/armc/simulador-ux/capa-1-ux`
- **Capa 2 (aislada):** `http://localhost:3000/publicados/armc/simulador-ux/capa-2-diccionario`
- **Capa 3 (aislada):** `http://localhost:3000/publicados/armc/simulador-ux/capa-3-sql`

### Commit y Handoff

Cuando termines una sección:

```bash
git add prisma-apex/clientes-publicados/armc/simulador-ux/capa-1-ux
git add prisma-apex/clientes-publicados/armc/simulador-ux/capa-2-diccionario
git add prisma-apex/clientes-publicados/armc/simulador-ux/capa-3-sql
git commit -m "feat: simulador UX ARMC — trabajo en capas 1, 2 y 3 v3.3.59"
git log --oneline -5  # Obtén el SHA del commit
```

Comunica al revisor:
- SHA del commit completado
- Qué contenido incluye (Capa 1, Capa 2, Capa 3, o combinación)
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

### Capa 1 / Capa 2 / Capa 3 quedan en blanco
- **Causa:** `capa-1-ux/index.html`, `capa-2-diccionario/index.html` o `capa-3-sql/index.html` tiene HTML inválido.
- **Verificación:** Abre la consola del navegador (F12) — busca errores de sintaxis.

### Zoom, drag o última acción dejan de reflejarse
- **Causa:** Se tocó la lógica interactiva de `capa-1-ux/index.html` y el wiring visual dejó de estar alineado.
- **Verificación:** Recarga la Capa 1 aislada y comprueba que el flujo responde antes de revisar el shell.

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
