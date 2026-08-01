-- PostgreSQL Schema: ARMC Lead Capture + Handoff
-- PRISMA Consulting — Capa 3
-- Alcance verificado: captura del lead (formularios web y WhatsApp) + handoff humano
-- (patrón transversal: requested → active → closed) modelado en este paquete.
-- Tablas, columnas y enums fuera de ese alcance se añadirán a medida que se verifiquen.

-- Identidad canónica del subject (S1). Entidad deliberadamente ligera:
-- no acumula atributos comerciales, clínicos ni conversacionales.
CREATE TABLE armc_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Identifiers (teléfono / email) asociados al subject, con vigencia y
-- verificación. raw_value conserva la representación recibida o confirmada;
-- normalized_value se usa para lookup. Nunca actúan como FK ni prueba absoluta
-- de identidad. Un match exacto produce candidato de reconocimiento, no fusión.
CREATE TABLE armc_subject_identifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES armc_subjects(id),
    identifier_type VARCHAR(30) NOT NULL CHECK (
        identifier_type IN ('PHONE', 'EMAIL')
    ),
    raw_value TEXT NOT NULL,
    normalized_value TEXT NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    valid_to TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT armc_subject_identifiers_validity_check CHECK (
        valid_to IS NULL OR valid_to > valid_from
    )
);

CREATE TABLE armc_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES armc_subjects(id),
    nombres VARCHAR(120) NOT NULL,
    apellidos VARCHAR(240) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20) NOT NULL,
    canal_origen VARCHAR(50) NOT NULL CHECK (
        canal_origen IN ('WEB_FORM', 'WHATSAPP')
    ),
    demanda_ids_seleccionados INT[],
    lineas_servicio_detectadas VARCHAR(100)[] NOT NULL DEFAULT ARRAY[]::VARCHAR(100)[],
    comentario_libre_lead TEXT,
    estado_actual VARCHAR(50) NOT NULL DEFAULT 'LEAD_ABIERTO' CHECK (
        estado_actual IN ('LEAD_ABIERTO', 'LEAD_CONFIRMADO')
    ),
    fecha_primer_contacto TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    -- Handoff humano (patrón transversal, aditivo sobre la captura del lead).
    handoff_state VARCHAR(20) NOT NULL DEFAULT 'none' CHECK (
        handoff_state IN ('none', 'requested', 'active', 'closed')
    ),
    handoff_assigned_to INTEGER REFERENCES portal_users(id) ON DELETE SET NULL,
    handoff_close_reason VARCHAR(20) CHECK (
        handoff_close_reason IS NULL OR handoff_close_reason IN ('manual', 'inactivity')
    ),
    handoff_requested_at TIMESTAMP WITH TIME ZONE,
    handoff_assigned_at TIMESTAMP WITH TIME ZONE,
    handoff_closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Coherencia estado ↔ demandas: en LEAD_CONFIRMADO se exige al menos una demanda seleccionada.
    CONSTRAINT armc_leads_demandas_confirmado CHECK (
        estado_actual != 'LEAD_CONFIRMADO' OR
        (demanda_ids_seleccionados IS NOT NULL AND cardinality(demanda_ids_seleccionados) > 0)
    ),
    -- Clave candidata compuesta requerida por PostgreSQL para que S2 pueda
    -- declarar FK compuesta (subject_id, lead_id) desde armc_events y armc_handoffs.
    -- Aunque id ya es único global, la FK compuesta exige UNIQUE compuesta explícita.
    CONSTRAINT armc_leads_subject_id_id_key UNIQUE (subject_id, id)
);

CREATE TABLE armc_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES armc_subjects(id),
    lead_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL CHECK (
        event_type IN (
            'LEAD_CREATED',
            'LEAD_CAPTURED',
            'HUMAN_HANDOFF_REQUESTED',
            'HUMAN_HANDOFF_ASSIGNED',
            'HUMAN_HANDOFF_CLOSED'
        )
    ),
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- FK compuesta reemplaza a la FK simple lead_id → armc_leads(id).
    -- Garantiza que el lead_id referenciado pertenece efectivamente al subject_id
    -- declarado. Sin ON DELETE CASCADE: eventos son historial auditable.
    CONSTRAINT armc_events_subject_lead_fk FOREIGN KEY (subject_id, lead_id)
        REFERENCES armc_leads(subject_id, id)
);

-- Historial completo del handoff humano: una fila por transición.
CREATE TABLE armc_handoffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES armc_subjects(id),
    lead_id UUID NOT NULL,
    event_type VARCHAR(30) NOT NULL CHECK (
        event_type IN ('REQUESTED', 'ASSIGNED', 'CLOSED')
    ),
    user_id INTEGER REFERENCES portal_users(id) ON DELETE SET NULL,
    trigger VARCHAR(30) CHECK (
        trigger IS NULL OR trigger IN ('explicit', 'auto_frustration')
    ),
    mensaje_lead TEXT,
    senal_origen TEXT,
    reassigned_from_user_id INTEGER REFERENCES portal_users(id) ON DELETE SET NULL,
    close_reason VARCHAR(20) CHECK (
        close_reason IS NULL OR close_reason IN ('manual', 'inactivity')
    ),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    -- FK compuesta reemplaza a la FK simple lead_id → armc_leads(id).
    -- Mismo criterio que armc_events: sin CASCADE, historial auditable.
    CONSTRAINT armc_handoffs_subject_lead_fk FOREIGN KEY (subject_id, lead_id)
        REFERENCES armc_leads(subject_id, id)
);

CREATE INDEX idx_armc_leads_email ON armc_leads(email);
CREATE INDEX idx_armc_leads_canal ON armc_leads(canal_origen);
CREATE INDEX idx_armc_leads_estado ON armc_leads(estado_actual);
CREATE INDEX idx_armc_events_lead_id ON armc_events(lead_id);
CREATE INDEX idx_armc_handoffs_lead ON armc_handoffs(lead_id);
CREATE INDEX idx_armc_handoffs_user ON armc_handoffs(user_id);
CREATE INDEX idx_armc_handoffs_event ON armc_handoffs(event_type);

-- Índices S2: propagación de subject_id.
CREATE INDEX idx_armc_events_subject ON armc_events(subject_id);
CREATE INDEX idx_armc_handoffs_subject ON armc_handoffs(subject_id);

-- Índices de identidad canónica (S1)
CREATE INDEX idx_armc_subject_identifiers_lookup
    ON armc_subject_identifiers(identifier_type, normalized_value)
    WHERE valid_to IS NULL;

CREATE UNIQUE INDEX uq_armc_subject_identifiers_active
    ON armc_subject_identifiers(subject_id, identifier_type, normalized_value)
    WHERE valid_to IS NULL;

CREATE INDEX idx_armc_leads_subject ON armc_leads(subject_id);
