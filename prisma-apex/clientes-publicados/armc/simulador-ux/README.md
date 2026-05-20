# Simulador UX — ARMC

Visualización en cuatro vistas del flujo de captación y persistencia de leads en ARMC.

> **Estatus: módulo interno del Hub en construcción** — no es un entregable público estable
> cerrado. Reclasificado en el pase A (carril contenido). Su paso a superficie nativa del Hub
> (eliminación de iframes) y el movimiento físico a `prisma-apex/core/simulador-ux/` se
> ejecutan en la línea B del refactor, todavía no abierta. Definición técnica completa en
> `docs/PROPUESTA-SIMULADOR-NATIVO-HUB.md`.

## Vistas

| Vista | Carpeta | Propósito |
|---|---|---|
| Capa 1 — UX | `capa-1-ux/` | Grafo de estados y transiciones. Simula decisiones, no captura datos. |
| Capa 2 — Diccionario | `capa-2-diccionario/` | Catálogos, contratos de formularios, eventos, mapeo a persistencia. |
| Capa 3 — SQL | `capa-3-sql/` | Esquema PostgreSQL canónico + diccionario de datos humano. |
| Mapa | `mapa/` | Matriz de trazabilidad: una fila por paso del flujo, cruza las tres capas. |

## Alcance verificado

A fecha actual solo está modelado lo verificado:

- **Capa 1:** cuatro nodos — `lead_entry_channel` (entrada), `web_contact_form_received` (rama web, input), `lead_capture_whatsapp` (rama WhatsApp, input), `lead_captured` (convergencia técnica: donde se emite el evento y persisten los datos).
- **Capa 2:** dos formularios (`web_contact_form`, `lead_capture`) que actúan como input, y un evento (`LEAD_CAPTURED`) emitido al converger.
- **Capa 3:** dos tablas (`armc_leads`, `armc_events`) con enums limitados al estado `LEAD_CAPTURED`. La escritura ocurre una sola vez por lead, en el momento de convergencia.

Las piezas posteriores del flujo (respuesta automática, escalado humano, intake preclínico, etc.) se añadirán a medida que se verifiquen. No se mantienen piezas especulativas en las capas.

## Estructura

```
simulador-ux/
├── README.md
├── index.html                          ← Shell con 4 tabs (no editar)
├── capa-1-ux/
│   └── index.html                      ← Grafo interactivo
├── capa-2-diccionario/
│   ├── index.html                      ← Renderizador con sidebar + detalle
│   ├── catalogo-demandas.json          ← 25 demandas + 5 líneas de servicio
│   ├── forms/
│   │   ├── web-contact-form.json
│   │   └── lead-capture.json
│   ├── events/
│   │   └── lead-captured.json
│   └── mappings.json                   ← form/evento → tabla
├── capa-3-sql/
│   ├── index.html                      ← Renderizador con sidebar + detalle
│   ├── schema.sql                      ← DDL canónico
│   └── data-dictionary.md              ← Diccionario humano de columnas
└── mapa/
    └── index.html                      ← Matriz de trazabilidad
```

## Convenciones

- **Solo lo verificado.** Si una pieza del flujo no está confirmada, no se modela. No hay placeholders ni piezas pendientes.
- **Un archivo, una responsabilidad.** Catálogo, formularios, eventos y mapeos viven separados.
- **Sin prosa dentro de los contratos JSON.** Los archivos describen estructura técnica. La narrativa va a este README.
- **Capa 1 muestra estados y decisiones.** No incrusta formularios ni grids de captura.
- **Capa 2 es contrato.** Cada formulario tiene id, canal, campos, derivados, reglas. Cada evento tiene id, payload mínimo/opcional, origen y destino.
- **Capa 3 es persistencia.** El esquema SQL es la verdad; el `data-dictionary.md` es la referencia humana.
- **El catálogo es referencia reutilizable.** Las 25 demandas viven en `catalogo-demandas.json` y los formularios apuntan a él (`fuente: "catalogo-demandas"`). Mismo patrón que países, categorías o cualquier dimensión en producto real.
- **`campos` vs `genera` en los contratos:**
  - **`campos`** = input de captura que llega al sistema junto con el envío del formulario. Puede provenir del usuario (datos tecleados) o del propio canal (ej. el teléfono que WhatsApp aporta automáticamente). En todos los casos viaja en el payload del envío. Equivale a `writeOnly` en OpenAPI/JSON Schema.
  - **`genera`** = atributos que el sistema asigna **después** de recibir el formulario (`id`, `fecha_primer_contacto`, `canal_origen`). No son input; son metadato de la fila persistida. Equivale a `readOnly` en OpenAPI/JSON Schema.

## Navegación

Capa 2, Capa 3 y Mapa usan **sidebar + detalle + búsqueda** (patrón estándar EventCatalog / dbt docs / Stoplight / Backstage):

- Sidebar lateral con categorías colapsables.
- Buscador en cabecera que filtra todos los items en tiempo real.
- Panel central renderiza solo el item seleccionado.
- Listas largas (25 demandas) como tablas compactas con filtro propio.

**Cross-links entre capas:** cada formulario/evento muestra chips de trazabilidad que saltan a otras capas. Cada tabla muestra "Usado por". Cada nodo de Capa 1 con contrato muestra "Ver contrato en Capa 2". El Mapa permite saltar desde cualquier celda a su capa correspondiente. Mecánica técnica: `postMessage` entre el shell y los iframes.

## Glosario

- **Lead:** persona que entra al flujo por web o WhatsApp.
- **Captura:** registro inicial del lead con sus datos de contacto y demandas seleccionadas.
- **Demanda:** una de las 25 frases del catálogo (`catalogo-demandas.json`).
- **Línea de servicio:** agrupación clínica/operativa derivada de las demandas.
- **Evento:** transición observable del lead. Se persiste en `armc_events`.

## Desarrollo local

```bash
cd prisma-apex/clientes-publicados/armc/simulador-ux
python3 -m http.server 8766
```

Acceso: `http://127.0.0.1:8766/index.html`

## Carril de trabajo

Edición sobre el worktree `web-de-prisma-simulador-executor3`. La integración a `dev` la decide el revisor.
