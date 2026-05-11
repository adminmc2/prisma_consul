-- PostgreSQL Schema: ARMC Lead Capture
-- PRISMA Consulting — Capa 3
-- Alcance verificado: hasta la acción de captura del lead (formularios de contacto web y WhatsApp).
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE armc_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES armc_leads(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (
        event_type IN ('LEAD_CAPTURED')
    ),
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_armc_leads_email ON armc_leads(email);
CREATE INDEX idx_armc_leads_canal ON armc_leads(canal_origen);
CREATE INDEX idx_armc_leads_estado ON armc_leads(estado_actual);
CREATE INDEX idx_armc_events_lead_id ON armc_events(lead_id);
