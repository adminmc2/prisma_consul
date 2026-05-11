-- Capa 3: Modelo de Datos SQL — ARMC
-- Status: DRAFT por Executor 3
-- Descripción: Tablas, índices, relaciones y constraints para el flujo operativo ARMC

-- Tabla principal: armc_leads
CREATE TABLE IF NOT EXISTS armc_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canal_origen VARCHAR(50) NOT NULL, -- 'WHATSAPP', 'FORM', etc.
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  interes_principal VARCHAR(100), -- 'PRECIO', 'PROCEDIMIENTO', etc.
  comentario_inicial TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: armc_events (para auditoría del flujo)
CREATE TABLE IF NOT EXISTS armc_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES armc_leads(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_lead_events (lead_id)
);

-- Tabla: armc_conversations (historial de interacciones)
CREATE TABLE IF NOT EXISTS armc_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES armc_leads(id) ON DELETE CASCADE,
  agent_id UUID, -- NULL si es automático
  decision_bucket VARCHAR(100),
  satisfaccion VARCHAR(50), -- 'PENDING', 'SATISFIED', 'ESCALATED'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_lead_conversations (lead_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON armc_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON armc_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_satisfaccion ON armc_conversations(satisfaccion);

-- Placeholder para más tablas y schemas
-- TODO: Agregar tablas de agentes, plantillas, y reportes
