# Simulador UX — ARMC

Visualización en cuatro capas del flujo de captación y persistencia de leads en ARMC.

> **Estatus: módulo interno nativo del Hub.** El simulador se renderiza directamente dentro
> del Hub (`prisma-apex/index.html`), sin iframes. La nativización de las 4 capas (Línea B) y
> el movimiento físico a `prisma-apex/core/simulador-ux/` están **ejecutados**. No es un
> entregable público: el acceso es solo dentro del Hub autenticado. Definición técnica de
> partida en `docs/PROPUESTA-SIMULADOR-NATIVO-HUB.md`.

## Vistas

| Vista | Carpeta | Propósito |
|---|---|---|
| Capa 1 — UX | `capa-1-ux/` | Grafo de estados y transiciones. Simula decisiones, no captura datos. |
| Capa 2 — Diccionario | `capa-2-diccionario/` | Catálogos, contratos de formularios, eventos, mapeo a persistencia. |
| Capa 3 — SQL | `capa-3-sql/` | Esquema PostgreSQL canónico + diccionario de datos humano. |
| Mapa | `mapa/` | Matriz de trazabilidad: una fila por paso del flujo, cruza las tres capas. |

## Alcance verificado

A fecha actual solo está modelado lo verificado:

- **Capa 1:** seis nodos del flujo lineal base — `lead_entry_channel` (entrada), `web_contact_form_received` (rama web, input directo), `lead_conversation_started` (rama WhatsApp, primer contacto sin ficha aún), `lead_open_whatsapp` (rama WhatsApp, ficha creada tras confirmación explícita de nombres y apellidos con estado `LEAD_ABIERTO`), `lead_flow_submission_whatsapp` (rama WhatsApp, envío del Flow completo con transición a `LEAD_CONFIRMADO`), `lead_confirmed` (convergencia final: ficha con formulario completo persistida). Adicionalmente, **patrón transversal de handoff humano modelado como estado del lead**: `human_handoff_requested → human_handoff_active → human_handoff_closed`. Puede estar presente en cualquier punto del flujo base como representación analítica del estado, sin transiciones interactivas en el simulador. El patrón transversal no introduce nueva linealidad: el flujo base sigue siendo el camino canónico de captura.
- **Capa 2:** tres formularios — `web_contact_form` (canal web, un solo envío directo a `LEAD_CONFIRMADO`), `lead_open_whatsapp` (canal WhatsApp fase 1: crea ficha con estado `LEAD_ABIERTO`), `lead_flow_submission_whatsapp` (canal WhatsApp fase 2: actualiza ficha existente y transiciona a `LEAD_CONFIRMADO`) — y cinco eventos: `LEAD_CREATED` (emitido al crear la ficha en canal WhatsApp, solo tras confirmación explícita), `LEAD_CAPTURED` (emitido al enviar el formulario completo, en cualquiera de los dos canales), y los tres del handoff (`HUMAN_HANDOFF_REQUESTED`, `HUMAN_HANDOFF_ASSIGNED`, `HUMAN_HANDOFF_CLOSED`).
- **Capa 3:** cinco tablas — `armc_subjects` (identidad canónica del subject, entidad ligera), `armc_subject_identifiers` (teléfono/email del subject con vigencia, verificación y valores original+normalizado), `armc_leads` (episodio de captación; añade `subject_id NOT NULL REFERENCES armc_subjects(id)` sin CASCADE + `UNIQUE (subject_id, id)`; el resto del esquema se mantiene con estados `LEAD_ABIERTO / LEAD_CONFIRMADO`, CHECK condicional `armc_leads_demandas_confirmado`, y las seis columnas de handoff aditivas), `armc_events` (enum ampliado a cinco `event_type`: `LEAD_CREATED`, `LEAD_CAPTURED`, y los tres del handoff; añade `subject_id UUID NOT NULL REFERENCES armc_subjects(id)` sin CASCADE y FK compuesta `(subject_id, lead_id) → armc_leads(subject_id, id)` que reemplaza a la FK simple histórica) y `armc_handoffs` (historial completo del handoff; añade `subject_id` y FK compuesta con los mismos criterios que `armc_events`). FKs hacia `portal_users(id)` para identidad de humano. **En canal WhatsApp la ficha del lead se escribe en dos instantes**: `INSERT` tras confirmación explícita del lead (evento `LEAD_CREATED`, estado `LEAD_ABIERTO`) y `UPDATE` al enviar el Flow completo (evento `LEAD_CAPTURED`, estado `LEAD_CONFIRMADO`). En canal web se escribe en un único `INSERT` con estado `LEAD_CONFIRMADO` (evento `LEAD_CAPTURED`). En ambos canales, el `INSERT armc_leads` va precedido de una resolución del `subject_id` (política definida en S4); el subject es la identidad canónica y persiste a lo largo de todos los episodios y procesos del mismo individuo. Desde S2, tanto `armc_events` como `armc_handoffs` propagan el `subject_id` explícitamente y usan FK compuesta `(subject_id, lead_id)` para garantizar coherencia con el episodio del que provienen. La retirada de `ON DELETE CASCADE` en estas FKs (y en la FK a `armc_subjects`) impide eliminar físicamente un subject o un episodio mientras existan eventos o handoffs referenciándolo. La futura política de tratamiento, archivo o pseudonimización se resolverá de forma explícita.

En la captura inicial actualmente modelada (web y WhatsApp), el contrato refleja la presentación previa del Aviso de Privacidad para orientar comercialmente al contacto sobre servicios de ARMC. Los consentimientos explícitos obligatorios se desplazan a la fase posterior de creación de cuenta, fuera del alcance actual.

**Convención de silencio y reactivación del bot (N3-2 como convención derivada de N3-1):** el silencio del bot se deduce íntegramente de `armc_leads.handoff_state`: mientras `handoff_state ∈ ('requested', 'active')` el bot queda silenciado para esa conversación; al pasar a `handoff_state = 'closed'` el bot se **reactiva automáticamente** para la conversación. No se introducen columnas ni eventos específicos para silencio ni reactivación — todo se deriva del propio `handoff_state`.

**`closed_by` (identidad de quien cierra el handoff):** no se duplica en `armc_leads`. Vive solo en la fila `CLOSED` de `armc_handoffs` (vía `user_id`) y en el `payload_opcional` del evento `HUMAN_HANDOFF_CLOSED` (`closed_by_user_id`). Coherente con el principio "persistencia base ligera + historial completo".

Las piezas posteriores del flujo (respuesta automática, escalado humano, intake preclínico, detección automática de frustración, etc.) se añadirán a medida que se verifiquen. No se mantienen piezas especulativas en las capas.

## Arquitectura

El simulador es **nativo del Hub**: las 4 capas se renderizan en el DOM del Hub mediante
factories por instancia definidas en `prisma-apex/hub-analisis.js` (`createCapa1`, `createCapa2`,
`createCapa3`, `createMapa`), montadas por `mountSimuladorShell`. No hay iframes.

Esta carpeta (`prisma-apex/core/simulador-ux/`) contiene:

- **Datos** que el módulo nativo del Hub consume vía `fetch()` desde la ruta interna
  `/core/simulador-ux/...`:
  - `capa-2-diccionario/catalogo-demandas.json`, `forms/*.json`, `events/*.json`, `mappings.json`
  - `capa-3-sql/schema.sql`, `capa-3-sql/data-dictionary.md`
- **HTMLs standalone legacy** (`index.html` del shell y de cada capa): son las versiones
  pre-nativización. El Hub nativo **no las usa**; se conservan en el árbol a la espera de su
  retirada definitiva. En código ya no se exponen públicamente (ver "Rutas").

```
prisma-apex/core/simulador-ux/
├── README.md
├── index.html                          ← shell standalone legacy (no usado por el Hub)
├── capa-1-ux/
│   └── index.html                      ← capa standalone legacy
├── capa-2-diccionario/
│   ├── index.html                      ← capa standalone legacy
│   ├── catalogo-demandas.json          ← 20 demandas + 5 líneas de servicio (consumido)
│   ├── forms/
│   │   ├── web-contact-form.json        (consumido)
│   │   ├── lead-open-whatsapp.json      (consumido)
│   │   └── lead-flow-submission-whatsapp.json (consumido)
│   ├── events/
│   │   ├── lead-created.json            (consumido)
│   │   └── lead-captured.json           (consumido)
│   └── mappings.json                   ← form/evento → tabla (consumido)
├── capa-3-sql/
│   ├── index.html                      ← capa standalone legacy
│   ├── schema.sql                      ← DDL canónico (consumido)
│   └── data-dictionary.md              ← diccionario humano de columnas (consumido)
└── mapa/
    └── index.html                      ← capa standalone legacy
```

## Rutas

- **`/core/simulador-ux/...`** — ruta interna canónica. El código nativo del Hub fetchea de
  aquí (`CAPA2_BASE`, `CAPA3_BASE` en `prisma-apex/hub-analisis.js`).
- **`/publicados/armc/simulador-ux/...`** — ruta pública legacy. **En el repo está retirada:**
  `server/server.js` la redirige con `301 → /hub`. No es acceso canónico.
  - *Excepción operativa vigente en dev:* el entorno `dev.prismaconsul.com` tiene un override
    temporal en nginx que la sirve como compatibilidad estática en vez de redirigir, mientras
    existan páginas cacheadas que aún la consuman. Esa excepción vive en el edge de dev, **no
    en el repo**; se retira cuando se confirme que ningún consumidor la usa.
- El simulador **no tiene URL pública propia**: el acceso es la pestaña *Simulador UX ARMC*
  dentro del Hub (`/hub`, login-only), tanto en vista de usuario como en el detalle de
  usuario de administración.

## Convenciones

- **Solo lo verificado.** Si una pieza del flujo no está confirmada, no se modela. No hay placeholders ni piezas pendientes.
- **Un archivo, una responsabilidad.** Catálogo, formularios, eventos y mapeos viven separados.
- **Sin prosa dentro de los contratos JSON.** Los archivos describen estructura técnica. La narrativa va a este README.
- **Capa 1 muestra estados y decisiones.** No incrusta formularios ni grids de captura.
- **Capa 2 es contrato.** Cada formulario tiene id, canal, campos, derivados, reglas. Cada evento tiene id, payload mínimo/opcional, origen y destino.
- **Capa 3 es persistencia.** El esquema SQL es la verdad; el `data-dictionary.md` es la referencia humana.
- **El catálogo es referencia reutilizable.** Las 20 demandas viven en `catalogo-demandas.json` y los formularios apuntan a él (`fuente: "catalogo-demandas"`). Mismo patrón que países, categorías o cualquier dimensión en producto real.
- **`campos` vs `genera` en los contratos:**
  - **`campos`** = input de captura que llega al sistema junto con el envío del formulario. Puede provenir del usuario (datos tecleados) o del propio canal (ej. el teléfono que WhatsApp aporta automáticamente). En todos los casos viaja en el payload del envío. Equivale a `writeOnly` en OpenAPI/JSON Schema.
  - **`genera`** = atributos que el sistema asigna **después** de recibir el formulario (`id`, `fecha_primer_contacto`, `canal_origen`). No son input; son metadato de la fila persistida. Equivale a `readOnly` en OpenAPI/JSON Schema.
- **Naming de identificadores.** Convención verificada en el módulo; mantener al ampliar.
  - **Formularios.** El `id` del contrato y el valor de `paso` usan `lower_snake_case`. Los archivos en `forms/` usan `kebab-case` alineado semánticamente con ese `id`. Ejemplos: `web_contact_form` ↔ `web-contact-form.json`, `lead_open_whatsapp` ↔ `lead-open-whatsapp.json`, `lead_flow_submission_whatsapp` ↔ `lead-flow-submission-whatsapp.json`.
  - **Eventos.** El `id` del evento y el valor de `event_type` en SQL usan `UPPER_SNAKE_CASE`. El archivo en `events/` usa `kebab-case` alineado semánticamente con ese `id`. Ejemplos: `LEAD_CREATED` ↔ `lead-created.json`, `LEAD_CAPTURED` ↔ `lead-captured.json`. **El `paso` del evento apunta al nodo Capa 1 donde ocurre la señal** (convención del renderer nativo, ver §Navegación).
  - **Tablas y columnas SQL**: `lower_snake_case`. Ejemplos: `armc_leads`, `armc_events`, `canal_origen`, `lineas_servicio_detectadas`.
  - **Consistencia entre capas.** El `paso` declarado en un form de Capa 2 coincide literalmente con la clave del nodo correspondiente en `CAPA1_NODES` y con la fila correspondiente de `MAPA_ROWS`. Los nombres de evento y de tabla usados en `mappings.json` coinciden literalmente con los `id` canónicos de eventos y con los nombres de tabla del `schema.sql`.
- **`apex_submissions` está fuera del dominio ARMC.** Pertenece al discovery B2B de PRISMA APEX. No crea ni referencia subjects ARMC. Los dos dominios están separados.

## Navegación

Capa 2, Capa 3 y Mapa usan **sidebar + detalle + búsqueda** (patrón estándar EventCatalog / dbt docs / Stoplight / Backstage):

- Sidebar lateral con categorías colapsables.
- Buscador en cabecera que filtra todos los items en tiempo real.
- Panel central renderiza solo el item seleccionado.
- Listas largas (20 demandas) como tablas compactas con filtro propio.

**Cross-links entre capas:** cada formulario/evento muestra chips de trazabilidad que saltan a otras capas. Cada tabla muestra "Usado por". Cada nodo de Capa 1 con contrato muestra "Ver contrato en Capa 2". El Mapa permite saltar desde cualquier celda a su capa correspondiente. Mecánica técnica: **llamada directa entre instancias nativas** de capa dentro del Hub (`onNavigate` → `simNavigate` → `focusItem` de la capa destino). No hay `postMessage` ni iframes.

## Glosario

- **Lead:** persona que entra al flujo por web o WhatsApp. Su ficha vive en `armc_leads` con un `estado_actual` que evoluciona.
- **Ficha abierta (`LEAD_ABIERTO`):** ficha del lead ya creada pero pendiente de completar el formulario. Solo aparece en canal WhatsApp, entre el instante de la confirmación explícita de sus datos y el instante de enviar el Flow. Emitida por `LEAD_CREATED`.
- **Ficha confirmada (`LEAD_CONFIRMADO`):** ficha del lead con formulario completo enviado. Estado terminal del ciclo Lead. En WhatsApp se alcanza al enviar el Flow (Step 4); en web al enviar el formulario. Emitida por `LEAD_CAPTURED`.
- **Captura:** proceso completo de creación y confirmación de la ficha. En canal WhatsApp abarca dos fases (`LEAD_CREATED` → `LEAD_CAPTURED`); en canal web es una sola fase (`LEAD_CAPTURED`).
- **Demanda:** una de las 20 frases del catálogo (`catalogo-demandas.json`).
- **Línea de servicio:** agrupación clínica/operativa derivada de las demandas.
- **Evento:** transición observable del ciclo del lead. Se persiste en `armc_events`.
- **Resolución por contexto:** en `lead_flow_submission_whatsapp` la ficha a actualizar se identifica por contexto del canal (teléfono en WhatsApp), no por un campo `lead_id` en el input del formulario.
- **Confirmación explícita:** aceptación por parte del lead de los datos parseados (`nombres` + `apellidos` + `telefono`). Solo tras confirmación se crea la ficha (evento `LEAD_CREATED`, estado `LEAD_ABIERTO`). El parse previo del mensaje libre no persiste.
- **Patrón conversacional de captura (informativo):** (1) el lead envía mensaje libre con sus datos; (2) el sistema parsea provisionalmente solo para UX; (3) el sistema muestra al lead los datos parseados y pide confirmación; (4a) si confirma → `INSERT` + `LEAD_CREATED`; (4b) si corrige → fallback a preguntas separadas por campo hasta obtener confirmación. **Alcance actual: sin bot real, sin LLM.** La persistencia de los mensajes previos pertenece a Slice C.
- **Subject:** identidad transversal de un individuo dentro del dominio ARMC. Persiste a lo largo de todos sus estados y procesos.
- **`subject_id`:** UUID vital, canónico e inmutable del subject. PK de `armc_subjects`. FK en `armc_leads.subject_id` (y, en S2, en `armc_events.subject_id` y `armc_handoffs.subject_id`).
- **Episodio de lead:** una fila de `armc_leads`. Un subject puede tener múltiples episodios en el tiempo (`Subject 1:N Lead`).
- **`lead_id`:** UUID del episodio. PK de `armc_leads`. Distinto de `subject_id`.
- **Identifier:** teléfono o email asociado al subject, con vigencia y posible verificación. Vive en `armc_subject_identifiers`. Nunca constituye por sí solo identidad. Un match exacto produce un candidato de reconocimiento, no fusión automática.

## Desarrollo local

El simulador es parte del Hub; se prueba levantando el servidor del proyecto:

```bash
cd server && node server.js
```

Acceso: `http://localhost:3000/hub` → pestaña *Simulador UX ARMC*.

Los datos de las capas se sirven en `http://localhost:3000/core/simulador-ux/...`.