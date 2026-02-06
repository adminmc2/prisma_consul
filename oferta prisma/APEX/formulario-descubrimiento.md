# APEX — Formulario de Descubrimiento Inteligente

> **A**utomatización de **P**rocesos y **EX**periencias
> **A**utomation of **P**rocesses and **EX**periences

## Tu CRM, Tu Ritmo

Versión 4.0 — Febrero 2026

---

## Filosofía del Formulario

> *"Cuéntanos tus 4 mayores dolores. Nosotros les damos CUERPO COMPLETO."*

Este formulario usa **IA** para entender tu situación y detectar tus dolores principales. Al final, **siempre** te pedimos un audio para capturar el contexto con tus propias palabras.

**Tiempo estimado:** 5-7 minutos

---

# FLUJO COMPLETO DEL FORMULARIO

```
┌─────────────────────────────────────────────────────────────────┐
│  FASE 1: PREGUNTAS FIJAS                                        │
│  (Contexto básico de tu empresa)                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 2: PREGUNTAS ADAPTATIVAS                                  │
│  (IA genera preguntas según tus respuestas anteriores)          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 3: TUS 4 PAINS DETECTADOS                                 │
│  "Según lo que nos contaste, estos son tus dolores..."         │
│                                                                 │
│  ¿Son correctos?  [SÍ] [NO, ajustar]                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 4: AUDIO (SIEMPRE)                                        │
│  "Graba un audio contándonos más sobre estos dolores"          │
│  [🎤 GRABAR AUDIO]                                              │
│                                                                 │
│  → Si dijo NO: el audio ayuda a ajustar los pains              │
│  → Si dijo SÍ: el audio enriquece el contexto                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 5: CONFIRMACIÓN FINAL                                     │
│  (Muestra los 4 dolores definitivos + datos de contacto)        │
│                                                                 │
│  TUS 4 DOLORES:                                                 │
│  1. ________________________                                    │
│  2. ________________________                                    │
│  3. ________________________                                    │
│  4. ________________________                                    │
│                                                                 │
│  [ENVIAR] → "Gracias, propuesta en 48h"                        │
└─────────────────────────────────────────────────────────────────┘
```

---

# FASE 1: PREGUNTAS FIJAS

*Estas preguntas siempre se hacen, en este orden*

---

## Pregunta 1.1

**¿Cuántas personas usarían el sistema?**

○ 1-5 personas
○ 6-15 personas
○ 16-30 personas
○ Más de 30 personas

---

## Pregunta 1.2

**¿Tienes equipo que visita clientes en campo?**

*Representantes, vendedores, visitadores médicos, técnicos de servicio*

○ Sí, tenemos equipo de campo
○ No, todo es desde oficina o remoto
○ Ambos (parte en campo, parte en oficina)

---

## Pregunta 1.3

**¿En qué sector está tu empresa?**

○ Farmacéutico / Dispositivos médicos
○ Distribución / Mayorista
○ Manufactura / Producción
○ Servicios profesionales
○ Retail / Comercio
○ Otro: _______________

---

## Pregunta 1.4

**¿Cómo gestionas hoy la información de tu operación comercial?**

☐ Excel / Google Sheets
☐ Un CRM (Salesforce, HubSpot, Zoho, otro)
☐ ERP con módulo comercial
☐ Libretas / WhatsApp / Email
☐ No tenemos nada centralizado

---

## Pregunta 1.5

**¿Qué te motivó a buscar una solución?**

*Selecciona la principal*

○ No tengo visibilidad de lo que pasa
○ El equipo no registra la información
○ Pierdo ventas o clientes
○ Problemas con auditorías o regulación
○ El sistema actual no funciona
○ Quiero crecer y necesito orden

---

# FASE 2: PREGUNTAS ADAPTATIVAS

*La IA genera estas preguntas basándose en las respuestas de Fase 1*

---

## Lógica de Generación

```
SI sector = "Farmacéutico" ENTONCES:
   → Preguntar sobre muestras médicas
   → Preguntar sobre compliance/regulación
   → Preguntar sobre visita médica

SI tiene_equipo_campo = TRUE ENTONCES:
   → Preguntar sobre registro de visitas
   → Preguntar sobre rutas y productividad
   → Preguntar sobre supervisión

SI motivacion = "No tengo visibilidad" ENTONCES:
   → Profundizar en qué información falta
   → Preguntar sobre reportes actuales

SI tecnologia_actual = "CRM que no usan" ENTONCES:
   → Preguntar por qué no lo usan
   → Preguntar qué les falta
```

---

## Ejemplos de Preguntas Adaptativas

### Si es Farmacéutico + Equipo de Campo:

**Pregunta 2.1** (generada)
> "¿Cómo controlas las muestras médicas que entrega tu equipo?"

○ Tenemos un sistema de control
○ Lo hacemos en Excel
○ Cada rep lleva su propio registro
○ No tenemos control real

**Pregunta 2.2** (generada)
> "¿Has tenido problemas en auditorías de COFEPRIS u otro regulador?"

○ Sí, nos han observado cosas
○ No, pero nos preocupa
○ No aplica a nosotros

**Pregunta 2.3** (generada)
> "¿Cómo saben los reps qué médicos visitar cada día?"

○ Tienen agenda/ruta definida
○ Ellos deciden sobre la marcha
○ El supervisor les indica
○ No hay un criterio claro

---

### Si es Distribución + Sin equipo de campo:

**Pregunta 2.1** (generada)
> "¿Cómo llevas el seguimiento de las oportunidades de venta?"

○ En un CRM
○ En Excel
○ En la cabeza del vendedor
○ No llevamos seguimiento formal

**Pregunta 2.2** (generada)
> "¿Tienes facturas vencidas sin cobrar?"

○ Sí, es un problema frecuente
○ Algunas, pero lo controlamos
○ No, cobramos puntualmente

**Pregunta 2.3** (generada)
> "¿Cuánto tardas en generar un reporte para dirección?"

○ Minutos (tengo dashboards)
○ Horas (tengo que buscar datos)
○ Días (tengo que armar todo en Excel)
○ No genero reportes formales

---

## Prompt para la IA (Generación de Preguntas)

```
CONTEXTO:
- Sector: {sector}
- Tamaño: {num_personas}
- Equipo campo: {tiene_campo}
- Tecnología actual: {tecnologia}
- Motivación principal: {motivacion}

INSTRUCCIÓN:
Genera 3-5 preguntas de opción múltiple para profundizar en los
dolores del usuario. Las preguntas deben:
1. Ser específicas para su sector y situación
2. Ayudar a detectar sus 4 dolores principales
3. Usar lenguaje simple, no técnico
4. Tener 3-4 opciones de respuesta cada una

FORMATO DE SALIDA:
{
  "preguntas": [
    {
      "texto": "¿Pregunta aquí?",
      "opciones": ["Opción A", "Opción B", "Opción C"],
      "detecta_dolor": ["A01", "A04"] // códigos de base-conocimiento
    }
  ]
}
```

---

# FASE 3: TUS 4 PAINS DETECTADOS

*La IA analiza todas las respuestas y presenta los 4 dolores principales*

---

## Pantalla que ve el Usuario

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Según lo que nos contaste, estos son tus                     │
│   4 DOLORES PRINCIPALES:                                        │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  1. NO SÉ QUÉ HACE MI EQUIPO                            │  │
│   │     No tienes visibilidad de las visitas que hacen      │  │
│   │     tus representantes ni cómo les fue                  │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  2. MIS MUESTRAS SON UN CAOS                            │  │
│   │     No puedes rastrear quién tiene qué muestras ni      │  │
│   │     a quién se las entregaron                           │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  3. REPORTES MANUALES                                   │  │
│   │     Tardas días en armar información para dirección     │  │
│   │     y cada vez es diferente                             │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  4. AUDITORÍAS ME PREOCUPAN                             │  │
│   │     No tienes la trazabilidad que te pide el regulador  │  │
│   │     y generar reportes de compliance es complicado      │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│   ¿Estos reflejan tus dolores principales?                     │
│                                                                 │
│   [ ✓ SÍ, SON CORRECTOS ]      [ ✎ NO, QUIERO AJUSTAR ]       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Prompt para la IA (Detección de Pains)

```
CONTEXTO:
- Respuestas Fase 1: {respuestas_fase1}
- Respuestas Fase 2: {respuestas_fase2}
- Base de conocimiento: {169 dolores de base-conocimiento-dolores.md}

INSTRUCCIÓN:
Analiza las respuestas y detecta los 4 dolores principales del usuario.
Para cada dolor:
1. Asigna un título corto y claro (máx 5 palabras)
2. Escribe una descripción en segunda persona (máx 2 líneas)
3. Mapea a los códigos de la base de conocimiento

FORMATO DE SALIDA:
{
  "pains_detectados": [
    {
      "orden": 1,
      "titulo": "No sé qué hace mi equipo",
      "descripcion": "No tienes visibilidad de las visitas que hacen tus representantes ni cómo les fue",
      "codigos": ["A01", "A02", "A04"],
      "confianza": 0.95
    },
    // ... 3 más
  ],
  "experiencias_sugeridas": ["Representante", "Supervisor", "Admin"],
  "plan_recomendado": "Esencial",
  "requiere_compliance": true
}
```

---

# FASE 4: AUDIO (SIEMPRE OBLIGATORIO)

*Independientemente de si dijo SÍ o NO, siempre se pide audio*

---

## Si dijo SÍ (pains correctos):

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Perfecto. Ahora cuéntanos más con tus palabras.              │
│                                                                 │
│   Graba un audio de 1-2 minutos explicando:                    │
│   • ¿Cuál de estos 4 dolores te afecta MÁS?                    │
│   • ¿Qué has intentado hacer para resolverlo?                  │
│   • ¿Hay algo más que debamos saber?                           │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                                                         │  │
│   │              [ 🎤 GRABAR AUDIO ]                        │  │
│   │                                                         │  │
│   │         Toca para empezar a grabar                      │  │
│   │                                                         │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   El audio nos ayuda a preparar una propuesta más              │
│   personalizada para ti.                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Si dijo NO (quiere ajustar):

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Entendido. Cuéntanos qué ajustar.                            │
│                                                                 │
│   Graba un audio explicándonos:                                │
│   • ¿Qué dolor detectamos que NO es prioritario?               │
│   • ¿Cuál es tu dolor REAL que no capturamos?                  │
│   • Cuéntanos con tus palabras qué te quita el sueño           │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                                                         │  │
│   │              [ 🎤 GRABAR AUDIO ]                        │  │
│   │                                                         │  │
│   │         Toca para empezar a grabar                      │  │
│   │                                                         │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   Escucharemos tu audio y ajustaremos los dolores              │
│   antes de enviarte la propuesta.                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Procesamiento del Audio

```
1. Usuario graba audio
2. Whisper API transcribe a texto
3. IA analiza transcripción:
   - Si confirmó pains → extrae contexto adicional
   - Si quiso ajustar → detecta nuevos pains o reordena

4. IA actualiza los 4 pains si es necesario
5. Continúa a Fase 5 con pains definitivos
```

---

## Prompt para la IA (Análisis de Audio)

```
CONTEXTO:
- Pains detectados previamente: {pains_fase3}
- Usuario dijo: {si_o_no}
- Transcripción del audio: {transcripcion}

INSTRUCCIÓN:
Analiza la transcripción del audio del usuario.

SI usuario confirmó los pains (dijo SÍ):
- Extrae contexto adicional para cada pain
- Identifica cuál es el más prioritario
- Detecta información relevante para la propuesta

SI usuario quiso ajustar (dijo NO):
- Identifica qué pains NO son correctos
- Detecta nuevos dolores mencionados
- Reordena o reemplaza los 4 pains según el audio

FORMATO DE SALIDA:
{
  "pains_finales": [
    {
      "orden": 1,
      "titulo": "...",
      "descripcion": "...",
      "contexto_audio": "El usuario menciona que...",
      "codigos": ["A01", "A02"]
    },
    // ... 3 más
  ],
  "prioridad_maxima": 1,
  "notas_para_propuesta": "El usuario enfatizó que..."
}
```

---

# FASE 5: CONFIRMACIÓN FINAL

*Muestra los 4 pains definitivos y pide datos de contacto*

---

## Pantalla Final

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Estos son tus 4 DOLORES que resolveremos juntos:             │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  DOLOR 1: NO SÉ QUÉ HACE MI EQUIPO                      │  │
│   │  "Necesito visibilidad en tiempo real de las visitas"   │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  DOLOR 2: MIS MUESTRAS SON UN CAOS                      │  │
│   │  "Quiero trazabilidad completa para auditorías"         │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  DOLOR 3: REPORTES MANUALES                             │  │
│   │  "Que los reportes se generen automáticamente"          │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  DOLOR 4: AUDITORÍAS ME PREOCUPAN                       │  │
│   │  "Cumplir con COFEPRIS sin complicaciones"              │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│   Para enviarte la propuesta:                                  │
│                                                                 │
│   Nombre: ___________________________                          │
│                                                                 │
│   Empresa: __________________________                          │
│                                                                 │
│   Email: ____________________________                          │
│                                                                 │
│   WhatsApp: _________________________                          │
│                                                                 │
│                                                                 │
│            [ ENVIAR Y RECIBIR MI PROPUESTA ]                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Pantalla de Gracias

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         ✓                                       │
│                                                                 │
│                  ¡Gracias, [Nombre]!                           │
│                                                                 │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│   En las próximas 48 horas recibirás una propuesta             │
│   personalizada para resolver tus 4 dolores:                   │
│                                                                 │
│   1. No sé qué hace mi equipo                                  │
│   2. Mis muestras son un caos                                  │
│   3. Reportes manuales                                         │
│   4. Auditorías me preocupan                                   │
│                                                                 │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│   La propuesta incluirá:                                       │
│                                                                 │
│   • CUERPO COMPLETO de cada dolor                              │
│     (todo lo que se puede hacer)                               │
│                                                                 │
│   • ALCANCE INICIAL                                            │
│     (qué construimos con los 2,500€)                           │
│                                                                 │
│   • SUSCRIPCIÓN según tus necesidades                          │
│     Base (9€), Esencial (19€) o Pro (29€) por usuario          │
│                                                                 │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│   ¿Dudas? Escríbenos:                                          │
│   📧 hola@prismaconsul.com                                     │
│   📱 WhatsApp: +34 600 000 000                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# ANEXO TÉCNICO: IMPLEMENTACIÓN

---

## Stack Recomendado

| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| Frontend | Next.js / React | Formulario interactivo |
| Audio | Web Audio API | Grabación en navegador |
| Transcripción | OpenAI Whisper | Audio → Texto |
| IA (preguntas) | GPT-4 / Claude | Generar preguntas adaptativas |
| IA (pains) | GPT-4 / Claude | Detectar y ajustar pains |
| Backend | NestJS / Node | API y lógica |
| Storage | S3 / Cloudflare R2 | Guardar audios |
| Base de datos | PostgreSQL | Guardar formularios |

---

## Flujo de Datos

```
Usuario completa Fase 1
        ↓
Backend envía respuestas a IA
        ↓
IA genera preguntas Fase 2
        ↓
Frontend muestra preguntas dinámicamente
        ↓
Usuario completa Fase 2
        ↓
Backend envía todas las respuestas a IA
        ↓
IA detecta 4 pains
        ↓
Frontend muestra pains + pregunta confirmación
        ↓
Usuario confirma o ajusta
        ↓
Usuario graba audio (SIEMPRE)
        ↓
Audio se sube a Storage
        ↓
Whisper transcribe audio
        ↓
IA analiza transcripción + ajusta pains si necesario
        ↓
Frontend muestra pains finales + formulario contacto
        ↓
Usuario envía
        ↓
Backend guarda todo + dispara email de confirmación
        ↓
Equipo Prisma recibe notificación con todo el contexto
```

---

## JSON Final que se Guarda

```json
{
  "id": "form_abc123",
  "timestamp": "2026-02-06T10:30:00Z",

  "empresa": {
    "nombre": "Laboratorio XYZ",
    "contacto": "Juan Pérez",
    "email": "juan@xyz.com",
    "whatsapp": "+34600000000",
    "tamaño": "6-15",
    "sector": "farmaceutico",
    "tiene_campo": true,
    "tecnologia_actual": ["excel", "whatsapp"],
    "motivacion": "no_visibilidad"
  },

  "respuestas_fase1": {
    "1.1": "6-15",
    "1.2": "si_campo",
    "1.3": "farmaceutico",
    "1.4": ["excel", "whatsapp"],
    "1.5": "no_visibilidad"
  },

  "respuestas_fase2": {
    "2.1": "cada_rep_su_registro",
    "2.2": "si_observaciones",
    "2.3": "ellos_deciden"
  },

  "pains_detectados_inicial": [
    {
      "orden": 1,
      "titulo": "No sé qué hace mi equipo",
      "codigos": ["A01", "A02", "A04"],
      "confianza": 0.95
    }
  ],

  "confirmacion_pains": "si",

  "audio": {
    "url": "https://storage.example.com/audios/form_abc123.webm",
    "duracion_segundos": 87,
    "transcripcion": "Mi problema principal es que los reps registran las visitas al final de la semana y ya no se acuerdan de nada. Además tenemos auditoría de COFEPRIS en marzo y no tengo cómo demostrar la trazabilidad de las muestras..."
  },

  "pains_finales": [
    {
      "orden": 1,
      "titulo": "No sé qué hace mi equipo",
      "descripcion": "Necesito visibilidad en tiempo real de las visitas",
      "contexto_audio": "Mencionó que registran al final de la semana",
      "codigos": ["A01", "A02", "A04"]
    },
    {
      "orden": 2,
      "titulo": "Mis muestras son un caos",
      "descripcion": "Quiero trazabilidad completa para auditorías",
      "contexto_audio": "Auditoría COFEPRIS en marzo",
      "codigos": ["C01", "C02", "C11", "L01"]
    },
    {
      "orden": 3,
      "titulo": "Reportes manuales",
      "descripcion": "Que los reportes se generen automáticamente",
      "contexto_audio": null,
      "codigos": ["F01", "F06"]
    },
    {
      "orden": 4,
      "titulo": "Auditorías me preocupan",
      "descripcion": "Cumplir con COFEPRIS sin complicaciones",
      "contexto_audio": "Enfatizó la auditoría de marzo",
      "codigos": ["L01", "L05", "C11"]
    }
  ],

  "experiencias_sugeridas": ["Representante", "Supervisor", "Admin"],
  "plan_recomendado": "Esencial",
  "requiere_compliance": true,

  "notas_para_propuesta": "URGENTE: Auditoría COFEPRIS en marzo. Priorizar trazabilidad de muestras."
}
```

---

## Integración con Propuesta Comercial

| Dato del Formulario | Uso en propuesta-comercial.md |
|---------------------|-------------------------------|
| `empresa.tamaño` | Cálculo suscripción mensual |
| `empresa.sector` | Determina si aplica muestras/compliance |
| `empresa.tiene_campo` | Experiencia Representante sí/no |
| `pains_finales[0-3]` | Los 4 Dolores (400€ c/u = 1,600€) |
| `pains_finales[].contexto_audio` | Personalización del alcance |
| `experiencias_sugeridas` | Experiencias a configurar |
| `plan_recomendado` | Base (9€), Esencial (19€) o Pro (29€) |
| `notas_para_propuesta` | Contexto para el equipo |

---

*Versión 4.0 — Febrero 2026*

*© 2026 APEX - Prisma. Todos los derechos reservados.*
