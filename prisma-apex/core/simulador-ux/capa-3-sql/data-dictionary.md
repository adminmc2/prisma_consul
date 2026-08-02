# Diccionario de datos — Capa 3

Referencia humana de cada columna del esquema SQL. Complemento del DDL en `schema.sql`.

Alcance verificado: tablas necesarias para la captura del lead (acción de entrada hasta los formularios web y WhatsApp) y el **handoff humano** modelado como patrón transversal (`requested → active → closed`). Se ampliará a medida que se verifiquen nuevas piezas del flujo.

## `armc_subjects`

Identidad canónica, vital e inmutable del subject dentro del dominio ARMC. Entidad deliberadamente ligera: no acumula datos comerciales, clínicos, conversacionales ni atributos propios de episodio. Su responsabilidad es mantener la identidad estable del subject a lo largo de todos sus procesos.

| Columna | Tipo | Nulo | Dominio / Default | Descripción |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | Identidad canónica y vital del subject. Referenciada por `armc_leads.subject_id` (S1) y, en S2, por `armc_events.subject_id` y `armc_handoffs.subject_id`. |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | Instante de creación del subject en el sistema. |
| `updated_at` | TIMESTAMPTZ | NO | `NOW()` | Instante de la última modificación de la entidad de identidad. No refleja actividad de episodios ni de identifiers. |

**Relación con `armc_leads`:** un subject puede tener múltiples episodios de lead a lo largo del tiempo (`Subject 1:N Lead`). Una fila de `armc_leads` es un episodio de captación, no la identidad vital.

**Nota sobre borrado:** la FK `armc_leads.subject_id → armc_subjects.id` no usa `ON DELETE CASCADE`. La eliminación de un subject referenciado queda impedida por defecto de PostgreSQL (`NO ACTION`). ARCO futuro se resolverá por pseudonimización o tratamiento reglado, no por borrado en cascada de historial.

## `armc_subject_identifiers`

Identifiers (teléfono / email) asociados al subject. Un subject puede tener múltiples identifiers activos e histórico de identifiers revocados.

| Columna | Tipo | Nulo | Dominio / Default | Descripción |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | PK del identifier. |
| `subject_id` | UUID | NO | FK → `armc_subjects(id)` | Subject al que pertenece este identifier. Sin CASCADE. |
| `identifier_type` | VARCHAR(30) | NO | enum `PHONE / EMAIL` | Tipo de identifier. |
| `raw_value` | TEXT | NO | — | Representación original recibida o confirmada por el subject. **No debe sustituirse por `normalized_value` al presentar el dato al usuario.** |
| `normalized_value` | TEXT | NO | — | Representación normalizada usada para lookup y matching. Puede ser igual o distinta de `raw_value`. Nunca se exige que sean distintas. |
| `verified_at` | TIMESTAMPTZ | SÍ | — | Instante en que el identifier fue verificado (por ejemplo, confirmación explícita del subject). NULL si no verificado. |
| `valid_from` | TIMESTAMPTZ | NO | `NOW()` | Inicio de vigencia del identifier. |
| `valid_to` | TIMESTAMPTZ | SÍ | — | Fin de vigencia. NULL indica identifier activo. |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | Instante de registro de la fila. |

**Constraint de vigencia:** `armc_subject_identifiers_validity_check` exige `valid_to IS NULL OR valid_to > valid_from`.

**Índice global de lookup** (deliberadamente no único): `idx_armc_subject_identifiers_lookup ON (identifier_type, normalized_value) WHERE valid_to IS NULL`. Permite candidatos múltiples: un teléfono compartido en familia o un número reciclado puede producir varios candidatos legítimos.

**Índice único activo por subject:** `uq_armc_subject_identifiers_active ON (subject_id, identifier_type, normalized_value) WHERE valid_to IS NULL`. Impide que un mismo subject tenga dos veces el mismo identifier activo simultáneamente; permite histórico de revocados.

**Normalización contractual:**
- **Teléfono:** representación canónica E.164 (`+52...`). Formato nacional admisible solo si el país es inequívoco (default MX en este alcance). Backend futuro usará `libphonenumber-js` o equivalente probado. Usar parser, no sustituciones manuales. Números imposibles o ambiguos se rechazan. El teléfono nunca actúa como FK ni constituye prueba absoluta de identidad.
- **Email:** `trim` obligatorio. Dominio normalizado a minúsculas. Comparación case-insensitive del valor completo, conservando el original en `raw_value`. **No** eliminar `+tag`. **No** normalizar puntos de Gmail. **No** introducir reglas específicas de proveedores.

**Semántica de coincidencia:** un match exacto sobre `(identifier_type, normalized_value)` produce un **candidato de reconocimiento**, no fusión automática. La política operativa completa se define a continuación (S4).

**Política operativa de reconocimiento del subject (desde S4):**

Al recibir un contacto entrante:

1. Validar y normalizar todos los identifiers (`PHONE` a E.164; `EMAIL` a `trim` + dominio en minúsculas, sin stripping de `+tag` ni dot-normalization de Gmail).
2. Rechazar identifiers imposibles o ambiguos; no persistir.
3. Buscar candidatos en `armc_subject_identifiers WHERE valid_to IS NULL` por cada identifier normalizado. **PHONE y EMAIL de igual peso para detectar candidatos y conflictos; sin prioridad de canal.**
4. **Cero candidatos** → crear nuevo `subject_id` + registrar identifiers (`raw_value` + `normalized_value`; `verified_at` solo si existe verificación real).
5. **Un candidato limpio** (los identifiers del contacto apuntan al mismo subject, sin conflicto) → comparar nombres declarados contra el episodio de lead más reciente del subject: `SELECT nombres, apellidos FROM armc_leads WHERE subject_id = <candidate> ORDER BY fecha_primer_contacto DESC, id DESC LIMIT 1`.
   - **Cero filas devueltas** (candidato sin ningún episodio previo comparable): **incidencia**. Caso residual atribuible a integridad de datos, migración o subject huérfano. No se reutiliza automáticamente ni se crea otro subject silenciosamente.
   - **Una fila devuelta**, normalización nominal permitida: `trim`, espacios consecutivos reducidos a uno, comparación case-insensitive, accent-insensitive, normalización Unicode estándar. **Sin fuzzy matching. Sin alias informales**. Coincidencia tras normalización → reutilizar `subject_id` y asociar identifiers nuevos. Divergencia → **incidencia**.
6. **Múltiples candidatos** (mismo identifier apunta a varios subjects, o identifiers del contacto apuntan a subjects distintos) → **incidencia**.

**Distinción de estados del identifier:**
- **Normalizado**: forma canónica usada para lookup (`normalized_value`).
- **Declarado o confirmado**: recibido y aceptado por el sistema (`raw_value` presente, `verified_at IS NULL`). El mero envío de un formulario o la confirmación declarativa no equivale a verificación.
- **Verificado**: comprobado mediante mecanismo real (OTP, enlace de confirmación, o equivalente). Se persiste `verified_at`. **En el alcance actual del simulador no existe mecanismo de verificación implementado; `verified_at` queda mayoritariamente NULL**.

**Incidencia**: resultado terminal contractual de la resolución de identidad. **No crea subject, no crea lead, no asocia identifiers, no emite eventos S3, no inicia el Flow asociado a un episodio**. Deriva a resolución humana futura (capacidad no implementada en S4).

**Recurrencia y episodios**: cada nueva captación confirmada crea un nuevo `lead_id` (según reglas 5 y 6). No se reabren episodios previos. Puede coexistir con otros episodios del mismo subject. Dentro del mismo Flow ya establecido, el contexto conservado (`subject_id + lead_id`) evita crear otro episodio por continuidad interna del Flow.

## `armc_leads`

| Columna | Tipo | Nulo | Dominio / Default | Descripción |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | Identificador único del lead (episodio de captación). Distinto de `subject_id`: `id` identifica esta fila; `subject_id` identifica al subject vital al que pertenece este episodio. |
| `subject_id` | UUID | NO | FK → `armc_subjects(id)` | Identidad canónica del subject al que pertenece este episodio de lead. Sin CASCADE. Un subject puede tener múltiples episodios (`Subject 1:N Lead`). |
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

**Cardinalidad Subject ↔ Lead:** `Subject 1:N Lead`. Una fila de `armc_leads` representa un episodio de captación, no la identidad vital. Un mismo subject puede tener varios episodios en el tiempo. S1 declara la cardinalidad pero no define las reglas operativas de cuándo termina, reabre o coexiste un episodio — esa política queda pendiente de verificación de negocio y de S4.

**Clave candidata compuesta:** `armc_leads_subject_id_id_key` declara `UNIQUE (subject_id, id)`. Aunque `id` ya es único global, la UNIQUE compuesta es necesaria técnicamente para que S2 pueda declarar `FOREIGN KEY (subject_id, lead_id) REFERENCES armc_leads(subject_id, id)` desde `armc_events` y `armc_handoffs`, y así garantizar la invariante "el `lead_id` referenciado pertenece efectivamente al `subject_id` declarado".

**FK compuesta desde procesos:** `armc_events` y `armc_handoffs` declaran FK compuesta `FOREIGN KEY (subject_id, lead_id) REFERENCES armc_leads(subject_id, id)`. Cualquier intento de insertar en esas tablas un par `(subject_id, lead_id)` donde el `lead_id` no pertenezca al `subject_id` declarado es rechazado por integridad referencial. Las FKs (directa `subject_id → armc_subjects(id)` y compuesta `(subject_id, lead_id) → armc_leads(subject_id, id)`) no llevan `ON DELETE CASCADE`: impiden eliminar físicamente un subject o un episodio mientras existan eventos o handoffs referenciándolo. La futura política de tratamiento, archivo o pseudonimización se resolverá de forma explícita.

**Base determinista de comparación nominal (desde S4):** cuando la política operativa de reconocimiento (S4) necesita comparar nombres declarados por un contacto entrante contra un subject candidato, la referencia canónica es el **episodio de lead más reciente** del subject: `SELECT nombres, apellidos FROM armc_leads WHERE subject_id = <candidate> ORDER BY fecha_primer_contacto DESC, id DESC LIMIT 1`. `armc_subjects` es entidad ligera que no almacena nombres; la fuente autoritativa para comparación nominal vive en `armc_leads`. **Si la consulta devuelve cero filas** (candidato sin ningún episodio previo comparable), la política resuelve como incidencia: caso residual atribuible a integridad de datos, migración o subject huérfano, no se reutiliza el subject automáticamente.

## `armc_events`

| Columna | Tipo | Nulo | Dominio / Default | Descripción |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | Identificador del evento. |
| `subject_id` | UUID | NO | FK → `armc_subjects(id)` (sin CASCADE) | Identidad canónica del subject al que pertenece el evento. Propaga la identidad vital para permitir lookups directos por subject sin joins a través de `armc_leads`. |
| `lead_id` | UUID | NO | FK compuesta con `subject_id` → `armc_leads(subject_id, id)` (sin CASCADE) | Episodio de lead al que pertenece el evento. La FK compuesta con `subject_id` garantiza que el `lead_id` referenciado pertenece efectivamente al `subject_id` declarado. |
| `event_type` | VARCHAR(50) | NO | enum (ver abajo) | Tipo de evento emitido. |
| `payload` | JSONB | NO | — | Payload específico del evento. |
| `occurred_at` | TIMESTAMPTZ | SÍ | `NOW()` | Instante en que ocurrió el evento. En el alcance actual coincide con el momento del INSERT; la distinción entre "cuándo ocurrió" y "cuándo se insertó" se materializará cuando aparezca backfill o event replay futuros. |

**Tipos válidos (alcance verificado):** `LEAD_CREATED`, `LEAD_CAPTURED`, `HUMAN_HANDOFF_REQUESTED`, `HUMAN_HANDOFF_ASSIGNED`, `HUMAN_HANDOFF_CLOSED`.

**Envelope uniforme de eventos (desde S3):** las instancias emitidas de todo evento del dominio ARMC llevan un envelope común con cinco campos raíz: `event_id`, `event_type`, `subject_id`, `lead_id`, `occurred_at`. El mapeo al esquema físico es directo: `envelope.event_id ← armc_events.id`, `envelope.event_type ← armc_events.event_type`, `envelope.subject_id ← armc_events.subject_id`, `envelope.lead_id ← armc_events.lead_id`, `envelope.occurred_at ← armc_events.occurred_at`, `envelope.payload ← armc_events.payload`. **La PK física no se renombra**: `armc_events.id` sigue siendo la columna; su representación en el envelope se llama `event_id` para separarla visualmente de la PK del subject o del episodio. Ningún campo del envelope se repite en el payload de negocio anidado.

## `armc_handoffs`

Historial completo del handoff humano: una fila por cada transición (`REQUESTED`, `ASSIGNED`, `CLOSED`). Conserva trazabilidad de quién pidió, quién atendió, quién reasignó y quién cerró, sin duplicar identidad en `armc_leads`.

| Columna | Tipo | Nulo | Dominio / Default | Descripción |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | Identificador de la fila de historial. |
| `subject_id` | UUID | NO | FK → `armc_subjects(id)` (sin CASCADE) | Identidad canónica del subject al que pertenece la transición de handoff. Mismo criterio que `armc_events.subject_id`. |
| `lead_id` | UUID | NO | FK compuesta con `subject_id` → `armc_leads(subject_id, id)` (sin CASCADE) | Episodio de lead al que pertenece la transición. La FK compuesta con `subject_id` garantiza coherencia con el subject declarado. |
| `event_type` | VARCHAR(30) | NO | enum `REQUESTED / ASSIGNED / CLOSED` | Tipo de transición que registra esta fila. |
| `user_id` | INTEGER | SÍ | FK → `portal_users(id)` ON DELETE SET NULL | Humano implicado (asignado en `ASSIGNED`, cerrador en `CLOSED`). |
| `trigger` | VARCHAR(30) | SÍ | enum `explicit / auto_frustration` | Trigger del `REQUESTED`: explícito por el lead o automático por señal del bot. NULL en otras transiciones. |
| `mensaje_lead` | TEXT | SÍ | — | Texto del lead que originó el `REQUESTED` (opcional). |
| `senal_origen` | TEXT | SÍ | — | Señal técnica del bot que originó el `REQUESTED` automático (opcional). |
| `reassigned_from_user_id` | INTEGER | SÍ | FK → `portal_users(id)` ON DELETE SET NULL | Humano del que se reasigna en una transición `ASSIGNED`. NULL en la primera asignación. |
| `close_reason` | VARCHAR(20) | SÍ | enum `manual / inactivity` | Motivo del cierre en la transición `CLOSED`. NULL en otras transiciones. |
| `occurred_at` | TIMESTAMPTZ | NO | `NOW()` | Instante en que ocurrió la transición de handoff. En el alcance actual coincide con el momento del INSERT; la distinción se materializará con futuros backfills o replay. |

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
| `idx_armc_events_subject` | `armc_events` | `subject_id` |
| `idx_armc_handoffs_subject` | `armc_handoffs` | `subject_id` |
