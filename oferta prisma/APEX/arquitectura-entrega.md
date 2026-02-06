# APEX — Arquitectura de Entrega

> **Documento Interno** — Modelo de negocio y estructura de producto
> Para uso de Prisma Consul(ing) — No compartir con clientes

Versión 3.0 — Febrero 2026

---

## Índice

1. [Filosofía APEX](#1-filosofía-apex)
2. [Modelo de Construcción (2.500€)](#2-modelo-de-construcción-2500)
3. [Los 10 Focos](#3-los-10-focos)
4. [Modelo de Suscripción (3 Planes)](#4-modelo-de-suscripción-3-planes)
5. [Arquitectura del Sistema](#5-arquitectura-del-sistema)
6. [Potencialidades (Upsell)](#6-potencialidades-upsell)
7. [Análisis de Costes y Márgenes](#7-análisis-de-costes-y-márgenes)
8. [APEX vs Prisma Consul(ing)](#8-apex-vs-prisma-consulting)

---

## 1. FILOSOFÍA APEX

### APEX es un Sistema Líquido

APEX no es un CRM con módulos fijos. Es un **sistema que se construye según los dolores del cliente**.

```
CLIENTE PAGA 2,500€
        │
        ▼
┌─────────────────────────────────────────────────┐
│  PRISMA CONSTRUYE EL ORGANISMO                  │
│                                                 │
│  900€ = Estructura base (interno)               │
│         → Lo que necesita para funcionar        │
│         → INVISIBLE para el cliente             │
│                                                 │
│  1,600€ = Crédito para 4 pains                  │
│         → Lo que EL CLIENTE ve y usa            │
│         → Configurado según SUS necesidades     │
└─────────────────────────────────────────────────┘
        │
        ▼
RESULTADO: Un sistema único para cada cliente
```

### Dos Capas del Sistema

| Capa | Qué es | Consumo |
|------|--------|---------|
| **Interfaz Estructurada** | Fichas, listas, formularios, reportes. Lo "fijo" del CRM. | Sin consumo de IA |
| **Lienzo IA** | Canvas dinámico, proactivo, conversacional. Lo "líquido" de APEX. | Consume según plan |

### Principios

1. **Transparencia**: El cliente sabe que paga 900€ de estructura + 1,600€ de crédito para pains
2. **Sin límite de usuarios**: Más usuarios = más suscripción (el negocio está ahí)
3. **Todo incluido**: Los 2,500€ dan un sistema completo y funcional
4. **Libertad de elección**: Si no quiere IA, paga menos en suscripción

---

## 2. MODELO DE CONSTRUCCIÓN (2.500€)

### Lo que decimos al cliente

> "Son 2,500€ para construir TU sistema. Incluye 900€ de estructura base y 1,600€ de crédito para resolver tus 4 dolores principales."

### Desglose Interno

| Concepto | Valor | Qué cubre |
|----------|-------|-----------|
| **Estructura base** | 900€ | Infraestructura técnica, usuarios ilimitados, interfaz, IA lista |
| **Crédito para pains** | 1,600€ | 4 pains × 400€ de esfuerzo cada uno |
| **TOTAL** | **2,500€** | Sistema completo construido para el cliente |

### Estructura Base (900€) — Qué incluye

| Componente | Descripción |
|------------|-------------|
| **Usuarios** | Login, perfiles, sin límite de cantidad |
| **Roles** | Configuración de permisos por rol |
| **Base de datos** | Estructura preparada para entidades |
| **Motor de eventos** | Registro de actividad |
| **Interfaz dual** | Web + móvil + branding del cliente |
| **Notificaciones** | Motor listo para configurar |
| **Dashboard** | Espacio para fijar componentes |
| **Motor IA** | Infraestructura lista para funcionar |

### Crédito para Pains (1,600€) — Cómo se usa

Cada pain tiene un "presupuesto" de **400€ de esfuerzo**. Esto incluye:

| Por cada pain | Se configura |
|---------------|--------------|
| Entidades | Tipos de contacto/dato con campos específicos |
| Flujos | Procesos de trabajo del área |
| Reportes | Visualizaciones y métricas |
| IA | Sugerencias y alertas del contexto |
| Integraciones | Conexiones básicas necesarias |

### Límite de esfuerzo por pain

Si el cliente pide algo que excede los 400€ de esfuerzo:

> "Eso es una **potencialidad**. Lo podemos hacer, pero tiene un coste adicional de X€."

---

## 3. LOS 10 FOCOS

El cliente describe sus dolores con sus palabras. Prisma los mapea internamente a estos 10 focos:

### Foco 1: Visibilidad de Equipo de Campo
**Dolor:** "No sé qué hacen mis reps cada día"

**Alcance con 400€:**
- Registro de visitas desde móvil
- Dictado por voz → IA estructura
- Vista de supervisor
- Agenda del rep
- IA resume el día y detecta inactividad

**Potencialidades:** Geolocalización, rutas optimizadas, scoring de productividad

---

### Foco 2: Gestión de Contactos y Médicos
**Dolor:** "Los datos están en 20 Excels diferentes"

**Alcance con 400€:**
- Ficha completa del contacto
- Categorización A-B-C
- Timeline de interacciones
- Asignación por territorio
- IA detecta inactivos y duplicados

**Potencialidades:** Segmentación por prescripción, múltiples ubicaciones

---

### Foco 3: Control de Muestras
**Dolor:** "Las muestras son un desastre"

**Alcance con 400€:**
- Inventario por rep
- Registro de entrega
- Inventario de almacén
- Solicitud desde app
- IA alerta stock bajo

**Potencialidades:** Trazabilidad completa, límites automáticos, reportes regulatorios

---

### Foco 4: Pipeline de Ventas
**Dolor:** "No sé en qué va cada negociación"

**Alcance con 400€:**
- Pipeline visual (kanban)
- Ficha de oportunidad
- Cotizaciones vinculadas
- Catálogo de precios
- IA alerta estancamiento

**Potencialidades:** Scoring predictivo, forecast automático, aprobación de descuentos

---

### Foco 5: Cobranza Inteligente
**Dolor:** "Hay facturas vencidas que nadie cobra"

**Alcance con 400€:**
- Vista de cuentas por cobrar
- Antigüedad de cartera
- Promesas de pago
- Alerta al visitar moroso
- IA prioriza cobranza

**Potencialidades:** Proceso escalonado automático, predicción de impago

---

### Foco 6: Comunicación y Aprobaciones
**Dolor:** "Todo se decide por WhatsApp y se pierde"

**Alcance con 400€:**
- Canal oficial en app
- Flujo de aprobación
- Objetivos visibles
- Historial de decisiones
- IA resume decisiones semanales

**Potencialidades:** Coaching estructurado, aprobaciones multinivel

---

### Foco 7: Portal Médico/Cliente
**Dolor:** "Los médicos no pueden contactarnos"

**Alcance con 400€:**
- Portal web con login
- Ficha autoactualizable
- Solicitud de muestras
- Catálogo consultable
- IA sugiere reabastecimiento

**Potencialidades:** Material científico personalizado, fidelización

---

### Foco 8: Marketing, Promoción y Eventos
**Dolor:** "No sé qué material funciona"

**Alcance con 400€:**
- Biblioteca de material
- Registro de uso por visita
- Envío post-visita
- Calendario de eventos
- IA recomienda material

**Potencialidades:** Tracking de apertura, ROI de eventos

---

### Foco 9: Planificación Estratégica
**Dolor:** "Las cuotas se asignan sin datos"

**Alcance con 400€:**
- Objetivos por rep/territorio
- Mapa de territorios
- Costo por visita
- Comparativa entre zonas
- IA detecta desequilibrios

**Potencialidades:** Simulador de escenarios, comisiones automáticas

---

### Foco 10: Compliance y Regulatorio
**Dolor:** "Si viene una auditoría, no tengo nada"

**Alcance con 400€:**
- Log de auditoría completo
- Trazabilidad básica de muestras
- Políticas documentadas
- Permisos granulares
- IA verifica completitud

**Potencialidades:** Reportes regulatorios, RGPD completo

---

## 4. MODELO DE SUSCRIPCIÓN (3 PLANES)

### Filosofía

El cliente elige cuánta IA quiere usar. Todos los planes incluyen la **interfaz estructurada completa**.

### Los 3 Planes

| Plan | Precio | Descripción |
|------|--------|-------------|
| **APEX Base** | **9€**/usuario/mes | CRM completo, sin IA |
| **APEX Esencial** | **19€**/usuario/mes | CRM + IA limitada |
| **APEX Pro** | **29€**/usuario/mes | CRM + IA completa |

### Detalle de Capacidades

| Capacidad | Base (9€) | Esencial (19€) | Pro (29€) |
|-----------|-----------|----------------|-----------|
| **Interfaz estructurada** | ✓ Completa | ✓ Completa | ✓ Completa |
| **Fichas, listas, reportes** | ✓ | ✓ | ✓ |
| **Consultas IA / día** | ❌ | 30 | 100 |
| **Dictado voz / día** | ❌ | 10 | 30 |
| **Lienzo IA** | ❌ | Reactivo | Proactivo |
| **Briefings automáticos** | ❌ | ❌ | ✓ |
| **Agentes autónomos** | ❌ | ❌ | 2 |
| **Reportes IA / mes** | ❌ | 5 | 20 |

### Comparativa con Competencia

| CRM | Plan con IA básica | Plan con IA completa |
|-----|-------------------|---------------------|
| **APEX** | **19€** | **29€** |
| Freshsales | 39€ | 59€ |
| Zoho | 40€ | 52€ |
| Pipedrive | 50€ | 75€ |
| HubSpot | 100€ | 150€ |

**APEX es ~50% más barato que la competencia.**

---

## 5. ARQUITECTURA DEL SISTEMA

### Dos Capas

```
┌─────────────────────────────────────────────────────────────────┐
│           INTERFAZ ESTRUCTURADA (Siempre disponible)            │
│  ─────────────────────────────────────────────────────────────  │
│  • Fichas de cliente/médico                                     │
│  • Listados de visitas, pedidos                                 │
│  • Formularios de registro                                      │
│  • Dashboards con métricas                                      │
│  • Reportes exportables                                         │
│                                                                 │
│  → NO consume IA. Funciona con plan Base (9€).                  │
└─────────────────────────────────────────────────────────────────┘
                              +
┌─────────────────────────────────────────────────────────────────┐
│                    LIENZO IA (Según plan)                       │
│  ─────────────────────────────────────────────────────────────  │
│  • Canvas interactivo                                           │
│  • IA proactiva (briefings, alertas)                            │
│  • Dictado por voz                                              │
│  • Componentes generados bajo demanda                           │
│  • Agentes autónomos                                            │
│                                                                 │
│  → Consume según plan. Requiere Esencial (19€) o Pro (29€).     │
└─────────────────────────────────────────────────────────────────┘
```

### Capacidades del Motor IA

| Capacidad | Descripción | Plan mínimo |
|-----------|-------------|-------------|
| **Dictado por voz** | Rep dicta → IA estructura | Esencial |
| **Consultas al lienzo** | "Muéstrame X" → IA genera | Esencial |
| **Resúmenes** | IA resume actividad | Esencial |
| **Briefings proactivos** | IA prepara info antes de pedir | Pro |
| **Alertas inteligentes** | IA detecta anomalías | Pro |
| **Agentes autónomos** | Ejecutan acciones automáticas | Pro |
| **Predicciones** | Scoring, probabilidades | Pro |

---

## 6. POTENCIALIDADES (UPSELL)

Cuando el cliente quiere más allá del alcance inicial:

### Tier 1: Extensiones Rápidas (500-1.000€)
- Reportes y dashboards adicionales
- Campos personalizados extra
- Reglas de notificación adicionales
- Rol adicional (4to o 5to)
- Flujos de aprobación extra

### Tier 2: Módulos Medianos (1.000-2.500€)
- Geolocalización y verificación de presencia
- Portal completo para médicos/clientes
- Cobranza escalonada automatizada
- Simulador de escenarios
- Gestión de eventos avanzada

### Tier 3: Integraciones Complejas (2.500-5.000€)
- Integración bidireccional con ERP
- Integración con facturación
- IA predictiva avanzada
- Compliance RGPD completo
- API pública

### Tier 4: Transformación (5.000€+)
- App nativa iOS/Android
- CRM por voz completo
- Integración omnicanal
- Business Intelligence avanzado
- Multi-empresa / multi-país

---

## 7. ANÁLISIS DE COSTES Y MÁRGENES

### Costes de IA (reales)

| Modelo | Input/MTok | Output/MTok | Uso en APEX |
|--------|-----------|-------------|-------------|
| GPT-4o mini | $0.15 | $0.60 | Tareas rutinarias (80%) |
| Claude Haiku | $1.00 | $5.00 | Comprensión |
| Claude Sonnet | $3.00 | $15.00 | Agentes complejos |

### Consumo por tipo de usuario

| Usuario | Tokens/día | Coste/mes |
|---------|------------|-----------|
| Representante | ~15.000 | ~1€ |
| Supervisor | ~24.000 | ~1€ |
| Director | ~20.000 | ~5€ |

### Márgenes por plan

| Plan | Precio | Coste real | Margen |
|------|--------|------------|--------|
| Base (9€) | 9€ | ~1€ (hosting) | **89%** |
| Esencial (19€) | 19€ | ~2€ | **89%** |
| Pro (29€) | 29€ | ~3-5€ | **83-90%** |

**Los márgenes son excelentes en todos los planes.**

### Ejemplo: Cliente con 10 usuarios

| Escenario | Ingresos mensuales |
|-----------|-------------------|
| Todos en Base | 10 × 9€ = **90€/mes** |
| Todos en Esencial | 10 × 19€ = **190€/mes** |
| Todos en Pro | 10 × 29€ = **290€/mes** |
| Mix (5 Base + 5 Pro) | 5×9 + 5×29 = **190€/mes** |

---

## 8. APEX vs PRISMA CONSUL(ING)

| | APEX | Prisma Consul(ing) |
|---|------|-------------------|
| **Qué es** | El producto/sistema | La empresa que lo construye |
| **Qué hace** | Funciona, procesa datos | Configura, construye, da soporte |
| **Relación cliente** | El cliente usa APEX | Prisma construye y mantiene |
| **Primeros 6 meses** | — | Prisma gestiona configuración gratis |
| **Después** | Cliente usa interfaz + IA | Prisma disponible para cambios cotizados |

---

## ANEXO: Mapeo Dolor → Foco

```
DOLOR DETECTADO                    → FOCO
─────────────────────────────────────────────────
"No sé qué hacen mis reps"         → Foco 1 (Visibilidad)
"Datos en Excel"                   → Foco 2 (Contactos)
"Muestras sin control"             → Foco 3 (Muestras)
"No sé en qué va cada venta"       → Foco 4 (Pipeline)
"Facturas sin cobrar"              → Foco 5 (Cobranza)
"Todo por WhatsApp"                → Foco 6 (Comunicación)
"Médicos no pueden pedir"          → Foco 7 (Portal)
"No sé qué material usar"          → Foco 8 (Marketing)
"Cuotas sin datos"                 → Foco 9 (Planificación)
"Auditoría me preocupa"            → Foco 10 (Compliance)
```

---

*Documento interno — Versión 3.0 — Febrero 2026*

*© 2026 APEX - Prisma Consul(ing). Uso interno.*
