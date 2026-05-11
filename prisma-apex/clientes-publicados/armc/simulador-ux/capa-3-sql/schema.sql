-- PostgreSQL Schema: ARMC Lead Capture + Filtro Previo
-- PRISMA Consulting — Capa 3

CREATE TABLE armc_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255),
    email VARCHAR(255),
    telefono VARCHAR(20),
    canal_origen VARCHAR(50) NOT NULL CHECK (
        canal_origen IN ('WEB_FORM', 'WHATSAPP', 'INSTAGRAM', 'TELEFONO', 'EMAIL')
    ),
    opciones_seleccionadas INT[] NOT NULL CHECK (cardinality(opciones_seleccionadas) > 0),
    lineas_servicio_detectadas VARCHAR(100)[] NOT NULL DEFAULT ARRAY[]::VARCHAR(100)[],
    nota TEXT,
    estado_actual VARCHAR(50) NOT NULL DEFAULT 'LEAD_CAPTURED' CHECK (
        estado_actual IN (
            'LEAD_CAPTURED',
            'AUTO_RESPONSE_SENT',
            'HUMAN_SUPPORT_REQUESTED',
            'LEAD_FOLLOWUP_PENDING',
            'SUPER_FORM_COMPLETED',
            'USUARIO_CREADO'
        )
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultima_interaccion TIMESTAMP WITH TIME ZONE
);

CREATE TABLE armc_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES armc_leads(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (
        event_type IN (
            'LEAD_CAPTURED',
            'AUTO_RESPONSE_SENT',
            'HUMAN_SUPPORT_REQUESTED',
            'LEAD_FOLLOWUP_PENDING',
            'SUPER_FORM_COMPLETED',
            'USUARIO_CREADO'
        )
    ),
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE armc_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES armc_leads(id) ON DELETE CASCADE,
    agente_id VARCHAR(100),
    tipo_interaccion VARCHAR(50),
    contenido TEXT,
    satisfaccion VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_armc_leads_email ON armc_leads(email);
CREATE INDEX idx_armc_leads_canal ON armc_leads(canal_origen);
CREATE INDEX idx_armc_leads_estado ON armc_leads(estado_actual);
CREATE INDEX idx_armc_events_lead_id ON armc_events(lead_id);
CREATE INDEX idx_armc_conversations_lead_id ON armc_conversations(lead_id);