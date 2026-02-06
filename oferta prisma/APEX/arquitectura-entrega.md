# APEX — Arquitectura de Entrega

> **Documento Interno** — Estructura de producto, focos y modelo de negocio
> Para uso de Prisma Consul(ing) — No compartir con clientes

Versión 2.0 — Febrero 2026

---

## Índice

1. [Principios Fundacionales](#1-principios-fundacionales)
2. [Nivel 1: Fundación (1.000€)](#2-nivel-1-fundación-1000)
3. [Nivel 2: Los 10 Focos](#3-nivel-2-los-10-focos)
4. [Nivel 3: Potencialidades](#4-nivel-3-potencialidades)
5. [Modelo de Suscripción Token-Gated](#5-modelo-de-suscripción-token-gated)
6. [Análisis de Costes Reales](#6-análisis-de-costes-reales)
7. [Matriz de Sinergias](#7-matriz-de-sinergias)
8. [APEX vs Prisma Consul(ing)](#8-apex-vs-prisma-consulting)

---

## 1. PRINCIPIOS FUNDACIONALES

Estos dos principios son transversales a TODO el sistema. No son features, son la filosofía:

### Principio 1: IA Desde el Principio

La IA no es un añadido premium. Está integrada en cada capa del sistema desde el día 1. Todos los planes acceden a todas las capacidades de IA — lo que varía es cuánto pueden consumir (tokens).

### Principio 2: Flexibilidad Total

El sistema se adapta al cliente, no al revés. La flexibilidad opera en dos momentos distintos:

| Momento | Quién | Qué |
|---------|-------|-----|
| **En CREACIÓN** | Prisma Consul(ing) | Configura el sistema exactamente como el cliente lo necesita. Flexibilidad total dentro del alcance contratado. |
| **En USO** | El cliente | Interactúa con un lienzo IA que genera componentes visuales bajo demanda, ejecuta procesos por petición, y permite configurar campos/flujos consumiendo tokens de IA. |

---

## 2. NIVEL 1: FUNDACIÓN (1.000€)

La Fundación tiene 3 capas: Infraestructura (7 componentes), Motor de IA (horizontal), y Motor de Flexibilidad (horizontal).

### Capa A: Infraestructura (7 Componentes)

#### F1. Sistema de Usuarios y Autenticación
- Login seguro (email + contraseña)
- Hasta 25 usuarios activos
- Perfil básico de usuario (nombre, email, teléfono, foto)
- Recuperación de contraseña

#### F2. Estructura de Roles y Permisos (3 roles + Admin)
- 3 roles configurados según el cliente + Admin siempre incluido
- Permisos por rol: qué pantallas ve, qué acciones puede ejecutar
- Pantalla de inicio diferenciada por rol
- Log básico de acceso (quién entró, cuándo)
- Los roles se eligen entre: Rep, Supervisor, Director, Comercial, Médico/Cliente

#### F3. Base de Datos de Contactos/Entidades
- Modelo de datos flexible con 3 tipos de entidad configurables (ej: Médicos, Clientes, Proveedores)
- Campos estándar por entidad: nombre, teléfono, email, dirección, categoría, notas
- Hasta 5 campos personalizados por tipo de entidad
- Búsqueda y filtrado básico
- Detección de duplicados básica
- Importación desde Excel/CSV (una migración inicial incluida)

#### F4. Registro de Actividad (Motor de Eventos)
- Estructura genérica de evento: quién, con quién, cuándo, tipo, notas
- Tipos de evento configurables según los focos del cliente
- Timeline por contacto y por usuario

#### F5. Interfaz Dual (Estructurada + Lienzo IA)

**Interfaz Estructurada (siempre disponible, sin consumo de tokens):**
- Fichas de contacto, listados, registros
- Formularios de entrada de datos
- Navegación por menús y secciones

**Lienzo IA (disponible para todos, consume tokens):**
- Pantalla de inicio conversacional tipo canvas
- La IA es PROACTIVA: al iniciar el día, presenta las acciones pendientes, tarjetas de clientes a llamar, propuestas de valor, contexto relevante
- El usuario puede pedir componentes: "muéstrame la actividad de María esta semana" → la IA genera la visualización
- Los componentes generados pueden: fijarse en el dashboard personal, descargarse, o consumirse y descartarse

**Características técnicas:**
- Aplicación web responsive (PC y tablet)
- Versión móvil optimizada (PWA)
- Modo offline básico para registros de campo
- Identidad visual del cliente (logo, colores, nombre)

#### F6. Motor de Notificaciones Básico
- Notificaciones in-app + push móvil básicas
- Hasta 5 reglas de notificación configurables
- Centro de notificaciones por usuario

#### F7. Dashboard y Reportes Base
- 1 espacio de dashboard personalizable por rol (donde se fijan componentes del lienzo)
- 3 reportes estándar configurados según los focos
- Exportación a Excel/PDF

---

### Capa B: Motor de IA (Horizontal)

El Motor de IA está disponible para TODOS los componentes y TODOS los planes. Es la capa que hace funcionar el lienzo, los resúmenes, las predicciones, los agentes, y la entrada por voz. Lo que varía entre planes es el consumo de tokens.

| Capacidad | Qué hace | Ejemplo |
|-----------|----------|---------|
| **Resúmenes** | Resume actividad, datos, tendencias en lenguaje natural | "Hoy tu equipo hizo 23 visitas, 3 menos que ayer" |
| **IA Proactiva** | Anticipa necesidades y prepara información al iniciar sesión | "Buenos días. Hoy tienes 3 llamadas pendientes. Aquí está la ficha del Dr. García" |
| **Dictado por voz** | El usuario dicta y la IA estructura los datos | Rep dicta visita → la IA completa los campos |
| **GenUI** | Genera componentes visuales bajo demanda en el lienzo | "Muéstrame un gráfico de ventas por territorio" → lo genera |
| **Detección de anomalías** | Identifica patrones inusuales o alertas | "María no ha registrado actividad en 3 días" |
| **Predicciones/Scoring** | Predice resultados y prioriza | "Esta oportunidad tiene 75% de probabilidad de cerrar" |
| **Agentes autónomos** | Ejecutan acciones sin intervención del usuario | Envía recordatorio de cobranza automáticamente a las 9:00 AM |
| **Configuración por IA** | El usuario pide cambios al sistema vía lenguaje natural | "Añade un campo 'Fecha de último pedido' a la ficha del cliente" |

---

### Capa C: Motor de Flexibilidad (Horizontal)

**En CREACIÓN (responsabilidad de Prisma Consul(ing)):**
- Configuración completa del sistema según necesidades del cliente
- 3 tipos de entidad, campos personalizados, flujos, reglas
- Los primeros 6 meses: Prisma Consul(ing) gestiona cambios de configuración sin costo adicional

**En USO (responsabilidad del cliente, consume tokens):**
- Modificar campos existentes de entidades → consume tokens de IA
- Crear nuevos tipos de entidad o módulos → consume tokens, con advertencia de margen de error
- Configurar nuevas reglas de notificación → consume tokens
- Ajustar flujos de trabajo → consume tokens

---

## 3. NIVEL 2: LOS 10 FOCOS

El cliente describe sus dolores con sus palabras. Prisma mapea esos dolores a los 10 focos predefinidos. El cliente elige 4 focos para el alcance inicial (1,500€ = ~375€ por foco).

**IMPORTANTE:** En TODOS los focos, la IA está integrada desde el alcance inicial gracias al Motor de IA de la Fundación.

---

### Foco 1: Visibilidad de Equipo de Campo
**Dolor:** "No sé qué hacen mis reps cada día"

**Alcance Inicial:**
- Registro de visitas desde móvil (tipo, médico, notas, resultado)
- Dictado por voz (el rep dicta → la IA estructura)
- Registro de visitas fallidas
- Vista de supervisor: actividad del día por rep
- Agenda diaria del rep con visitas programadas
- La IA resume el día, detecta inactividad, sugiere prioridades

**Pains resueltos:** A01, A04, A07, A10, A11, A12

**Potencialidades:** Geolocalización (A02, A03, A08) · Tiempo en visita (A05) · Rutas optimizadas (A14) · Análisis de patrón vs potencial (A06) · Kit onboarding (A13) · Scoring de productividad

---

### Foco 2: Gestión de Contactos y Médicos
**Dolor:** "Los datos están en 20 Excels diferentes"

**Alcance Inicial:**
- Ficha completa del contacto (datos, especialidad, horarios, consultorio)
- Categorización A-B-C
- Timeline completo de interacciones
- Asignación por territorio/rep con proceso de transferencia
- La IA detecta inactivos, sugiere seguimiento, identifica duplicados

**Pains resueltos:** B01, B02, B03, B04, B06, B09, B12, I11

**Potencialidades:** Segmentación por prescripción (B13) · Preferencias detalladas (B10) · Cobertura por especialidad (B05) · Autoactualización por médico · Competencia (B15) · Múltiples ubicaciones (B14)

---

### Foco 3: Control de Muestras
**Dolor:** "Las muestras son un desastre"

**Alcance Inicial:**
- Inventario por rep (qué tiene en maletín)
- Registro de entrega: muestra, médico, cantidad, lote, fecha
- Inventario de almacén central
- Solicitud de muestras desde la app
- La IA alerta stock bajo, detecta consumos anómalos, sugiere reabastecimiento

**Pains resueltos:** C01, C02, C04, C08, C13, C14

**Potencialidades:** Trazabilidad completa por lote (C03, L01, L02) · Límites automáticos (C07) · Control caducidad (C06) · Costo por muestra (C09) · Reporte regulatorio (C11, L03) · Predicción de consumo

---

### Foco 4: Pipeline de Ventas
**Dolor:** "No sé en qué va cada negociación"

**Alcance Inicial:**
- Pipeline visual (kanban) con etapas configurables
- Ficha de oportunidad: cliente, producto, monto, fecha, notas
- Cotizaciones vinculadas
- Catálogo de precios accesible
- La IA alerta oportunidades estancadas, sugiere siguiente acción, prioriza por probabilidad

**Pains resueltos:** D01, D02, D03, D05, D08, D10, D13

**Potencialidades:** Scoring predictivo (D09) · Forecast automático (D04, D12) · Plantillas de cotización (D06) · Aprobación de descuentos (D07, D14) · Motivos de pérdida (D11) · Ticket promedio (D15)

---

### Foco 5: Cobranza Inteligente
**Dolor:** "Hay facturas vencidas que nadie cobra"

**Alcance Inicial:**
- Vista consolidada de cuentas por cobrar
- Antigüedad de cartera automática
- Registro de promesas de pago con seguimiento
- Alerta al vendedor cuando visita cliente moroso
- La IA prioriza cobranza por impacto, predice riesgo de impago

**Pains resueltos:** E01, E02, E07, E08, E10

**Potencialidades:** Proceso escalonado automático (E06) · Recordatorios automáticos (E03) · Clasificación de pagadores (E04) · Impacto en flujo de caja (E09) · Reportes automáticos (E11) · Días promedio de pago (E12)

---

### Foco 6: Comunicación y Aprobaciones
**Dolor:** "Todo se decide por WhatsApp y se pierde"

**Alcance Inicial:**
- Canal oficial de comunicaciones en la app
- Flujo de solicitud → aprobación configurable
- Objetivos del mes visibles por rep
- Historial de comunicaciones y decisiones
- La IA resume decisiones semanales, detecta cuellos de botella en aprobaciones

**Pains resueltos:** H01, H02, H04, H07, D07, D14

**Potencialidades:** Coaching estructurado (H03, H05) · Visibilidad cruzada (H08) · Ruptura de silos (H09) · Aprobaciones multinivel · Reuniones digitales con seguimiento (H06)

---

### Foco 7: Portal Médico/Cliente
**Dolor:** "Los médicos no pueden contactarnos ni pedirnos nada"

**Alcance Inicial:**
- Portal web con login para médico/cliente
- Ficha personal autoactualizable
- Solicitud de muestras desde el portal
- Catálogo digital consultable
- La IA sugiere reabastecimiento, muestra novedades relevantes

**Pains resueltos:** I01, I02, I04, I11, J06

**Potencialidades:** Material científico personalizado (I05, J07) · Envío post-visita (J03) · Comunicación personalizada (I10) · Fidelización (I09) · Recordatorios proactivos (I12) · Satisfacción (I07) · Novedades (I08)

---

### Foco 8: Marketing y Promoción
**Dolor:** "No sé qué material funciona ni qué promover con quién"

**Alcance Inicial:**
- Biblioteca digital de material promocional
- Registro de uso de material por visita
- Envío de material digital post-visita
- Catálogo de productos con fichas
- La IA recomienda material según especialidad, producto y perfil del médico

**Pains resueltos:** J01, J02, J03, J06, J08

**Potencialidades:** Impacto en ventas (J04) · Input de campo (J05) · Presentaciones personalizadas (J07) · A/B testing · Tracking de apertura · Integración email marketing

---

### Foco 9: Planificación Estratégica
**Dolor:** "Las cuotas se asignan sin datos"

**Alcance Inicial:**
- Objetivos por rep/territorio/producto
- Mapa de territorios con asignaciones
- Costo por visita básico
- Comparativa entre territorios
- La IA detecta desequilibrios, sugiere redistribución, proyecta tendencias

**Pains resueltos:** K02, K04, K06, K08, K10

**Potencialidades:** Plan de visitas inteligente (K01) · Simulador de escenarios (K03) · Planificación automatizada (K05) · Cobertura por segmento (K07) · Priorización por valor (K09) · Comisiones automáticas (M06) · Métricas de desempeño (M02)

---

### Foco 10: Compliance y Regulatorio
**Dolor:** "Si viene una auditoría, no tengo nada"

**Alcance Inicial:**
- Log completo de auditoría (quién hizo qué, cuándo, sobre qué)
- Trazabilidad básica de muestras (entrega → médico → lote)
- Políticas de visita documentadas en la app
- Permisos granulares de acceso
- La IA verifica completitud de registros, alerta incumplimientos

**Pains resueltos:** L01, L04, L06, L08

**Potencialidades:** Trazabilidad completa (L02) · Reportes regulatorios (L03, L05) · RGPD/LOPD (L07) · Auditoría automatizada · Alertas preventivas de incumplimiento

---

## 4. NIVEL 3: POTENCIALIDADES

Cuando el cliente quiere crecer más allá del alcance inicial:

### Tier 1: Extensiones Rápidas (500-1.000€)
- Reportes y dashboards adicionales
- Campos personalizados extra
- Reglas de notificación adicionales
- Experiencias de rol adicionales (4to o 5to rol)
- Flujos de aprobación extra
- Plantillas de cotización

### Tier 2: Módulos Medianos (1.000-2.500€)
- Geolocalización y verificación de presencia
- Portal completo para médicos/clientes
- Cobranza escalonada automatizada
- Simulador de escenarios y planificación avanzada
- Programa de fidelización
- Gestión de eventos con registro y seguimiento

### Tier 3: Integraciones Complejas (2.500-5.000€)
- Integración bidireccional con ERP
- Integración con facturación/contabilidad
- IA predictiva avanzada (forecast, churn)
- Compliance RGPD completo
- API pública para terceros

### Tier 4: Transformación (5.000€+)
- App nativa App Store / Google Play
- CRM invisible por voz completo
- Integración omnicanal (email, WhatsApp, teléfono, chat)
- Business Intelligence avanzado
- Multi-empresa / multi-país

---

## 5. MODELO DE SUSCRIPCIÓN TOKEN-GATED

### Cambio Fundamental

**ANTES (feature-gated):** Básico sin voz, sin predicciones. Profesional con scoring. Avanzado con todo.

**AHORA (token-gated):** TODAS las funciones disponibles en TODOS los planes. Lo que varía es el consumo.

### Definición de "Interacción IA"

Cualquier petición que involucre procesamiento de IA: una consulta al lienzo, un dictado procesado, un resumen generado, una predicción, una acción de agente, una configuración por IA.

### Planes de Suscripción

| Capacidad | BÁSICO (20€/persona/mes) | PROFESIONAL (30€/persona/mes) | AVANZADO (45€/persona/mes) |
|-----------|--------------------------|-------------------------------|----------------------------|
| Interacciones IA / día | 30 | 100 | Ilimitadas* |
| Dictados por voz / día | 10 | 30 | Ilimitados* |
| Agentes autónomos activos | 2 | 5 | 15 |
| Reportes IA generados / mes | 5 | 20 | Ilimitados* |
| Configuración por IA / mes | 3 cambios | 10 cambios | 30 cambios |
| Interfaz estructurada | ✓ Completa | ✓ Completa | ✓ Completa |
| Lienzo IA | ✓ Completo | ✓ Completo | ✓ Completo |
| Todas las funciones IA | ✓ Disponibles | ✓ Disponibles | ✓ Disponibles |

*Ilimitadas = Fair use, sujeto a límites razonables (ej: 500 interacciones/día)

**Nota:** Las interacciones con la interfaz estructurada (ver fichas, listas, formularios, navegación) NO consumen interacciones IA.

---

## 6. ANÁLISIS DE COSTES REALES

### Speech-to-Text (Dictado por voz)

| Proveedor | Coste por minuto |
|-----------|-----------------|
| OpenAI Whisper API | $0.006/min |
| Google Cloud STT | $0.016-0.024/min |
| Deepgram | ~$0.0043/min |

**Desglose del dictado:**
1. Audio → Texto (STT): ~$0.006/min. NO consume tokens LLM.
2. Texto → Datos estructurados (LLM): ~500-1.000 tokens por dictado.

### LLM (Comprensión, GenUI, Resúmenes)

| Modelo | Input/MTok | Output/MTok | Uso en APEX |
|--------|-----------|-------------|-------------|
| GPT-4o mini | $0.15 | $0.60 | Tareas rutinarias (70-80%) |
| Claude Haiku | $1.00 | $5.00 | Comprensión de contexto |
| Claude Sonnet | $3.00 | $15.00 | Análisis complejos, agentes |

### Consumo Estimado por Tipo de Usuario

**REPRESENTANTE (más intensivo en volumen):**

| Acción | Frecuencia/día | Tokens | Coste |
|--------|---------------|--------|-------|
| IA proactiva matutina | 1 | ~2.000 | $0.0013 |
| Dictado de visitas (7) | 7 | ~5.600 | $0.0037 |
| Consultas al lienzo | 4 | ~6.000 | $0.0039 |
| Resumen de fin de día | 1 | ~1.500 | $0.0010 |
| **TOTAL DIARIO** | | **~15.100** | **~$0.01** |
| + STT (7 min) | | | **~$0.04** |
| **TOTAL REAL/DÍA** | | | **~$0.05** |
| **TOTAL REAL/MES** | | | **~$1.10** |

**SUPERVISOR:**
- ~24.000 tokens/día → ~$0.045/día → **~$1.00/mes**

**DIRECTOR:**
- ~19.500 tokens/día → ~$0.23/día → **~$5.00/mes**

### Márgenes

| Tipo de usuario | Coste real/mes | Precio APEX/mes | Margen |
|----------------|----------------|-----------------|--------|
| Representante | ~1€ | 20€ (Básico) | 95% |
| Supervisor | ~1€ | 20€ (Básico) | 95% |
| Director | ~5€ | 20€ (Básico) | 76% |

**Conclusión:** Los márgenes son muy saludables. El modelo token-gated es viable.

---

## 7. MATRIZ DE SINERGIAS

Combinaciones de focos que se potencian mutuamente:

| Foco A | Foco B | Sinergia |
|--------|--------|----------|
| Visibilidad Campo | Contactos | Visitas alimentan historial del médico |
| Visibilidad Campo | Muestras | Entrega de muestras en el flujo de visita |
| Pipeline Ventas | Cobranza | Vendedor ve facturas vencidas en la oportunidad |
| Contactos | Portal Médico | Ficha actualizada por ambos lados |
| Muestras | Compliance | Trazabilidad cubre regulatorio automáticamente |
| Marketing | Contactos | Material recomendado según segmentación |
| Comunicación | Cualquier otro | Aprobaciones transversales |

---

## 8. APEX vs PRISMA CONSUL(ING)

| | APEX | Prisma Consul(ing) |
|---|------|-------------------|
| **Qué es** | El producto/sistema/plataforma | La empresa consultora |
| **Qué hace** | Funciona, procesa, muestra datos | Configura, construye, da soporte |
| **Relación con cliente** | El cliente usa APEX | Prisma construye y mantiene |
| **Soporte 6 meses** | — | Prisma gestiona configuración sin costo |
| **Después de 6 meses** | Cliente configura vía IA (tokens) | Prisma disponible para cambios cotizados |

---

## ANEXO: Mapeo Formulario → Focos

Cuando el formulario de descubrimiento detecta dolores, se mapean así:

```
DOLOR DETECTADO → FOCO(S) RELACIONADO(S)
─────────────────────────────────────────
"No sé qué hacen mis reps" → Foco 1 (Visibilidad)
"Datos en Excel" → Foco 2 (Contactos)
"Muestras sin control" → Foco 3 (Muestras)
"No sé en qué va cada venta" → Foco 4 (Pipeline)
"Facturas sin cobrar" → Foco 5 (Cobranza)
"Todo por WhatsApp" → Foco 6 (Comunicación)
"Médicos no pueden pedir" → Foco 7 (Portal)
"No sé qué material usar" → Foco 8 (Marketing)
"Cuotas sin datos" → Foco 9 (Planificación)
"Auditoría me preocupa" → Foco 10 (Compliance)
```

El bot/formulario detecta pains → los mapea a focos → prioriza 4 → genera propuesta.

---

*Documento interno — Versión 2.0 — Febrero 2026*

*© 2026 APEX - Prisma Consul(ing). Uso interno.*
