-- PRISMA Hub - Schema PostgreSQL (Neon)
-- Ejecutar en Neon SQL Editor: https://console.neon.tech

-- ── Portal Users ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS portal_users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre TEXT,
  empresa TEXT,
  rfc TEXT,
  direccion TEXT,
  ciudad TEXT,
  cp TEXT,
  telefono TEXT,
  contacto_principal TEXT,
  cargo TEXT,
  sector TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  current_phase INTEGER NOT NULL DEFAULT 1,
  profile_type TEXT NOT NULL DEFAULT 'clinica',
  drive_folder_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- ── Portal Files (rastreo de propiedad) ──────────────────

CREATE TABLE IF NOT EXISTS portal_files (
  id SERIAL PRIMARY KEY,
  drive_file_id TEXT UNIQUE NOT NULL,
  user_id INTEGER REFERENCES portal_users(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  mime_type TEXT,
  doc_type TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portal_files_user ON portal_files(user_id);
CREATE INDEX IF NOT EXISTS idx_portal_files_drive ON portal_files(drive_file_id);

-- ── Portal Activity Log ──────────────────────────────────

CREATE TABLE IF NOT EXISTS portal_activity_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES portal_users(id),
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_user ON portal_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON portal_activity_log(created_at DESC);

-- ── APEX Submissions ─────────────────────────────────────

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
  empresa_motivacion JSONB,
  empresa_calidad_datos TEXT,
  empresa_pipeline_ventas JSONB,
  empresa_vende_credito TEXT,
  empresa_tiempo_reportes TEXT,

  -- Investigación de empresa (Tavily + Groq)
  investigacion_empresa JSONB,

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

CREATE INDEX IF NOT EXISTS idx_apex_submissions_email ON apex_submissions(empresa_email);
CREATE INDEX IF NOT EXISTS idx_apex_submissions_created_at ON apex_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_apex_submissions_sector ON apex_submissions(empresa_sector);
