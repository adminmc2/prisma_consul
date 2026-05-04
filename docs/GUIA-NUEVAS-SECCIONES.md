# Cómo entregar material de análisis a PRISMA Hub

## Qué es esto

Eres un Claude que trabaja en un proyecto de consultoría. Cuando generas material de análisis (diagramas de flujo, mapas de procesos, etc.), ese material se publica en **PRISMA Hub** — el portal web de clientes de PRISMA Consul.

Este documento te explica cómo **colocar tus archivos y registrarlos** directamente en el repositorio `web-de-prisma` para que aparezcan en el Hub sin intervención manual.

**Después de que hagas tus cambios, el Claude del proyecto Hub los revisará antes de desplegar.**

---

## Dónde estás trabajando

El repositorio es `web-de-prisma`. La ruta relevante para ti es:

```
web-de-prisma/
├── portal/
│   ├── index.html              ← SPA del Hub (~2500 líneas, HTML/CSS/JS vanilla)
│   └── analisis/               ← AQUÍ VA TODO TU MATERIAL
│       ├── GUIA-NUEVAS-SECCIONES.md   ← Este archivo
│       └── armc/               ← Ejemplo: proyecto ARMC (ya completado)
│           ├── css/estilos-prisma.css
│           └── diagramas/
│               ├── flujo-atención-paciente.html
│               ├── flujo-cirujano.html
│               ├── flujo-enfermero.html
│               ├── flujo-cosmiatra.html
│               ├── flujo-primer-ayudante.html
│               ├── flujo-tricologia.html
│               └── flujo-ceo.html
```

**Rama de trabajo**: `dev` (nunca `main`)

---

## Cómo funciona la pestaña de Análisis en el Hub

El usuario ve una navegación en **3 capas**:

```
┌──────────────────────────────────────────────────┐
│  Capa 1 — SECCIONES (grid 4 columnas)            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Análisis │ │ Tu nueva │ │  Otra    │          │
│  │ por roles│ │ sección  │ │ futura   │          │
│  └──────────┘ └──────────┘ └──────────┘          │
└──────────────────────────────────────────────────┘
        │ clic
        ▼
┌──────────────────────────────────────────────────┐
│  Capa 2 — ELEMENTOS de esa sección (grid 4 col)  │
│  [← Volver]                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐│
│  │Elemento 1│ │Elemento 2│ │Elemento 3│ │Elem 4││
│  └──────────┘ └──────────┘ └──────────┘ └──────┘│
└──────────────────────────────────────────────────┘
        │ clic
        ▼
┌──────────────────────────────────────────────────┐
│  Capa 3 — VISOR (iframe con tu archivo HTML)      │
│  [← Volver a elementos]    Título del elemento    │
│  ┌────────────────────────────────────────────── │
│  │                                                │
│  │   Tu archivo HTML renderizado aquí              │
│  │                                                │
│  └────────────────────────────────────────────── │
└──────────────────────────────────────────────────┘
```

Cada archivo HTML tuyo se carga en un **iframe con sandbox** (`allow-scripts allow-same-origin`). Tu HTML debe ser autocontenido.

---

## Paso a paso: entregar una nueva sección

### 1. Crea tus archivos HTML en `portal/analisis/`

Crea una subcarpeta con tus archivos. La estructura es libre, pero mantén coherencia:

```
portal/analisis/armc/procesos/          ← Ejemplo
├── proceso-recepcion.html
├── proceso-facturacion.html
└── proceso-inventario.html
```

**Cada archivo HTML debe:**
- Ser **completamente autocontenido** (incluir sus propios CSS, JS, fuentes)
- Funcionar si se abre directamente en el navegador
- **NO depender de nada externo** al propio archivo (se carga en iframe aislado)
- **NO incluir footer** de empresa/proyecto
- Usar caracteres UTF-8 reales (`é`, `ñ`, `á`) — nunca escapes como `\u00e9`

### 2. Registra la sección en `prisma-apex/index.html`

Busca el array `ANALISIS_SECTIONS` (aprox. línea 2299). Añade tu sección:

```js
// ESTADO ACTUAL:
const ANALISIS_SECTIONS = [
  { id: 'roles', title: 'Análisis por roles', icon: 'ph ph-users-three', desc: '7 flujos operativos analizados por rol' }
];

// DESPUÉS DE TU CAMBIO:
const ANALISIS_SECTIONS = [
  { id: 'roles', title: 'Análisis por roles', icon: 'ph ph-users-three', desc: '7 flujos operativos analizados por rol' },
  { id: 'procesos', title: 'Análisis de procesos', icon: 'ph ph-flow-arrow', desc: 'Flujos de recepción, facturación e inventario' }
];
```

Los campos:
- `id` — identificador único en minúsculas sin espacios (lo usarás en el JS)
- `title` — texto visible en la tarjeta
- `icon` — icono de Phosphor Icons, siempre con formato `ph ph-nombre-icono` (catálogo: https://phosphoricons.com)
- `desc` — descripción corta bajo el título

### 3. Crea tu array de elementos y ruta base

Justo debajo de `ANALISIS_SECTIONS`, añade:

```js
const ANALISIS_PROCESOS = [
  { id: 'recepcion', file: 'proceso-recepcion.html', title: 'Recepción', icon: 'ph ph-door-open', desc: 'Flujo de entrada del paciente' },
  { id: 'facturacion', file: 'proceso-facturacion.html', title: 'Facturación', icon: 'ph ph-receipt', desc: 'Proceso de cobro y facturación' },
  { id: 'inventario', file: 'proceso-inventario.html', title: 'Inventario', icon: 'ph ph-package', desc: 'Control de materiales y stock' }
];
const ANALISIS_PROCESOS_PATH = '/publicados/armc/procesos/';
```

- `file` debe coincidir exactamente con el nombre del archivo HTML que creaste
- La ruta (`PATH`) es relativa a la raíz del servidor, empieza con `/publicados/[cliente]/...` (URL canónica vigente desde el subpaso 2.2 / `v3.3.31`). El path legacy `/portal/analisis/[cliente]/...` sigue funcionando vía redirect 301, pero **no debe usarse** para nuevas secciones.

### 4. Añade la lógica en `analisisOpenSection`

Busca la función `analisisOpenSection` (aprox. línea 2327). Tiene un `if` para cada sección. Añade el tuyo **sin tocar los existentes**:

```js
function analisisOpenSection(sectionId) {
  if (sectionId === 'roles') {
    // ... código existente — NO TOCAR ...
  }

  // ↓ TU NUEVO BLOQUE ↓
  if (sectionId === 'procesos') {
    const grid = document.getElementById('analisisRolesGrid');
    grid.innerHTML = ANALISIS_PROCESOS.map(r => `
      <div class="analisis-role-card" onclick="analisisOpenRole('${r.id}', 'procesos')">
        <div class="role-icon"><i class="${r.icon}"></i></div>
        <h3>${r.title}</h3>
        <p>${r.desc}</p>
      </div>
    `).join('');
    document.getElementById('analisisSectionTitle').textContent = 'Análisis de procesos';
    document.getElementById('analisis-sections').style.display = 'none';
    document.getElementById('analisis-roles').style.cssText = '';
  }
}
```

### 5. Modifica `analisisOpenRole` para aceptar tu sección

La función actual solo busca en `ANALISIS_ROLES`. Debes añadir el parámetro `sectionId`:

```js
// ANTES:
function analisisOpenRole(roleId) {
  const role = ANALISIS_ROLES.find(r => r.id === roleId);
  if (!role) return;
  document.getElementById('analisisIframe').src = ANALISIS_BASE_PATH + role.file;
  ...
}

// DESPUÉS:
function analisisOpenRole(roleId, sectionId) {
  let items, basePath;
  if (sectionId === 'procesos') {
    items = ANALISIS_PROCESOS;
    basePath = ANALISIS_PROCESOS_PATH;
  } else {
    items = ANALISIS_ROLES;
    basePath = ANALISIS_BASE_PATH;
  }

  const role = items.find(r => r.id === roleId);
  if (!role) return;
  document.getElementById('analisisIframe').src = basePath + role.file;
  document.getElementById('analisisViewerTitle').textContent = role.title;
  document.getElementById('analisis-roles').style.display = 'none';
  document.getElementById('analisis-viewer').style.cssText = '';
}
```

**IMPORTANTE** — Al añadir el parámetro `sectionId`, también debes actualizar la llamada existente en el caso `'roles'` de `analisisOpenSection`:

```js
// ANTES (dentro del if 'roles'):
onclick="analisisOpenRole('${r.id}')"

// DESPUÉS:
onclick="analisisOpenRole('${r.id}', 'roles')"
```

### 6. Replica todo en las funciones `ud` (admin)

El Hub tiene funciones duplicadas para el panel de administrador (cuando el admin ve el análisis de un usuario). Son **idénticas en lógica**, solo cambian los IDs del DOM (llevan prefijo `ud`).

Busca el comentario `// ── Admin: User Detail Análisis (3 capas) ──` y replica exactamente los mismos cambios en:

- `udAnalisisOpenSection()` — añadir tu `if` con tu sección
- `udAnalisisOpenRole()` — añadir `sectionId` y tu lógica

**Tabla de equivalencias de IDs:**

| Función cliente | Función admin |
|----------------|---------------|
| `analisisRolesGrid` | `udAnalisisRolesGrid` |
| `analisisSectionTitle` | `udAnalisisSectionTitle` |
| `analisis-sections` | `ud-analisis-sections` |
| `analisis-roles` | `ud-analisis-roles` |
| `analisis-viewer` | `ud-analisis-viewer` |
| `analisisIframe` | `udAnalisisIframe` |
| `analisisViewerTitle` | `udAnalisisViewerTitle` |
| `analisisOpenRole(...)` | `udAnalisisOpenRole(...)` |

---

## Sistema de diseño PRISMA (obligatorio para tus HTML)

### Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Navy | `#101B2C` | Fondo base de página |
| Primary BG | `#1a2535` | Fondo de secciones, tarjetas |
| Clinical White | `#FAF9F6` | Texto principal |
| Tech Cyan | `#31BEEF` | Acento principal (bordes, links, hover) |
| Visionary Violet | `#994E95` | Acento secundario |
| Soft Blue | `#A1B8F2` | Terciario |
| Warning | `#FFC107` | Alertas, gaps |

### Tipografía

```html
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;600&display=swap" rel="stylesheet">
```

- **Títulos**: `font-family: 'Quicksand', sans-serif` (weight 600-700)
- **Cuerpo**: `font-family: 'Source Sans 3', sans-serif` (weight 300-600)

### Botones de navegación prev/next

```css
.nav-links { display: flex; gap: 1rem; margin-top: 2rem; justify-content: space-between; }
.nav-links a {
  flex: 1; padding: 1rem; text-align: center;
  background: #1a2535; border: 1px solid #31BEEF;
  border-radius: 4px 25px 25px 4px;
  transition: all 400ms ease; color: #FAF9F6; text-decoration: none;
}
.nav-links a:hover { background: #31BEEF; color: #101B2C; }
.nav-links a:first-child { border-radius: 25px 4px 4px 25px; }
```

Regla del border-radius: **el borde recto mira hacia dentro** (hacia el centro).

### Mermaid (si usas diagramas de flujo)

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
      darkMode: true, background: 'transparent',
      primaryColor: '#1a2535', primaryTextColor: '#FAF9F6', primaryBorderColor: '#31BEEF',
      secondaryColor: '#1a2535', secondaryBorderColor: '#994E95',
      lineColor: '#31BEEF', textColor: '#FAF9F6',
      clusterBkg: '#162033', clusterBorder: '#253545', edgeLabelBackground: '#1a2535',
      fontFamily: '"Source Sans 3", sans-serif', fontSize: '14px'
    },
    flowchart: { htmlLabels: true, curve: 'basis', padding: 15, nodeSpacing: 50, rankSpacing: 55 }
  });
</script>
```

---

## Lo que NO debes tocar

1. **Archivos existentes** en `portal/analisis/armc/diagramas/` — son inmutables
2. **HTML estructural** del Hub — las `<div>` con IDs `tab-analisis`, `analisis-sections`, `analisis-roles`, `analisis-viewer` y sus equivalentes `ud-`
3. **CSS del Hub** — las clases `.analisis-layer`, `.analisis-layer-flex`, `.analisis-container`, `.analisis-sections-grid`, `.analisis-role-card`, etc.
4. **Funciones de navegación base** — `analisisShowSections()`, `analisisShowRoles()`, `loadAnalisis()`, `loadUdAnalisis()` y equivalentes `ud`
5. **Nunca usar `style.display = ''`** para mostrar — usar `style.cssText = ''`

---

## Git: cómo entregar

```bash
# Asegúrate de estar en la rama dev
git checkout dev
git pull origin dev

# Haz tus cambios (archivos HTML + ediciones en prisma-apex/index.html)
# ...

# Commit
git add portal/analisis/tu-carpeta/
git add prisma-apex/index.html
git commit -m "Add [nombre de tu sección] analysis to Hub Análisis tab"

# Push a dev
git push origin dev
```

**NO hagas merge a main** — el Claude del Hub revisará tus cambios y se encargará del deploy.

---

## Referencia rápida: ejemplo completo de ARMC

Para que veas el patrón completo que ya está funcionando:

**Archivos**: 7 HTML en `portal/analisis/armc/diagramas/`

**En `prisma-apex/index.html`:**
```js
// Array de sección (Capa 1)
const ANALISIS_SECTIONS = [
  { id: 'roles', title: 'Análisis por roles', icon: 'ph ph-users-three', desc: '7 flujos operativos analizados por rol' }
];

// Array de elementos (Capa 2) + ruta
const ANALISIS_ROLES = [
  { id: 'atencion-paciente', file: 'flujo-atención-paciente.html', title: 'Atención al Paciente', icon: 'ph ph-user', desc: 'Captación, conversión, seguimiento y reportes' },
  { id: 'cirujano', file: 'flujo-cirujano.html', title: 'Cirujano', icon: 'ph ph-stethoscope', desc: 'Evaluación, procedimiento y seguimiento post' },
  // ... 5 más ...
];
const ANALISIS_BASE_PATH = '/publicados/armc/diagramas/';

// En analisisOpenSection:
if (sectionId === 'roles') { /* poblar grid con ANALISIS_ROLES, mostrar capa 2 */ }

// En analisisOpenRole:
// buscar en ANALISIS_ROLES, cargar ANALISIS_BASE_PATH + file en iframe
```

Sigue exactamente este patrón para tus nuevas secciones.

> **Nota tras el subpaso 2.2 (`v3.3.31`).** La URL canónica vigente para entregables publicados es `/publicados/[cliente]/...`. El ejemplo legacy `/portal/analisis/[cliente]/...` sigue resolviendo vía redirect 301, pero **no debe usarse** para código nuevo. Patrón actual recomendado: usar `ANALISIS_REGISTRY` (capa de registro de rutas) en lugar de constantes ad-hoc tipo `ANALISIS_BASE_PATH`.
