# Diccionario de datos — Capa 3

Referencia humana de cada columna del esquema SQL. Complemento del DDL en `schema.sql`.

Alcance verificado: solo las tablas necesarias para la captura del lead (acción de entrada hasta los formularios web y WhatsApp). Se ampliará a medida que se verifiquen nuevas piezas del flujo.

## `armc_leads`

| Columna | Tipo | Nulo | Dominio / Default | Descripción |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | Identificador único del lead. |
| `nombre` | VARCHAR(120) | NO | — | Nombre del lead. |
| `apellido_paterno` | VARCHAR(120) | NO | — | Apellido paterno. |
| `apellido_materno` | VARCHAR(120) | NO | — | Apellido materno. |
| `email` | VARCHAR(255) | SÍ | — | Correo del lead. Opcional para canal WhatsApp. |
| `telefono` | VARCHAR(20) | NO | — | Teléfono de contacto. |
| `canal_origen` | VARCHAR(50) | NO | enum | `WEB_FORM`, `WHATSAPP`. |
| `opciones_seleccionadas` | INT[] | NO | cardinality ≥ 1 | IDs del catálogo de 25 demandas. |
| `lineas_servicio_detectadas` | VARCHAR(100)[] | NO | `ARRAY[]` | Derivado de `opciones_seleccionadas`. |
| `nota` | TEXT | SÍ | — | Observaciones libres del lead. |
| `estado_actual` | VARCHAR(50) | NO | `LEAD_CAPTURED` | Estado actual del lead en el flujo. |
| `fecha_primer_contacto` | TIMESTAMPTZ | NO | `NOW()` | Fecha y hora del primer contacto del lead con ARMC. Se asigna automáticamente al crear la fila. |
| `created_at` | TIMESTAMPTZ | SÍ | `NOW()` | Fecha de creación. |
| `updated_at` | TIMESTAMPTZ | SÍ | `NOW()` | Fecha de última modificación. |

**Estados válidos (alcance verificado):** `LEAD_CAPTURED`.

## `armc_events`

| Columna | Tipo | Nulo | Dominio / Default | Descripción |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | Identificador del evento. |
| `lead_id` | UUID | NO | FK → `armc_leads(id)` ON DELETE CASCADE | Lead al que pertenece el evento. |
| `event_type` | VARCHAR(50) | NO | enum (ver abajo) | Tipo de evento emitido. |
| `payload` | JSONB | NO | — | Payload específico del evento. |
| `created_at` | TIMESTAMPTZ | SÍ | `NOW()` | Fecha del evento. |

**Tipos válidos (alcance verificado):** `LEAD_CAPTURED`.

## Índices

| Índice | Tabla | Columna |
|---|---|---|
| `idx_armc_leads_email` | `armc_leads` | `email` |
| `idx_armc_leads_canal` | `armc_leads` | `canal_origen` |
| `idx_armc_leads_estado` | `armc_leads` | `estado_actual` |
| `idx_armc_events_lead_id` | `armc_events` | `lead_id` |
