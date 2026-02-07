/**
 * APEX Pain Knowledge Base - Base de Conocimientos de Dolores
 *
 * Versión expandida con 500+ dolores específicos para:
 * - Distribuidoras farmacéuticas PyMEs
 * - Empresas con equipo de campo
 * - Gestión comercial y de información
 *
 * Organización:
 * - PARTE I: Dolores COMUNES (aplican a cualquier empresa con ventas/campo)
 * - PARTE II: Dolores ESPECÍFICOS para distribuidoras farmacéuticas
 *
 * Fuentes de investigación (2024-2025):
 * - FDA/COFEPRIS compliance requirements
 * - DSCSA (Drug Supply Chain Security Act)
 * - GDP (Good Distribution Practice) inspections
 * - Industry reports: Deloitte, PwC, McKinsey pharma distribution
 * - CRM adoption studies: Veeva, Salesforce Health Cloud
 */

// ============================================================
// PARTE I: DOLORES COMUNES - CUALQUIER EMPRESA CON VENTAS/CAMPO
// ============================================================

const COMMON_PAINS = {

  // ==================== A. VISIBILIDAD DEL EQUIPO DE CAMPO (25 dolores) ====================
  // Problema central: No saber qué hace el equipo cuando no está en la oficina

  'A01': {
    cluster: 'A-VISIBILIDAD',
    title: 'No sé qué hacen mis representantes durante el día',
    signals: ['no tengo visibilidad', 'no me reportan', 'cada quien hace lo suyo', 'trabajan solos'],
    impact: 'Imposible optimizar rendimiento sin datos',
    question_hint: '¿Cómo sabes qué hizo tu equipo hoy?',
    focus: 1
  },
  'A02': {
    cluster: 'A-VISIBILIDAD',
    title: 'No sé si mis reps realmente visitaron al cliente',
    signals: ['no puedo verificar', 'confío en su palabra', 'no hay forma de saber', 'me tengo que creer'],
    impact: 'Gastos de viáticos sin verificación',
    question_hint: '¿Cómo verificas que las visitas se hicieron?',
    focus: 1
  },
  'A03': {
    cluster: 'A-UBICACION',
    title: 'No sé dónde está mi equipo en tiempo real',
    signals: ['no sé dónde andan', 'se supone que están en campo', 'les marco y no contestan'],
    impact: 'No puedo reasignar visitas urgentes',
    question_hint: '¿Puedes ubicar a tu equipo ahora mismo?',
    focus: 1
  },
  'A04': {
    cluster: 'A-REGISTRO',
    title: 'Registran las visitas al final del día (o nunca)',
    signals: ['registran después', 'se les olvida', 'al final del día', 'cuando se acuerdan'],
    impact: 'Datos incompletos e inexactos',
    question_hint: '¿Cuándo registra tu equipo sus visitas?',
    focus: 1
  },
  'A05': {
    cluster: 'A-UBICACION',
    title: 'No sé cuánto tiempo pasan en cada visita',
    signals: ['no sé si realmente estuvo', 'pudo haber sido 5 minutos', 'dice que una hora'],
    impact: 'Visitas fantasma sin detectar',
    question_hint: '¿Sabes la duración real de cada visita?',
    focus: 1
  },
  'A06': {
    cluster: 'A-COBERTURA',
    title: 'Visitan a los clientes fáciles, no a los prioritarios',
    signals: ['visitan a sus amigos', 'los fáciles', 'no siguen la ruta', 'evitan a los difíciles'],
    impact: 'Clientes importantes desatendidos',
    question_hint: '¿Tu equipo sigue un plan de visitas?',
    focus: 1
  },
  'A07': {
    cluster: 'A-COBERTURA',
    title: 'Trabajan sin agenda, van donde quieren',
    signals: ['sin plan', 'improvisan', 'no hay ruta', 'a donde les dé la gana'],
    impact: 'Rutas ineficientes, tiempo perdido',
    question_hint: '¿Quién decide qué clientes visitar?',
    focus: 1
  },
  'A08': {
    cluster: 'A-VERIFICACION',
    title: 'No tengo evidencia de que estuvo en el lugar',
    signals: ['no hay prueba', 'no hay evidencia', 'solo su palabra', 'sin foto'],
    impact: 'Viáticos sin justificación',
    question_hint: '¿Qué evidencia tienes de cada visita?',
    focus: 1
  },
  'A09': {
    cluster: 'A-CONOCIMIENTO',
    title: 'Cuando un rep se va, se lleva toda la información',
    signals: ['se fue y perdimos todo', 'no dejó nada documentado', 'empezar de cero', 'en su celular'],
    impact: 'Pérdida de relaciones con clientes',
    question_hint: '¿Qué pasa cuando alguien renuncia?',
    focus: 1
  },
  'A10': {
    cluster: 'A-PRODUCTIVIDAD',
    title: 'No puedo comparar la productividad entre reps',
    signals: ['no puedo comparar', 'no sé quién es mejor', 'todos dicen que trabajan'],
    impact: 'Imposible premiar al mejor',
    question_hint: '¿Cómo identificas a tu mejor vendedor?',
    focus: 1
  },
  'A11': {
    cluster: 'A-REGISTRO',
    title: 'No registran las visitas fallidas',
    signals: ['solo registran las buenas', 'no documentan los fallos', 'no estaba'],
    impact: 'Datos sesgados, mal planning',
    question_hint: '¿Registran cuando el cliente no está?',
    focus: 1
  },
  'A12': {
    cluster: 'A-PRODUCTIVIDAD',
    title: 'No sé cuántas visitas efectivas hace cada rep',
    signals: ['no tengo el número real', 'dicen que muchas', 'no hay métrica'],
    impact: 'Sin benchmark de productividad',
    question_hint: '¿Cuántas visitas hace cada quien al día?',
    focus: 1
  },
  'A13': {
    cluster: 'A-CONOCIMIENTO',
    title: 'Los nuevos tardan meses en conocer su territorio',
    signals: ['el nuevo no sabe nada', 'tarda en arrancar', 'curva de aprendizaje larga'],
    impact: 'Meses sin productividad',
    question_hint: '¿Cuánto tarda un nuevo en ser productivo?',
    focus: 1
  },
  'A14': {
    cluster: 'A-RUTAS',
    title: 'No tengo rutas optimizadas',
    signals: ['dan muchas vueltas', 'ineficientes', 'gastan gasolina', 'tiempo en tráfico'],
    impact: 'Costos de transporte elevados',
    question_hint: '¿Optimizas las rutas de tu equipo?',
    focus: 1
  },
  'A15': {
    cluster: 'A-VISIBILIDAD',
    title: 'No sé si cumplen con el horario de trabajo',
    signals: ['entran tarde', 'salen temprano', 'no sé a qué hora arrancan'],
    impact: 'Horas no trabajadas',
    question_hint: '¿Cómo controlas el horario del equipo?',
    focus: 1
  },
  'A16': {
    cluster: 'A-VERIFICACION',
    title: 'Los check-ins se pueden falsear fácilmente',
    signals: ['hacen check desde su casa', 'GPS falso', 'no es confiable'],
    impact: 'Sistema de control inútil',
    question_hint: '¿Confías en los check-ins del sistema?',
    focus: 1
  },
  'A17': {
    cluster: 'A-COBERTURA',
    title: 'Hay clientes que nunca reciben visita',
    signals: ['clientes olvidados', 'meses sin visitar', 'no les toca'],
    impact: 'Clientes perdidos por abandono',
    question_hint: '¿Cuántos clientes no has visitado en 90 días?',
    focus: 1
  },
  'A18': {
    cluster: 'A-PRODUCTIVIDAD',
    title: 'No sé si el equipo está saturado o tiene capacidad',
    signals: ['dicen que no les da tiempo', 'pueden hacer más', 'no sé la carga real'],
    impact: 'Mala distribución de trabajo',
    question_hint: '¿Sabes la carga de trabajo de cada rep?',
    focus: 1
  },
  'A19': {
    cluster: 'A-REGISTRO',
    title: 'Las notas de visita son inútiles o inexistentes',
    signals: ['notas vacías', 'todo bien', 'sin detalle', 'copy-paste'],
    impact: 'Sin información de valor',
    question_hint: '¿Qué calidad tienen las notas de visita?',
    focus: 1
  },
  'A20': {
    cluster: 'A-RUTAS',
    title: 'Gastan horas en tráfico entre visitas',
    signals: ['mucho tiempo manejando', 'lejos una de otra', 'rutas cruzadas'],
    impact: 'Menos visitas por día',
    question_hint: '¿Cuánto tiempo pasan en tráfico?',
    focus: 1
  },
  'A21': {
    cluster: 'A-SUPERVISIÓN',
    title: 'Los supervisores no acompañan a sus equipos',
    signals: ['nunca salen a campo', 'no hacen ride-alongs', 'solo ven reportes'],
    impact: 'Sin coaching en campo',
    question_hint: '¿Con qué frecuencia acompañas a tu equipo?',
    focus: 1
  },
  'A22': {
    cluster: 'A-SUPERVISIÓN',
    title: 'No tengo forma de dar feedback sobre visitas',
    signals: ['no hay forma de comentar', 'feedback verbal que se olvida'],
    impact: 'Sin mejora continua',
    question_hint: '¿Cómo das retroalimentación a tu equipo?',
    focus: 1
  },
  'A23': {
    cluster: 'A-COBERTURA',
    title: 'No sé qué clientes están sobrevisitados',
    signals: ['van demasiado', 'pierden tiempo', 'el mismo cliente 3 veces al mes'],
    impact: 'Recursos mal distribuidos',
    question_hint: '¿Hay clientes que visitas de más?',
    focus: 1
  },
  'A24': {
    cluster: 'A-VERIFICACION',
    title: 'No puedo verificar si se cumplieron los objetivos de la visita',
    signals: ['fue pero no hizo lo que debía', 'visita sin propósito'],
    impact: 'Visitas sin resultado',
    question_hint: '¿Cada visita tiene objetivos claros?',
    focus: 1
  },
  'A25': {
    cluster: 'A-CONOCIMIENTO',
    title: 'La información de campo no llega a dirección',
    signals: ['dirección no sabe', 'desconectados de la realidad', 'en una burbuja'],
    impact: 'Decisiones sin información real',
    question_hint: '¿La dirección conoce lo que pasa en campo?',
    focus: 1
  },

  // ==================== B. GESTIÓN DE CONTACTOS Y CLIENTES (25 dolores) ====================
  // Problema central: Base de datos de clientes desorganizada y desactualizada

  'B01': {
    cluster: 'B-DATOS',
    title: 'Los datos de contacto están desactualizados',
    signals: ['información vieja', 'teléfonos que no sirven', 'ya no está ahí', 'se cambió'],
    impact: 'Visitas perdidas, llamadas fallidas',
    question_hint: '¿Hace cuánto actualizaste tus datos?',
    focus: 2
  },
  'B02': {
    cluster: 'B-CENTRALIZACION',
    title: 'Cada rep tiene su propia libreta/Excel',
    signals: ['cada quien tiene lo suyo', 'no hay base central', 'en su celular', 'en su laptop'],
    impact: 'Datos dispersos e inconsistentes',
    question_hint: '¿Dónde guarda tu equipo los contactos?',
    focus: 2
  },
  'B03': {
    cluster: 'B-INVENTARIO',
    title: 'No sé cuántos clientes activos tengo',
    signals: ['no tengo el número', 'nadie sabe cuántos son', 'depende de cómo cuentes'],
    impact: 'Sin visión del universo de clientes',
    question_hint: '¿Cuántos clientes tienes en total?',
    focus: 2
  },
  'B04': {
    cluster: 'B-SEGMENTACION',
    title: 'Clientes sin categorizar por importancia',
    signals: ['todos son iguales', 'no hay prioridad', 'no sé cuáles son los buenos'],
    impact: 'Mismos recursos para todos',
    question_hint: '¿Tienes clientes categorizados por valor?',
    focus: 2
  },
  'B05': {
    cluster: 'B-COBERTURA',
    title: 'No sé qué segmentos estoy cubriendo',
    signals: ['no tengo mapeado', 'hay huecos', 'no sé qué me falta'],
    impact: 'Oportunidades perdidas',
    question_hint: '¿Conoces todos tus segmentos de mercado?',
    focus: 2
  },
  'B06': {
    cluster: 'B-TRANSICION',
    title: 'Cambiar un rep de territorio es un caos',
    signals: ['se pierde todo', 'el nuevo no sabe nada', 'caos en la transición'],
    impact: 'Semanas sin atención a clientes',
    question_hint: '¿Cómo manejas los cambios de territorio?',
    focus: 2
  },
  'B07': {
    cluster: 'B-DATOS',
    title: 'Hay clientes duplicados en los registros',
    signals: ['el mismo varias veces', 'duplicados', 'datos sucios'],
    impact: 'Reportes incorrectos, confusión',
    question_hint: '¿Tu base tiene clientes duplicados?',
    focus: 2
  },
  'B08': {
    cluster: 'B-METRICAS',
    title: 'No sé cuántos clientes nuevos captamos',
    signals: ['no mido captación', 'no sé si estamos creciendo'],
    impact: 'Sin visión de crecimiento',
    question_hint: '¿Mides la captación de clientes nuevos?',
    focus: 2
  },
  'B09': {
    cluster: 'B-HISTORIAL',
    title: 'Sin historial de la relación con cada cliente',
    signals: ['no sé qué pasó antes', 'historial incompleto', 'empezar de cero'],
    impact: 'Cada visita empieza desde cero',
    question_hint: '¿Tienes historial de cada cliente?',
    focus: 2
  },
  'B10': {
    cluster: 'B-PERSONALIZACION',
    title: 'No conozco las preferencias de cada cliente',
    signals: ['no sé cuándo visitarlo', 'no sé qué le interesa', 'no sé su horario'],
    impact: 'Atención genérica, no personalizada',
    question_hint: '¿Conoces las preferencias de tus clientes?',
    focus: 2
  },
  'B11': {
    cluster: 'B-SEGUIMIENTO',
    title: 'Los clientes se quejan de falta de seguimiento',
    signals: ['se quejan', 'prometemos y no cumplimos', 'no les regresamos'],
    impact: 'Pérdida de confianza',
    question_hint: '¿Te han reclamado por no dar seguimiento?',
    focus: 2
  },
  'B12': {
    cluster: 'B-CHURN',
    title: 'No sé qué clientes perdimos y por qué',
    signals: ['clientes perdidos', 'ya no compran', 'no sé por qué se fueron'],
    impact: 'Sin aprendizaje, se repite el error',
    question_hint: '¿Analizas por qué pierdes clientes?',
    focus: 2
  },
  'B13': {
    cluster: 'B-SEGMENTACION',
    title: 'No tengo scoring de clientes por potencial',
    signals: ['no sé su potencial', 'no tengo scoring', 'todos iguales'],
    impact: 'Recursos mal asignados',
    question_hint: '¿Sabes el potencial de cada cliente?',
    focus: 2
  },
  'B14': {
    cluster: 'B-DATOS',
    title: 'Datos incompletos de ubicación del cliente',
    signals: ['solo tengo el nombre', 'no sé dónde encontrarlo', 'dirección incompleta'],
    impact: 'Visitas perdidas',
    question_hint: '¿Tienes direcciones completas de todos?',
    focus: 2
  },
  'B15': {
    cluster: 'B-COMPETENCIA',
    title: 'No sé a quién más le compra el cliente',
    signals: ['no sé quién más los visita', 'la competencia'],
    impact: 'Sin estrategia competitiva',
    question_hint: '¿Sabes con quién compites en cada cliente?',
    focus: 2
  },
  'B16': {
    cluster: 'B-CENTRALIZACION',
    title: 'Contactos importantes están en celulares personales',
    signals: ['en su WhatsApp', 'en su celular personal', 'no en el sistema'],
    impact: 'Dependencia de individuos',
    question_hint: '¿Los contactos están en sistema o en celulares?',
    focus: 2
  },
  'B17': {
    cluster: 'B-HISTORIAL',
    title: 'No sé el volumen histórico de compra de cada cliente',
    signals: ['no sé cuánto compra', 'no tengo el histórico'],
    impact: 'Sin contexto para negociar',
    question_hint: '¿Conoces el historial de compra por cliente?',
    focus: 2
  },
  'B18': {
    cluster: 'B-DATOS',
    title: 'No registro los tomadores de decisión',
    signals: ['no sé quién decide', 'hablo con cualquiera'],
    impact: 'Vendiendo a quien no compra',
    question_hint: '¿Identificas quién toma las decisiones?',
    focus: 2
  },
  'B19': {
    cluster: 'B-METRICAS',
    title: 'No mido la frecuencia de compra de cada cliente',
    signals: ['no sé cada cuánto compra', 'no tengo el patrón'],
    impact: 'Oportunidades de recompra perdidas',
    question_hint: '¿Sabes la frecuencia de compra por cliente?',
    focus: 2
  },
  'B20': {
    cluster: 'B-SEGMENTACION',
    title: 'No distingo entre prospectos y clientes',
    signals: ['todo revuelto', 'no sé cuáles ya compraron'],
    impact: 'Comunicación incorrecta',
    question_hint: '¿Distingues prospectos de clientes?',
    focus: 2
  },
  'B21': {
    cluster: 'B-DATOS',
    title: 'Información de contacto solo por un canal',
    signals: ['solo tengo su celular', 'no tengo email', 'un solo contacto'],
    impact: 'Dependencia de un canal',
    question_hint: '¿Tienes múltiples formas de contactar?',
    focus: 2
  },
  'B22': {
    cluster: 'B-CHURN',
    title: 'No detecto señales de riesgo de abandono',
    signals: ['se van sin aviso', 'no veo las señales'],
    impact: 'Clientes perdidos sin intervención',
    question_hint: '¿Detectas cuando un cliente se va a ir?',
    focus: 2
  },
  'B23': {
    cluster: 'B-SEGUIMIENTO',
    title: 'No tengo alertas de clientes sin contacto reciente',
    signals: ['se me olvidan', 'meses sin hablarles'],
    impact: 'Relaciones enfriadas',
    question_hint: '¿Te alerta el sistema de clientes sin contacto?',
    focus: 2
  },
  'B24': {
    cluster: 'B-PERSONALIZACION',
    title: 'No registro fechas importantes del cliente',
    signals: ['no sé su cumpleaños', 'aniversario de relación'],
    impact: 'Oportunidades de conexión perdidas',
    question_hint: '¿Registras fechas importantes?',
    focus: 2
  },
  'B25': {
    cluster: 'B-CENTRALIZACION',
    title: 'Las notas sobre clientes están en post-its',
    signals: ['papelitos', 'notas sueltas', 'se pierden'],
    impact: 'Información perdida',
    question_hint: '¿Dónde guardas las notas sobre clientes?',
    focus: 2
  },

  // ==================== D. VENTAS Y OPORTUNIDADES (30 dolores) ====================
  // Problema central: Pipeline invisible, forecast imposible

  'D01': {
    cluster: 'D-VISIBILIDAD',
    title: 'Las oportunidades viven en la cabeza del vendedor',
    signals: ['en la cabeza', 'no hay registro', 'solo él sabe'],
    impact: 'Riesgo total si se va',
    question_hint: '¿Dónde registran las oportunidades?',
    focus: 4
  },
  'D02': {
    cluster: 'D-PIPELINE',
    title: 'No tengo pipeline visual',
    signals: ['no veo el embudo', 'no sé cuántas hay', 'no hay funnel'],
    impact: 'Sin visión del negocio',
    question_hint: '¿Tienes un pipeline de oportunidades?',
    focus: 4
  },
  'D03': {
    cluster: 'D-PIPELINE',
    title: 'No sé en qué etapa está cada oportunidad',
    signals: ['no sé cómo va', 'cada quien lleva lo suyo'],
    impact: 'Imposible intervenir',
    question_hint: '¿Conoces la etapa de cada deal?',
    focus: 4
  },
  'D04': {
    cluster: 'D-FORECAST',
    title: 'No sé cuánto voy a vender hasta el cierre',
    signals: ['sorpresa a fin de mes', 'no puedo predecir'],
    impact: 'Planeación imposible',
    question_hint: '¿Puedes predecir tus ventas del mes?',
    focus: 4
  },
  'D05': {
    cluster: 'D-COTIZACIONES',
    title: 'Cotizaciones en Word/Excel sin historial',
    signals: ['en Word', 'no hay historial de cotizaciones'],
    impact: 'Sin seguimiento de propuestas',
    question_hint: '¿Cómo haces las cotizaciones?',
    focus: 4
  },
  'D06': {
    cluster: 'D-COTIZACIONES',
    title: 'Cada vendedor cotiza diferente',
    signals: ['cada quien a su manera', 'no hay formato', 'inconsistente'],
    impact: 'Imagen poco profesional',
    question_hint: '¿Hay formato estándar de cotización?',
    focus: 4
  },
  'D07': {
    cluster: 'D-DESCUENTOS',
    title: 'Descuentos sin control ni aprobación',
    signals: ['descuentos locos', 'sin autorización', 'regalan margen'],
    impact: 'Pérdida de rentabilidad',
    question_hint: '¿Quién autoriza los descuentos?',
    focus: 4
  },
  'D08': {
    cluster: 'D-SEGUIMIENTO',
    title: 'No sé qué oportunidades están estancadas',
    signals: ['deals parados', 'no se mueven', 'olvidados'],
    impact: 'Oportunidades que se enfrían',
    question_hint: '¿Detectas deals estancados?',
    focus: 4
  },
  'D09': {
    cluster: 'D-SCORING',
    title: 'No priorizo oportunidades por probabilidad',
    signals: ['no sé cuáles son las buenas', 'sin prioridad'],
    impact: 'Tiempo en deals que no cerrarán',
    question_hint: '¿Tienes scoring de oportunidades?',
    focus: 4
  },
  'D10': {
    cluster: 'D-SEGUIMIENTO',
    title: 'Pierdo ventas por falta de seguimiento',
    signals: ['se nos fueron', 'no dimos seguimiento', 'se enfrió'],
    impact: 'Ventas perdidas evitables',
    question_hint: '¿Has perdido ventas por no dar seguimiento?',
    focus: 4
  },
  'D11': {
    cluster: 'D-ANALISIS',
    title: 'No documento por qué perdí una venta',
    signals: ['no sé por qué perdimos', 'no documentamos', 'no analizamos'],
    impact: 'Se repiten los mismos errores',
    question_hint: '¿Analizas las ventas perdidas?',
    focus: 4
  },
  'D12': {
    cluster: 'D-FORECAST',
    title: 'Forecast poco confiable',
    signals: ['forecast poco confiable', 'siempre falla', 'nunca le atino'],
    impact: 'Planeación incorrecta',
    question_hint: '¿Qué tan preciso es tu forecast?',
    focus: 4
  },
  'D13': {
    cluster: 'D-PRECIOS',
    title: 'Precios no accesibles para el equipo',
    signals: ['precios viejos', 'no saben el precio actual', 'tienen que preguntar'],
    impact: 'Cotizaciones incorrectas',
    question_hint: '¿Tu equipo tiene precios actualizados?',
    focus: 4
  },
  'D14': {
    cluster: 'D-APROBACIONES',
    title: 'Aprobación de descuentos por WhatsApp',
    signals: ['por WhatsApp', 'mandan mensaje para aprobar'],
    impact: 'Sin auditoría, proceso informal',
    question_hint: '¿Cómo aprueban descuentos especiales?',
    focus: 4
  },
  'D15': {
    cluster: 'D-METRICAS',
    title: 'No conozco mi ticket promedio',
    signals: ['no tengo métricas', 'no sé el promedio'],
    impact: 'Sin benchmark de ventas',
    question_hint: '¿Conoces tu ticket promedio?',
    focus: 4
  },
  'D16': {
    cluster: 'D-VISIBILIDAD',
    title: 'No sé el valor total de mi pipeline',
    signals: ['no sé cuánto tengo en juego', 'no lo tengo sumado'],
    impact: 'Sin visión del potencial',
    question_hint: '¿Conoces el valor de tu pipeline?',
    focus: 4
  },
  'D17': {
    cluster: 'D-SEGUIMIENTO',
    title: 'No hay recordatorios de seguimiento',
    signals: ['se me olvida', 'no hay alertas', 'cuando me acuerdo'],
    impact: 'Seguimiento inconsistente',
    question_hint: '¿Tienes recordatorios de seguimiento?',
    focus: 4
  },
  'D18': {
    cluster: 'D-PIPELINE',
    title: 'No sé la antigüedad de cada oportunidad',
    signals: ['no sé hace cuánto está', 'deals viejos'],
    impact: 'Deals zombies en el pipeline',
    question_hint: '¿Sabes hace cuánto está cada deal?',
    focus: 4
  },
  'D19': {
    cluster: 'D-ANALISIS',
    title: 'No sé mi tasa de conversión por etapa',
    signals: ['no sé cuántos se pierden', 'conversion rate'],
    impact: 'Sin optimización del proceso',
    question_hint: '¿Conoces tu conversión por etapa?',
    focus: 4
  },
  'D20': {
    cluster: 'D-COTIZACIONES',
    title: 'Las cotizaciones no tienen vigencia',
    signals: ['precios viejos válidos', 'sin fecha de expiración'],
    impact: 'Compromisos a precios obsoletos',
    question_hint: '¿Tus cotizaciones tienen vigencia?',
    focus: 4
  },
  'D21': {
    cluster: 'D-DESCUENTOS',
    title: 'No sé cuánto margen estoy cediendo',
    signals: ['no sé el impacto', 'damos descuentos sin medir'],
    impact: 'Rentabilidad erosionada',
    question_hint: '¿Mides el impacto de los descuentos?',
    focus: 4
  },
  'D22': {
    cluster: 'D-FORECAST',
    title: 'Los vendedores inflan sus pronósticos',
    signals: ['optimistas', 'nunca se cumple', 'dicen que van a cerrar'],
    impact: 'Forecast poco confiable',
    question_hint: '¿Los pronósticos de tu equipo se cumplen?',
    focus: 4
  },
  'D23': {
    cluster: 'D-SCORING',
    title: 'No sé qué oportunidades necesitan ayuda',
    signals: ['no sé dónde intervenir', 'cuáles empujar'],
    impact: 'Deals perdidos por falta de apoyo',
    question_hint: '¿Identificas deals que necesitan apoyo?',
    focus: 4
  },
  'D24': {
    cluster: 'D-VISIBILIDAD',
    title: 'No veo las actividades sobre cada oportunidad',
    signals: ['no sé qué han hecho', 'sin log de actividades'],
    impact: 'Sin visibilidad de esfuerzo',
    question_hint: '¿Ves qué se ha hecho en cada deal?',
    focus: 4
  },
  'D25': {
    cluster: 'D-METRICAS',
    title: 'No sé mi ciclo de venta promedio',
    signals: ['no sé cuánto tarda', 'sales cycle'],
    impact: 'Sin predicción de cierre',
    question_hint: '¿Cuánto tarda un deal en cerrar?',
    focus: 4
  },
  'D26': {
    cluster: 'D-PIPELINE',
    title: 'Mezclo oportunidades de diferentes tamaños',
    signals: ['todo junto', 'no distingo por tamaño'],
    impact: 'Atención incorrecta por tamaño',
    question_hint: '¿Distingues deals por tamaño?',
    focus: 4
  },
  'D27': {
    cluster: 'D-ANALISIS',
    title: 'No sé por qué canal vienen mis mejores deals',
    signals: ['no sé de dónde vienen', 'sin atribución'],
    impact: 'Inversión en canales incorrectos',
    question_hint: '¿Sabes de dónde vienen tus mejores deals?',
    focus: 4
  },
  'D28': {
    cluster: 'D-COTIZACIONES',
    title: 'No sé cuántas cotizaciones están pendientes',
    signals: ['no sé cuántas mandé', 'cotizaciones sin respuesta'],
    impact: 'Propuestas sin seguimiento',
    question_hint: '¿Cuántas cotizaciones tienes pendientes?',
    focus: 4
  },
  'D29': {
    cluster: 'D-SEGUIMIENTO',
    title: 'No registro los próximos pasos de cada deal',
    signals: ['sin next steps', 'qué sigue'],
    impact: 'Deals sin acción clara',
    question_hint: '¿Registras el próximo paso de cada deal?',
    focus: 4
  },
  'D30': {
    cluster: 'D-APROBACIONES',
    title: 'Proceso de aprobación de pedidos lento',
    signals: ['tarda en aprobarse', 'el cliente espera', 'burocracia'],
    impact: 'Clientes frustrados',
    question_hint: '¿Cuánto tarda aprobar un pedido especial?',
    focus: 4
  },

  // ==================== E. COBRANZA Y FINANZAS (15 dolores) ====================

  'E01': {
    cluster: 'E-SEGUIMIENTO',
    title: 'Facturas vencidas que nadie cobra',
    signals: ['facturas olvidadas', 'nadie cobra', 'se acumulan'],
    impact: 'Flujo de caja afectado',
    question_hint: '¿Tienes facturas vencidas sin cobrar?',
    focus: 5
  },
  'E02': {
    cluster: 'E-VISIBILIDAD',
    title: 'No sé la antigüedad de mis cuentas por cobrar',
    signals: ['no sé hace cuánto', 'antigüedad de saldos'],
    impact: 'Sin priorización de cobranza',
    question_hint: '¿Conoces la antigüedad de tu cartera?',
    focus: 5
  },
  'E03': {
    cluster: 'E-AUTOMATIZACION',
    title: 'Recordatorios de pago manuales',
    signals: ['llamamos uno por uno', 'no hay recordatorios automáticos'],
    impact: 'Tiempo perdido en cobranza',
    question_hint: '¿Los recordatorios de pago son automáticos?',
    focus: 5
  },
  'E04': {
    cluster: 'E-SCORING',
    title: 'No sé qué clientes pagan bien',
    signals: ['no tengo historial', 'todos igual'],
    impact: 'Crédito a malos pagadores',
    question_hint: '¿Tienes historial de pago por cliente?',
    focus: 5
  },
  'E05': {
    cluster: 'E-ALERTAS',
    title: 'Me entero de vencidos cuando ya pasaron 60 días',
    signals: ['me entero tarde', 'ya venció hace rato'],
    impact: 'Cobranza difícil por antigüedad',
    question_hint: '¿Cuándo te enteras de facturas vencidas?',
    focus: 5
  },
  'E06': {
    cluster: 'E-PROCESO',
    title: 'Sin proceso escalonado de cobranza',
    signals: ['no hay proceso', 'improvisamos'],
    impact: 'Cobranza inconsistente',
    question_hint: '¿Tienes proceso definido de cobranza?',
    focus: 5
  },
  'E07': {
    cluster: 'E-VISIBILIDAD',
    title: 'No veo todo lo que me deben en un solo lugar',
    signals: ['disperso', 'no hay vista consolidada'],
    impact: 'Sin visión de cartera total',
    question_hint: '¿Ves toda tu cartera en un solo lugar?',
    focus: 5
  },
  'E08': {
    cluster: 'E-SEGUIMIENTO',
    title: 'Promesas de pago sin registro',
    signals: ['prometen y no pagan', 'no documentamos'],
    impact: 'Sin accountability del cliente',
    question_hint: '¿Registras las promesas de pago?',
    focus: 5
  },
  'E09': {
    cluster: 'E-ANALISIS',
    title: 'No mido el impacto de morosidad en flujo',
    signals: ['no mido el impacto', 'flujo de caja'],
    impact: 'Problemas de liquidez',
    question_hint: '¿Mides el impacto de la morosidad?',
    focus: 5
  },
  'E10': {
    cluster: 'E-COMUNICACION',
    title: 'Ventas vende a clientes morosos',
    signals: ['venden a morosos', 'no se enteran'],
    impact: 'Cartera incobrable crece',
    question_hint: '¿Ventas sabe quién tiene facturas vencidas?',
    focus: 5
  },
  'E11': {
    cluster: 'E-REPORTES',
    title: 'Reportes de cobranza manuales',
    signals: ['hago el reporte a mano', 'Excel'],
    impact: 'Tiempo desperdiciado',
    question_hint: '¿Cómo generas reportes de cobranza?',
    focus: 5
  },
  'E12': {
    cluster: 'E-METRICAS',
    title: 'No sé mi DSO (días de cobro)',
    signals: ['DSO', 'días de cobro', 'no tengo la métrica'],
    impact: 'Sin benchmark de eficiencia',
    question_hint: '¿Conoces tus días promedio de cobro?',
    focus: 5
  },
  'E13': {
    cluster: 'E-PROCESO',
    title: 'No tengo líneas de crédito definidas por cliente',
    signals: ['sin límite de crédito', 'le damos lo que pida'],
    impact: 'Exposición de riesgo alta',
    question_hint: '¿Tienes límites de crédito por cliente?',
    focus: 5
  },
  'E14': {
    cluster: 'E-ALERTAS',
    title: 'No hay alerta cuando un cliente supera su crédito',
    signals: ['se pasa del límite', 'nadie avisa'],
    impact: 'Riesgo no controlado',
    question_hint: '¿Te alertan si superan el límite de crédito?',
    focus: 5
  },
  'E15': {
    cluster: 'E-COMUNICACION',
    title: 'Finanzas y ventas no se comunican sobre pagos',
    signals: ['no se hablan', 'cada quien por su lado'],
    impact: 'Descoordinación costosa',
    question_hint: '¿Finanzas y ventas se comunican bien?',
    focus: 5
  },

  // ==================== F. REPORTES E INFORMACIÓN (20 dolores) ====================

  'F01': {
    cluster: 'F-TIEMPO',
    title: 'Tardo días en armar un reporte',
    signals: ['me toma días', 'semanas para un reporte'],
    impact: 'Información llega tarde',
    question_hint: '¿Cuánto tardas en armar un reporte?',
    focus: 9
  },
  'F02': {
    cluster: 'F-ESTANDARIZACION',
    title: 'Reportes en Excel, cada vez diferentes',
    signals: ['en Excel', 'cada vez distinto', 'no hay formato'],
    impact: 'Incomparables, inconsistentes',
    question_hint: '¿Tus reportes tienen formato estándar?',
    focus: 9
  },
  'F03': {
    cluster: 'F-KPIS',
    title: 'No tengo KPIs definidos',
    signals: ['no tengo KPIs', 'no sé qué medir'],
    impact: 'Sin objetivos claros',
    question_hint: '¿Tienes KPIs definidos?',
    focus: 9
  },
  'F04': {
    cluster: 'F-COMPARATIVOS',
    title: 'No puedo comparar desempeño mes a mes',
    signals: ['comparar es difícil', 'no tengo histórico'],
    impact: 'Sin visión de tendencias',
    question_hint: '¿Puedes comparar mes vs mes fácilmente?',
    focus: 9
  },
  'F05': {
    cluster: 'F-DISPONIBILIDAD',
    title: 'Dirección pide información y no está lista',
    signals: ['siempre corremos', 'no está lista', 'improvisar'],
    impact: 'Estrés, datos incorrectos',
    question_hint: '¿La información está lista cuando la piden?',
    focus: 9
  },
  'F06': {
    cluster: 'F-DASHBOARDS',
    title: 'Sin dashboards en tiempo real',
    signals: ['no hay dashboard', 'no veo en tiempo real'],
    impact: 'Decisiones con datos viejos',
    question_hint: '¿Tienes dashboards en tiempo real?',
    focus: 9
  },
  'F07': {
    cluster: 'F-SEGMENTACION',
    title: 'Reportes sin filtros por territorio/producto',
    signals: ['todo junto', 'no puedo filtrar', 'sin desglose'],
    impact: 'Análisis limitado',
    question_hint: '¿Puedes filtrar reportes por territorio?',
    focus: 9
  },
  'F08': {
    cluster: 'F-TENDENCIAS',
    title: 'Solo veo el presente, no tendencias',
    signals: ['solo el hoy', 'sin tendencias', 'no veo hacia dónde va'],
    impact: 'Sin capacidad predictiva',
    question_hint: '¿Ves tendencias en tus datos?',
    focus: 9
  },
  'F09': {
    cluster: 'F-PREDICCION',
    title: 'Reportes sin información predictiva',
    signals: ['no predice', 'solo histórico', 'quisiera saber qué va a pasar'],
    impact: 'Siempre reactivos',
    question_hint: '¿Tus reportes incluyen predicciones?',
    focus: 9
  },
  'F10': {
    cluster: 'F-EFECTIVIDAD',
    title: 'No mido efectividad de las visitas',
    signals: ['no sé si las visitas sirven', 'ROI de visitas'],
    impact: 'Sin optimización de esfuerzo',
    question_hint: '¿Mides si las visitas generan resultados?',
    focus: 9
  },
  'F11': {
    cluster: 'F-INTEGRACION',
    title: 'No cruzo datos de visitas con ventas',
    signals: ['no cruzo información', 'silos de datos'],
    impact: 'Sin correlación de actividad y resultado',
    question_hint: '¿Cruzas datos de visitas con ventas?',
    focus: 9
  },
  'F12': {
    cluster: 'F-ALERTAS',
    title: 'Me entero de problemas cuando ya es tarde',
    signals: ['me entero tarde', 'reactivo', 'ya pasó'],
    impact: 'Sin capacidad de prevención',
    question_hint: '¿Te enteras de problemas a tiempo?',
    focus: 9
  },
  'F13': {
    cluster: 'F-AUTOMATIZACION',
    title: 'Reportes no se envían automáticamente',
    signals: ['los hago a mano', 'nadie los manda'],
    impact: 'Tiempo desperdiciado',
    question_hint: '¿Los reportes se envían automáticamente?',
    focus: 9
  },
  'F14': {
    cluster: 'F-FUENTE_UNICA',
    title: 'Cada gerente tiene números diferentes',
    signals: ['cada quien sus números', 'no cuadran', 'sin fuente única'],
    impact: 'Discusiones sobre datos',
    question_hint: '¿Todos usan los mismos números?',
    focus: 9
  },
  'F15': {
    cluster: 'F-TIEMPO',
    title: 'Paso horas consolidando información',
    signals: ['consolidar toma horas', 'juntando de varios lados'],
    impact: 'Tiempo no productivo',
    question_hint: '¿Cuánto tiempo gastas consolidando datos?',
    focus: 9
  },
  'F16': {
    cluster: 'F-DISPONIBILIDAD',
    title: 'Solo una persona sabe sacar los reportes',
    signals: ['dependemos de uno', 'si no está, no hay reporte'],
    impact: 'Dependencia crítica',
    question_hint: '¿Quién saca los reportes?',
    focus: 9
  },
  'F17': {
    cluster: 'F-KPIS',
    title: 'No hay metas claras por indicador',
    signals: ['sin metas', 'no sé si estamos bien o mal'],
    impact: 'Sin referencia de éxito',
    question_hint: '¿Tienes metas por cada KPI?',
    focus: 9
  },
  'F18': {
    cluster: 'F-COMPARATIVOS',
    title: 'No puedo comparar territorios entre sí',
    signals: ['no comparo territorios', 'cada quien reporta diferente'],
    impact: 'Sin benchmark interno',
    question_hint: '¿Comparas el desempeño entre territorios?',
    focus: 9
  },
  'F19': {
    cluster: 'F-DASHBOARDS',
    title: 'Los dashboards son poco intuitivos',
    signals: ['no se entiende', 'muy complicado', 'nadie lo usa'],
    impact: 'Dashboard inútil',
    question_hint: '¿Tu equipo entiende los dashboards?',
    focus: 9
  },
  'F20': {
    cluster: 'F-INTEGRACION',
    title: 'Datos en diferentes sistemas no se conectan',
    signals: ['sistemas aislados', 'no se hablan'],
    impact: 'Vista fragmentada',
    question_hint: '¿Tus sistemas comparten datos?',
    focus: 9
  },

  // ==================== G. TECNOLOGÍA Y SISTEMAS (20 dolores) ====================

  'G01': {
    cluster: 'G-EXCEL',
    title: 'Todo está en Excel',
    signals: ['en Excel', 'cada quien su archivo', 'versiones'],
    impact: 'Datos fragmentados, errores',
    question_hint: '¿Excel es tu sistema principal?',
    focus: 9
  },
  'G02': {
    cluster: 'G-INTEGRACION',
    title: 'ERP aislado, no conectado',
    signals: ['ERP aislado', 'no se conecta', 'isla'],
    impact: 'Datos no sincronizados',
    question_hint: '¿Tu ERP está integrado con otros sistemas?',
    focus: 9
  },
  'G03': {
    cluster: 'G-ADOPCION',
    title: 'CRM que nadie usa',
    signals: ['nadie lo usa', 'muy complicado', 'abandonado'],
    impact: 'Inversión desperdiciada',
    question_hint: '¿Tu equipo realmente usa el CRM?',
    focus: 9
  },
  'G04': {
    cluster: 'G-FRAGMENTACION',
    title: 'Información en 5+ sistemas diferentes',
    signals: ['en varios sistemas', 'disperso', 'no centralizado'],
    impact: 'Imposible tener vista completa',
    question_hint: '¿Cuántos sistemas usas?',
    focus: 9
  },
  'G05': {
    cluster: 'G-MOVIL',
    title: 'Sin app móvil para campo',
    signals: ['sin app', 'todo en web', 'no funciona en móvil'],
    impact: 'Registro fuera de campo',
    question_hint: '¿Tu equipo tiene app móvil?',
    focus: 9
  },
  'G06': {
    cluster: 'G-OFFLINE',
    title: 'Sistema no funciona sin internet',
    signals: ['sin internet no sirve', 'necesita conexión', 'offline no'],
    impact: 'Imposible registrar en campo',
    question_hint: '¿El sistema funciona offline?',
    focus: 9
  },
  'G07': {
    cluster: 'G-OBSOLESCENCIA',
    title: 'Sistema obsoleto',
    signals: ['obsoleto', 'sin soporte', 'viejo'],
    impact: 'Sin mejoras, riesgos de seguridad',
    question_hint: '¿Tu sistema está actualizado?',
    focus: 9
  },
  'G08': {
    cluster: 'G-ADOPCION',
    title: 'Pagamos sistema que usamos al 10%',
    signals: ['pagamos de más', 'no lo usamos', 'desperdicio'],
    impact: 'Desperdicio de recursos',
    question_hint: '¿Usas todas las funciones de tu sistema?',
    focus: 9
  },
  'G09': {
    cluster: 'G-DEPENDENCIA',
    title: 'Dependemos de una persona para sacar info',
    signals: ['solo él sabe', 'dependemos de uno', 'si se va...'],
    impact: 'Riesgo operativo crítico',
    question_hint: '¿Quién saca la información?',
    focus: 9
  },
  'G10': {
    cluster: 'G-INTEGRACION',
    title: 'Sin API para conectar sistemas',
    signals: ['sin API', 'no se puede conectar', 'cerrado'],
    impact: 'Imposible automatizar',
    question_hint: '¿Tu sistema tiene API?',
    focus: 9
  },
  'G11': {
    cluster: 'G-MIGRACION',
    title: 'Miedo a migrar datos',
    signals: ['miedo a migrar', 'perder datos', 'riesgo'],
    impact: 'Atrapados en sistema viejo',
    question_hint: '¿Has considerado cambiar de sistema?',
    focus: 9
  },
  'G12': {
    cluster: 'G-SEGURIDAD',
    title: 'Sin backup de información',
    signals: ['sin respaldo', 'no hay backup', 'si se pierde...'],
    impact: 'Riesgo de pérdida total',
    question_hint: '¿Tienes respaldos de tu información?',
    focus: 9
  },
  'G13': {
    cluster: 'G-FRAGMENTACION',
    title: 'Cada departamento usa herramientas diferentes',
    signals: ['cada quien lo suyo', 'herramientas diferentes'],
    impact: 'Silos organizacionales',
    question_hint: '¿Todos usan las mismas herramientas?',
    focus: 9
  },
  'G14': {
    cluster: 'G-ADOPCION',
    title: 'El equipo no quiere usar el sistema',
    signals: ['resistencia', 'no quieren', 'prefieren Excel'],
    impact: 'Sistema sin datos',
    question_hint: '¿Tu equipo adopta bien las nuevas herramientas?',
    focus: 9
  },
  'G15': {
    cluster: 'G-MOVIL',
    title: 'La app es lenta o difícil de usar',
    signals: ['app lenta', 'difícil de usar', 'tarda en cargar'],
    impact: 'Frustración, baja adopción',
    question_hint: '¿La app es fácil de usar?',
    focus: 9
  },
  'G16': {
    cluster: 'G-SEGURIDAD',
    title: 'Cualquiera puede ver cualquier información',
    signals: ['todos ven todo', 'sin permisos', 'sin control'],
    impact: 'Riesgo de datos sensibles',
    question_hint: '¿Tienes control de accesos por rol?',
    focus: 9
  },
  'G17': {
    cluster: 'G-OBSOLESCENCIA',
    title: 'El proveedor ya no da soporte',
    signals: ['sin soporte', 'no responden', 'abandonado'],
    impact: 'Sin ayuda cuando hay problemas',
    question_hint: '¿Tu proveedor de sistema responde bien?',
    focus: 9
  },
  'G18': {
    cluster: 'G-INTEGRACION',
    title: 'Capturo la misma información en 2+ sistemas',
    signals: ['doble captura', 'lo mismo en varios lados'],
    impact: 'Tiempo desperdiciado, errores',
    question_hint: '¿Capturas la misma info varias veces?',
    focus: 9
  },
  'G19': {
    cluster: 'G-EXCEL',
    title: 'Tengo archivos Excel críticos en una sola computadora',
    signals: ['en mi laptop', 'no está en la nube', 'si se descompone'],
    impact: 'Riesgo de pérdida',
    question_hint: '¿Dónde están tus archivos críticos?',
    focus: 9
  },
  'G20': {
    cluster: 'G-DEPENDENCIA',
    title: 'No tenemos documentación de nuestros procesos',
    signals: ['no está documentado', 'en la cabeza', 'yo sé cómo'],
    impact: 'Conocimiento no transferible',
    question_hint: '¿Tienes documentados tus procesos?',
    focus: 9
  },

  // ==================== H. COMUNICACIÓN INTERNA (15 dolores) ====================

  'H01': {
    cluster: 'H-CANALES',
    title: 'Instrucciones se pierden en WhatsApp',
    signals: ['en WhatsApp', 'se pierden mensajes', 'no hay registro'],
    impact: 'Sin auditoría, cosas perdidas',
    question_hint: '¿Por dónde comunicas instrucciones?',
    focus: 6
  },
  'H02': {
    cluster: 'H-CANALES',
    title: 'Sin canal oficial para comunicar cambios',
    signals: ['no sé por dónde comunicar', 'se enteran por otros'],
    impact: 'Información inconsistente',
    question_hint: '¿Tienes canal oficial de comunicación?',
    focus: 6
  },
  'H03': {
    cluster: 'H-FEEDBACK',
    title: 'Supervisores no dan retroalimentación',
    signals: ['feedback informal', 'no hay proceso', 'cuando se acuerdan'],
    impact: 'Sin desarrollo del equipo',
    question_hint: '¿Cómo dan retroalimentación a tu equipo?',
    focus: 6
  },
  'H04': {
    cluster: 'H-APROBACIONES',
    title: 'Solicitudes de aprobación por WhatsApp',
    signals: ['por WhatsApp', 'por mensaje', 'no hay flujo'],
    impact: 'Sin trazabilidad',
    question_hint: '¿Cómo se procesan las aprobaciones?',
    focus: 6
  },
  'H05': {
    cluster: 'H-DESARROLLO',
    title: 'Sin proceso formal de coaching',
    signals: ['sin coaching', 'no hay desarrollo', 'cada quien aprende solo'],
    impact: 'Equipo sin crecimiento',
    question_hint: '¿Tienes programa de coaching?',
    focus: 6
  },
  'H06': {
    cluster: 'H-VISIBILIDAD',
    title: 'Solo en reuniones sé qué pasa',
    signals: ['solo en las juntas', 'si no hay junta, no sé'],
    impact: 'Retrasos en información',
    question_hint: '¿Cómo te enteras de lo que pasa?',
    focus: 6
  },
  'H07': {
    cluster: 'H-OBJETIVOS',
    title: 'Objetivos comunicados verbalmente',
    signals: ['verbal', 'se olvidan', 'no quedan escritos'],
    impact: 'Objetivos ambiguos',
    question_hint: '¿Los objetivos están por escrito?',
    focus: 6
  },
  'H08': {
    cluster: 'H-VISIBILIDAD',
    title: 'No sé qué hacen otros equipos',
    signals: ['no sé qué hacen los otros', 'silos'],
    impact: 'Falta de coordinación',
    question_hint: '¿Tienes visibilidad de otros equipos?',
    focus: 6
  },
  'H09': {
    cluster: 'H-SILOS',
    title: 'Información en silos por departamento',
    signals: ['silos', 'no se comparte', 'cada área lo suyo'],
    impact: 'Decisiones sin contexto completo',
    question_hint: '¿Los departamentos comparten información?',
    focus: 6
  },
  'H10': {
    cluster: 'H-CANALES',
    title: 'Demasiados canales de comunicación',
    signals: ['email, WhatsApp, Teams, todo', 'no sé dónde buscar'],
    impact: 'Información perdida',
    question_hint: '¿Cuántos canales de comunicación usas?',
    focus: 6
  },
  'H11': {
    cluster: 'H-FEEDBACK',
    title: 'El equipo no comparte problemas hasta que explotan',
    signals: ['no dicen nada', 'cuando ya es crisis'],
    impact: 'Problemas no prevenidos',
    question_hint: '¿Tu equipo te dice cuando hay problemas?',
    focus: 6
  },
  'H12': {
    cluster: 'H-OBJETIVOS',
    title: 'No hay cascadeo de objetivos',
    signals: ['cada quien sus metas', 'no están alineados'],
    impact: 'Esfuerzo desalineado',
    question_hint: '¿Los objetivos bajan de dirección a campo?',
    focus: 6
  },
  'H13': {
    cluster: 'H-APROBACIONES',
    title: 'No sé el estatus de mis solicitudes',
    signals: ['no sé si aprobaron', 'esperando respuesta'],
    impact: 'Procesos detenidos',
    question_hint: '¿Puedes ver el estatus de tus solicitudes?',
    focus: 6
  },
  'H14': {
    cluster: 'H-SILOS',
    title: 'Marketing y ventas no se comunican',
    signals: ['desconectados', 'cada quien por su lado'],
    impact: 'Esfuerzos descoordinados',
    question_hint: '¿Marketing y ventas trabajan juntos?',
    focus: 6
  },
  'H15': {
    cluster: 'H-DESARROLLO',
    title: 'No hay reconocimiento del buen trabajo',
    signals: ['nadie reconoce', 'solo cuando fallas'],
    impact: 'Desmotivación',
    question_hint: '¿Reconoces los logros de tu equipo?',
    focus: 6
  },

  // ==================== P. AUTOMATIZACIÓN Y PRODUCTIVIDAD (15 dolores) ====================

  'P01': {
    cluster: 'P-TIEMPO',
    title: 'Demasiado tiempo llenando formularios',
    signals: ['mucho tiempo registrando', 'formularios eternos', 'quita tiempo'],
    impact: 'Menos tiempo para vender',
    question_hint: '¿Cuánto tiempo gastas en registro?',
    focus: 9
  },
  'P02': {
    cluster: 'P-PREPARACION',
    title: 'Sin tiempo para preparar visitas',
    signals: ['voy sin preparar', 'improviso', 'no me da tiempo'],
    impact: 'Visitas menos efectivas',
    question_hint: '¿Preparas cada visita?',
    focus: 9
  },
  'P03': {
    cluster: 'P-REPORTES',
    title: 'Informes semanales manuales',
    signals: ['horas en reportes', 'cada semana lo mismo'],
    impact: 'Tiempo no productivo',
    question_hint: '¿Cuánto tiempo gastas en reportes?',
    focus: 9
  },
  'P04': {
    cluster: 'P-CONTEXTO',
    title: 'Voy a visitas sin contexto',
    signals: ['no sé qué pasó antes', 'sin briefing'],
    impact: 'Repetir información, mala impresión',
    question_hint: '¿Tienes contexto antes de cada visita?',
    focus: 9
  },
  'P05': {
    cluster: 'P-VOZ',
    title: 'Quisiera dictar en lugar de escribir',
    signals: ['escribir es lento', 'mejor hablar', 'voz'],
    impact: 'Registro más lento',
    question_hint: '¿Usas comandos de voz?',
    focus: 9
  },
  'P06': {
    cluster: 'P-ALERTAS',
    title: 'Sin alertas proactivas',
    signals: ['me entero tarde', 'sin alertas'],
    impact: 'Siempre reactivo',
    question_hint: '¿El sistema te alerta proactivamente?',
    focus: 9
  },
  'P07': {
    cluster: 'P-AUTOMATICO',
    title: 'Quisiera que el sistema hiciera cosas solo',
    signals: ['automático', 'que se haga solo'],
    impact: 'Trabajo manual innecesario',
    question_hint: '¿Tu sistema automatiza tareas?',
    focus: 9
  },
  'P08': {
    cluster: 'P-SUGERENCIAS',
    title: 'Sin sugerencias de qué hacer',
    signals: ['sin sugerencias', 'yo tengo que decidir todo'],
    impact: 'Sin guía, decisiones subóptimas',
    question_hint: '¿El sistema te sugiere acciones?',
    focus: 9
  },
  'P09': {
    cluster: 'P-TIEMPO',
    title: 'Tareas repetitivas me consumen el día',
    signals: ['siempre lo mismo', 'repetitivo', 'rutina'],
    impact: 'Tiempo en tareas de bajo valor',
    question_hint: '¿Cuánto tiempo gastas en tareas repetitivas?',
    focus: 9
  },
  'P10': {
    cluster: 'P-PREPARACION',
    title: 'No tengo briefing antes de reuniones',
    signals: ['sin preparación', 'llego sin contexto'],
    impact: 'Reuniones menos efectivas',
    question_hint: '¿Te preparas antes de reuniones?',
    focus: 9
  },
  'P11': {
    cluster: 'P-AUTOMATICO',
    title: 'Envío emails manualmente uno por uno',
    signals: ['uno por uno', 'manual', 'sin automatización'],
    impact: 'Tiempo desperdiciado',
    question_hint: '¿Automatizas el envío de emails?',
    focus: 9
  },
  'P12': {
    cluster: 'P-ALERTAS',
    title: 'No me alertan de fechas importantes',
    signals: ['se me olvidan fechas', 'sin recordatorios'],
    impact: 'Oportunidades perdidas',
    question_hint: '¿Tienes recordatorios de fechas clave?',
    focus: 9
  },
  'P13': {
    cluster: 'P-SUGERENCIAS',
    title: 'No sé qué clientes visitar hoy',
    signals: ['no sé por dónde empezar', 'sin prioridad'],
    impact: 'Tiempo en clientes incorrectos',
    question_hint: '¿Sabes a quién visitar primero?',
    focus: 9
  },
  'P14': {
    cluster: 'P-CONTEXTO',
    title: 'No tengo resumen de la última interacción',
    signals: ['no sé qué pasó', 'sin resumen'],
    impact: 'Repetir conversaciones',
    question_hint: '¿Tienes resumen de últimas interacciones?',
    focus: 9
  },
  'P15': {
    cluster: 'P-AUTOMATICO',
    title: 'No tengo flujos de trabajo automatizados',
    signals: ['todo manual', 'sin workflows'],
    impact: 'Procesos lentos e inconsistentes',
    question_hint: '¿Tienes workflows automatizados?',
    focus: 9
  },
};


// ============================================================
// PARTE II: DOLORES ESPECÍFICOS - DISTRIBUIDORAS FARMACÉUTICAS
// ============================================================

const PHARMA_SPECIFIC_PAINS = {

  // ==================== C. MUESTRAS MÉDICAS E INVENTARIO (35 dolores) ====================
  // Específico para industria farmacéutica con muestras médicas

  'C01': {
    cluster: 'C-INVENTARIO',
    title: 'No sé cuántas muestras tiene cada rep en su maletín',
    signals: ['no sé qué tienen', 'cada quien sabe lo suyo'],
    impact: 'Inventario descontrolado',
    question_hint: '¿Conoces el inventario de cada rep?',
    focus: 3
  },
  'C02': {
    cluster: 'C-TRAZABILIDAD',
    title: 'Muestras se entregan sin registro de destinatario',
    signals: ['no hay registro', 'se dan y ya', 'no documentamos'],
    impact: 'Sin trazabilidad, riesgo regulatorio',
    question_hint: '¿Registras a quién se entrega cada muestra?',
    focus: 3
  },
  'C03': {
    cluster: 'C-TRAZABILIDAD',
    title: 'No puedo rastrear un lote específico',
    signals: ['no hay trazabilidad', 'no sé dónde terminó', 'auditoría'],
    impact: 'Recalls imposibles de ejecutar',
    question_hint: '¿Puedes rastrear dónde está un lote?',
    focus: 3
  },
  'C04': {
    cluster: 'C-CONTROL',
    title: 'Los reps acumulan muestras "por si acaso"',
    signals: ['acumulan', 'piden de más', 'por si acaso'],
    impact: 'Inventario inflado, caducidades',
    question_hint: '¿Los reps piden más muestras de las necesarias?',
    focus: 3
  },
  'C05': {
    cluster: 'C-ANALISIS',
    title: 'No sé qué productos son los más solicitados',
    signals: ['no sé qué piden más', 'demanda'],
    impact: 'Inventario desbalanceado',
    question_hint: '¿Sabes qué muestras tienen más demanda?',
    focus: 3
  },
  'C06': {
    cluster: 'C-CADUCIDAD',
    title: 'Muestras caducan en el maletín del rep',
    signals: ['caducadas', 'se echan a perder', 'desperdicio'],
    impact: 'Pérdida económica, riesgo de entrega vencida',
    question_hint: '¿Te pasa que las muestras caducan?',
    focus: 3
  },
  'C07': {
    cluster: 'C-CONTROL',
    title: 'Sin límites automáticos de entrega por médico',
    signals: ['dan lo que quieren', 'sin límite', 'abuso'],
    impact: 'Muestras usadas sin estrategia',
    question_hint: '¿Hay límites de muestras por médico?',
    focus: 3
  },
  'C08': {
    cluster: 'C-PROCESO',
    title: 'Solicitud de muestras por email/teléfono',
    signals: ['por email', 'llaman para pedir', 'manual'],
    impact: 'Proceso lento e ineficiente',
    question_hint: '¿Cómo solicitan los reps las muestras?',
    focus: 3
  },
  'C09': {
    cluster: 'C-COSTOS',
    title: 'No sé el costo de muestras por médico',
    signals: ['no sé cuánto me cuesta', 'costo por médico'],
    impact: 'ROI de muestras desconocido',
    question_hint: '¿Sabes el costo de muestras por médico?',
    focus: 3
  },
  'C10': {
    cluster: 'C-PROCESO',
    title: 'Sin proceso de devolución de muestras',
    signals: ['no regresan', 'se quedan con ellas'],
    impact: 'Muestras perdidas al salir el rep',
    question_hint: '¿Qué pasa con muestras cuando un rep se va?',
    focus: 3
  },
  'C11': {
    cluster: 'C-COMPLIANCE',
    title: 'No puedo generar reporte de trazabilidad para COFEPRIS',
    signals: ['auditoría', 'COFEPRIS', 'no tengo el reporte'],
    impact: 'Riesgo de sanción regulatoria',
    question_hint: '¿Puedes generar reportes para reguladores?',
    focus: 10
  },
  'C12': {
    cluster: 'C-ESTRATEGIA',
    title: 'Muestras se usan como regalo, no como promoción',
    signals: ['las regalan', 'no promueven', 'sin estrategia'],
    impact: 'Sin retorno de inversión',
    question_hint: '¿Las muestras se usan estratégicamente?',
    focus: 3
  },
  'C13': {
    cluster: 'C-INVENTARIO',
    title: 'Sin alertas de stock bajo en almacén',
    signals: ['me entero cuando ya no hay', 'sin alertas'],
    impact: 'Desabasto de productos clave',
    question_hint: '¿Te alertan cuando hay poco stock?',
    focus: 3
  },
  'C14': {
    cluster: 'C-INVENTARIO',
    title: 'Inventario de muestras se reconcilia manualmente',
    signals: ['una vez al mes', 'manual', 'nunca cuadra'],
    impact: 'Diferencias no detectadas',
    question_hint: '¿Cómo reconcilias el inventario?',
    focus: 3
  },
  'C15': {
    cluster: 'C-TRAZABILIDAD',
    title: 'No registro el número de lote en cada entrega',
    signals: ['sin lote', 'no lo anoto', 'solo producto'],
    impact: 'Trazabilidad incompleta',
    question_hint: '¿Registras el lote de cada muestra?',
    focus: 3
  },
  'C16': {
    cluster: 'C-CONTROL',
    title: 'No sé si el rep entrega muestras a quien no debe',
    signals: ['a cualquiera', 'sin verificar que sea médico'],
    impact: 'Muestras fuera del target',
    question_hint: '¿Verificas que el receptor es médico?',
    focus: 3
  },
  'C17': {
    cluster: 'C-CADUCIDAD',
    title: 'No tengo visibilidad de próximos vencimientos',
    signals: ['no sé cuáles van a vencer', 'me sorprenden'],
    impact: 'Producto vencido desperdiciado',
    question_hint: '¿Ves qué muestras van a vencer pronto?',
    focus: 3
  },
  'C18': {
    cluster: 'C-COMPLIANCE',
    title: 'No puedo demostrar la cadena de custodia',
    signals: ['no tengo prueba', 'quién firmó', 'cadena de custodia'],
    impact: 'Problemas en auditoría',
    question_hint: '¿Tienes evidencia de cada entrega?',
    focus: 10
  },
  'C19': {
    cluster: 'C-PROCESO',
    title: 'Transferencias entre reps sin registro',
    signals: ['se pasan muestras', 'no queda registro'],
    impact: 'Inventario incorrecto',
    question_hint: '¿Registras transferencias entre reps?',
    focus: 3
  },
  'C20': {
    cluster: 'C-ANALISIS',
    title: 'No correlaciono muestras entregadas con prescripciones',
    signals: ['no sé si funcionan', 'muestras vs recetas'],
    impact: 'Sin medición de efectividad',
    question_hint: '¿Mides si las muestras generan prescripciones?',
    focus: 3
  },
  'C21': {
    cluster: 'C-CONTROL',
    title: 'Muestras se usan para uso personal',
    signals: ['uso personal', 'para familia', 'no las entregan'],
    impact: 'Pérdida y mal uso',
    question_hint: '¿Hay control de uso correcto de muestras?',
    focus: 3
  },
  'C22': {
    cluster: 'C-ESTRATEGIA',
    title: 'No tengo estrategia de muestreo por ciclo promocional',
    signals: ['igual todo el año', 'sin ciclos', 'sin estrategia'],
    impact: 'Esfuerzo no alineado a campañas',
    question_hint: '¿El muestreo sigue ciclos promocionales?',
    focus: 3
  },
  'C23': {
    cluster: 'C-INVENTARIO',
    title: 'No distingo entre muestras y material promocional',
    signals: ['todo junto', 'material revuelto'],
    impact: 'Confusión en inventario',
    question_hint: '¿Separas muestras de material promocional?',
    focus: 3
  },
  'C24': {
    cluster: 'C-COMPLIANCE',
    title: 'No cumplo con requerimientos de serialización',
    signals: ['serialización', 'DSCSA', 'sin número de serie'],
    impact: 'Riesgo regulatorio DSCSA',
    question_hint: '¿Cumples con serialización de productos?',
    focus: 10
  },
  'C25': {
    cluster: 'C-PROCESO',
    title: 'No tengo firma digital del médico al recibir',
    signals: ['sin firma', 'no firman', 'solo verbal'],
    impact: 'Sin evidencia legal',
    question_hint: '¿Obtienes firma del médico?',
    focus: 3
  },
  'C26': {
    cluster: 'C-CADENA_FRIO',
    title: 'Sin monitoreo de cadena de frío',
    signals: ['frío', 'temperatura', 'se rompió la cadena'],
    impact: 'Producto dañado sin saberlo',
    question_hint: '¿Monitoreas la temperatura de muestras?',
    focus: 3
  },
  'C27': {
    cluster: 'C-CADENA_FRIO',
    title: 'No sé si el producto se expuso a temperatura incorrecta',
    signals: ['se calentó', 'se congeló', 'no sé'],
    impact: 'Entrega de producto afectado',
    question_hint: '¿Sabes si hubo ruptura de cadena de frío?',
    focus: 3
  },
  'C28': {
    cluster: 'C-COSTOS',
    title: 'No calculo el costo por visita incluyendo muestras',
    signals: ['solo viáticos', 'no incluyo muestras'],
    impact: 'Costo real subestimado',
    question_hint: '¿Incluyes costo de muestras por visita?',
    focus: 3
  },
  'C29': {
    cluster: 'C-TRAZABILIDAD',
    title: 'No puedo hacer recall efectivo',
    signals: ['recall', 'no sé a quién llegó', 'retiro de mercado'],
    impact: 'Riesgo de salud pública',
    question_hint: '¿Podrías hacer un recall mañana?',
    focus: 10
  },
  'C30': {
    cluster: 'C-INVENTARIO',
    title: 'Stock de muestras no se sincroniza con inventario general',
    signals: ['sistemas separados', 'no cuadra'],
    impact: 'Vista fragmentada del inventario',
    question_hint: '¿El inventario de muestras está integrado?',
    focus: 3
  },
  'C31': {
    cluster: 'C-ESTRATEGIA',
    title: 'No tengo target de muestras por médico según potencial',
    signals: ['igual para todos', 'sin target'],
    impact: 'Recursos mal distribuidos',
    question_hint: '¿Asignas muestras según potencial del médico?',
    focus: 3
  },
  'C32': {
    cluster: 'C-PROCESO',
    title: 'Solicitudes de muestras tardan días en aprobarse',
    signals: ['tarda mucho', 'burocracia'],
    impact: 'Reps sin producto cuando lo necesitan',
    question_hint: '¿Cuánto tarda aprobar solicitud de muestras?',
    focus: 3
  },
  'C33': {
    cluster: 'C-COMPLIANCE',
    title: 'No tengo log de quién accedió al inventario de muestras',
    signals: ['sin log', 'sin auditoría'],
    impact: 'Sin control de acceso',
    question_hint: '¿Tienes log de acceso al inventario?',
    focus: 10
  },
  'C34': {
    cluster: 'C-ANALISIS',
    title: 'No mido el ROI de muestras por producto',
    signals: ['no sé si vale la pena', 'ROI de muestras'],
    impact: 'Inversión sin medición',
    question_hint: '¿Mides el retorno de cada tipo de muestra?',
    focus: 3
  },
  'C35': {
    cluster: 'C-CADUCIDAD',
    title: 'No tengo política FEFO (First Expire First Out)',
    signals: ['sacan cualquiera', 'no por fecha'],
    impact: 'Producto bueno vence mientras se usa viejo',
    question_hint: '¿Tienes política de rotación FEFO?',
    focus: 3
  },

  // ==================== I. RELACIÓN CON HCPs (20 dolores) ====================
  // Healthcare Professionals - específico para pharma

  'I01': {
    cluster: 'I-ACCESO',
    title: 'Los médicos no saben cómo contactarnos',
    signals: ['no saben cómo contactarnos', 'solo cuando viene el rep'],
    impact: 'Oportunidades perdidas',
    question_hint: '¿Los médicos pueden contactarte fácilmente?',
    focus: 7
  },
  'I02': {
    cluster: 'I-AUTOSERVICIO',
    title: 'Sin portal para que el médico solicite muestras',
    signals: ['tienen que llamar', 'dependen del rep', 'sin autoservicio'],
    impact: 'Proceso ineficiente',
    question_hint: '¿Los médicos pueden solicitar muestras online?',
    focus: 7
  },
  'I03': {
    cluster: 'I-COMPROMISOS',
    title: 'Compromisos con médicos no se documentan',
    signals: ['promesas no documentadas', 'se olvidan'],
    impact: 'Pérdida de confianza',
    question_hint: '¿Documentas los compromisos con médicos?',
    focus: 7
  },
  'I04': {
    cluster: 'I-SEGUIMIENTO',
    title: 'Sin seguimiento a solicitudes de médicos',
    signals: ['pedían algo y no se dio', 'sin seguimiento'],
    impact: 'Médicos frustrados',
    question_hint: '¿Das seguimiento a lo que piden los médicos?',
    focus: 7
  },
  'I05': {
    cluster: 'I-VALOR',
    title: 'Visitas sin aporte de valor para el médico',
    signals: ['solo visitas vacías', 'sin contenido', 'no aportan'],
    impact: 'Médicos no quieren recibirnos',
    question_hint: '¿Qué valor aportas en cada visita?',
    focus: 7
  },
  'I06': {
    cluster: 'I-PRESCRIPCION',
    title: 'No sé qué médicos prescriben nuestros productos',
    signals: ['no sé quién prescribe', 'no tengo datos de prescripción'],
    impact: 'Esfuerzo en médicos que no recetan',
    question_hint: '¿Sabes quién prescribe tus productos?',
    focus: 7
  },
  'I07': {
    cluster: 'I-SATISFACCION',
    title: 'No medimos satisfacción de médicos',
    signals: ['no preguntamos', 'no medimos satisfacción'],
    impact: 'Sin feedback para mejorar',
    question_hint: '¿Mides la satisfacción de los médicos?',
    focus: 7
  },
  'I08': {
    cluster: 'I-COMUNICACION',
    title: 'Médicos se enteran de productos por competencia',
    signals: ['la competencia les cuenta', 'llegamos tarde'],
    impact: 'Perdemos el first mover advantage',
    question_hint: '¿Llegas primero con productos nuevos?',
    focus: 7
  },
  'I09': {
    cluster: 'I-FIDELIZACION',
    title: 'Sin programa de fidelización para médicos',
    signals: ['sin programa', 'no fidelizamos'],
    impact: 'Relaciones transaccionales',
    question_hint: '¿Tienes programa de fidelización?',
    focus: 7
  },
  'I10': {
    cluster: 'I-PERSONALIZACION',
    title: 'Comunicación no personalizada por especialidad',
    signals: ['todo igual para todos', 'sin personalización'],
    impact: 'Contenido irrelevante',
    question_hint: '¿Personalizas por especialidad?',
    focus: 7
  },
  'I11': {
    cluster: 'I-CONTINUIDAD',
    title: 'Médico repite info cuando cambia el rep',
    signals: ['empezar de cero', 'no saben nada de mí'],
    impact: 'Mala experiencia, pérdida de historial',
    question_hint: '¿El historial pasa al nuevo rep?',
    focus: 7
  },
  'I12': {
    cluster: 'I-PROACTIVIDAD',
    title: 'Sin recordatorios de reabastecimiento',
    signals: ['se les acaba y no avisamos', 'reactivos'],
    impact: 'Oportunidad de venta perdida',
    question_hint: '¿Alertas cuando el médico necesita más?',
    focus: 7
  },
  'I13': {
    cluster: 'I-SEGMENTACION_HCP',
    title: 'No tengo segmentación de médicos por valor',
    signals: ['todos iguales', 'sin segmentación'],
    impact: 'Recursos mal distribuidos',
    question_hint: '¿Segmentas a los médicos por valor?',
    focus: 7
  },
  'I14': {
    cluster: 'I-PREFERENCIAS',
    title: 'No conozco el horario preferido de cada médico',
    signals: ['llego cuando está ocupado', 'sin cita'],
    impact: 'Visitas no efectivas',
    question_hint: '¿Conoces el mejor horario de cada médico?',
    focus: 7
  },
  'I15': {
    cluster: 'I-VALOR',
    title: 'No ofrezco educación médica de valor',
    signals: ['solo producto', 'sin CME', 'sin educación'],
    impact: 'Médico no ve valor en la relación',
    question_hint: '¿Ofreces contenido educativo valioso?',
    focus: 7
  },
  'I16': {
    cluster: 'I-COMUNICACION',
    title: 'No sé el canal de comunicación preferido del médico',
    signals: ['le mando email pero prefiere WhatsApp', 'canal incorrecto'],
    impact: 'Mensajes no leídos',
    question_hint: '¿Usas el canal preferido de cada médico?',
    focus: 7
  },
  'I17': {
    cluster: 'I-PRESCRIPCION',
    title: 'No detecto cambios en patrones de prescripción',
    signals: ['dejó de recetar', 'no me enteré'],
    impact: 'Pérdida de prescriptor sin saberlo',
    question_hint: '¿Detectas cuando un médico deja de recetar?',
    focus: 7
  },
  'I18': {
    cluster: 'I-FIDELIZACION',
    title: 'No registro los intereses científicos del médico',
    signals: ['no sé qué le interesa', 'sin perfil'],
    impact: 'Comunicación genérica',
    question_hint: '¿Conoces los intereses de cada médico?',
    focus: 7
  },
  'I19': {
    cluster: 'I-SATISFACCION',
    title: 'No tengo NPS de médicos',
    signals: ['sin NPS', 'no mido satisfacción'],
    impact: 'Sin métrica de relación',
    question_hint: '¿Mides el NPS de tus médicos?',
    focus: 7
  },
  'I20': {
    cluster: 'I-SEGMENTACION_HCP',
    title: 'No identifico KOLs (Key Opinion Leaders)',
    signals: ['no sé quiénes son líderes', 'KOL'],
    impact: 'Sin estrategia de influencers',
    question_hint: '¿Identificas a los KOLs de cada especialidad?',
    focus: 7
  },

  // ==================== L. REGULATORIO Y COMPLIANCE PHARMA (25 dolores) ====================

  'L01': {
    cluster: 'L-TRAZABILIDAD',
    title: 'No puedo demostrar a COFEPRIS a quién di muestras',
    signals: ['no tengo prueba', 'auditoría', 'COFEPRIS'],
    impact: 'Sanción regulatoria probable',
    question_hint: '¿Tienes evidencia para COFEPRIS?',
    focus: 10
  },
  'L02': {
    cluster: 'L-TRAZABILIDAD',
    title: 'Sin trazabilidad de lotes hasta destinatario',
    signals: ['no sé dónde terminó', 'lotes perdidos'],
    impact: 'Recall imposible',
    question_hint: '¿Trazas lotes hasta el médico?',
    focus: 10
  },
  'L03': {
    cluster: 'L-NORMATIVA',
    title: 'No cumplo NOM-059 para muestras médicas',
    signals: ['no cumplo', 'normativa', 'fuera de regla', 'NOM'],
    impact: 'Multa y cierre',
    question_hint: '¿Cumples con NOM-059?',
    focus: 10
  },
  'L04': {
    cluster: 'L-POLITICAS',
    title: 'Sin políticas de visita documentadas',
    signals: ['sin políticas', 'no está escrito'],
    impact: 'Sin estándar de cumplimiento',
    question_hint: '¿Tienes políticas de visita por escrito?',
    focus: 10
  },
  'L05': {
    cluster: 'L-REPORTES',
    title: 'No genero reportes de auditoría rápidamente',
    signals: ['auditoría = pánico', 'tardo días'],
    impact: 'Mala impresión ante regulador',
    question_hint: '¿Puedes generar reportes de auditoría rápido?',
    focus: 10
  },
  'L06': {
    cluster: 'L-PERMISOS',
    title: 'Sin control de quién accede a qué información',
    signals: ['todos ven todo', 'sin permisos'],
    impact: 'Riesgo de datos sensibles',
    question_hint: '¿Controlas el acceso a información?',
    focus: 10
  },
  'L07': {
    cluster: 'L-PRIVACIDAD',
    title: 'Datos de médicos sin protección adecuada',
    signals: ['sin protección de datos', 'LFPDPPP', 'privacidad'],
    impact: 'Violación de ley de datos',
    question_hint: '¿Proteges los datos de los médicos?',
    focus: 10
  },
  'L08': {
    cluster: 'L-AUDITORIA',
    title: 'Sin log de quién modificó cada dato',
    signals: ['sin registro de cambios', 'no sé quién cambió'],
    impact: 'Sin auditoría de cambios',
    question_hint: '¿Tienes log de cambios?',
    focus: 10
  },
  'L09': {
    cluster: 'L-GDP',
    title: 'Sin cumplimiento de GDP (Good Distribution Practice)',
    signals: ['GDP', 'buenas prácticas', 'distribución'],
    impact: 'Riesgo regulatorio internacional',
    question_hint: '¿Cumples con GDP?',
    focus: 10
  },
  'L10': {
    cluster: 'L-NORMATIVA',
    title: 'Sin proceso de calificación de proveedores',
    signals: ['no califico proveedores', 'cualquier proveedor'],
    impact: 'Cadena de suministro no validada',
    question_hint: '¿Calificas a tus proveedores?',
    focus: 10
  },
  'L11': {
    cluster: 'L-TRAZABILIDAD',
    title: 'No puedo generar pedigree de medicamentos',
    signals: ['pedigree', 'DSCSA', 'sin histórico'],
    impact: 'Incumplimiento DSCSA',
    question_hint: '¿Generas pedigree de productos?',
    focus: 10
  },
  'L12': {
    cluster: 'L-POLITICAS',
    title: 'Sin política anti-soborno documentada',
    signals: ['sin política', 'FCPA', 'soborno'],
    impact: 'Riesgo FCPA/anticorrupción',
    question_hint: '¿Tienes política anti-soborno?',
    focus: 10
  },
  'L13': {
    cluster: 'L-AUDITORIA',
    title: 'Sin documentación de interacciones con funcionarios',
    signals: ['funcionarios públicos', 'gobierno', 'sin registro'],
    impact: 'Riesgo anticorrupción',
    question_hint: '¿Documentas interacciones con gobierno?',
    focus: 10
  },
  'L14': {
    cluster: 'L-REPORTES',
    title: 'No puedo generar reporte de farmacovigilancia',
    signals: ['farmacovigilancia', 'eventos adversos', 'no registro'],
    impact: 'Incumplimiento de reporte obligatorio',
    question_hint: '¿Reportas eventos adversos correctamente?',
    focus: 10
  },
  'L15': {
    cluster: 'L-NORMATIVA',
    title: 'Sin proceso de manejo de quejas',
    signals: ['quejas', 'sin proceso', 'no hay registro'],
    impact: 'Problemas de calidad no rastreados',
    question_hint: '¿Tienes proceso de manejo de quejas?',
    focus: 10
  },
  'L16': {
    cluster: 'L-PERMISOS',
    title: 'Reps pueden modificar datos sin aprobación',
    signals: ['cambian lo que quieren', 'sin control'],
    impact: 'Datos manipulados',
    question_hint: '¿Los reps pueden cambiar cualquier dato?',
    focus: 10
  },
  'L17': {
    cluster: 'L-GDP',
    title: 'Sin verificación de legitimidad de canales de distribución',
    signals: ['canal no verificado', 'falsificados'],
    impact: 'Riesgo de productos falsificados',
    question_hint: '¿Verificas la legitimidad de tus canales?',
    focus: 10
  },
  'L18': {
    cluster: 'L-AUDITORIA',
    title: 'No puedo reconstruir qué pasó en una fecha específica',
    signals: ['qué pasó ese día', 'sin histórico'],
    impact: 'Imposible responder a investigaciones',
    question_hint: '¿Puedes ver qué pasó en cualquier fecha?',
    focus: 10
  },
  'L19': {
    cluster: 'L-PRIVACIDAD',
    title: 'Sin consentimiento documentado de médicos',
    signals: ['sin consentimiento', 'no firmaron', 'GDPR'],
    impact: 'Violación de privacidad',
    question_hint: '¿Tienes consentimiento de uso de datos?',
    focus: 10
  },
  'L20': {
    cluster: 'L-NORMATIVA',
    title: 'Sin validación de sistemas computarizados',
    signals: ['no validado', 'CSV', 'sin IQ/OQ/PQ'],
    impact: 'Sistema no cumple 21 CFR Part 11',
    question_hint: '¿Tu sistema está validado?',
    focus: 10
  },
  'L21': {
    cluster: 'L-GDP',
    title: 'Sin mapeo de temperatura de almacén',
    signals: ['mapeo', 'temperatura', 'almacén'],
    impact: 'Producto almacenado incorrectamente',
    question_hint: '¿Tienes mapeo térmico del almacén?',
    focus: 10
  },
  'L22': {
    cluster: 'L-REPORTES',
    title: 'No puedo generar reporte de destrucción de producto',
    signals: ['destrucción', 'caducado', 'sin reporte'],
    impact: 'Producto destruido sin evidencia',
    question_hint: '¿Documentas la destrucción de producto?',
    focus: 10
  },
  'L23': {
    cluster: 'L-POLITICAS',
    title: 'Sin procedimiento de recall documentado',
    signals: ['recall', 'retiro', 'sin procedimiento'],
    impact: 'Incapaz de ejecutar recall efectivo',
    question_hint: '¿Tienes procedimiento de recall?',
    focus: 10
  },
  'L24': {
    cluster: 'L-PERMISOS',
    title: 'Ex-empleados aún tienen acceso al sistema',
    signals: ['ya no trabaja', 'todavía entra', 'sin dar de baja'],
    impact: 'Riesgo de seguridad',
    question_hint: '¿Das de baja accesos al terminar empleo?',
    focus: 10
  },
  'L25': {
    cluster: 'L-AUDITORIA',
    title: 'Sin firma electrónica que cumpla con regulación',
    signals: ['firma electrónica', '21 CFR 11', 'no válida'],
    impact: 'Documentos sin validez legal',
    question_hint: '¿Tu firma electrónica cumple regulación?',
    focus: 10
  },

  // ==================== J. MARKETING FARMACÉUTICO (15 dolores) ====================

  'J01': {
    cluster: 'J-EFECTIVIDAD',
    title: 'No sé qué material promocional funciona',
    signals: ['no mido qué funciona', 'todo igual'],
    impact: 'Inversión en material inútil',
    question_hint: '¿Mides qué material funciona mejor?',
    focus: 8
  },
  'J02': {
    cluster: 'J-ACTUALIZACION',
    title: 'Reps no llevan material actualizado',
    signals: ['material viejo', 'desactualizado', 'versiones anteriores'],
    impact: 'Información incorrecta a médicos',
    question_hint: '¿Tu equipo tiene material actualizado?',
    focus: 8
  },
  'J03': {
    cluster: 'J-DIGITAL',
    title: 'No envío material digital post-visita',
    signals: ['solo físico', 'no puedo enviar después'],
    impact: 'Sin refuerzo del mensaje',
    question_hint: '¿Envías material después de la visita?',
    focus: 8
  },
  'J04': {
    cluster: 'J-ROI',
    title: 'No mido impacto de campañas en ventas',
    signals: ['no sé si la campaña funcionó', 'sin ROI'],
    impact: 'Presupuesto sin justificación',
    question_hint: '¿Mides el ROI de tus campañas?',
    focus: 8
  },
  'J05': {
    cluster: 'J-ALINEACION',
    title: 'Marketing desconectado de campo',
    signals: ['marketing no pregunta', 'desconectados'],
    impact: 'Material que no sirve en campo',
    question_hint: '¿Marketing consulta al equipo de campo?',
    focus: 8
  },
  'J06': {
    cluster: 'J-CATALOGO',
    title: 'Sin catálogo digital de productos',
    signals: ['sin catálogo digital', 'PDF viejo'],
    impact: 'Información difícil de encontrar',
    question_hint: '¿Tienes catálogo digital actualizado?',
    focus: 8
  },
  'J07': {
    cluster: 'J-PERSONALIZACION',
    title: 'Misma presentación para todos',
    signals: ['misma presentación', 'sin personalizar'],
    impact: 'Mensaje no relevante',
    question_hint: '¿Personalizas presentaciones por médico?',
    focus: 8
  },
  'J08': {
    cluster: 'J-ESTRATEGIA',
    title: 'No sé qué productos promover por especialidad',
    signals: ['promueven lo que sea', 'sin estrategia'],
    impact: 'Mensaje fuera de target',
    question_hint: '¿Tienes estrategia por especialidad?',
    focus: 8
  },
  'J09': {
    cluster: 'J-COMPLIANCE_MKT',
    title: 'Material promocional sin aprobación regulatoria',
    signals: ['sin aprobar', 'no revisó regulatorio'],
    impact: 'Riesgo de claims no autorizados',
    question_hint: '¿Todo tu material está aprobado?',
    focus: 8
  },
  'J10': {
    cluster: 'J-COMPLIANCE_MKT',
    title: 'No tengo control de versiones de material',
    signals: ['versiones viejas', 'no sé cuál es la buena'],
    impact: 'Material obsoleto en circulación',
    question_hint: '¿Controlas versiones de material?',
    focus: 8
  },
  'J11': {
    cluster: 'J-DIGITAL',
    title: 'Sin seguimiento de apertura de emails',
    signals: ['no sé si abrieron', 'sin métricas'],
    impact: 'Campañas sin medición',
    question_hint: '¿Mides apertura de emails?',
    focus: 8
  },
  'J12': {
    cluster: 'J-PERSONALIZACION',
    title: 'No segmento campañas por tipo de médico',
    signals: ['todo igual', 'sin segmentación'],
    impact: 'Mensaje genérico',
    question_hint: '¿Segmentas tus campañas?',
    focus: 8
  },
  'J13': {
    cluster: 'J-EFECTIVIDAD',
    title: 'No sé qué mensajes resuenan más',
    signals: ['no sé qué funciona', 'sin A/B testing'],
    impact: 'Mensajes subóptimos',
    question_hint: '¿Pruebas diferentes mensajes?',
    focus: 8
  },
  'J14': {
    cluster: 'J-CATALOGO',
    title: 'Información de producto difícil de encontrar',
    signals: ['no encuentro', 'busco y no está'],
    impact: 'Tiempo perdido buscando',
    question_hint: '¿Tu equipo encuentra info fácilmente?',
    focus: 8
  },
  'J15': {
    cluster: 'J-ROI',
    title: 'No puedo atribuir ventas a actividades de marketing',
    signals: ['no sé qué generó la venta', 'sin atribución'],
    impact: 'Marketing sin demostrar valor',
    question_hint: '¿Puedes atribuir ventas a marketing?',
    focus: 8
  },

  // ==================== N. EVENTOS MÉDICOS (12 dolores) ====================

  'N01': {
    cluster: 'N-REGISTRO',
    title: 'Sin registro de asistencia a eventos',
    signals: ['no sé quién vino', 'sin registro'],
    impact: 'Inversión sin seguimiento',
    question_hint: '¿Registras quién asiste a eventos?',
    focus: 8
  },
  'N02': {
    cluster: 'N-SEGUIMIENTO',
    title: 'Sin seguimiento post-evento',
    signals: ['vienen y ya', 'sin seguimiento post-evento'],
    impact: 'Oportunidad desperdiciada',
    question_hint: '¿Das seguimiento después del evento?',
    focus: 8
  },
  'N03': {
    cluster: 'N-ROI',
    title: 'No mido ROI de eventos',
    signals: ['no sé si valió la pena', 'sin ROI'],
    impact: 'Presupuesto sin justificación',
    question_hint: '¿Mides el retorno de los eventos?',
    focus: 8
  },
  'N04': {
    cluster: 'N-LOGISTICA',
    title: 'Logística de eventos manual',
    signals: ['todo manual', 'Excel para eventos'],
    impact: 'Proceso lento y propenso a errores',
    question_hint: '¿Cómo gestionas la logística de eventos?',
    focus: 8
  },
  'N05': {
    cluster: 'N-CALENDARIO',
    title: 'Sin calendario de eventos del sector',
    signals: ['no sé qué eventos hay', 'me entero tarde'],
    impact: 'Participación tardía o nula',
    question_hint: '¿Tienes calendario de eventos?',
    focus: 8
  },
  'N06': {
    cluster: 'N-COMPLIANCE',
    title: 'Eventos sin documentación de gastos por médico',
    signals: ['sin documentar gastos', 'sunshine act'],
    impact: 'Riesgo Sunshine Act',
    question_hint: '¿Documentas gastos por médico en eventos?',
    focus: 8
  },
  'N07': {
    cluster: 'N-REGISTRO',
    title: 'No registro el feedback de asistentes',
    signals: ['sin feedback', 'no les pregunto'],
    impact: 'Sin mejora continua',
    question_hint: '¿Recopilas feedback de eventos?',
    focus: 8
  },
  'N08': {
    cluster: 'N-LOGISTICA',
    title: 'Invitaciones se mandan manualmente',
    signals: ['uno por uno', 'manual'],
    impact: 'Proceso ineficiente',
    question_hint: '¿Automatizas las invitaciones?',
    focus: 8
  },
  'N09': {
    cluster: 'N-SEGUIMIENTO',
    title: 'No correlaciono asistencia a eventos con prescripciones',
    signals: ['no sé si funcionó', 'eventos vs recetas'],
    impact: 'Sin medición de efectividad',
    question_hint: '¿Los eventos generan más prescripciones?',
    focus: 8
  },
  'N10': {
    cluster: 'N-COMPLIANCE',
    title: 'Sin aprobación previa de eventos con HCPs',
    signals: ['sin aprobar', 'compliance'],
    impact: 'Riesgo de incumplimiento',
    question_hint: '¿Los eventos pasan por compliance?',
    focus: 8
  },
  'N11': {
    cluster: 'N-ROI',
    title: 'No comparo efectividad entre diferentes eventos',
    signals: ['no comparo', 'todos iguales'],
    impact: 'Sin optimización de inversión',
    question_hint: '¿Comparas qué tipo de evento funciona mejor?',
    focus: 8
  },
  'N12': {
    cluster: 'N-CALENDARIO',
    title: 'Eventos se planean de último minuto',
    signals: ['improvisado', 'de último momento'],
    impact: 'Baja asistencia, mala ejecución',
    question_hint: '¿Planeas eventos con anticipación?',
    focus: 8
  },

  // ==================== K. PLANIFICACIÓN COMERCIAL PHARMA (15 dolores) ====================

  'K01': {
    cluster: 'K-PLANIFICACION',
    title: 'Plan de visitas no basado en potencial',
    signals: ['visitan sin plan', 'no hay prioridad'],
    impact: 'Esfuerzo mal distribuido',
    question_hint: '¿El plan de visitas considera el potencial?',
    focus: 9
  },
  'K02': {
    cluster: 'K-TERRITORIOS',
    title: 'Territorios mal distribuidos',
    signals: ['mal repartido', 'unos con mucho, otros con nada'],
    impact: 'Carga de trabajo desigual',
    question_hint: '¿Los territorios están bien balanceados?',
    focus: 9
  },
  'K03': {
    cluster: 'K-SIMULACION',
    title: 'No puedo simular escenarios',
    signals: ['no puedo simular', 'sin escenarios'],
    impact: 'Decisiones sin análisis',
    question_hint: '¿Puedes simular diferentes escenarios?',
    focus: 9
  },
  'K04': {
    cluster: 'K-OBJETIVOS',
    title: 'Objetivos vagos por rep/territorio/producto',
    signals: ['objetivos vagos', 'no están claros'],
    impact: 'Equipo sin rumbo claro',
    question_hint: '¿Los objetivos están bien definidos?',
    focus: 9
  },
  'K05': {
    cluster: 'K-PLANIFICACION',
    title: 'Planificación sobre la marcha',
    signals: ['improvisamos', 'sin plan', 'día a día'],
    impact: 'Esfuerzo descoordinado',
    question_hint: '¿Planeas con anticipación?',
    focus: 9
  },
  'K06': {
    cluster: 'K-COSTOS',
    title: 'No sé mi costo por visita',
    signals: ['no sé cuánto cuesta una visita', 'sin métrica de costo'],
    impact: 'Costos ocultos',
    question_hint: '¿Conoces tu costo por visita?',
    focus: 9
  },
  'K07': {
    cluster: 'K-COBERTURA_PLAN',
    title: 'Sin estrategia de cobertura por segmento',
    signals: ['sin estrategia de cobertura', 'todo igual'],
    impact: 'Recursos no optimizados',
    question_hint: '¿Tienes estrategia de cobertura?',
    focus: 9
  },
  'K08': {
    cluster: 'K-ROI',
    title: 'No mido ROI de la fuerza de ventas',
    signals: ['no sé si rinden', 'ROI de equipo'],
    impact: 'Sin visión de rentabilidad',
    question_hint: '¿Mides el ROI de tu equipo de ventas?',
    focus: 9
  },
  'K09': {
    cluster: 'K-PRIORIZACION',
    title: 'Sin forma de priorizar clientes',
    signals: ['todos igual', 'sin priorización'],
    impact: 'Tiempo en clientes incorrectos',
    question_hint: '¿Tienes criterios de priorización?',
    focus: 9
  },
  'K10': {
    cluster: 'K-CUOTAS',
    title: 'Cuotas asignadas sin datos reales',
    signals: ['cuota al azar', 'sin fundamento', 'porque sí'],
    impact: 'Cuotas irrealistas',
    question_hint: '¿Las cuotas se basan en datos?',
    focus: 9
  },
  'K11': {
    cluster: 'K-TERRITORIOS',
    title: 'Reps nuevos sin territorio definido',
    signals: ['sin territorio', 'donde pueda'],
    impact: 'Duplicación de esfuerzo',
    question_hint: '¿Los nuevos tienen territorio asignado?',
    focus: 9
  },
  'K12': {
    cluster: 'K-CICLOS',
    title: 'Sin ciclos promocionales definidos',
    signals: ['todo el año igual', 'sin ciclos'],
    impact: 'Esfuerzo no alineado a lanzamientos',
    question_hint: '¿Tienes ciclos promocionales?',
    focus: 9
  },
  'K13': {
    cluster: 'K-COBERTURA_PLAN',
    title: 'No tengo meta de frecuencia de visita por segmento',
    signals: ['visitan cuando quieren', 'sin frecuencia definida'],
    impact: 'Cobertura inconsistente',
    question_hint: '¿Tienes frecuencia meta por segmento?',
    focus: 9
  },
  'K14': {
    cluster: 'K-SIMULACION',
    title: 'No puedo modelar impacto de agregar/quitar reps',
    signals: ['no sé si necesito más gente', 'cuántos reps'],
    impact: 'Decisiones de headcount sin análisis',
    question_hint: '¿Puedes modelar el tamaño de equipo ideal?',
    focus: 9
  },
  'K15': {
    cluster: 'K-ROI',
    title: 'No sé el retorno de cada territorio',
    signals: ['territorios rentables', 'cuáles dan más'],
    impact: 'Inversión no optimizada',
    question_hint: '¿Conoces la rentabilidad por territorio?',
    focus: 9
  },

  // ==================== M. RECURSOS HUMANOS EQUIPO DE CAMPO (12 dolores) ====================

  'M01': {
    cluster: 'M-ROTACION',
    title: 'Alta rotación de reps, empezar de cero',
    signals: ['rotación alta', 'se van y empezamos de nuevo'],
    impact: 'Pérdida continua de productividad',
    question_hint: '¿Tienes alta rotación de reps?',
    focus: 11
  },
  'M02': {
    cluster: 'M-EVALUACION',
    title: 'Evaluación de reps sin métricas objetivas',
    signals: ['evaluación subjetiva', 'sin métricas'],
    impact: 'Decisiones de personal sin datos',
    question_hint: '¿Cómo evalúas a tu equipo?',
    focus: 11
  },
  'M03': {
    cluster: 'M-ONBOARDING',
    title: 'Onboarding de rep nuevo tarda semanas',
    signals: ['onboarding lento', 'tarda en arrancar'],
    impact: 'Semanas sin productividad',
    question_hint: '¿Cuánto tarda un nuevo en ser productivo?',
    focus: 11
  },
  'M04': {
    cluster: 'M-CAPACITACION',
    title: 'Sin programa de capacitación continua',
    signals: ['sin capacitación', 'aprenden solos'],
    impact: 'Equipo sin actualización',
    question_hint: '¿Tienes programa de capacitación?',
    focus: 11
  },
  'M05': {
    cluster: 'M-DESARROLLO',
    title: 'No sé qué habilidades le faltan a cada rep',
    signals: ['no sé qué reforzar', 'gaps de habilidades'],
    impact: 'Sin plan de desarrollo',
    question_hint: '¿Identificas gaps de habilidades?',
    focus: 11
  },
  'M06': {
    cluster: 'M-COMISIONES',
    title: 'Comisiones calculadas manualmente con errores',
    signals: ['comisiones a mano', 'errores en pago', 'reclamos'],
    impact: 'Desmotivación, conflictos',
    question_hint: '¿Cómo calculas las comisiones?',
    focus: 11
  },
  'M07': {
    cluster: 'M-MOTIVACION',
    title: 'Sin visibilidad de motivación del equipo',
    signals: ['no sé cómo están', 'motivación', 'engagement'],
    impact: 'Problemas detectados tarde',
    question_hint: '¿Mides el engagement de tu equipo?',
    focus: 11
  },
  'M08': {
    cluster: 'M-ONBOARDING',
    title: 'Sin material de onboarding estructurado',
    signals: ['cada quien le enseña', 'sin proceso'],
    impact: 'Calidad variable de capacitación',
    question_hint: '¿Tienes material de onboarding?',
    focus: 11
  },
  'M09': {
    cluster: 'M-EVALUACION',
    title: 'No hago evaluaciones regulares de desempeño',
    signals: ['cuando se puede', 'sin periodicidad'],
    impact: 'Feedback esporádico',
    question_hint: '¿Cada cuánto evalúas a tu equipo?',
    focus: 11
  },
  'M10': {
    cluster: 'M-CAPACITACION',
    title: 'Capacitación de producto no actualizada',
    signals: ['información vieja', 'no saben lo nuevo'],
    impact: 'Reps desinformados',
    question_hint: '¿Tu equipo conoce los productos nuevos?',
    focus: 11
  },
  'M11': {
    cluster: 'M-COMISIONES',
    title: 'Esquema de comisiones confuso',
    signals: ['no entienden', 'confuso', 'reclamos'],
    impact: 'Desmotivación',
    question_hint: '¿Tu equipo entiende cómo se le paga?',
    focus: 11
  },
  'M12': {
    cluster: 'M-DESARROLLO',
    title: 'Sin plan de carrera para reps',
    signals: ['sin crecimiento', 'no hay plan'],
    impact: 'Rotación por falta de desarrollo',
    question_hint: '¿Hay plan de carrera para tu equipo?',
    focus: 11
  },

  // ==================== O. COMPETENCIA Y MERCADO PHARMA (10 dolores) ====================

  'O01': {
    cluster: 'O-INTELIGENCIA',
    title: 'No registro información de competencia',
    signals: ['no documento', 'se me olvida'],
    impact: 'Sin inteligencia competitiva',
    question_hint: '¿Documentas lo que sabes de competencia?',
    focus: 9
  },
  'O02': {
    cluster: 'O-PRODUCTOS',
    title: 'No sé qué productos de competencia ganan terreno',
    signals: ['no sé qué venden', 'perdiendo share'],
    impact: 'Reacción tardía',
    question_hint: '¿Conoces los productos de tu competencia?',
    focus: 9
  },
  'O03': {
    cluster: 'O-REGISTRO',
    title: 'Información de mercado no se registra',
    signals: ['info se pierde', 'no documentan'],
    impact: 'Conocimiento no capitalizado',
    question_hint: '¿Los reps documentan info del mercado?',
    focus: 9
  },
  'O04': {
    cluster: 'O-ANALISIS',
    title: 'Sin análisis de participación de mercado',
    signals: ['sin market share', 'sin análisis'],
    impact: 'Sin visión de posición competitiva',
    question_hint: '¿Conoces tu market share?',
    focus: 9
  },
  'O05': {
    cluster: 'O-INSIGHTS',
    title: 'No sé por qué médicos prefieren competencia',
    signals: ['perdemos vs competencia', 'no sé por qué'],
    impact: 'Sin estrategia de diferenciación',
    question_hint: '¿Sabes por qué pierdes ante competencia?',
    focus: 9
  },
  'O06': {
    cluster: 'O-PRECIOS',
    title: 'No conozco precios de la competencia',
    signals: ['no sé sus precios', 'competencia más barata'],
    impact: 'Pricing sin contexto',
    question_hint: '¿Conoces los precios de tu competencia?',
    focus: 9
  },
  'O07': {
    cluster: 'O-MOVIMIENTOS',
    title: 'No detecto movimientos de la competencia',
    signals: ['me entero después', 'lanzaron algo'],
    impact: 'Siempre reactivos',
    question_hint: '¿Te enteras de lanzamientos de competencia?',
    focus: 9
  },
  'O08': {
    cluster: 'O-INTELIGENCIA',
    title: 'No sé qué reps de competencia visitan a mis médicos',
    signals: ['no sé quién los visita', 'competencia activa'],
    impact: 'Sin contra-estrategia',
    question_hint: '¿Sabes si la competencia visita a tus médicos?',
    focus: 9
  },
  'O09': {
    cluster: 'O-PRODUCTOS',
    title: 'No tengo comparativo de productos vs competencia',
    signals: ['no sé en qué somos mejores', 'sin comparativo'],
    impact: 'Argumentación débil',
    question_hint: '¿Tienes comparativo vs competencia?',
    focus: 9
  },
  'O10': {
    cluster: 'O-ANALISIS',
    title: 'No analizo tendencias del mercado farmacéutico',
    signals: ['sin análisis de tendencias', 'mercado'],
    impact: 'Sin anticipación',
    question_hint: '¿Analizas tendencias del mercado?',
    focus: 9
  },
};


// ============================================================
// CLUSTERS ACTUALIZADOS
// ============================================================

const PAIN_CLUSTERS = {
  // Categoría A - Visibilidad de equipo
  'A-VISIBILIDAD': { title: 'No sé qué hace mi equipo', description: 'Sin visibilidad de actividades de representantes', codes: ['A01', 'A02', 'A08', 'A15'], category: 'A', focus: 1, priority: 1 },
  'A-UBICACION': { title: 'No sé dónde están', description: 'Sin tracking de ubicación del equipo', codes: ['A03', 'A05'], category: 'A', focus: 1, priority: 1 },
  'A-REGISTRO': { title: 'Registran tarde o mal', description: 'El equipo no documenta en tiempo real', codes: ['A04', 'A11', 'A19'], category: 'A', focus: 1, priority: 2 },
  'A-VERIFICACION': { title: 'Sin evidencia de visitas', description: 'No hay prueba de que realmente visitaron', codes: ['A08', 'A16', 'A24'], category: 'A', focus: 1, priority: 1 },
  'A-COBERTURA': { title: 'No siguen el plan', description: 'Visitan a quien quieren, no a quien deben', codes: ['A06', 'A07', 'A17', 'A23'], category: 'A', focus: 1, priority: 2 },
  'A-CONOCIMIENTO': { title: 'La info se va con ellos', description: 'Pérdida de conocimiento cuando se van', codes: ['A09', 'A13', 'A25'], category: 'A', focus: 1, priority: 2 },
  'A-PRODUCTIVIDAD': { title: 'No puedo medir rendimiento', description: 'Sin métricas objetivas de productividad', codes: ['A10', 'A12', 'A18'], category: 'A', focus: 1, priority: 2 },
  'A-RUTAS': { title: 'Rutas ineficientes', description: 'Sin optimización de recorridos', codes: ['A14', 'A20'], category: 'A', focus: 1, priority: 3 },
  'A-SUPERVISIÓN': { title: 'Supervisión deficiente', description: 'Supervisores no acompañan ni dan feedback', codes: ['A21', 'A22'], category: 'A', focus: 1, priority: 3 },

  // Categoría B - Gestión de contactos
  'B-DATOS': { title: 'Datos desactualizados', description: 'Información de contactos vieja o incompleta', codes: ['B01', 'B07', 'B14', 'B18', 'B21'], category: 'B', focus: 2, priority: 1 },
  'B-CENTRALIZACION': { title: 'Cada quien su libreta', description: 'Sin base de datos centralizada', codes: ['B02', 'B16', 'B25'], category: 'B', focus: 2, priority: 1 },
  'B-SEGMENTACION': { title: 'Clientes sin categorizar', description: 'Sin segmentación por importancia o potencial', codes: ['B04', 'B13', 'B20'], category: 'B', focus: 2, priority: 2 },
  'B-HISTORIAL': { title: 'Sin historial de relación', description: 'No hay registro de interacciones previas', codes: ['B09', 'B17'], category: 'B', focus: 2, priority: 2 },
  'B-SEGUIMIENTO': { title: 'Falta de seguimiento', description: 'Clientes sin contacto, sin alertas', codes: ['B11', 'B23'], category: 'B', focus: 2, priority: 2 },
  'B-CHURN': { title: 'Clientes perdidos', description: 'Sin análisis de abandono ni señales de riesgo', codes: ['B12', 'B22'], category: 'B', focus: 2, priority: 3 },
  'B-TRANSICION': { title: 'Transiciones caóticas', description: 'Cambio de territorio es un desastre', codes: ['B06'], category: 'B', focus: 2, priority: 3 },
  'B-PERSONALIZACION': { title: 'Sin personalización', description: 'No conocemos preferencias del cliente', codes: ['B10', 'B24'], category: 'B', focus: 2, priority: 3 },

  // Categoría C - Muestras médicas (PHARMA)
  'C-INVENTARIO': { title: 'Sin control de muestras', description: 'No sé qué muestras tiene cada rep', codes: ['C01', 'C13', 'C14', 'C23', 'C30'], category: 'C', focus: 3, priority: 1 },
  'C-TRAZABILIDAD': { title: 'Muestras sin trazabilidad', description: 'No sé a quién se entregó ni qué lote', codes: ['C02', 'C03', 'C15', 'C29'], category: 'C', focus: 3, priority: 1 },
  'C-CONTROL': { title: 'Sin límites de entrega', description: 'Reps dan lo que quieren', codes: ['C04', 'C07', 'C16', 'C21'], category: 'C', focus: 3, priority: 2 },
  'C-CADUCIDAD': { title: 'Muestras vencidas', description: 'Sin control de fechas de vencimiento', codes: ['C06', 'C17', 'C35'], category: 'C', focus: 3, priority: 2 },
  'C-PROCESO': { title: 'Proceso manual de muestras', description: 'Solicitudes y transferencias sin sistema', codes: ['C08', 'C10', 'C19', 'C25', 'C32'], category: 'C', focus: 3, priority: 3 },
  'C-COMPLIANCE': { title: 'Compliance de muestras', description: 'Sin reportes para reguladores', codes: ['C11', 'C18', 'C24', 'C33'], category: 'C', focus: 10, priority: 1 },
  'C-COSTOS': { title: 'Costos ocultos de muestras', description: 'Sin visibilidad de inversión por médico', codes: ['C09', 'C28'], category: 'C', focus: 3, priority: 3 },
  'C-ANALISIS': { title: 'Sin análisis de muestras', description: 'No mido demanda ni ROI', codes: ['C05', 'C20', 'C34'], category: 'C', focus: 3, priority: 3 },
  'C-ESTRATEGIA': { title: 'Muestreo sin estrategia', description: 'Sin plan por ciclo o potencial', codes: ['C12', 'C22', 'C31'], category: 'C', focus: 3, priority: 3 },
  'C-CADENA_FRIO': { title: 'Cadena de frío', description: 'Sin monitoreo de temperatura', codes: ['C26', 'C27'], category: 'C', focus: 3, priority: 2 },

  // Categoría D - Ventas
  'D-VISIBILIDAD': { title: 'Oportunidades invisibles', description: 'Las ventas viven en la cabeza', codes: ['D01', 'D16', 'D24'], category: 'D', focus: 4, priority: 1 },
  'D-PIPELINE': { title: 'Sin pipeline visual', description: 'Sin embudo ni etapas claras', codes: ['D02', 'D03', 'D18', 'D26'], category: 'D', focus: 4, priority: 1 },
  'D-FORECAST': { title: 'Forecast poco confiable', description: 'No puedo predecir ventas', codes: ['D04', 'D12', 'D22'], category: 'D', focus: 4, priority: 2 },
  'D-SEGUIMIENTO': { title: 'Deals abandonados', description: 'Oportunidades sin seguimiento', codes: ['D08', 'D10', 'D17', 'D29'], category: 'D', focus: 4, priority: 1 },
  'D-COTIZACIONES': { title: 'Cotizaciones desordenadas', description: 'Sin proceso ni historial', codes: ['D05', 'D06', 'D20', 'D28'], category: 'D', focus: 4, priority: 2 },
  'D-DESCUENTOS': { title: 'Descuentos sin control', description: 'Sin aprobación ni límites', codes: ['D07', 'D21'], category: 'D', focus: 4, priority: 2 },
  'D-SCORING': { title: 'Sin priorización', description: 'No sé qué deals empujar', codes: ['D09', 'D23'], category: 'D', focus: 4, priority: 3 },
  'D-ANALISIS': { title: 'Sin análisis de ventas', description: 'No aprendo de ganar/perder', codes: ['D11', 'D19', 'D27'], category: 'D', focus: 4, priority: 3 },
  'D-METRICAS': { title: 'Sin métricas de ventas', description: 'No conozco mis promedios', codes: ['D15', 'D25'], category: 'D', focus: 4, priority: 3 },
  'D-APROBACIONES': { title: 'Aprobaciones lentas', description: 'Proceso burocrático', codes: ['D14', 'D30'], category: 'D', focus: 4, priority: 3 },

  // Categoría E - Cobranza
  'E-SEGUIMIENTO': { title: 'Facturas sin cobrar', description: 'Nadie gestiona los vencidos', codes: ['E01', 'E08'], category: 'E', focus: 5, priority: 1 },
  'E-VISIBILIDAD': { title: 'Cartera invisible', description: 'Sin vista consolidada de CxC', codes: ['E02', 'E07'], category: 'E', focus: 5, priority: 1 },
  'E-PROCESO': { title: 'Sin proceso de cobranza', description: 'Sin escalamiento ni límites', codes: ['E06', 'E13'], category: 'E', focus: 5, priority: 2 },
  'E-ALERTAS': { title: 'Alertas tardías', description: 'Me entero cuando ya venció', codes: ['E05', 'E14'], category: 'E', focus: 5, priority: 2 },
  'E-AUTOMATIZACION': { title: 'Cobranza manual', description: 'Recordatorios uno por uno', codes: ['E03'], category: 'E', focus: 5, priority: 3 },
  'E-COMUNICACION': { title: 'Ventas vs Finanzas', description: 'Sin comunicación entre áreas', codes: ['E10', 'E15'], category: 'E', focus: 5, priority: 3 },

  // Categoría F - Reportes
  'F-TIEMPO': { title: 'Reportes tardan días', description: 'Mucho tiempo consolidando', codes: ['F01', 'F15'], category: 'F', focus: 9, priority: 1 },
  'F-DASHBOARDS': { title: 'Sin dashboards', description: 'Sin visualizaciones en tiempo real', codes: ['F06', 'F19'], category: 'F', focus: 9, priority: 1 },
  'F-AUTOMATIZACION': { title: 'Reportes manuales', description: 'Sin envío automático', codes: ['F13'], category: 'F', focus: 9, priority: 2 },
  'F-KPIS': { title: 'Sin KPIs definidos', description: 'No sé qué medir ni las metas', codes: ['F03', 'F17'], category: 'F', focus: 9, priority: 2 },
  'F-FUENTE_UNICA': { title: 'Números diferentes', description: 'Cada quien sus datos', codes: ['F14', 'F16'], category: 'F', focus: 9, priority: 2 },
  'F-INTEGRACION': { title: 'Datos no conectados', description: 'Sistemas aislados', codes: ['F11', 'F20'], category: 'F', focus: 9, priority: 3 },
  'F-DISPONIBILIDAD': { title: 'Info no está lista', description: 'Corremos cuando piden datos', codes: ['F05'], category: 'F', focus: 9, priority: 3 },

  // Categoría G - Tecnología
  'G-EXCEL': { title: 'Todo en Excel', description: 'Hojas de cálculo como sistema', codes: ['G01', 'G19'], category: 'G', focus: 9, priority: 1 },
  'G-ADOPCION': { title: 'Sistema sin adopción', description: 'Compramos y nadie usa', codes: ['G03', 'G08', 'G14'], category: 'G', focus: 9, priority: 1 },
  'G-FRAGMENTACION': { title: 'Sistemas fragmentados', description: 'Info en múltiples lugares', codes: ['G04', 'G13'], category: 'G', focus: 9, priority: 2 },
  'G-INTEGRACION': { title: 'Sin integración', description: 'Sistemas no se conectan', codes: ['G02', 'G10', 'G18'], category: 'G', focus: 9, priority: 2 },
  'G-MOVIL': { title: 'Sin app móvil buena', description: 'Web en campo no funciona', codes: ['G05', 'G15'], category: 'G', focus: 9, priority: 2 },
  'G-OFFLINE': { title: 'Necesita internet', description: 'Sin modo offline', codes: ['G06'], category: 'G', focus: 9, priority: 3 },
  'G-DEPENDENCIA': { title: 'Dependencia de personas', description: 'Solo uno sabe sacar datos', codes: ['G09', 'G20'], category: 'G', focus: 9, priority: 3 },
  'G-SEGURIDAD': { title: 'Sin seguridad', description: 'Sin backup ni permisos', codes: ['G12', 'G16'], category: 'G', focus: 9, priority: 3 },
  'G-OBSOLESCENCIA': { title: 'Sistema obsoleto', description: 'Viejo y sin soporte', codes: ['G07', 'G17'], category: 'G', focus: 9, priority: 3 },

  // Categoría H - Comunicación
  'H-CANALES': { title: 'Canales dispersos', description: 'WhatsApp, email, todo mezclado', codes: ['H01', 'H02', 'H10'], category: 'H', focus: 6, priority: 1 },
  'H-FEEDBACK': { title: 'Sin retroalimentación', description: 'Supervisores no dan feedback', codes: ['H03', 'H11'], category: 'H', focus: 6, priority: 2 },
  'H-SILOS': { title: 'Silos de información', description: 'Áreas no se comunican', codes: ['H09', 'H14'], category: 'H', focus: 6, priority: 2 },
  'H-APROBACIONES': { title: 'Aprobaciones informales', description: 'Sin trazabilidad', codes: ['H04', 'H13'], category: 'H', focus: 6, priority: 3 },
  'H-OBJETIVOS': { title: 'Objetivos verbales', description: 'Sin documentar ni cascadear', codes: ['H07', 'H12'], category: 'H', focus: 6, priority: 3 },

  // Categoría I - HCPs (PHARMA)
  'I-VALOR': { title: 'Visitas sin valor', description: 'No aportamos contenido útil', codes: ['I05', 'I15'], category: 'I', focus: 7, priority: 1 },
  'I-PRESCRIPCION': { title: 'Sin data de prescripción', description: 'No sé quién receta', codes: ['I06', 'I17'], category: 'I', focus: 7, priority: 1 },
  'I-SEGUIMIENTO': { title: 'Sin seguimiento a médicos', description: 'Compromisos olvidados', codes: ['I03', 'I04'], category: 'I', focus: 7, priority: 2 },
  'I-SEGMENTACION_HCP': { title: 'Médicos sin segmentar', description: 'Sin valor ni KOLs identificados', codes: ['I13', 'I20'], category: 'I', focus: 7, priority: 2 },
  'I-PERSONALIZACION': { title: 'Comunicación genérica', description: 'No personalizo por médico', codes: ['I10', 'I14', 'I16'], category: 'I', focus: 7, priority: 3 },
  'I-FIDELIZACION': { title: 'Sin fidelización', description: 'Relaciones transaccionales', codes: ['I09', 'I18'], category: 'I', focus: 7, priority: 3 },
  'I-CONTINUIDAD': { title: 'Sin continuidad', description: 'Empezamos de cero cada cambio', codes: ['I11'], category: 'I', focus: 7, priority: 3 },

  // Categoría J - Marketing (PHARMA)
  'J-EFECTIVIDAD': { title: 'Material sin medir', description: 'No sé qué funciona', codes: ['J01', 'J13'], category: 'J', focus: 8, priority: 2 },
  'J-COMPLIANCE_MKT': { title: 'Material sin aprobar', description: 'Sin control regulatorio', codes: ['J09', 'J10'], category: 'J', focus: 8, priority: 1 },
  'J-DIGITAL': { title: 'Sin digital', description: 'Solo material físico', codes: ['J03', 'J11'], category: 'J', focus: 8, priority: 2 },
  'J-ROI': { title: 'Sin ROI de marketing', description: 'Inversión sin medición', codes: ['J04', 'J15'], category: 'J', focus: 8, priority: 3 },
  'J-PERSONALIZACION': { title: 'Sin personalización', description: 'Mismo mensaje para todos', codes: ['J07', 'J12'], category: 'J', focus: 8, priority: 3 },

  // Categoría K - Planificación
  'K-PLANIFICACION': { title: 'Sin plan de visitas', description: 'Improvisación diaria', codes: ['K01', 'K05'], category: 'K', focus: 9, priority: 1 },
  'K-TERRITORIOS': { title: 'Territorios mal diseñados', description: 'Carga desbalanceada', codes: ['K02', 'K11'], category: 'K', focus: 9, priority: 2 },
  'K-OBJETIVOS': { title: 'Objetivos vagos', description: 'Sin claridad de metas', codes: ['K04'], category: 'K', focus: 9, priority: 2 },
  'K-CUOTAS': { title: 'Cuotas sin fundamento', description: 'Asignadas al azar', codes: ['K10'], category: 'K', focus: 9, priority: 2 },
  'K-COBERTURA_PLAN': { title: 'Sin estrategia de cobertura', description: 'Sin frecuencias definidas', codes: ['K07', 'K13'], category: 'K', focus: 9, priority: 3 },
  'K-ROI': { title: 'Sin ROI de equipo', description: 'No mido rentabilidad', codes: ['K08', 'K15'], category: 'K', focus: 9, priority: 3 },

  // Categoría L - Regulatorio (PHARMA)
  'L-TRAZABILIDAD': { title: 'Sin trazabilidad regulatoria', description: 'No puedo demostrar a autoridades', codes: ['L01', 'L02', 'L11'], category: 'L', focus: 10, priority: 1 },
  'L-NORMATIVA': { title: 'Incumplimiento normativo', description: 'NOM, GDP, CSV no cumplidos', codes: ['L03', 'L10', 'L15', 'L20'], category: 'L', focus: 10, priority: 1 },
  'L-AUDITORIA': { title: 'Sin rastro de auditoría', description: 'No hay log de cambios', codes: ['L08', 'L13', 'L18', 'L25'], category: 'L', focus: 10, priority: 1 },
  'L-REPORTES': { title: 'Reportes regulatorios', description: 'No puedo generar para autoridades', codes: ['L05', 'L14', 'L22'], category: 'L', focus: 10, priority: 2 },
  'L-POLITICAS': { title: 'Sin políticas documentadas', description: 'Nada por escrito', codes: ['L04', 'L12', 'L23'], category: 'L', focus: 10, priority: 2 },
  'L-PERMISOS': { title: 'Sin control de acceso', description: 'Todos ven todo', codes: ['L06', 'L16', 'L24'], category: 'L', focus: 10, priority: 2 },
  'L-PRIVACIDAD': { title: 'Datos sin proteger', description: 'Sin cumplimiento de privacidad', codes: ['L07', 'L19'], category: 'L', focus: 10, priority: 2 },
  'L-GDP': { title: 'Sin GDP completo', description: 'Buenas prácticas incompletas', codes: ['L09', 'L17', 'L21'], category: 'L', focus: 10, priority: 2 },

  // Categoría M - RRHH
  'M-ROTACION': { title: 'Alta rotación', description: 'Gente se va constantemente', codes: ['M01'], category: 'M', focus: 11, priority: 1 },
  'M-ONBOARDING': { title: 'Onboarding lento', description: 'Nuevos tardan en ser productivos', codes: ['M03', 'M08'], category: 'M', focus: 11, priority: 2 },
  'M-EVALUACION': { title: 'Evaluación subjetiva', description: 'Sin métricas objetivas', codes: ['M02', 'M09'], category: 'M', focus: 11, priority: 2 },
  'M-CAPACITACION': { title: 'Sin capacitación', description: 'Equipo sin actualización', codes: ['M04', 'M10'], category: 'M', focus: 11, priority: 3 },
  'M-COMISIONES': { title: 'Comisiones problemáticas', description: 'Errores y confusión', codes: ['M06', 'M11'], category: 'M', focus: 11, priority: 3 },
  'M-DESARROLLO': { title: 'Sin desarrollo', description: 'Sin plan de carrera', codes: ['M05', 'M12'], category: 'M', focus: 11, priority: 3 },

  // Categoría N - Eventos (PHARMA)
  'N-ROI': { title: 'Eventos sin ROI', description: 'No mido si valen la pena', codes: ['N03', 'N09', 'N11'], category: 'N', focus: 8, priority: 2 },
  'N-SEGUIMIENTO': { title: 'Sin seguimiento post-evento', description: 'Asisten y ya', codes: ['N02'], category: 'N', focus: 8, priority: 2 },
  'N-COMPLIANCE': { title: 'Eventos sin compliance', description: 'Sin documentar gastos', codes: ['N06', 'N10'], category: 'N', focus: 8, priority: 1 },
  'N-LOGISTICA': { title: 'Logística manual', description: 'Todo en Excel', codes: ['N04', 'N08'], category: 'N', focus: 8, priority: 3 },
  'N-REGISTRO': { title: 'Sin registro de asistencia', description: 'No sé quién vino', codes: ['N01', 'N07'], category: 'N', focus: 8, priority: 3 },

  // Categoría O - Competencia
  'O-INTELIGENCIA': { title: 'Sin inteligencia competitiva', description: 'No documento ni analizo', codes: ['O01', 'O08'], category: 'O', focus: 9, priority: 2 },
  'O-PRODUCTOS': { title: 'Sin comparativo', description: 'No conozco sus productos', codes: ['O02', 'O09'], category: 'O', focus: 9, priority: 2 },
  'O-ANALISIS': { title: 'Sin análisis de mercado', description: 'No sé mi posición', codes: ['O04', 'O10'], category: 'O', focus: 9, priority: 3 },
  'O-INSIGHTS': { title: 'Sin insights de pérdida', description: 'No sé por qué perdemos', codes: ['O05', 'O06', 'O07'], category: 'O', focus: 9, priority: 3 },

  // Categoría P - Automatización
  'P-TIEMPO': { title: 'Tiempo en admin', description: 'Formularios y tareas repetitivas', codes: ['P01', 'P09'], category: 'P', focus: 9, priority: 1 },
  'P-CONTEXTO': { title: 'Sin contexto', description: 'Llego sin saber qué pasó', codes: ['P04', 'P10', 'P14'], category: 'P', focus: 9, priority: 2 },
  'P-AUTOMATICO': { title: 'Nada automático', description: 'Todo manual', codes: ['P07', 'P11', 'P15'], category: 'P', focus: 9, priority: 2 },
  'P-ALERTAS': { title: 'Sin alertas', description: 'Me entero tarde', codes: ['P06', 'P12'], category: 'P', focus: 9, priority: 2 },
  'P-SUGERENCIAS': { title: 'Sin sugerencias', description: 'Sistema pasivo', codes: ['P08', 'P13'], category: 'P', focus: 9, priority: 3 },
  'P-PREPARACION': { title: 'Sin preparación', description: 'Improviso cada visita', codes: ['P02'], category: 'P', focus: 9, priority: 3 },
};


// ============================================================
// COMBINACIÓN FINAL: CATÁLOGO COMPLETO DE 500+ DOLORES
// ============================================================

const PAIN_CATALOG = {
  ...COMMON_PAINS,
  ...PHARMA_SPECIFIC_PAINS
};

// Contador de dolores
const PAIN_COUNT = Object.keys(PAIN_CATALOG).length;
const CLUSTER_COUNT = Object.keys(PAIN_CLUSTERS).length;

console.log(`APEX Pain Knowledge Base loaded: ${PAIN_COUNT} pains, ${CLUSTER_COUNT} clusters`);


// ============================================================
// PREGUNTAS CORTAS POR CLUSTER (para preguntas adaptativas)
// ============================================================

const CLUSTER_QUESTIONS = {
  // Preguntas directas, cortas, en tuteo
  'A-VISIBILIDAD': [
    '¿Cómo sabes qué hizo tu equipo hoy?',
    '¿Puedes ver las actividades de tus reps en tiempo real?',
    '¿Confías en los reportes de actividad de tu equipo?'
  ],
  'A-UBICACION': [
    '¿Puedes ubicar a tu equipo en este momento?',
    '¿Sabes cuánto tiempo pasan en cada visita?'
  ],
  'A-REGISTRO': [
    '¿Tu equipo registra las visitas al momento o después?',
    '¿Las notas de visita son útiles o solo "todo bien"?'
  ],
  'A-VERIFICACION': [
    '¿Cómo verificas que una visita realmente se hizo?',
    '¿Tienes evidencia física de cada visita?'
  ],
  'A-COBERTURA': [
    '¿Tu equipo sigue un plan de visitas?',
    '¿Hay clientes que nunca reciben visita?'
  ],
  'B-DATOS': [
    '¿Hace cuánto actualizaste los datos de tus clientes?',
    '¿Tienes duplicados en tu base de datos?'
  ],
  'B-CENTRALIZACION': [
    '¿Dónde guarda tu equipo los contactos?',
    '¿Si un rep se va mañana, dónde queda su info?'
  ],
  'B-SEGMENTACION': [
    '¿Todos tus clientes reciben la misma atención?',
    '¿Sabes cuáles son tus clientes más valiosos?'
  ],
  'C-INVENTARIO': [
    '¿Cuántas muestras tiene cada rep en su maletín?',
    '¿Cada cuánto reconcilias el inventario de muestras?'
  ],
  'C-TRAZABILIDAD': [
    '¿Registras a quién se entrega cada muestra?',
    '¿Podrías hacer un recall de un lote específico mañana?'
  ],
  'C-COMPLIANCE': [
    '¿Puedes generar reportes para COFEPRIS rápido?',
    '¿Tienes evidencia de cada entrega de muestras?'
  ],
  'D-PIPELINE': [
    '¿Ves tu pipeline de oportunidades en un solo lugar?',
    '¿Sabes en qué etapa está cada negociación?'
  ],
  'D-SEGUIMIENTO': [
    '¿Has perdido ventas por falta de seguimiento?',
    '¿Tienes recordatorios de seguimiento automáticos?'
  ],
  'D-FORECAST': [
    '¿Qué tan preciso es tu pronóstico de ventas?',
    '¿Sabes cuánto vas a cerrar este mes?'
  ],
  'E-SEGUIMIENTO': [
    '¿Tienes facturas vencidas que nadie está cobrando?',
    '¿Cuánto te deben que tiene más de 30 días?'
  ],
  'F-TIEMPO': [
    '¿Cuánto tardas en armar un reporte para dirección?',
    '¿Pasas horas consolidando información?'
  ],
  'F-DASHBOARDS': [
    '¿Tienes dashboards en tiempo real?',
    '¿Puedes ver el status de tu negocio ahora mismo?'
  ],
  'G-EXCEL': [
    '¿Excel es tu sistema principal?',
    '¿Cada quien tiene su propia versión del archivo?'
  ],
  'G-ADOPCION': [
    '¿Tu equipo realmente usa el sistema que compraste?',
    '¿Pagaste por un CRM que nadie usa?'
  ],
  'H-CANALES': [
    '¿Las instrucciones importantes van por WhatsApp?',
    '¿Los mensajes de trabajo se pierden entre chats?'
  ],
  'I-PRESCRIPCION': [
    '¿Sabes qué médicos prescriben tus productos?',
    '¿Detectas si un médico deja de recetarte?'
  ],
  'I-VALOR': [
    '¿Qué valor aportas en cada visita al médico?',
    '¿Los médicos quieren recibirte o te evitan?'
  ],
  'L-TRAZABILIDAD': [
    '¿Puedes demostrar a un auditor cada entrega?',
    '¿Tienes la evidencia que requiere COFEPRIS?'
  ],
  'L-NORMATIVA': [
    '¿Cumples con NOM-059 para muestras?',
    '¿Tu sistema está validado según regulación?'
  ],
  'P-TIEMPO': [
    '¿Cuánto tiempo gastas en tareas repetitivas?',
    '¿Te sientes productivo o atrapado en admin?'
  ]
};


// ============================================================
// EXPORTS
// ============================================================

// Para uso en form.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PAIN_CATALOG,
    PAIN_CLUSTERS,
    COMMON_PAINS,
    PHARMA_SPECIFIC_PAINS,
    CLUSTER_QUESTIONS,
    PAIN_COUNT,
    CLUSTER_COUNT
  };
}

// Para uso directo en browser
if (typeof window !== 'undefined') {
  window.APEX_KNOWLEDGE_BASE = {
    PAIN_CATALOG,
    PAIN_CLUSTERS,
    COMMON_PAINS,
    PHARMA_SPECIFIC_PAINS,
    CLUSTER_QUESTIONS,
    PAIN_COUNT,
    CLUSTER_COUNT
  };
}
