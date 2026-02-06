# APEX — Especificación Funcional

## Sistema de Inteligencia Autónoma para la Industria Farmacéutica

> **APEX** = El CRM Invisible para Pharma
> Un sistema que no requiere que entres en él para que funcione.

---

## Índice

1. [Arquitectura del Sistema](#1-arquitectura-del-sistema)
2. [Interfaz WhatsApp-First](#2-interfaz-whatsapp-first)
3. [Los 4 Agentes de IA](#3-los-4-agentes-de-ia)
4. [Las 5 Experiencias Adaptativas](#4-las-5-experiencias-adaptativas)
5. [Generative UI (Dashboard Adaptativo)](#5-generative-ui-dashboard-adaptativo)
6. [Motor de Compliance Farmacéutico](#6-motor-de-compliance-farmacéutico)
7. [Integraciones](#7-integraciones)
8. [Seguridad y Gobernanza de IA](#8-seguridad-y-gobernanza-de-ia)
9. [Servicios Profesionales](#9-servicios-profesionales)

---

# 1. ARQUITECTURA DEL SISTEMA

## 1.1 Filosofía: Sistema de Acción Autónoma

APEX no es un "sistema de registro" tradicional. Es un **Sistema de Inteligencia Autónoma** que:

| Paradigma Tradicional | Paradigma APEX |
|-----------------------|----------------|
| Usuario entra al sistema | Sistema va al usuario |
| Usuario busca información | Información aparece automáticamente |
| Usuario ejecuta acciones | Sistema ejecuta acciones (supervisadas) |
| Módulos fijos | Contextos adaptativos |
| Dashboard estático | Generative UI |

## 1.2 Componentes Principales

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAPA DE INTERFAZ                         │
├──────────────────┬──────────────────┬──────────────────────────┤
│   WhatsApp API   │   App Móvil      │   Dashboard Web          │
│   (Reps - 90%)   │   (Opcional)     │   (Gerentes/Admin)       │
└────────┬─────────┴────────┬─────────┴────────────┬─────────────┘
         │                  │                      │
         ▼                  ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MOTOR DE IA AGÉNTICA                         │
├────────────────┬────────────────┬────────────────┬──────────────┤
│ Agente Visita  │ Agente Comply  │ Agente Prep    │ Agente Alert │
└────────┬───────┴────────┬───────┴────────┬───────┴──────┬───────┘
         │                │                │              │
         ▼                ▼                ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NÚCLEO DE DATOS                              │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│     HCPs     │   Visitas    │  Inventario  │   Compliance      │
│   (Médicos)  │              │  (Muestras)  │   (Reglas)        │
└──────────────┴──────────────┴──────────────┴───────────────────┘
         │                │                │              │
         ▼                ▼                ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    INTEGRACIONES                                │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│     ERP      │  Datos IQVIA │   Email      │   Calendario      │
└──────────────┴──────────────┴──────────────┴───────────────────┘
```

---

# 2. INTERFAZ WHATSAPP-FIRST

## 2.1 Principio Fundamental

> "El representante farmacéutico vive en WhatsApp. APEX vive ahí también."

El 90% de las interacciones del representante de campo se realizan a través de WhatsApp Business API, sin necesidad de abrir otra aplicación.

## 2.2 Capacidades de Procesamiento

### Entrada de Datos
- [ ] **Texto informal:** "Acabo de ver al Dr. García, le dejé 3 muestras"
- [ ] **Notas de voz:** Transcripción automática + extracción de entidades
- [ ] **Imágenes:** Fotos de recetas, tarjetas de presentación, material
- [ ] **Ubicación:** Geolocalización automática para check-in

### Procesamiento de Lenguaje Natural (NLP)
- [ ] Detección de entidades: médicos, productos, cantidades, fechas
- [ ] Comprensión de intenciones múltiples en una frase
- [ ] Manejo de contexto conversacional (memoria de hilo)
- [ ] Variantes regionales de español (México, España, LATAM)
- [ ] Interpretación de expresiones coloquiales ("te aviso luego", "lo estamos viendo")

### Respuestas del Sistema
- [ ] Confirmaciones estructuradas de acciones tomadas
- [ ] Briefings pre-visita automáticos
- [ ] Alertas proactivas de compliance
- [ ] Documentos adjuntos (estudios, fichas técnicas)
- [ ] Botones de acción rápida (WhatsApp Flows)

## 2.3 Flujos de Conversación

### Registro de Visita
```
Rep: [Nota de voz] "Acabo de salir de ver al Dr. Martínez en
     el Hospital San José. Le dejé dos muestras del Losartán
     de 50mg. Está muy interesado pero me pidió el estudio
     de eficacia comparativa. Hay que darle seguimiento la
     próxima semana."

APEX: ✓ Visita registrada
      📍 Hospital San José (11:42 AM)
      👤 Dr. Martínez - Cardiólogo
      💊 2 muestras Losartán 50mg descontadas
      📊 Estado: Interesado - Pendiente estudio
      📎 Te adjunto: Estudio_Eficacia_Losartan.pdf
      📅 Recordatorio creado: Seguimiento 12 Feb

      ¿Comparto el estudio directamente al Dr. Martínez?
      [Sí, enviar] [No, lo hago yo] [Editar visita]
```

### Consulta de Cliente
```
Rep: "Dame el resumen del Dr. García"

APEX: 👤 Dr. Juan García Hernández
      🏥 Cardiólogo - Hospital Ángeles Pedregal

      📊 POTENCIAL: A (Alto prescriptor)
      📈 Tendencia: ↑ Incrementando prescripciones

      📅 Última visita: 15 Ene 2026 (hace 22 días)
      💊 Muestras este mes: 4/6 (disponibles: 2)

      ⚠️ ALERTA: Próximo a límite mensual de muestras

      📝 Última nota: "Interesado en estudios de
         combinación con IECA"

      🎯 Acción sugerida: Visitar con estudio COMBINE-2024

      [Ver historial completo] [Programar visita] [Llamar]
```

### Alerta de Compliance
```
APEX: ⚠️ ALERTA DE COMPLIANCE

      Antes de tu visita al Dr. Rodríguez:

      💊 Ha recibido 5 de 6 muestras permitidas este mes
      📋 Solo puedes entregar 1 muestra más

      Si necesitas entregar más, debes:
      [Solicitar excepción] [Continuar con límite]
```

## 2.4 WhatsApp Business API - Requisitos Técnicos

### Configuración
- [ ] Número de WhatsApp Business verificado
- [ ] Integración vía API oficial de Meta
- [ ] Plantillas de mensaje aprobadas
- [ ] Webhook para recepción de mensajes
- [ ] Cifrado end-to-end

### WhatsApp Flows
- [ ] Formularios interactivos dentro del chat
- [ ] Selección de productos con catálogo visual
- [ ] Firma digital de recepción de muestras
- [ ] Encuestas de satisfacción post-visita

---

# 3. LOS 4 AGENTES DE IA

## 3.1 Arquitectura Multi-Agente

APEX utiliza un ecosistema de agentes especializados que trabajan en paralelo, cada uno con su dominio de responsabilidad.

```
┌─────────────────────────────────────────────────────────────┐
│                   ORQUESTADOR CENTRAL                       │
│         (Decide qué agente responde a cada input)           │
└─────────────────────────────────────────────────────────────┘
         │           │            │            │
         ▼           ▼            ▼            ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
    │ AGENTE  │ │ AGENTE  │ │ AGENTE  │ │ AGENTE  │
    │ VISITA  │ │COMPLIANCE│ │ PREP   │ │ ALERTAS │
    └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

---

## 3.2 Agente de Visita

**Función:** Capturar, estructurar y registrar interacciones con HCPs

### Capacidades

#### Captura de Información
- [ ] Transcripción de notas de voz con precisión >95%
- [ ] Extracción de entidades (NER): médicos, productos, cantidades, fechas
- [ ] Interpretación de texto informal y coloquial
- [ ] Procesamiento de imágenes (recetas, tarjetas, material)
- [ ] Geolocalización automática (check-in/check-out)

#### Estructuración Automática
- [ ] Mapeo de médico mencionado a registro de HCP
- [ ] Clasificación de tipo de visita (promoción, seguimiento, evento)
- [ ] Extracción de compromisos y próximos pasos
- [ ] Análisis de sentimiento de la interacción
- [ ] Detección de objeciones mencionadas

#### Acciones Autónomas
- [ ] Registro de visita en el sistema
- [ ] Actualización de estado del HCP en pipeline
- [ ] Descuento de muestras del inventario
- [ ] Creación de recordatorios de seguimiento
- [ ] Generación de email de seguimiento (borrador o envío)
- [ ] Adjuntar material relevante mencionado

### Ejemplo de Procesamiento

**Input (voz):**
> "Acabo de ver al Dr. Martínez, cardiólogo del Hospital San José.
> Le dejé dos muestras de Losartán. Está interesado pero me pidió
> el estudio de eficacia. Hay que darle seguimiento la próxima semana."

**Procesamiento del Agente:**
```json
{
  "entidades_detectadas": {
    "hcp": "Dr. Martínez",
    "especialidad": "cardiólogo",
    "institucion": "Hospital San José",
    "producto": "Losartán",
    "cantidad_muestras": 2,
    "estado": "interesado",
    "solicitud": "estudio de eficacia",
    "seguimiento": "próxima semana"
  },
  "acciones_ejecutadas": [
    "visita_registrada",
    "inventario_actualizado",
    "estado_hcp_actualizado",
    "documento_adjuntado",
    "recordatorio_creado"
  ],
  "sentimiento": "positivo",
  "probabilidad_cierre": 0.72
}
```

---

## 3.3 Agente de Compliance

**Función:** Garantizar cumplimiento regulatorio en tiempo real

### Capacidades

#### Verificación Preventiva
- [ ] Validar límites de muestras ANTES de entrega
- [ ] Verificar frecuencia de visitas según regulación
- [ ] Controlar material promocional aprobado
- [ ] Validar que HCP puede recibir muestras (licencia activa)

#### Alertas en Tiempo Real
- [ ] Alerta cuando se aproxima al límite de muestras
- [ ] Aviso de visita a HCP con restricciones
- [ ] Notificación de material no aprobado para el territorio
- [ ] Bloqueo de acciones que violarían regulación

#### Registro y Trazabilidad
- [ ] Firma electrónica de recepción de muestras
- [ ] Audit trail inmutable de todas las interacciones
- [ ] Timestamps y geolocalización verificables
- [ ] Registro de excepciones aprobadas

#### Reportes Automáticos
- [ ] Generación de reportes de transparencia (Sunshine Act)
- [ ] Informes de distribución de muestras
- [ ] Documentación para auditorías
- [ ] Alertas de vencimiento de certificaciones

### Reglas de Compliance Configurables

| Regulación | Parámetro | Valor Ejemplo |
|------------|-----------|---------------|
| Límite muestras/HCP/mes | `max_samples_per_hcp_monthly` | 6 |
| Límite muestras/HCP/año | `max_samples_per_hcp_yearly` | 36 |
| Frecuencia mínima visitas | `min_days_between_visits` | 14 |
| Requiere firma digital | `require_digital_signature` | true |
| Valor máximo obsequios | `max_gift_value_usd` | 50 |

---

## 3.4 Agente de Preparación

**Función:** Preparar al representante antes de cada visita

### Capacidades

#### Briefing Automático Pre-Visita
El sistema detecta la próxima visita programada y envía por WhatsApp:

- [ ] **Resumen del HCP:** Nombre, especialidad, institución, foto
- [ ] **Historial reciente:** Últimas 5 visitas con notas clave
- [ ] **Muestras entregadas:** Qué productos, cuántas, disponibilidad actual
- [ ] **Objeciones registradas:** Qué ha dicho antes y cómo se manejó
- [ ] **Material recomendado:** Estudios relevantes para su especialidad
- [ ] **Alertas:** Tiempo sin visita, cambios detectados, noticias

#### Auto-Populated Context
Cuando el rep menciona un HCP, el sistema automáticamente busca y presenta:

| Dato | Fuente | Actualización |
|------|--------|---------------|
| Perfil completo | Base de HCPs | Tiempo real |
| Historial de visitas | Registros APEX | Tiempo real |
| Muestras entregadas | Inventario | Tiempo real |
| Potencial/Scoring | Motor IA | Diario |
| Noticias del hospital | Fuentes externas | Semanal |
| Publicaciones recientes | PubMed/Scholar | Semanal |

#### Sugerencias de Acción
- [ ] Mejor momento para visitar (basado en histórico)
- [ ] Productos a promocionar según perfil
- [ ] Argumentos personalizados por especialidad
- [ ] Estudios clínicos relevantes para compartir

### Ejemplo de Briefing

```
📋 BRIEFING PRE-VISITA
━━━━━━━━━━━━━━━━━━━━━

👤 Dr. Juan García Hernández
🏥 Cardiólogo | Hospital Ángeles Pedregal
⭐ Potencial: A (Alto)

📊 HISTORIAL
• Última visita: 15 Ene (hace 22 días)
• Total visitas 2026: 3
• Tendencia: ↑ Receptivo

💊 MUESTRAS (Enero)
• Losartán 50mg: 4 entregadas (quedan 2)
• Amlodipino: 0 entregadas (disponibles 6)

⚠️ ALERTAS
• Próximo a límite mensual de Losartán
• Publicó artículo sobre HTA resistente (ver adjunto)

💡 SUGERENCIAS
• Llevar estudio COMBINE-2024 (combina ARAII + BCC)
• Mencionar caso de éxito Dr. Pérez

📎 MATERIAL ADJUNTO
• Estudio_COMBINE_2024.pdf
• Articulo_DrGarcia_HTA.pdf
```

---

## 3.5 Agente de Alertas

**Función:** Detección proactiva de oportunidades y riesgos

### Capacidades

#### Análisis de Sentimiento
- [ ] Detectar cambio en tono de interacciones
- [ ] Identificar frustración o desinterés en notas
- [ ] Alertar cuando HCP pasa de positivo a neutral/negativo

#### Alertas de Oportunidad
- [ ] HCPs con alta actividad que no hemos visitado
- [ ] Médicos que solicitaron información pendiente
- [ ] Oportunidades de venta cruzada detectadas
- [ ] Eventos/congresos donde estará el HCP

#### Alertas de Riesgo
- [ ] HCPs sin visita por más de X días (configurable)
- [ ] Caída en frecuencia de interacciones
- [ ] Objetivos mensuales en riesgo
- [ ] Competidor ganando terreno (si hay datos)

#### Alertas Externas
- [ ] Cambio de hospital del HCP
- [ ] Nueva publicación científica del HCP
- [ ] Noticias del hospital/institución
- [ ] Cambios regulatorios que afectan al territorio

### Tipos de Alertas

| Prioridad | Tipo | Ejemplo | Canal |
|-----------|------|---------|-------|
| 🔴 Crítica | Compliance | "Límite de muestras alcanzado" | WhatsApp inmediato |
| 🟠 Alta | Riesgo | "Dr. X sin visita hace 45 días" | WhatsApp diario |
| 🟡 Media | Oportunidad | "Dr. Y publicó sobre tu producto" | Resumen semanal |
| 🟢 Info | Contexto | "Congreso de cardio próxima semana" | Dashboard |

---

# 4. LAS 5 EXPERIENCIAS ADAPTATIVAS

Las experiencias no son "módulos" sino **contextos que se adaptan** al usuario, momento y situación.

---

## 4.1 Experiencia: MI DÍA

**Usuario:** Representante de campo
**Interfaz principal:** WhatsApp (90%) + App móvil (10%)

### Funcionalidades WhatsApp

#### Agenda del Día
- [ ] Recibir agenda matutina automática a las 7:00 AM
- [ ] Lista de visitas programadas con prioridad
- [ ] Ruta optimizada entre visitas
- [ ] Alertas de HCPs no visitados recientemente en la zona

#### Registro de Actividad
- [ ] Registro por nota de voz (transcripción automática)
- [ ] Registro por texto informal
- [ ] Check-in/check-out por ubicación
- [ ] Confirmación de acciones tomadas

#### Consultas Rápidas
- [ ] "¿Cuántas muestras le he dejado a [médico]?"
- [ ] "¿Cuándo fue mi última visita a [hospital]?"
- [ ] "¿Qué tengo pendiente para hoy?"

### Funcionalidades App Móvil (Opcional)

#### Modo Offline Completo
- [ ] Base de datos de HCPs del territorio
- [ ] Catálogo de productos con fichas
- [ ] Inventario de muestras actual
- [ ] Cola de registros pendientes de sincronizar

#### Visualización
- [ ] Mapa con ubicaciones de HCPs
- [ ] Timeline de actividad del día
- [ ] KPIs personales (visitas vs objetivo)

---

## 4.2 Experiencia: MIS CLIENTES

**Usuario:** Representante de campo
**Interfaz:** WhatsApp (consultas) + App/Web (exploración)

### Vista 360° del HCP

#### Perfil Básico
- [ ] Datos de contacto completos
- [ ] Foto (si disponible)
- [ ] Especialidad y subespecialidades
- [ ] Instituciones donde ejerce
- [ ] Horarios de atención preferidos

#### Historial de Interacciones
- [ ] Timeline cronológico de todas las visitas
- [ ] Notas y compromisos de cada interacción
- [ ] Muestras entregadas (producto, cantidad, fecha)
- [ ] Material compartido
- [ ] Emails enviados y respuestas

#### Inteligencia con IA
- [ ] Scoring de potencial (A/B/C/D)
- [ ] Propensión a prescribir
- [ ] Análisis de sentimiento acumulado
- [ ] Predicción de mejor momento de contacto
- [ ] Productos recomendados para promocionar

#### Acciones Sugeridas
- [ ] Próximo mejor paso (Next Best Action)
- [ ] Material relevante para compartir
- [ ] Objeciones comunes y respuestas sugeridas
- [ ] Médicos similares con éxito para benchmark

---

## 4.3 Experiencia: MI EQUIPO

**Usuario:** Gerente / Supervisor de distrito
**Interfaz:** Dashboard web adaptativo + WhatsApp (alertas)

### Dashboard Gerencial (Generative UI)

El dashboard no es fijo. Se adapta a:
- Hora del día (mañana: actividad en curso, tarde: resumen)
- Día de la semana (lunes: semana anterior, viernes: proyección)
- Alertas activas (prioriza lo urgente)
- Preguntas frecuentes del gerente

#### KPIs en Tiempo Real
- [ ] Visitas realizadas hoy vs. programadas
- [ ] Cobertura de territorio (% HCPs visitados)
- [ ] Inventario de muestras por rep
- [ ] Cumplimiento de objetivos MTD

#### Sistema de Alertas
- [ ] Rep sin actividad en X horas
- [ ] Seguimientos vencidos
- [ ] Metas en riesgo
- [ ] Anomalías en patrones de actividad

#### Drill-Down por Representante
- [ ] Detalle de actividad individual
- [ ] Comparativo vs. promedio del equipo
- [ ] Fortalezas y áreas de mejora (IA)
- [ ] Historial de cumplimiento

### Coaching Automático

- [ ] Identificación de gaps de desempeño
- [ ] Sugerencias de formación personalizadas
- [ ] Comparativo con mejores performers
- [ ] Alertas de necesidad de acompañamiento

### Consultas en Lenguaje Natural

```
Gerente: "¿Quién no ha visitado a sus médicos A esta semana?"

APEX: 📊 Representantes con HCPs categoría A sin visitar:

      • María López: 3 de 8 HCPs A sin visitar
        - Dr. García (25 días)
        - Dr. Fernández (18 días)
        - Dra. Ruiz (15 días)

      • Carlos Sánchez: 2 de 6 HCPs A sin visitar
        - Dr. Morales (20 días)
        - Dr. Jiménez (12 días)

      [Ver detalles] [Enviar recordatorio] [Programar reunión]
```

---

## 4.4 Experiencia: INTELIGENCIA COMERCIAL

**Usuario:** Marketing / Dirección Comercial / Analistas
**Interfaz:** Dashboard web + Reportes automatizados

### Business Intelligence

#### Dashboards Predefinidos
- [ ] Ventas por producto, territorio, rep
- [ ] Cobertura y frecuencia de visitas
- [ ] Efectividad de campañas y materiales
- [ ] ROI de la fuerza de ventas

#### Consultas Conversacionales
- [ ] Preguntas en español natural
- [ ] Generación de vistas dinámicas según pregunta
- [ ] Exportación a Excel/PDF con un clic

### Analytics Predictivo

#### Segmentación Dinámica
- [ ] Clusters de HCPs actualizados automáticamente
- [ ] Micro-segmentos para campañas específicas
- [ ] Identificación de perfiles de éxito

#### Predicciones
- [ ] Demanda por producto/territorio
- [ ] Probabilidad de prescripción por HCP
- [ ] Riesgo de pérdida de médicos clave
- [ ] Efectividad esperada de campañas

### Integración de Datos Externos

- [ ] IQVIA: Datos de mercado y prescripción
- [ ] Close-Up: Auditoría de prescripciones
- [ ] Fuentes públicas: Noticias, publicaciones

---

## 4.5 Experiencia: CONFIGURACIÓN

**Usuario:** Administrador del sistema / IT
**Interfaz:** Panel de administración web

### Gestión de Usuarios

- [ ] Alta/baja de usuarios
- [ ] Asignación de roles y permisos
- [ ] Configuración de territorios
- [ ] Jerarquías organizacionales

### Catálogos

- [ ] Productos (nombre, presentación, código)
- [ ] Territorios y zonas geográficas
- [ ] Instituciones (hospitales, clínicas, farmacias)
- [ ] Especialidades médicas
- [ ] Tipos de visita y actividades

### Reglas de Compliance

- [ ] Límites de muestras por regulación
- [ ] Frecuencias de visita
- [ ] Material promocional aprobado
- [ ] Excepciones y aprobaciones

### Integraciones

- [ ] Configuración de ERPs conectados
- [ ] APIs de terceros
- [ ] WhatsApp Business API
- [ ] Sincronización de datos

### Auditoría

- [ ] Logs de actividad completos
- [ ] Reportes de compliance
- [ ] Exportación para auditorías externas

---

# 5. GENERATIVE UI (DASHBOARD ADAPTATIVO)

## 5.1 Concepto

El dashboard no muestra siempre la misma información. Se **construye dinámicamente** según:

- **Rol del usuario:** Rep, gerente, director, marketing
- **Momento del día:** Mañana (planificación), tarde (ejecución), noche (resumen)
- **Contexto actual:** Alertas activas, proximidad a cierre de mes
- **Historial de uso:** Qué consulta más frecuentemente este usuario

## 5.2 Principios de Diseño

### Contextualidad Total
El sistema reconoce si la necesidad actual es:
- Planificación (mostrar agenda, rutas)
- Ejecución (mostrar HCP actual, inventario)
- Análisis (mostrar KPIs, comparativos)
- Emergencia (mostrar alerta prioritaria)

### Reducción de Carga Cognitiva
- Solo mostrar información relevante para el siguiente paso
- Ocultar opciones que no aplican al contexto
- Priorizar acciones sobre información

### Navegación en Lenguaje Natural
- Barra de búsqueda como interfaz principal
- Preguntas → Vistas dinámicas
- Sin necesidad de navegar menús complejos

## 5.3 Ejemplos de Adaptación

| Contexto | Dashboard Muestra |
|----------|-------------------|
| Lunes 8:00 AM | Resumen semana anterior + agenda de hoy |
| Rep cerca de HCP | Briefing de ese HCP específico |
| Último día del mes | Objetivos vs. actual + HCPs pendientes |
| Alerta de compliance | Panel de compliance primero |
| Gerente en reunión | KPIs consolidados del equipo |

---

# 6. MOTOR DE COMPLIANCE FARMACÉUTICO

## 6.1 Regulaciones Soportadas

### México
- [ ] NOM-059-SSA1: Control de muestras médicas
- [ ] NOM-072-SSA1: Material promocional
- [ ] COFEPRIS: Trazabilidad y firma digital

### Estados Unidos
- [ ] FDA 21 CFR Part 11: Registros electrónicos
- [ ] Sunshine Act: Reportes de transparencia
- [ ] PhRMA Code: Límites de interacciones

### Europa
- [ ] GDPR: Protección de datos de HCPs
- [ ] EFPIA Code: Ética en promoción

### Internacional
- [ ] IFPMA Code: Estándares globales
- [ ] Códigos locales: AMIIF (México), FARMAINDUSTRIA (España)

## 6.2 Funcionalidades de Compliance

### Prevención (Antes de la acción)
- [ ] Validación de límites antes de entrega
- [ ] Bloqueo de acciones no permitidas
- [ ] Alertas de aproximación a límites

### Registro (Durante la acción)
- [ ] Firma electrónica de recepción
- [ ] Timestamps inmutables
- [ ] Geolocalización verificable
- [ ] Fotos de evidencia (opcional)

### Auditoría (Después de la acción)
- [ ] Audit trail completo
- [ ] Reportes de transparencia automáticos
- [ ] Exportación para auditorías
- [ ] Alertas de anomalías

---

# 7. INTEGRACIONES

## 7.1 WhatsApp Business API

### Requisitos
- [ ] Cuenta de WhatsApp Business verificada
- [ ] Número dedicado para APEX
- [ ] Plantillas de mensaje aprobadas por Meta
- [ ] Webhook configurado

### Funcionalidades
- [ ] Mensajes de texto bidireccionales
- [ ] Notas de voz (envío y recepción)
- [ ] Imágenes y documentos
- [ ] Botones de acción (WhatsApp Flows)
- [ ] Ubicación compartida

## 7.2 ERPs

### Conectores Disponibles
- [ ] SAP Business One / S/4HANA
- [ ] Microsoft Dynamics 365
- [ ] Odoo
- [ ] Sage

### Datos Sincronizados
- [ ] Productos y catálogos
- [ ] Inventario de muestras
- [ ] Pedidos y facturación
- [ ] Clientes y proveedores

## 7.3 Datos de Mercado

### Proveedores Soportados
- [ ] IQVIA
- [ ] Close-Up International
- [ ] Veeva Data Cloud

### Datos Integrados
- [ ] Prescripciones por HCP
- [ ] Participación de mercado
- [ ] Tendencias de mercado

## 7.4 Comunicación

### Microsoft 365
- [ ] Outlook (calendario, email)
- [ ] Teams (notificaciones)
- [ ] SharePoint (documentos)

### Google Workspace
- [ ] Gmail y Calendar
- [ ] Google Drive

---

# 8. SEGURIDAD Y GOBERNANZA DE IA

## 8.1 Seguridad de Datos

### Autenticación
- [ ] Multi-factor authentication (MFA)
- [ ] Single Sign-On (SSO)
- [ ] Gestión de sesiones

### Cifrado
- [ ] Datos en tránsito: TLS 1.3
- [ ] Datos en reposo: AES-256
- [ ] WhatsApp: End-to-end encryption

### Control de Acceso
- [ ] RBAC (Role-Based Access Control)
- [ ] Permisos granulares por territorio
- [ ] Auditoría de accesos

## 8.2 Gobernanza de IA

### Transparencia
- [ ] Explicaciones de por qué la IA sugiere algo
- [ ] Trazabilidad de decisiones automatizadas
- [ ] Logs de acciones de agentes

### Supervisión Humana
- [ ] Configuración de qué acciones requieren aprobación
- [ ] Revisión de acciones autónomas
- [ ] Override manual siempre disponible

### Privacidad
- [ ] Datos no compartidos con terceros
- [ ] Modelos entrenados localmente (opción)
- [ ] Cumplimiento GDPR

---

# 9. SERVICIOS PROFESIONALES

## 9.1 Implementación (6 semanas)

| Semana | Fase | Entregables |
|--------|------|-------------|
| 1 | Discovery | Mapeo de procesos, reglas de compliance, catálogos |
| 2 | Configuración | Sistema configurado, WhatsApp API activa |
| 3 | Migración | Datos de HCPs, históricos, inventarios |
| 4 | Entrenamiento IA | Agentes calibrados con vocabulario del cliente |
| 5 | Capacitación | Training por rol completado |
| 6 | Go-Live | Sistema en producción, soporte intensivo |

## 9.2 Capacitación

### Por Rol
- [ ] Representantes: WhatsApp, voz, flujos básicos (2 horas)
- [ ] Gerentes: Dashboard, alertas, coaching (3 horas)
- [ ] Administradores: Configuración, compliance (4 horas)

### Materiales
- [ ] Videos tutoriales por funcionalidad
- [ ] Guías rápidas descargables
- [ ] Sandbox de práctica

## 9.3 Soporte

### Niveles

| Plan | Canales | Horario | SLA |
|------|---------|---------|-----|
| Esencial | Email | L-V 9-18 | 24h |
| Profesional | Email + WhatsApp + Tel | L-V 8-20 | 8h |
| Enterprise | Dedicado | 24/7 | 2h |

### Incluido
- [ ] Actualizaciones de plataforma
- [ ] Nuevas funcionalidades
- [ ] Adaptación a cambios regulatorios
- [ ] Reentrenamiento de modelos IA

---

# ANEXOS

## A. Glosario

| Término | Definición |
|---------|------------|
| HCP | Healthcare Professional (Profesional de Salud) |
| Agente IA | Componente autónomo que ejecuta tareas específicas |
| Generative UI | Interfaz que se construye dinámicamente según contexto |
| NER | Named Entity Recognition (extracción de entidades) |
| WhatsApp-First | Diseño donde WhatsApp es la interfaz principal |

## B. Requisitos Técnicos Mínimos

### Para Representantes
- Smartphone con WhatsApp instalado
- Conexión a internet (3G mínimo)
- Opcional: App móvil APEX (iOS 14+ / Android 10+)

### Para Gerentes/Admin
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet estable

### Para Integraciones
- Acceso a APIs de sistemas a integrar
- VPN si es requerido por políticas de seguridad

---

*© 2026 APEX - Prisma. Todos los derechos reservados.*

> *"No cambies cómo trabaja tu equipo. Haz que el sistema trabaje como ellos."*
