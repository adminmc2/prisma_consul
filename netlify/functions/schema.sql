-- APEX Submissions Table
-- Ejecutar este script en Neon SQL Editor: https://console.neon.tech

CREATE TABLE IF NOT EXISTS apex_submissions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Datos de empresa
  empresa_nombre TEXT,
  empresa_contacto TEXT,
  empresa_email TEXT NOT NULL,
  empresa_whatsapp TEXT,
  empresa_tamano TEXT,
  empresa_sector TEXT,
  empresa_tiene_campo TEXT,
  empresa_tecnologia_actual JSONB,
  empresa_motivacion TEXT,

  -- Respuestas del formulario
  respuestas_fase1 JSONB,
  respuestas_fase2 JSONB,

  -- Pains
  pains_detectados_inicial JSONB,
  confirmacion_pains TEXT,
  pains_finales JSONB,

  -- Audio
  audio_transcripcion TEXT,
  audio_duracion_segundos INTEGER,

  -- Recomendaciones
  experiencias_sugeridas JSONB,
  plan_recomendado TEXT,

  -- Metadata
  raw_data JSONB
);

-- Índices para búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_apex_submissions_email ON apex_submissions(empresa_email);
CREATE INDEX IF NOT EXISTS idx_apex_submissions_created_at ON apex_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_apex_submissions_sector ON apex_submissions(empresa_sector);
