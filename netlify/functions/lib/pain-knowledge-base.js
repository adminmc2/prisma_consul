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
// PARTE III: DOLORES ESPECÍFICOS PARA CLÍNICAS
// ============================================================

const CLINIC_PAINS = {

  // ============================================================
  // CA - No controlo las citas
  // ============================================================

  'CA01': {
    cluster: 'CA-AGENDA',
    title: 'Agenda desorganizada sin sistema central',
    signals: ['llevo las citas en una libreta', 'uso Excel para las citas y siempre hay errores', 'cada doctor maneja su propia agenda'],
    impact: 'Pérdida de citas, tiempos muertos y experiencia caótica para el paciente desde el primer contacto',
    question_hint: '¿Cómo gestionan actualmente la agenda de citas en la clínica?',
    focus: 1
  },
  'CA02': {
    cluster: 'CA-CANCELACIONES',
    title: 'Cancelaciones sin previo aviso',
    signals: ['los pacientes no se presentan y no avisan', 'tengo muchos huecos por cancelaciones de última hora', 'no tengo forma de penalizar las faltas'],
    impact: 'Huecos no recuperables en la agenda que representan ingresos perdidos directos',
    question_hint: '¿Qué porcentaje de pacientes cancelan o no se presentan sin avisar?',
    focus: 1
  },
  'CA03': {
    cluster: 'CA-AGENDA',
    title: 'Huecos en la agenda sin rellenar',
    signals: ['siempre tengo espacios vacíos entre citas', 'no logro llenar toda la agenda del día', 'hay horas muertas que no sé cómo aprovechar'],
    impact: 'Capacidad instalada desperdiciada que reduce la facturación diaria sin reducir los costos fijos',
    question_hint: '¿Cuántos huecos vacíos quedan en su agenda promedio por semana?',
    focus: 2
  },
  'CA04': {
    cluster: 'CA-CANALES',
    title: 'Citas por múltiples canales sin centralizar',
    signals: ['me piden citas por WhatsApp, Instagram, teléfono y no llevo control', 'a veces se me pasa una cita que me pidieron por mensaje', 'cada canal es un lío diferente para agendar'],
    impact: 'Citas perdidas o duplicadas por falta de un punto único de entrada de reservas',
    question_hint: '¿Por cuántos canales distintos reciben solicitudes de cita actualmente?',
    focus: 2
  },
  'CA05': {
    cluster: 'CA-AGENDA',
    title: 'Doble reserva de citas',
    signals: ['a veces agendo dos pacientes a la misma hora sin darme cuenta', 'hemos tenido pacientes esperando porque ya había alguien', 'el cruce de citas es un problema recurrente'],
    impact: 'Mala experiencia del paciente, esperas innecesarias y conflictos en recepción',
    question_hint: '¿Les ha pasado que llegan dos pacientes agendados a la misma hora?',
    focus: 1
  },
  'CA06': {
    cluster: 'CA-CANCELACIONES',
    title: 'No-shows recurrentes sin consecuencias',
    signals: ['hay pacientes que faltan y luego vuelven a agendar como si nada', 'no tengo registro de quiénes son los que más faltan', 'no puedo hacer nada cuando no vienen'],
    impact: 'Pacientes reincidentes bloquean horarios que podrían ocupar pacientes comprometidos',
    question_hint: '¿Tienen identificados a los pacientes que más faltan a sus citas?',
    focus: 3
  },
  'CA07': {
    cluster: 'CA-CANCELACIONES',
    title: 'Cancelaciones de último momento imposibles de cubrir',
    signals: ['me cancelan una hora antes y ya no puedo llenar ese espacio', 'no tengo lista de espera para cubrir cancelaciones', 'cuando cancelan tarde es dinero perdido seguro'],
    impact: 'Ingreso perdido irrecuperable por la imposibilidad de reasignar el horario liberado',
    question_hint: '¿Qué pasa cuando un paciente cancela con menos de 24 horas de anticipación?',
    focus: 2
  },
  'CA08': {
    cluster: 'CA-AGENDA',
    title: 'Lista de espera no gestionada',
    signals: ['hay pacientes esperando turno pero no llevo una lista organizada', 'cuando se libera un hueco no sé a quién llamar primero', 'se me olvida que alguien quería esa hora'],
    impact: 'Oportunidades de ocupar huecos desaprovechadas y pacientes insatisfechos por la espera innecesaria',
    question_hint: '¿Manejan alguna lista de espera para cubrir cancelaciones rápidamente?',
    focus: 4
  },
  'CA09': {
    cluster: 'CA-AGENDA',
    title: 'Horas pico saturadas y horas valle vacías',
    signals: ['por la mañana estamos a tope y por la tarde no viene nadie', 'los lunes son un caos y los miércoles están vacíos', 'no sé cómo equilibrar la carga de la semana'],
    impact: 'Estrés del equipo en horas pico con calidad de atención comprometida mientras se desperdicia capacidad en valle',
    question_hint: '¿En qué horarios sienten más sobrecarga y en cuáles hay más tiempo libre?',
    focus: 3
  },
  'CA10': {
    cluster: 'CA-CANALES',
    title: 'Sin sistema de confirmación de citas',
    signals: ['no confirmo las citas y luego no sé si vendrán', 'a veces llamo uno por uno para confirmar y pierdo mucho tiempo', 'el paciente no recibe ningún recordatorio antes de su cita'],
    impact: 'Alta tasa de no-shows prevenibles con un simple sistema de confirmación automatizado',
    question_hint: '¿Cómo confirman las citas con los pacientes antes de que vengan?',
    focus: 1
  },

  // ============================================================
  // CB - Los pacientes no vuelven
  // ============================================================

  'CB01': {
    cluster: 'CB-SEGUIMIENTO',
    title: 'Sin seguimiento post-tratamiento',
    signals: ['el paciente se va y no volvemos a saber de él', 'no hacemos llamadas de seguimiento después del procedimiento', 'nadie revisa cómo le fue al paciente después'],
    impact: 'Pérdida de oportunidad de fidelización y detección tardía de complicaciones que generan mala reputación',
    question_hint: '¿Qué seguimiento hacen con el paciente después de un tratamiento?',
    focus: 1
  },
  'CB02': {
    cluster: 'CB-RETENCION',
    title: 'Pacientes perdidos después de la primera visita',
    signals: ['muchos vienen una vez y no regresan', 'no sé por qué no vuelven después de la primera consulta', 'la conversión de primera cita a tratamiento es muy baja'],
    impact: 'Costo de adquisición de paciente desperdiciado al no convertir la primera visita en relación continuada',
    question_hint: '¿Qué porcentaje de pacientes nuevos regresan para una segunda visita?',
    focus: 1
  },
  'CB03': {
    cluster: 'CB-SEGUIMIENTO',
    title: 'Sin sistema de recall para revisiones periódicas',
    signals: ['no recordamos a los pacientes que toca su revisión anual', 'las limpiezas semestrales se pierden porque nadie las agenda', 'no tenemos forma de avisarle al paciente que ya le toca volver'],
    impact: 'Ingresos recurrentes perdidos por falta de recordatorios para mantenimientos y revisiones programadas',
    question_hint: '¿Cómo recuerdan a los pacientes que les toca una revisión o mantenimiento?',
    focus: 2
  },
  'CB04': {
    cluster: 'CB-RETENCION',
    title: 'Sin comunicación personalizada con el paciente',
    signals: ['no mandamos felicitaciones de cumpleaños ni nada', 'no tenemos ningún detalle especial para los pacientes fieles', 'la relación con el paciente es puramente transaccional'],
    impact: 'Falta de vínculo emocional que facilita que el paciente migre a otra clínica sin pensarlo',
    question_hint: '¿Envían algún tipo de mensaje personalizado a sus pacientes en fechas especiales?',
    focus: 5
  },
  'CB05': {
    cluster: 'CB-REACTIVACION',
    title: 'Sin campañas de reactivación de pacientes inactivos',
    signals: ['tengo pacientes que no vienen hace meses y no hago nada al respecto', 'no sé cómo recuperar a los que dejaron de venir', 'nunca hemos hecho una campaña para traer de vuelta a pacientes antiguos'],
    impact: 'Base de pacientes existente infrautilizada mientras se gasta en captar nuevos pacientes desde cero',
    question_hint: '¿Han intentado contactar a pacientes que dejaron de venir hace más de 6 meses?',
    focus: 3
  },
  'CB06': {
    cluster: 'CB-REACTIVACION',
    title: 'Pacientes dormidos sin identificar',
    signals: ['no sé cuántos pacientes tengo inactivos', 'no distingo entre los que siguen viniendo y los que no', 'no tengo forma de segmentar mi base de pacientes por actividad'],
    impact: 'Imposibilidad de actuar sobre la retención al no tener visibilidad del ciclo de vida del paciente',
    question_hint: '¿Saben cuántos pacientes de su base no han venido en el último año?',
    focus: 3
  },
  'CB07': {
    cluster: 'CB-RETENCION',
    title: 'Deserción sin conocer las causas',
    signals: ['no sé por qué los pacientes se van', 'nunca preguntamos por qué dejaron de venir', 'nos enteramos que se fueron a otra clínica pero no sabemos la razón'],
    impact: 'Repetición de errores que causan abandono al no tener retroalimentación sobre la experiencia del paciente',
    question_hint: '¿Saben las razones principales por las que los pacientes dejan de venir?',
    focus: 2
  },
  'CB08': {
    cluster: 'CB-RETENCION',
    title: 'Sin programa de fidelización',
    signals: ['no tenemos ningún incentivo para que el paciente regrese', 'no ofrecemos descuentos por lealtad ni paquetes', 'quisiera premiar a mis pacientes frecuentes pero no sé cómo'],
    impact: 'Sin mecanismos de retención estructurados, la lealtad depende solo de la inercia del paciente',
    question_hint: '¿Ofrecen algún tipo de beneficio o programa para sus pacientes más frecuentes?',
    focus: 5
  },
  'CB09': {
    cluster: 'CB-REACTIVACION',
    title: 'Paciente se va a la competencia',
    signals: ['me entero que mis pacientes están yendo a otra clínica', 'la competencia les ofrece algo y se los lleva', 'no tengo forma de competir cuando otro les da mejor precio'],
    impact: 'Pérdida de pacientes rentables que reduce la base de ingresos recurrentes de la clínica',
    question_hint: '¿Han detectado pacientes que se fueron a clínicas de la competencia?',
    focus: 2
  },
  'CB10': {
    cluster: 'CB-SEGUIMIENTO',
    title: 'Sin medición de satisfacción del paciente',
    signals: ['no preguntamos si el paciente quedó contento', 'no tenemos encuestas ni forma de medir la experiencia', 'solo nos enteramos de problemas cuando ponen una queja o reseña negativa'],
    impact: 'Problemas de experiencia no detectados a tiempo que se convierten en reseñas negativas públicas',
    question_hint: '¿Miden de alguna forma la satisfacción de sus pacientes después de cada visita?',
    focus: 4
  },

  // ============================================================
  // CC - Los historiales son un caos
  // ============================================================

  'CC01': {
    cluster: 'CC-EXPEDIENTES',
    title: 'Expedientes clínicos en papel',
    signals: ['todavía usamos carpetas de papel para los expedientes', 'el archivo de pacientes ocupa muchísimo espacio físico', 'buscar un expediente nos toma mucho tiempo entre tantas carpetas'],
    impact: 'Acceso lento a información clínica crítica que retrasa la atención y ocupa espacio valioso',
    question_hint: '¿Los expedientes de sus pacientes están en papel o en formato digital?',
    focus: 1
  },
  'CC02': {
    cluster: 'CC-FOTOS',
    title: 'Fotos clínicas en el teléfono personal del doctor',
    signals: ['las fotos de los pacientes están en el celular del doctor', 'si el doctor cambia de teléfono perdemos las fotos', 'no tenemos un lugar centralizado para guardar las fotos clínicas'],
    impact: 'Riesgo de privacidad, pérdida de evidencia clínica y problemas legales por fotos en dispositivos personales',
    question_hint: '¿Dónde almacenan las fotografías clínicas de los pacientes?',
    focus: 1
  },
  'CC03': {
    cluster: 'CC-CENTRALIZACION',
    title: 'Información del paciente dispersa en múltiples lugares',
    signals: ['parte del historial está en papel, parte en la computadora y parte en WhatsApp', 'cada doctor tiene su propia forma de guardar la información', 'no tenemos una sola fuente de verdad del paciente'],
    impact: 'Visión incompleta del paciente que lleva a decisiones clínicas sin toda la información disponible',
    question_hint: '¿La información de cada paciente está toda en un solo lugar o repartida en varios sistemas?',
    focus: 1
  },
  'CC04': {
    cluster: 'CC-EXPEDIENTES',
    title: 'No se encuentra el historial cuando se necesita',
    signals: ['el paciente llega y no encontramos su expediente a tiempo', 'hemos perdido expedientes completos', 'a veces atendemos sin poder revisar el historial previo'],
    impact: 'Atención clínica comprometida por falta de acceso a antecedentes, con riesgo de errores médicos',
    question_hint: '¿Les ha pasado que no encuentran el expediente de un paciente cuando llega a consulta?',
    focus: 2
  },
  'CC05': {
    cluster: 'CC-FOTOS',
    title: 'Fotos de antes y después sin organizar',
    signals: ['tenemos fotos pero no están vinculadas al paciente', 'no podemos mostrar la evolución del tratamiento con fotos', 'las fotos de antes y después están todas revueltas'],
    impact: 'Pérdida de herramienta comercial poderosa y falta de documentación de resultados clínicos',
    question_hint: '¿Pueden acceder fácilmente a las fotos de antes y después de cada paciente?',
    focus: 3
  },
  'CC06': {
    cluster: 'CC-EXPEDIENTES',
    title: 'Notas clínicas ilegibles o incompletas',
    signals: ['la letra del doctor no se entiende en las notas', 'las notas clínicas están incompletas o con abreviaturas que nadie más entiende', 'si otro doctor ve al paciente no entiende las notas del anterior'],
    impact: 'Continuidad de atención comprometida cuando otro profesional necesita interpretar notas previas',
    question_hint: '¿Otro doctor de la clínica podría entender las notas clínicas de un colega sin problemas?',
    focus: 3
  },
  'CC07': {
    cluster: 'CC-CENTRALIZACION',
    title: 'Sin línea de tiempo del tratamiento',
    signals: ['no puedo ver la secuencia de todo lo que le hemos hecho a un paciente', 'no hay un historial cronológico claro de cada paciente', 'es difícil saber qué tratamiento se hizo primero y cuál después'],
    impact: 'Falta de contexto temporal que dificulta la planificación de tratamientos secuenciales',
    question_hint: '¿Pueden ver de un vistazo toda la historia de tratamientos de un paciente en orden cronológico?',
    focus: 4
  },
  'CC08': {
    cluster: 'CC-CENTRALIZACION',
    title: 'Sistemas diferentes para cada doctor o especialidad',
    signals: ['el dentista usa un software, el dermatólogo otro y el cirujano una libreta', 'cada especialista tiene su propio sistema y no se hablan entre sí', 'no hay un sistema unificado para toda la clínica'],
    impact: 'Silos de información que impiden una visión integral del paciente y generan ineficiencias operativas',
    question_hint: '¿Todos los profesionales de la clínica usan el mismo sistema para registrar información?',
    focus: 2
  },
  'CC09': {
    cluster: 'CC-EXPEDIENTES',
    title: 'Sin alertas de alergias o medicamentos',
    signals: ['no tenemos un sistema que nos avise si el paciente es alérgico', 'las alergias están anotadas en alguna parte del expediente pero no saltan a la vista', 'hemos tenido sustos porque no teníamos visible la información de alergias'],
    impact: 'Riesgo clínico grave por falta de alertas visibles sobre contraindicaciones y alergias',
    question_hint: '¿Tienen algún sistema de alerta que avise sobre alergias o medicamentos del paciente antes de un procedimiento?',
    focus: 1
  },
  'CC10': {
    cluster: 'CC-EXPEDIENTES',
    title: 'Consentimientos informados extraviados',
    signals: ['no encontramos el consentimiento firmado de un paciente', 'los consentimientos están en papel y a veces se pierden', 'no tenemos respaldo digital de los documentos legales firmados'],
    impact: 'Vulnerabilidad legal crítica ante reclamaciones por falta de documentación de consentimiento',
    question_hint: '¿Podrían localizar en menos de un minuto el consentimiento firmado de cualquier paciente?',
    focus: 2
  },

  // ============================================================
  // CD - No sé qué tratamientos son rentables
  // ============================================================

  'CD01': {
    cluster: 'CD-RENTABILIDAD',
    title: 'Desconocimiento del margen por servicio',
    signals: ['no sé cuánto gano realmente con cada tratamiento', 'cobro lo que cobran los demás pero no sé si me sale rentable', 'nunca he calculado el margen real de cada servicio que ofrezco'],
    impact: 'Servicios que parecen populares pueden estar generando pérdidas sin que la clínica lo sepa',
    question_hint: '¿Conocen el margen de ganancia real de cada tratamiento que ofrecen?',
    focus: 1
  },
  'CD02': {
    cluster: 'CD-COSTOS',
    title: 'Costos ocultos no contemplados en el precio',
    signals: ['no incluyo el costo de materiales desechables en el cálculo', 'el tiempo del doctor no lo valoro bien al poner precio', 'hay costos que no veo como la electricidad de los equipos o la amortización'],
    impact: 'Márgenes reales menores a los estimados por costos no visibilizados en la estructura de precios',
    question_hint: '¿Incluyen todos los costos indirectos cuando calculan el precio de un tratamiento?',
    focus: 2
  },
  'CD03': {
    cluster: 'CD-SERVICIOS',
    title: 'Tratamientos con precio por debajo del costo real',
    signals: ['sospecho que algunos tratamientos me cuestan más de lo que cobro', 'puse precios bajos para atraer pacientes y ya no puedo subirlos', 'hay servicios que siento que no me dejan nada'],
    impact: 'Pérdidas directas en cada procedimiento subvaluado que erosionan la rentabilidad general',
    question_hint: '¿Han revisado si alguno de sus tratamientos se cobra por debajo de lo que realmente cuesta ofrecerlo?',
    focus: 1
  },
  'CD04': {
    cluster: 'CD-SERVICIOS',
    title: 'Servicios en el menú que nadie solicita',
    signals: ['tengo tratamientos en la carta que casi nunca piden', 'invertí en equipo para un servicio que no tiene demanda', 'hay servicios que ofrezco pero no sé ni cómo promocionarlos'],
    impact: 'Inversión en capacitación, equipos e insumos para servicios que no generan retorno',
    question_hint: '¿Tienen tratamientos en su oferta que rara vez se realizan?',
    focus: 4
  },
  'CD05': {
    cluster: 'CD-RENTABILIDAD',
    title: 'Sin análisis de rentabilidad por procedimiento',
    signals: ['no tengo reportes de qué tratamientos son los más rentables', 'no sé qué procedimiento debería promocionar más', 'tomo decisiones de qué ofrecer por intuición, no por datos'],
    impact: 'Decisiones estratégicas sobre el mix de servicios basadas en intuición en vez de datos financieros',
    question_hint: '¿Pueden generar un reporte que muestre la rentabilidad de cada procedimiento?',
    focus: 2
  },
  'CD06': {
    cluster: 'CD-RENTABILIDAD',
    title: 'Tratamientos populares con bajo margen',
    signals: ['lo que más hago es lo que menos me deja', 'el tratamiento estrella tiene mucha demanda pero poca ganancia', 'lleno la agenda con procedimientos que no generan buen margen'],
    impact: 'Alta ocupación con baja rentabilidad que impide crecer financieramente a pesar de tener demanda',
    question_hint: '¿Sus tratamientos más solicitados son también los más rentables?',
    focus: 2
  },
  'CD07': {
    cluster: 'CD-SERVICIOS',
    title: 'Paquetes de tratamiento sin optimizar',
    signals: ['ofrezco paquetes pero no sé si me convienen económicamente', 'los combos los armo sin calcular bien los números', 'no sé si mis paquetes atraen o me hacen perder dinero'],
    impact: 'Paquetes que subsidian tratamientos no rentables o que no maximizan el valor del ticket promedio',
    question_hint: '¿Los paquetes o combos que ofrecen están diseñados con un análisis de rentabilidad?',
    focus: 5
  },
  'CD08': {
    cluster: 'CD-COSTOS',
    title: 'Tiempo del especialista mal aprovechado',
    signals: ['mi especialista más caro hace procedimientos que podría hacer alguien de menor costo', 'el doctor pierde tiempo en cosas administrativas en vez de atender', 'no optimizo las horas del personal más valioso'],
    impact: 'Costo de oportunidad alto por especialistas dedicados a tareas que no requieren su nivel de expertise',
    question_hint: '¿Sus especialistas dedican todo su tiempo a procedimientos que solo ellos pueden hacer?',
    focus: 3
  },
  'CD09': {
    cluster: 'CD-COSTOS',
    title: 'Sin estrategia de precios definida',
    signals: ['los precios los puse hace años y nunca los revisé', 'no tengo claro cómo debería fijar mis precios', 'subo precios cuando me acuerdo o cuando suben los costos'],
    impact: 'Precios desalineados del mercado y del valor real que pueden ahuyentar pacientes o dejar dinero en la mesa',
    question_hint: '¿Cuándo fue la última vez que revisaron su estrategia de precios de forma integral?',
    focus: 3
  },
  'CD10': {
    cluster: 'CD-COSTOS',
    title: 'Precios de la competencia desconocidos',
    signals: ['no sé cuánto cobra la competencia por los mismos servicios', 'no tengo idea de cómo me posiciono en precio frente a otros', 'me entero de los precios de la competencia solo cuando un paciente me lo dice'],
    impact: 'Posicionamiento de precio a ciegas que puede resultar en ser demasiado caro o demasiado barato',
    question_hint: '¿Tienen un mapeo actualizado de los precios de sus principales competidores?',
    focus: 6
  },

  // ============================================================
  // CE - La facturación me quita tiempo
  // ============================================================

  'CE01': {
    cluster: 'CE-FACTURACION',
    title: 'Facturación completamente manual',
    signals: ['hago las facturas a mano o en Word una por una', 'cada factura me toma varios minutos generarla', 'la facturación es de lo que más tiempo me consume en el día'],
    impact: 'Horas productivas del personal administrativo consumidas en tareas repetitivas de facturación',
    question_hint: '¿Cuánto tiempo dedican diariamente a generar facturas?',
    focus: 1
  },
  'CE02': {
    cluster: 'CE-FACTURACION',
    title: 'Errores frecuentes en la facturación',
    signals: ['nos equivocamos en los montos o en los datos del paciente al facturar', 'hemos tenido que rehacer facturas por errores', 'los errores de facturación generan quejas de los pacientes'],
    impact: 'Retrabajo administrativo, insatisfacción del paciente y posibles problemas fiscales por facturas incorrectas',
    question_hint: '¿Con qué frecuencia tienen que corregir o anular facturas por errores?',
    focus: 2
  },
  'CE03': {
    cluster: 'CE-PENDIENTES',
    title: 'Pagos pendientes sin seguimiento',
    signals: ['hay pacientes que me deben y no llevo un control claro', 'no sé exactamente cuánto me deben en total', 'se me olvida cobrar saldos pendientes'],
    impact: 'Cuentas por cobrar crecientes que afectan el flujo de caja y pueden convertirse en deuda incobrable',
    question_hint: '¿Tienen visibilidad en todo momento del total de pagos pendientes por cobrar?',
    focus: 1
  },
  'CE04': {
    cluster: 'CE-COBROS',
    title: 'Cuadre de caja diario con problemas',
    signals: ['la caja nunca cuadra al final del día', 'no sabemos dónde se pierden las diferencias de caja', 'el cierre de caja nos toma demasiado tiempo'],
    impact: 'Fugas de efectivo no detectadas y tiempo excesivo en conciliación diaria de caja',
    question_hint: '¿El cuadre de caja al final del día les resulta rápido y preciso o suelen tener diferencias?',
    focus: 3
  },
  'CE05': {
    cluster: 'CE-COBROS',
    title: 'Reclamaciones a aseguradoras retrasadas',
    signals: ['los cobros a los seguros tardan meses en procesarse', 'no hacemos seguimiento a las reclamaciones pendientes con aseguradoras', 'a veces perdemos dinero porque se pasa el plazo para reclamar al seguro'],
    impact: 'Flujo de caja comprometido por cobros a aseguradoras que se demoran o se pierden por falta de seguimiento',
    question_hint: '¿Cómo gestionan el seguimiento de reclamaciones con las aseguradoras?',
    focus: 3
  },
  'CE06': {
    cluster: 'CE-COBROS',
    title: 'Pagos fraccionados difíciles de rastrear',
    signals: ['cuando el paciente paga en partes pierdo el hilo de cuánto ha pagado', 'los pagos a plazos los llevo en una libreta y se me confunden', 'no tengo un sistema para controlar los financiamientos internos'],
    impact: 'Pérdida de trazabilidad de pagos parciales que genera confusión y saldos incorrectos',
    question_hint: '¿Ofrecen pagos fraccionados y cómo controlan los saldos pendientes de cada paciente?',
    focus: 4
  },
  'CE07': {
    cluster: 'CE-FACTURACION',
    title: 'Recibos y comprobantes no automatizados',
    signals: ['los recibos los hago a mano y a veces no los doy', 'el paciente me pide comprobante y tardo en generarlo', 'no siempre entrego recibo de pago al paciente'],
    impact: 'Falta de documentación de pagos que genera desconfianza y problemas en caso de disputas',
    question_hint: '¿Entregan comprobante de pago automático a cada paciente después de cobrar?',
    focus: 4
  },
  'CE08': {
    cluster: 'CE-PENDIENTES',
    title: 'Cierre de mes caótico',
    signals: ['el final de mes es una locura para cuadrar todo', 'tardo días en hacer el cierre mensual de cuentas', 'cada cierre de mes descubro cosas que no cuadran'],
    impact: 'Información financiera tardía e inexacta que impide tomar decisiones oportunas de gestión',
    question_hint: '¿Cuánto tiempo les lleva hacer el cierre contable de cada mes?',
    focus: 2
  },
  'CE09': {
    cluster: 'CE-PENDIENTES',
    title: 'Reportes fiscales preparados manualmente',
    signals: ['preparar la declaración de impuestos es un suplicio', 'junto todas las facturas al final del período y es un caos', 'mi contador me pide información que me cuesta mucho reunir'],
    impact: 'Riesgo de errores fiscales, multas y tiempo excesivo dedicado a compilar información para obligaciones tributarias',
    question_hint: '¿Cuánto esfuerzo les requiere preparar la información fiscal para su contador?',
    focus: 5
  },
  'CE10': {
    cluster: 'CE-COBROS',
    title: 'Fugas de ingreso no detectadas',
    signals: ['sospecho que se me escapan cobros pero no puedo probarlo', 'a veces atendemos y no estoy seguro de que se cobró', 'no tengo cruzada la información de servicios realizados con cobros efectuados'],
    impact: 'Ingresos que se pierden por servicios prestados y no cobrados o cobrados incorrectamente',
    question_hint: '¿Pueden verificar que cada servicio realizado fue efectivamente cobrado?',
    focus: 1
  },

  // ============================================================
  // CF - El stock de insumos falla
  // ============================================================

  'CF01': {
    cluster: 'CF-INVENTARIO',
    title: 'Descubrir falta de materiales el día del procedimiento',
    signals: ['llegó el paciente y no teníamos el material necesario', 'a veces descubrimos que falta algo justo antes de empezar', 'hemos tenido que reprogramar procedimientos por falta de insumos'],
    impact: 'Cancelación de procedimientos, pérdida de ingresos y mala imagen ante el paciente',
    question_hint: '¿Les ha pasado que descubren que falta un insumo justo cuando lo necesitan para un procedimiento?',
    focus: 1
  },
  'CF02': {
    cluster: 'CF-ALERTAS',
    title: 'Sin alertas de stock bajo',
    signals: ['no me avisa nada cuando algo está por acabarse', 'me entero de que falta material cuando ya se terminó', 'no tengo mínimos configurados para los insumos'],
    impact: 'Reacción tardía ante el agotamiento de insumos que genera interrupciones en la operación',
    question_hint: '¿Tienen algún sistema que les avise automáticamente cuando un insumo está por agotarse?',
    focus: 1
  },
  'CF03': {
    cluster: 'CF-CADUCIDAD',
    title: 'Productos caducados utilizados o desperdiciados',
    signals: ['hemos encontrado productos vencidos en el almacén', 'no revisamos fechas de caducidad regularmente', 'hemos tenido que tirar material porque se venció'],
    impact: 'Riesgo clínico por uso de productos vencidos y pérdida económica por material desperdiciado',
    question_hint: '¿Tienen control de fechas de caducidad de sus insumos y medicamentos?',
    focus: 1
  },
  'CF04': {
    cluster: 'CF-INVENTARIO',
    title: 'Sin seguimiento de consumo por procedimiento',
    signals: ['no sé cuánto material gasta cada procedimiento realmente', 'no puedo calcular el costo real de insumos por tratamiento', 'cada doctor usa cantidades diferentes del mismo material'],
    impact: 'Imposibilidad de costear correctamente los procedimientos y detectar usos excesivos de materiales',
    question_hint: '¿Saben exactamente cuánto material se consume en cada tipo de procedimiento?',
    focus: 3
  },
  'CF05': {
    cluster: 'CF-INVENTARIO',
    title: 'Sobre-pedidos que generan desperdicio',
    signals: ['pedimos de más por miedo a quedarnos sin nada y luego se vence', 'tenemos material acumulado que no usamos', 'el almacén está lleno de cosas que compramos de más'],
    impact: 'Capital inmovilizado en inventario excesivo con riesgo de caducidad y deterioro',
    question_hint: '¿Alguna vez han tenido que desechar materiales porque pidieron más de lo necesario?',
    focus: 4
  },
  'CF06': {
    cluster: 'CF-INVENTARIO',
    title: 'Gestión de proveedores completamente manual',
    signals: ['los pedidos a proveedores los hago por teléfono o WhatsApp sin registro', 'no comparo precios entre proveedores de forma sistemática', 'no llevo historial de pedidos ni de entregas'],
    impact: 'Oportunidades de ahorro perdidas y falta de trazabilidad en la cadena de suministro',
    question_hint: '¿Cómo gestionan la relación y los pedidos con sus proveedores de insumos?',
    focus: 5
  },
  'CF07': {
    cluster: 'CF-CADUCIDAD',
    title: 'Sin trazabilidad de lotes',
    signals: ['no registro el lote de los productos que uso en cada paciente', 'si hubiera un retiro de producto no sabría qué pacientes fueron afectados', 'no puedo rastrear un producto desde la compra hasta el uso'],
    impact: 'Riesgo legal y clínico por falta de trazabilidad en caso de incidentes con lotes defectuosos',
    question_hint: '¿Pueden rastrear el número de lote de un producto utilizado en un paciente específico?',
    focus: 6
  },
  'CF08': {
    cluster: 'CF-ALERTAS',
    title: 'Compras de emergencia a precio premium',
    signals: ['cuando falta algo salimos corriendo a comprarlo donde sea y a cualquier precio', 'las compras urgentes nos cuestan mucho más', 'gastamos de más por no planificar las compras con tiempo'],
    impact: 'Sobrecostos evitables por compras urgentes que encarecen la operación y reducen márgenes',
    question_hint: '¿Con qué frecuencia tienen que hacer compras de emergencia de insumos a último momento?',
    focus: 2
  },
  'CF09': {
    cluster: 'CF-INVENTARIO',
    title: 'Sin auditorías periódicas de inventario',
    signals: ['nunca hacemos conteo físico del inventario', 'no sé si lo que dice el sistema coincide con lo que hay en el almacén', 'podrían faltar cosas y no me daría cuenta'],
    impact: 'Discrepancias entre inventario teórico y real que encubren mermas, robos o errores de registro',
    question_hint: '¿Cada cuánto realizan un conteo físico de inventario para verificar existencias?',
    focus: 5
  },
  'CF10': {
    cluster: 'CF-CADUCIDAD',
    title: 'Almacén desorganizado y sin clasificar',
    signals: ['el almacén es un desorden, nadie encuentra nada rápido', 'los materiales no tienen un lugar fijo asignado', 'perdemos tiempo buscando cosas en el almacén'],
    impact: 'Tiempo perdido en búsqueda de materiales y riesgo de usar productos equivocados',
    question_hint: '¿Su almacén de insumos está organizado de manera que cualquiera pueda encontrar lo que necesita rápidamente?',
    focus: 4
  },

  // ============================================================
  // CG - No tengo presencia digital
  // ============================================================

  'CG01': {
    cluster: 'CG-WEB',
    title: 'Sin página web profesional',
    signals: ['no tenemos página web de la clínica', 'nuestra web tiene años sin actualizarse', 'la web la hice yo con un template y se ve poco profesional'],
    impact: 'Falta de credibilidad digital y pérdida de pacientes que buscan información online antes de elegir clínica',
    question_hint: '¿Tienen una página web actualizada y profesional para la clínica?',
    focus: 2
  },
  'CG02': {
    cluster: 'CG-REDES',
    title: 'Redes sociales abandonadas o sin estrategia',
    signals: ['abrimos Instagram pero no publicamos casi nunca', 'publico cuando me acuerdo sin ningún plan', 'las redes las lleva alguien sin experiencia en salud'],
    impact: 'Presencia digital inconsistente que proyecta inactividad y resta confianza al potencial paciente',
    question_hint: '¿Publican contenido en redes sociales de forma regular y planificada?',
    focus: 3
  },
  'CG03': {
    cluster: 'CG-WEB',
    title: 'Sin sistema de reservas online',
    signals: ['el paciente no puede agendar en línea, tiene que llamar', 'nos piden poder reservar desde la web y no se puede', 'perdemos pacientes jóvenes porque quieren agendar en línea'],
    impact: 'Barrera de entrada para pacientes digitales que prefieren agendar fuera de horario de oficina',
    question_hint: '¿Sus pacientes pueden agendar una cita directamente desde internet sin tener que llamar?',
    focus: 2
  },
  'CG04': {
    cluster: 'CG-REDES',
    title: 'Reseñas negativas en Google sin responder',
    signals: ['tenemos reseñas malas en Google y nunca contestamos', 'no monitoreamos lo que dicen de nosotros en internet', 'un paciente puso una queja en Google y no supimos hasta meses después'],
    impact: 'Reputación online deteriorada que disuade a nuevos pacientes de agendar con la clínica',
    question_hint: '¿Responden a todas las reseñas que reciben en Google, tanto positivas como negativas?',
    focus: 1
  },
  'CG05': {
    cluster: 'CG-CAPTACION',
    title: 'Sin estrategia de marketing digital',
    signals: ['no invertimos nada en publicidad digital', 'no sé qué es Google Ads ni cómo funcionaría para mi clínica', 'todo nuestro marketing es el boca a boca'],
    impact: 'Dependencia total del boca a boca que limita el crecimiento y la captación de nuevos segmentos',
    question_hint: '¿Invierten en algún tipo de publicidad o marketing digital para atraer nuevos pacientes?',
    focus: 3
  },
  'CG06': {
    cluster: 'CG-CAPTACION',
    title: 'No atraer pacientes nuevos por canales digitales',
    signals: ['los pacientes nuevos solo llegan por recomendación, nunca por internet', 'no sé cuántos pacientes nos encuentran en línea', 'la web no nos genera ni una sola cita'],
    impact: 'Canal de captación digital inactivo que deja todo el crecimiento en manos del boca a boca',
    question_hint: '¿Saben cuántos pacientes nuevos llegan a través de canales digitales cada mes?',
    focus: 2
  },
  'CG07': {
    cluster: 'CG-WEB',
    title: 'Posicionamiento SEO inexistente',
    signals: ['si busco mi clínica en Google no aparece', 'no salimos en los primeros resultados cuando buscan nuestra especialidad', 'no sé qué es el SEO ni cómo aplicarlo'],
    impact: 'Invisibilidad en buscadores que entrega los pacientes potenciales directamente a la competencia',
    question_hint: '¿Aparece su clínica en los primeros resultados de Google cuando alguien busca su especialidad en su zona?',
    focus: 4
  },
  'CG08': {
    cluster: 'CG-CAPTACION',
    title: 'Competidores dominan la presencia online local',
    signals: ['la competencia sale primero que yo en Google', 'otras clínicas tienen mejor presencia en redes que nosotros', 'los competidores hacen publicidad digital y nosotros no'],
    impact: 'Cuota de mercado cedida a competidores con mejor estrategia digital que capturan la demanda online',
    question_hint: '¿Sienten que sus competidores tienen una presencia digital más fuerte que la suya?',
    focus: 3
  },
  'CG09': {
    cluster: 'CG-REDES',
    title: 'Sin estrategia de contenido educativo',
    signals: ['no publicamos contenido que eduque a los pacientes sobre tratamientos', 'no sabemos qué tipo de contenido crear para redes', 'quisiera hacer videos o publicaciones pero no sé de qué hablar'],
    impact: 'Oportunidad desaprovechada de posicionarse como referente y generar confianza antes de la primera visita',
    question_hint: '¿Publican contenido educativo que ayude a los pacientes a entender los tratamientos que ofrecen?',
    focus: 6
  },
  'CG10': {
    cluster: 'CG-CAPTACION',
    title: 'Google My Business sin optimizar',
    signals: ['nuestro perfil de Google no tiene fotos ni información completa', 'no actualizo los horarios ni la información de Google', 'no sé bien cómo funciona la ficha de Google de mi negocio'],
    impact: 'Ficha de Google incompleta que reduce visibilidad local y no convierte búsquedas en visitas',
    question_hint: '¿Su ficha de Google My Business tiene fotos actualizadas, horarios correctos y toda la información completa?',
    focus: 2
  },

  // ============================================================
  // CH - La comunicación con el paciente falla
  // ============================================================

  'CH01': {
    cluster: 'CH-CONFIRMACIONES',
    title: 'Sin confirmación automática de citas',
    signals: ['no enviamos confirmación cuando el paciente agenda', 'el paciente no recibe ningún mensaje confirmando su cita', 'la confirmación la hacemos llamando uno por uno y no da tiempo'],
    impact: 'Incertidumbre del paciente que aumenta la tasa de no-shows y genera llamadas innecesarias a la clínica',
    question_hint: '¿El paciente recibe una confirmación automática cuando se agenda su cita?',
    focus: 1
  },
  'CH02': {
    cluster: 'CH-PREPARACION',
    title: 'Paciente llega sin preparación previa',
    signals: ['el paciente llega sin hacer el ayuno que le indicamos', 'no trae la documentación que necesitamos para atenderlo', 'llegan sin saber qué deben hacer antes del procedimiento'],
    impact: 'Procedimientos cancelados o retrasados por pacientes no preparados, con pérdida de tiempo para ambas partes',
    question_hint: '¿Les pasa que pacientes llegan sin haberse preparado adecuadamente para su procedimiento?',
    focus: 1
  },
  'CH03': {
    cluster: 'CH-POSTRATA',
    title: 'Instrucciones post-procedimiento no enviadas',
    signals: ['las indicaciones post-tratamiento se las decimos de palabra y las olvidan', 'no mandamos las instrucciones de cuidado por escrito', 'los pacientes llaman después preguntando qué deben hacer porque no se acuerdan'],
    impact: 'Complicaciones post-tratamiento evitables y sobrecarga de llamadas al consultorio por dudas',
    question_hint: '¿Envían instrucciones de cuidado post-procedimiento por escrito al paciente?',
    focus: 1
  },
  'CH04': {
    cluster: 'CH-CONFIRMACIONES',
    title: 'Recordatorios manuales uno por uno',
    signals: ['la recepcionista se pasa horas llamando para recordar citas', 'mandamos WhatsApp uno por uno para confirmar', 'no nos da tiempo de recordar a todos los pacientes del día siguiente'],
    impact: 'Tiempo administrativo excesivo en tarea repetitiva que debería ser automatizada',
    question_hint: '¿Cuánto tiempo dedica su personal a enviar recordatorios de citas manualmente?',
    focus: 2
  },
  'CH05': {
    cluster: 'CH-PREPARACION',
    title: 'Sin cuestionario previo a la visita',
    signals: ['el paciente llega y ahí empezamos a preguntar todo desde cero', 'no enviamos formularios previos para ahorrar tiempo en consulta', 'la primera parte de la cita se va en recopilar información básica'],
    impact: 'Tiempo de consulta desperdiciado en recopilación de datos que podrían obtenerse antes de la visita',
    question_hint: '¿Envían algún cuestionario o formulario al paciente antes de su visita?',
    focus: 3
  },
  'CH06': {
    cluster: 'CH-PREPARACION',
    title: 'Pacientes olvidan instrucciones de preparación',
    signals: ['les dijimos que vinieran en ayunas y no lo hicieron', 'se les olvida traer las radiografías o estudios previos', 'no suspendieron el medicamento que les indicamos antes del procedimiento'],
    impact: 'Procedimientos postpuestos por preparación inadecuada, con impacto en agenda y facturación del día',
    question_hint: '¿Con qué frecuencia tienen que reprogramar procedimientos porque el paciente no siguió las instrucciones de preparación?',
    focus: 2
  },
  'CH07': {
    cluster: 'CH-CONFIRMACIONES',
    title: 'Sin automatización de WhatsApp Business',
    signals: ['usamos WhatsApp normal, no el de empresa', 'no tenemos respuestas automáticas ni catálogo en WhatsApp', 'contestamos los mensajes de WhatsApp cuando podemos y a veces se nos pasan'],
    impact: 'Canal de comunicación principal sin profesionalizar que genera respuestas tardías y oportunidades perdidas',
    question_hint: '¿Utilizan WhatsApp Business con respuestas automáticas y catálogo de servicios?',
    focus: 4
  },
  'CH08': {
    cluster: 'CH-POSTRATA',
    title: 'Comunicación solo reactiva, nunca proactiva',
    signals: ['solo hablamos con el paciente cuando él nos contacta', 'no iniciamos nosotros el contacto con el paciente', 'si el paciente no llama, no sabemos nada de él'],
    impact: 'Relación pasiva con el paciente que debilita el vínculo y reduce la percepción de cuidado personalizado',
    question_hint: '¿Inician ustedes el contacto con el paciente o solo responden cuando él se comunica?',
    focus: 3
  },
  'CH09': {
    cluster: 'CH-POSTRATA',
    title: 'Sin comunicación de valor entre visitas',
    signals: ['entre cita y cita no tenemos ningún contacto con el paciente', 'no enviamos tips, consejos ni información relevante', 'el paciente solo escucha de nosotros cuando tiene cita'],
    impact: 'Oportunidad perdida de reforzar la relación, educar al paciente y generar demanda de servicios complementarios',
    question_hint: '¿Mantienen algún tipo de comunicación educativa o de valor con los pacientes entre sus visitas?',
    focus: 7
  },
  'CH10': {
    cluster: 'CH-CONFIRMACIONES',
    title: 'Ventanas de comunicación desaprovechadas',
    signals: ['no aprovechamos el momento post-cita para pedir una reseña', 'no comunicamos ofertas cuando el paciente está más receptivo', 'no tenemos automatizado ningún mensaje en momentos clave del recorrido del paciente'],
    impact: 'Momentos de mayor receptividad del paciente no aprovechados para fidelización, ventas cruzadas y reputación',
    question_hint: '¿Tienen mensajes automatizados en momentos clave como post-cita, cumpleaños o aniversario de primera visita?',
    focus: 5
  },

  // ============================================================
  // CI - Las quejas me sorprenden
  // ============================================================

  'CI01': {
    cluster: 'CI-SATISFACCION',
    title: 'Sin encuestas de satisfacción',
    signals: ['no hacemos encuestas a los pacientes', 'no sabemos si el paciente quedó contento', 'nunca preguntamos cómo fue su experiencia'],
    impact: 'Sin datos de satisfacción es imposible mejorar la experiencia ni detectar problemas antes de perder pacientes',
    question_hint: '¿Cómo miden la satisfacción de sus pacientes después de cada visita?',
    focus: 3
  },
  'CI02': {
    cluster: 'CI-REVIEWS',
    title: 'Reseñas negativas descubiertas tarde',
    signals: ['nos enteramos de una reseña mala semanas después', 'un paciente puso algo negativo en Google y no lo vimos', 'no monitoreamos lo que dicen de nosotros online'],
    impact: 'Las reseñas negativas sin respuesta alejan a potenciales pacientes y dañan la reputación acumulada durante años',
    question_hint: '¿Cada cuánto revisan las reseñas que dejan los pacientes en Google u otras plataformas?',
    focus: 3
  },
  'CI03': {
    cluster: 'CI-NPS',
    title: 'No se mide NPS ni lealtad',
    signals: ['no tenemos idea de cuántos pacientes nos recomendarían', 'no medimos lealtad del paciente', 'no sabemos quiénes son promotores y quiénes detractores'],
    impact: 'Sin medir la lealtad real no se puede predecir el crecimiento orgánico ni identificar riesgos de fuga masiva',
    question_hint: '¿Saben qué porcentaje de sus pacientes los recomendaría activamente a familiares o amigos?',
    focus: 2
  },
  'CI04': {
    cluster: 'CI-REVIEWS',
    title: 'Quejas solo por Google y redes sociales',
    signals: ['los pacientes se quejan directo en Google en vez de decirnos', 'nos enteramos del problema por un comentario en redes', 'no tenemos un canal interno para quejas'],
    impact: 'Cuando la queja llega primero a plataformas públicas, el daño reputacional ya está hecho y es difícil de revertir',
    question_hint: '¿Los pacientes tienen un canal fácil para compartir quejas directamente con ustedes antes de ir a redes?',
    focus: 3
  },
  'CI05': {
    cluster: 'CI-SATISFACCION',
    title: 'No se recoge feedback post-visita',
    signals: ['el paciente se va y no le preguntamos nada', 'no hay seguimiento después de la cita', 'nunca contactamos al paciente tras su tratamiento'],
    impact: 'Se pierden oportunidades de detectar insatisfacción temprana, resolver problemas y convertir experiencias neutras en positivas',
    question_hint: '¿Qué pasa después de que el paciente termina su cita y sale de la clínica?',
    focus: 2
  },
  'CI06': {
    cluster: 'CI-SATISFACCION',
    title: 'No se identifica pacientes insatisfechos antes de que se vayan',
    signals: ['el paciente se fue molesto y nadie se dio cuenta', 'no detectamos señales de incomodidad durante la visita', 'no tenemos forma de saber si alguien se fue insatisfecho'],
    impact: 'Un paciente insatisfecho que se va sin decir nada nunca vuelve y además genera boca a boca negativo con su entorno',
    question_hint: '¿El equipo tiene algún mecanismo para detectar cuando un paciente está incómodo o insatisfecho durante su visita?',
    focus: 3
  },
  'CI07': {
    cluster: 'CI-SATISFACCION',
    title: 'Sin proceso de recuperación de servicio',
    signals: ['cuando hay un problema no sabemos cómo resolverlo formalmente', 'no tenemos protocolo para pacientes insatisfechos', 'cada quien maneja las quejas como puede'],
    impact: 'Sin un proceso estructurado de recuperación, los errores se repiten y cada queja se maneja improvisadamente con resultados inconsistentes',
    question_hint: '¿Qué protocolo siguen cuando un paciente manifiesta una queja o insatisfacción con el servicio?',
    focus: 3
  },
  'CI08': {
    cluster: 'CI-REVIEWS',
    title: 'Daño reputacional sin enterarse',
    signals: ['no sabemos qué imagen tenemos en internet', 'alguien me dijo que hay comentarios negativos y no los había visto', 'nuestra reputación online es un misterio'],
    impact: 'La reputación digital es el primer filtro que usan los pacientes nuevos; el daño invisible impide el crecimiento sin que la clínica sepa por qué',
    question_hint: '¿Tienen visibilidad en tiempo real de lo que se dice sobre la clínica en plataformas digitales?',
    focus: 2
  },
  'CI09': {
    cluster: 'CI-NPS',
    title: 'Sin benchmarking contra competencia',
    signals: ['no sabemos cómo nos comparamos con otras clínicas', 'no tenemos idea si nuestro servicio es mejor o peor que la competencia', 'nunca hemos analizado qué hacen otros'],
    impact: 'Sin referencia competitiva la clínica puede estar perdiendo pacientes ante competidores que ofrecen mejor experiencia sin saberlo',
    question_hint: '¿Han comparado alguna vez la experiencia de sus pacientes con lo que ofrecen otras clínicas de la zona?',
    focus: 1
  },
  'CI10': {
    cluster: 'CI-NPS',
    title: 'El equipo desconoce expectativas del paciente',
    signals: ['no sabemos qué esperan los pacientes de nosotros', 'el equipo atiende sin saber qué valora más el paciente', 'nunca hemos preguntado qué es lo más importante para ellos'],
    impact: 'Cuando el equipo no conoce las expectativas, invierte esfuerzo en aspectos que el paciente no valora y descuida los que sí importan',
    question_hint: '¿El equipo sabe cuáles son los tres aspectos que más valoran sus pacientes cuando vienen a la clínica?',
    focus: 2
  },

  // ============================================================
  // CJ - El equipo no sigue protocolos
  // ============================================================

  'CJ01': {
    cluster: 'CJ-PROTOCOLOS',
    title: 'Cada profesional hace las cosas a su manera',
    signals: ['cada doctor tiene su forma de hacer las cosas', 'no hay una forma estándar de trabajar', 'depende de quién te atienda la experiencia es diferente'],
    impact: 'La variabilidad en procesos genera experiencias inconsistentes que confunden al paciente y dificultan el control de calidad',
    question_hint: '¿Los procedimientos clínicos se realizan de la misma forma independientemente del profesional que atienda?',
    focus: 3
  },
  'CJ02': {
    cluster: 'CJ-CHECKLISTS',
    title: 'No existen checklists estandarizados',
    signals: ['no tenemos listas de verificación', 'cada uno se acuerda de lo que puede', 'no hay un checklist antes de empezar un procedimiento'],
    impact: 'Sin checklists se depende de la memoria individual, generando omisiones que pueden afectar la seguridad del paciente',
    question_hint: '¿Utilizan listas de verificación estandarizadas para los procedimientos más frecuentes?',
    focus: 3
  },
  'CJ03': {
    cluster: 'CJ-ESTANDARES',
    title: 'Experiencia del paciente inconsistente',
    signals: ['un día el servicio es excelente y otro día es regular', 'depende de quién esté ese día', 'los pacientes notan diferencias según el turno'],
    impact: 'La inconsistencia erosiona la confianza del paciente y hace imposible construir una marca de calidad predecible',
    question_hint: '¿Los pacientes reciben exactamente la misma experiencia sin importar el día, turno o profesional que los atienda?',
    focus: 3
  },
  'CJ04': {
    cluster: 'CJ-CHECKLISTS',
    title: 'Sin verificación de esterilización',
    signals: ['confiamos en que se esterilizó pero no verificamos', 'no hay registro de ciclos de esterilización', 'la esterilización depende de que alguien se acuerde'],
    impact: 'La falta de verificación de esterilización expone a riesgos de infección cruzada y responsabilidad legal grave',
    question_hint: '¿Cómo verifican y documentan que cada instrumento pasó correctamente por el ciclo de esterilización?',
    focus: 3
  },
  'CJ05': {
    cluster: 'CJ-PROTOCOLOS',
    title: 'Preparación de procedimientos olvidada',
    signals: ['a veces empezamos y falta algo que debíamos preparar', 'el consultorio no estaba listo cuando llegó el paciente', 'nos olvidamos de preparar el material antes del procedimiento'],
    impact: 'La preparación incompleta genera retrasos, improvización durante el procedimiento y una imagen poco profesional ante el paciente',
    question_hint: '¿Alguna vez han tenido que improvisar durante un procedimiento porque faltaba algo que debía estar preparado?',
    focus: 2
  },
  'CJ06': {
    cluster: 'CJ-PROTOCOLOS',
    title: 'Protocolos de higiene no documentados',
    signals: ['los protocolos de limpieza están de palabra', 'no hay un manual de higiene escrito', 'cada auxiliar limpia diferente'],
    impact: 'Sin protocolos documentados no hay base para capacitar, auditar ni demostrar cumplimiento ante una inspección sanitaria',
    question_hint: '¿Los protocolos de higiene y desinfección de la clínica están documentados por escrito y accesibles para todo el equipo?',
    focus: 3
  },
  'CJ07': {
    cluster: 'CJ-ESTANDARES',
    title: 'Sin control de calidad de procesos',
    signals: ['no revisamos si los procesos se hacen bien', 'no hay nadie que supervise la calidad', 'confiamos en que cada uno hace lo correcto'],
    impact: 'Sin control de calidad los errores se normalizan y los estándares se degradan gradualmente sin que nadie lo note',
    question_hint: '¿Quién y cómo verifica que los procesos clínicos y administrativos se están ejecutando según el estándar definido?',
    focus: 2
  },
  'CJ08': {
    cluster: 'CJ-ESTANDARES',
    title: 'Desviaciones de protocolo no detectadas',
    signals: ['no nos damos cuenta cuando alguien se salta un paso', 'las desviaciones pasan desapercibidas', 'solo nos enteramos cuando hay un problema'],
    impact: 'Las desviaciones no detectadas se acumulan hasta convertirse en la nueva norma, alejando la práctica real del estándar deseado',
    question_hint: '¿Cómo detectan cuando un miembro del equipo se desvía del protocolo establecido?',
    focus: 2
  },
  'CJ09': {
    cluster: 'CJ-CHECKLISTS',
    title: 'Sin trazabilidad de auditoría',
    signals: ['no hay registro de quién hizo qué y cuándo', 'si pasa algo no podemos rastrear qué sucedió', 'no dejamos evidencia de los pasos seguidos'],
    impact: 'Sin trazabilidad, ante un incidente es imposible determinar responsabilidades ni implementar mejoras basadas en evidencia',
    question_hint: '¿Si ocurriera un incidente hoy, podrían reconstruir exactamente qué pasos se siguieron y quién los ejecutó?',
    focus: 2
  },
  'CJ10': {
    cluster: 'CJ-PROTOCOLOS',
    title: 'El equipo toma atajos en los procesos',
    signals: ['por rapidez se saltan pasos', 'cuando hay prisa se omiten cosas', 'el equipo busca hacerlo rápido en vez de hacerlo bien'],
    impact: 'Los atajos sistemáticos comprometen la seguridad del paciente y crean una cultura donde la velocidad prima sobre la calidad',
    question_hint: '¿Han detectado que el equipo omite ciertos pasos de los protocolos cuando la clínica está muy ocupada?',
    focus: 3
  },

  // ============================================================
  // CK - No cumplo con normativa
  // ============================================================

  'CK01': {
    cluster: 'CK-CONSENTIMIENTOS',
    title: 'Consentimientos informados sin firmar',
    signals: ['a veces se nos olvida el consentimiento', 'hay pacientes que no firmaron el consentimiento antes del procedimiento', 'los consentimientos están incompletos'],
    impact: 'Un procedimiento sin consentimiento firmado expone a la clínica a demandas legales donde la defensa es prácticamente imposible',
    question_hint: '¿Pueden garantizar que el 100% de sus pacientes tienen el consentimiento informado firmado antes de cada procedimiento?',
    focus: 3
  },
  'CK02': {
    cluster: 'CK-DATOS',
    title: 'Datos de pacientes sin protección adecuada',
    signals: ['los datos de pacientes están en archivos sin contraseña', 'no cumplimos con la ley de protección de datos', 'cualquiera puede acceder a la información de los pacientes'],
    impact: 'Una brecha de datos personales de salud puede resultar en multas severas, demandas colectivas y pérdida irreparable de confianza',
    question_hint: '¿Cómo protegen los datos personales y clínicos de sus pacientes según la normativa de protección de datos vigente?',
    focus: 3
  },
  'CK03': {
    cluster: 'CK-INSPECCION',
    title: 'Documentación incompleta para inspecciones',
    signals: ['si viene una inspección no tendríamos todo en orden', 'nos falta documentación que deberíamos tener', 'no estamos preparados para una auditoría'],
    impact: 'Una inspección con documentación incompleta puede resultar en sanciones, multas o incluso el cierre temporal de la clínica',
    question_hint: '¿Si llegara una inspección sanitaria mañana, tendrían toda la documentación requerida completa y organizada?',
    focus: 3
  },
  'CK04': {
    cluster: 'CK-CONSENTIMIENTOS',
    title: 'Sin firma digital para documentos legales',
    signals: ['todo se firma en papel', 'los consentimientos están en una carpeta física que se puede perder', 'no tenemos firma electrónica'],
    impact: 'Los documentos en papel son vulnerables a pérdida, deterioro y difíciles de recuperar cuando se necesitan como evidencia legal',
    question_hint: '¿Los documentos legales como consentimientos se gestionan en papel o tienen un sistema de firma digital?',
    focus: 2
  },
  'CK05': {
    cluster: 'CK-INSPECCION',
    title: 'Plazos regulatorios incumplidos',
    signals: ['se nos pasó la fecha de renovación de la licencia', 'no llevamos control de vencimientos regulatorios', 'nos enteramos tarde de nuevos requisitos normativos'],
    impact: 'El incumplimiento de plazos regulatorios puede generar multas acumulativas y poner en riesgo la licencia de funcionamiento',
    question_hint: '¿Tienen un calendario con todas las fechas límite de renovaciones, certificaciones y requisitos regulatorios?',
    focus: 3
  },
  'CK06': {
    cluster: 'CK-INSPECCION',
    title: 'Sin evidencia documental de cumplimiento',
    signals: ['cumplimos pero no tenemos cómo demostrarlo', 'hacemos las cosas bien pero no las documentamos', 'no guardamos evidencia de los procesos'],
    impact: 'Ante una inspección o demanda, cumplir sin documentar es equivalente a no cumplir: lo que no se documenta no existe legalmente',
    question_hint: '¿Pueden demostrar con documentos y registros que cumplen con todos los requisitos normativos aplicables?',
    focus: 2
  },
  'CK07': {
    cluster: 'CK-CONSENTIMIENTOS',
    title: 'Requisitos de seguros no satisfechos',
    signals: ['el seguro nos pidió documentación que no teníamos', 'no cumplimos con lo que exige la aseguradora', 'tuvimos problemas con un reclamo por falta de documentación'],
    impact: 'El incumplimiento de requisitos del seguro puede dejar sin cobertura a la clínica precisamente cuando más la necesita',
    question_hint: '¿Cumplen con todos los requisitos documentales que exige su póliza de seguro de responsabilidad profesional?',
    focus: 2
  },
  'CK08': {
    cluster: 'CK-DATOS',
    title: 'Residuos médicos sin rastreo adecuado',
    signals: ['no llevamos registro del manejo de residuos', 'los residuos se manejan sin protocolo formal', 'no tenemos trazabilidad de la disposición de residuos'],
    impact: 'El manejo inadecuado de residuos biológico-infecciosos es una de las causas más comunes de cierre y sanción en inspecciones sanitarias',
    question_hint: '¿Llevan un registro documentado del manejo y disposición de residuos médicos conforme a la normativa?',
    focus: 2
  },
  'CK09': {
    cluster: 'CK-INSPECCION',
    title: 'Protocolos de emergencia sin documentar',
    signals: ['no tenemos un plan de emergencia escrito', 'si pasa algo grave no hay un protocolo claro', 'el plan de emergencia está en la cabeza de alguien'],
    impact: 'Una emergencia sin protocolo documentado puede resultar en un desenlace fatal y en responsabilidad penal para el titular',
    question_hint: '¿Tienen protocolos de emergencia médica documentados y el equipo los conoce y practica periódicamente?',
    focus: 3
  },
  'CK10': {
    cluster: 'CK-DATOS',
    title: 'Certificaciones del personal vencidas',
    signals: ['no sé si las certificaciones del equipo están vigentes', 'no llevamos control de vencimientos de títulos y permisos', 'alguien del equipo tiene la certificación vencida'],
    impact: 'Un profesional con certificación vencida ejerciendo puede invalidar el seguro de la clínica y generar responsabilidad legal al titular',
    question_hint: '¿Tienen un registro actualizado con las fechas de vencimiento de todas las certificaciones y permisos del personal clínico?',
    focus: 3
  },

  // ============================================================
  // CL - Capacitar al personal es difícil
  // ============================================================

  'CL01': {
    cluster: 'CL-ROTACION',
    title: 'Alta rotación de personal',
    signals: ['no paramos de contratar gente nueva', 'la gente dura poco y se va', 'cada pocos meses tenemos que reemplazar a alguien'],
    impact: 'Cada salida cuesta entre 3 y 6 meses de salario en reclutamiento, capacitación y productividad perdida mientras el nuevo se adapta',
    question_hint: '¿Con qué frecuencia han tenido que reemplazar personal en los últimos 12 meses?',
    focus: 3
  },
  'CL02': {
    cluster: 'CL-MANUALES',
    title: 'No existe manual de capacitación',
    signals: ['no tenemos nada escrito para entrenar', 'la capacitación es sobre la marcha', 'no hay un manual de procedimientos para nuevos'],
    impact: 'Sin manual de capacitación cada incorporación es una improvisación que depende de quién esté disponible para enseñar',
    question_hint: '¿Tienen un manual o material de capacitación estructurado para cuando llega alguien nuevo al equipo?',
    focus: 3
  },
  'CL03': {
    cluster: 'CL-ONBOARDING',
    title: 'El personal nuevo empieza de cero sin guía',
    signals: ['el nuevo llega y no sabe ni dónde están las cosas', 'no hay un proceso de bienvenida estructurado', 'los primeros días son un caos para los nuevos'],
    impact: 'Un onboarding desorganizado genera frustración temprana que aumenta la probabilidad de renuncia en los primeros 90 días',
    question_hint: '¿Cómo es el proceso de los primeros días cuando incorporan a alguien nuevo a la clínica?',
    focus: 3
  },
  'CL04': {
    cluster: 'CL-ROTACION',
    title: 'Conocimiento perdido cuando alguien se va',
    signals: ['cuando se fue fulano se perdió mucho conocimiento', 'nadie más sabe cómo hacer lo que hacía esa persona', 'la información se fue con el empleado'],
    impact: 'La dependencia de conocimiento no documentado crea vulnerabilidad crítica: cada salida puede paralizar procesos enteros',
    question_hint: '¿Qué pasaría si mañana se fuera la persona que más sabe de los procesos de la clínica?',
    focus: 3
  },
  'CL05': {
    cluster: 'CL-MANUALES',
    title: 'Sin videos ni material visual de procedimientos',
    signals: ['no tenemos videos de cómo se hacen las cosas', 'todo se explica de palabra', 'no hay material visual para capacitar'],
    impact: 'La capacitación solo verbal es ineficiente, no escalable y genera interpretaciones diferentes de los mismos procedimientos',
    question_hint: '¿Cuentan con videos o material visual que muestre cómo realizar los procedimientos clave de la clínica?',
    focus: 1
  },
  'CL06': {
    cluster: 'CL-ONBOARDING',
    title: 'Capacitación inconsistente entre empleados',
    signals: ['cada persona fue entrenada de forma diferente', 'depende de quién le enseñó al nuevo', 'no hay un estándar de lo que debe aprender cada puesto'],
    impact: 'La capacitación inconsistente produce equipos con niveles dispares de competencia y diferentes interpretaciones de los procesos',
    question_hint: '¿Todos los empleados del mismo puesto recibieron exactamente la misma capacitación?',
    focus: 2
  },
  'CL07': {
    cluster: 'CL-ONBOARDING',
    title: 'Meses para que el nuevo sea productivo',
    signals: ['tarda mucho en agarrar el ritmo', 'pasan meses hasta que el nuevo ya puede solo', 'la curva de aprendizaje es muy larga'],
    impact: 'Un tiempo de productividad de meses significa costos salariales sin retorno completo y sobrecarga para el resto del equipo',
    question_hint: '¿Cuánto tiempo tarda en promedio un nuevo empleado en ser completamente productivo en su puesto?',
    focus: 2
  },
  'CL08': {
    cluster: 'CL-MANUALES',
    title: 'Cada persona entrenada de manera diferente',
    signals: ['no hay dos personas que hagan lo mismo igual', 'cada quien aprendió con alguien diferente y se nota', 'hay muchas formas de hacer lo mismo aquí'],
    impact: 'Las diferencias de capacitación generan resultados inconsistentes y hacen imposible establecer estándares de calidad medibles',
    question_hint: '¿Si le pidieran a dos empleados del mismo puesto que realicen la misma tarea, lo harían exactamente igual?',
    focus: 2
  },
  'CL09': {
    cluster: 'CL-ROTACION',
    title: 'Sin evaluación de competencias del equipo',
    signals: ['no evaluamos si el equipo sabe lo que debe saber', 'no hay exámenes ni evaluaciones periódicas', 'asumimos que saben porque llevan tiempo'],
    impact: 'Sin evaluación de competencias no se detectan brechas de conocimiento que pueden estar afectando la calidad del servicio',
    question_hint: '¿Evalúan periódicamente las competencias técnicas y de servicio de cada miembro del equipo?',
    focus: 2
  },
  'CL10': {
    cluster: 'CL-ONBOARDING',
    title: 'Acompañamiento como único método de entrenamiento',
    signals: ['el nuevo simplemente sigue a alguien unos días', 'el entrenamiento es ir con un compañero y ver cómo hace las cosas', 'no hay capacitación formal, solo observación'],
    impact: 'El shadowing sin estructura transmite tanto buenas prácticas como vicios, y no garantiza que el nuevo entienda el porqué de cada proceso',
    question_hint: '¿La capacitación de nuevos empleados consiste principalmente en que acompañen a un compañero experimentado?',
    focus: 2
  },

  // ============================================================
  // CM - Los reportes me cuestan horas
  // ============================================================

  'CM01': {
    cluster: 'CM-REPORTES',
    title: 'Consolidación manual de reportes',
    signals: ['junto información de varios sitios para hacer un reporte', 'me paso horas armando reportes a mano', 'los reportes requieren copiar datos de un lugar a otro'],
    impact: 'Las horas dedicadas a consolidar reportes manualmente son horas que no se dedican a gestionar y hacer crecer la clínica',
    question_hint: '¿Cuánto tiempo les toma preparar un reporte de gestión mensual de la clínica?',
    focus: 3
  },
  'CM02': {
    cluster: 'CM-METRICAS',
    title: 'Sin métricas en tiempo real',
    signals: ['no sé cómo vamos hasta que saco los números a fin de mes', 'no tenemos visibilidad del día a día', 'los datos siempre están atrasados'],
    impact: 'Sin métricas en tiempo real las decisiones se toman con datos viejos y los problemas se detectan cuando ya es demasiado tarde',
    question_hint: '¿Pueden ver en cualquier momento del día cómo va la clínica en facturación, citas y ocupación?',
    focus: 3
  },
  'CM03': {
    cluster: 'CM-DASHBOARDS',
    title: 'Tasa de ocupación desconocida',
    signals: ['no sé qué porcentaje de mis consultorios están ocupados', 'no medimos la ocupación', 'no tenemos idea de cuánta capacidad desperdiciamos'],
    impact: 'Sin conocer la ocupación es imposible saber si se necesita más capacidad o si se está desperdiciando la existente',
    question_hint: '¿Saben cuál es la tasa de ocupación de sus consultorios o sillones durante la semana?',
    focus: 2
  },
  'CM04': {
    cluster: 'CM-REPORTES',
    title: 'Reportes de ingresos toman días',
    signals: ['sacar los números de facturación toma días', 'el cierre mensual de cuentas es eterno', 'no puedo saber cuánto facturamos sin esperar al contador'],
    impact: 'La demora en reportes de ingresos impide detectar tendencias negativas a tiempo y tomar decisiones financieras oportunas',
    question_hint: '¿Cuántos días les toma tener listo el reporte de ingresos y facturación del mes anterior?',
    focus: 3
  },
  'CM05': {
    cluster: 'CM-METRICAS',
    title: 'Sin tendencias de volumen de pacientes',
    signals: ['no sé si estamos atendiendo más o menos que antes', 'no llevamos el registro de cuántos pacientes atendemos por mes', 'no vemos tendencias de afluencia'],
    impact: 'Sin datos de tendencias no se puede planificar personal, anticipar estacionalidad ni evaluar el impacto de acciones de captación',
    question_hint: '¿Pueden ver fácilmente cómo ha evolucionado el volumen de pacientes mes a mes en el último año?',
    focus: 2
  },
  'CM06': {
    cluster: 'CM-METRICAS',
    title: 'Sin análisis de mix de tratamientos',
    signals: ['no sé cuáles tratamientos son los más rentables', 'no analizamos qué procedimientos hacemos más', 'no tenemos desglose de ingresos por tipo de tratamiento'],
    impact: 'Sin análisis de mix no se puede optimizar la oferta de servicios ni enfocar el marketing en los tratamientos más rentables',
    question_hint: '¿Saben cuáles de sus tratamientos generan más ingresos y cuáles tienen mayor margen de rentabilidad?',
    focus: 2
  },
  'CM07': {
    cluster: 'CM-DASHBOARDS',
    title: 'Comparación entre periodos imposible',
    signals: ['no podemos comparar este mes con el anterior fácilmente', 'no tenemos forma de ver la evolución año contra año', 'cada reporte es un esfuerzo desde cero'],
    impact: 'Sin comparativos es imposible evaluar si la clínica mejora o empeora, haciendo que la gestión sea reactiva en vez de proactiva',
    question_hint: '¿Pueden comparar fácilmente el desempeño de este trimestre contra el mismo trimestre del año anterior?',
    focus: 2
  },
  'CM08': {
    cluster: 'CM-DASHBOARDS',
    title: 'KPIs no definidos para la clínica',
    signals: ['no tenemos indicadores clave definidos', 'no sabemos qué medir', 'no hemos establecido metas numéricas para nada'],
    impact: 'Sin KPIs definidos no hay dirección clara, no se pueden establecer metas y todo se gestiona por intuición',
    question_hint: '¿Tienen definidos los indicadores clave de desempeño de la clínica y metas numéricas para cada uno?',
    focus: 2
  },
  'CM09': {
    cluster: 'CM-REPORTES',
    title: 'Datos dispersos en múltiples hojas de cálculo',
    signals: ['tengo información en veinte excels diferentes', 'cada área tiene su propia hoja de cálculo', 'los datos están regados por todas partes'],
    impact: 'Los datos dispersos generan versiones contradictorias de la realidad y hacen que cada análisis sea un ejercicio de detective',
    question_hint: '¿En cuántos archivos o sistemas diferentes necesitan buscar para tener una foto completa de la clínica?',
    focus: 3
  },
  'CM10': {
    cluster: 'CM-REPORTES',
    title: 'Cierre fiscal y reportes anuales son una pesadilla',
    signals: ['el cierre de año es un infierno', 'preparar la información anual nos toma semanas', 'cada fin de año es un caos con los reportes'],
    impact: 'Un cierre fiscal caótico genera riesgo de errores tributarios, multas por presentación tardía y semanas de estrés evitable',
    question_hint: '¿Cómo es el proceso de preparar la información para el cierre fiscal y los reportes anuales?',
    focus: 2
  },

  // ============================================================
  // CN - No aprovecho los datos de pacientes
  // ============================================================

  'CN01': {
    cluster: 'CN-SEGMENTACION',
    title: 'Sin segmentación de base de pacientes',
    signals: ['tratamos a todos los pacientes igual en comunicación', 'no dividimos a los pacientes por tipo', 'nuestra base de datos es una lista plana sin categorías'],
    impact: 'Sin segmentación se desperdicia la base de pacientes enviando mensajes genéricos que no resuenan con nadie en particular',
    question_hint: '¿Tienen a sus pacientes segmentados por tipo de tratamiento, frecuencia de visita u otras características?',
    focus: 2
  },
  'CN02': {
    cluster: 'CN-CAMPANAS',
    title: 'Sin campañas de reactivación de pacientes inactivos',
    signals: ['hay pacientes que dejaron de venir y nunca los contactamos', 'no hacemos nada para recuperar pacientes perdidos', 'no sabemos siquiera quiénes dejaron de venir'],
    impact: 'Reactivar un paciente existente cuesta 5 veces menos que captar uno nuevo; no hacerlo es desperdiciar la inversión ya realizada',
    question_hint: '¿Tienen algún mecanismo para detectar y contactar pacientes que llevan tiempo sin visitarlos?',
    focus: 3
  },
  'CN03': {
    cluster: 'CN-CAMPANAS',
    title: 'Comunicación genérica para todos los pacientes',
    signals: ['mandamos el mismo mensaje a toda la base', 'no personalizamos la comunicación', 'todos reciben la misma promoción sin importar qué tratamiento se hicieron'],
    impact: 'Los mensajes genéricos tienen tasas de respuesta muy bajas y pueden molestar a pacientes que reciben ofertas irrelevantes',
    question_hint: '¿Los mensajes que envían a los pacientes son iguales para todos o están personalizados según su historial?',
    focus: 2
  },
  'CN04': {
    cluster: 'CN-PERSONALIZACION',
    title: 'Sin venta cruzada basada en historial',
    signals: ['no sugerimos tratamientos complementarios basados en lo que ya se hicieron', 'no aprovechamos el historial para ofrecer otros servicios', 'las recomendaciones no están basadas en datos'],
    impact: 'Se pierden oportunidades naturales de aumentar el ticket promedio con tratamientos que el paciente genuinamente necesita',
    question_hint: '¿Utilizan el historial clínico del paciente para sugerir tratamientos complementarios de forma proactiva?',
    focus: 2
  },
  'CN05': {
    cluster: 'CN-PERSONALIZACION',
    title: 'Recomendaciones de tratamiento no personalizadas',
    signals: ['las recomendaciones son las mismas para todos', 'no adaptamos el plan según el perfil del paciente', 'no usamos la información que tenemos para personalizar'],
    impact: 'Las recomendaciones genéricas tienen menor tasa de aceptación y el paciente percibe un servicio impersonal',
    question_hint: '¿Las recomendaciones de tratamiento que hacen al paciente están personalizadas según su historial y perfil?',
    focus: 2
  },
  'CN06': {
    cluster: 'CN-CAMPANAS',
    title: 'Sin automatizaciones de cumpleaños ni seguimiento',
    signals: ['no felicitamos a los pacientes en su cumpleaños', 'no hay mensajes automáticos de seguimiento', 'todo contacto con el paciente es manual'],
    impact: 'Los puntos de contacto automatizados mantienen la relación viva sin esfuerzo; no tenerlos deja vacíos donde el paciente olvida la clínica',
    question_hint: '¿Envían automáticamente felicitaciones de cumpleaños o recordatorios de seguimiento a sus pacientes?',
    focus: 1
  },
  'CN07': {
    cluster: 'CN-SEGMENTACION',
    title: 'Base de datos no aprovechada para marketing',
    signals: ['tenemos miles de pacientes en la base pero no hacemos nada con esa información', 'la base de datos solo se usa para agendar', 'no usamos los datos para estrategias de marketing'],
    impact: 'Una base de pacientes sin explotar es un activo dormido que podría generar ingresos significativos con estrategias de marketing dirigido',
    question_hint: '¿Utilizan activamente la información de su base de pacientes para diseñar estrategias de marketing y comunicación?',
    focus: 2
  },
  'CN08': {
    cluster: 'CN-SEGMENTACION',
    title: 'Sin rastreo de fuentes de referencia',
    signals: ['no sabemos cómo llegan los pacientes nuevos', 'no preguntamos por quién nos conocieron', 'no rastreamos qué canal trae más pacientes'],
    impact: 'Sin saber de dónde vienen los pacientes se invierte en marketing a ciegas, sin poder optimizar los canales que realmente funcionan',
    question_hint: '¿Saben exactamente de dónde viene cada paciente nuevo y qué canal de captación es más efectivo?',
    focus: 3
  },
  'CN09': {
    cluster: 'CN-PERSONALIZACION',
    title: 'Valor de vida del paciente desconocido',
    signals: ['no sabemos cuánto vale un paciente a lo largo del tiempo', 'no calculamos el valor de retener a un paciente', 'no medimos el ingreso total por paciente'],
    impact: 'Sin conocer el valor de vida no se puede justificar la inversión en retención ni priorizar los esfuerzos en los pacientes más valiosos',
    question_hint: '¿Saben cuánto genera en promedio un paciente a lo largo de toda su relación con la clínica?',
    focus: 1
  },
  'CN10': {
    cluster: 'CN-CAMPANAS',
    title: 'Tendencias estacionales no aprovechadas',
    signals: ['no planificamos campañas según la temporada', 'no sabemos en qué meses hay más o menos demanda', 'no anticipamos los periodos bajos con promociones'],
    impact: 'Sin aprovechar la estacionalidad se pierden picos de demanda y se sufren los valles sin estrategia para mitigarlos',
    question_hint: '¿Planifican campañas o promociones específicas basadas en los patrones estacionales de demanda que han observado?',
    focus: 1
  },

  // ============================================================
  // CO - La tecnología no me ayuda
  // ============================================================

  'CO01': {
    cluster: 'CO-SOFTWARE',
    title: 'Software obsoleto o desactualizado',
    signals: ['usamos un programa viejísimo', 'el sistema no se ha actualizado en años', 'nuestro software ya no tiene soporte del proveedor'],
    impact: 'El software obsoleto tiene vulnerabilidades de seguridad, no se integra con herramientas modernas y limita la capacidad operativa',
    question_hint: '¿Hace cuánto se actualizó por última vez el software principal que usan para gestionar la clínica?',
    focus: 3
  },
  'CO02': {
    cluster: 'CO-ADOPCION',
    title: 'El equipo se rehúsa a usar el sistema',
    signals: ['compramos un sistema y nadie lo usa', 'el equipo prefiere seguir haciendo las cosas como antes', 'hay resistencia al cambio tecnológico'],
    impact: 'Un sistema que el equipo no adopta es dinero tirado y peor: genera doble trabajo al mantener procesos paralelos',
    question_hint: '¿Todo el equipo usa activamente el sistema de gestión o hay personas que siguen con métodos anteriores?',
    focus: 3
  },
  'CO03': {
    cluster: 'CO-FRAGMENTACION',
    title: 'Múltiples herramientas desconectadas',
    signals: ['usamos un sistema para agenda, otro para facturación, otro para historias clínicas', 'nada se conecta entre sí', 'tenemos que ingresar los mismos datos en varios lugares'],
    impact: 'Las herramientas desconectadas multiplican el trabajo, generan errores de transcripción y hacen imposible tener una vista unificada',
    question_hint: '¿Cuántos sistemas o herramientas diferentes usa la clínica y se comunican entre sí?',
    focus: 3
  },
  'CO04': {
    cluster: 'CO-FRAGMENTACION',
    title: 'WhatsApp como único canal de comunicación interna',
    signals: ['todo se comunica por WhatsApp', 'las instrucciones se pierden en el chat', 'WhatsApp es nuestro sistema de gestión'],
    impact: 'WhatsApp no es una herramienta de gestión: la información se pierde, no hay trazabilidad y los mensajes se mezclan con lo personal',
    question_hint: '¿Cómo se comunica el equipo internamente para temas operativos y de coordinación de pacientes?',
    focus: 2
  },
  'CO05': {
    cluster: 'CO-SOFTWARE',
    title: 'Sin respaldo en la nube',
    signals: ['todo está en la computadora de la clínica', 'si se daña el disco duro perdemos todo', 'no hacemos respaldos de la información'],
    impact: 'Un fallo de hardware, un robo o un ransomware puede borrar años de historiales clínicos y datos financieros sin posibilidad de recuperación',
    question_hint: '¿La información de la clínica está respaldada en la nube o solo existe en equipos locales?',
    focus: 3
  },
  'CO06': {
    cluster: 'CO-FRAGMENTACION',
    title: 'Mezcla de papel y digital sin criterio',
    signals: ['unas cosas están en papel y otras en digital sin lógica', 'no sabemos qué buscar dónde', 'tenemos doble registro: papel y computadora'],
    impact: 'El sistema híbrido sin criterio duplica el trabajo, genera inconsistencias y hace que buscar información sea una carrera de obstáculos',
    question_hint: '¿Tienen definido claramente qué información se maneja digital y qué en papel, o es una mezcla sin criterio?',
    focus: 2
  },
  'CO07': {
    cluster: 'CO-SOFTWARE',
    title: 'Dependencia excesiva de un proveedor',
    signals: ['estamos atrapados con el proveedor del sistema', 'si queremos cambiar perdemos todos los datos', 'el proveedor nos cobra lo que quiere porque no podemos salir'],
    impact: 'El vendor lock-in elimina el poder de negociación y deja a la clínica vulnerable a aumentos de precio o discontinuación del servicio',
    question_hint: '¿Podrían cambiar de sistema de gestión mañana sin perder datos o están atados a su proveedor actual?',
    focus: 2
  },
  'CO08': {
    cluster: 'CO-ADOPCION',
    title: 'Sistema costoso apenas utilizado',
    signals: ['pagamos mucho por un sistema que usamos al 10%', 'tiene muchas funciones pero solo usamos la agenda', 'estamos pagando por algo que no aprovechamos'],
    impact: 'Un sistema infrautilizado es un gasto recurrente sin retorno que además genera la falsa sensación de estar digitalizado',
    question_hint: '¿Qué porcentaje de las funcionalidades de su sistema de gestión actual utilizan realmente en el día a día?',
    focus: 2
  },
  'CO09': {
    cluster: 'CO-ADOPCION',
    title: 'Sin acceso móvil a la información de la clínica',
    signals: ['solo puedo ver los datos desde la computadora de la clínica', 'fuera de la clínica no tengo acceso a nada', 'no puedo revisar la agenda desde el celular'],
    impact: 'Sin acceso móvil el director de la clínica no puede tomar decisiones ni resolver urgencias cuando está fuera del consultorio',
    question_hint: '¿Pueden acceder a la información de la clínica desde el teléfono o tablet cuando no están físicamente en el consultorio?',
    focus: 2
  },
  'CO10': {
    cluster: 'CO-SOFTWARE',
    title: 'Soporte técnico es una persona que lo instaló hace años',
    signals: ['el de sistemas es el sobrino que lo instaló hace cinco años', 'cuando algo falla no sabemos a quién llamar', 'no tenemos soporte técnico profesional'],
    impact: 'La dependencia de soporte informal crea un punto único de falla: cuando esa persona no está disponible, los problemas técnicos paralizan la operación',
    question_hint: '¿Quién les da soporte técnico cuando algo falla en los sistemas y cuánto tardan en resolver los problemas?',
    focus: 2
  },

  // ============================================================
  // CP - Hago todo manual pudiendo automatizar
  // ============================================================

  'CP01': {
    cluster: 'CP-RECORDATORIOS',
    title: 'Recordatorios de cita enviados manualmente',
    signals: ['llamamos uno por uno para recordar la cita', 'mandamos WhatsApp manual a cada paciente para recordarle', 'la recepcionista se pasa horas haciendo recordatorios'],
    impact: 'Los recordatorios manuales consumen horas de personal diariamente y aún así se olvidan pacientes, generando no-shows evitables',
    question_hint: '¿Cómo envían los recordatorios de cita a los pacientes? ¿Es un proceso manual o automático?',
    focus: 3
  },
  'CP02': {
    cluster: 'CP-CONFIRMACIONES',
    title: 'Confirmaciones de cita una por una',
    signals: ['confirmamos cada cita individualmente', 'hay que llamar o escribir a cada paciente para confirmar', 'la confirmación nos toma toda la mañana'],
    impact: 'Las confirmaciones individuales son uno de los mayores sumideros de tiempo administrativo y su omisión dispara la tasa de inasistencia',
    question_hint: '¿Cuánto tiempo del día dedica el equipo administrativo a confirmar citas de pacientes?',
    focus: 3
  },
  'CP03': {
    cluster: 'CP-RECORDATORIOS',
    title: 'Seguimientos post-tratamiento escritos a mano',
    signals: ['los seguimientos los escribimos manualmente', 'las instrucciones post-tratamiento las redactamos cada vez', 'no hay mensajes predefinidos de seguimiento'],
    impact: 'Los seguimientos manuales son inconsistentes, algunos pacientes no los reciben y se pierde el control de la evolución post-tratamiento',
    question_hint: '¿Los mensajes de seguimiento post-tratamiento se envían automáticamente o los escribe alguien del equipo cada vez?',
    focus: 2
  },
  'CP04': {
    cluster: 'CP-AUTOMATICO',
    title: 'Sin mensajes automáticos de bienvenida',
    signals: ['no enviamos nada al paciente cuando se registra', 'no hay un mensaje de bienvenida automatizado', 'el paciente nuevo no recibe ninguna comunicación previa a su primera cita'],
    impact: 'La ausencia de comunicación de bienvenida pierde la oportunidad de crear una primera impresión positiva y reducir la ansiedad pre-visita',
    question_hint: '¿Los pacientes nuevos reciben automáticamente un mensaje de bienvenida con información útil antes de su primera visita?',
    focus: 1
  },
  'CP05': {
    cluster: 'CP-AUTOMATICO',
    title: 'Renovación manual de recetas y prescripciones',
    signals: ['las recetas las hacemos una por una desde cero', 'no hay plantillas para prescripciones frecuentes', 'cada receta se escribe manualmente'],
    impact: 'La elaboración manual de recetas consume tiempo clínico valioso y aumenta el riesgo de errores en dosis o medicamentos',
    question_hint: '¿Las recetas y prescripciones se generan con plantillas automatizadas o se escriben manualmente cada vez?',
    focus: 2
  },
  'CP06': {
    cluster: 'CP-AUTOMATICO',
    title: 'Planes de tratamiento copiados y pegados',
    signals: ['copio y pego planes de tratamiento anteriores y los adapto', 'los planes se hacen con copy-paste', 'no hay generación automática de planes de tratamiento'],
    impact: 'El copy-paste de planes genera errores por información residual del paciente anterior y produce documentos poco profesionales',
    question_hint: '¿Los planes de tratamiento se generan automáticamente desde los datos del paciente o se copian y adaptan manualmente?',
    focus: 2
  },
  'CP07': {
    cluster: 'CP-CONFIRMACIONES',
    title: 'Reportes generados a mano sin automatización',
    signals: ['los reportes los armo yo manualmente', 'no hay reportes automáticos', 'cada reporte es un trabajo artesanal'],
    impact: 'Los reportes manuales no solo consumen horas sino que están sujetos a errores humanos que pueden distorsionar las decisiones',
    question_hint: '¿Los reportes de gestión de la clínica se generan automáticamente o alguien los construye manualmente?',
    focus: 2
  },
  'CP08': {
    cluster: 'CP-RECORDATORIOS',
    title: 'Publicación manual en redes sociales',
    signals: ['publico en redes cuando me acuerdo', 'no hay programación automática de posts', 'las redes las manejo yo manualmente sin ninguna herramienta'],
    impact: 'La publicación manual resulta en frecuencia irregular, presencia digital inconsistente y tiempo del director dedicado a tareas delegables',
    question_hint: '¿Las publicaciones en redes sociales se programan con herramientas de automatización o se publican manualmente?',
    focus: 1
  },
  'CP09': {
    cluster: 'CP-CONFIRMACIONES',
    title: 'Conteos de inventario hechos a mano',
    signals: ['contamos el inventario manualmente', 'los conteos los hacemos con papel y lápiz', 'cada revisión de inventario toma horas de trabajo manual'],
    impact: 'Los conteos manuales son lentos, propensos a errores y cuando terminan los datos ya están desactualizados',
    question_hint: '¿Cómo realizan los conteos de inventario? ¿Usan algún sistema automatizado o es un proceso manual?',
    focus: 2
  },
  'CP10': {
    cluster: 'CP-AUTOMATICO',
    title: 'Tareas administrativas repetitivas consumen tiempo clínico',
    signals: ['paso más tiempo en cosas administrativas que atendiendo pacientes', 'las tareas repetitivas me quitan horas de consulta', 'el papeleo me consume el día entero'],
    impact: 'Cada hora del profesional clínico dedicada a tareas administrativas automatizables es una hora de ingresos clínicos perdida',
    question_hint: '¿Cuántas horas al día dedica el equipo clínico a tareas administrativas repetitivas que podrían automatizarse?',
    focus: 3
  }
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

  // ==================== CLUSTERS CLÍNICAS (CA-CP) ====================

  // CA - Gestión de citas
  'CA-AGENDA': { title: 'Agenda descontrolada', description: 'Sin control de citas ni agenda digital', codes: ['CA01', 'CA03', 'CA05', 'CA08', 'CA09'], category: 'CA', focus: 1, priority: 1 },
  'CA-CANCELACIONES': { title: 'Cancelaciones y no-shows', description: 'Pacientes que cancelan o no se presentan sin aviso', codes: ['CA02', 'CA06', 'CA07'], category: 'CA', focus: 1, priority: 2 },
  'CA-CANALES': { title: 'Canales de reserva dispersos', description: 'Citas por WhatsApp, teléfono, en persona sin unificar', codes: ['CA04', 'CA10'], category: 'CA', focus: 1, priority: 3 },

  // CB - Seguimiento de pacientes
  'CB-SEGUIMIENTO': { title: 'Seguimiento inexistente', description: 'No se hace seguimiento post-tratamiento ni entre citas', codes: ['CB01', 'CB03', 'CB10'], category: 'CB', focus: 2, priority: 1 },
  'CB-RETENCION': { title: 'Pacientes que no vuelven', description: 'Alta tasa de pacientes que abandonan tratamientos o no regresan', codes: ['CB02', 'CB04', 'CB07', 'CB08'], category: 'CB', focus: 2, priority: 2 },
  'CB-REACTIVACION': { title: 'Sin reactivación de inactivos', description: 'Pacientes dormidos sin estrategia para recuperarlos', codes: ['CB05', 'CB06', 'CB09'], category: 'CB', focus: 2, priority: 3 },

  // CC - Historial clínico
  'CC-EXPEDIENTES': { title: 'Expedientes en papel o dispersos', description: 'Historiales clínicos en carpetas físicas o archivos sueltos', codes: ['CC01', 'CC04', 'CC06', 'CC09', 'CC10'], category: 'CC', focus: 3, priority: 1 },
  'CC-FOTOS': { title: 'Fotos y documentos sin organizar', description: 'Imágenes clínicas, radiografías y documentos sin vincular al paciente', codes: ['CC02', 'CC05'], category: 'CC', focus: 3, priority: 2 },
  'CC-CENTRALIZACION': { title: 'Información no centralizada', description: 'Datos del paciente repartidos en varios sistemas o lugares', codes: ['CC03', 'CC07', 'CC08'], category: 'CC', focus: 3, priority: 3 },

  // CD - Rentabilidad
  'CD-RENTABILIDAD': { title: 'Rentabilidad desconocida', description: 'No se sabe qué tratamientos o servicios son rentables', codes: ['CD01', 'CD05', 'CD06'], category: 'CD', focus: 4, priority: 1 },
  'CD-COSTOS': { title: 'Costos fuera de control', description: 'Gastos operativos sin visibilidad ni seguimiento', codes: ['CD02', 'CD08', 'CD09', 'CD10'], category: 'CD', focus: 4, priority: 2 },
  'CD-SERVICIOS': { title: 'Pricing sin estrategia', description: 'Precios de servicios sin análisis de margen ni competencia', codes: ['CD03', 'CD04', 'CD07'], category: 'CD', focus: 4, priority: 3 },

  // CE - Facturación y cobros
  'CE-FACTURACION': { title: 'Facturación manual o lenta', description: 'Proceso de facturación sin automatizar, con errores frecuentes', codes: ['CE01', 'CE02', 'CE07'], category: 'CE', focus: 5, priority: 1 },
  'CE-COBROS': { title: 'Cobros desorganizados', description: 'Sin control de pagos, métodos dispersos y sin conciliar', codes: ['CE04', 'CE05', 'CE06', 'CE10'], category: 'CE', focus: 5, priority: 2 },
  'CE-PENDIENTES': { title: 'Deudas y pagos pendientes', description: 'Pacientes con saldos sin cobrar y sin seguimiento de deuda', codes: ['CE03', 'CE08', 'CE09'], category: 'CE', focus: 5, priority: 3 },

  // CF - Inventario y suministros
  'CF-INVENTARIO': { title: 'Inventario sin control', description: 'No se sabe qué hay en stock ni cuánto queda de cada material', codes: ['CF01', 'CF04', 'CF05', 'CF06', 'CF09'], category: 'CF', focus: 6, priority: 1 },
  'CF-ALERTAS': { title: 'Sin alertas de reposición', description: 'Se descubre que falta material cuando ya se necesita', codes: ['CF02', 'CF08'], category: 'CF', focus: 6, priority: 2 },
  'CF-CADUCIDAD': { title: 'Caducidades y mermas', description: 'Material que caduca sin usarse o se desperdicia por mala gestión', codes: ['CF03', 'CF07', 'CF10'], category: 'CF', focus: 6, priority: 3 },

  // CG - Marketing y captación
  'CG-WEB': { title: 'Web sin resultados', description: 'Página web que no genera pacientes ni aparece en buscadores', codes: ['CG01', 'CG03', 'CG07'], category: 'CG', focus: 7, priority: 1 },
  'CG-REDES': { title: 'Redes sociales sin estrategia', description: 'Publicaciones sin plan, sin métricas y sin conversión', codes: ['CG02', 'CG04', 'CG09'], category: 'CG', focus: 7, priority: 2 },
  'CG-CAPTACION': { title: 'Captación dependiente del boca a boca', description: 'Sin canales activos de adquisición de nuevos pacientes', codes: ['CG05', 'CG06', 'CG08', 'CG10'], category: 'CG', focus: 7, priority: 3 },

  // CH - Comunicación con pacientes
  'CH-CONFIRMACIONES': { title: 'Confirmaciones manuales', description: 'Se llama uno a uno para confirmar citas, consume horas', codes: ['CH01', 'CH04', 'CH07', 'CH10'], category: 'CH', focus: 8, priority: 1 },
  'CH-PREPARACION': { title: 'Paciente sin preparar', description: 'El paciente llega sin saber qué esperar del tratamiento', codes: ['CH02', 'CH05', 'CH06'], category: 'CH', focus: 8, priority: 2 },
  'CH-POSTRATA': { title: 'Comunicación post-tratamiento nula', description: 'Tras el tratamiento no se contacta al paciente para seguimiento', codes: ['CH03', 'CH08', 'CH09'], category: 'CH', focus: 8, priority: 3 },

  // CI - Satisfacción del paciente
  'CI-SATISFACCION': { title: 'Satisfacción no medida', description: 'No se pregunta al paciente si quedó satisfecho con el servicio', codes: ['CI01', 'CI05', 'CI06', 'CI07'], category: 'CI', focus: 9, priority: 1 },
  'CI-REVIEWS': { title: 'Sin gestión de reseñas', description: 'No se piden reseñas ni se responden las negativas', codes: ['CI02', 'CI04', 'CI08'], category: 'CI', focus: 9, priority: 2 },
  'CI-NPS': { title: 'Sin métricas de lealtad', description: 'No se mide NPS ni se detectan detractores a tiempo', codes: ['CI03', 'CI09', 'CI10'], category: 'CI', focus: 9, priority: 3 },

  // CJ - Protocolos clínicos
  'CJ-PROTOCOLOS': { title: 'Protocolos no documentados', description: 'Cada profesional trabaja a su manera sin protocolos escritos', codes: ['CJ01', 'CJ05', 'CJ06', 'CJ10'], category: 'CJ', focus: 10, priority: 1 },
  'CJ-CHECKLISTS': { title: 'Sin checklists operativos', description: 'No hay listas de verificación para procedimientos críticos', codes: ['CJ02', 'CJ04', 'CJ09'], category: 'CJ', focus: 10, priority: 2 },
  'CJ-ESTANDARES': { title: 'Calidad variable', description: 'El resultado depende de quién atienda, sin estándar mínimo', codes: ['CJ03', 'CJ07', 'CJ08'], category: 'CJ', focus: 10, priority: 3 },

  // CK - Cumplimiento legal
  'CK-CONSENTIMIENTOS': { title: 'Consentimientos en papel o ausentes', description: 'Consentimientos informados sin firmar o en papel sin respaldo', codes: ['CK01', 'CK04', 'CK07'], category: 'CK', focus: 11, priority: 1 },
  'CK-DATOS': { title: 'Protección de datos sin cumplir', description: 'RGPD/LOPD sin implementar correctamente en la clínica', codes: ['CK02', 'CK08', 'CK10'], category: 'CK', focus: 11, priority: 2 },
  'CK-INSPECCION': { title: 'Sin preparación ante inspecciones', description: 'Documentación legal desorganizada, riesgo ante auditorías', codes: ['CK03', 'CK05', 'CK06', 'CK09'], category: 'CK', focus: 11, priority: 3 },

  // CL - Gestión de equipo
  'CL-ONBOARDING': { title: 'Incorporaciones caóticas', description: 'Nuevos empleados sin proceso de bienvenida ni formación estructurada', codes: ['CL03', 'CL06', 'CL07', 'CL10'], category: 'CL', focus: 12, priority: 1 },
  'CL-ROTACION': { title: 'Alta rotación de personal', description: 'El equipo cambia constantemente, se pierde conocimiento', codes: ['CL01', 'CL04', 'CL09'], category: 'CL', focus: 12, priority: 2 },
  'CL-MANUALES': { title: 'Sin manuales de puesto', description: 'No hay documentación de funciones, todo es tradición oral', codes: ['CL02', 'CL05', 'CL08'], category: 'CL', focus: 12, priority: 3 },

  // CM - Reporting y métricas
  'CM-REPORTES': { title: 'Sin reportes de gestión', description: 'No se generan informes periódicos del rendimiento de la clínica', codes: ['CM01', 'CM04', 'CM09', 'CM10'], category: 'CM', focus: 13, priority: 1 },
  'CM-METRICAS': { title: 'Métricas clave desconocidas', description: 'No se miden KPIs como ticket medio, tasa de conversión o ocupación', codes: ['CM02', 'CM05', 'CM06'], category: 'CM', focus: 13, priority: 2 },
  'CM-DASHBOARDS': { title: 'Sin visibilidad en tiempo real', description: 'No hay dashboards ni paneles para ver el estado actual de la clínica', codes: ['CM03', 'CM07', 'CM08'], category: 'CM', focus: 13, priority: 3 },

  // CN - CRM y marketing relacional
  'CN-SEGMENTACION': { title: 'Base de pacientes sin segmentar', description: 'Todos los pacientes se tratan igual sin criterios de segmentación', codes: ['CN01', 'CN07', 'CN08'], category: 'CN', focus: 14, priority: 1 },
  'CN-CAMPANAS': { title: 'Campañas sin personalizar', description: 'Comunicaciones masivas genéricas sin relevancia para el paciente', codes: ['CN02', 'CN03', 'CN06', 'CN10'], category: 'CN', focus: 14, priority: 2 },
  'CN-PERSONALIZACION': { title: 'Experiencia no personalizada', description: 'El paciente no siente un trato diferenciado ni personalizado', codes: ['CN04', 'CN05', 'CN09'], category: 'CN', focus: 14, priority: 3 },

  // CO - Integración tecnológica
  'CO-SOFTWARE': { title: 'Software obsoleto o inadecuado', description: 'Herramientas que no cubren las necesidades reales de la clínica', codes: ['CO01', 'CO05', 'CO07', 'CO10'], category: 'CO', focus: 15, priority: 1 },
  'CO-ADOPCION': { title: 'Equipo que no usa la tecnología', description: 'Se paga por herramientas que el personal no utiliza correctamente', codes: ['CO02', 'CO08', 'CO09'], category: 'CO', focus: 15, priority: 2 },
  'CO-FRAGMENTACION': { title: 'Sistemas fragmentados', description: 'Múltiples herramientas que no se comunican entre sí', codes: ['CO03', 'CO04', 'CO06'], category: 'CO', focus: 15, priority: 3 },

  // CP - Recordatorios y automatización
  'CP-RECORDATORIOS': { title: 'Recordatorios manuales', description: 'Se recuerda a los pacientes llamando uno a uno, consume tiempo', codes: ['CP01', 'CP03', 'CP08'], category: 'CP', focus: 16, priority: 1 },
  'CP-CONFIRMACIONES': { title: 'Confirmaciones sin automatizar', description: 'No hay sistema automático para confirmar citas y reducir no-shows', codes: ['CP02', 'CP07', 'CP09'], category: 'CP', focus: 16, priority: 2 },
  'CP-AUTOMATICO': { title: 'Sin flujos automáticos', description: 'Tareas repetitivas que se hacen a mano pudiendo automatizarse', codes: ['CP04', 'CP05', 'CP06', 'CP10'], category: 'CP', focus: 16, priority: 3 },
};


// ============================================================
// COMBINACIÓN FINAL: CATÁLOGO COMPLETO DE 500+ DOLORES
// ============================================================

const PAIN_CATALOG = {
  ...COMMON_PAINS,
  ...PHARMA_SPECIFIC_PAINS,
  ...CLINIC_PAINS
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
  ],

  // ==================== PREGUNTAS CLÍNICAS (CA-CP) ====================

  // CA - Gestión de citas
  'CA-AGENDA': [
    '¿Cómo gestionas las citas de tu clínica?',
    '¿Tu agenda tiene huecos sin llenar frecuentemente?',
    '¿Los pacientes pueden agendar solos online?'
  ],
  'CA-CANCELACIONES': [
    '¿Cuántas cancelaciones de último momento tienes a la semana?',
    '¿Tienes pacientes que simplemente no se presentan sin avisar?',
    '¿Has calculado cuánto dinero pierdes por los no-shows?'
  ],
  'CA-CANALES': [
    '¿Por cuántos canales distintos te llegan solicitudes de cita?',
    '¿Alguna vez se te ha traspapelado una cita pedida por WhatsApp?',
    '¿Todas las reservas terminan en un mismo sistema?'
  ],

  // CB - Seguimiento de pacientes
  'CB-SEGUIMIENTO': [
    '¿Haces seguimiento a los pacientes entre citas?',
    '¿Sabes cuántos pacientes abandonan un tratamiento a medias?',
    '¿Tienes un sistema para detectar pacientes que dejan de venir?'
  ],
  'CB-RETENCION': [
    '¿Qué porcentaje de pacientes nuevos vuelven para una segunda visita?',
    '¿Sabes por qué dejan de venir los pacientes que abandonan?'
  ],
  'CB-REACTIVACION': [
    '¿Tienes una estrategia para recuperar pacientes que llevan meses sin venir?',
    '¿Sabes cuántos pacientes inactivos tienes en tu base de datos?',
    '¿Alguna vez has lanzado una campaña de reactivación?'
  ],

  // CC - Historial clínico
  'CC-EXPEDIENTES': [
    '¿Los expedientes de tus pacientes están en papel o digitalizados?',
    '¿Cuánto tardas en encontrar el historial de un paciente?',
    '¿Algún expediente se te ha perdido o traspapelado?'
  ],
  'CC-FOTOS': [
    '¿Dónde guardas las fotos clínicas de los pacientes?',
    '¿Las radiografías y documentos están vinculados al expediente digital?'
  ],
  'CC-CENTRALIZACION': [
    '¿La información del paciente está en un solo lugar o repartida en varios sistemas?',
    '¿Todos los profesionales de tu clínica acceden al mismo historial?',
    '¿Necesitas buscar en varios sitios para tener la foto completa de un paciente?'
  ],

  // CD - Rentabilidad
  'CD-RENTABILIDAD': [
    '¿Sabes cuáles son los tratamientos más rentables de tu clínica?',
    '¿Conoces tu margen de beneficio por cada servicio que ofreces?',
    '¿Revisas la rentabilidad de tu clínica periódicamente?'
  ],
  'CD-COSTOS': [
    '¿Tienes visibilidad clara de todos tus gastos operativos?',
    '¿Sabes cuánto te cuesta cada hora de consulta en términos reales?'
  ],
  'CD-SERVICIOS': [
    '¿Cómo decides el precio de un nuevo tratamiento?',
    '¿Has analizado si tus precios están alineados con tu zona y competencia?',
    '¿Tienes servicios que ofreces a pérdida sin saberlo?'
  ],

  // CE - Facturación y cobros
  'CE-FACTURACION': [
    '¿Cómo generas las facturas de tu clínica?',
    '¿Cuánto tiempo dedicas a la semana a temas de facturación?',
    '¿Te han detectado errores en facturas alguna vez?'
  ],
  'CE-COBROS': [
    '¿Ofreces varios métodos de pago y los tienes todos conciliados?',
    '¿El cobro se hace al momento o a veces se queda pendiente?'
  ],
  'CE-PENDIENTES': [
    '¿Tienes pacientes con pagos pendientes que no has podido cobrar?',
    '¿Llevas un control actualizado de quién te debe y cuánto?',
    '¿Cuánto dinero tienes pendiente de cobro ahora mismo?'
  ],

  // CF - Inventario y suministros
  'CF-INVENTARIO': [
    '¿Sabes exactamente qué materiales tienes en stock ahora mismo?',
    '¿Llevas el inventario en algún sistema o lo controlas de memoria?',
    '¿Alguna vez te has quedado sin un material esencial en mitad de un tratamiento?'
  ],
  'CF-ALERTAS': [
    '¿Tu sistema te avisa cuando un material está por agotarse?',
    '¿Cómo decides cuándo hacer un pedido de reposición?'
  ],
  'CF-CADUCIDAD': [
    '¿Controlas las fechas de caducidad de tus materiales?',
    '¿Alguna vez has tenido que tirar material caducado sin usar?',
    '¿Sabes cuánto pierdes al año en material desperdiciado?'
  ],

  // CG - Marketing y captación
  'CG-WEB': [
    '¿Tu web genera pacientes nuevos de forma constante?',
    '¿Apareces en Google cuando alguien busca tu especialidad en tu zona?',
    '¿Cuándo fue la última vez que actualizaste tu página web?'
  ],
  'CG-REDES': [
    '¿Publicas en redes sociales con un plan definido?',
    '¿Sabes cuántos pacientes te han llegado a través de redes?',
    '¿Mides el retorno de lo que inviertes en redes sociales?'
  ],
  'CG-CAPTACION': [
    '¿Cómo llegan los pacientes nuevos a tu clínica?',
    '¿Dependes principalmente del boca a boca para captar pacientes?',
    '¿Tienes un presupuesto mensual dedicado a captación de pacientes?'
  ],

  // CH - Comunicación con pacientes
  'CH-CONFIRMACIONES': [
    '¿Cómo confirmas las citas con tus pacientes?',
    '¿Alguien de tu equipo dedica tiempo a llamar para confirmar citas?',
    '¿Cuántas horas semanales se gastan en confirmar citas por teléfono?'
  ],
  'CH-PREPARACION': [
    '¿El paciente recibe información antes de llegar a su cita?',
    '¿Envías instrucciones de preparación antes de un tratamiento?'
  ],
  'CH-POSTRATA': [
    '¿Contactas al paciente después de un tratamiento para saber cómo está?',
    '¿Tienes un protocolo de seguimiento post-tratamiento?',
    '¿El paciente sabe a quién llamar si tiene dudas después del tratamiento?'
  ],

  // CI - Satisfacción del paciente
  'CI-SATISFACCION': [
    '¿Preguntas a tus pacientes si están satisfechos con el servicio?',
    '¿Tienes algún sistema para recoger la opinión de los pacientes?',
    '¿Sabes cuál es tu nivel de satisfacción real?'
  ],
  'CI-REVIEWS': [
    '¿Pides activamente reseñas a tus pacientes satisfechos?',
    '¿Respondes a las reseñas negativas que te dejan online?'
  ],
  'CI-NPS': [
    '¿Mides el NPS o algún indicador de lealtad del paciente?',
    '¿Detectas a tiempo a los pacientes insatisfechos antes de que se vayan?',
    '¿Sabes qué porcentaje de tus pacientes te recomendaría?'
  ],

  // CJ - Protocolos clínicos
  'CJ-PROTOCOLOS': [
    '¿Tienes los protocolos de tu clínica documentados por escrito?',
    '¿Cada profesional sigue el mismo protocolo para el mismo tratamiento?',
    '¿Cuándo fue la última vez que revisaste tus protocolos clínicos?'
  ],
  'CJ-CHECKLISTS': [
    '¿Usas checklists para procedimientos importantes?',
    '¿Alguna vez se ha olvidado un paso crítico en un procedimiento?'
  ],
  'CJ-ESTANDARES': [
    '¿El resultado de un tratamiento cambia mucho según quién lo haga en tu clínica?',
    '¿Tienes estándares mínimos de calidad definidos para cada servicio?',
    '¿Cómo aseguras que todos trabajan con el mismo nivel de calidad?'
  ],

  // CK - Cumplimiento legal
  'CK-CONSENTIMIENTOS': [
    '¿Todos tus pacientes firman consentimiento informado antes del tratamiento?',
    '¿Los consentimientos firmados están guardados de forma segura y accesible?',
    '¿Tus consentimientos están actualizados según la normativa vigente?'
  ],
  'CK-DATOS': [
    '¿Cumples con el RGPD en el tratamiento de datos de pacientes?',
    '¿Tienes un delegado de protección de datos o asesoramiento al respecto?'
  ],
  'CK-INSPECCION': [
    '¿Estarías tranquilo si mañana te hicieran una inspección?',
    '¿Tienes toda la documentación legal organizada y al día?',
    '¿Sabes exactamente qué documentos te pueden pedir en una auditoría?'
  ],

  // CL - Gestión de equipo
  'CL-ONBOARDING': [
    '¿Qué proceso sigues cuando incorporas a alguien nuevo en la clínica?',
    '¿Cuánto tarda un nuevo empleado en ser productivo?',
    '¿Tienes un plan de formación inicial para nuevas incorporaciones?'
  ],
  'CL-ROTACION': [
    '¿Con qué frecuencia se te va gente del equipo?',
    '¿Cuánto te cuesta cada vez que un empleado se marcha?'
  ],
  'CL-MANUALES': [
    '¿Tienes documentadas las funciones y responsabilidades de cada puesto?',
    '¿Si alguien se va mañana, otra persona podría asumir sus tareas sin problema?',
    '¿El conocimiento clave de tu clínica está en la cabeza de las personas o documentado?'
  ],

  // CM - Reporting y métricas
  'CM-REPORTES': [
    '¿Generas informes periódicos sobre el rendimiento de tu clínica?',
    '¿Con qué frecuencia revisas los números de tu negocio?',
    '¿Tomas decisiones basándote en datos o en intuición?'
  ],
  'CM-METRICAS': [
    '¿Conoces tu ticket medio por paciente?',
    '¿Sabes cuál es tu tasa de ocupación real de la agenda?'
  ],
  'CM-DASHBOARDS': [
    '¿Tienes un panel donde ver de un vistazo cómo va tu clínica hoy?',
    '¿Puedes consultar tus métricas clave en tiempo real?',
    '¿Necesitas pedir a alguien que te prepare los números o los ves directamente?'
  ],

  // CN - CRM y marketing relacional
  'CN-SEGMENTACION': [
    '¿Tienes segmentados a tus pacientes por tipo de tratamiento, frecuencia o valor?',
    '¿Tratas igual a un paciente nuevo que a uno de toda la vida?',
    '¿Sabes quiénes son tus pacientes más valiosos?'
  ],
  'CN-CAMPANAS': [
    '¿Envías comunicaciones relevantes y personalizadas a tus pacientes?',
    '¿Tus campañas de marketing son genéricas o segmentadas?'
  ],
  'CN-PERSONALIZACION': [
    '¿El paciente siente un trato personalizado cuando viene a tu clínica?',
    '¿Recuerdas las preferencias y particularidades de cada paciente?',
    '¿Usas la información que tienes del paciente para mejorar su experiencia?'
  ],

  // CO - Integración tecnológica
  'CO-SOFTWARE': [
    '¿Estás satisfecho con el software que usas en tu clínica?',
    '¿Tu software actual cubre todas las necesidades de gestión?',
    '¿Cuándo fue la última vez que evaluaste si tu tecnología es la adecuada?'
  ],
  'CO-ADOPCION': [
    '¿Todo tu equipo usa correctamente las herramientas tecnológicas de la clínica?',
    '¿Pagas por funcionalidades de software que nadie utiliza?'
  ],
  'CO-FRAGMENTACION': [
    '¿Cuántas herramientas o sistemas distintos usas para gestionar tu clínica?',
    '¿Tus sistemas se comunican entre sí o tienes que pasar datos a mano?',
    '¿Has tenido errores por tener información duplicada en distintos sistemas?'
  ],

  // CP - Recordatorios y automatización
  'CP-RECORDATORIOS': [
    '¿Cómo recuerdas a los pacientes sus citas próximas?',
    '¿Alguien de tu equipo dedica tiempo a enviar recordatorios manualmente?',
    '¿Los pacientes se olvidan de sus citas con frecuencia?'
  ],
  'CP-CONFIRMACIONES': [
    '¿Tienes un sistema automático para confirmar citas?',
    '¿Los recordatorios se envían por SMS, WhatsApp, email o llamada?'
  ],
  'CP-AUTOMATICO': [
    '¿Qué tareas repetitivas de tu clínica podrían automatizarse?',
    '¿Cuántas horas a la semana pierde tu equipo en tareas que podrían ser automáticas?',
    '¿Has intentado automatizar algún proceso y no lo has conseguido?'
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
    CLINIC_PAINS,
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
    CLINIC_PAINS,
    CLUSTER_QUESTIONS,
    PAIN_COUNT,
    CLUSTER_COUNT
  };
}
