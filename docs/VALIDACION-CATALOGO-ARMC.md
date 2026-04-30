# Validación del catálogo de servicios de ARMC

**Destinataria:** CEO de ARMC
**Remitente:** Equipo PRISMA Consul (Proyecto APEX)
**Fecha:** 2026-04-14
**Última actualización:** 2026-04-30 (limpieza de marcas ⏳ huérfanas, reapertura de B como pendiente C07, clarificación de C, corrección de 3.6 sobre masajes post-quirúrgicos para alinear con la corrección de la sección 5.3 — sección 5.3 prevalece sobre 3.6)
**Propósito:** resolver ambigüedades taxonómicas del catálogo oficial de servicios para poder modelarlo correctamente en el sistema APEX y, en paralelo, alinear la documentación clínica interna con la realidad operativa de la clínica.
**Estado:** validado con la CEO (Marisela) en reunión 2026-04-15. 32/32 preguntas resueltas. 2 puntos derivados quedan abiertos en `REVIEW-PRISMA-APEX.md` Sección 7: C07 (costo 2ª valoración pre-cirugía con especialista externo) y C08 (quién agenda Variantes B y C de valoración + leads de obesidad).

---

## REGISTRO DE DECISIONES (actualizado con la reunión CEO 2026-04-15)

Las siguientes decisiones han sido confirmadas verbalmente por la CEO (Marisela) durante la reunión de validación. Las preguntas correspondientes en el cuerpo del documento se marcan con ✅ DECIDIDO.

### Vocabulario (Sección 1)

| Concepto | Definición confirmada | Estado |
|---|---|---|
| Línea de servicio | Agrupación clínica de alto nivel con múltiples procedimientos y consultas | ✅ CONFIRMADO |
| Procedimiento | Acto terapéutico con modificación física del paciente | ✅ CONFIRMADO |
| Consulta | Acto de valoración o seguimiento sin intervención terapéutica directa | ✅ CONFIRMADO |
| Subtipos de consulta | "De valoración" (Fase A) y "de revisión" (Fase C) — aporte de la CEO | ✅ CONFIRMADO |
| Fases del ciclo | A (evaluación), B (intervención), C (seguimiento), X (corrección/rescate) | ✅ CONFIRMADO |

### Estructura del catálogo (Sección 2)

| Decisión | Resultado | Estado |
|---|---|---|
| 2.1 — ¿Cuántas líneas? | **5 líneas definitivas**: Cirugía estética, Medicina estética (incluye obesidad), Aparatología, Cosmiatría, Tricología | ✅ CONFIRMADO |
| 2.2 — ¿Faltan líneas? | **No**, el catálogo cubre la oferta actual. Quirófano propio previsto ~1 año pero no cambia la oferta de hoy | ✅ CONFIRMADO |
| 2.3 — ¿Líneas obsoletas? | **No hay líneas obsoletas** | ✅ CONFIRMADO |

### Ítems ambiguos (Sección 3)

| Pregunta | Decisión CEO | Estado |
|---|---|---|
| 3.1 — Consulta capilar + implante | **Se separan en dos**: consulta capilar regenerativa (activo) + implante capilar (futuro, no se ejecuta actualmente, se está preparando). No es una oferta integrada fija; depende del caso clínico del paciente | ✅ DECIDIDO |
| 3.2 — Manejo melasma/acné | **Son sublíneas de Cosmiatría** con protocolos propios. Cada sesión se cobra por separado, no como oferta conjunta | ✅ DECIDIDO |
| 3.3 — Toxina botulínica arrugas vs hiperhidrosis | Técnicamente es un solo principio activo, pero **se modelan como procedimientos separados** por indicación. Además, la CEO añade un **tercer procedimiento no listado: aplicación de toxina en maseteros para bruxismo** | ✅ DECIDIDO + HALLAZGO NUEVO |
| 3.4 — Armonización facial | **Oferta personalizable** (no fija). Convive con aplicaciones por zona individual como servicios separados. Variable en volumen (5-15 ml) y zonas según evaluación | ✅ DECIDIDO |
| 3.5 — Hialuronidasa | **3 escenarios**: externo cobrado, error interno gratis, insatisfacción estética cobrada. Es tanto servicio activo como acto correctivo | ✅ DECIDIDO |
| 3.6 — Masajes post-quirúrgicos y reductivos | **Se separan**: post-quirúrgicos = parte del proceso post-cirugía pero **se cobran aparte** (corregido por la CEO en sección 5.3 de este documento — el masaje de drenaje linfático y las terapias de ultrasonido posteriores se facturan como procedimientos independientes, NO incluidos en el precio de la cirugía). Reductivos = **no se ofrecen actualmente**, se quiere implementar a futuro | ✅ DECIDIDO (corregido por sección 5.3) |
| 3.7 — Consulta médica estética | **3 variantes**: (A) valoración general gratuita con Marisela/Divani, (B) valoración pre-cirugía con Marisela/Divani gratuita + 2ª valoración con especialista externo (⚠️ costo de la 2ª por confirmar — REVIEW-PRISMA-APEX C07), (C) vía directa con Dr. Cabrera por demanda del paciente desde el inicio = $1,950 (Marisela/Divani no intervienen) | ✅ DECIDIDO (A y C) · ⚠️ B parcial (costo 2ª pendiente) |
| 3.8 — Manejo integral de obesidad | **Servicio activo con protocolo real**. Dra. Elián lo lleva (consulta + dieta + seguimiento + tirzepatida). Ubicado **dentro de Medicina estética** (estructura final de 5 líneas). Falta PNO formal — tarea documental | ✅ DECIDIDO |
| 3.9 — Mesoterapia | **Son 4 procedimientos distintos**: mesoterapia capilar (infiltración, Dra. Elián), mesoterapia facial (Dermapen), peptonas (glúteo), bioestimuladores (cánulas). No son intercambiables | ✅ DECIDIDO |
| 3.10 — Lipoenzimas | **Servicio activo** que se ejecuta en la práctica. Falta consentimiento informado — CEO lo va a verificar | ✅ DECIDIDO |
| 3.11 — Endolifting | **Son dos procedimientos distintos**: lipo de papada/ángulo y endolifting láser. No van juntos | ✅ DECIDIDO |
| 3.12 — Limpiezas faciales | **Actualmente un solo tipo**. En el futuro se van a agregar diferentes según tipo de mascarilla | ✅ DECIDIDO |

### Procedimientos del corpus no en catálogo (Sección 4)

| Pregunta | Decisión CEO | Estado |
|---|---|---|
| 4.1 — Rinoplastia | **Añadir al catálogo** en línea 1. Personal externo subcontratado: Dra. Vargas o Dr. Ducón (nuevo). El expediente/CI se queda con el cirujano responsable | ✅ DECIDIDO |
| 4.2 — Mastopexia | **Añadir al catálogo** en línea 1. Dr. Figueroa (externo) | ✅ DECIDIDO |
| 4.3 — Lifting facial láser | **Añadir al catálogo** en línea 1. Es distinto de endolifting. Lo realiza Dr. Cabrera (interno) | ✅ DECIDIDO |
| 4.4 — Peptonas | **Mantener como procedimiento propio** separado de mesoterapia facial. Se aplica en glúteo | ✅ DECIDIDO |
| 4.5 — Tirzepatida | **Dentro del servicio de obesidad** (Dra. Elián). No es procedimiento independiente — es parte del tratamiento de control de peso | ✅ DECIDIDO |

### Hallazgos nuevos de la reunión (no estaban en el documento original)

| Hallazgo | Detalle | Impacto |
|---|---|---|
| **Bruxismo (toxina en maseteros)** | Marisela identifica un procedimiento activo que no está ni en el catálogo ni en el corpus documental. Se aplica toxina botulínica en maseteros para bruxismo | Añadir como 3er procedimiento de toxina botulínica en Línea 2 (Medicina estética) |
| **Masajes reductivos = futuro** | No se ofrecen actualmente: *"lo queremos implementar pero no como tal, no se ha dado ninguno"* | Marcar como 🔮 futuro en catálogo |
| **Consulta de valoración gratuita con Marisela** | Todas las primeras visitas pasan por la CEO sin costo. Es el punto de entrada estándar al sistema de ARMC | Modelar como consulta Fase A transversal a todas las líneas |
| **Consulta de valoración con Dr. Cabrera = $1,950** | Pacientes que piden directamente al Dr. Cabrera pagan. Aplica a cirugía y procedimientos | Modelar como consulta Fase A de pago alternativa |
| **Flujo en 2 tiempos** | Marisela valora primero (gratis) → si acepta, segunda cita con el especialista del procedimiento | Impacta modelado de agenda y derivaciones en APEX |
| **Dra. Elian** | Es la hija de Marisela (CEO). Lleva tricología (mesoterapia capilar) y obesidad (tirzepatida + dieta + seguimiento) | Contexto + asignación de servicios |
| **Peptonas = glúteo** | Peptonas se aplica en glúteo, no en rostro. No es mesoterapia facial ni bioestimulador | Reclasificar como procedimiento corporal |
| **Mesoterapia facial = Dermapen** | La mesoterapia facial se hace con máquina Dermapen, no inyección manual. Es un procedimiento aparatológico | Posible reclasificación de med. estética a aparatología |
| **4 procedimientos de "mesoterapia"** | Son distintos: capilar (infiltración), facial (Dermapen), peptonas (glúteo), bioestimuladores (cánulas) | No unificar — modelar como 4 servicios |
| **Lipoenzimas activas sin CI** | Se ejecutan pero no hay consentimiento informado. CEO lo va a verificar | Documentación pendiente |
| **Obesidad tiene protocolo real** | Dra. Elián lleva el servicio con consulta + dieta + seguimiento + tirzepatida. Falta PNO formal — CEO lo va a pedir | PNO pendiente de redacción |
| **Dr. Ducón (otorrino)** | Segundo otorrinolaringólogo externo que realiza rinoplastias. No estaba en ningún documento del corpus | Añadir a tabla de personal |
| **Personal interno vs externo** | Internos: Dr. Cabrera, Dra. Elián, Marisela. Externos subcontratados: Dr. Figueroa, Dra. Vargas, Dr. Ducón. Los externos se quedan con expediente/CI original | Impacta modelado de responsabilidades y expedientes en APEX |
| **Endolifting ≠ lipo facial** | CEO confirma explícitamente que son dos procedimientos diferentes, no dos técnicas dentro del mismo | Mantener separados en catálogo |
| **Lifting facial ≠ endolifting** | Son procedimientos distintos. Lifting facial lo hace Gabush. Endolifting también, pero son técnicas diferentes | Mantener separados, ambos en catálogo |
| **Abdominoplastía** | Marisela menciona abdominoplastía como procedimiento realizado por Dr. Figueroa. No estaba en el catálogo oficial ni en el corpus | ✅ Añadir al catálogo (Línea 1 — externo: Dr. Figueroa) |
| **SIEMPRE valoración previa** | Sin excepciones. Incluso inyectables pequeños y aparatología ligera requieren consulta de valoración previa | Modelar como Fase A obligatoria en APEX |
| **Dos valoraciones para cirugía** | Marisela primero (gratis) + especialista segundo (antes de cirugía). Son dos actos formales | Modelar como 2 consultas Fase A en secuencia |
| **Seguimiento en TODAS las intervenciones** | No solo en tricología. Todas las líneas tienen seguimiento formalizado | Modelar Fase C para todos los servicios |
| **⚠️ Masajes post-qx SÍ se cobran** | Corrige la interpretación anterior. Son obligatorios clínicamente pero se facturan aparte: *"todo eso se cobra aparte"* | Reclasificar como procedimiento cobrado, no como seguimiento incluido |

### Estructura definitiva de líneas de servicio ✅ CERRADA

```
1. Cirugía estética mínima invasiva
2. Medicina estética
   └── Incluye: manejo de obesidad (Dra. Elián)
3. Aparatología
4. Cosmiatría (antes en "Otros")
   ├── Sublínea: Manejo de melasma
   └── Sublínea: Manejo de acné
5. Tricología regenerativa (antes en "Otros")
   ├── Consulta capilar regenerativa (activo)
   └── Implante capilar (futuro, separado)
```

---

## 0. Contexto — por qué te pedimos esto

Durante el discovery de APEX hemos analizado en profundidad los 59 documentos que ARMC nos compartió (PNOs, consentimientos informados, expedientes clínicos, catálogo de procedimientos, recetas y entrevistas de Fase 1). El objetivo era entender exactamente qué servicios ofrece ARMC para poder reflejarlos en el modelo de datos del sistema.

Lo que encontramos es que **los documentos son internamente inconsistentes**:

- El **catálogo oficial** (archivo `Catalogo de procedimientos`) lista 53 ítems, pero solo 10 de ellos tienen PNO + consentimiento completos. Los otros 43 aparecen únicamente como nombres en la lista.
- Hay **procedimientos con consentimiento informado firmado** (rinoplastia, mastopexia, lifting facial láser, peptonas, tirzepatida) que **no aparecen en el catálogo oficial**. Están documentados como si se practicaran, pero no están listados como oferta.
- El catálogo **mezcla niveles**: algunos ítems son actos terapéuticos puntuales (ej. "aplicación de hialuronidasa"), otros son disciplinas completas con consulta inicial + seguimiento + tratamientos propios (ej. "consulta capilar regenerativa e implante capilar"), y otros son conceptos ambiguos (ej. "manejo de melasma", "manejo de acné").
- Los términos **consulta**, **procedimiento**, **tratamiento**, **manejo** y **aplicación** se usan intercambiablemente en los PNOs, pero en un modelo de datos cada uno de ellos es una cosa distinta.

Hemos hecho entrevistas de Fase 1 con miembros del equipo y en ellas tampoco quedó una clasificación unificada — distintas personas describen lo mismo de formas distintas. Por eso te pedimos a ti, como CEO, que cierres los puntos de decisión que listamos a continuación. Es la única forma de tener un catálogo operativo coherente.

**Cómo usar este documento:**

Cada pregunta tiene 2-4 opciones marcadas con letras (A, B, C, D). Donde veas el símbolo ☐, marca con una X la opción que consideres correcta. Donde se pida texto libre, escribe debajo. Si una pregunta no aplica o te parece mal planteada, táchala y añade un comentario explicando por qué.

El tiempo estimado de lectura y respuesta es de 45-60 minutos. No hace falta contestar todo de una vez — puedes hacerlo por bloques.

---

## 1. Glosario propuesto

Antes de las preguntas, necesitamos un vocabulario común. Estas son las definiciones que usaremos en el resto del documento. **Si alguna definición no te convence, indícalo al final de este bloque** — si cambian las definiciones, cambian las respuestas.

### 1.1. Línea de servicio

Una **agrupación clínica de alto nivel** con identidad disciplinaria propia. Ejemplo: "Cirugía estética mínima invasiva" o "Medicina estética inyectable". Una línea contiene múltiples procedimientos y consultas dentro de sí misma.

### 1.2. Procedimiento

Un **acto terapéutico concreto** donde se modifica físicamente al paciente (incisión, inyección, aplicación de energía, prescripción farmacológica ejecutada en cabina). Ejemplo: "Aplicación de ácido hialurónico en surco nasogeniano" o "Blefaroplastia superior".

### 1.3. Consulta

Un **acto clínico de valoración o seguimiento sin intervención terapéutica directa**. El paciente acude, se le evalúa, se le indica algo, pero **no se ejecuta tratamiento durante la consulta**. Ejemplo: "Valoración pre-quirúrgica para determinar candidato a otoplastia".

**Nota importante:** en muchos PNOs de ARMC, la palabra "consulta" se usa para referirse a una **línea de servicio completa** (ej. "Consulta de Tricología" que incluye tricoscopía, mesoterapia capilar, prescripción farmacológica y seguimiento). Este uso mezcla la línea con el acto. En este documento distinguiremos:

- **"Consulta"** (en sentido estricto) = acto aislado de valoración.
- **"Servicio tipo línea"** = agrupación completa con múltiples actos dentro.

### 1.4. Fase del ciclo clínico

Todo acto clínico ocurre en una de tres fases:

- **Fase A — Evaluación**: valoración inicial del paciente antes de decidir qué tratamiento aplicar. Incluye historia clínica, exploración, estudios diagnósticos, plan propuesto, firma del consentimiento.
- **Fase B — Intervención**: el acto terapéutico propiamente dicho (quirúrgico, inyectable, aparatológico, prescriptivo).
- **Fase C — Seguimiento**: revisión y cuidado después de la intervención. Incluye control post-operatorio, ajuste terapéutico, rehabilitación, detección de complicaciones.

Y una fase especial:

- **Fase X — Corrección / Rescate**: actos que solo ocurren cuando un procedimiento previo tuvo complicación. Ejemplo: aplicación de hialuronidasa por oclusión vascular.

### 1.5. ¿Estás de acuerdo con estas definiciones?

☒ **A — Sí, las definiciones son correctas y claras.** ✅ DECIDIDO (reunión CEO 2026-04-15)

Además, la CEO aporta una distinción adicional para los subtipos de consulta:
- **Consulta de valoración** = Fase A (evaluación pre-intervención)
- **Consulta de revisión** = Fase C (seguimiento post-intervención)

---

## 2. Bloque I — Estructura general del catálogo

### 2.1. ¿Cuántas líneas de servicio reconoces en ARMC hoy?

El catálogo oficial (`Catalogo de procedimientos`) usa estas 4 categorías como encabezados:

1. Cirugía estética mínima invasiva
2. Medicina estética
3. Aparatología
4. Otros (bloque donde mete consultas de cosmiatría, tricología, obesidad, estética general y servicios complementarios)

Nuestro análisis del corpus sugiere que el bloque "Otros" es en realidad **varias líneas distintas disfrazadas de una sola**. Concretamente, detectamos que:

- **Cosmiatría** (consulta dermato-estética, escáner facial, peelings, limpiezas, rutinas personalizadas de skincare) se comporta como una línea completa: tiene su propio PNO, su propio flujo de diagnóstico, sus propios tratamientos en cabina y sus propios entregables al paciente.
- **Tricología** (consulta capilar regenerativa, tricoscopía, mesoterapia capilar, prescripciones farmacológicas específicas, plan nutracéutico, implante capilar) también se comporta como una línea completa, con PNO propio, diagnóstico propio, tratamientos propios y seguimiento longitudinal cada 1-3 meses.
- **Manejo de obesidad** aparece mencionado como consulta en el catálogo, y el corpus contiene un consentimiento de Tirzepatida que encaja aquí. No sabemos si es una línea propia o solo una consulta aislada.

**Pregunta:** ¿cuál de estas estructuras refleja mejor la realidad de ARMC?

☐ **A — Las 4 líneas del catálogo oficial son correctas.** Cosmiatría, tricología y obesidad son consultas dentro de "Otros", no líneas propias.

☐ **B — Son 6 líneas.** Añadir Cosmiatría, Tricología y Obesidad como líneas propias, separadas de "Otros". "Otros" queda solo para servicios complementarios como masajes post-operatorios.

☒ **C — Son 5 líneas.** Cosmiatría y Tricología sí son líneas propias, pero Obesidad es solo una consulta dentro de Medicina estética. ✅ CONFIRMADO (reunión CEO 2026-04-15 — estructura definitiva de 5 líneas)

☐ **D — Otra estructura.** Descríbela:

Decisiones parciales confirmadas:
- Cosmiatría = línea propia ✅ CONFIRMADO ("sí, se pueden añadir sin problema")
- Tricología = línea propia ✅ CONFIRMADO
- Obesidad = consulta dentro de Medicina estética ✅ CONFIRMADO

### 2.2. ¿Hay líneas de servicio que no están en el catálogo actual pero que deberían estar?

Por ejemplo: ARMC ofrece algo que la gente pide pero que no aparece escrito como línea diferenciada (ej. medicina regenerativa con PRP, terapias hormonales, odontología estética, nutrición clínica).

☒ **A — No, el catálogo cubre todo lo que ARMC ofrece.** ✅ DECIDIDO (reunión CEO 2026-04-15 — "por ahora no". Mención de quirófano futuro ~1 año, pero no cambia la oferta actual)

### 2.3. ¿Hay alguna línea que aparezca en el catálogo pero que ya no se ofrezca en la práctica?

✅ N/A — implícitamente cerrado por 2.2 ("el catálogo cubre todo lo que ARMC ofrece"). No hay líneas obsoletas que retirar.

---

## 3. Bloque II — Ítems ambiguos del catálogo oficial

Aquí hay 12 preguntas concretas sobre ítems del catálogo que no quedan claros al leer los documentos. En cada una proponemos las interpretaciones posibles y necesitamos que elijas cuál es correcta.

### 3.1. "Consulta capilar regenerativa e implante capilar"

Es un ítem único del catálogo pero parece contener dos cosas distintas: la consulta y el implante.

✅ **DECIDIDO** (reunión CEO 2026-04-15):

**Respuesta: combinación de B y C.** Son dos cosas distintas que deben separarse:

1. **Consulta capilar regenerativa** → se ofrece actualmente. Es un servicio activo dentro de la línea de Tricología.
2. **Implante capilar** → **no se ejecuta actualmente**, pero se está preparando para el futuro. Cuando se active, será un procedimiento separado con su propio precio.

La CEO aclara que no es una oferta integrada fija: *"depende de las condiciones que esté el paciente"*. Un paciente puede venir a consulta y salir solo con tratamiento regenerativo, o puede ser candidato a implante cuando este servicio esté disponible.

**Acción:** separar en dos ítems en el catálogo.

### 3.2. "Manejo de melasma" y "Manejo de acné"

Aparecen en el catálogo como dos ítems separados dentro del bloque "Otros". La palabra "manejo" no aclara qué contiene realmente.

✅ **DECIDIDO** (reunión CEO 2026-04-15):

**Respuesta: combinación de B y C.**

- **Cada sesión se cobra por separado**, no como oferta conjunta. La CEO dice: *"Cada sesión se cobra por separado y el paciente si viene a melasma pues es paciente que tiene manchas y el de acné pues del acné como tal."*
- **Son sublíneas de Cosmiatría** con protocolos propios. La CEO confirma: *"Es correcto"* cuando se le propone que son *"vertientes especializadas de la consulta dermatocosmética con protocolos propios"*.

**Acción:** reclasificar como sublíneas dentro de la línea Cosmiatría, sacándolos del bloque "Otros".

### 3.3. "Aplicación de toxina botulínica tipo A para corregir arrugas faciales" y "…para tratar la sudoración excesiva (hiperhidrosis)"

El catálogo los lista como dos ítems distintos. Los PNOs los mezclan dentro de un mismo documento operativo. Los consentimientos también los unifican.

✅ **DECIDIDO** (reunión CEO 2026-04-15):

**Respuesta: A + hallazgo nuevo.** Son procedimientos separados por indicación.

La CEO explica: *"La toxina botulínica es un tratamiento y ya dependiendo la zona anatómica o el lugar donde decidas aplicarlo o el paciente lo requiera."* Y añade: *"lo más común que aplicamos nosotros es para las líneas de expresión, arrugas. Pero cuando el paciente tiene hiperhidrosis o bruxismo nos dice 'quiero aplicación de botox en maseteros'."*

**HALLAZGO NUEVO — Bruxismo:** la CEO identifica un **tercer procedimiento activo no listado** ni en el catálogo ni en el corpus documental: **aplicación de toxina botulínica en maseteros para bruxismo**.

**Acción:** modelar como 3 procedimientos separados dentro de Medicina estética:
1. Toxina botulínica — arrugas faciales (líneas de expresión)
2. Toxina botulínica — hiperhidrosis (axilas y manos)
3. Toxina botulínica — bruxismo (maseteros) ← NUEVO

### 3.4. "Armonización facial (todos los rellenos anteriormente mencionados)"

El catálogo dice literalmente "todos los rellenos anteriormente mencionados", lo cual sugiere que es una oferta conjunta.

✅ **DECIDIDO** (reunión CEO 2026-04-15):

**Respuesta: B, con matiz importante.** Es una oferta personalizable, pero además convive con las aplicaciones por zona como servicios separados.

La CEO explica que son **dos cosas distintas**:

1. **Armonización facial** = procedimiento integral. Se evalúa todo el rostro y se aplica ácido hialurónico en las zonas que el paciente necesite. Es variable: *"se puede llevar un paciente desde 5 ml hasta 15 ml"* y *"hay pacientes que no ocupan boca pero sí ocupan todo lo demás"*. Se ofrece cuando *"nosotros vemos que el paciente tiene varias áreas de oportunidad"*.

2. **Aplicación por zona individual** = cuando el paciente viene y pide directamente una zona concreta (*"quiero aplicación de ácido hialurónico en labios"*, *"busco una rinomodelación"*).

**Acción:** mantener ambos en el catálogo como ítems separados. La armonización facial es un procedimiento-contenedor flexible que permite seleccionar zonas según la evaluación clínica. Las aplicaciones por zona individual son procedimientos independientes.

### 3.5. "Aplicación de hialuronidasa"

Aparece listada en el catálogo junto al resto de inyectables. En el PNO de ácido hialurónico se describe como protocolo de rescate en caso de oclusión vascular o mal resultado estético.

✅ **DECIDIDO** (reunión CEO 2026-04-15):

**Respuesta: C ampliada — son 3 escenarios distintos:**

| Escenario | Origen | ¿Se cobra? |
|---|---|---|
| A. Paciente externo con complicación de otra clínica | Externo | **Sí** — *"recurren a nosotros para que les quitemos... se cobra el procedimiento"* |
| B. Error de ARMC (oclusión vascular) | Interno | **No** — *"obviamente se le aplica y no se le cobra al paciente"* |
| C. Paciente propio insatisfecho sin error médico | Interno | **Sí** — *"sí se le cobra porque los procedimientos estuvieron aplicados de forma correcta"* |

**Acción:** modelar como procedimiento con un atributo que distinga el escenario (externo, correctivo interno gratuito, revisión estética cobrada). No es solo rescate — también es un servicio activo que se vende.

### 3.6. "Masajes faciales y corporales post-quirúrgicos y reductivos"

El catálogo los lista como un solo ítem pero son dos cosas distintas clínicamente: los **post-quirúrgicos** son rehabilitación (drenaje linfático, disolución de fibrosis) y los **reductivos** son tratamiento estético (reducción de volumen, tonificación).

✅ **DECIDIDO** (reunión CEO 2026-04-15):

**Respuesta: combinación de B y C.** Se separan y tienen estatus distintos:

1. **Masajes post-quirúrgicos (drenaje linfático)** = están incluidos en el seguimiento de la cirugía. La CEO dice: *"Se incluyen en cirugía. Viene un paciente, se hace un procedimiento y como seguimiento tiene que hacerse los masajes de drenaje linfático."* No se cobran aparte, son Fase C del ciclo quirúrgico.

2. **Masajes reductivos** = **no se ofrecen actualmente**. La CEO dice: *"Lo reductivo generalmente no, aquí no hemos dado ninguno, lo queremos implementar, pero no como tal. No se ha dado ninguno."* Es un servicio futuro.

**Acción:** separar como dos ítems. Post-quirúrgicos como servicio de seguimiento (Fase C) incluido en cirugía. Reductivos como servicio futuro (🔮).

### 3.7. "Consulta médica estética" (cuarto ítem del bloque "Otros")

Aparece en el catálogo sin más descripción. Los PNOs de cirugía abren todos con un paso inicial de "valoración médica estética facial" que podría ser este mismo servicio.

✅ **DECIDIDO** (reunión CEO 2026-04-15):

**Respuesta: D — son 3 variantes que deben modelarse por separado:**

| Variante | ¿Quién la da? | ¿Se cobra? | ¿Cuándo aplica? |
|---|---|---|---|
| **A. Valoración general** | Marisela (CEO) | Gratuita | Primera visita de cualquier paciente nuevo, cualquier servicio |
| **B. Valoración pre-cirugía** | Marisela/Divani primero → luego especialista externo (Figueroa / Vargas / Ducón) | Gratuita (Marisela/Divani). ⚠️ Costo de la 2ª cita con especialista externo: por confirmar con CEO — ver **REVIEW-PRISMA-APEX C07** | Si el paciente acepta → 2ª cita con el cirujano externo |
| **C. Vía directa con Dr. Cabrera (Gabush)** | Dr. Cabrera (Gabush) — única valoración (primera y única) | **$1,950** | Cuando el paciente lo pide desde el inicio. **Se salta** la valoración con Marisela/Divani — ellos no intervienen con este paciente |

**Flujo de valoración confirmado por la CEO:**
1. Paciente nuevo → consulta gratuita con Marisela
2. Marisela evalúa, explica opciones
3. Si acepta → segunda cita con el especialista según el servicio:
   - Cirugía plástica → Dr. Figueroa
   - Rinoplastia → Dra. Vargas
   - Medicina estética / Aparatología → Dr. Cabrera
4. Si Gabush está libre el mismo día, puede resolver dudas sin agendar segunda cita
5. Excepción: paciente que pide directamente a Gabush = paga $1,950

**Acción:** modelar como 2 tipos de consulta: valoración gratuita (con Marisela, Fase A) y valoración con Dr. Cabrera (de pago, Fase A).

### 3.8. "Consulta médica para manejo integral y avanzado de obesidad"

Aparece sola en el catálogo, sin más desglose. El corpus tiene un CI de Tirzepatida pero no hay PNO de obesidad.

☐ **A — Es una línea de servicio completa** con protocolo propio (valoración + farmacoterapia + seguimiento nutricional + plan metabólico).

☐ **B — Es solo una consulta inicial de valoración.** Después se deriva al paciente a farmacoterapia (Tirzepatida u otro) gestionada como prescripción sin protocolo formal.

☐ **C — Es un servicio nuevo que estamos iniciando.** Aún no tiene protocolo formalizado pero sí se está ofreciendo.

☐ **D — Otra cosa.** Explica:

_____________________________________________

### 3.9. "Mesoterapia corporal y facial" (en Medicina estética)

Aparece como ítem genérico del bloque de medicina estética. Pero hay también "mesoterapia capilar" dentro del PNO de tricología y "peptonas" como consentimiento informado propio (archivo armc_008). ¿Son todas lo mismo bajo nombres distintos o son servicios diferentes?

☐ **A — Son tres servicios distintos.** Mesoterapia corporal/facial, mesoterapia capilar y peptonas son cosas diferentes con distintos principios activos y objetivos.

☐ **B — "Mesoterapia facial" y "peptonas" son el mismo servicio.** Peptonas es el nombre comercial del principio activo que se usa en mesoterapia facial. Deberían unificarse en el catálogo.

☐ **C — "Mesoterapia facial", "peptonas" y "bioestimuladores" son todos variantes del mismo servicio** de estimulación del colágeno con inyecciones. El catálogo los duplica innecesariamente.

☐ **D — Otra cosa.** Explica:

_____________________________________________

### 3.10. "Aplicación de lipoenzimas faciales y corporales"

Aparece en el catálogo pero no hay ni PNO ni consentimiento en el corpus.

☐ **A — Es un servicio que se ofrece activamente.** Falta documentarlo (PNO + CI) pero se ejecuta en la práctica.

☐ **B — Es un servicio que se ofrece en el catálogo pero no se ha ejecutado nunca en la práctica.** Está solo como oferta teórica.

☐ **C — Se ofrecía antes pero ya no.** Hay que eliminarlo del catálogo.

☐ **D — Otra cosa.** Explica:

_____________________________________________

### 3.11. "Endolifting láser facial y corporal"

Aparece en el catálogo como ítem propio, pero el PNO #018 (Liposucción de cara y papada con láser) lo engloba en el mismo documento. Y el CI #032 (Endolifting láser) sí es un consentimiento independiente.

☐ **A — Son dos procedimientos distintos.** La liposucción láser y el endolifting se pueden hacer por separado aunque el PNO los junte por simplicidad operativa.

☐ **B — Son dos técnicas dentro del mismo procedimiento.** Siempre van juntas y no se venden por separado.

☐ **C — El endolifting corporal no se hace; solo el facial.** Hay que corregir el catálogo.

☐ **D — Otra cosa.** Explica:

_____________________________________________

### 3.12. "Limpiezas faciales"

Aparece en el bloque "Otros" del catálogo sin más desglose. En consultas dermato-estéticas suele haber varios tipos (clásica, profunda, con microdermoabrasión, con ultrasonido…).

☐ **A — Es un único servicio genérico.** Una limpieza facial estándar sin sub-tipos.

☐ **B — Son varios sub-servicios.** Hay al menos 2-3 tipos distintos que deberían listarse por separado. Enúncialos:

_____________________________________________

☐ **C — Otra cosa.** Explica:

_____________________________________________

---

## 4. Bloque III — Procedimientos encontrados en el corpus pero NO en el catálogo

Encontramos 5 procedimientos con documentación clínica completa (consentimiento informado firmado, a veces con PNO propio) que no aparecen en el catálogo oficial. Necesitamos saber si deberían añadirse o si su existencia en el corpus es accidental.

### 4.1. Rinoplastia mínima invasiva

Tiene dos consentimientos informados: uno genérico (`armc_028`) y otro con la Dra. Verónica Vargas (otorrinolaringóloga, cédula 6880297) pre-asignada como cirujana responsable (`armc_053`).

☐ **A — Añadir al catálogo en línea 1 (Cirugía estética mínima invasiva).** Es un servicio activo, falta listarlo por omisión.

☐ **B — No añadir.** Ya no se ofrece.

☐ **C — Se ofrece pero solo con la Dra. Vargas.** Debería aparecer en el catálogo con esa restricción explícita.

☐ **D — Otra cosa.** Explica:

_____________________________________________

### 4.2. Mastopexia con o sin implante mamario

Tiene PNO completo (`armc_017`) y dos consentimientos (genérico `armc_030` y con Dr. Santino Figueroa pre-asignado `armc_051`).

☐ **A — Añadir al catálogo en línea 1.** Es un servicio activo con cirujano asignado (Dr. Figueroa), documentación completa, y simplemente falta listarlo.

☐ **B — No añadir.** Es un servicio que el Dr. Figueroa ofrece independientemente pero ARMC no lo vende como clínica.

☐ **C — Otra cosa.** Explica:

_____________________________________________

### 4.3. Lifting facial láser

Tiene consentimiento informado propio (`armc_033`). No tiene PNO. Podría solaparse con el endolifting láser del punto 3.11.

☐ **A — Es un servicio distinto del endolifting.** Añadir al catálogo como ítem propio en línea 1.

☐ **B — Es otro nombre para endolifting láser.** El consentimiento es redundante y hay que usar solo uno de los dos nombres en el catálogo.

☐ **C — Es un servicio antiguo que ya no se ofrece.** Eliminar del corpus.

☐ **D — Otra cosa.** Explica:

_____________________________________________

### 4.4. Peptonas (mesoterapia regenerativa)

Tiene consentimiento informado propio (`armc_008`). No aparece en el catálogo con ese nombre. Podría encajar en el ítem genérico "mesoterapia corporal y facial".

☐ **A — Añadir al catálogo como servicio propio** con el nombre "Aplicación de peptonas" en la línea 2 (Medicina estética).

☐ **B — No añadir.** Ya está cubierto por "Mesoterapia corporal y facial" del catálogo actual y no merece desglose.

☐ **C — Otra cosa.** Explica:

_____________________________________________

### 4.5. Tirzepatida (farmacoterapia para obesidad)

Tiene consentimiento informado propio (`armc_027`). No aparece en el catálogo con ese nombre. Probablemente encaja en "Consulta médica para manejo integral de obesidad".

☐ **A — Añadir al catálogo como procedimiento explícito** dentro de la línea de Obesidad, con nombre "Farmacoterapia con Tirzepatida".

☐ **B — No añadir.** Es parte del protocolo de manejo de obesidad y no merece figurar como servicio independiente.

☐ **C — Otra cosa.** Explica:

_____________________________________________

---

## 5. Bloque IV — Ciclo clínico completo (evaluación, intervención, seguimiento)

Este bloque es crítico para el modelado de datos de APEX. Necesitamos saber cómo se estructura el ciclo de atención de un paciente desde que solicita cita hasta que se le da de alta.

### 5.1. ¿Toda intervención en ARMC empieza con una consulta de valoración formal?

☒ **A — Sí, siempre.** ✅ DECIDIDO (reunión CEO 2026-04-15)

La CEO es tajante: *"Siempre. Siempre siempre es importante la valoración previa."* Sin excepciones, incluidos inyectables pequeños y aparatología ligera.

### 5.2. ¿Quién realiza la consulta de valoración según el procedimiento?

✅ **DECIDIDO** (reunión CEO 2026-04-15):

**Respuesta: D — flujo propio de ARMC en dos tiempos:**

1. **Primera valoración: siempre con Marisela (CEO).** Es gratuita. Aplica a todos los servicios sin excepción: *"primero aunque quieran alguna liposucción, primero la hacen con nosotros"*.

2. **Segunda valoración: con el especialista del procedimiento.** Solo si el paciente acepta en la primera. El especialista también valora al paciente.
   - Cirugía plástica → Dr. Figueroa
   - Rinoplastia → Dra. Vargas o Dr. Ducón
   - Medicina estética / Aparatología → Dr. Cabrera (Gabush)
   - Tricología / Obesidad → Dra. Elián

3. **Excepción:** si el paciente pide directamente al Dr. Cabrera como primer contacto, se salta la valoración gratuita con Marisela y paga $1,950.

### 5.3. ¿Hay consultas de seguimiento formalizadas después de cada intervención?

☒ **A — Sí, todas las intervenciones tienen seguimiento formal.** ✅ DECIDIDO (reunión CEO 2026-04-15)

La CEO confirma: *"Sí, en todas."*

**⚠️ CORRECCIÓN sobre decisión anterior (masajes post-quirúrgicos):**

En la pregunta 3.6, la CEO dijo que los masajes post-quirúrgicos *"se incluyen en cirugía"*, lo cual interpretamos como que eran gratuitos. Pero en este bloque corrige explícitamente:

*"El postoperatorio que son las terapias de ultrasonido o que son los masajes linfáticos, todo eso se cobra aparte."*
*"Se hace una liposucción, después de la liposucción se cobran los masajes de drenaje linfático."*

**Interpretación corregida:** "se incluyen en cirugía" significaba que **forman parte del proceso clínico** (son obligatorios como seguimiento), pero **se facturan como servicio separado**. No son gratuitos.

### 5.4. ¿Los seguimientos post-operatorios se cobran aparte?

✅ **DECIDIDO** (reunión CEO 2026-04-15):

**Respuesta: B — Sí, se cobran aparte.**

La CEO es explícita: *"El postoperatorio que son las terapias de ultrasonido o que son los masajes linfáticos, todo eso se cobra aparte."*

Y para tricología: *"Se cobra cada que vienen."* Cada visita de seguimiento se factura individualmente.

Excepción: cuando se arma un "paquete" (ver pregunta 6.1), las terapias post-operatorias pueden no cobrarse como parte de la negociación: *"tus terapias postoperatorias no se te van a cobrar"*.

### 5.5. ¿Hasta cuándo se considera que un paciente "terminó" un tratamiento?

☒ **A — Cuando se firma el alta médica.** ✅ DECIDIDO (reunión CEO 2026-04-15)

La CEO confirma que el episodio se cierra formalmente con la firma del alta. Si el paciente no vuelve a las consultas de seguimiento, no se firma el alta — queda una anotación en el expediente pero el episodio no se cierra.

---

## 6. Bloque V — Precios, ofertas conjuntas y facturación

Aquí necesitamos entender cómo se vende realmente, porque el catálogo no lo dice.

### 6.0. ¿Cómo llamáis internamente en ARMC a "varios servicios vendidos juntos como una unidad"?

☒ **A — Usamos la palabra "paquete".** ✅ DECIDIDO (reunión CEO 2026-04-15)

### 6.1. ¿Hay servicios que solo se venden agrupados con otros y nunca por separado?

☒ **B — No.** ✅ DECIDIDO (reunión CEO 2026-04-15)

Todos los servicios se venden individualmente. La CEO explica: *"Generalmente nosotros vendemos los servicios por separado."*

Los paquetes se arman **a demanda del paciente**: *"Si el paciente dice que le hagamos un paquete para bajarle los costos... 'me quiero hacer lipo, me quiero hacer armonización', entonces ya se le arma un paquete."*

Los descuentos son flexibles y caso por caso. Pueden incluir:
- Descuento porcentual sobre el total
- Promociones mensuales
- Exención del cobro de terapias post-operatorias: *"tus terapias postoperatorias no se te van a cobrar"*

### 6.2. ¿Cómo se factura una cirugía?

Por ejemplo, una otoplastia: ¿el paciente paga un único importe total o se desglosa?

☐ **A — Un único importe total** que incluye valoración + cirugía + anestesia + materiales + seguimiento.

☐ **B — Desglosado** en conceptos: honorarios del cirujano, anestesista, materiales, quirófano, seguimientos. El paciente recibe un presupuesto con varias líneas.

☒ **B — Desglosado.** ✅ DECIDIDO

El paciente recibe un presupuesto con conceptos separados por servicio.

### 6.3. ¿Quién decide los precios de cada servicio?

✅ **DECIDIDO** (reunión CEO 2026-04-15):

**Respuesta: combinación de A y C.**

La CEO (Marisela) define los precios junto con el Dr. Cabrera (Gabush): *"Yo ya los tengo establecidos con Gabush... la lipopapada la vamos a cobrar en tanto."*

Son precios fijos con dos tipos de ajustes:
- **Promociones mensuales**: la CEO decide: *"hay meses que metemos promociones"*.
- **Ajustes por incremento de proveedores**: *"si nos avisan que va a tener incremento, entonces hacemos el incremento nosotros también"* (confirmado también por Carlos en su entrevista de Fase 1).

### 6.4. ¿Hay servicios en el catálogo actual que ARMC ofrece pero que **nunca se facturan** porque son gratuitos (ej. consulta inicial, seguimientos incluidos)?

✅ **DECIDIDO parcialmente** (reunión CEO 2026-04-15):

**Respuesta: A — Sí.** Al menos:
- **Consulta de valoración inicial con Marisela** = gratuita para todo paciente nuevo (confirmado en 3.7)

### 6.5. ¿El catálogo actual refleja lo que ARMC cobra, o es una lista de "todo lo que podría ofrecer"?

✅ **DECIDIDO:**

**Respuesta: C — Está desactualizado.** El catálogo es real (no aspiracional), pero no refleja la realidad completa. Hay procedimientos activos que no están listados (rinoplastia, mastopexia, lifting facial, bruxismo, abdominoplastía), y hay servicios listados que aún no se ofrecen (masajes reductivos, implante capilar). Además faltan PNOs y consentimientos para varios ítems activos.

---

## 7. Cierre — preguntas finales abiertas

### 7.1. ¿Hay alguna pregunta crítica sobre el catálogo o los servicios que deberíamos haber hecho en este documento y no hicimos?

_____________________________________________

_____________________________________________

### 7.2. ¿Quién debería validar las respuestas a este documento una vez las completes?

☐ **A — Solo tú (CEO) como decisora final.**
☐ **B — Tú + Dr. Cabrera** (director médico).
☐ **C — Comité de dirección** completo.
☐ **D — Otra persona o grupo.** Indica quién:

_____________________________________________

### 7.3. ¿Para cuándo necesitas ver el catálogo corregido reflejado en el sistema APEX?

☐ **A — Inmediato** (próximos 7 días).
☐ **B — Corto plazo** (2-3 semanas).
☐ **C — Medio plazo** (1-2 meses).
☐ **D — No hay urgencia.**

---

## 8. Notas finales

**Tiempo estimado de respuesta:** 45-60 minutos, pero no hace falta hacerlo todo de una vez. Puedes completarlo por bloques en varias sesiones.

**Formato de entrega:** cuando termines, envíanos este mismo documento con las opciones marcadas y las respuestas libres rellenadas. Puede ser por email, por el Hub de documentos de ARMC (subiéndolo en tu carpeta), o por el medio que prefieras.

**Qué haremos con tus respuestas:**

1. Consolidaremos la información en un catálogo oficial corregido que reemplazará al actual (`Catalogo de procedimientos`).
2. Generaremos un catálogo estructurado para el sistema APEX con las líneas de servicio, procedimientos y consultas correctamente clasificadas.
3. Identificaremos los PNOs y consentimientos informados que faltan por redactar y te propondremos un plan para completarlos.
4. Te devolveremos el catálogo final para validación antes de publicarlo y antes de cargarlo en APEX.

**Contacto:** si alguna pregunta no queda clara al leerla, cualquier duda del propio documento, o quieres que te lo expliquemos de otra forma, escríbenos y lo resolvemos antes de que contestes.

---

## 9. TABLA RESUMEN — Líneas de servicio, procedimientos y consultas de ARMC

> Esta tabla se actualiza conforme se van confirmando decisiones con la CEO.
> **Leyenda:** ✅ = confirmado por CEO · 🆕 = hallazgo nuevo de la reunión · 🔮 = servicio futuro (no activo hoy)

### Línea 1 — Cirugía estética mínima invasiva

| # | Ítem | Tipo | Fase | Estado |
|---|---|---|---|---|
| 1.1 | Liposucción facial láser (cara y papada) | Procedimiento | B | Del catálogo |
| 1.2 | Bichectomía | Procedimiento | B | Del catálogo |
| 1.3 | Blefaroplastia superior e inferior | Procedimiento | B | Del catálogo |
| 1.4 | Otoplastia | Procedimiento | B | Del catálogo |
| 1.5 | Endolifting láser facial y corporal | Procedimiento | B | ✅ Separado de lipo, son distintos (3.11) |
| 1.6 | Minilifting mínimo invasivo | Procedimiento | B | Del catálogo |
| 1.7 | Liposucción de brazos láser | Procedimiento | B | Del catálogo |
| 1.8 | Braquioplastia | Procedimiento | B | Del catálogo |
| 1.9 | Foxy eyes | Procedimiento | B | Del catálogo |
| 1.10 | Lift lips | Procedimiento | B | Del catálogo |
| 1.11 | Retiro de lunares y verrugas | Procedimiento | B | Del catálogo |
| 1.12 | Manejo de cicatrices quirúrgicas | Procedimiento | B | Del catálogo |
| 1.13 | Rinoplastia mínima invasiva | Procedimiento | B | ✅ Añadir. Externo: Dra. Vargas / Dr. Ducón (4.1) |
| 1.14 | Mastopexia con/sin implante mamario | Procedimiento | B | ✅ Añadir. Externo: Dr. Figueroa (4.2) |
| 1.15 | Lifting facial láser | Procedimiento | B | ✅ Añadir. Distinto de endolifting. Interno: Dr. Cabrera (4.3) |
| 1.16 | Abdominoplastía | Procedimiento | B | 🆕 ✅ Añadir. Externo: Dr. Figueroa (hallazgo CEO) |

### Línea 2 — Medicina estética

| # | Ítem | Tipo | Fase | Estado |
|---|---|---|---|---|
| 2.1 | Toxina botulínica — arrugas faciales | Procedimiento | B | ✅ Separado por indicación (3.3) |
| 2.2 | Toxina botulínica — hiperhidrosis (axilas y manos) | Procedimiento | B | ✅ Separado por indicación (3.3) |
| 2.3 | Toxina botulínica — bruxismo (maseteros) | Procedimiento | B | 🆕 ✅ Hallazgo CEO — no estaba en catálogo ni corpus |
| 2.4 | Diseño y aumento de labios (ácido hialurónico) | Procedimiento | B | Del catálogo |
| 2.5 | Rinomodelación (ácido hialurónico) | Procedimiento | B | Del catálogo |
| 2.6 | Aumento de pómulos (ácido hialurónico) | Procedimiento | B | Del catálogo |
| 2.7 | Aumento de mentón (ácido hialurónico) | Procedimiento | B | Del catálogo |
| 2.8 | Delineado mandibular (ácido hialurónico) | Procedimiento | B | Del catálogo |
| 2.9 | Relleno de surco nasogeniano (ácido hialurónico) | Procedimiento | B | Del catálogo |
| 2.10 | Relleno de frente (ácido hialurónico) | Procedimiento | B | Del catálogo |
| 2.11 | Relleno de temporal (ácido hialurónico) | Procedimiento | B | Del catálogo |
| 2.12 | Corrección de ojeras (ácido hialurónico) | Procedimiento | B | Del catálogo |
| 2.13 | Armonización facial (evaluación integral + zonas según necesidad) | Procedimiento | B | ✅ Oferta personalizable, convive con zonas individuales (3.4) |
| 2.14 | Bioestimuladores de colágeno (rostro, cuello, manos) | Procedimiento | B | Del catálogo |
| 2.15 | Aplicación de lipoenzimas faciales y corporales | Procedimiento | B | ✅ Servicio activo, falta CI (3.10) |
| 2.16 | Aplicación de hialuronidasa | Procedimiento | B+X | ✅ 3 escenarios: externo cobrado, error gratis, estético cobrado (3.5) |
| 2.17 | Mesoterapia facial (con Dermapen) | Procedimiento | B | ✅ Distinto de capilar, peptonas y bioestimuladores (3.9) |
| 2.18 | Peptonas (aplicación en glúteo) | Procedimiento | B | ✅ Separar como propio. Corporal, no facial (3.9, 4.4) |
| 2.19 | Manejo de obesidad (consulta + dieta + seguimiento + tirzepatida) | Servicio | A+B+C | ✅ Servicio activo, Dra. Elián. Dentro de Medicina estética (5 líneas) |
| 2.20 | Tirzepatida (farmacoterapia obesidad) | Procedimiento | B | ✅ Parte del servicio de obesidad, si paciente es apto (3.8) |

### Línea 3 — Aparatología

| # | Ítem | Tipo | Fase | Estado |
|---|---|---|---|---|
| 3.1 | Láser CO2 fraccionado (cicatrices, acné, estrías, rejuvenecimiento) | Procedimiento | B | Del catálogo |
| 3.2 | Depilación permanente con láser diodo (facial y corporal) | Procedimiento | B | Del catálogo |
| 3.3 | Láser picosegundos (rejuvenecimiento, manchas, tatuajes) | Procedimiento | B | Del catálogo |
| 3.4 | Ultrasonido terapéutico (facial y corporal) | Procedimiento | B | Del catálogo |
| 3.5 | Radiofrecuencia fraccionada (facial y corporal) | Procedimiento | B | Del catálogo |
| 3.6 | Radiofrecuencia fraccionada con microagujas (facial y corporal) | Procedimiento | B | Del catálogo |
| 3.7 | HIFU (facial y corporal) | Procedimiento | B | Del catálogo |

### Línea 4 — Cosmiatría ✅ (confirmada como línea propia por CEO)

| # | Ítem | Tipo | Fase | Estado |
|---|---|---|---|---|
| 4.1 | Consulta dermato-estética (valoración inicial) | Consulta | A | Del catálogo · ✅ línea propia |
| 4.2 | Escáner facial diagnóstico digital | Procedimiento diagnóstico | A | Del PNO 023 |
| 4.3 | Limpiezas faciales | Procedimiento | B | ✅ Actualmente un solo tipo. Futuro: varios por mascarilla (3.12) |
| 4.4 | Peelings químicos superficiales | Procedimiento | B | Del PNO 023 |
| 4.5 | Microdermoabrasión | Procedimiento | B | Del PNO 023 |
| 4.6 | Manejo de melasma | Sublínea | A+B+C | ✅ Sublínea de cosmiatría, cobro por sesión (3.2) |
| 4.7 | Manejo de acné | Sublínea | A+B+C | ✅ Sublínea de cosmiatría, cobro por sesión (3.2) |
| 4.8 | Rutinas personalizadas de skincare | Entregable | C | Del PNO 023 |
| 4.9 | Consulta de revisión cosmiatría | Consulta | C | Del PNO 023 (seguimiento cada 4-6 semanas) |

### Línea 5 — Tricología regenerativa ✅ (confirmada como línea propia por CEO)

| # | Ítem | Tipo | Fase | Estado |
|---|---|---|---|---|
| 5.1 | Consulta capilar regenerativa (valoración inicial) | Consulta | A | ✅ Separada de implante (3.1) |
| 5.2 | Tricoscopía | Procedimiento diagnóstico | A | Del PNO 015 |
| 5.3 | Fotografías clínicas comparativas (4 vistas) | Procedimiento diagnóstico | A+C | Del PNO 015 |
| 5.4 | Medicamentos orales/tópicos capilares | Prescripción | B+C | Del PNO 015 |
| 5.5 | Mesoterapia capilar (exosomas, péptidos biomiméticos) | Procedimiento | B | Del PNO 015 |
| 5.6 | Plan nutracéutico capilar | Prescripción | B+C | Del PNO 015 |
| 5.7 | Implante capilar | Procedimiento | B | 🔮 Futuro — no activo actualmente (3.1) |
| 5.8 | Consulta de seguimiento tricológico | Consulta | C | Del PNO 015 (cada 1-3 meses) |

### Servicios complementarios y consultas transversales

| # | Ítem | Tipo | Fase | Estado |
|---|---|---|---|---|
| S.1 | Consulta de valoración general (gratuita, con Marisela/CEO) | Consulta | A | ✅ Para todo paciente nuevo, cualquier servicio (3.7) |
| S.2 | Consulta de valoración directa con Dr. Cabrera ($1,950) | Consulta | A | ✅ Cuando paciente pide específicamente a Gabush (3.7) |
| S.3 | Masajes post-quirúrgicos (drenaje linfático) | Procedimiento | C | ✅ Parte del proceso pero **se cobran aparte** (corregido en 5.3) |
| S.4 | Masajes reductivos | Procedimiento | B | 🔮 Futuro — no activo actualmente (3.6) |

### Totales provisionales

| Categoría | Cantidad |
|---|---:|
| **Líneas de servicio** | **5 definitivas**: Cirugía estética, Medicina estética (incluye obesidad), Aparatología, Cosmiatría, Tricología |
| **Procedimientos** | ~52 |
| **Consultas** | 6 (valoración gratuita Marisela, valoración Gabush $1,950, valoración con especialista externo, cosmiatría inicial, tricología inicial, seguimiento general) |
| **Sublíneas** | 2 (melasma, acné dentro de cosmiatría) |
| **Servicios futuros** | 2 (implante capilar, masajes reductivos) |
| **Hallazgos nuevos** | 12 |
| **Preguntas resueltas** | **32 de 32 (100%)** |
| **Pendientes** | 0 — todas las preguntas del documento están cerradas |

### Decisiones clave del ciclo clínico

| Aspecto | Decisión | Fuente |
|---|---|---|
| Valoración previa | **Siempre obligatoria**, sin excepciones | CEO: "siempre siempre" |
| Quién valora primero | **Marisela (CEO)**, gratuita | CEO: "primero la hacen con nosotros" |
| Segunda valoración | **Especialista del procedimiento** | CEO: "ya en una segunda ya sería con el doctor especialista" |
| Excepción | **Dr. Cabrera directo = $1,950** | CEO: "esa consulta sí tiene costo" |
| Seguimiento post-intervención | **Formalizado en TODAS las líneas** | CEO: "sí, en todas" |
| Cobro del seguimiento | **Se cobra aparte** (incluido masajes post-qx) | CEO: "todo eso se cobra aparte" |
| Cierre de episodio | **Firma de alta médica** | CEO: firma obligatoria |
| Paquetes | **A demanda**, no predefinidos. Descuentos flexibles | CEO: "generalmente vendemos por separado" |
| Precios | **CEO + Gabush** los definen. Fijos con promociones mensuales | CEO: "yo ya los tengo establecidos con Gabush" |
| Término comercial | **"Paquete"** | CEO: confirmado |

---

_Este documento forma parte del proceso de discovery de APEX (Fase 2) entre PRISMA Consul y ARMC Aesthetic Rejuvenation Medical Center. Versión 1.0 — 2026-04-14. Actualizado 2026-04-15._
