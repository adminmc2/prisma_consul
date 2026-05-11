# Simulador UX — ARMC

Visualización en tres capas del flujo operativo de captación y conversión de leads en ARMC.

## Capas

| Capa | Carpeta | Propósito |
|---|---|---|
| 1 — UX | `capa-1-ux/` | Grafo de estados y transiciones. Simula decisiones, no captura datos. |
| 2 — Diccionario | `capa-2-diccionario/` | Catálogos, contratos de formularios, eventos, mapeo a persistencia. |
| 3 — SQL | `capa-3-sql/` | Esquema PostgreSQL canónico + diccionario de datos. |

## Estructura

```
simulador-ux/
├── README.md
├── index.html                          ← Shell con tabs (no editar)
├── capa-1-ux/
│   └── index.html                      ← Grafo interactivo
├── capa-2-diccionario/
│   ├── index.html                      ← Renderizador
│   ├── catalogo-demandas.json          ← 25 demandas + líneas de servicio
│   ├── forms/
│   │   ├── lead-capture.json
│   │   └── super-form-completed.json
│   ├── events/
│   │   ├── lead-captured.json
│   │   ├── auto-response-sent.json
│   │   ├── human-support-requested.json
│   │   ├── lead-followup-pending.json
│   │   ├── super-form-completed.json
│   │   └── usuario-creado.json
│   └── mappings.json                   ← form/evento → tabla/columna
└── capa-3-sql/
    ├── index.html                      ← Renderizador (DDL + diccionario)
    ├── schema.sql                      ← DDL canónico
    └── data-dictionary.md              ← Una fila por columna
```

## Convenciones

- **Un archivo, una responsabilidad.** Catálogo, formularios, eventos y mapeos viven separados.
- **Sin prosa dentro de los contratos JSON.** Los archivos describen estructura técnica. La narrativa va a este README.
- **Capa 1 muestra estados y decisiones.** No incrusta formularios ni grids de captura.
- **Capa 2 es contrato.** Cada formulario tiene id, canal, campos, derivados, reglas. Cada evento tiene id, payload mínimo/opcional, origen y destino.
- **Capa 3 es persistencia.** El esquema SQL es la verdad; el `data-dictionary.md` es la referencia humana.
- **El catálogo es referencia reutilizable.** Las 25 demandas no viven dentro del formulario que las consume; viven en `catalogo-demandas.json` y el campo del formulario apunta a ese catálogo (`fuente: "catalogo-demandas"`). Mismo patrón que países, categorías o cualquier dimensión en producto real.

## Navegación

Capa 2 y Capa 3 usan el patrón **sidebar + detalle + búsqueda** estándar del sector (EventCatalog, dbt docs, dbdocs, Stoplight, Backstage):

- Sidebar lateral con categorías colapsables.
- Buscador en cabecera del sidebar; filtra todos los items en tiempo real.
- Panel central renderiza solo el item seleccionado.
- Listas largas (catálogo de demandas, índices) se muestran como tablas compactas con filtro propio.

No hay framework ni build step: HTML + JS plano que consume los JSON existentes.

## Glosario

- **Lead:** persona que entra al flujo por web o WhatsApp.
- **Captura:** registro inicial del lead con sus datos de contacto y demandas seleccionadas.
- **Demanda:** una de las 25 frases del catálogo (`catalogo-demandas.json`).
- **Línea de servicio:** agrupación clínica/operativa derivada de las demandas.
- **Evento:** transición observable del lead. Se persiste en `armc_events`.
- **Intake preclínico:** cierre operativo previo a la valoración (`super_form_completed`).

## Desarrollo local

Servir la carpeta del simulador con cualquier HTTP server:

```bash
cd prisma-apex/clientes-publicados/armc/simulador-ux
python3 -m http.server 8766
```

Acceso: `http://127.0.0.1:8766/index.html`

## Carril de trabajo

Edición sobre el worktree `web-de-prisma-simulador-executor3`, rama `chore/contenido-simulador-v3.3.60`. La integración a `dev` la decide el revisor.