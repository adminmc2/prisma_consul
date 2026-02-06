/**
 * APEX Discovery Form - JavaScript
 * Integración con Groq AI para preguntas adaptativas y detección de dolores
 *
 * NUEVO: Investigación profunda de empresa antes de preguntas
 *
 * Modelos usados:
 * - Llama 3.3 70B Versatile: Investigación, generación de preguntas y detección de pains
 * - Whisper Large v3 Turbo: Transcripción de audio
 */

// ============================================================
// CONFIGURACIÓN
// ============================================================

const CONFIG = {
  // Netlify Functions (proxy seguro para Groq API)
  chatApiUrl: '/.netlify/functions/groq-chat',
  whisperApiUrl: '/.netlify/functions/groq-whisper',
  submitApiUrl: '/.netlify/functions/submit-form',
  researchApiUrl: '/.netlify/functions/research-company',

  // Modelos
  groqModel: 'llama-3.3-70b-versatile',
  whisperModel: 'whisper-large-v3-turbo',

  // Animaciones
  transitionDuration: 400,
  loadingMinDuration: 2000,

  // Audio
  maxAudioDuration: 180, // 3 minutos
  minAudioDuration: 10,  // 10 segundos mínimo
};

// ============================================================
// BASE DE CONOCIMIENTO COMPLETA DE DOLORES (169 dolores)
// ============================================================

const PAIN_CATALOG = {
  // ==================== A. VISIBILIDAD Y CONTROL DEL EQUIPO (14) ====================
  'A01': { cluster: 'A-VISIBILIDAD', title: 'No sé qué hacen mis representantes durante el día', signals: ['no tengo visibilidad', 'no me reportan', 'cada quien hace lo suyo'], focus: 1 },
  'A02': { cluster: 'A-VISIBILIDAD', title: 'No sé si mis reps realmente visitaron al médico', signals: ['no puedo verificar', 'confío en su palabra', 'no hay forma de saber'], focus: 1 },
  'A03': { cluster: 'A-UBICACION', title: 'No tengo forma de saber dónde están mis reps en tiempo real', signals: ['no sé dónde andan', 'se supone que están en campo'], focus: 1 },
  'A04': { cluster: 'A-REGISTRO', title: 'Mis reps registran las visitas al final del día y se les olvida', signals: ['registran después', 'se les olvida', 'al final del día'], focus: 1 },
  'A05': { cluster: 'A-UBICACION', title: 'No sé cuánto tiempo pasa cada rep en cada visita', signals: ['no sé si realmente estuvo', 'pudo haber sido 5 minutos'], focus: 1 },
  'A06': { cluster: 'A-COBERTURA', title: 'Mis reps visitan a los médicos que les caen bien, no a los correctos', signals: ['visitan a sus amigos', 'los fáciles', 'no siguen la ruta'], focus: 1 },
  'A07': { cluster: 'A-COBERTURA', title: 'Mis reps trabajan sin agenda, van donde quieren', signals: ['sin plan', 'improvisan', 'no hay ruta'], focus: 1 },
  'A08': { cluster: 'A-VISIBILIDAD', title: 'No tengo cómo verificar que un rep realmente estuvo en el consultorio', signals: ['no hay prueba', 'me tengo que creer', 'no hay evidencia'], focus: 1 },
  'A09': { cluster: 'A-CONOCIMIENTO', title: 'Cuando un rep se va de la empresa, se lleva toda la información', signals: ['se fue y perdimos todo', 'no dejó nada documentado', 'empezar de cero'], focus: 1 },
  'A10': { cluster: 'A-PRODUCTIVIDAD', title: 'No tengo forma de comparar la productividad entre reps', signals: ['no puedo comparar', 'no sé quién es mejor', 'todos dicen que trabajan'], focus: 1 },
  'A11': { cluster: 'A-REGISTRO', title: 'Mis reps no registran las visitas fallidas', signals: ['solo registran las buenas', 'no documentan los fallos'], focus: 1 },
  'A12': { cluster: 'A-PRODUCTIVIDAD', title: 'No sé cuántas visitas efectivas hace cada rep al día', signals: ['no tengo el número real', 'dicen que muchas'], focus: 1 },
  'A13': { cluster: 'A-CONOCIMIENTO', title: 'Los reps nuevos tardan meses en conocer su territorio', signals: ['el nuevo no sabe nada', 'tarda en arrancar', 'curva de aprendizaje larga'], focus: 1 },
  'A14': { cluster: 'A-RUTAS', title: 'No tengo rutas optimizadas para mis reps', signals: ['dan muchas vueltas', 'ineficientes', 'gastan gasolina'], focus: 1 },

  // ==================== B. GESTIÓN DE CONTACTOS Y MÉDICOS (15) ====================
  'B01': { cluster: 'B-DATOS', title: 'Los datos de los médicos están desactualizados', signals: ['información vieja', 'teléfonos que no sirven', 'ya no está ahí'], focus: 2 },
  'B02': { cluster: 'B-CENTRALIZACION', title: 'Cada rep tiene su propia libreta/Excel con los datos', signals: ['cada quien tiene lo suyo', 'no hay base central', 'en su celular'], focus: 2 },
  'B03': { cluster: 'B-INVENTARIO', title: 'No sé cuántos médicos activos tengo en total', signals: ['no tengo el número', 'nadie sabe cuántos son'], focus: 2 },
  'B04': { cluster: 'B-SEGMENTACION', title: 'No tengo los médicos categorizados por importancia', signals: ['todos son iguales', 'no hay prioridad', 'no sé cuáles son los buenos'], focus: 2 },
  'B05': { cluster: 'B-COBERTURA', title: 'No sé qué especialidades estoy cubriendo y cuáles no', signals: ['no tengo mapeado', 'hay huecos'], focus: 2 },
  'B06': { cluster: 'B-TRANSICION', title: 'Cuando cambio un rep de territorio, la transición es un caos', signals: ['se pierde todo', 'el nuevo no sabe nada', 'caos en la transición'], focus: 2 },
  'B07': { cluster: 'B-DATOS', title: 'Hay médicos duplicados en mis registros', signals: ['el mismo médico varias veces', 'duplicados', 'datos sucios'], focus: 2 },
  'B08': { cluster: 'B-METRICAS', title: 'No sé cuántos médicos nuevos hemos captado este mes', signals: ['no mido captación', 'no sé si estamos creciendo'], focus: 2 },
  'B09': { cluster: 'B-HISTORIAL', title: 'No tengo el historial completo de la relación con cada médico', signals: ['no sé qué pasó antes', 'historial incompleto', 'empezar de cero cada visita'], focus: 2 },
  'B10': { cluster: 'B-PERSONALIZACION', title: 'No sé las preferencias de cada médico', signals: ['no sé cuándo visitarlo', 'no sé qué le interesa'], focus: 2 },
  'B11': { cluster: 'B-SEGUIMIENTO', title: 'Los médicos se quejan de que nunca les damos seguimiento', signals: ['se quejan', 'prometemos y no cumplimos', 'no les regresamos'], focus: 2 },
  'B12': { cluster: 'B-CHURN', title: 'No sé qué médicos dejamos de visitar y por qué', signals: ['médicos perdidos', 'ya no los visitamos', 'no sé por qué'], focus: 2 },
  'B13': { cluster: 'B-SEGMENTACION', title: 'No tengo segmentado mi universo médico por potencial', signals: ['no sé su potencial', 'no tengo scoring'], focus: 2 },
  'B14': { cluster: 'B-DATOS', title: 'No registro los datos del consultorio/hospital donde trabaja', signals: ['solo tengo el nombre', 'no sé dónde trabaja'], focus: 2 },
  'B15': { cluster: 'B-COMPETENCIA', title: 'No sé qué médicos atiende la competencia', signals: ['no sé quién más los visita', 'la competencia'], focus: 2 },

  // ==================== C. MUESTRAS MÉDICAS E INVENTARIO (14) ====================
  'C01': { cluster: 'C-INVENTARIO', title: 'No sé cuántas muestras tiene cada rep en su maletín', signals: ['no sé qué tienen', 'cada quien sabe lo suyo'], focus: 3 },
  'C02': { cluster: 'C-TRAZABILIDAD', title: 'Las muestras se entregan pero nadie registra a quién', signals: ['no hay registro', 'se dan y ya', 'no documentamos'], focus: 3 },
  'C03': { cluster: 'C-TRAZABILIDAD', title: 'No puedo rastrear un lote específico de muestras', signals: ['no hay trazabilidad', 'no sé dónde terminó', 'auditoría'], focus: 3 },
  'C04': { cluster: 'C-CONTROL', title: 'Los reps piden más muestras de las que necesitan', signals: ['acumulan', 'piden de más', 'por si acaso'], focus: 3 },
  'C05': { cluster: 'C-ANALISIS', title: 'No sé qué productos son los más solicitados', signals: ['no sé qué piden más', 'demanda'], focus: 3 },
  'C06': { cluster: 'C-CADUCIDAD', title: 'Las muestras caducan en el maletín del rep', signals: ['caducadas', 'se echan a perder', 'desperdicio'], focus: 3 },
  'C07': { cluster: 'C-CONTROL', title: 'No tengo límites automáticos de entrega por médico', signals: ['dan lo que quieren', 'sin límite', 'abuso'], focus: 3 },
  'C08': { cluster: 'C-PROCESO', title: 'El proceso de solicitud de muestras es por email/teléfono', signals: ['por email', 'llaman para pedir', 'manual'], focus: 3 },
  'C09': { cluster: 'C-COSTOS', title: 'No sé el costo real de las muestras entregadas por médico', signals: ['no sé cuánto me cuesta', 'costo por médico'], focus: 3 },
  'C10': { cluster: 'C-PROCESO', title: 'No tenemos proceso de devolución de muestras no entregadas', signals: ['no regresan', 'se quedan con ellas'], focus: 3 },
  'C11': { cluster: 'C-COMPLIANCE', title: 'No puedo generar el reporte de trazabilidad para regulación', signals: ['auditoría', 'COFEPRIS', 'no tengo el reporte'], focus: 10 },
  'C12': { cluster: 'C-ESTRATEGIA', title: 'Las muestras se usan como regalo, no como promoción', signals: ['las regalan', 'no promueven', 'sin estrategia'], focus: 3 },
  'C13': { cluster: 'C-INVENTARIO', title: 'No tengo alertas de stock bajo en el almacén', signals: ['me entero cuando ya no hay', 'sin alertas'], focus: 3 },
  'C14': { cluster: 'C-INVENTARIO', title: 'El inventario de muestras se reconcilia manualmente', signals: ['una vez al mes', 'manual', 'nunca cuadra'], focus: 3 },

  // ==================== D. VENTAS Y OPORTUNIDADES (15) ====================
  'D01': { cluster: 'D-VISIBILIDAD', title: 'Las oportunidades de venta están en la cabeza del vendedor', signals: ['en la cabeza', 'no hay registro', 'solo él sabe'], focus: 4 },
  'D02': { cluster: 'D-PIPELINE', title: 'No tengo un pipeline visual de mis oportunidades', signals: ['no veo el embudo', 'no sé en qué etapa'], focus: 4 },
  'D03': { cluster: 'D-PIPELINE', title: 'No sé en qué etapa está cada negociación', signals: ['no sé cómo va', 'cada quien lleva lo suyo'], focus: 4 },
  'D04': { cluster: 'D-FORECAST', title: 'No sé cuánto voy a vender este mes hasta que llega el cierre', signals: ['sorpresa a fin de mes', 'no puedo predecir'], focus: 4 },
  'D05': { cluster: 'D-COTIZACIONES', title: 'Las cotizaciones se hacen en Word/Excel', signals: ['en Word', 'no hay historial de cotizaciones'], focus: 4 },
  'D06': { cluster: 'D-COTIZACIONES', title: 'No hay proceso estándar de cotización', signals: ['cada quien a su manera', 'no hay formato'], focus: 4 },
  'D07': { cluster: 'D-DESCUENTOS', title: 'Los descuentos se dan sin control ni aprobación', signals: ['descuentos locos', 'sin autorización', 'regalan margen'], focus: 4 },
  'D08': { cluster: 'D-SEGUIMIENTO', title: 'No sé qué oportunidades están estancadas', signals: ['deals parados', 'no se mueven', 'olvidados'], focus: 4 },
  'D09': { cluster: 'D-SCORING', title: 'No tengo scoring para priorizar oportunidades', signals: ['no sé cuáles son las buenas', 'sin prioridad'], focus: 4 },
  'D10': { cluster: 'D-SEGUIMIENTO', title: 'Pierdo oportunidades por falta de seguimiento', signals: ['se nos fueron', 'no dimos seguimiento', 'se enfrió'], focus: 4 },
  'D11': { cluster: 'D-ANALISIS', title: 'No registro por qué perdí una venta', signals: ['no sé por qué perdimos', 'no documentamos'], focus: 4 },
  'D12': { cluster: 'D-FORECAST', title: 'No puedo hacer forecast de ventas con precisión', signals: ['forecast poco confiable', 'siempre falla'], focus: 4 },
  'D13': { cluster: 'D-PRECIOS', title: 'No tengo precios actualizados accesibles para el equipo', signals: ['precios viejos', 'no saben el precio actual'], focus: 4 },
  'D14': { cluster: 'D-DESCUENTOS', title: 'El proceso de aprobación de descuentos es por WhatsApp', signals: ['por WhatsApp', 'mandan mensaje para aprobar'], focus: 4 },
  'D15': { cluster: 'D-METRICAS', title: 'No sé cuál es el ticket promedio por cliente', signals: ['no tengo métricas', 'no sé el promedio'], focus: 4 },

  // ==================== E. COBRANZA Y FINANZAS (12) ====================
  'E01': { cluster: 'E-SEGUIMIENTO', title: 'Hay facturas vencidas que nadie está cobrando', signals: ['facturas olvidadas', 'nadie cobra', 'se acumulan'], focus: 5 },
  'E02': { cluster: 'E-VISIBILIDAD', title: 'No sé la antigüedad de mis cuentas por cobrar', signals: ['no sé hace cuánto', 'antigüedad de saldos'], focus: 5 },
  'E03': { cluster: 'E-AUTOMATIZACION', title: 'Los recordatorios de pago se hacen manualmente', signals: ['llamamos uno por uno', 'no hay recordatorios'], focus: 5 },
  'E04': { cluster: 'E-SCORING', title: 'No sé qué clientes son buenos pagadores', signals: ['no tengo historial', 'todos igual'], focus: 5 },
  'E05': { cluster: 'E-ALERTAS', title: 'Me entero de facturas vencidas cuando ya pasaron 60 días', signals: ['me entero tarde', 'ya venció hace rato'], focus: 5 },
  'E06': { cluster: 'E-PROCESO', title: 'No tengo proceso escalonado de cobranza', signals: ['no hay proceso', 'improvisamos'], focus: 5 },
  'E07': { cluster: 'E-VISIBILIDAD', title: 'No puedo ver todo lo que me deben en un solo lugar', signals: ['disperso', 'no hay vista consolidada'], focus: 5 },
  'E08': { cluster: 'E-SEGUIMIENTO', title: 'Las promesas de pago no se registran', signals: ['prometen y no pagan', 'no documentamos'], focus: 5 },
  'E09': { cluster: 'E-ANALISIS', title: 'No sé el impacto de la morosidad en mi flujo de caja', signals: ['no mido el impacto', 'flujo de caja'], focus: 5 },
  'E10': { cluster: 'E-COMUNICACION', title: 'Ventas no sabe que su cliente tiene facturas vencidas', signals: ['venden a morosos', 'no se enteran'], focus: 5 },
  'E11': { cluster: 'E-REPORTES', title: 'No tengo reportes de cobranza automáticos', signals: ['hago el reporte a mano', 'Excel'], focus: 5 },
  'E12': { cluster: 'E-METRICAS', title: 'No sé cuánto tiempo promedio tardan en pagarme', signals: ['DSO', 'días de cobro', 'no tengo la métrica'], focus: 5 },

  // ==================== F. REPORTES E INFORMACIÓN (14) ====================
  'F01': { cluster: 'F-TIEMPO', title: 'Tardo días en armar un reporte para dirección', signals: ['me toma días', 'semanas para un reporte'], focus: 9 },
  'F02': { cluster: 'F-ESTANDARIZACION', title: 'Los reportes se hacen en Excel y cada vez son diferentes', signals: ['en Excel', 'cada vez distinto', 'no hay formato'], focus: 9 },
  'F03': { cluster: 'F-KPIS', title: 'No tengo KPIs definidos ni forma de medirlos', signals: ['no tengo KPIs', 'no sé qué medir'], focus: 9 },
  'F04': { cluster: 'F-COMPARATIVOS', title: 'No puedo comparar el desempeño mes a mes fácilmente', signals: ['comparar es difícil', 'no tengo histórico'], focus: 9 },
  'F05': { cluster: 'F-DISPONIBILIDAD', title: 'Dirección pide información y nadie la tiene lista', signals: ['siempre corremos', 'no está lista', 'improvisar'], focus: 9 },
  'F06': { cluster: 'F-DASHBOARDS', title: 'No tengo dashboards en tiempo real', signals: ['no hay dashboard', 'no veo en tiempo real'], focus: 9 },
  'F07': { cluster: 'F-SEGMENTACION', title: 'Los reportes no separan por territorio/producto/rep', signals: ['todo junto', 'no puedo filtrar', 'sin desglose'], focus: 9 },
  'F08': { cluster: 'F-TENDENCIAS', title: 'No puedo ver tendencias, solo fotos del momento', signals: ['solo el hoy', 'sin tendencias', 'no veo hacia dónde va'], focus: 9 },
  'F09': { cluster: 'F-PREDICCION', title: 'Mis reportes no incluyen información predictiva', signals: ['no predice', 'solo histórico', 'quisiera saber qué va a pasar'], focus: 9 },
  'F10': { cluster: 'F-EFECTIVIDAD', title: 'No tengo forma de medir la efectividad de las visitas', signals: ['no sé si las visitas sirven', 'ROI de visitas'], focus: 9 },
  'F11': { cluster: 'F-INTEGRACION', title: 'No puedo cruzar datos de visitas con datos de ventas', signals: ['no cruzo información', 'silos de datos'], focus: 9 },
  'F12': { cluster: 'F-ALERTAS', title: 'Me llegan los problemas cuando ya es tarde para actuar', signals: ['me entero tarde', 'reactivo', 'ya pasó'], focus: 9 },
  'F13': { cluster: 'F-AUTOMATIZACION', title: 'No tengo reportes automáticos que se envíen solos', signals: ['los hago a mano', 'nadie los manda'], focus: 9 },
  'F14': { cluster: 'F-FUENTE_UNICA', title: 'Cada gerente calcula los números de forma diferente', signals: ['cada quien sus números', 'no cuadran', 'sin fuente única'], focus: 9 },

  // ==================== G. TECNOLOGÍA Y SISTEMAS (13) ====================
  'G01': { cluster: 'G-EXCEL', title: 'Todo está en Excel y cada quien tiene su versión', signals: ['en Excel', 'cada quien su archivo', 'versiones'], focus: 9 },
  'G02': { cluster: 'G-INTEGRACION', title: 'Tenemos un ERP pero no está conectado con nada', signals: ['ERP aislado', 'no se conecta', 'isla'], focus: 9 },
  'G03': { cluster: 'G-ADOPCION', title: 'Compramos un CRM pero nadie lo usa', signals: ['nadie lo usa', 'muy complicado', 'abandonado'], focus: 9 },
  'G04': { cluster: 'G-FRAGMENTACION', title: 'La información está en 5 sistemas diferentes', signals: ['en varios sistemas', 'disperso', 'no centralizado'], focus: 9 },
  'G05': { cluster: 'G-MOVIL', title: 'No tenemos app móvil para el equipo de campo', signals: ['sin app', 'todo en web', 'no funciona en móvil'], focus: 9 },
  'G06': { cluster: 'G-OFFLINE', title: 'Nuestro sistema no funciona sin internet', signals: ['sin internet no sirve', 'necesita conexión', 'offline no'], focus: 9 },
  'G07': { cluster: 'G-OBSOLESCENCIA', title: 'El sistema que tenemos está obsoleto', signals: ['obsoleto', 'sin soporte', 'viejo'], focus: 9 },
  'G08': { cluster: 'G-ADOPCION', title: 'Pagamos por un sistema que usamos al 10%', signals: ['pagamos de más', 'no lo usamos', 'desperdicio'], focus: 9 },
  'G09': { cluster: 'G-DEPENDENCIA', title: 'Dependemos de una persona para sacar información', signals: ['solo él sabe', 'dependemos de uno', 'si se va...'], focus: 9 },
  'G10': { cluster: 'G-INTEGRACION', title: 'No tenemos API para conectar sistemas', signals: ['sin API', 'no se puede conectar', 'cerrado'], focus: 9 },
  'G11': { cluster: 'G-MIGRACION', title: 'La migración de datos nos da miedo', signals: ['miedo a migrar', 'perder datos', 'riesgo'], focus: 9 },
  'G12': { cluster: 'G-SEGURIDAD', title: 'No tenemos backup de nuestra información', signals: ['sin respaldo', 'no hay backup', 'si se pierde...'], focus: 9 },
  'G13': { cluster: 'G-FRAGMENTACION', title: 'Cada departamento usa herramientas diferentes', signals: ['cada quien lo suyo', 'herramientas diferentes'], focus: 9 },

  // ==================== H. COMUNICACIÓN INTERNA (9) ====================
  'H01': { cluster: 'H-CANALES', title: 'Las instrucciones del gerente se pierden en WhatsApp', signals: ['en WhatsApp', 'se pierden mensajes', 'no hay registro'], focus: 6 },
  'H02': { cluster: 'H-CANALES', title: 'No hay canal oficial para comunicar cambios', signals: ['no sé por dónde comunicar', 'se enteran por otros'], focus: 6 },
  'H03': { cluster: 'H-FEEDBACK', title: 'Los supervisores no dan retroalimentación estructurada', signals: ['feedback informal', 'no hay proceso', 'cuando se acuerdan'], focus: 6 },
  'H04': { cluster: 'H-APROBACIONES', title: 'Las solicitudes de aprobación van por WhatsApp', signals: ['por WhatsApp', 'por mensaje', 'no hay flujo'], focus: 6 },
  'H05': { cluster: 'H-DESARROLLO', title: 'No tenemos proceso formal de coaching', signals: ['sin coaching', 'no hay desarrollo', 'cada quien aprende solo'], focus: 6 },
  'H06': { cluster: 'H-VISIBILIDAD', title: 'Las reuniones son la única forma de saber qué pasa', signals: ['solo en las juntas', 'si no hay junta, no sé'], focus: 6 },
  'H07': { cluster: 'H-OBJETIVOS', title: 'Los objetivos del mes se comunican verbalmente', signals: ['verbal', 'se olvidan', 'no quedan escritos'], focus: 6 },
  'H08': { cluster: 'H-VISIBILIDAD', title: 'No hay visibilidad de lo que hacen otros equipos', signals: ['no sé qué hacen los otros', 'silos'], focus: 6 },
  'H09': { cluster: 'H-SILOS', title: 'La información se queda en silos', signals: ['silos', 'no se comparte', 'cada área lo suyo'], focus: 6 },

  // ==================== I. RELACIÓN CON CLIENTES POST-VENTA (12) ====================
  'I01': { cluster: 'I-ACCESO', title: 'Los médicos no tienen forma de contactarnos', signals: ['no saben cómo contactarnos', 'solo cuando viene el rep'], focus: 7 },
  'I02': { cluster: 'I-AUTOSERVICIO', title: 'No tenemos portal para que el médico solicite muestras', signals: ['tienen que llamar', 'dependen del rep', 'sin autoservicio'], focus: 7 },
  'I03': { cluster: 'I-COMPROMISOS', title: 'Los compromisos con los médicos no se registran', signals: ['promesas no documentadas', 'se olvidan'], focus: 7 },
  'I04': { cluster: 'I-SEGUIMIENTO', title: 'No damos seguimiento a las solicitudes de los médicos', signals: ['pedían algo y no se dio', 'sin seguimiento'], focus: 7 },
  'I05': { cluster: 'I-VALOR', title: 'Los médicos reciben visitas pero no material de valor', signals: ['solo visitas vacías', 'sin contenido', 'no aportan'], focus: 7 },
  'I06': { cluster: 'I-PRESCRIPCION', title: 'No sabemos qué médicos están prescribiendo nuestros productos', signals: ['no sé quién prescribe', 'no tengo datos de prescripción'], focus: 7 },
  'I07': { cluster: 'I-SATISFACCION', title: 'No medimos la satisfacción de nuestros clientes', signals: ['no preguntamos', 'no medimos satisfacción'], focus: 7 },
  'I08': { cluster: 'I-COMUNICACION', title: 'Los médicos se enteran de productos nuevos por la competencia', signals: ['la competencia les cuenta', 'llegamos tarde'], focus: 7 },
  'I09': { cluster: 'I-FIDELIZACION', title: 'No tenemos programa de fidelización para médicos', signals: ['sin programa', 'no fidelizamos'], focus: 7 },
  'I10': { cluster: 'I-PERSONALIZACION', title: 'No personalizamos la comunicación según intereses', signals: ['todo igual para todos', 'sin personalización'], focus: 7 },
  'I11': { cluster: 'I-CONTINUIDAD', title: 'El médico tiene que repetir info cada vez que cambia de rep', signals: ['empezar de cero', 'no saben nada de mí'], focus: 7 },
  'I12': { cluster: 'I-PROACTIVIDAD', title: 'No enviamos recordatorios de reabastecimiento', signals: ['se les acaba y no avisamos', 'reactivos'], focus: 7 },

  // ==================== J. MARKETING Y MATERIAL PROMOCIONAL (8) ====================
  'J01': { cluster: 'J-EFECTIVIDAD', title: 'No sé qué material promocional funciona mejor', signals: ['no mido qué funciona', 'todo igual'], focus: 8 },
  'J02': { cluster: 'J-ACTUALIZACION', title: 'Los reps no llevan el material actualizado', signals: ['material viejo', 'desactualizado', 'versiones anteriores'], focus: 8 },
  'J03': { cluster: 'J-DIGITAL', title: 'No puedo enviar material digital después de la visita', signals: ['solo físico', 'no puedo enviar después'], focus: 8 },
  'J04': { cluster: 'J-ROI', title: 'No mido el impacto de las campañas en las ventas', signals: ['no sé si la campaña funcionó', 'sin ROI'], focus: 8 },
  'J05': { cluster: 'J-ALINEACION', title: 'Marketing crea material sin input del equipo de campo', signals: ['marketing no pregunta', 'desconectados'], focus: 8 },
  'J06': { cluster: 'J-CATALOGO', title: 'No tenemos catálogo digital de productos', signals: ['sin catálogo digital', 'PDF viejo'], focus: 8 },
  'J07': { cluster: 'J-PERSONALIZACION', title: 'Las presentaciones son las mismas para todos', signals: ['misma presentación', 'sin personalizar'], focus: 8 },
  'J08': { cluster: 'J-ESTRATEGIA', title: 'No sé qué productos promover con qué especialidad', signals: ['promueven lo que sea', 'sin estrategia'], focus: 8 },

  // ==================== K. PLANIFICACIÓN Y ESTRATEGIA (10) ====================
  'K01': { cluster: 'K-PLANIFICACION', title: 'No tengo plan de visitas basado en potencial', signals: ['visitan sin plan', 'no hay prioridad'], focus: 9 },
  'K02': { cluster: 'K-TERRITORIOS', title: 'Los territorios están mal distribuidos', signals: ['mal repartido', 'unos con mucho, otros con nada'], focus: 9 },
  'K03': { cluster: 'K-SIMULACION', title: 'No puedo simular escenarios', signals: ['no puedo simular', 'sin escenarios'], focus: 9 },
  'K04': { cluster: 'K-OBJETIVOS', title: 'No tengo objetivos claros por rep/territorio/producto', signals: ['objetivos vagos', 'no están claros'], focus: 9 },
  'K05': { cluster: 'K-PLANIFICACION', title: 'La planificación del mes se hace sobre la marcha', signals: ['improvisamos', 'sin plan', 'día a día'], focus: 9 },
  'K06': { cluster: 'K-COSTOS', title: 'No sé cuál es mi costo por visita', signals: ['no sé cuánto cuesta una visita', 'sin métrica de costo'], focus: 9 },
  'K07': { cluster: 'K-COBERTURA', title: 'No tengo estrategia de cobertura por segmento', signals: ['sin estrategia de cobertura', 'todo igual'], focus: 9 },
  'K08': { cluster: 'K-ROI', title: 'No puedo medir el ROI de mi fuerza de ventas', signals: ['no sé si rinden', 'ROI de equipo'], focus: 9 },
  'K09': { cluster: 'K-PRIORIZACION', title: 'No tengo forma de priorizar clientes', signals: ['todos igual', 'sin priorización'], focus: 9 },
  'K10': { cluster: 'K-CUOTAS', title: 'La cuota de ventas se asigna sin datos reales', signals: ['cuota al azar', 'sin fundamento', 'porque sí'], focus: 9 },

  // ==================== L. PROCESOS REGULATORIOS Y COMPLIANCE (8) ====================
  'L01': { cluster: 'L-TRAZABILIDAD', title: 'No puedo demostrar a reguladores a quién le di qué muestra', signals: ['no tengo prueba', 'auditoría', 'COFEPRIS'], focus: 10 },
  'L02': { cluster: 'L-TRAZABILIDAD', title: 'No tengo trazabilidad de lotes hasta el destinatario', signals: ['no sé dónde terminó', 'lotes perdidos'], focus: 10 },
  'L03': { cluster: 'L-NORMATIVA', title: 'No cumplo con los registros de normativa de muestras', signals: ['no cumplo', 'normativa', 'fuera de regla'], focus: 10 },
  'L04': { cluster: 'L-POLITICAS', title: 'No tengo políticas de visita documentadas', signals: ['sin políticas', 'no está escrito'], focus: 10 },
  'L05': { cluster: 'L-REPORTES', title: 'No puedo generar reportes de auditoría rápidamente', signals: ['auditoría = pánico', 'tardo días'], focus: 10 },
  'L06': { cluster: 'L-PERMISOS', title: 'No tengo control de quién accede a qué información', signals: ['todos ven todo', 'sin permisos'], focus: 10 },
  'L07': { cluster: 'L-PRIVACIDAD', title: 'Los datos personales no están protegidos según RGPD', signals: ['sin protección de datos', 'RGPD', 'privacidad'], focus: 10 },
  'L08': { cluster: 'L-AUDITORIA', title: 'No tengo log de quién modificó qué dato', signals: ['sin registro de cambios', 'no sé quién cambió'], focus: 10 },

  // ==================== M. RECURSOS HUMANOS Y EQUIPO (7) ====================
  'M01': { cluster: 'M-ROTACION', title: 'La rotación de reps es alta y empezamos de cero', signals: ['rotación alta', 'se van y empezamos de nuevo'], focus: 11 },
  'M02': { cluster: 'M-EVALUACION', title: 'No tengo métricas objetivas para evaluar reps', signals: ['evaluación subjetiva', 'sin métricas'], focus: 11 },
  'M03': { cluster: 'M-ONBOARDING', title: 'El onboarding de un rep nuevo tarda semanas', signals: ['onboarding lento', 'tarda en arrancar'], focus: 11 },
  'M04': { cluster: 'M-CAPACITACION', title: 'No tengo programa de capacitación continua', signals: ['sin capacitación', 'aprenden solos'], focus: 11 },
  'M05': { cluster: 'M-DESARROLLO', title: 'No sé qué habilidades le faltan a cada rep', signals: ['no sé qué reforzar', 'gaps de habilidades'], focus: 11 },
  'M06': { cluster: 'M-COMISIONES', title: 'Las comisiones se calculan manualmente con errores', signals: ['comisiones a mano', 'errores en pago', 'reclamos'], focus: 11 },
  'M07': { cluster: 'M-MOTIVACION', title: 'No tengo visibilidad de la motivación del equipo', signals: ['no sé cómo están', 'motivación', 'engagement'], focus: 11 },

  // ==================== N. GESTIÓN DE EVENTOS (5) ====================
  'N01': { cluster: 'N-REGISTRO', title: 'No registro la asistencia de médicos a eventos', signals: ['no sé quién vino', 'sin registro'], focus: 8 },
  'N02': { cluster: 'N-SEGUIMIENTO', title: 'No doy seguimiento a médicos que asisten a eventos', signals: ['vienen y ya', 'sin seguimiento post-evento'], focus: 8 },
  'N03': { cluster: 'N-ROI', title: 'No mido el ROI de los eventos', signals: ['no sé si valió la pena', 'sin ROI'], focus: 8 },
  'N04': { cluster: 'N-LOGISTICA', title: 'La logística de eventos es manual', signals: ['todo manual', 'Excel para eventos'], focus: 8 },
  'N05': { cluster: 'N-CALENDARIO', title: 'No tengo calendario centralizado de eventos del sector', signals: ['no sé qué eventos hay', 'me entero tarde'], focus: 8 },

  // ==================== O. COMPETENCIA Y MERCADO (5) ====================
  'O01': { cluster: 'O-INTELIGENCIA', title: 'No registro información sobre la competencia', signals: ['no documento', 'se me olvida'], focus: 9 },
  'O02': { cluster: 'O-PRODUCTOS', title: 'No sé qué productos de la competencia ganan terreno', signals: ['no sé qué venden', 'perdiendo share'], focus: 9 },
  'O03': { cluster: 'O-REGISTRO', title: 'Los reps escuchan info del mercado pero no la registran', signals: ['info se pierde', 'no documentan'], focus: 9 },
  'O04': { cluster: 'O-ANALISIS', title: 'No tengo análisis de participación de mercado', signals: ['sin market share', 'sin análisis'], focus: 9 },
  'O05': { cluster: 'O-INSIGHTS', title: 'No sé por qué los médicos prefieren a la competencia', signals: ['perdemos vs competencia', 'no sé por qué'], focus: 9 },

  // ==================== P. AUTOMATIZACIÓN E IA (8) ====================
  'P01': { cluster: 'P-TIEMPO', title: 'Paso demasiado tiempo llenando formularios', signals: ['mucho tiempo registrando', 'formularios eternos', 'quita tiempo'], focus: 9 },
  'P02': { cluster: 'P-PREPARACION', title: 'No tengo tiempo para preparar cada visita', signals: ['voy sin preparar', 'improviso', 'no me da tiempo'], focus: 9 },
  'P03': { cluster: 'P-REPORTES', title: 'Los informes los hago a mano cada semana', signals: ['horas en reportes', 'cada semana lo mismo'], focus: 9 },
  'P04': { cluster: 'P-CONTEXTO', title: 'No sé qué decirle a cada médico, voy sin contexto', signals: ['no sé qué pasó antes', 'sin briefing'], focus: 9 },
  'P05': { cluster: 'P-VOZ', title: 'Quisiera dictar las visitas en lugar de escribir', signals: ['escribir es lento', 'mejor hablar', 'voz'], focus: 9 },
  'P06': { cluster: 'P-ALERTAS', title: 'Nadie me avisa cuando algo importante pasa', signals: ['me entero tarde', 'sin alertas'], focus: 9 },
  'P07': { cluster: 'P-AUTOMATICO', title: 'Quisiera que el sistema hiciera cosas solo', signals: ['automático', 'que se haga solo'], focus: 9 },
  'P08': { cluster: 'P-SUGERENCIAS', title: 'No tengo sugerencias de qué hacer', signals: ['sin sugerencias', 'yo tengo que decidir todo'], focus: 9 },
};

// Clusters para agrupación
const PAIN_CLUSTERS = {
  // Categoría A
  'A-VISIBILIDAD': { title: 'No sé qué hace mi equipo', description: 'Sin visibilidad de actividades de representantes', codes: ['A01', 'A02', 'A08'], category: 'A', focus: 1 },
  'A-UBICACION': { title: 'No sé dónde están mis reps', description: 'Sin tracking de ubicación del equipo', codes: ['A03', 'A05'], category: 'A', focus: 1 },
  'A-REGISTRO': { title: 'Registran tarde o mal', description: 'El equipo no documenta en tiempo real', codes: ['A04', 'A11'], category: 'A', focus: 1 },
  'A-COBERTURA': { title: 'No siguen el plan de visitas', description: 'Visitan a quien quieren, no a quien deben', codes: ['A06', 'A07'], category: 'A', focus: 1 },
  'A-CONOCIMIENTO': { title: 'La información se va con ellos', description: 'Pérdida de conocimiento cuando se van', codes: ['A09', 'A13'], category: 'A', focus: 1 },
  'A-PRODUCTIVIDAD': { title: 'No puedo medir rendimiento', description: 'Sin métricas objetivas de productividad', codes: ['A10', 'A12'], category: 'A', focus: 1 },
  'A-RUTAS': { title: 'Rutas ineficientes', description: 'Sin optimización de recorridos', codes: ['A14'], category: 'A', focus: 1 },

  // Categoría B
  'B-DATOS': { title: 'Datos desactualizados', description: 'Información de contactos vieja o duplicada', codes: ['B01', 'B07', 'B14'], category: 'B', focus: 2 },
  'B-CENTRALIZACION': { title: 'Cada quien tiene su libreta', description: 'Sin base de datos central', codes: ['B02'], category: 'B', focus: 2 },
  'B-SEGMENTACION': { title: 'No sé cuáles son importantes', description: 'Contactos sin categorizar por prioridad', codes: ['B04', 'B13'], category: 'B', focus: 2 },
  'B-HISTORIAL': { title: 'Sin historial de relación', description: 'No hay registro de interacciones previas', codes: ['B09'], category: 'B', focus: 2 },

  // Categoría C
  'C-INVENTARIO': { title: 'No sé qué muestras hay', description: 'Sin control de inventario de muestras', codes: ['C01', 'C13', 'C14'], category: 'C', focus: 3 },
  'C-TRAZABILIDAD': { title: 'Muestras sin trazabilidad', description: 'No sé a quién se entregó cada muestra', codes: ['C02', 'C03'], category: 'C', focus: 3 },
  'C-CONTROL': { title: 'Sin límites de muestras', description: 'Sin control de cantidades entregadas', codes: ['C04', 'C07'], category: 'C', focus: 3 },
  'C-COMPLIANCE': { title: 'Auditoría de muestras', description: 'No puedo generar reportes regulatorios', codes: ['C11'], category: 'C', focus: 10 },

  // Categoría D
  'D-VISIBILIDAD': { title: 'Oportunidades en la cabeza', description: 'Las ventas no están registradas', codes: ['D01'], category: 'D', focus: 4 },
  'D-PIPELINE': { title: 'Sin pipeline visual', description: 'Sin visibilidad del embudo de ventas', codes: ['D02', 'D03'], category: 'D', focus: 4 },
  'D-FORECAST': { title: 'No puedo predecir ventas', description: 'Forecast poco confiable', codes: ['D04', 'D12'], category: 'D', focus: 4 },
  'D-SEGUIMIENTO': { title: 'Oportunidades abandonadas', description: 'Pierdo ventas por falta de seguimiento', codes: ['D08', 'D10'], category: 'D', focus: 4 },

  // Categoría E
  'E-SEGUIMIENTO': { title: 'Facturas sin cobrar', description: 'Nadie está gestionando facturas vencidas', codes: ['E01', 'E08'], category: 'E', focus: 5 },
  'E-VISIBILIDAD': { title: 'No veo lo que me deben', description: 'Sin visibilidad consolidada de CxC', codes: ['E02', 'E07'], category: 'E', focus: 5 },
  'E-PROCESO': { title: 'Sin proceso de cobranza', description: 'Sin escalamiento formal', codes: ['E06'], category: 'E', focus: 5 },

  // Categoría F
  'F-TIEMPO': { title: 'Reportes tardan días', description: 'Armar información toma demasiado', codes: ['F01'], category: 'F', focus: 9 },
  'F-DASHBOARDS': { title: 'Sin dashboards', description: 'Sin visualizaciones en tiempo real', codes: ['F06'], category: 'F', focus: 9 },
  'F-AUTOMATIZACION': { title: 'Reportes manuales', description: 'Se hacen a mano cada semana', codes: ['F13'], category: 'F', focus: 9 },

  // Categoría G
  'G-EXCEL': { title: 'Todo está en Excel', description: 'Información en hojas de cálculo', codes: ['G01'], category: 'G', focus: 9 },
  'G-ADOPCION': { title: 'CRM que nadie usa', description: 'Sistema que el equipo no adopta', codes: ['G03', 'G08'], category: 'G', focus: 9 },

  // Categoría H
  'H-CANALES': { title: 'Todo por WhatsApp', description: 'Comunicaciones se pierden en mensajería', codes: ['H01', 'H02'], category: 'H', focus: 6 },
  'H-APROBACIONES': { title: 'Aprobaciones informales', description: 'Sin flujo formal de aprobación', codes: ['H04'], category: 'H', focus: 6 },

  // Categoría L
  'L-TRAZABILIDAD': { title: 'Sin trazabilidad regulatoria', description: 'No puedo demostrar a reguladores', codes: ['L01', 'L02'], category: 'L', focus: 10 },
  'L-REPORTES': { title: 'Auditoría = pánico', description: 'Generar reportes de compliance toma días', codes: ['L05'], category: 'L', focus: 10 },

  // Categoría P
  'P-TIEMPO': { title: 'Mucho tiempo registrando', description: 'Formularios quitan demasiado tiempo', codes: ['P01'], category: 'P', focus: 9 },
  'P-VOZ': { title: 'Prefiero dictar', description: 'Quiero registrar hablando', codes: ['P05'], category: 'P', focus: 9 },
};

// Prioridades de exploración por contexto
const EXPLORATION_PRIORITY = {
  // Nivel 1: Siempre explorar (90%+ de prospectos)
  level1: ['A', 'D', 'F'],  // Visibilidad, Ventas, Reportes
  // Nivel 2: Explorar si aplica
  level2: ['E', 'B', 'G'],  // Cobranza (si vende a crédito), Contactos, Tecnología
  // Nivel 3: Explorar si menciona o aplica al sector
  level3_pharma: ['C', 'L'],  // Muestras, Compliance
  level3_general: ['H', 'K', 'M', 'P'],  // Comunicación, Planificación, RRHH, Automatización
};

// ============================================================
// ESTADO DEL FORMULARIO
// ============================================================

const FormState = {
  currentScreen: 'welcome',
  currentPhase: 0,

  // Información de la empresa (NUEVO)
  company: {
    name: '',
    website: '',
    profile: null,  // Perfil investigado por IA
    researchComplete: false
  },

  // Respuestas
  responses: {
    phase1: {},
    phase2: {},
    adaptiveQuestions: [],
    currentAdaptiveIndex: 0
  },

  // Pains detectados
  detectedPains: [],
  finalPains: [],
  painsConfirmed: null,

  // Audio
  audioBlob: null,
  audioUrl: null,
  audioTranscription: '',

  // Contacto
  contact: {
    name: '',
    company: '',
    email: '',
    whatsapp: ''
  },

  // Navegación
  screenHistory: ['welcome'],
  totalQuestions: 7,
  answeredQuestions: 0
};

// ============================================================
// ELEMENTOS DEL DOM
// ============================================================

let DOM = {};

function initDOM() {
  DOM = {
    // Contenedores
    formContainer: document.getElementById('formContainer'),
    progressFill: document.getElementById('progressFill'),
    formNav: document.getElementById('formNav'),
    keyboardHints: document.getElementById('keyboardHints'),

    // Navegación
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),
    navCurrent: document.getElementById('navCurrent'),
    navTotal: document.getElementById('navTotal'),

    // Pantallas
    screens: document.querySelectorAll('.form-screen'),

    // Empresa (NUEVO)
    companyInput: document.getElementById('companyInput'),
    btnResearchCompany: document.getElementById('btnResearchCompany'),
    companyResearchStatus: document.getElementById('companyResearchStatus'),

    // Fase 2 - Adaptativo
    adaptiveQuestionNumber: document.getElementById('adaptiveQuestionNumber'),
    adaptiveQuestionTitle: document.getElementById('adaptiveQuestionTitle'),
    adaptiveQuestionHint: document.getElementById('adaptiveQuestionHint'),
    adaptiveOptions: document.getElementById('adaptiveOptions'),

    // Fase 3 - Pains
    painsList: document.getElementById('painsList'),
    btnConfirmPains: document.getElementById('btnConfirmPains'),
    btnAdjustPains: document.getElementById('btnAdjustPains'),

    // Fase 4 - Audio
    audioTitle: document.getElementById('audioTitle'),
    audioSubtitle: document.getElementById('audioSubtitle'),
    audioPrompts: document.getElementById('audioPrompts'),
    audioRecorder: document.getElementById('audioRecorder'),
    recorderVisualizer: document.getElementById('recorderVisualizer'),
    recorderTimer: document.getElementById('recorderTimer'),
    recorderBtn: document.getElementById('recorderBtn'),
    recorderStatus: document.getElementById('recorderStatus'),
    audioPreview: document.getElementById('audioPreview'),
    audioPlayer: document.getElementById('audioPlayer'),
    btnRerecord: document.getElementById('btnRerecord'),
    btnUseAudio: document.getElementById('btnUseAudio'),

    // Fase 5 - Final
    finalPainsList: document.getElementById('finalPainsList'),
    contactForm: document.getElementById('contactForm'),
    contactName: document.getElementById('contactName'),
    contactCompany: document.getElementById('contactCompany'),
    contactEmail: document.getElementById('contactEmail'),
    contactWhatsapp: document.getElementById('contactWhatsapp'),

    // Thank you
    thanksName: document.getElementById('thanksName'),

    // Botones especiales
    btnStart: document.getElementById('btnStart'),
    btnContinueQ4: document.getElementById('btnContinueQ4'),
  };
}

// ============================================================
// UTILIDADES
// ============================================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getScreen(screenName) {
  return document.querySelector(`[data-screen="${screenName}"]`);
}

function updateProgress() {
  const totalScreens = 14;
  const currentIndex = FormState.screenHistory.length;
  const progress = Math.min((currentIndex / totalScreens) * 100, 100);
  DOM.progressFill.style.width = `${progress}%`;
}

function showNav(show = true) {
  DOM.formNav.classList.toggle('hidden', !show);
}

function showKeyboardHints(show = true) {
  if (DOM.keyboardHints) {
    DOM.keyboardHints.classList.toggle('hidden', !show);
  }
}

// ============================================================
// NAVEGACIÓN DE PANTALLAS
// ============================================================

async function goToScreen(screenName, addToHistory = true) {
  const currentScreenEl = getScreen(FormState.currentScreen);
  const nextScreenEl = getScreen(screenName);

  if (!nextScreenEl) {
    console.error(`Screen not found: ${screenName}`);
    return;
  }

  // Animación de salida
  if (currentScreenEl) {
    currentScreenEl.classList.remove('active');
    currentScreenEl.classList.add('exit');
  }

  await sleep(CONFIG.transitionDuration);

  // Limpiar estado anterior
  if (currentScreenEl) {
    currentScreenEl.classList.remove('exit');
  }

  // Activar nueva pantalla
  nextScreenEl.classList.add('active');

  // Actualizar estado
  FormState.currentScreen = screenName;
  if (addToHistory) {
    FormState.screenHistory.push(screenName);
  }

  // Actualizar UI
  updateProgress();
  updateNavigationState();

  // Ejecutar hooks de pantalla
  await onScreenEnter(screenName);
}

function updateNavigationState() {
  const screen = FormState.currentScreen;

  // Mostrar/ocultar navegación según pantalla
  const hideNavScreens = ['welcome', 'thank-you', 'transition-phase2', 'transition-phase3', 'processing-audio', 'researching-company'];
  showNav(!hideNavScreens.includes(screen));

  // Actualizar contador
  DOM.navCurrent.textContent = FormState.answeredQuestions;
  DOM.navTotal.textContent = FormState.totalQuestions;

  // Botón anterior
  DOM.btnPrev.disabled = FormState.screenHistory.length <= 2;

  // Keyboard hints solo en preguntas
  const questionScreens = screen.startsWith('q1-') || screen === 'phase2-questions';
  showKeyboardHints(questionScreens && window.innerWidth > 768);
}

async function goBack() {
  if (FormState.screenHistory.length > 1) {
    FormState.screenHistory.pop();
    const previousScreen = FormState.screenHistory[FormState.screenHistory.length - 1];
    await goToScreen(previousScreen, false);
  }
}

// ============================================================
// HOOKS DE PANTALLA
// ============================================================

async function onScreenEnter(screenName) {
  switch (screenName) {
    case 'researching-company':
      await handleResearchCompany();
      break;
    case 'transition-phase2':
      await handleTransitionToPhase2();
      break;
    case 'phase2-questions':
      await renderAdaptiveQuestion();
      break;
    case 'transition-phase3':
      await handleTransitionToPhase3();
      break;
    case 'pains-detected':
      renderDetectedPains();
      break;
    case 'audio-record':
      setupAudioRecorder();
      break;
    case 'processing-audio':
      await handleProcessingAudio();
      break;
    case 'final-pains':
      renderFinalPains();
      break;
    case 'contact-info':
      focusContactForm();
      break;
  }
}

// ============================================================
// NUEVA FASE 0: INVESTIGACIÓN DE EMPRESA
// ============================================================

async function handleCompanySubmit() {
  const input = DOM.companyInput.value.trim();

  if (!input) {
    DOM.companyInput.focus();
    return;
  }

  // Determinar si es nombre o URL
  const isUrl = input.includes('.') && (input.includes('http') || input.includes('www') || /\.[a-z]{2,}$/i.test(input));

  FormState.company.name = isUrl ? '' : input;
  FormState.company.website = isUrl ? (input.startsWith('http') ? input : `https://${input}`) : '';

  // Ir a pantalla de investigación
  await goToScreen('researching-company');
}

async function handleResearchCompany() {
  const statusEl = DOM.companyResearchStatus;

  try {
    // Actualizar estado visual
    statusEl.textContent = 'Buscando información de la empresa...';

    const response = await fetch(CONFIG.researchApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        companyName: FormState.company.name,
        website: FormState.company.website
      })
    });

    const data = await response.json();

    if (data.success && data.profile) {
      FormState.company.profile = data.profile;
      FormState.company.researchComplete = true;

      statusEl.textContent = `Encontramos información sobre ${data.profile.empresa.nombre || 'tu empresa'}...`;

      // Pre-rellenar sector si lo detectamos
      if (data.profile.empresa.sector) {
        FormState.responses.phase1.sector = data.profile.empresa.sector;
      }
      if (data.profile.empresa.tiene_equipo_campo !== undefined) {
        FormState.responses.phase1.has_field_team = data.profile.empresa.tiene_equipo_campo ? 'yes' : 'no';
      }
    } else {
      statusEl.textContent = 'Preparando preguntas personalizadas...';
      FormState.company.profile = data.profile;  // Perfil por defecto
    }

    await sleep(1500);

    // Continuar al formulario
    await goToScreen('q1-1');

  } catch (error) {
    console.error('Error researching company:', error);
    statusEl.textContent = 'Continuando con las preguntas...';
    await sleep(1000);
    await goToScreen('q1-1');
  }
}

// ============================================================
// FASE 1: PREGUNTAS FIJAS
// ============================================================

function handleOptionClick(e) {
  const optionBtn = e.target.closest('.option-btn');
  if (!optionBtn) return;

  const optionsList = optionBtn.closest('.options-list');
  const questionKey = optionsList.dataset.question;
  const isMulti = optionsList.dataset.multi === 'true';
  const value = optionBtn.dataset.value;

  if (isMulti) {
    // Multi-select: toggle
    optionBtn.classList.toggle('selected');

    if (!FormState.responses.phase1[questionKey]) {
      FormState.responses.phase1[questionKey] = [];
    }

    const index = FormState.responses.phase1[questionKey].indexOf(value);
    if (index > -1) {
      FormState.responses.phase1[questionKey].splice(index, 1);
    } else {
      FormState.responses.phase1[questionKey].push(value);
    }

    // Mostrar botón continuar si hay selección
    const btnContinue = optionsList.parentElement.querySelector('.btn-continue');
    if (btnContinue) {
      btnContinue.classList.toggle('hidden', FormState.responses.phase1[questionKey].length === 0);
    }
  } else {
    // Single select: seleccionar y avanzar
    optionsList.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    optionBtn.classList.add('selected');

    // Guardar respuesta
    FormState.responses.phase1[questionKey] = value;

    // Manejar input "Otro"
    if (optionBtn.dataset.hasInput === 'true') {
      const container = document.getElementById(`${questionKey}OtherContainer`);
      if (container) {
        container.classList.remove('hidden');
        container.querySelector('input').focus();
        return;
      }
    }

    // Avanzar después de pequeña pausa
    setTimeout(() => advanceFromCurrentQuestion(), 300);
  }
}

function advanceFromCurrentQuestion() {
  const screen = FormState.currentScreen;
  FormState.answeredQuestions++;

  const screenMap = {
    'q1-1': 'q1-2',
    'q1-2': 'q1-3',
    'q1-3': 'q1-4',
    'q1-4': 'q1-5',
    'q1-5': 'transition-phase2'
  };

  const nextScreen = screenMap[screen];
  if (nextScreen) {
    goToScreen(nextScreen);
  }
}

// ============================================================
// FASE 2: PREGUNTAS ADAPTATIVAS (GROQ AI) - MEJORADO
// ============================================================

async function handleTransitionToPhase2() {
  await sleep(CONFIG.loadingMinDuration);

  try {
    const questions = await generateAdaptiveQuestions();
    FormState.responses.adaptiveQuestions = questions;
    FormState.responses.currentAdaptiveIndex = 0;
    FormState.totalQuestions = 5 + questions.length;
  } catch (error) {
    console.error('Error generating adaptive questions:', error);
    FormState.responses.adaptiveQuestions = getFallbackQuestions();
    FormState.responses.currentAdaptiveIndex = 0;
    FormState.totalQuestions = 5 + FormState.responses.adaptiveQuestions.length;
  }

  await goToScreen('phase2-questions');
}

async function generateAdaptiveQuestions() {
  const { phase1 } = FormState.responses;
  const companyProfile = FormState.company.profile;

  // Construir contexto completo con la base de conocimiento
  const relevantClusters = getRelevantClusters(phase1, companyProfile);

  const systemPrompt = `Eres un experto consultor de negocios especializado en detectar dolores operativos en empresas.

Tu tarea es generar 4-5 preguntas PROFUNDAS y ESPECÍFICAS para entender los dolores reales del usuario.

REGLAS CRÍTICAS:
1. Las preguntas deben ser ESPECÍFICAS para el contexto de la empresa, no genéricas
2. Cada pregunta debe profundizar en UN dolor específico del catálogo
3. Las opciones deben reflejar NIVELES DE GRAVEDAD del dolor (de "no me pasa" a "es un caos")
4. Usa lenguaje conversacional y directo (tutear)
5. Cada opción debe mapear a códigos de dolor específicos

BASE DE CONOCIMIENTO DE DOLORES:
${Object.entries(relevantClusters).map(([key, cluster]) =>
  `${key}: "${cluster.title}" - ${cluster.description}`
).join('\n')}

SEÑALES DE DETECCIÓN:
${Object.entries(PAIN_CATALOG).filter(([code, pain]) =>
  relevantClusters[pain.cluster]
).slice(0, 30).map(([code, pain]) =>
  `${code} (${pain.cluster}): "${pain.signals.join('", "')}"`
).join('\n')}

Responde SOLO con JSON válido, sin texto adicional.`;

  const userPrompt = `CONTEXTO DE LA EMPRESA:
${companyProfile ? `
- Nombre: ${companyProfile.empresa?.nombre || FormState.company.name || 'No especificado'}
- Sector detectado: ${companyProfile.empresa?.sector || phase1.sector}
- Descripción: ${companyProfile.empresa?.descripcion || 'No disponible'}
- Modelo de negocio: ${companyProfile.empresa?.modelo_negocio || 'B2B'}
- Tiene equipo de campo: ${companyProfile.empresa?.tiene_equipo_campo ? 'Sí' : 'No especificado'}
- Maneja muestras médicas: ${companyProfile.empresa?.tiene_muestras_medicas ? 'Sí' : 'No'}
- Regulado: ${companyProfile.empresa?.regulado ? 'Sí' : 'No'}
- Dolores probables detectados: ${JSON.stringify(companyProfile.dolores_probables?.prioridad_alta || [])}
` : ''}

RESPUESTAS DEL USUARIO:
- Tamaño equipo: ${phase1.team_size || 'no especificado'}
- Tiene equipo de campo: ${phase1.has_field_team || 'no especificado'}
- Sector: ${phase1.sector || 'no especificado'}
- Tecnología actual: ${JSON.stringify(phase1.current_tech || [])}
- Motivación principal: ${phase1.motivation || 'no especificado'}

${companyProfile?.preguntas_sugeridas?.length > 0 ? `
PREGUNTAS SUGERIDAS POR INVESTIGACIÓN:
${companyProfile.preguntas_sugeridas.map(q => `- ${q.pregunta} (objetivo: ${q.objetivo})`).join('\n')}
` : ''}

Genera 4-5 preguntas en este formato JSON:
{
  "preguntas": [
    {
      "texto": "¿Pregunta específica para esta empresa?",
      "hint": "Contexto o aclaración breve",
      "profundiza_en": "Nombre del dolor que profundiza",
      "opciones": [
        {
          "texto": "Opción que indica NO tener el problema",
          "detecta": [],
          "gravedad": 0
        },
        {
          "texto": "Opción que indica problema LEVE",
          "detecta": ["A-VISIBILIDAD"],
          "gravedad": 1
        },
        {
          "texto": "Opción que indica problema MODERADO",
          "detecta": ["A-VISIBILIDAD", "A-REGISTRO"],
          "gravedad": 2
        },
        {
          "texto": "Opción que indica problema GRAVE",
          "detecta": ["A-VISIBILIDAD", "A-REGISTRO", "A-CONOCIMIENTO"],
          "gravedad": 3
        }
      ]
    }
  ]
}

IMPORTANTE:
- Si el sector es pharma/dispositivos médicos, DEBES incluir preguntas sobre muestras (C-*) y compliance (L-*)
- Si tiene equipo de campo, DEBES profundizar en visibilidad (A-*)
- Las preguntas deben sentirse como conversación, no como interrogatorio
- Usa las señales de detección para inspirar las opciones`;

  const response = await fetch(CONFIG.chatApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: CONFIG.groqModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2500
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parsear JSON de la respuesta
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON in response');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed.preguntas;
}

function getRelevantClusters(phase1, companyProfile) {
  const relevant = {};

  // Siempre incluir nivel 1
  Object.entries(PAIN_CLUSTERS).forEach(([key, cluster]) => {
    if (EXPLORATION_PRIORITY.level1.includes(cluster.category)) {
      relevant[key] = cluster;
    }
  });

  // Incluir nivel 2 basado en contexto
  if (phase1.motivation === 'losing_sales' || phase1.current_tech?.includes('nothing')) {
    Object.entries(PAIN_CLUSTERS).forEach(([key, cluster]) => {
      if (cluster.category === 'E') relevant[key] = cluster;
    });
  }

  // Incluir pharma si aplica
  const isPharma = phase1.sector === 'pharma' || companyProfile?.empresa?.tiene_muestras_medicas;
  if (isPharma) {
    Object.entries(PAIN_CLUSTERS).forEach(([key, cluster]) => {
      if (EXPLORATION_PRIORITY.level3_pharma.includes(cluster.category)) {
        relevant[key] = cluster;
      }
    });
  }

  // Incluir visibilidad de equipo si tiene campo
  if (phase1.has_field_team === 'yes' || phase1.has_field_team === 'both' || companyProfile?.empresa?.tiene_equipo_campo) {
    Object.entries(PAIN_CLUSTERS).forEach(([key, cluster]) => {
      if (cluster.category === 'A') relevant[key] = cluster;
    });
  }

  // Siempre incluir tecnología y automatización
  Object.entries(PAIN_CLUSTERS).forEach(([key, cluster]) => {
    if (['G', 'P'].includes(cluster.category)) {
      relevant[key] = cluster;
    }
  });

  return relevant;
}

function getFallbackQuestions() {
  const { phase1 } = FormState.responses;
  const questions = [];

  // Pregunta 1: Visibilidad (si tiene equipo)
  if (phase1.has_field_team !== 'no') {
    questions.push({
      texto: '¿Cómo te enteras de lo que hizo tu equipo hoy?',
      hint: 'Piensa en cómo obtienes información de las actividades diarias',
      profundiza_en: 'Visibilidad del equipo',
      opciones: [
        { texto: 'Tengo un dashboard que actualiza en tiempo real', detecta: [], gravedad: 0 },
        { texto: 'Me mandan un resumen por WhatsApp o email', detecta: ['H-CANALES'], gravedad: 1 },
        { texto: 'Les pregunto en la junta semanal', detecta: ['A-VISIBILIDAD', 'H-VISIBILIDAD'], gravedad: 2 },
        { texto: 'Básicamente confío en que están trabajando', detecta: ['A-VISIBILIDAD', 'A-REGISTRO', 'A-COBERTURA'], gravedad: 3 }
      ]
    });
  }

  // Pregunta 2: Datos de clientes/contactos
  questions.push({
    texto: '¿Dónde vive la información de tus clientes o contactos?',
    hint: '',
    profundiza_en: 'Centralización de datos',
    opciones: [
      { texto: 'En un sistema centralizado que todos usan', detecta: [], gravedad: 0 },
      { texto: 'En Excel, pero hay una versión "oficial"', detecta: ['G-EXCEL'], gravedad: 1 },
      { texto: 'Cada vendedor tiene su propia lista', detecta: ['B-CENTRALIZACION', 'G-FRAGMENTACION'], gravedad: 2 },
      { texto: 'Honestamente, dispersa en varios lugares', detecta: ['B-CENTRALIZACION', 'B-DATOS', 'G-FRAGMENTACION'], gravedad: 3 }
    ]
  });

  // Pregunta 3: Muestras (solo pharma)
  if (phase1.sector === 'pharma') {
    questions.push({
      texto: '¿Cómo controlas las muestras médicas que entrega tu equipo?',
      hint: 'Incluye muestras, material promocional, dispositivos de demostración',
      profundiza_en: 'Control de muestras',
      opciones: [
        { texto: 'Sistema completo con trazabilidad de lotes', detecta: [], gravedad: 0 },
        { texto: 'Excel que actualizamos regularmente', detecta: ['C-INVENTARIO'], gravedad: 1 },
        { texto: 'Cada rep lleva su propio control', detecta: ['C-INVENTARIO', 'C-TRAZABILIDAD'], gravedad: 2 },
        { texto: 'No tenemos control real, confiamos en ellos', detecta: ['C-TRAZABILIDAD', 'C-CONTROL', 'C-COMPLIANCE'], gravedad: 3 }
      ]
    });
  }

  // Pregunta 4: Pipeline de ventas
  questions.push({
    texto: '¿Cómo sabes cuánto vas a vender este mes?',
    hint: '',
    profundiza_en: 'Visibilidad de ventas',
    opciones: [
      { texto: 'Tengo un pipeline actualizado con probabilidades', detecta: [], gravedad: 0 },
      { texto: 'Sumo las cotizaciones pendientes manualmente', detecta: ['D-FORECAST'], gravedad: 1 },
      { texto: 'Les pregunto a los vendedores y sumo', detecta: ['D-VISIBILIDAD', 'D-PIPELINE'], gravedad: 2 },
      { texto: 'Es sorpresa hasta que llega fin de mes', detecta: ['D-VISIBILIDAD', 'D-PIPELINE', 'D-FORECAST'], gravedad: 3 }
    ]
  });

  // Pregunta 5: Reportes
  questions.push({
    texto: '¿Cuánto te tardas en generar un reporte para dirección?',
    hint: '',
    profundiza_en: 'Automatización de reportes',
    opciones: [
      { texto: 'Minutos, está automatizado', detecta: [], gravedad: 0 },
      { texto: 'Un par de horas consolidando datos', detecta: ['F-TIEMPO'], gravedad: 1 },
      { texto: 'Días, tengo que buscar en varios lugares', detecta: ['F-TIEMPO', 'F-INTEGRACION'], gravedad: 2 },
      { texto: 'Semanas o directamente no los hacemos', detecta: ['F-TIEMPO', 'F-AUTOMATIZACION', 'F-DASHBOARDS'], gravedad: 3 }
    ]
  });

  return questions;
}

async function renderAdaptiveQuestion() {
  const questions = FormState.responses.adaptiveQuestions;
  const index = FormState.responses.currentAdaptiveIndex;

  if (index >= questions.length) {
    await goToScreen('transition-phase3');
    return;
  }

  const question = questions[index];
  const questionNum = 6 + index;
  const totalQuestions = 5 + questions.length;

  // Actualizar UI
  DOM.adaptiveQuestionNumber.innerHTML = `${questionNum} <span class="question-total">/ ${totalQuestions}</span>`;
  DOM.adaptiveQuestionTitle.textContent = question.texto;
  DOM.adaptiveQuestionHint.textContent = question.hint || '';

  // Renderizar opciones
  DOM.adaptiveOptions.innerHTML = question.opciones.map((opt, i) => {
    const key = String.fromCharCode(65 + i);
    return `
      <button class="option-btn" data-value="${i}" data-detects='${JSON.stringify(opt.detecta || [])}' data-gravedad="${opt.gravedad || 0}">
        <span class="option-key">${key}</span>
        <span class="option-text">${opt.texto}</span>
      </button>
    `;
  }).join('');

  // Agregar event listeners
  DOM.adaptiveOptions.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', handleAdaptiveOptionClick);
  });
}

function handleAdaptiveOptionClick(e) {
  const btn = e.target.closest('.option-btn');
  if (!btn) return;

  DOM.adaptiveOptions.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  const index = FormState.responses.currentAdaptiveIndex;
  const detects = JSON.parse(btn.dataset.detects || '[]');
  const gravedad = parseInt(btn.dataset.gravedad || '0');

  FormState.responses.phase2[`q2-${index}`] = {
    value: btn.dataset.value,
    detects: detects,
    gravedad: gravedad
  };

  FormState.answeredQuestions++;

  setTimeout(async () => {
    FormState.responses.currentAdaptiveIndex++;
    await renderAdaptiveQuestion();
  }, 300);
}

// ============================================================
// FASE 3: DETECCIÓN DE PAINS - MEJORADA
// ============================================================

async function handleTransitionToPhase3() {
  await sleep(CONFIG.loadingMinDuration);

  try {
    const pains = await detectPainsWithAI();
    FormState.detectedPains = pains;
  } catch (error) {
    console.error('Error detecting pains:', error);
    FormState.detectedPains = detectPainsFallback();
  }

  await goToScreen('pains-detected');
}

async function detectPainsWithAI() {
  // Recopilar todas las respuestas y detecciones
  const allDetections = [];
  const detectionWeights = {};

  // De fase 1 (motivación)
  const { phase1 } = FormState.responses;
  const motivationMapping = {
    'no_visibility': ['A-VISIBILIDAD', 'F-DASHBOARDS', 'A-REGISTRO'],
    'no_adoption': ['G-ADOPCION', 'A-REGISTRO', 'P-TIEMPO'],
    'losing_sales': ['D-SEGUIMIENTO', 'D-PIPELINE', 'D-FORECAST'],
    'compliance': ['L-TRAZABILIDAD', 'C-COMPLIANCE', 'L-REPORTES'],
    'system_fails': ['G-ADOPCION', 'G-OBSOLESCENCIA', 'G-INTEGRACION'],
    'growth': ['K-PLANIFICACION', 'D-PIPELINE', 'F-DASHBOARDS']
  };

  if (phase1.motivation && motivationMapping[phase1.motivation]) {
    motivationMapping[phase1.motivation].forEach((cluster, i) => {
      allDetections.push(cluster);
      detectionWeights[cluster] = (detectionWeights[cluster] || 0) + (3 - i) * 2;
    });
  }

  // De tecnología actual
  const techMapping = {
    'excel': ['G-EXCEL', 'F-AUTOMATIZACION', 'B-CENTRALIZACION'],
    'informal': ['H-CANALES', 'B-CENTRALIZACION', 'A-REGISTRO'],
    'nothing': ['B-CENTRALIZACION', 'D-VISIBILIDAD', 'G-FRAGMENTACION']
  };

  (phase1.current_tech || []).forEach(tech => {
    if (techMapping[tech]) {
      techMapping[tech].forEach((cluster, i) => {
        allDetections.push(cluster);
        detectionWeights[cluster] = (detectionWeights[cluster] || 0) + (3 - i);
      });
    }
  });

  // De fase 2 (con gravedad)
  Object.values(FormState.responses.phase2).forEach(response => {
    if (response.detects) {
      response.detects.forEach((cluster, i) => {
        allDetections.push(cluster);
        // Peso basado en gravedad y posición
        const weight = (response.gravedad || 1) * (3 - i);
        detectionWeights[cluster] = (detectionWeights[cluster] || 0) + weight;
      });
    }
  });

  // De investigación de empresa (si existe)
  if (FormState.company.profile?.dolores_probables) {
    const { prioridad_alta = [], prioridad_media = [] } = FormState.company.profile.dolores_probables;
    prioridad_alta.forEach(cluster => {
      allDetections.push(cluster);
      detectionWeights[cluster] = (detectionWeights[cluster] || 0) + 3;
    });
    prioridad_media.forEach(cluster => {
      allDetections.push(cluster);
      detectionWeights[cluster] = (detectionWeights[cluster] || 0) + 1;
    });
  }

  // Ordenar por peso
  const sortedClusters = Object.entries(detectionWeights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([cluster]) => cluster);

  // Usar IA para refinar y personalizar los dolores
  const systemPrompt = `Eres un experto analista que genera res��menes personalizados de dolores empresariales.

Dado un contexto de empresa y los dolores detectados, genera 4 dolores principales con descripciones PERSONALIZADAS para esta empresa específica.

La descripción debe:
1. Ser específica para su industria/contexto
2. Usar "tú" y lenguaje directo
3. Reflejar el impacto real en SU negocio
4. Ser concisa (1-2 oraciones)

Responde SOLO con JSON válido.`;

  const userPrompt = `EMPRESA: ${FormState.company.profile?.empresa?.nombre || FormState.company.name || 'No especificado'}
SECTOR: ${phase1.sector}
TAMAÑO: ${phase1.team_size}
TIENE CAMPO: ${phase1.has_field_team}

CLUSTERS DETECTADOS (ordenados por prioridad):
${sortedClusters.map((cluster, i) => {
  const clusterData = PAIN_CLUSTERS[cluster] || { title: cluster, description: '' };
  return `${i + 1}. ${cluster}: "${clusterData.title}" - ${clusterData.description}`;
}).join('\n')}

Genera los 4 dolores principales en este formato:
{
  "dolores": [
    {
      "cluster": "A-VISIBILIDAD",
      "titulo": "Título corto y directo",
      "descripcion": "Descripción personalizada para esta empresa",
      "impacto": "Consecuencia concreta de este dolor"
    }
  ]
}`;

  try {
    const response = await fetch(CONFIG.chatApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: CONFIG.groqModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 1500
      })
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error('No valid JSON');

    const parsed = JSON.parse(jsonMatch[0]);

    return parsed.dolores.slice(0, 4).map((dolor, index) => {
      const clusterData = PAIN_CLUSTERS[dolor.cluster] || {};
      return {
        order: index + 1,
        key: dolor.cluster,
        title: dolor.titulo,
        description: dolor.descripcion,
        impacto: dolor.impacto,
        codes: clusterData.codes || [],
        focus: clusterData.focus || 9,
        confidence: 0.9 - (index * 0.05)
      };
    });

  } catch (error) {
    console.error('Error in AI pain detection:', error);
    return detectPainsFallback();
  }
}

function detectPainsFallback() {
  const { phase1 } = FormState.responses;
  const pains = [];

  // Construir basado en respuestas
  if (phase1.has_field_team !== 'no') {
    pains.push({
      order: 1,
      key: 'A-VISIBILIDAD',
      title: 'Sin visibilidad de tu equipo',
      description: 'No sabes qué está haciendo tu equipo de campo en tiempo real',
      codes: ['A01', 'A02', 'A08'],
      focus: 1,
      confidence: 0.85
    });
  }

  if (phase1.current_tech?.includes('excel') || phase1.current_tech?.includes('informal')) {
    pains.push({
      order: pains.length + 1,
      key: 'B-CENTRALIZACION',
      title: 'Información fragmentada',
      description: 'Cada quien tiene su propia versión de los datos',
      codes: ['B02', 'G01'],
      focus: 2,
      confidence: 0.80
    });
  }

  if (phase1.sector === 'pharma') {
    pains.push({
      order: pains.length + 1,
      key: 'C-TRAZABILIDAD',
      title: 'Muestras sin control',
      description: 'No puedes rastrear qué muestras se entregaron a quién',
      codes: ['C02', 'C03'],
      focus: 3,
      confidence: 0.85
    });
  }

  // Siempre incluir pipeline/ventas
  pains.push({
    order: pains.length + 1,
    key: 'D-PIPELINE',
    title: 'Pipeline invisible',
    description: 'Las oportunidades de venta viven en la cabeza de cada vendedor',
    codes: ['D01', 'D02', 'D03'],
    focus: 4,
    confidence: 0.80
  });

  // Completar hasta 4
  if (pains.length < 4) {
    pains.push({
      order: pains.length + 1,
      key: 'F-AUTOMATIZACION',
      title: 'Reportes manuales',
      description: 'Armar un reporte para dirección te toma días',
      codes: ['F01', 'F13'],
      focus: 9,
      confidence: 0.75
    });
  }

  return pains.slice(0, 4);
}

function renderDetectedPains() {
  const pains = FormState.detectedPains;

  const cards = DOM.painsList.querySelectorAll('.pain-card');
  cards.forEach((card, index) => {
    const pain = pains[index];
    if (pain) {
      card.querySelector('.pain-title').textContent = pain.title;
      card.querySelector('.pain-description').textContent = pain.description;
      card.style.animationDelay = `${index * 0.1}s`;
    }
  });
}

function handleConfirmPains() {
  FormState.painsConfirmed = true;
  FormState.finalPains = [...FormState.detectedPains];
  updateAudioScreenContent(true);
  goToScreen('audio-record');
}

function handleAdjustPains() {
  FormState.painsConfirmed = false;
  updateAudioScreenContent(false);
  goToScreen('audio-record');
}

function updateAudioScreenContent(confirmed) {
  if (confirmed) {
    DOM.audioTitle.textContent = 'Ahora cuéntanos más con tus palabras';
    DOM.audioSubtitle.textContent = 'Graba un audio de 1-2 minutos explicando:';
    DOM.audioPrompts.innerHTML = `
      <li>¿Cuál de estos 4 dolores te quita más el sueño?</li>
      <li>¿Qué has intentado hacer para resolverlo?</li>
      <li>¿Hay algo específico de tu operación que debamos saber?</li>
    `;
  } else {
    DOM.audioTitle.textContent = 'Cuéntanos qué ajustar';
    DOM.audioSubtitle.textContent = 'Graba un audio explicándonos:';
    DOM.audioPrompts.innerHTML = `
      <li>¿Qué dolor detectamos que NO es tu prioridad?</li>
      <li>¿Cuál es tu dolor REAL que no capturamos?</li>
      <li>Cuéntanos con tus palabras qué te quita el sueño</li>
    `;
  }
}

// ============================================================
// FASE 4: GRABACIÓN DE AUDIO
// ============================================================

let mediaRecorder = null;
let audioChunks = [];
let recordingTimer = null;
let recordingSeconds = 0;

function setupAudioRecorder() {
  FormState.audioBlob = null;
  FormState.audioUrl = null;
  audioChunks = [];
  recordingSeconds = 0;

  DOM.recorderTimer.textContent = '0:00';
  DOM.recorderStatus.textContent = 'Toca para grabar';
  DOM.audioRecorder.classList.remove('hidden');
  DOM.audioPreview.classList.add('hidden');

  DOM.recorderBtn.querySelector('.recorder-btn__record').classList.remove('hidden');
  DOM.recorderBtn.querySelector('.recorder-btn__stop').classList.add('hidden');
  DOM.recorderBtn.classList.remove('recording');
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
    });

    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
      FormState.audioBlob = blob;
      FormState.audioUrl = URL.createObjectURL(blob);

      DOM.audioPlayer.src = FormState.audioUrl;
      DOM.audioRecorder.classList.add('hidden');
      DOM.audioPreview.classList.remove('hidden');

      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start(1000);

    DOM.recorderBtn.classList.add('recording');
    DOM.recorderBtn.querySelector('.recorder-btn__record').classList.add('hidden');
    DOM.recorderBtn.querySelector('.recorder-btn__stop').classList.remove('hidden');
    DOM.recorderStatus.textContent = 'Grabando...';
    DOM.recorderVisualizer.classList.add('active');

    recordingSeconds = 0;
    recordingTimer = setInterval(() => {
      recordingSeconds++;
      const mins = Math.floor(recordingSeconds / 60);
      const secs = recordingSeconds % 60;
      DOM.recorderTimer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

      if (recordingSeconds >= CONFIG.maxAudioDuration) {
        stopRecording();
      }
    }, 1000);

  } catch (error) {
    console.error('Error accessing microphone:', error);
    DOM.recorderStatus.textContent = 'Error: No se pudo acceder al micrófono';
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    clearInterval(recordingTimer);
    DOM.recorderVisualizer.classList.remove('active');
  }
}

function toggleRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    stopRecording();
  } else {
    startRecording();
  }
}

function handleRerecord() {
  if (FormState.audioUrl) {
    URL.revokeObjectURL(FormState.audioUrl);
  }
  setupAudioRecorder();
}

async function handleUseAudio() {
  if (!FormState.audioBlob) return;
  await goToScreen('processing-audio');
}

// ============================================================
// PROCESAMIENTO DE AUDIO (WHISPER)
// ============================================================

async function handleProcessingAudio() {
  await sleep(1000);

  try {
    const transcription = await transcribeAudio(FormState.audioBlob);
    FormState.audioTranscription = transcription;

    if (!FormState.painsConfirmed) {
      const adjustedPains = await adjustPainsFromAudio(transcription);
      FormState.finalPains = adjustedPains;
    } else {
      FormState.finalPains = await enrichPainsFromAudio(FormState.detectedPains, transcription);
    }

  } catch (error) {
    console.error('Error processing audio:', error);
    FormState.finalPains = [...FormState.detectedPains];
  }

  await goToScreen('final-pains');
}

async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', CONFIG.whisperModel);
  formData.append('language', 'es');

  const response = await fetch(CONFIG.whisperApiUrl, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Whisper API error: ${response.status}`);
  }

  const data = await response.json();
  return data.text;
}

async function adjustPainsFromAudio(transcription) {
  const clustersList = Object.entries(PAIN_CLUSTERS)
    .map(([key, val]) => `${key}: ${val.title}`)
    .join('\n');

  const systemPrompt = `Eres un experto analizando necesidades empresariales.
El usuario NO estuvo de acuerdo con los dolores detectados y grabó un audio explicando sus dolores reales.

Analiza la transcripción y determina los 4 dolores principales.

BASE DE CLUSTERS DISPONIBLES:
${clustersList}

Responde SOLO con JSON válido.`;

  const userPrompt = `Dolores que habíamos detectado:
${FormState.detectedPains.map((p, i) => `${i + 1}. ${p.title}: ${p.description}`).join('\n')}

Transcripción del audio del usuario:
"${transcription}"

Genera los 4 dolores corregidos en este formato:
{
  "pains": [
    {
      "key": "A-VISIBILIDAD",
      "title": "Título corto",
      "description": "Descripción personalizada según lo que dijo",
      "audioContext": "Lo que el usuario enfatizó"
    }
  ]
}`;

  try {
    const response = await fetch(CONFIG.chatApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: CONFIG.groqModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 1000
      })
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error('No valid JSON');

    const parsed = JSON.parse(jsonMatch[0]);

    return parsed.pains.slice(0, 4).map((p, index) => ({
      order: index + 1,
      key: p.key,
      title: p.title,
      description: p.description,
      audioContext: p.audioContext,
      codes: PAIN_CLUSTERS[p.key]?.codes || [],
      focus: PAIN_CLUSTERS[p.key]?.focus || 9,
      confidence: 0.9
    }));

  } catch (error) {
    console.error('Error adjusting pains:', error);
    return FormState.detectedPains;
  }
}

async function enrichPainsFromAudio(pains, transcription) {
  return pains.map(pain => ({
    ...pain,
    audioContext: transcription ? 'Contexto adicional del audio disponible' : null
  }));
}

// ============================================================
// FASE 5: CONFIRMACIÓN FINAL
// ============================================================

function renderFinalPains() {
  const pains = FormState.finalPains;

  DOM.finalPainsList.innerHTML = pains.map((pain, index) => `
    <div class="final-pain-card">
      <div class="final-pain-number">DOLOR ${index + 1}</div>
      <h3 class="final-pain-title">${pain.title.toUpperCase()}</h3>
      <p class="final-pain-description">"${pain.description}"</p>
      ${pain.audioContext && pain.audioContext !== 'Contexto adicional del audio disponible' ? `<p class="final-pain-context">${pain.audioContext}</p>` : ''}
    </div>
  `).join('');

  setTimeout(() => {
    goToScreen('contact-info');
  }, 3000);
}

function focusContactForm() {
  // Pre-rellenar empresa si tenemos el dato
  if (FormState.company.name && DOM.contactCompany) {
    DOM.contactCompany.value = FormState.company.name;
  } else if (FormState.company.profile?.empresa?.nombre && DOM.contactCompany) {
    DOM.contactCompany.value = FormState.company.profile.empresa.nombre;
  }
  DOM.contactName.focus();
}

async function handleContactSubmit(e) {
  e.preventDefault();

  FormState.contact = {
    name: DOM.contactName.value.trim(),
    company: DOM.contactCompany.value.trim(),
    email: DOM.contactEmail.value.trim(),
    whatsapp: DOM.contactWhatsapp.value.trim()
  };

  const formData = prepareFormData();

  try {
    const response = await fetch(CONFIG.submitApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      console.error('Error submitting form:', await response.text());
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }

  DOM.thanksName.textContent = FormState.contact.name.split(' ')[0] || 'amigo';
  await goToScreen('thank-you');
}

function prepareFormData() {
  return {
    id: `form_${Date.now()}`,
    timestamp: new Date().toISOString(),

    empresa: {
      nombre: FormState.contact.company,
      contacto: FormState.contact.name,
      email: FormState.contact.email,
      whatsapp: FormState.contact.whatsapp,
      tamaño: FormState.responses.phase1.team_size,
      sector: FormState.responses.phase1.sector,
      tiene_campo: FormState.responses.phase1.has_field_team,
      tecnologia_actual: FormState.responses.phase1.current_tech,
      motivacion: FormState.responses.phase1.motivation
    },

    investigacion_empresa: FormState.company.profile,

    respuestas_fase1: FormState.responses.phase1,
    respuestas_fase2: FormState.responses.phase2,

    pains_detectados_inicial: FormState.detectedPains,
    confirmacion_pains: FormState.painsConfirmed ? 'si' : 'no',

    audio: {
      transcripcion: FormState.audioTranscription,
      duracion_segundos: recordingSeconds
    },

    pains_finales: FormState.finalPains,

    experiencias_sugeridas: getExperienciasSugeridas(),
    plan_recomendado: getPlanRecomendado()
  };
}

function getExperienciasSugeridas() {
  const experiencias = new Set();

  FormState.finalPains.forEach(pain => {
    switch (pain.focus) {
      case 1: experiencias.add('Representante'); experiencias.add('Supervisor'); break;
      case 2: experiencias.add('Representante'); break;
      case 3: experiencias.add('Representante'); experiencias.add('Admin'); break;
      case 4: experiencias.add('Comercial'); break;
      case 5: experiencias.add('Comercial'); break;
      case 10: experiencias.add('Admin'); break;
      default: experiencias.add('Supervisor');
    }
  });

  return Array.from(experiencias);
}

function getPlanRecomendado() {
  const needsAI = FormState.finalPains.some(p =>
    ['P-VOZ', 'P-CONTEXTO', 'P-ALERTAS', 'P-AUTOMATICO'].includes(p.key)
  );

  if (needsAI) return 'Pro';
  if (FormState.responses.phase1.has_field_team !== 'no') return 'Esencial';
  return 'Base';
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

function handleKeyboardShortcuts(e) {
  if (e.key === 'Enter') {
    // En pantalla de empresa
    if (FormState.currentScreen === 'q0-company') {
      handleCompanySubmit();
      return;
    }

    const activeOption = document.querySelector('.option-btn.selected');
    if (activeOption) {
      advanceFromCurrentQuestion();
    }
    return;
  }

  const key = e.key.toUpperCase();
  if (key >= 'A' && key <= 'F') {
    const index = key.charCodeAt(0) - 65;
    const currentOptions = document.querySelectorAll('.form-screen.active .option-btn');
    if (currentOptions[index]) {
      currentOptions[index].click();
    }
  }

  if (e.key === 'Escape') {
    goBack();
  }
}

// ============================================================
// INICIALIZACIÓN
// ============================================================

function init() {
  initDOM();

  // Event Listeners - Botón Start (ahora va a pregunta de empresa)
  DOM.btnStart.addEventListener('click', () => goToScreen('q0-company'));

  // Event Listeners - Empresa
  if (DOM.btnResearchCompany) {
    DOM.btnResearchCompany.addEventListener('click', handleCompanySubmit);
  }
  if (DOM.companyInput) {
    DOM.companyInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleCompanySubmit();
    });
  }

  // Event Listeners - Opciones
  document.addEventListener('click', handleOptionClick);

  // Event Listeners - Navegación
  DOM.btnPrev.addEventListener('click', goBack);

  // Event Listeners - Multi-select continue
  if (DOM.btnContinueQ4) {
    DOM.btnContinueQ4.addEventListener('click', advanceFromCurrentQuestion);
  }

  // Event Listeners - Pains
  DOM.btnConfirmPains.addEventListener('click', handleConfirmPains);
  DOM.btnAdjustPains.addEventListener('click', handleAdjustPains);

  // Event Listeners - Audio
  DOM.recorderBtn.addEventListener('click', toggleRecording);
  DOM.btnRerecord.addEventListener('click', handleRerecord);
  DOM.btnUseAudio.addEventListener('click', handleUseAudio);

  // Event Listeners - Contact Form
  DOM.contactForm.addEventListener('submit', handleContactSubmit);

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);

  // Responsive
  window.addEventListener('resize', () => {
    const questionScreens = FormState.currentScreen.startsWith('q1-') ||
                           FormState.currentScreen === 'phase2-questions';
    showKeyboardHints(questionScreens && window.innerWidth > 768);
  });

  console.log('APEX Discovery Form initialized with full pain catalog (169 pains)');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
