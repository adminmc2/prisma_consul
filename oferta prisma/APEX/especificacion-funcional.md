# APEX — Especificación Funcional

> **A**utomatización de **P**rocesos y **EX**periencias
> **A**utomation of **P**rocesses and **EX**periences

## Sistema de Gestión Comercial para la Industria Farmacéutica

> Especificación completa: Experiencias, Campos, Flujos, IA y Componentes

Versión 2.3 — Febrero 2026

---

## Índice

1. [Arquitectura del Sistema](#1-arquitectura-del-sistema)
2. [Mapa de Perfiles de Usuario](#2-mapa-de-perfiles-de-usuario)
3. [Experiencia: Representante de Ventas](#3-experiencia-representante-de-ventas)
4. [Experiencia: Supervisor / Gerente](#4-experiencia-supervisor--gerente)
5. [Experiencia: Director / Dueño](#5-experiencia-director--dueño)
6. [Experiencia: Comercial / Ventas](#6-experiencia-comercial--ventas)
7. [Experiencia: Médico / HCP](#7-experiencia-médico--hcp)
8. [Experiencia: Administrador](#8-experiencia-administrador)
9. [Canal WhatsApp: Interfaz Principal](#9-canal-whatsapp-interfaz-principal)
10. [Capa de Inteligencia Artificial](#10-capa-de-inteligencia-artificial)
11. [Motor de Compliance](#11-motor-de-compliance)
12. [Componentes del Sistema](#12-componentes-del-sistema)
13. [Integraciones](#13-integraciones)

---

# 1. ARQUITECTURA DEL SISTEMA

El sistema está diseñado con una **arquitectura de interfaz dual** que combina acceso estructurado tradicional con un lienzo de IA proactiva.

## 1.1 Arquitectura de Interfaz Dual

Todos los usuarios tienen acceso a **dos formas de interactuar** con el sistema:

```
┌─────────────────────────────────────────────────────────────────┐
│           INTERFAZ ESTRUCTURADA (Siempre disponible)            │
│  ─────────────────────────────────────────────────────────────  │
│  • Fichas de cliente/médico                                     │
│  • Listados de pedidos y visitas                                │
│  • Registros y formularios                                      │
│  • Menús y navegación tradicional                               │
│                                                                 │
│  → Acceso directo a datos SIN necesidad de IA                   │
│  → El usuario PUEDE hacer todo sin tocar el lienzo IA           │
└─────────────────────────────────────────────────────────────────┘
                              +
┌─────────────────────────────────────────────────────────────────┐
│                    LIENZO IA (Proactivo)                        │
│  ─────────────────────────────────────────────────────────────  │
│  • Canvas interactivo tipo Adobe Firefly                        │
│  • IA PROACTIVA: prepara información antes de que la pidas      │
│  • Genera componentes visuales en tiempo real                   │
│  • Componentes fijables al escritorio personal                  │
│                                                                 │
│  → Consume tokens según plan de suscripción                     │
│  → Lo que diferencia a APEX de un CRM tradicional               │
└─────────────────────────────────────────────────────────────────┘
```

### Lo Diferenciador: IA Proactiva

A diferencia de los asistentes tradicionales que esperan instrucciones, el Lienzo IA de APEX **anticipa necesidades**:

| CRM Tradicional | APEX con Lienzo IA |
|-----------------|-------------------|
| "Busca el cliente Juan" | Al abrir: "Buenos días. Tienes llamada con Juan en 10 min. Aquí está su ficha, historial y propuesta de valor sugerida." |
| El usuario navega menús | La IA presenta tarjetas con acciones pendientes |
| Reportes predefinidos | La IA genera el reporte que necesitas cuando lo necesitas |
| Alertas genéricas | Alertas contextuales con sugerencia de acción |

### Ejemplo: Mañana de un Representante

```
┌─────────────────────────────────────────────────────────────────┐
│  LIENZO IA - 8:00 AM                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  "Buenos días, María. Hoy tienes 6 visitas programadas."        │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ 9:00 AM         │  │ 10:30 AM        │  │ 12:00 PM        │  │
│  │ Dr. García      │  │ Dra. López      │  │ Dr. Martínez    │  │
│  │ Cardiólogo      │  │ Internista      │  │ Pediatra        │  │
│  │                 │  │                 │  │                 │  │
│  │ ⚠️ 25 días sin  │  │ ✓ Le interesa   │  │ 🆕 Primera      │  │
│  │ visitar         │  │ estudio nuevo   │  │ visita          │  │
│  │                 │  │                 │  │                 │  │
│  │ [Ver briefing]  │  │ [Ver briefing]  │  │ [Ver briefing]  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                 │
│  💡 Sugerencia: El Dr. García preguntó por el estudio COMBINE.  │
│     ¿Lo llevo preparado? [Sí, adjuntar] [No]                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 1.2 Capas del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA 1: EXPERIENCIAS                     │
│  Escritorios personalizables por rol                        │
│  Rep • Supervisor • Director • Comercial • Médico • Admin   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               CAPA 2: INTELIGENCIA ARTIFICIAL               │
│  Proactiva + Reactiva, límites según consumo                │
│  Lienzo IA • GenUI • Voz • Predicciones • Agentes           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   CAPA 3: COMPONENTES                       │
│  Piezas técnicas que se combinan automáticamente            │
│  Contactos • Actividad • Inventario • Pipeline • Reportes   │
└─────────────────────────────────────────────────────────────┘
```

## 1.3 Principios de Diseño

| Principio | Descripción |
|-----------|-------------|
| **Interfaz Dual** | Acceso estructurado (sin IA) + Lienzo IA proactivo. El usuario elige cómo interactuar |
| **IA Proactiva** | La IA no espera instrucciones. Prepara briefings, sugiere acciones, anticipa necesidades |
| **GenUI (Generative UI)** | La interfaz se genera en tiempo real según el contexto y la intención del usuario |
| **Mobile-First** | El rep de campo usa móvil 95% del tiempo. El sistema está optimizado para eso |
| **WhatsApp-First** | El 90% del trabajo del rep puede hacerse desde WhatsApp sin abrir otra app |
| **Flujo Continuo** | Una acción real (visita) = un registro. No múltiples pantallas |
| **Offline-Ready** | El rep puede trabajar sin señal. Sincroniza cuando hay conexión |

## 1.4 Componentes del Lienzo IA

Los componentes generados por la IA pueden ser:

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **Efímeros** | Se consultan y desaparecen | "¿Cuántas visitas hice esta semana?" → número → desaparece |
| **Persistentes** | Se fijan en el escritorio personal | Gráfico de meta mensual fijado en la esquina superior |
| **Descargables** | Se exportan para compartir | Reporte PDF generado para enviar al director |

### Cómo se Fijan Componentes

```
Usuario: "Muéstrame las visitas de mi equipo esta semana"
    ↓
IA genera tabla con visitas por rep
    ↓
Usuario: [📌 Fijar] [📥 Descargar] [✓ OK]
    ↓
Si fija → Aparece en su escritorio personal
Si descarga → PDF/Excel
Si OK → Desaparece después de consultarlo
```

## 1.5 Consumo de Tokens

| Interacción | Consume Tokens |
|-------------|----------------|
| Acceder a interfaz estructurada (fichas, listas) | ❌ No |
| Lienzo IA: briefing matutino proactivo | ✅ Sí |
| Lienzo IA: preguntar algo | ✅ Sí |
| Lienzo IA: generar componente visual | ✅ Sí |
| Dictar nota de voz (transcripción) | ✅ Sí |
| Fijar componente en escritorio | ❌ No (ya se generó) |

**Nota:** En el futuro, cuando el sistema madure, algunas interacciones rutinarias del lienzo podrán ser gratuitas.

### Ejemplos de GenUI en Acción

La interfaz generativa adapta cada pantalla al contexto específico del usuario:

| Situación | Interfaz Generada |
|-----------|-------------------|
| Rep dice "registrar visita con Dr. García" | Sistema muestra formulario precargado con datos del Dr. García, historial reciente, productos que suele prescribir |
| Rep en zona de hospitales | Mapa muestra solo HCPs de esa zona, ordenados por última visita |
| Supervisor consulta equipo lunes 8am | Dashboard enfatiza métricas de semana anterior y pendientes |
| Director pregunta por forecast | Vista ejecutiva con proyección, no detalles operativos |

### Ejemplos de Modo Offline

El sistema permite trabajo completo sin conexión:

| Escenario | Comportamiento |
|-----------|----------------|
| 5 visitas en hospital rural sin señal | Todas las visitas se registran localmente, se sincronizan al salir a zona con cobertura |
| Rep en avión registra notas | Notas guardadas offline, cola de sincronización visible |
| Zona remota durante 3 días | Base de datos local funciona completa, sincronización automática al reconectar |
| Pérdida de señal durante visita | Registro continúa sin interrupción, timestamp y ubicación se preservan |

---

# 2. MAPA DE PERFILES DE USUARIO

El sistema reconoce diferentes tipos de usuarios, cada uno con necesidades distintas. La experiencia se adapta automáticamente según el perfil.

| PERFIL | ROL | GENERA | CONSUME | DISPOSITIVO |
|--------|-----|--------|---------|-------------|
| **Representante** | Ventas campo, MSL, KAM | Visitas, notas, muestras | Agenda, historial | Móvil 95% + WhatsApp |
| **Supervisor** | Gte. Distrito, Regional | Aprobaciones, coaching | KPIs equipo, alertas | Web + Móvil |
| **Director/Dueño** | Dir. Comercial, CEO | Decisiones estratégicas | Forecast, tendencias | Web + Email |
| **Comercial** | Ventas, Cobranza | Cotizaciones, cobros | Pipeline, cartera | Web + Móvil |
| **Médico (ext)** | HCP, Farmacia | Solicitudes, feedback | Muestras, material | App / Portal |
| **Administrador** | IT, Compliance | Configuración, reglas | Logs, auditoría | Web 100% |

---

# 3. EXPERIENCIA: REPRESENTANTE DE VENTAS

**Pregunta central:** *"¿Qué hago hoy y cómo registro lo que hice en menos de 60 segundos?"*

## 3.1 Pantalla de Inicio

Al abrir la app, el rep ve inmediatamente lo que necesita para su día. No hay menús que navegar.

### Elementos de la Pantalla

- [ ] Saludo personalizado con nombre y resumen del día
- [ ] Próximas 3 visitas programadas (con hora, médico, dirección)
- [ ] Alertas importantes (compromisos vencidos, metas en riesgo)
- [ ] Botón principal: "REGISTRAR ACTIVIDAD" (prominente, un toque)
- [ ] Barra de búsqueda con IA: "¿Qué quieres hacer?" (lenguaje natural)
- [ ] Indicador de inventario de muestras (stock disponible)

## 3.2 Flujo: Registrar Actividad (Visita)

Este es el flujo más importante del sistema. **Debe completarse en menos de 60 segundos.**

| PASO | ACCIÓN / PANTALLA |
|------|-------------------|
| 1 | **¿A QUIÉN?** Seleccionar médico. Búsqueda predictiva, detectar por geolocalización. |
| 2 | **¿QUÉ HICISTE?** Tipo: Visita presencial, Llamada, Email, WhatsApp, Evento. |
| 3 | **¿MUESTRAS?** (opcional) Seleccionar producto(s) y cantidad. Validación automática de límites. |
| 4 | **¿NOTAS?** Campo libre o DICTAR POR VOZ (IA transcribe y estructura). |
| 5 | **¿PRÓXIMO PASO?** IA sugiere próxima acción. Rep confirma o ajusta. Se agenda automáticamente. |
| ✓ | **GUARDAR** Un toque. Geolocalización y timestamp automáticos. Confirmación visual. |

## 3.3 Campos del Registro de Actividad

| CAMPO | TIPO | DESCRIPCIÓN | IA |
|-------|------|-------------|-----|
| ID Actividad | UUID | Generado automáticamente | — |
| Médico/Cliente | Relación | Obligatorio. Búsqueda predictiva. | Sugerencia |
| Tipo de Actividad | Enum | Visita \| Llamada \| Email \| WhatsApp \| Evento | — |
| Fecha y Hora | Datetime | Automático al guardar | — |
| Ubicación | Geo | Automático por GPS | Validación |
| Productos Promovidos | Multi-select | Catálogo de productos | Sugerencia |
| Muestras Entregadas | Array | Producto + cantidad. Valida límites. | Alerta |
| Notas | Texto largo | Libre o dictado por voz | Transcripción |
| Objeciones | Tags | Categorización de objeciones detectadas | Clasificación |
| Nivel de Interés | Enum | Alto \| Medio \| Bajo \| Ninguno | Sugerencia |
| Compromiso | Texto | Qué se acordó | Extracción |
| Próxima Acción | Tarea | Fecha + tipo + descripción | Sugerencia |
| Firma del Médico | Imagen | Requerida si entregó muestras (compliance) | — |

## 3.4 Campos del Médico/HCP

| CAMPO | TIPO | DESCRIPCIÓN | IA |
|-------|------|-------------|-----|
| Nombre Completo | Texto | Obligatorio | — |
| Cédula Profesional | Texto | Validación formato | Verificación |
| Especialidad | Catálogo | Lista predefinida | — |
| Institución Principal | Relación | Hospital/Clínica | — |
| Consultorio | Dirección | Dirección + coordenadas | Geocoding |
| Teléfono | Teléfono | Con código de país | — |
| Email | Email | Validación formato | — |
| WhatsApp | Teléfono | Puede ser diferente | — |
| Horarios Preferidos | Texto | Cuándo recibir visitas | — |
| Categoría | Enum | A \| B \| C \| D (potencial) | Scoring |
| Territorio | Catálogo | Zona/Ruta asignada | — |
| Rep Asignado | Relación | Usuario responsable | — |
| Frecuencia Objetivo | Número | Visitas por mes objetivo | Sugerencia |
| Consentimiento GDPR | Boolean | Aceptó política de privacidad | — |

## 3.5 Funcionalidades Móviles

### Modo Offline Completo
- [ ] Base de datos de HCPs del territorio
- [ ] Catálogo de productos con fichas
- [ ] Inventario de muestras actual
- [ ] Cola de registros pendientes de sincronizar
- [ ] Indicador de estado de sincronización

### Visualización
- [ ] Mapa con ubicaciones de HCPs
- [ ] Timeline de actividad del día
- [ ] KPIs personales (visitas vs objetivo)

---

# 4. EXPERIENCIA: SUPERVISOR / GERENTE

**Pregunta central:** *"¿Cómo va mi equipo y dónde necesito intervenir?"*

## 4.1 Pantalla de Inicio (Dashboard)

### Panel Superior: KPIs del Día
- [ ] Visitas realizadas hoy vs. objetivo del equipo (barra de progreso)
- [ ] Cobertura de territorio (% médicos visitados este mes)
- [ ] Metas del mes: avance por rep y total
- [ ] Alertas críticas (número con color según urgencia)

### Panel Central: Estado del Equipo (tiempo real)
- [ ] Lista de reps con: visitas hoy, % meta mes, última actividad, alertas
- [ ] Código de colores: verde (en meta), amarillo (riesgo), rojo (bajo rendimiento)
- [ ] Click en rep → ver detalle completo de su actividad

### Panel Inferior: Acciones Pendientes
- [ ] Aprobaciones pendientes (descuentos, gastos, solicitudes)
- [ ] Acompañamientos programados esta semana
- [ ] Escalaciones de reps que requieren atención

## 4.2 Acciones Disponibles

- [ ] **Ver detalle de rep:** Drill-down a todas las actividades, visitas, métricas
- [ ] **Aprobar solicitud:** Descuentos especiales, gastos, solicitudes de material
- [ ] **Programar acompañamiento:** Agendar salida con rep para coaching
- [ ] **Reasignar territorio:** Mover médicos/clientes de un rep a otro
- [ ] **Enviar mensaje al equipo:** Comunicación masiva o individual
- [ ] **Generar reporte:** Exportar datos del equipo para presentación

## 4.3 Consultas en Lenguaje Natural

```
Supervisor: "¿Quién no ha visitado a sus médicos A esta semana?"

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

# 5. EXPERIENCIA: DIRECTOR / DUEÑO

**Pregunta central:** *"¿El negocio va bien? ¿Dónde están las oportunidades y riesgos?"*

## 5.1 Dashboard Ejecutivo

Vista de alto nivel diseñada para consumirse en menos de 2 minutos. Los detalles están disponibles bajo demanda.

### Métricas Principales
- [ ] Ventas del mes vs. objetivo (número grande, porcentaje, tendencia)
- [ ] Forecast del mes (predicción IA basada en pipeline)
- [ ] Cobertura total de mercado (%)
- [ ] Actividad del equipo (visitas totales, promedio por rep)
- [ ] Cartera vencida (monto, antigüedad)

### IA Insights (Generados Automáticamente)
- "3 regiones están por debajo del 70% de meta. Riesgo de incumplimiento."
- "El producto X tiene 40% más demanda que el mes pasado. Oportunidad."
- "5 clientes clave no han sido visitados en 30 días. Requiere atención."

## 5.2 Reportes Automáticos

El director puede recibir reportes sin entrar al sistema. La IA genera y envía resúmenes.

| REPORTE | FRECUENCIA | CANAL | CONTENIDO |
|---------|------------|-------|-----------|
| **Pulso Diario** | Diario 7am | WhatsApp/Email | Resumen de actividad del día anterior |
| **Resumen Semanal** | Lunes 8am | Email + PDF | KPIs de la semana, comparativo, performers |
| **Cierre Mensual** | Día 1 del mes | Email + PPT | Resultados vs. metas, análisis, recomendaciones |

---

# 6. EXPERIENCIA: COMERCIAL / VENTAS

**Pregunta central:** *"¿Cómo van mis ventas y qué clientes necesitan atención?"*

## 6.1 Pipeline Visual (Kanban)

Vista de oportunidades en formato de tablero. Cada columna es una etapa del proceso de venta:

```
Prospecto → Cotizado → Negociación → Cerrado → Perdido
```

## 6.2 Campos de Oportunidad

| CAMPO | TIPO | DESCRIPCIÓN | IA |
|-------|------|-------------|-----|
| Cliente | Relación | Farmacia, Hospital, Distribuidor | — |
| Nombre Oportunidad | Texto | Descripción corta del negocio | Sugerencia |
| Monto Estimado | Moneda | Valor potencial de la venta | Predicción |
| Etapa | Enum | Prospecto → Cotizado → Negociación → Cerrado/Perdido | — |
| Probabilidad | Porcentaje | Probabilidad de cierre | Scoring |
| Fecha Cierre Estimada | Fecha | Cuándo se espera cerrar | Predicción |
| Productos | Multi-select | Qué productos incluye | — |
| Competidor | Catálogo | Contra quién compite | — |
| Razón Pérdida | Catálogo | Si se pierde, por qué | Análisis |
| Responsable | Relación | Usuario dueño de la oportunidad | — |

## 6.3 Gestión de Cobranza

- [ ] Vista de antigüedad de saldos (corriente, 30, 60, 90+ días)
- [ ] Recordatorios automáticos a clientes (email, SMS, WhatsApp)
- [ ] Historial de interacciones de cobro
- [ ] Registro de acuerdos de pago
- [ ] Alertas de vencimiento próximo
- [ ] Bloqueo automático de crédito según reglas configuradas

## 6.4 Control de Descuentos

- [ ] Matriz de descuentos autorizados por volumen, cliente, producto
- [ ] Validación automática: si está en rango se aplica, si no, requiere aprobación
- [ ] Flujo de aprobación para descuentos excepcionales
- [ ] Historial y análisis de descuentos aplicados (impacto en margen)

---

# 7. EXPERIENCIA: MÉDICO / HCP

**Pregunta central:** *"¿Qué productos tengo, qué necesito, cómo lo consigo fácil?"*

El médico accede a través de una app de la empresa (conectada al sistema) o un portal web sencillo. Su experiencia es mínima y enfocada en autoservicio.

## 7.1 Funcionalidades para el Médico

| FUNCIÓN | DESCRIPCIÓN | VALOR IA |
|---------|-------------|----------|
| **Mi Perfil** | Actualizar datos de contacto, horarios, preferencias | — |
| **Mis Muestras** | Ver historial de muestras recibidas, solicitar nuevas | Predicción de consumo |
| **Material Científico** | Acceso a estudios, fichas técnicas, material educativo | Recomendaciones |
| **Contactar Rep** | Enviar mensaje, agendar visita con su representante | — |
| **Alertas Proactivas** | "Se te está acabando X producto, ¿lo solicitas?" | IA Predictiva |

## 7.2 Flujo: Solicitud de Muestras por el Médico

1. Médico recibe notificación: "Tu stock de X está por terminar" (o entra a la app)
2. Médico selecciona producto(s) y cantidad deseada
3. Sistema valida disponibilidad y límites de compliance
4. Solicitud llega al representante asignado como tarea prioritaria
5. Rep entrega muestras en próxima visita o coordina envío
6. Médico recibe confirmación y puede dar feedback sobre la entrega

---

# 8. EXPERIENCIA: ADMINISTRADOR

**Pregunta central:** *"¿Cómo configuro el sistema sin depender del proveedor?"*

## 8.1 Dos Opciones de Gestión

El cliente elige cómo prefiere gestionar la administración del sistema:

| Opción | Descripción | Ideal Para |
|--------|-------------|------------|
| **"La gestionas tú"** | Acceso completo al panel de administración. El cliente tiene control total sobre usuarios, catálogos, reglas y configuraciones. Incluye capacitación inicial. | Empresas con equipo IT interno o que prefieren autonomía total |
| **"La gestionamos nosotros"** | Prisma gestiona la administración como servicio. El cliente solicita cambios y Prisma los implementa en máximo 24-48 horas. | Empresas que prefieren enfocarse en ventas y delegar lo técnico |

### Regalo: 6 Meses de Administración Supervisada

Durante los primeros 6 meses de operación, **Prisma gestiona la administración sin costo adicional**:

- ✓ Configuración inicial completa
- ✓ Carga de catálogos (productos, territorios, HCPs)
- ✓ Alta de usuarios y asignación de roles
- ✓ Configuración de reglas de compliance
- ✓ Ajustes y optimizaciones según feedback
- ✓ Capacitación progresiva al equipo del cliente

Al finalizar los 6 meses, el cliente decide: continuar con gestión autónoma o contratar administración como servicio mensual.

## 8.2 Áreas de Configuración

| ÁREA | CONFIGURACIONES DISPONIBLES |
|------|---------------------------|
| **Usuarios** | Alta/baja, asignación de rol, permisos específicos, reset de contraseña |
| **Catálogos** | Productos, territorios, especialidades, instituciones, tipos de actividad |
| **Reglas de Negocio** | Límites de muestras por médico, frecuencias de visita, matriz de descuentos |
| **Compliance** | Configuración de validaciones regulatorias, campos obligatorios, firmas |
| **Integraciones** | Conexiones con ERP, facturación, WhatsApp, calendario |
| **Auditoría** | Logs de acceso, cambios en datos, exportación para auditorías externas |

---

# 9. CANAL WHATSAPP: INTERFAZ PRINCIPAL

## 9.1 Principio Fundamental

> "El representante farmacéutico vive en WhatsApp. APEX vive ahí también."

El 90% de las interacciones del representante de campo se realizan a través de WhatsApp Business API, sin necesidad de abrir otra aplicación.

## 9.2 Capacidades de Procesamiento

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

## 9.3 Flujos de Conversación

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

### Briefing Pre-Visita (Automático)

```
APEX: 📋 BRIEFING PRE-VISITA
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
      • Publicó artículo sobre HTA resistente

      💡 SUGERENCIAS
      • Llevar estudio COMBINE-2024 (combina ARAII + BCC)
      • Mencionar caso de éxito Dr. Pérez

      📎 MATERIAL ADJUNTO
      • Estudio_COMBINE_2024.pdf
```

## 9.4 Acciones Disponibles desde WhatsApp

| Acción | Comando / Ejemplo |
|--------|-------------------|
| Registrar visita | Nota de voz o texto informal |
| Consultar médico | "Dame el resumen del Dr. García" |
| Ver agenda | "¿Qué tengo programado para hoy?" |
| Consultar inventario | "¿Cuántas muestras me quedan de Losartán?" |
| Recibir briefing | Automático antes de cada visita |
| Alertas de compliance | Automáticas cuando aplica |
| Programar visita | "Agenda visita con Dr. García para el viernes" |
| Consultar KPIs | "¿Cómo voy con mi meta del mes?" |

---

# 10. CAPA DE INTELIGENCIA ARTIFICIAL

La IA está siempre disponible para todos. Los límites dependen del consumo y plan.

## 10.1 Capacidades de IA

| CAPACIDAD | DESCRIPCIÓN | CONSUMO |
|-----------|-------------|---------|
| **Autocompletado** | Sugerencias mientras el usuario escribe, basadas en historial | Bajo (~50 tokens) |
| **Transcripción voz** | Dictar notas de visita, el sistema transcribe y estructura | Medio (~200 tokens) |
| **Clasificación** | Categorizar objeciones, sentimiento, temas automáticamente | Bajo (~100 tokens) |
| **Resúmenes** | Generar resumen de notas acumuladas, historial de cliente | Medio (~500 tokens) |
| **Scoring/Predicción** | Probabilidad de cierre, riesgo de abandono, categorización | Alto (~1000 tokens) |
| **Generación informes** | Crear reportes narrativos automáticos con análisis | Alto (~2000 tokens) |
| **Agente autónomo** | Ejecutar acciones: enviar recordatorios, actualizar datos | Variable |

## 10.2 Límites según Plan

| CAPACIDAD | INICIAL | PROFESIONAL | AVANZADO |
|-----------|---------|-------------|----------|
| Tokens / mes | 50,000 | 200,000 | 500,000+ |
| Consultas IA / día | 20 | 100 | Ilimitadas |
| Texto (sugerencias) | ✓ | ✓ | ✓ |
| Voz (dictar) | — | ✓ | ✓ |
| Imagen (análisis) | — | Limitado | ✓ |
| Informes auto / mes | 2 | 10 | Ilimitados |
| Predicciones | — | ✓ | ✓ |
| Agentes autónomos | — | Básicos | Completos |

## 10.3 Los 4 Agentes de IA

### Agente de Visita
- [ ] Captura por voz o texto informal
- [ ] Transcripción con precisión >95%
- [ ] Extracción de entidades (NER): médicos, productos, cantidades, fechas
- [ ] Clasificación de tipo de visita y nivel de interés
- [ ] Generación de email de seguimiento personalizado
- [ ] Actualización automática sin intervención del rep

### Agente de Compliance
- [ ] Validación de límites **antes** de entrega
- [ ] Bloqueo de acciones no permitidas
- [ ] Alertas de aproximación a límites
- [ ] Firma electrónica de recepción
- [ ] Audit trail inmutable
- [ ] Generación de reportes de transparencia

### Agente de Preparación
- [ ] Briefing automático antes de cada visita programada
- [ ] Resumen de historial del HCP
- [ ] Alertas de tiempo sin visitar
- [ ] Material recomendado según especialidad
- [ ] Sugerencias de acción personalizadas

### Agente de Alertas
- [ ] Detección de cambio en sentimiento de interacciones
- [ ] HCPs sin visita por más de X días
- [ ] Objetivos mensuales en riesgo
- [ ] Oportunidades no atendidas
- [ ] Cambios externos (HCP cambió de hospital, nueva publicación)

---

# 11. MOTOR DE COMPLIANCE

## 11.1 Regulaciones Soportadas

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

## 11.2 Funcionalidades de Compliance

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
- [ ] Exportación para auditorías externas
- [ ] Alertas de anomalías

## 11.3 Reglas Configurables

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `max_samples_per_hcp_monthly` | Límite muestras/HCP/mes | 6 |
| `max_samples_per_hcp_yearly` | Límite muestras/HCP/año | 36 |
| `min_days_between_visits` | Frecuencia mínima visitas | 14 |
| `require_digital_signature` | Requiere firma digital | true |
| `max_gift_value_usd` | Valor máximo obsequios | 50 |

---

# 12. COMPONENTES DEL SISTEMA

Los componentes son las piezas técnicas que se combinan automáticamente según las experiencias que el cliente necesita.

| COMPONENTE | FUNCIONALIDAD | USADO EN |
|------------|--------------|----------|
| **Contactos/HCPs** | Base de datos de médicos, farmacias, instituciones | Rep, Supervisor, Comercial |
| **Actividad/Visitas** | Registro de interacciones: visitas, llamadas, emails | Rep, Supervisor |
| **Inventario Muestras** | Stock por rep, entregas, trazabilidad, límites | Rep, Admin, Compliance |
| **Pipeline Comercial** | Oportunidades, cotizaciones, etapas, forecast | Comercial, Director |
| **Cobranza/Cartera** | Antigüedad de saldos, recordatorios, acuerdos | Comercial, Director |
| **Reportes/Dashboards** | KPIs, gráficos, exportación, reportes programados | Supervisor, Director |
| **Portal Externo** | Acceso para médicos y farmacias: autoservicio | Médico (externo) |
| **Usuarios/Permisos** | Gestión de usuarios, roles, permisos granulares | Admin |
| **Catálogos** | Productos, territorios, especialidades, instituciones | Admin |
| **Auditoría/Compliance** | Logs, trazabilidad, reportes regulatorios, firmas | Admin, Compliance |

---

# 13. INTEGRACIONES

El sistema se conecta con otras herramientas para crear un ecosistema completo.

| INTEGRACIÓN | FUNCIONALIDAD | DIRECCIÓN |
|-------------|--------------|-----------|
| **WhatsApp Business** | Canal principal para reps, notificaciones a médicos | Bidireccional |
| **ERP** | Sincronización de pedidos, inventario, facturación | Bidireccional |
| **Facturación** | Generación de CFDI, consulta de facturas emitidas | CRM → Facturación |
| **Calendario** | Sincronización con Google Calendar / Outlook | Bidireccional |
| **Email Marketing** | Envío de campañas, seguimiento de apertura | CRM → Email |
| **Mapas/GPS** | Geolocalización de visitas, optimización de rutas | Google Maps API |
| **Datos de Mercado** | IQVIA, Close-Up para datos de prescripción | Mercado → CRM |

---

# ANEXOS

## A. Glosario

| Término | Definición |
|---------|------------|
| **HCP** | Healthcare Professional (Profesional de Salud) |
| **Rep** | Representante de ventas / visitador médico |
| **Agente IA** | Componente autónomo que ejecuta tareas específicas |
| **GenUI** | Generative UI - Interfaz que se adapta dinámicamente |
| **NER** | Named Entity Recognition - Extracción de entidades |
| **WhatsApp-First** | Diseño donde WhatsApp es la interfaz principal |

## B. Requisitos Técnicos Mínimos

### Para Representantes
- Smartphone con WhatsApp instalado
- Conexión a internet (3G mínimo)
- Opcional: App móvil APEX (iOS 14+ / Android 10+)

### Para Gerentes/Admin
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet estable

---

*Versión 2.3 — Febrero 2026*

*© 2026 APEX - Prisma. Todos los derechos reservados.*
