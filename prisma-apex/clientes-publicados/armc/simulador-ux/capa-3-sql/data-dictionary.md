# Diccionario de datos — Capa 3

Referencia humana de cada columna del esquema SQL. Complemento del DDL en `schema.sql`.

## `armc_leads`

| Columna | Tipo | Nulo | Dominio / Default | Descripción |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | Identificador único del lead. |
| `nombre` | VARCHAR(120) | NO | — | Nombre del lead. |
| `apellido_paterno` | VARCHAR(120) | NO | — | Apellido paterno. |
| `apellido_materno` | VARCHAR(120) | NO | — | Apellido materno. |
| `email` | VARCHAR(255) | SÍ | — | Correo del lead. Opcional para canal WhatsApp. |
| `telefono` | VARCHAR(20) | NO | — | Teléfono de contacto. |
| `canal_origen` | VARCHAR(50) | NO | enum | `WEB_FORM`, `WHATSAPP`, `INSTAGRAM`, `TELEFONO`, `EMAIL`. |
| `opciones_seleccionadas` | INT[] | NO | cardinality ≥ 1 | IDs del catálogo de 25 demandas. |
| `lineas_servicio_detectadas` | VARCHAR(100)[] | NO | `ARRAY[]` | Derivado de `opciones_seleccionadas`. |
| `nota` | TEXT | SÍ | — | Observaciones libres del lead. |
| `estado_actual` | VARCHAR(50) | NO | `LEAD_CAPTURED` | Estado actual del lead en el flujo. |
| `created_at` | TIMESTAMPTZ | SÍ | `NOW()` | Fecha de creación. |
| `updated_at` | TIMESTAMPTZ | SÍ | `NOW()` | Fecha de última modificación. |
| `ultima_interaccion` | TIMESTAMPTZ | SÍ | — | Marca de la última interacción operativa. |

**Estados válidos:** `LEAD_CAPTURED`, `AUTO_RESPONSE_SENT`, `HUMAN_SUPPORT_REQUESTED`, `LEAD_FOLLOWUP_PENDING`, `SUPER_FORM_COMPLETED`, `USUARIO_CREADO`.

## `armc_events`

| Columna | Tipo | Nulo | Dominio / Default | Descripción |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | Identificador del evento. |
| `lead_id` | UUID | NO | FK → `armc_leads(id)` ON DELETE CASCADE | Lead al que pertenece el evento. |
| `event_type` | VARCHAR(50) | NO | enum (ver abajo) | Tipo de evento emitido. |
| `payload` | JSONB | NO | — | Payload específico del evento. |
| `created_at` | TIMESTAMPTZ | SÍ | `NOW()` | Fecha del evento. |

**Tipos válidos:** `LEAD_CAPTURED`, `AUTO_RESPONSE_SENT`, `HUMAN_SUPPORT_REQUESTED`, `LEAD_FOLLOWUP_PENDING`, `SUPER_FORM_COMPLETED`, `USUARIO_CREADO`.

## `armc_conversations`

| Columna | Tipo | Nulo | Dominio / Default | Descripción |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | Identificador de la conversación. |
| `lead_id` | UUID | NO | FK → `armc_leads(id)` ON DELETE CASCADE | Lead al que pertenece. |
| `agente_id` | VARCHAR(100) | SÍ | — | Identificador del agente humano. |
| `tipo_interaccion` | VARCHAR(50) | SÍ | — | Categoría de la interacción. |
| `contenido` | TEXT | SÍ | — | Texto o resumen de la interacción. |
| `satisfaccion` | VARCHAR(20) | SÍ | `PENDING` | Resultado: `PENDING`, `SATISFIED`, `ESCALATED`. |
| `created_at` | TIMESTAMPTZ | SÍ | `NOW()` | Fecha de creación. |
| `updated_at` | TIMESTAMPTZ | SÍ | `NOW()` | Fecha de última modificación. |

## Índices

| Índice | Tabla | Columna |
|---|---|---|
| `idx_armc_leads_email` | `armc_leads` | `email` |
| `idx_armc_leads_canal` | `armc_leads` | `canal_origen` |
| `idx_armc_leads_estado` | `armc_leads` | `estado_actual` |
| `idx_armc_events_lead_id` | `armc_events` | `lead_id` |
| `idx_armc_conversations_lead_id` | `armc_conversations` | `lead_id` |
