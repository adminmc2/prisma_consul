# APEX — Base de Conocimiento: Dolores y Mapeo Funcional

> **A**utomatización de **P**rocesos y **EX**periencias
> **A**utomation of **P**rocesses and **EX**periences

## Documento Interno para Bot Conversacional y Formulario

Versión 1.1 — Febrero 2026

---

## Propósito de este Documento

Este documento contiene:
1. **169 dolores** exhaustivos del sector PyME/Farmacéutico (161 originales + 8 de IA)
2. **Mapeo a Focos** — cómo los dolores se agrupan en soluciones
3. **Mapeo a Experiencias** — qué experiencia de APEX resuelve cada dolor
4. **Mapeo a Capacidades** — qué componentes técnicos aplican
5. **Señales de detección** — frases que indican cada dolor
6. **Clusters** — agrupación de dolores similares

**Uso:**
- **Formulario (ahora):** Usa los clusters para opciones simplificadas
- **Bot (futuro):** Usa los 161 dolores + señales para detección conversacional

---

# PARTE 1: CATÁLOGO COMPLETO DE DOLORES

## A. VISIBILIDAD Y CONTROL DEL EQUIPO DE CAMPO (14 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| A01 | No sé qué hacen mis representantes durante el día | "no tengo visibilidad", "no me reportan", "cada quien hace lo suyo" | A-VISIBILIDAD |
| A02 | No sé si mis reps realmente visitaron al médico o solo registraron la visita | "no puedo verificar", "confío en su palabra", "no hay forma de saber" | A-VISIBILIDAD |
| A03 | No tengo forma de saber dónde están mis reps en tiempo real | "no sé dónde andan", "se supone que están en campo", "no los localizo" | A-UBICACION |
| A04 | Mis reps registran las visitas al final del día (o semana) y se les olvida la mitad | "registran después", "se les olvida", "al final del día" | A-REGISTRO |
| A05 | No sé cuánto tiempo pasa cada rep en cada visita | "no sé si realmente estuvo", "pudo haber sido 5 minutos" | A-UBICACION |
| A06 | No sé si mis reps están visitando a los médicos correctos o solo a los que les caen bien | "visitan a sus amigos", "los fáciles", "no siguen la ruta" | A-COBERTURA |
| A07 | Mis reps trabajan sin agenda, van donde quieren | "sin plan", "improvisan", "no hay ruta" | A-COBERTURA |
| A08 | No tengo cómo verificar que un rep realmente estuvo en el consultorio | "no hay prueba", "me tengo que creer", "no hay evidencia" | A-VISIBILIDAD |
| A09 | Cuando un rep se va de la empresa, se lleva toda la información en su cabeza | "se fue y perdimos todo", "no dejó nada documentado", "empezar de cero" | A-CONOCIMIENTO |
| A10 | No tengo forma de comparar la productividad entre reps | "no puedo comparar", "no sé quién es mejor", "todos dicen que trabajan" | A-PRODUCTIVIDAD |
| A11 | Mis reps no registran las visitas fallidas (médico no estaba, consultorio cerrado) | "solo registran las buenas", "no documentan los fallos" | A-REGISTRO |
| A12 | No sé cuántas visitas efectivas hace cada rep al día | "no tengo el número real", "dicen que muchas" | A-PRODUCTIVIDAD |
| A13 | Los reps nuevos tardan meses en conocer su territorio porque nadie documenta nada | "el nuevo no sabe nada", "tarda en arrancar", "curva de aprendizaje larga" | A-CONOCIMIENTO |
| A14 | No tengo rutas optimizadas para mis reps, pierden tiempo en traslados | "dan muchas vueltas", "ineficientes", "gastan gasolina" | A-RUTAS |

### Clusters Categoría A

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| A-VISIBILIDAD | A01, A02, A08 | "No sé qué hacen mis reps" |
| A-UBICACION | A03, A05 | "No sé dónde están" |
| A-REGISTRO | A04, A11 | "Registran tarde o mal" |
| A-COBERTURA | A06, A07 | "No siguen el plan" |
| A-CONOCIMIENTO | A09, A13 | "La información se va con ellos" |
| A-PRODUCTIVIDAD | A10, A12 | "No puedo medir rendimiento" |
| A-RUTAS | A14 | "Rutas ineficientes" |

---

## B. GESTIÓN DE CONTACTOS Y MÉDICOS (15 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| B01 | Los datos de los médicos están desactualizados (teléfonos, direcciones, horarios) | "información vieja", "teléfonos que no sirven", "ya no está ahí" | B-DATOS |
| B02 | Cada rep tiene su propia libreta/Excel con los datos de sus médicos | "cada quien tiene lo suyo", "no hay base central", "en su celular" | B-CENTRALIZACION |
| B03 | No sé cuántos médicos activos tengo en total | "no tengo el número", "nadie sabe cuántos son" | B-INVENTARIO |
| B04 | No tengo los médicos categorizados por importancia (A, B, C) | "todos son iguales", "no hay prioridad", "no sé cuáles son los buenos" | B-SEGMENTACION |
| B05 | No sé qué especialidades estoy cubriendo y cuáles no | "no tengo mapeado", "hay huecos" | B-COBERTURA |
| B06 | Cuando cambio un rep de territorio, la transición es un caos | "se pierde todo", "el nuevo no sabe nada", "caos en la transición" | B-TRANSICION |
| B07 | Hay médicos duplicados en mis registros | "el mismo médico varias veces", "duplicados", "datos sucios" | B-DATOS |
| B08 | No sé cuántos médicos nuevos hemos captado este mes/trimestre | "no mido captación", "no sé si estamos creciendo" | B-METRICAS |
| B09 | No tengo el historial completo de la relación con cada médico | "no sé qué pasó antes", "historial incompleto", "empezar de cero cada visita" | B-HISTORIAL |
| B10 | No sé las preferencias de cada médico (horarios de visita, temas de interés) | "no sé cuándo visitarlo", "no sé qué le interesa" | B-PERSONALIZACION |
| B11 | Los médicos se quejan de que nunca les damos seguimiento | "se quejan", "prometemos y no cumplimos", "no les regresamos" | B-SEGUIMIENTO |
| B12 | No sé qué médicos dejamos de visitar y por qué | "médicos perdidos", "ya no los visitamos", "no sé por qué" | B-CHURN |
| B13 | No tengo segmentado mi universo médico por potencial de prescripción | "no sé su potencial", "no tengo scoring" | B-SEGMENTACION |
| B14 | No registro los datos del consultorio/hospital/cadena donde trabaja cada médico | "solo tengo el nombre", "no sé dónde trabaja" | B-DATOS |
| B15 | No sé qué médicos atiende la competencia | "no sé quién más los visita", "la competencia" | B-COMPETENCIA |

### Clusters Categoría B

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| B-DATOS | B01, B07, B14 | "Datos desactualizados o sucios" |
| B-CENTRALIZACION | B02 | "Cada quien tiene su libreta" |
| B-INVENTARIO | B03 | "No sé cuántos médicos tengo" |
| B-SEGMENTACION | B04, B13 | "No sé cuáles son importantes" |
| B-COBERTURA | B05 | "Huecos en cobertura" |
| B-TRANSICION | B06 | "Cambiar rep es un caos" |
| B-METRICAS | B08 | "No mido captación" |
| B-HISTORIAL | B09 | "Sin historial de relación" |
| B-PERSONALIZACION | B10 | "No sé sus preferencias" |
| B-SEGUIMIENTO | B11 | "Falta seguimiento" |
| B-CHURN | B12 | "Médicos perdidos" |
| B-COMPETENCIA | B15 | "No sé de la competencia" |

---

## C. MUESTRAS MÉDICAS E INVENTARIO (14 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| C01 | No sé cuántas muestras tiene cada rep en su maletín | "no sé qué tienen", "cada quien sabe lo suyo" | C-INVENTARIO |
| C02 | Las muestras se entregan pero nadie registra a quién | "no hay registro", "se dan y ya", "no documentamos" | C-TRAZABILIDAD |
| C03 | No puedo rastrear un lote específico de muestras hasta el médico final | "no hay trazabilidad", "no sé dónde terminó", "auditoría" | C-TRAZABILIDAD |
| C04 | Los reps piden más muestras de las que necesitan | "acumulan", "piden de más", "por si acaso" | C-CONTROL |
| C05 | No sé qué productos son los más solicitados por los médicos | "no sé qué piden más", "demanda" | C-ANALISIS |
| C06 | Las muestras caducan en el maletín del rep y nadie se entera | "caducadas", "se echan a perder", "desperdicio" | C-CADUCIDAD |
| C07 | No tengo límites automáticos de entrega por médico o por rep | "dan lo que quieren", "sin límite", "abuso" | C-CONTROL |
| C08 | El proceso de solicitud de muestras al almacén es por email/teléfono | "por email", "llaman para pedir", "manual" | C-PROCESO |
| C09 | No sé el costo real de las muestras entregadas por médico | "no sé cuánto me cuesta", "costo por médico" | C-COSTOS |
| C10 | No tengo un proceso de devolución de muestras no entregadas | "no regresan", "se quedan con ellas" | C-PROCESO |
| C11 | No puedo generar el reporte de trazabilidad que me pide regulación | "auditoría", "COFEPRIS", "no tengo el reporte" | C-COMPLIANCE |
| C12 | Las muestras se usan como regalo, no como herramienta de promoción | "las regalan", "no promueven", "sin estrategia" | C-ESTRATEGIA |
| C13 | No tengo alertas de stock bajo en el almacén | "me entero cuando ya no hay", "sin alertas" | C-INVENTARIO |
| C14 | El inventario de muestras se reconcilia manualmente una vez al mes (si acaso) | "una vez al mes", "manual", "nunca cuadra" | C-INVENTARIO |

### Clusters Categoría C

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| C-INVENTARIO | C01, C13, C14 | "No sé qué muestras hay" |
| C-TRAZABILIDAD | C02, C03 | "No sé a quién se las dieron" |
| C-CONTROL | C04, C07 | "Sin límites ni control" |
| C-ANALISIS | C05 | "No sé qué piden más" |
| C-CADUCIDAD | C06 | "Se caducan" |
| C-PROCESO | C08, C10 | "Proceso manual" |
| C-COSTOS | C09 | "No sé el costo" |
| C-COMPLIANCE | C11 | "Auditoría/Regulación" |
| C-ESTRATEGIA | C12 | "Sin estrategia de muestras" |

---

## D. VENTAS Y OPORTUNIDADES COMERCIALES (15 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| D01 | Las oportunidades de venta están en la cabeza del vendedor, no en un sistema | "en la cabeza", "no hay registro", "solo él sabe" | D-VISIBILIDAD |
| D02 | No tengo un pipeline visual de mis oportunidades | "no veo el embudo", "no sé en qué etapa" | D-PIPELINE |
| D03 | No sé en qué etapa está cada negociación | "no sé cómo va", "cada quien lleva lo suyo" | D-PIPELINE |
| D04 | No sé cuánto voy a vender este mes hasta que llega el cierre | "sorpresa a fin de mes", "no puedo predecir" | D-FORECAST |
| D05 | Las cotizaciones se hacen en Word/Excel y no quedan registradas | "en Word", "no hay historial de cotizaciones" | D-COTIZACIONES |
| D06 | No tengo un proceso estándar de cotización (cada quien cotiza como quiere) | "cada quien a su manera", "no hay formato" | D-COTIZACIONES |
| D07 | Los descuentos se dan sin control ni aprobación | "descuentos locos", "sin autorización", "regalan margen" | D-DESCUENTOS |
| D08 | No sé qué oportunidades están estancadas y necesitan atención | "deals parados", "no se mueven", "olvidados" | D-SEGUIMIENTO |
| D09 | No tengo un scoring que me diga qué oportunidades tienen más probabilidad de cerrar | "no sé cuáles son las buenas", "sin prioridad" | D-SCORING |
| D10 | Pierdo oportunidades por falta de seguimiento | "se nos fueron", "no dimos seguimiento", "se enfrió" | D-SEGUIMIENTO |
| D11 | No registro por qué perdí una venta | "no sé por qué perdimos", "no documentamos" | D-ANALISIS |
| D12 | No puedo hacer forecast de ventas con precisión | "forecast poco confiable", "siempre falla" | D-FORECAST |
| D13 | No tengo precios actualizados accesibles para el equipo de ventas | "precios viejos", "no saben el precio actual" | D-PRECIOS |
| D14 | El proceso de aprobación de descuentos especiales es por WhatsApp o email | "por WhatsApp", "mandan mensaje para aprobar" | D-DESCUENTOS |
| D15 | No sé cuál es el ticket promedio por cliente | "no tengo métricas", "no sé el promedio" | D-METRICAS |

### Clusters Categoría D

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| D-VISIBILIDAD | D01 | "Oportunidades en la cabeza" |
| D-PIPELINE | D02, D03 | "Sin pipeline visual" |
| D-FORECAST | D04, D12 | "No puedo predecir ventas" |
| D-COTIZACIONES | D05, D06 | "Cotizaciones desordenadas" |
| D-DESCUENTOS | D07, D14 | "Descuentos sin control" |
| D-SEGUIMIENTO | D08, D10 | "Oportunidades abandonadas" |
| D-SCORING | D09 | "No sé cuáles priorizar" |
| D-ANALISIS | D11 | "No sé por qué pierdo" |
| D-PRECIOS | D13 | "Precios desactualizados" |
| D-METRICAS | D15 | "Sin métricas de venta" |

---

## E. COBRANZA Y FINANZAS (12 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| E01 | Hay facturas vencidas que nadie está cobrando | "facturas olvidadas", "nadie cobra", "se acumulan" | E-SEGUIMIENTO |
| E02 | No sé la antigüedad de mis cuentas por cobrar | "no sé hace cuánto", "antigüedad de saldos" | E-VISIBILIDAD |
| E03 | Los recordatorios de pago se hacen manualmente (o no se hacen) | "llamamos uno por uno", "no hay recordatorios" | E-AUTOMATIZACION |
| E04 | No sé qué clientes son buenos pagadores y cuáles no | "no tengo historial", "todos igual" | E-SCORING |
| E05 | Me entero de que una factura venció cuando ya pasaron 60 días | "me entero tarde", "ya venció hace rato" | E-ALERTAS |
| E06 | No tengo un proceso escalonado de cobranza (recordatorio → llamada → escalamiento) | "no hay proceso", "improvisamos" | E-PROCESO |
| E07 | No puedo ver en un solo lugar todo lo que me deben | "disperso", "no hay vista consolidada" | E-VISIBILIDAD |
| E08 | Las promesas de pago no se registran ni se dan seguimiento | "prometen y no pagan", "no documentamos" | E-SEGUIMIENTO |
| E09 | No sé el impacto de la morosidad en mi flujo de caja | "no mido el impacto", "flujo de caja" | E-ANALISIS |
| E10 | El equipo de ventas no sabe que su cliente tiene facturas vencidas cuando lo visita | "venden a morosos", "no se enteran" | E-COMUNICACION |
| E11 | No tengo reportes de cobranza automáticos | "hago el reporte a mano", "Excel" | E-REPORTES |
| E12 | No sé cuánto tiempo promedio tardan en pagarme | "DSO", "días de cobro", "no tengo la métrica" | E-METRICAS |

### Clusters Categoría E

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| E-SEGUIMIENTO | E01, E08 | "Facturas sin cobrar" |
| E-VISIBILIDAD | E02, E07 | "No veo lo que me deben" |
| E-AUTOMATIZACION | E03 | "Recordatorios manuales" |
| E-SCORING | E04 | "No sé quién paga bien" |
| E-ALERTAS | E05 | "Me entero tarde" |
| E-PROCESO | E06 | "Sin proceso de cobranza" |
| E-ANALISIS | E09 | "Impacto en flujo" |
| E-COMUNICACION | E10 | "Ventas no sabe de morosos" |
| E-REPORTES | E11 | "Reportes manuales" |
| E-METRICAS | E12 | "Sin métricas de cobro" |

---

## F. REPORTES E INFORMACIÓN PARA DECISIONES (14 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| F01 | Tardo días en armar un reporte para dirección | "me toma días", "semanas para un reporte" | F-TIEMPO |
| F02 | Los reportes se hacen en Excel y cada vez son diferentes | "en Excel", "cada vez distinto", "no hay formato" | F-ESTANDARIZACION |
| F03 | No tengo KPIs definidos ni forma de medirlos automáticamente | "no tengo KPIs", "no sé qué medir" | F-KPIS |
| F04 | No puedo comparar el desempeño de este mes con el anterior fácilmente | "comparar es difícil", "no tengo histórico" | F-COMPARATIVOS |
| F05 | El dueño/director pide información y nadie la tiene lista | "siempre corremos", "no está lista", "improvisar" | F-DISPONIBILIDAD |
| F06 | No tengo dashboards que me muestren el estado del negocio en tiempo real | "no hay dashboard", "no veo en tiempo real" | F-DASHBOARDS |
| F07 | Los reportes que tengo no separan la información por territorio/producto/rep | "todo junto", "no puedo filtrar", "sin desglose" | F-SEGMENTACION |
| F08 | No puedo ver tendencias, solo fotos del momento | "solo el hoy", "sin tendencias", "no veo hacia dónde va" | F-TENDENCIAS |
| F09 | Mis reportes no incluyen información predictiva | "no predice", "solo histórico", "quisiera saber qué va a pasar" | F-PREDICCION |
| F10 | No tengo forma de medir la efectividad de las visitas | "no sé si las visitas sirven", "ROI de visitas" | F-EFECTIVIDAD |
| F11 | No puedo cruzar datos de visitas con datos de ventas | "no cruzo información", "silos de datos" | F-INTEGRACION |
| F12 | Me llegan los problemas cuando ya es tarde para actuar | "me entero tarde", "reactivo", "ya pasó" | F-ALERTAS |
| F13 | No tengo reportes automáticos que se envíen solos | "los hago a mano", "nadie los manda" | F-AUTOMATIZACION |
| F14 | Cada gerente calcula los números de forma diferente (no hay fuente única) | "cada quien sus números", "no cuadran", "sin fuente única" | F-FUENTE_UNICA |

### Clusters Categoría F

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| F-TIEMPO | F01 | "Reportes tardan días" |
| F-ESTANDARIZACION | F02 | "Cada reporte es diferente" |
| F-KPIS | F03 | "Sin KPIs definidos" |
| F-COMPARATIVOS | F04 | "No puedo comparar" |
| F-DISPONIBILIDAD | F05 | "Información no disponible" |
| F-DASHBOARDS | F06 | "Sin dashboards" |
| F-SEGMENTACION | F07 | "Sin desglose" |
| F-TENDENCIAS | F08 | "Sin tendencias" |
| F-PREDICCION | F09 | "Sin predicción" |
| F-EFECTIVIDAD | F10 | "No mido efectividad" |
| F-INTEGRACION | F11 | "Datos no se cruzan" |
| F-ALERTAS | F12 | "Problemas llegan tarde" |
| F-AUTOMATIZACION | F13 | "Reportes manuales" |
| F-FUENTE_UNICA | F14 | "Cada quien sus números" |

---

## G. TECNOLOGÍA Y SISTEMAS ACTUALES (13 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| G01 | Todo está en Excel y cada quien tiene su propia versión | "en Excel", "cada quien su archivo", "versiones" | G-EXCEL |
| G02 | Tenemos un ERP pero no está conectado con nada más | "ERP aislado", "no se conecta", "isla" | G-INTEGRACION |
| G03 | Compramos un CRM pero nadie lo usa porque es complicado | "nadie lo usa", "muy complicado", "abandonado" | G-ADOPCION |
| G04 | La información está dispersa en 5 sistemas diferentes | "en varios sistemas", "disperso", "no centralizado" | G-FRAGMENTACION |
| G05 | No tenemos una app móvil para el equipo de campo | "sin app", "todo en web", "no funciona en móvil" | G-MOVIL |
| G06 | Nuestro sistema actual no funciona sin internet | "sin internet no sirve", "necesita conexión", "offline no" | G-OFFLINE |
| G07 | El sistema que tenemos está obsoleto y ya no tiene soporte | "obsoleto", "sin soporte", "viejo" | G-OBSOLESCENCIA |
| G08 | Pagamos por un sistema que usamos al 10% | "pagamos de más", "no lo usamos", "desperdicio" | G-ADOPCION |
| G09 | Dependemos de una persona para sacar información del sistema | "solo él sabe", "dependemos de uno", "si se va..." | G-DEPENDENCIA |
| G10 | No tenemos API para conectar nuestros sistemas | "sin API", "no se puede conectar", "cerrado" | G-INTEGRACION |
| G11 | La migración de datos desde nuestro sistema actual nos da miedo | "miedo a migrar", "perder datos", "riesgo" | G-MIGRACION |
| G12 | No tenemos backup de nuestra información | "sin respaldo", "no hay backup", "si se pierde..." | G-SEGURIDAD |
| G13 | Cada departamento usa herramientas diferentes que no se conectan | "cada quien lo suyo", "herramientas diferentes" | G-FRAGMENTACION |

### Clusters Categoría G

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| G-EXCEL | G01 | "Todo en Excel" |
| G-INTEGRACION | G02, G10 | "Sistemas no conectados" |
| G-ADOPCION | G03, G08 | "CRM que nadie usa" |
| G-FRAGMENTACION | G04, G13 | "Información dispersa" |
| G-MOVIL | G05 | "Sin app móvil" |
| G-OFFLINE | G06 | "No funciona sin internet" |
| G-OBSOLESCENCIA | G07 | "Sistema obsoleto" |
| G-DEPENDENCIA | G09 | "Dependemos de una persona" |
| G-MIGRACION | G11 | "Miedo a migrar" |
| G-SEGURIDAD | G12 | "Sin respaldos" |

---

## H. COMUNICACIÓN Y COLABORACIÓN INTERNA (9 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| H01 | Las instrucciones del gerente al equipo se pierden en WhatsApp | "en WhatsApp", "se pierden mensajes", "no hay registro" | H-CANALES |
| H02 | No hay un canal oficial para comunicar cambios de precios, promociones, etc. | "no sé por dónde comunicar", "se enteran por otros" | H-CANALES |
| H03 | Los supervisores no tienen forma de dar retroalimentación estructurada a los reps | "feedback informal", "no hay proceso", "cuando se acuerdan" | H-FEEDBACK |
| H04 | Las solicitudes de aprobación (descuentos, muestras extra) van por WhatsApp | "por WhatsApp", "por mensaje", "no hay flujo" | H-APROBACIONES |
| H05 | No tenemos un proceso formal de coaching/acompañamiento de reps | "sin coaching", "no hay desarrollo", "cada quien aprende solo" | H-DESARROLLO |
| H06 | Las reuniones de equipo son la única forma de saber qué está pasando | "solo en las juntas", "si no hay junta, no sé" | H-VISIBILIDAD |
| H07 | Los objetivos del mes se comunican verbalmente y se olvidan | "verbal", "se olvidan", "no quedan escritos" | H-OBJETIVOS |
| H08 | No hay visibilidad de lo que hacen otros equipos/territorios | "no sé qué hacen los otros", "silos" | H-VISIBILIDAD |
| H09 | La información se queda en silos (ventas no sabe lo que hace marketing y viceversa) | "silos", "no se comparte", "cada área lo suyo" | H-SILOS |

### Clusters Categoría H

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| H-CANALES | H01, H02 | "Comunicación dispersa" |
| H-FEEDBACK | H03 | "Sin retroalimentación" |
| H-APROBACIONES | H04 | "Aprobaciones por WhatsApp" |
| H-DESARROLLO | H05 | "Sin coaching formal" |
| H-VISIBILIDAD | H06, H08 | "Solo sé en las juntas" |
| H-OBJETIVOS | H07 | "Objetivos verbales" |
| H-SILOS | H09 | "Departamentos aislados" |

---

## I. RELACIÓN CON CLIENTES / MÉDICOS POST-VENTA (12 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| I01 | Los médicos no tienen forma de contactarnos fácilmente | "no saben cómo contactarnos", "solo cuando viene el rep" | I-ACCESO |
| I02 | No tenemos un portal donde el médico pueda solicitar muestras | "tienen que llamar", "dependen del rep", "sin autoservicio" | I-AUTOSERVICIO |
| I03 | Los compromisos que hacemos con los médicos no se registran | "promesas no documentadas", "se olvidan" | I-COMPROMISOS |
| I04 | No damos seguimiento a las solicitudes de los médicos | "pedían algo y no se dio", "sin seguimiento" | I-SEGUIMIENTO |
| I05 | Los médicos reciben visitas pero no material científico de valor | "solo visitas vacías", "sin contenido", "no aportan" | I-VALOR |
| I06 | No sabemos qué médicos están prescribiendo nuestros productos | "no sé quién prescribe", "no tengo datos de prescripción" | I-PRESCRIPCION |
| I07 | No tenemos forma de medir la satisfacción de nuestros clientes | "no preguntamos", "no medimos satisfacción" | I-SATISFACCION |
| I08 | Los médicos se enteran de productos nuevos por la competencia, no por nosotros | "la competencia les cuenta", "llegamos tarde" | I-COMUNICACION |
| I09 | No tenemos un programa de fidelización o incentivos para médicos | "sin programa", "no fidelizamos" | I-FIDELIZACION |
| I10 | No personalizamos la comunicación según los intereses del médico | "todo igual para todos", "sin personalización" | I-PERSONALIZACION |
| I11 | El médico tiene que repetir su información cada vez que cambia de rep | "empezar de cero", "no saben nada de mí" | I-CONTINUIDAD |
| I12 | No enviamos recordatorios proactivos de reabastecimiento | "se les acaba y no avisamos", "reactivos" | I-PROACTIVIDAD |

### Clusters Categoría I

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| I-ACCESO | I01 | "No pueden contactarnos" |
| I-AUTOSERVICIO | I02 | "Sin portal de autoservicio" |
| I-COMPROMISOS | I03 | "Promesas sin registrar" |
| I-SEGUIMIENTO | I04 | "Sin seguimiento a solicitudes" |
| I-VALOR | I05 | "Visitas sin valor" |
| I-PRESCRIPCION | I06 | "No sé quién prescribe" |
| I-SATISFACCION | I07 | "No mido satisfacción" |
| I-COMUNICACION | I08 | "Competencia comunica mejor" |
| I-FIDELIZACION | I09 | "Sin programa de fidelización" |
| I-PERSONALIZACION | I10 | "Todo genérico" |
| I-CONTINUIDAD | I11 | "Repetir info con cada rep" |
| I-PROACTIVIDAD | I12 | "Sin recordatorios proactivos" |

---

## J. MARKETING Y MATERIAL PROMOCIONAL (8 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| J01 | No sé qué material promocional funciona mejor | "no mido qué funciona", "todo igual" | J-EFECTIVIDAD |
| J02 | Los reps no llevan el material actualizado | "material viejo", "desactualizado", "versiones anteriores" | J-ACTUALIZACION |
| J03 | No tengo forma de enviar material digital al médico después de la visita | "solo físico", "no puedo enviar después" | J-DIGITAL |
| J04 | No mido el impacto de las campañas promocionales en las ventas | "no sé si la campaña funcionó", "sin ROI" | J-ROI |
| J05 | El material de marketing se crea sin input del equipo de campo | "marketing no pregunta", "desconectados" | J-ALINEACION |
| J06 | No tenemos catálogo digital de productos actualizado | "sin catálogo digital", "PDF viejo" | J-CATALOGO |
| J07 | Las presentaciones de producto son las mismas para todos los médicos | "misma presentación", "sin personalizar" | J-PERSONALIZACION |
| J08 | No sé qué productos promover con qué especialidad | "promueven lo que sea", "sin estrategia" | J-ESTRATEGIA |

### Clusters Categoría J

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| J-EFECTIVIDAD | J01 | "No sé qué funciona" |
| J-ACTUALIZACION | J02 | "Material desactualizado" |
| J-DIGITAL | J03 | "Sin material digital" |
| J-ROI | J04 | "Sin ROI de campañas" |
| J-ALINEACION | J05 | "Marketing desconectado" |
| J-CATALOGO | J06 | "Sin catálogo digital" |
| J-PERSONALIZACION | J07 | "Presentaciones genéricas" |
| J-ESTRATEGIA | J08 | "Sin estrategia de promoción" |

---

## K. PLANIFICACIÓN Y ESTRATEGIA (10 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| K01 | No tengo un plan de visitas basado en potencial del médico | "visitan sin plan", "no hay prioridad" | K-PLANIFICACION |
| K02 | Los territorios están mal distribuidos (unos reps tienen mucho, otros poco) | "mal repartido", "unos con mucho, otros con nada" | K-TERRITORIOS |
| K03 | No puedo simular escenarios ("qué pasa si añado 2 reps") | "no puedo simular", "sin escenarios" | K-SIMULACION |
| K04 | No tengo objetivos claros por rep/territorio/producto | "objetivos vagos", "no están claros" | K-OBJETIVOS |
| K05 | La planificación del mes se hace sobre la marcha | "improvisamos", "sin plan", "día a día" | K-PLANIFICACION |
| K06 | No sé cuál es mi costo por visita | "no sé cuánto cuesta una visita", "sin métrica de costo" | K-COSTOS |
| K07 | No tengo una estrategia de cobertura por segmento | "sin estrategia de cobertura", "todo igual" | K-COBERTURA |
| K08 | No puedo medir el ROI de mi fuerza de ventas | "no sé si rinden", "ROI de equipo" | K-ROI |
| K09 | No tengo forma de priorizar a qué clientes dedicar más tiempo | "todos igual", "sin priorización" | K-PRIORIZACION |
| K10 | La cuota de ventas se asigna sin datos reales | "cuota al azar", "sin fundamento", "porque sí" | K-CUOTAS |

### Clusters Categoría K

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| K-PLANIFICACION | K01, K05 | "Sin plan de visitas" |
| K-TERRITORIOS | K02 | "Territorios mal distribuidos" |
| K-SIMULACION | K03 | "No puedo simular" |
| K-OBJETIVOS | K04 | "Objetivos no claros" |
| K-COSTOS | K06 | "No sé el costo por visita" |
| K-COBERTURA | K07 | "Sin estrategia de cobertura" |
| K-ROI | K08 | "Sin ROI de equipo" |
| K-PRIORIZACION | K09 | "Sin priorización" |
| K-CUOTAS | K10 | "Cuotas sin fundamento" |

---

## L. PROCESOS REGULATORIOS Y COMPLIANCE (8 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| L01 | No puedo demostrar ante reguladores a quién le di qué muestra | "no tengo prueba", "auditoría", "COFEPRIS" | L-TRAZABILIDAD |
| L02 | No tengo trazabilidad de lotes hasta el destinatario final | "no sé dónde terminó", "lotes perdidos" | L-TRAZABILIDAD |
| L03 | No cumplo con los registros que me exige la normativa de muestras médicas | "no cumplo", "normativa", "fuera de regla" | L-NORMATIVA |
| L04 | No tengo políticas de visita documentadas ni auditables | "sin políticas", "no está escrito" | L-POLITICAS |
| L05 | No puedo generar los reportes que me piden en una auditoría rápidamente | "auditoría = pánico", "tardo días" | L-REPORTES |
| L06 | No tengo control de quién accede a qué información (permisos) | "todos ven todo", "sin permisos" | L-PERMISOS |
| L07 | Los datos personales de los médicos no están protegidos según RGPD/LOPD | "sin protección de datos", "RGPD", "privacidad" | L-PRIVACIDAD |
| L08 | No tengo un log de quién modificó qué dato y cuándo | "sin registro de cambios", "no sé quién cambió" | L-AUDITORIA |

### Clusters Categoría L

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| L-TRAZABILIDAD | L01, L02 | "Sin trazabilidad" |
| L-NORMATIVA | L03 | "No cumplo normativa" |
| L-POLITICAS | L04 | "Sin políticas documentadas" |
| L-REPORTES | L05 | "Auditoría = pánico" |
| L-PERMISOS | L06 | "Sin control de acceso" |
| L-PRIVACIDAD | L07 | "Sin protección de datos" |
| L-AUDITORIA | L08 | "Sin log de cambios" |

---

## M. RECURSOS HUMANOS Y EQUIPO (7 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| M01 | La rotación de reps es alta y cada vez que se va uno empezamos de cero | "rotación alta", "se van y empezamos de nuevo" | M-ROTACION |
| M02 | No tengo métricas objetivas para evaluar el desempeño de mis reps | "evaluación subjetiva", "sin métricas" | M-EVALUACION |
| M03 | El onboarding de un rep nuevo tarda semanas porque no hay información documentada | "onboarding lento", "tarda en arrancar" | M-ONBOARDING |
| M04 | No tengo un programa de capacitación continua | "sin capacitación", "aprenden solos" | M-CAPACITACION |
| M05 | No sé qué habilidades le faltan a cada rep | "no sé qué reforzar", "gaps de habilidades" | M-DESARROLLO |
| M06 | Las comisiones se calculan manualmente y siempre hay errores | "comisiones a mano", "errores en pago", "reclamos" | M-COMISIONES |
| M07 | No tengo visibilidad del estado emocional/motivación del equipo | "no sé cómo están", "motivación", "engagement" | M-MOTIVACION |

### Clusters Categoría M

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| M-ROTACION | M01 | "Alta rotación" |
| M-EVALUACION | M02 | "Evaluación subjetiva" |
| M-ONBOARDING | M03 | "Onboarding lento" |
| M-CAPACITACION | M04 | "Sin capacitación" |
| M-DESARROLLO | M05 | "No sé qué reforzar" |
| M-COMISIONES | M06 | "Comisiones con errores" |
| M-MOTIVACION | M07 | "No sé cómo está el equipo" |

---

## N. GESTIÓN DE EVENTOS Y ACTIVIDADES ESPECIALES (5 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| N01 | Organizo congresos/eventos pero no registro la asistencia de médicos | "no sé quién vino", "sin registro" | N-REGISTRO |
| N02 | No doy seguimiento a los médicos que asisten a mis eventos | "vienen y ya", "sin seguimiento post-evento" | N-SEGUIMIENTO |
| N03 | No mido el ROI de los eventos que organizo | "no sé si valió la pena", "sin ROI" | N-ROI |
| N04 | La logística de eventos (inscripciones, materiales, seguimiento) es manual | "todo manual", "Excel para eventos" | N-LOGISTICA |
| N05 | No tengo un calendario centralizado de eventos del sector | "no sé qué eventos hay", "me entero tarde" | N-CALENDARIO |

### Clusters Categoría N

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| N-REGISTRO | N01 | "Sin registro de asistencia" |
| N-SEGUIMIENTO | N02 | "Sin seguimiento post-evento" |
| N-ROI | N03 | "Sin ROI de eventos" |
| N-LOGISTICA | N04 | "Logística manual" |
| N-CALENDARIO | N05 | "Sin calendario de eventos" |

---

## O. COMPETENCIA Y MERCADO (5 dolores)

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| O01 | No registro información sobre lo que hace la competencia | "no documento", "se me olvida" | O-INTELIGENCIA |
| O02 | No sé qué productos de la competencia están ganando terreno | "no sé qué venden", "perdiendo share" | O-PRODUCTOS |
| O03 | Los reps escuchan información del mercado pero no la registran | "info se pierde", "no documentan" | O-REGISTRO |
| O04 | No tengo un análisis de participación de mercado por zona | "sin market share", "sin análisis" | O-ANALISIS |
| O05 | No sé por qué los médicos prefieren a la competencia en ciertos territorios | "perdemos vs competencia", "no sé por qué" | O-INSIGHTS |

### Clusters Categoría O

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| O-INTELIGENCIA | O01 | "Sin registro de competencia" |
| O-PRODUCTOS | O02 | "No sé qué venden" |
| O-REGISTRO | O03 | "Info se pierde" |
| O-ANALISIS | O04 | "Sin análisis de mercado" |
| O-INSIGHTS | O05 | "No sé por qué prefieren a otros" |

---

## P. AUTOMATIZACIÓN E IA (NUEVO - 8 dolores)

*Dolores que la IA resuelve directamente pero que el usuario no sabe nombrar*

| Código | Dolor | Señales de Detección | Cluster |
|--------|-------|---------------------|---------|
| P01 | Paso demasiado tiempo llenando formularios en el CRM | "mucho tiempo registrando", "formularios eternos", "quita tiempo" | P-TIEMPO |
| P02 | No tengo tiempo para preparar cada visita | "voy sin preparar", "improviso", "no me da tiempo" | P-PREPARACION |
| P03 | Los informes los hago a mano cada semana | "horas en reportes", "cada semana lo mismo" | P-REPORTES |
| P04 | No sé qué decirle a cada médico, voy sin contexto | "no sé qué pasó antes", "sin briefing" | P-CONTEXTO |
| P05 | Quisiera dictar las visitas en lugar de escribir | "escribir es lento", "mejor hablar", "voz" | P-VOZ |
| P06 | Nadie me avisa cuando algo importante pasa | "me entero tarde", "sin alertas" | P-ALERTAS |
| P07 | Quisiera que el sistema hiciera cosas solo, sin que yo tenga que pedirlo | "automático", "que se haga solo" | P-AUTOMATICO |
| P08 | No tengo sugerencias de qué hacer, tengo que pensar todo | "sin sugerencias", "yo tengo que decidir todo" | P-SUGERENCIAS |

### Clusters Categoría P

| Cluster | Dolores | Descripción Corta |
|---------|---------|-------------------|
| P-TIEMPO | P01 | "Mucho tiempo registrando" |
| P-PREPARACION | P02 | "Sin tiempo para preparar" |
| P-REPORTES | P03 | "Reportes manuales semanales" |
| P-CONTEXTO | P04 | "Voy sin contexto" |
| P-VOZ | P05 | "Prefiero dictar" |
| P-ALERTAS | P06 | "Sin alertas proactivas" |
| P-AUTOMATICO | P07 | "Quiero que se haga solo" |
| P-SUGERENCIAS | P08 | "Sin sugerencias de acción" |

---

# PARTE 2: MAPEO DOLORES → FOCOS TÍPICOS

## Familias de Solución

Cuando el usuario marca varios dolores, estos se agrupan naturalmente en "focos" que tienen sentido como proyecto:

| FOCO TÍPICO | Dolores Principales | Experiencias APEX |
|-------------|---------------------|-------------------|
| **"Quiero saber qué hace mi equipo"** | A01-A14, F06, F10, P04 | Representante, Supervisor |
| **"Mis muestras son un caos"** | C01-C14, L01-L03 | Representante, Admin |
| **"No tengo visibilidad de ventas"** | D01-D15, F04, F11, F12 | Comercial, Director |
| **"La cobranza está descontrolada"** | E01-E12 | Comercial |
| **"Mis reportes son manuales"** | F01-F14, P03 | Supervisor, Director |
| **"Quiero que mi equipo use el CRM"** | G03, G08, A04, P01, P05 | Representante (WhatsApp-First) |
| **"No tengo historial de mis médicos"** | B01-B15, I03, I04, I11 | Representante, Médico |
| **"Necesito cumplir con regulación"** | L01-L08, C11 | Admin, Compliance |
| **"Quiero automatizar con IA"** | P01-P08 | Todas (IA transversal) |
| **"Mis eventos no generan seguimiento"** | N01-N05, J01-J08 | Supervisor, Director |

---

# PARTE 3: MAPEO DOLORES → EXPERIENCIAS APEX

| Experiencia | Dolores que Resuelve Directamente |
|-------------|-----------------------------------|
| **Representante** | A01-A14, B09-B11, C01-C02, C06-C07, P01-P05 |
| **Supervisor** | A01-A14, F01-F14, H03, H05, M02, K01-K02 |
| **Director** | D04, D12, E09, F01-F14, K03, K06, K08 |
| **Comercial** | D01-D15, E01-E12 |
| **Médico** | I01-I12, B11 |
| **Admin** | G01-G13, L01-L08, H04 |

---

# PARTE 4: MAPEO DOLORES → COMPONENTES TÉCNICOS

| Componente APEX | Dolores que Resuelve |
|-----------------|---------------------|
| **Contactos/HCPs** | B01-B15 |
| **Actividad/Visitas** | A01-A14 |
| **Inventario Muestras** | C01-C14 |
| **Pipeline Comercial** | D01-D15 |
| **Cobranza/Cartera** | E01-E12 |
| **Reportes/Dashboards** | F01-F14 |
| **WhatsApp Channel** | P01, P05, G03, G08 |
| **Motor de IA** | P01-P08, F09, F13, D09 |
| **Motor de Compliance** | L01-L08, C11 |
| **Portal Externo** | I01-I02, I12 |

---

# PARTE 5: NIVELES DE PRIORIDAD PARA EXPLORACIÓN

## Nivel 1: Siempre Explorar (Críticos)

Estos dolores aplican al 90%+ de los prospectos:

- **A (Visibilidad equipo)** — Si tiene equipo de campo
- **D (Ventas)** — Siempre
- **E (Cobranza)** — Si vende a crédito
- **F (Reportes)** — Siempre

## Nivel 2: Explorar si Aplica (Importantes)

- **C (Muestras)** — Solo si es farmacéutico con visita médica
- **B (Contactos)** — Siempre relevante pero secundario
- **G (Tecnología)** — Para entender situación actual
- **L (Compliance)** — Solo si es farmacéutico regulado

## Nivel 3: Explorar si Menciona (Complementarios)

- **H (Comunicación)** — Si el usuario lo trae
- **I (Relación clientes)** — Para empresas maduras
- **J (Marketing)** — Si tienen equipo de marketing
- **K (Planificación)** — Para empresas más grandes
- **M (RRHH)** — Si mencionan rotación o equipo
- **N (Eventos)** — Solo si organizan eventos
- **O (Competencia)** — Para mercados competitivos
- **P (Automatización)** — Detectar señales pasivas

---

# PARTE 6: RESUMEN ESTADÍSTICO

| Categoría | Código | Cantidad | Clusters |
|-----------|--------|----------|----------|
| A. Visibilidad del equipo | A01-A14 | 14 | 7 |
| B. Contactos y médicos | B01-B15 | 15 | 12 |
| C. Muestras e inventario | C01-C14 | 14 | 9 |
| D. Ventas y oportunidades | D01-D15 | 15 | 10 |
| E. Cobranza y finanzas | E01-E12 | 12 | 10 |
| F. Reportes e información | F01-F14 | 14 | 14 |
| G. Tecnología y sistemas | G01-G13 | 13 | 10 |
| H. Comunicación interna | H01-H09 | 9 | 7 |
| I. Relación con clientes | I01-I12 | 12 | 12 |
| J. Marketing y promoción | J01-J08 | 8 | 8 |
| K. Planificación y estrategia | K01-K10 | 10 | 9 |
| L. Regulatorio y compliance | L01-L08 | 8 | 7 |
| M. RRHH y equipo | M01-M07 | 7 | 7 |
| N. Eventos | N01-N05 | 5 | 5 |
| O. Competencia | O01-O05 | 5 | 5 |
| P. Automatización e IA | P01-P08 | 8 | 8 |
| **TOTAL** | | **169** | **140** |

---

*Versión 1.1 — Febrero 2026*

*© 2026 APEX - Prisma. Documento interno.*
