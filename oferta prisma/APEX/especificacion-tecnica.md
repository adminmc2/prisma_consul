# APEX — Especificación Técnica

> **A**utomatización de **P**rocesos y **EX**periencias
> **A**utomation of **P**rocesses and **EX**periences
>
> CRM Farmacéutico con IA Agéntica
> Arquitectura, Stack Tecnológico y Especificaciones de Desarrollo

---

**Versión:** 2.2
**Fecha:** Febrero 2026
**Clasificación:** Documento Técnico de Implementación

---

## Índice

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Modelo de Datos](#3-modelo-de-datos)
4. [Especificación de APIs](#4-especificación-de-apis)
5. [Capa de Inteligencia Artificial](#5-capa-de-inteligencia-artificial)
6. [Motor de Compliance](#6-motor-de-compliance)
7. [Seguridad](#7-seguridad)
8. [Infraestructura y DevOps](#8-infraestructura-y-devops)
9. [Integraciones Técnicas](#9-integraciones-técnicas)
10. [Plan de Implementación](#10-plan-de-implementación)
11. [Estimaciones y Recursos](#11-estimaciones-y-recursos)

---

## 1. Stack Tecnológico

Stack diseñado para máxima productividad, escalabilidad y costo optimizado para el mercado latinoamericano.

### 1.1 Arquitectura de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│     Next.js 14+ • React • TypeScript • TailwindCSS • PWA    │
└─────────────────────────────────────────────────────────────┘
                              │
                    API REST / GraphQL
                              │
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│     Node.js • NestJS • TypeORM • Bull (colas) • Socket.io   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                         DATOS                                │
│     PostgreSQL • Redis • S3/MinIO • Elasticsearch           │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                        IA / ML                               │
│   OpenAI GPT-4 • Whisper • LangChain • Pinecone/Qdrant     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    INFRAESTRUCTURA                           │
│   Docker • Kubernetes • AWS/GCP • Vercel • GitHub Actions   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Justificación del Stack

| Tecnología | Justificación | Alternativas |
|------------|---------------|--------------|
| **Next.js 14+** | SSR, App Router, Server Actions, mejor SEO y rendimiento | Remix, SvelteKit |
| **NestJS** | Arquitectura modular, TypeScript nativo, documentación excepcional | Express, Fastify |
| **PostgreSQL** | JSONB para flexibilidad, extensiones (PostGIS), robusto y gratuito | MySQL, MongoDB |
| **Redis** | Caché, sesiones, pub/sub para tiempo real, colas con Bull | Memcached |
| **TypeORM** | TypeScript nativo, migraciones, soporte PostgreSQL completo | Prisma, Drizzle |
| **OpenAI API** | GPT-4 para texto, Whisper para voz, embeddings para búsqueda | Anthropic, Cohere |
| **Docker + K8s** | Portabilidad, escalado horizontal, despliegues sin downtime | ECS, Cloud Run |

---

## 2. Arquitectura del Sistema

Arquitectura de microservicios con API Gateway, diseñada para escalar horizontalmente y soportar WhatsApp como canal principal.

### 2.1 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENTES                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐│
│  │WhatsApp │  │ App iOS │  │ App And │  │ Web App │  │ Portal ││
│  │ (90%)   │  │  (Rep)  │  │  (Rep)  │  │ (Admin) │  │(Médico)││
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └───┬────┘│
└───────┼───────────┼───────────┼───────────┼─────────────┼──────┘
        │           └───────────┴───────────┘             │
        │                       │                         │
        ▼                       ▼                         ▼
┌───────────────┐    ┌─────────────────────────┐   ┌────────────┐
│ WhatsApp API  │    │      API GATEWAY        │   │  Portal    │
│   Webhook     │───▶│ (Auth, Rate Limit, Log) │◀──│  Médico    │
└───────────────┘    └───────────┬─────────────┘   └────────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           ▼                     ▼                     ▼
    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
    │   Core API   │     │    IA API    │     │ Integrations │
    │   (NestJS)   │     │  (FastAPI)   │     │   (NestJS)   │
    └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
           │                    │                    │
           ▼                    ▼                    ▼
    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
    │  PostgreSQL  │     │   OpenAI     │     │   WhatsApp   │
    │    Redis     │     │   Pinecone   │     │   ERP/SAT    │
    │     S3       │     │   Whisper    │     │   Calendar   │
    └──────────────┘     └──────────────┘     └──────────────┘
```

### 2.2 Servicios del Sistema

| Servicio | Responsabilidad | Tecnología |
|----------|----------------|------------|
| **api-gateway** | Autenticación, rate limiting, routing, logging | Kong / Nginx |
| **core-api** | Lógica de negocio principal, CRUD, validaciones | NestJS |
| **ia-api** | Procesamiento IA: transcripción, agentes, predicciones | FastAPI + LangChain |
| **whatsapp-api** | Gestión de conversaciones, webhooks, templates | NestJS + Meta API |
| **integrations-api** | Conexiones externas: ERP, facturación, calendario | NestJS |
| **worker-service** | Jobs en background: reportes, sincronización, notificaciones | Bull + Redis |
| **realtime-service** | WebSockets para actualizaciones en tiempo real | Socket.io |
| **agents-orchestrator** | Coordinación de los 4 agentes IA | LangChain + Custom |
| **canvas-service** | Motor del Lienzo IA: generación de componentes, proactividad | NestJS + LangChain |

### 2.3 Arquitectura del Lienzo IA

El Lienzo IA es el componente diferenciador de APEX. A diferencia de una interfaz tradicional, el Lienzo es un canvas dinámico donde la IA genera componentes visuales de forma proactiva y reactiva.

#### Diagrama del Lienzo IA

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LIENZO IA (Canvas)                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     ZONA PROACTIVA                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │  │
│  │  │ Tarjeta  │  │ Tarjeta  │  │ Alerta   │  │Sugerencia│      │  │
│  │  │ Próxima  │  │ Briefing │  │ Urgente  │  │ del Día  │      │  │
│  │  │ Visita   │  │  HCP     │  │          │  │          │      │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      ZONA REACTIVA                            │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ "¿Qué necesitas?"                                       │  │  │
│  │  │ [Campo de entrada natural / voz]                        │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │              [Componente Generado]                      │  │  │
│  │  │                                                         │  │  │
│  │  │   [📌 Fijar]   [📥 Descargar]   [✓ OK]                 │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   COMPONENTES FIJADOS                         │  │
│  │  (Escritorio personalizado del usuario)                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │  │
│  │  │ KPI Meta │  │ Gráfico  │  │ Lista    │                    │  │
│  │  │  Mes     │  │ Visitas  │  │ Pendient │                    │  │
│  │  └──────────┘  └──────────┘  └──────────┘                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

#### Componentes del Servicio Canvas

| Componente | Función | Tecnología |
|------------|---------|------------|
| **Proactivity Engine** | Genera contenido antes de que el usuario lo pida | Cron Jobs + LangChain |
| **Component Generator** | Crea componentes visuales (tablas, gráficos, tarjetas) | React + D3.js + IA |
| **Context Analyzer** | Analiza hora, ubicación, historial para personalizar | ML Pipeline |
| **Persistence Layer** | Guarda componentes fijados por usuario | PostgreSQL JSONB |
| **Token Counter** | Contabiliza consumo de IA por usuario | Redis |

#### Flujo de Proactividad

```
┌──────────────────────────────────────────────────────────────────┐
│                    FLUJO PROACTIVO (Matutino)                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  6:00 AM  Cron Job dispara "PrepareUserDay"                     │
│     │                                                            │
│     ▼                                                            │
│  Para cada usuario activo:                                       │
│     │                                                            │
│     ├── Consultar agenda del día (visitas, llamadas)            │
│     ├── Generar briefings para cada HCP a visitar               │
│     ├── Detectar alertas (metas en riesgo, vencimientos)        │
│     ├── Preparar sugerencias personalizadas                     │
│     │                                                            │
│     ▼                                                            │
│  Almacenar en cache (Redis) con TTL de 24h                      │
│     │                                                            │
│     ▼                                                            │
│  Cuando usuario abre app → Mostrar contenido pre-generado       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Tipos de Componentes Generables

| Tipo | Descripción | Persistencia | Tokens |
|------|-------------|--------------|--------|
| **Tarjeta Briefing** | Resumen de HCP antes de visita | Efímero | ~200 |
| **Tabla Dinámica** | Listado con filtros generados por IA | Fijable | ~300 |
| **Gráfico KPI** | Visualización de métrica específica | Fijable | ~250 |
| **Alerta Contextual** | Notificación con contexto y sugerencia | Efímero | ~100 |
| **Resumen de Período** | Análisis de semana/mes con insights | Descargable | ~500 |
| **Guión de Llamada** | Script sugerido para próxima interacción | Efímero | ~400 |

#### API del Canvas Service

```typescript
// Endpoints principales del Canvas Service

POST /canvas/generate
// Genera un componente bajo demanda
{
  "user_id": "uuid",
  "intent": "muéstrame las visitas de mi equipo esta semana",
  "context": { "role": "supervisor", "territory": "Norte" }
}
// Response: { component_type, data, html_preview, tokens_used }

GET /canvas/proactive/{user_id}
// Obtiene componentes proactivos pre-generados
// Response: { briefings[], alerts[], suggestions[] }

POST /canvas/pin
// Fija un componente en el escritorio del usuario
{
  "user_id": "uuid",
  "component_id": "uuid",
  "position": { "x": 0, "y": 1 }
}

DELETE /canvas/pin/{component_id}
// Elimina componente fijado

GET /canvas/workspace/{user_id}
// Obtiene el escritorio completo del usuario
// Response: { pinned_components[], layout }
```

#### Consumo de Tokens por Plan

| Plan | Tokens/mes | Proactividad | Componentes Fijables |
|------|------------|--------------|---------------------|
| **Básico** | 50,000 | Briefing matutino básico | 3 |
| **Profesional** | 200,000 | Briefings + alertas + sugerencias | 10 |
| **Avanzado** | 500,000+ | Todo + análisis predictivos | Ilimitados |

---

## 3. Modelo de Datos

Esquema relacional en PostgreSQL con soporte para JSONB en campos flexibles y extensiones para geolocalización.

### 3.1 Diagrama ER Principal

```
TENANTS
    │
    ├───────────────────────────────────────────┐
    │                                           │
    ▼                                           ▼
  USERS ◄────────────────────────────────────► HCPs
    │          (assigned_rep)                   │
    │                                           │
    │     ┌─────────────────────────────────────┤
    │     │                                     │
    ▼     ▼                                     ▼
ACTIVITIES ◄─────────────────────────────► WHATSAPP_CONVERSATIONS
    │                                           │
    ├──► SAMPLES_INVENTORY                      │
    │                                           │
    └──► OPPORTUNITIES ◄────────────────────────┘
              │
              ▼
         COMPLIANCE_LOG
```

### 3.2 Entidades Principales

#### TABLA: users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- rep, supervisor, director, admin
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  territory_id UUID REFERENCES territories(id),
  manager_id UUID REFERENCES users(id),
  phone VARCHAR(50),
  whatsapp_number VARCHAR(50), -- Número verificado WhatsApp Business
  avatar_url VARCHAR(500),
  preferences JSONB DEFAULT '{}',
  ai_token_usage JSONB DEFAULT '{"monthly": 0, "limit": 50000}',
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### TABLA: hcps (Médicos)

```sql
CREATE TABLE hcps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  professional_id VARCHAR(100), -- Cédula profesional
  specialty_id UUID REFERENCES specialties(id),
  institution_id UUID REFERENCES institutions(id),
  category VARCHAR(10) DEFAULT 'C', -- A, B, C, D
  territory_id UUID REFERENCES territories(id),
  assigned_rep_id UUID REFERENCES users(id),

  -- Contacto
  email VARCHAR(255),
  phone VARCHAR(50),
  whatsapp VARCHAR(50), -- Número WhatsApp preferido
  whatsapp_opted_in BOOLEAN DEFAULT false,
  whatsapp_consent_date TIMESTAMP,

  -- Ubicación
  address JSONB, -- {street, city, state, zip, lat, lng}
  preferred_hours VARCHAR(255),
  visit_frequency INTEGER DEFAULT 2, -- Visitas objetivo por mes

  -- Compliance
  gdpr_consent BOOLEAN DEFAULT false,
  gdpr_consent_date TIMESTAMP,
  sunshine_reportable BOOLEAN DEFAULT true,
  interaction_limits JSONB DEFAULT '{}', -- Límites regulatorios

  -- Metadata
  notes TEXT,
  ai_profile_summary TEXT, -- Resumen generado por IA
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hcps_tenant ON hcps(tenant_id);
CREATE INDEX idx_hcps_territory ON hcps(territory_id);
CREATE INDEX idx_hcps_rep ON hcps(assigned_rep_id);
CREATE INDEX idx_hcps_whatsapp ON hcps(whatsapp);
```

#### TABLA: activities (Visitas/Interacciones)

```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NOT NULL REFERENCES users(id),
  hcp_id UUID NOT NULL REFERENCES hcps(id),

  -- Tipo y estado
  type VARCHAR(50) NOT NULL, -- visit, call, email, whatsapp, event
  channel VARCHAR(50) DEFAULT 'app', -- app, whatsapp, web, voice
  status VARCHAR(50) DEFAULT 'completed',

  -- Temporal
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration_minutes INTEGER,

  -- Ubicación
  location GEOGRAPHY(POINT, 4326), -- PostGIS
  location_verified BOOLEAN DEFAULT false,

  -- Contenido
  products UUID[], -- Array de productos promovidos
  samples JSONB, -- [{product_id, quantity, lot}]
  notes TEXT,
  notes_source VARCHAR(50), -- typed, voice, whatsapp
  notes_structured JSONB, -- IA: {topics, objections, sentiment}

  -- Resultado
  interest_level VARCHAR(20), -- high, medium, low, none
  commitment TEXT,
  next_action JSONB, -- {type, date, description}

  -- Compliance
  signature_url VARCHAR(500),
  compliance_validated BOOLEAN DEFAULT false,
  compliance_flags JSONB DEFAULT '[]',

  -- IA
  ai_suggestions JSONB,
  ai_agent_used VARCHAR(50), -- visita, compliance, preparacion

  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_hcp ON activities(hcp_id);
CREATE INDEX idx_activities_date ON activities(completed_at DESC);
CREATE INDEX idx_activities_channel ON activities(channel);
```

#### TABLA: whatsapp_conversations

```sql
CREATE TABLE whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NOT NULL REFERENCES users(id),
  hcp_id UUID REFERENCES hcps(id),

  -- Identificadores WhatsApp
  wa_conversation_id VARCHAR(255),
  wa_phone_number VARCHAR(50) NOT NULL,

  -- Estado
  status VARCHAR(50) DEFAULT 'active', -- active, archived, blocked
  last_message_at TIMESTAMP,
  unread_count INTEGER DEFAULT 0,

  -- Contexto IA
  ai_summary TEXT, -- Resumen del historial
  ai_context JSONB, -- Contexto para agentes
  ai_next_action JSONB,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wa_conv_user ON whatsapp_conversations(user_id);
CREATE INDEX idx_wa_conv_hcp ON whatsapp_conversations(hcp_id);
CREATE INDEX idx_wa_conv_phone ON whatsapp_conversations(wa_phone_number);
```

#### TABLA: whatsapp_messages

```sql
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES whatsapp_conversations(id),

  -- Dirección
  direction VARCHAR(10) NOT NULL, -- inbound, outbound
  sender_type VARCHAR(20), -- user, hcp, agent, system

  -- Contenido
  message_type VARCHAR(50), -- text, image, document, voice, template
  content TEXT,
  media_url VARCHAR(500),

  -- WhatsApp IDs
  wa_message_id VARCHAR(255),
  wa_status VARCHAR(50), -- sent, delivered, read, failed

  -- Procesamiento IA
  ai_processed BOOLEAN DEFAULT false,
  ai_classification JSONB, -- {intent, entities, sentiment}
  ai_suggested_response TEXT,

  -- Compliance
  contains_medical_claim BOOLEAN DEFAULT false,
  compliance_reviewed BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wa_msg_conv ON whatsapp_messages(conversation_id);
CREATE INDEX idx_wa_msg_date ON whatsapp_messages(created_at DESC);
```

#### TABLA: opportunities (Pipeline)

```sql
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  client_id UUID NOT NULL, -- Puede ser hcp, pharmacy, hospital
  client_type VARCHAR(50) NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id),

  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2),
  currency VARCHAR(3) DEFAULT 'MXN',
  stage VARCHAR(50) DEFAULT 'prospect',
  probability INTEGER DEFAULT 10,
  expected_close DATE,

  products JSONB, -- [{product_id, quantity, price}]
  competitor VARCHAR(255),
  loss_reason VARCHAR(100),
  notes TEXT,

  -- IA Scoring
  ai_score INTEGER, -- 0-100 probabilidad IA
  ai_insights JSONB,
  ai_recommended_actions JSONB,

  closed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### TABLA: samples_inventory

```sql
CREATE TABLE samples_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NOT NULL REFERENCES users(id),
  product_id UUID NOT NULL REFERENCES products(id),

  lot_number VARCHAR(100),
  expiration_date DATE,
  quantity INTEGER NOT NULL,
  movement_type VARCHAR(50), -- assignment, delivery, return, adjustment
  reference_id UUID, -- activity_id si es delivery

  -- Compliance
  requires_signature BOOLEAN DEFAULT true,
  signature_captured BOOLEAN DEFAULT false,
  hcp_id UUID REFERENCES hcps(id),

  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vista de stock actual por rep
CREATE VIEW v_rep_stock AS
SELECT
  user_id,
  product_id,
  SUM(quantity) as current_stock,
  MIN(expiration_date) as nearest_expiration
FROM samples_inventory
GROUP BY user_id, product_id;
```

#### TABLA: compliance_log

```sql
CREATE TABLE compliance_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),

  -- Referencias
  entity_type VARCHAR(50) NOT NULL, -- activity, message, sample, opportunity
  entity_id UUID NOT NULL,
  user_id UUID REFERENCES users(id),
  hcp_id UUID REFERENCES hcps(id),

  -- Evento
  event_type VARCHAR(100) NOT NULL, -- validation, alert, block, approval
  severity VARCHAR(20) DEFAULT 'info', -- info, warning, critical

  -- Detalle
  rule_code VARCHAR(50), -- COFE-001, FDA-002, etc.
  description TEXT,
  details JSONB,

  -- Resolución
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMP,
  resolution_notes TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_compliance_entity ON compliance_log(entity_type, entity_id);
CREATE INDEX idx_compliance_severity ON compliance_log(severity, resolved);
```

#### TABLA: ai_usage

```sql
CREATE TABLE ai_usage (
  tenant_id UUID REFERENCES tenants(id),
  month DATE, -- Primer día del mes

  -- Tokens
  tokens_used BIGINT DEFAULT 0,
  tokens_limit BIGINT, -- Según plan: 50K, 200K, 500K+

  -- Requests
  requests_transcription INTEGER DEFAULT 0,
  requests_suggestions INTEGER DEFAULT 0,
  requests_agents INTEGER DEFAULT 0,

  -- Por agente
  agent_visita_calls INTEGER DEFAULT 0,
  agent_compliance_calls INTEGER DEFAULT 0,
  agent_preparacion_calls INTEGER DEFAULT 0,
  agent_alertas_calls INTEGER DEFAULT 0,

  PRIMARY KEY (tenant_id, month)
);
```

---

## 4. Especificación de APIs

API RESTful con versionamiento en URL. Todas las respuestas en JSON. Autenticación via JWT.

### 4.1 Endpoints Principales

#### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Iniciar sesión, retorna JWT |
| POST | `/api/v1/auth/refresh` | Renovar token |
| POST | `/api/v1/auth/logout` | Cerrar sesión |
| POST | `/api/v1/auth/forgot-password` | Solicitar reset de contraseña |
| POST | `/api/v1/auth/reset-password` | Cambiar contraseña con token |

#### HCPs (Médicos)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/hcps` | Listar HCPs (paginado, filtros) |
| GET | `/api/v1/hcps/:id` | Detalle de HCP |
| POST | `/api/v1/hcps` | Crear HCP |
| PUT | `/api/v1/hcps/:id` | Actualizar HCP |
| DELETE | `/api/v1/hcps/:id` | Eliminar HCP (soft delete) |
| GET | `/api/v1/hcps/:id/activities` | Historial de actividades |
| GET | `/api/v1/hcps/:id/samples` | Muestras entregadas |
| GET | `/api/v1/hcps/:id/summary` | Resumen IA del HCP |
| GET | `/api/v1/hcps/:id/whatsapp` | Conversaciones WhatsApp |

#### Activities (Visitas)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/activities` | Listar actividades |
| GET | `/api/v1/activities/:id` | Detalle de actividad |
| POST | `/api/v1/activities` | Registrar actividad |
| PUT | `/api/v1/activities/:id` | Actualizar actividad |
| POST | `/api/v1/activities/:id/transcribe` | Transcribir audio de notas |
| POST | `/api/v1/activities/:id/signature` | Subir firma del médico |
| GET | `/api/v1/activities/today` | Actividades del día (agenda) |
| GET | `/api/v1/activities/pending` | Compromisos pendientes |

#### WhatsApp

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/whatsapp/conversations` | Listar conversaciones |
| GET | `/api/v1/whatsapp/conversations/:id` | Detalle con mensajes |
| POST | `/api/v1/whatsapp/send` | Enviar mensaje |
| POST | `/api/v1/whatsapp/send-template` | Enviar template aprobado |
| POST | `/api/v1/whatsapp/webhook` | Webhook para Meta |
| GET | `/api/v1/whatsapp/templates` | Templates disponibles |

#### Agentes IA

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/agents/visita` | Invocar Agente de Visita |
| POST | `/api/v1/agents/compliance` | Invocar Agente de Compliance |
| POST | `/api/v1/agents/preparacion` | Invocar Agente de Preparación |
| POST | `/api/v1/agents/alertas` | Consultar Agente de Alertas |
| GET | `/api/v1/agents/suggestions/:context` | Obtener sugerencias contextuales |

### 4.2 Ejemplo de Request/Response

#### POST /api/v1/activities

```json
// Request
{
  "hcp_id": "uuid-del-medico",
  "type": "visit",
  "channel": "whatsapp", // Indica que se registró desde WhatsApp
  "products": ["uuid-producto-1", "uuid-producto-2"],
  "samples": [
    {"product_id": "uuid", "quantity": 2, "lot": "LOT2024A"}
  ],
  "notes": "Médico interesado en nueva presentación...",
  "notes_source": "voice", // Transcrito de audio
  "interest_level": "high",
  "commitment": "Enviar estudios clínicos por email",
  "location": {"lat": 19.4326, "lng": -99.1332}
}

// Response 201 Created
{
  "id": "uuid-nueva-actividad",
  "status": "completed",
  "completed_at": "2026-02-04T15:30:00Z",
  "compliance_validated": true,
  "compliance_flags": [],
  "ai_suggestions": {
    "next_action": {
      "type": "email",
      "date": "2026-02-05",
      "description": "Enviar estudios clínicos mencionados"
    },
    "notes_structured": {
      "topics": ["nueva presentación", "dosificación"],
      "objections": [],
      "sentiment": "positive"
    },
    "whatsapp_followup": {
      "suggested_message": "Dr. García, fue un placer. Le comparto el estudio que comentamos: [link]",
      "optimal_send_time": "09:00"
    }
  }
}
```

#### POST /api/v1/whatsapp/send (Comando natural)

```json
// Request - El rep escribe en lenguaje natural
{
  "conversation_id": "uuid-conversacion",
  "message": "registra visita con el Dr. García, le dejé 3 muestras de CardioMax, muy interesado en el nuevo estudio"
}

// Response - El agente procesa y confirma
{
  "processed": true,
  "action_taken": "activity_created",
  "activity_id": "uuid-nueva-actividad",
  "confirmation_message": "✅ Visita registrada:\n• Dr. García\n• 3 muestras CardioMax\n• Interés: Alto\n• Siguiente: Enviar estudio clínico",
  "compliance_status": "validated"
}
```

---

## 5. Capa de Inteligencia Artificial

Arquitectura de IA modular con 4 agentes especializados que operan principalmente a través de WhatsApp.

### 5.1 Servicios de IA

| Servicio | Modelo/API | Uso | Costo Est. |
|----------|-----------|-----|-----------|
| Transcripción | Whisper API | Voz a texto para notas | $0.006/min |
| Clasificación | GPT-4 Turbo | Sentimiento, objeciones, temas | $0.01/1K tok |
| Agente Visita | GPT-4 Turbo | Registro natural, sugerencias | $0.01/1K tok |
| Agente Compliance | GPT-4 Turbo | Validación regulatoria | $0.01/1K tok |
| Agente Preparación | GPT-4 Turbo | Briefing pre-visita | $0.01/1K tok |
| Agente Alertas | GPT-4 Turbo | Monitoreo proactivo | $0.01/1K tok |
| Resúmenes | GPT-4 Turbo | Condensar historial de HCP | $0.01/1K tok |
| Scoring | Custom ML | Probabilidad de cierre, riesgo | Incluido |
| Embeddings | text-embedding-3-small | Búsqueda semántica | $0.02/1M tok |
| Reportes | GPT-4 Turbo | Generación de narrativas | $0.03/1K tok |

### 5.2 Los 4 Agentes IA

#### Agente de Visita (Principal)

```typescript
// Flujo del Agente de Visita
interface AgentVisitaInput {
  user_id: string;
  conversation_context: WhatsAppMessage[];
  natural_command: string; // "registra visita con Dr. García..."
}

interface AgentVisitaOutput {
  action: 'create_activity' | 'update_activity' | 'query' | 'clarify';
  activity_data?: Partial<Activity>;
  response_message: string;
  compliance_check: ComplianceResult;
  suggestions: string[];
}

// Capacidades:
// - Interpreta comandos en lenguaje natural
// - Extrae entidades (médico, productos, muestras, fechas)
// - Crea/actualiza registros automáticamente
// - Valida compliance antes de confirmar
// - Sugiere próximas acciones
```

#### Agente de Compliance

```typescript
// Validación en tiempo real
interface ComplianceCheck {
  entity_type: 'activity' | 'message' | 'sample';
  entity_data: any;
  rules_to_check: string[]; // ['COFEPRIS', 'FDA', 'SUNSHINE']
}

interface ComplianceResult {
  is_valid: boolean;
  flags: ComplianceFlag[];
  suggestions: string[];
  requires_approval: boolean;
}

// Reglas implementadas:
// - Límites de muestras por médico/periodo
// - Claims médicos no autorizados
// - Requisitos de firma/consentimiento
// - Sunshine Act (valor de interacciones)
// - GDPR (consentimiento comunicaciones)
```

#### Agente de Preparación

```typescript
// Briefing pre-visita
interface PreparationBriefing {
  hcp_id: string;
  visit_date: Date;
}

interface BriefingOutput {
  hcp_summary: string;           // Perfil y preferencias
  last_interactions: string;     // Resumen últimas 3 visitas
  pending_commitments: string[]; // Promesas sin cumplir
  recommended_topics: string[];  // Qué hablar
  products_to_promote: string[]; // Según historial
  compliance_reminders: string[];// Alertas regulatorias
  optimal_approach: string;      // Sugerencia de enfoque
}
```

#### Agente de Alertas

```typescript
// Monitoreo proactivo (ejecuta cada hora)
interface AlertScan {
  tenant_id: string;
  scan_types: ('opportunities' | 'compliance' | 'followups' | 'inventory')[];
}

interface AlertOutput {
  alerts: Alert[];
  priority_actions: Action[];
  daily_summary?: string;
}

// Tipos de alertas:
// - Oportunidades en riesgo (sin actividad 7+ días)
// - Compliance próximo a vencer
// - Seguimientos vencidos
// - Inventario bajo o próximo a caducar
// - Médicos sin contacto en periodo objetivo
```

### 5.3 Pipeline de Procesamiento WhatsApp

```
1. Rep envía mensaje vía WhatsApp
   "acabo de ver al Dr. Martínez, le dejé 2 CardioMax,
    preguntó por el estudio de eficacia"
                    │
                    ▼
2. Webhook recibe mensaje → whatsapp-api
                    │
                    ▼
3. Clasificación inicial (GPT-4)
   - Intent: registro_visita
   - Entities: {hcp: "Dr. Martínez", samples: [{product: "CardioMax", qty: 2}]}
   - Requires: compliance_check
                    │
                    ▼
4. Agente de Visita procesa
   - Busca HCP por nombre
   - Valida stock de muestras
   - Prepara registro de actividad
                    │
                    ▼
5. Agente de Compliance valida
   - Verifica límite de muestras (OK)
   - Verifica claims médicos (OK)
   - Verifica consentimiento WhatsApp (OK)
                    │
                    ▼
6. Creación de Activity en BD
   - Guarda con channel='whatsapp'
   - Actualiza inventario muestras
   - Genera embeddings para búsqueda
                    │
                    ▼
7. Respuesta al rep vía WhatsApp
   "✅ Visita registrada - Dr. Martínez
    • 2 muestras CardioMax (quedan 8)
    • Siguiente: Enviar estudio eficacia

    📎 ¿Quieres que te prepare el email con el estudio?"
```

### 5.4 Gestión de Tokens y Límites

```typescript
// Middleware de verificación de cuota
async function checkAIQuota(tenantId: string, estimatedTokens: number) {
  const usage = await getUsage(tenantId);

  if (usage.tokens_used + estimatedTokens > usage.tokens_limit) {
    throw new QuotaExceededError('Token limit exceeded');
  }

  // Registrar uso
  await incrementUsage(tenantId, estimatedTokens);
}

// Límites por plan
const TOKEN_LIMITS = {
  starter: 50_000,    // ~500 interacciones/mes
  professional: 200_000, // ~2,000 interacciones/mes
  enterprise: 500_000+   // Ilimitado o personalizado
};
```

---

## 6. Motor de Compliance

Sistema de reglas configurable para cumplimiento regulatorio farmacéutico.

### 6.1 Estructura de Reglas

```typescript
interface ComplianceRule {
  code: string;           // 'COFE-001'
  name: string;           // 'Límite muestras mensuales'
  regulation: string;     // 'COFEPRIS', 'FDA', 'GDPR'
  entity_type: string;    // 'sample', 'activity', 'message'
  condition: RuleCondition;
  action: 'warn' | 'block' | 'require_approval';
  message_template: string;
  is_active: boolean;
}

// Ejemplo de regla
const SAMPLE_LIMIT_RULE: ComplianceRule = {
  code: 'COFE-001',
  name: 'Límite de muestras médicas por HCP',
  regulation: 'COFEPRIS',
  entity_type: 'sample',
  condition: {
    type: 'quantity_limit',
    params: {
      max_per_hcp_per_month: 10,
      max_per_product_per_visit: 3
    }
  },
  action: 'block',
  message_template: 'Límite de muestras alcanzado para {{hcp_name}}. Máximo: {{limit}}/mes',
  is_active: true
};
```

### 6.2 Reglas Predefinidas

| Código | Regulación | Descripción | Acción |
|--------|------------|-------------|--------|
| COFE-001 | COFEPRIS | Límite muestras por HCP/mes | Block |
| COFE-002 | COFEPRIS | Productos controlados requieren firma | Block |
| FDA-001 | FDA | Claims médicos no aprobados | Warn |
| FDA-002 | FDA | Información fuera de indicación | Block |
| GDPR-001 | GDPR | Consentimiento WhatsApp requerido | Block |
| GDPR-002 | GDPR | Derecho al olvido solicitado | Block |
| SUN-001 | Sunshine | Valor de interacción > umbral | Require Approval |
| SUN-002 | Sunshine | Acumulado trimestral por HCP | Warn |

### 6.3 Flujo de Validación

```
┌─────────────────┐
│ Acción del Rep  │
│ (via WhatsApp)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Agente Visita   │
│ (extrae datos)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│          MOTOR DE COMPLIANCE            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │COFEPRIS │ │   FDA   │ │  GDPR   │   │
│  │ Rules   │ │ Rules   │ │ Rules   │   │
│  └────┬────┘ └────┬────┘ └────┬────┘   │
│       └──────────┼──────────┘          │
│                  ▼                      │
│         [Evaluación Paralela]           │
│                  │                      │
│    ┌─────────────┼─────────────┐       │
│    ▼             ▼             ▼       │
│  ✅ Pass    ⚠️ Warn      🚫 Block     │
└────┬─────────────┬─────────────┬───────┘
     │             │             │
     ▼             ▼             ▼
  Continuar    Log + Alert   Rechazar +
  Acción       Continuar     Notificar
```

---

## 7. Seguridad

Implementación de seguridad en capas con enfoque en protección de datos de salud y cumplimiento GDPR.

### 7.1 Autenticación y Autorización

| Capa | Implementación | Tecnología |
|------|---------------|------------|
| Autenticación | JWT con refresh tokens, expiración 15min/7días | Passport.js |
| MFA | TOTP opcional para roles admin/director | speakeasy |
| Autorización | RBAC + ABAC para permisos granulares | CASL |
| Multi-tenancy | Aislamiento por tenant_id en todas las queries | TypeORM Subscribers |
| API Keys | Para integraciones externas, scoped por permiso | Custom middleware |
| Rate Limiting | 100 req/min por IP, 1000 req/min por tenant | Redis + express-rate-limit |

### 7.2 Protección de Datos

- **Encriptación en tránsito:** TLS 1.3 obligatorio en todas las conexiones
- **Encriptación en reposo:** AES-256 para base de datos y archivos
- **PII (datos personales):** Campos sensibles encriptados a nivel aplicación
- **Backups:** Encriptados, retenidos 30 días, con pruebas de restauración mensuales
- **Logs:** Sin datos personales en logs, IDs de referencia únicamente
- **Auditoría:** Registro inmutable de todas las acciones sobre datos sensibles

### 7.3 Seguridad WhatsApp

```typescript
// Validación de webhooks Meta
function validateWhatsAppWebhook(req: Request): boolean {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WHATSAPP_APP_SECRET)
    .update(payload)
    .digest('hex');

  return `sha256=${expectedSignature}` === signature;
}

// Sanitización de mensajes entrantes
function sanitizeInboundMessage(message: string): string {
  // Remover posibles intentos de injection
  // Validar longitud máxima
  // Escapar caracteres especiales
  return sanitized;
}
```

### 7.4 Compliance Farmacéutico

- **Trazabilidad de muestras:** Registro completo desde asignación hasta entrega
- **Firma electrónica:** Captura de firma del médico con timestamp y geolocalización
- **Límites automáticos:** Validación de cantidades máximas por médico/producto
- **Reportes regulatorios:** Exportación en formatos requeridos por COFEPRIS
- **Retención de datos:** Configurable por cliente según regulación local

---

## 8. Infraestructura y DevOps

Infraestructura en la nube con alta disponibilidad y despliegues automatizados.

### 8.1 Arquitectura Cloud (AWS)

```
┌─────────────────────────────────────────────────────────────┐
│                     Route 53 (DNS)                          │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                CloudFront (CDN) + WAF                        │
└───────────────────────────┬─────────────────────────────────┘
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
   ┌──────────┐      ┌───────────┐     ┌───────────┐
   │  Vercel  │      │    ALB    │     │    ALB    │
   │(Next.js) │      │   (API)   │     │   (WS)    │
   └──────────┘      └─────┬─────┘     └─────┬─────┘
                           ▼                 ▼
          ┌────────────────────────────────────────┐
          │           EKS (Kubernetes)             │
          │  ┌─────┐  ┌─────┐  ┌─────┐  ┌──────┐  │
          │  │core │  │ ia  │  │integ│  │ wa   │  │
          │  │ api │  │ api │  │ api │  │ api  │  │
          │  └──┬──┘  └──┬──┘  └──┬──┘  └──┬───┘  │
          └─────┼────────┼───────┼────────┼───────┘
                │        │       │        │
    ┌───────────┴────────┴───────┴────────┴───────────┐
    ▼                                                  ▼
┌───────────┐                                  ┌───────────┐
│    RDS    │                                  │ElastiCache│
│(PostgreSQL│                                  │  (Redis)  │
└───────────┘                                  └───────────┘
```

### 8.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test
      - name: Run compliance checks
        run: npm run compliance:check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker images
        run: docker build -t apex-api .
      - name: Push to ECR
        run: aws ecr push

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EKS
        run: kubectl apply -f k8s/
      - name: Run migrations
        run: kubectl exec -- npm run migrate
      - name: Health check
        run: curl https://api.apex.com/health
```

### 8.3 Costos Estimados Mensuales

| Servicio | Inicial (5 users) | Escalado (50 users) |
|----------|-------------------|---------------------|
| EKS (Kubernetes) | $150 | $400 |
| RDS PostgreSQL | $50 | $200 |
| ElastiCache Redis | $30 | $100 |
| S3 + CloudFront | $20 | $80 |
| ALB + Route53 | $30 | $50 |
| Monitoring (CloudWatch) | $20 | $50 |
| WhatsApp Business API | $50 | $200 |
| OpenAI API (estimado) | $50 | $300 |
| **TOTAL** | **$400** | **$1,380** |

---

## 9. Integraciones Técnicas

### 9.1 WhatsApp Business API

```typescript
// Configuración de webhook para mensajes entrantes
// POST /webhooks/whatsapp

interface WhatsAppWebhookPayload {
  entry: [{
    changes: [{
      value: {
        messages?: WhatsAppMessage[];
        statuses?: WhatsAppStatus[];
      }
    }]
  }]
}

interface WhatsAppMessage {
  from: string;           // Número del remitente
  id: string;             // ID único del mensaje
  timestamp: string;
  type: 'text' | 'image' | 'document' | 'voice' | 'interactive';
  text?: { body: string };
  voice?: { id: string }; // Para transcripción
}

// Envío de mensajes con templates aprobados
async function sendWhatsAppTemplate(
  to: string,
  template: string,
  params: TemplateParams
) {
  return await whatsappClient.messages.create({
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: template,
      language: { code: 'es_MX' },
      components: mapParamsToComponents(params)
    }
  });
}

// Envío de mensaje de texto (requiere ventana 24h)
async function sendWhatsAppText(to: string, text: string) {
  return await whatsappClient.messages.create({
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text }
  });
}
```

### 9.2 ERP (CONTPAQi / SAP B1)

```typescript
// Sincronización bidireccional via API/SDK

// Importar clientes desde ERP
async function syncClientsFromERP() {
  const clients = await erpClient.getClients({
    modified_since: lastSync
  });

  for (const client of clients) {
    await upsertClient({
      external_id: client.id,
      name: client.razon_social,
      rfc: client.rfc,
      // ... mapeo de campos
    });
  }
}

// Exportar pedidos a ERP
async function exportOrderToERP(order: Order) {
  const erpOrder = mapToERPFormat(order);
  const result = await erpClient.createOrder(erpOrder);
  await updateOrderExternalId(order.id, result.folio);
}
```

### 9.3 Google Calendar / Outlook

```typescript
// OAuth2 para acceso a calendarios

// Sincronizar visitas programadas
async function syncToCalendar(activity: Activity) {
  const event = {
    summary: `Visita: ${activity.hcp.name}`,
    location: activity.hcp.address.formatted,
    start: {
      dateTime: activity.scheduled_at
    },
    end: {
      dateTime: addMinutes(activity.scheduled_at, 30)
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 30 }
      ]
    }
  };

  return await calendar.events.insert({
    calendarId: 'primary',
    resource: event
  });
}
```

### 9.4 Facturación (SAT México)

```typescript
// Integración con PAC para CFDI

interface InvoiceRequest {
  client_rfc: string;
  items: InvoiceItem[];
  payment_method: string;
  cfdi_use: string;
}

async function generateCFDI(request: InvoiceRequest): Promise<CFDI> {
  // 1. Generar XML según especificación SAT
  const xml = generateCFDIXML(request);

  // 2. Enviar a PAC para timbrado
  const timbrado = await pacClient.stamp(xml);

  // 3. Guardar y retornar
  return await saveCFDI(timbrado);
}
```

---

## 10. Plan de Implementación

Roadmap de desarrollo en fases con entregables incrementales y modelo de co-creación.

### 10.1 Fases del Proyecto

| Fase | Duración | Entregables |
|------|----------|-------------|
| **1. Foundation** | 4 semanas | Infraestructura, auth, modelo de datos, API base |
| **2. WhatsApp Core** | 4 semanas | Integración WhatsApp, webhooks, conversaciones |
| **3. Agente Visita** | 4 semanas | IA para registro natural, clasificación, sugerencias |
| **4. Experiencia Rep** | 4 semanas | App móvil, registro de visitas, HCPs |
| **5. Compliance Engine** | 4 semanas | Motor de reglas, validación, logs |
| **6. Agente Compliance** | 3 semanas | Validación automática, alertas |
| **7. Supervisor** | 3 semanas | Dashboard supervisor, reportes, aprobaciones |
| **8. Agente Preparación** | 3 semanas | Briefings pre-visita, resúmenes |
| **9. Director** | 3 semanas | Dashboard ejecutivo, reportes automáticos |
| **10. Agente Alertas** | 2 semanas | Monitoreo proactivo, notificaciones |
| **11. Portal Médico** | 3 semanas | Autoservicio, solicitud de muestras |
| **12. Integraciones** | 4 semanas | ERP, facturación, calendario |
| **13. Polish** | 2 semanas | QA, performance, documentación |

**DURACIÓN TOTAL ESTIMADA: 43 semanas (~10 meses)**

### 10.2 Modelo de Co-creación

```
Sprint 0 (Discovery)
    │
    ├── Configuración inicial
    ├── Usuarios piloto
    └── Métricas de éxito
            │
            ▼
┌─────────────────────────────────────┐
│     CICLO DE SPRINTS (2 semanas)   │
│                                     │
│  ┌──────┐    ┌──────┐    ┌──────┐  │
│  │Build │───▶│Review│───▶│Adapt │  │
│  └──────┘    └──────┘    └──────┘  │
│      │                       │      │
│      └───────────────────────┘      │
│           (feedback loop)           │
└─────────────────────────────────────┘
            │
            ▼
    Entrega Incremental
    (cada 2 semanas)
```

---

## 11. Estimaciones y Recursos

### 11.1 Equipo Recomendado

| Rol | Cantidad | Responsabilidades |
|-----|----------|-------------------|
| Tech Lead / Arquitecto | 1 | Arquitectura, decisiones técnicas, code review |
| Backend Developer Sr | 2 | APIs, integraciones, base de datos |
| Frontend Developer Sr | 1 | Next.js, React, PWA |
| Mobile Developer | 1 | React Native iOS/Android |
| AI/ML Engineer | 1 | Agentes IA, LangChain, prompts |
| DevOps / SRE | 0.5 | Infraestructura, CI/CD, monitoreo |
| QA Engineer | 1 | Testing, automatización, UAT |
| UX/UI Designer | 0.5 | Diseño de interfaces, prototipos |

### 11.2 Estimación de Horas

| Componente | Horas |
|------------|-------|
| Infraestructura y DevOps | 160 |
| Backend Core (APIs, DB) | 480 |
| WhatsApp Integration | 240 |
| Agentes IA (4 agentes) | 320 |
| Motor Compliance | 200 |
| Frontend Web | 320 |
| App Móvil | 400 |
| Portal Médico | 160 |
| Integraciones Externas | 200 |
| Testing y QA | 200 |
| Documentación | 80 |
| **TOTAL** | **2,760 horas** |

### 11.3 Resumen de Costos

| Concepto | Rango |
|----------|-------|
| **Desarrollo (co-creación)** | $6,000 - $20,000 USD |
| **Infraestructura mensual** | $400 - $1,380 USD |
| **Licencia mensual** | $180 - $600 USD |

---

## Documentos Relacionados

- [Propuesta Comercial](propuesta-comercial.md) — Visión de negocio y pricing
- [Especificación Funcional](especificacion-funcional.md) — Experiencias y flujos de usuario
- [Catálogo Completo](catalogo-completo-APEX.md) — Detalle de módulos y funcionalidades

---

*Especificación Técnica APEX v2.1 — Febrero 2026*
