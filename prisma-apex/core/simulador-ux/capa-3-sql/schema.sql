-- PostgreSQL Schema: ARMC Lead Capture + Handoff
-- PRISMA Consulting — Capa 3
-- Alcance verificado: captura del lead (formularios web y WhatsApp) + handoff humano
-- (patrón transversal: requested → active → closed) modelado en este paquete.
-- Tablas, columnas y enums fuera de ese alcance se añadirán a medida que se verifiquen.

CREATE TABLE armc_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(120) NOT NULL,
    apellido_paterno VARCHAR(120) NOT NULL,
    apellido_materno VARCHAR(120) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20) NOT NULL,
    canal_origen VARCHAR(50) NOT NULL CHECK (
        canal_origen IN ('WEB_FORM', 'WHATSAPP')
    ),
    opciones_seleccionadas INT[] NOT NULL CHECK (cardinality(opciones_seleccionadas) > 0),
    lineas_servicio_detectadas VARCHAR(100)[] NOT NULL DEFAULT ARRAY[]::VARCHAR(100)[],
    nota TEXT,
    estado_actual VARCHAR(50) NOT NULL DEFAULT 'LEAD_CAPTURED' CHECK (
        estado_actual IN ('LEAD_CAPTURED')
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE armc_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES armc_leads(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (
        event_type IN (
            'LEAD_CAPTURED',
            'HUMAN_HANDOFF_REQUESTED',
            'HUMAN_HANDOFF_ASSIGNED',
            'HUMAN_HANDOFF_CLOSED'
        )
    ),
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Historial completo del handoff humano: una fila por transición.
CREATE TABLE armc_handoffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES armc_leads(id) ON DELETE CASCADE,
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
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_armc_leads_email ON armc_leads(email);
CREATE INDEX idx_armc_leads_canal ON armc_leads(canal_origen);
CREATE INDEX idx_armc_leads_estado ON armc_leads(estado_actual);
CREATE INDEX idx_armc_events_lead_id ON armc_events(lead_id);
CREATE INDEX idx_armc_handoffs_lead ON armc_handoffs(lead_id);
CREATE INDEX idx_armc_handoffs_user ON armc_handoffs(user_id);
CREATE INDEX idx_armc_handoffs_event ON armc_handoffs(event_type);
