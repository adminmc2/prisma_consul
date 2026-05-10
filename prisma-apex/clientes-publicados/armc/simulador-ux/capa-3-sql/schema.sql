-- Capa 3: Modelo de Datos SQL — ARMC
-- Status: DRAFT por Executor 3
-- Descripción: Tablas, índices, relaciones y constraints para el flujo operativo ARMC

-- Tabla principal: armc_leads
-- Registro de cada lead ingresado al sistema, independientemente de canal
CREATE TABLE IF NOT EXISTS armc_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canal_origen VARCHAR(50) NOT NULL CHECK (canal_origen IN ('WHATSAPP', 'WEB_FORM', 'INSTAGRAM', 'TELEFONO')),
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  interes_principal VARCHAR(100), -- 'PRECIO', 'PROCEDIMIENTO', 'TIEMPO_RECUPERACION'
  comentario_inicial TEXT,
  estado_actual VARCHAR(50) NOT NULL DEFAULT 'NUEVO',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla: armc_events
-- Auditoría de eventos del flujo: captura, respuestas automáticas, escalados
CREATE TABLE IF NOT EXISTS armc_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES armc_leads(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL CHECK (event_type IN ('LEAD_CAPTURED', 'AUTO_RESPONSE_SENT', 'HUMAN_SUPPORT_REQUESTED', 'SUPER_FORM_COMPLETED')),
  payload JSONB NOT NULL,
  support_mode VARCHAR(30) CHECK (support_mode IN ('AUTOMATIC_ONLY', 'HUMAN_ESCALATED', 'GABIO_ROADMAP')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla: armc_conversations
-- Historial de interacciones por lead (automáticas y humanas)
CREATE TABLE IF NOT EXISTS armc_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES armc_leads(id) ON DELETE CASCADE,
  agent_id UUID, -- NULL si es respuesta automática
  decision_bucket VARCHAR(100),
  template_used VARCHAR(100),
  satisfaccion VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para optimización de queries
CREATE INDEX IF NOT EXISTS idx_leads_canal ON armc_leads(canal_origen);
CREATE INDEX IF NOT EXISTS idx_leads_estado ON armc_leads(estado_actual);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON armc_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_lead_id ON armc_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON armc_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON armc_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON armc_conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversations_satisfaccion ON armc_conversations(satisfaccion);
