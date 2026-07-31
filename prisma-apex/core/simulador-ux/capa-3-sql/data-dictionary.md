# Diccionario de datos — Capa 3

Referencia humana de cada columna del esquema SQL. Complemento del DDL en `schema.sql`.

Alcance verificado: tablas necesarias para la captura del lead (acción de entrada hasta los formularios web y WhatsApp) y el **handoff humano** modelado como patrón transversal (`requested → active → closed`). Se ampliará a medida que se verifiquen nuevas piezas del flujo.

## `armc_leads`

| Columna | Tipo | Nulo | Dominio / Default | Descripción |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | Identificador único del lead. |
| `nombres` | VARCHAR(120) | NO | — | Uno o más nombres de pila del lead. Un solo campo por convención canónica. |
| `apellidos` | VARCHAR(240) | NO | — | Uno o dos apellidos del lead. Un solo campo por convención canónica; sin subdivisión en paterno/materno ni primer/segundo. |
| `email` | VARCHAR(255) | SÍ | — | Correo del lead. Opcional para canal WhatsApp. |
| `telefono` | VARCHAR(20) | NO | — | Teléfono de contacto. |
| `canal_origen` | VARCHAR(50) | NO | enum | `WEB_FORM`, `WHATSAPP`. |
| `demanda_ids_seleccionados` | INT[] | SÍ | — | Array de IDs (INT[]) del catálogo `catalogo-demandas` seleccionados activamente por el lead. En `LEAD_ABIERTO` puede ser `NULL`; en `LEAD_CONFIRMADO` se exige cardinalidad ≥ 1 vía CHECK condicional. Sin FK por elemento — la integridad referencial de cada ID contra el catálogo no está garantizada a nivel SQL (limitación conocida del simulador). |
| `lineas_servicio_detectadas` | VARCHAR(100)[] | NO | `ARRAY[]` | Líneas de servicio derivadas de `demanda_ids_seleccionados` y persistidas al confirmar la ficha. Conservan el resultado calculado en ese momento; no preservan por sí mismas la versión completa del catálogo utilizado. |
| `comentario_libre_lead` | TEXT | SÍ | — | Comentario opcional que el lead escribe al momento de la captación inicial (Step 3 del Flow WhatsApp o formulario web). Un único texto libre por lead, no un histórico conversacional. No confundir con notas clínicas, notas internas, notas de evolución ni notas pre-consulta del modelo canónico F2. |
| `estado_actual` | VARCHAR(50) | NO | `LEAD_ABIERTO` (default); enum `LEAD_ABIERTO / LEAD_CONFIRMADO` | Estado actual del lead en el ciclo Lead. `LEAD_ABIERTO` cuando la ficha se crea tras confirmación explícita del lead sobre nombres, apellidos y teléfono (solo canal WhatsApp). `LEAD_CONFIRMADO` cuando se envía el formulario completo (Step 4 del Flow WhatsApp o formulario web). |
| `fecha_primer_contacto` | TIMESTAMPTZ | NO | `NOW()` | Fecha y hora del primer contacto del lead con ARMC. Se asigna automáticamente al crear la fila. |
| `handoff_state` | VARCHAR(20) | NO | `'none'`; enum `none / requested / active / closed` | Estado actual del handoff humano para esta conversación. `none` cuando el handoff no ha sido solicitado. |
| `handoff_assigned_to` | INTEGER | SÍ | FK → `portal_users(id)` ON DELETE SET NULL | Humano que tiene asignado el handoff actualmente. NULL mientras el handoff no esté en `active`. |
| `handoff_close_reason` | VARCHAR(20) | SÍ | enum `manual / inactivity` | Motivo del cierre del handoff. NULL salvo cuando `handoff_state = 'closed'`. |
| `handoff_requested_at` | TIMESTAMPTZ | SÍ | — | Timestamp de la solicitud de handoff. |
| `handoff_assigned_at` | TIMESTAMPTZ | SÍ | — | Timestamp de la asignación al humano actual. |
| `handoff_closed_at` | TIMESTAMPTZ | SÍ | — | Timestamp del cierre del handoff. |
| `created_at` | TIMESTAMPTZ | SÍ | `NOW()` | Fecha de creación. |
| `updated_at` | TIMESTAMPTZ | SÍ | `NOW()` | Fecha de última modificación. |

**Estados válidos (alcance verificado):** `LEAD_ABIERTO`, `LEAD_CONFIRMADO`.

**Regla de creación de ficha (canal WhatsApp):** el `INSERT armc_leads` con `estado_actual = 'LEAD_ABIERTO'` solo se ejecuta tras **confirmación explícita** del lead sobre los datos parseados (`nombres`, `apellidos`, `telefono`). Antes de la confirmación no hay persistencia. Contrato completo en `capa-2-diccionario/forms/lead-open-whatsapp.json` (reglas 1-2).

**Coherencia estado ↔ demandas:** el CHECK `armc_leads_demandas_confirmado` exige `cardinality(demanda_ids_seleccionados) > 0` **solo** cuando `estado_actual = 'LEAD_CONFIRMADO'`. En `LEAD_ABIERTO` puede ser `NULL`.

**Nota sobre `closed_by`:** la identidad de quien cierra el handoff **no se duplica** en `armc_leads`. Vive en la fila `CLOSED` correspondiente de `armc_handoffs` (vía `user_id`) y en el `payload_opcional` del evento `HUMAN_HANDOFF_CLOSED` (`closed_by_user_id`). Convención coherente con el principio "persistencia base ligera + historial completo".

**Estabilidad histórica de `demanda_ids_seleccionados`:** los IDs conservan identidad numérica mientras no se reasignen, pero no conservan la frase ni el `area` mostradas al lead. Esos atributos se obtienen del catálogo vigente. `lineas_servicio_detectadas` queda persistida como resultado derivado en la ficha. Preservar de forma íntegra la vista histórica requerirá versionar el catálogo o guardar `catalogo_version`.

## `armc_events`

| Columna | Tipo | Nulo | Dominio / Default | Descripción |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | Identificador del evento. |
| `lead_id` | UUID | NO | FK → `armc_leads(id)` ON DELETE CASCADE | Lead al que pertenece el evento. |
| `event_type` | VARCHAR(50) | NO | enum (ver abajo) | Tipo de evento emitido. |
| `payload` | JSONB | NO | — | Payload específico del evento. |
| `created_at` | TIMESTAMPTZ | SÍ | `NOW()` | Fecha del evento. |

**Tipos válidos (alcance verificado):** `LEAD_CREATED`, `LEAD_CAPTURED`, `HUMAN_HANDOFF_REQUESTED`, `HUMAN_HANDOFF_ASSIGNED`, `HUMAN_HANDOFF_CLOSED`.

## `armc_handoffs`

Historial completo del handoff humano: una fila por cada transición (`REQUESTED`, `ASSIGNED`, `CLOSED`). Conserva trazabilidad de quién pidió, quién atendió, quién reasignó y quién cerró, sin duplicar identidad en `armc_leads`.

| Columna | Tipo | Nulo | Dominio / Default | Descripción |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | Identificador de la fila de historial. |
| `lead_id` | UUID | NO | FK → `armc_leads(id)` ON DELETE CASCADE | Lead al que pertenece la transición. |
| `event_type` | VARCHAR(30) | NO | enum `REQUESTED / ASSIGNED / CLOSED` | Tipo de transición que registra esta fila. |
| `user_id` | INTEGER | SÍ | FK → `portal_users(id)` ON DELETE SET NULL | Humano implicado (asignado en `ASSIGNED`, cerrador en `CLOSED`). |
| `trigger` | VARCHAR(30) | SÍ | enum `explicit / auto_frustration` | Trigger del `REQUESTED`: explícito por el lead o automático por señal del bot. NULL en otras transiciones. |
| `mensaje_lead` | TEXT | SÍ | — | Texto del lead que originó el `REQUESTED` (opcional). |
| `senal_origen` | TEXT | SÍ | — | Señal técnica del bot que originó el `REQUESTED` automático (opcional). |
| `reassigned_from_user_id` | INTEGER | SÍ | FK → `portal_users(id)` ON DELETE SET NULL | Humano del que se reasigna en una transición `ASSIGNED`. NULL en la primera asignación. |
| `close_reason` | VARCHAR(20) | SÍ | enum `manual / inactivity` | Motivo del cierre en la transición `CLOSED`. NULL en otras transiciones. |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | Fecha y hora de la transición. |

## Índices

| Índice | Tabla | Columna |
|---|---|---|
| `idx_armc_leads_email` | `armc_leads` | `email` |
| `idx_armc_leads_canal` | `armc_leads` | `canal_origen` |
| `idx_armc_leads_estado` | `armc_leads` | `estado_actual` |
| `idx_armc_events_lead_id` | `armc_events` | `lead_id` |
| `idx_armc_handoffs_lead` | `armc_handoffs` | `lead_id` |
| `idx_armc_handoffs_user` | `armc_handoffs` | `user_id` |
| `idx_armc_handoffs_event` | `armc_handoffs` | `event_type` |
