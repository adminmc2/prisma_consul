/**
 * APEX Signal Detector - Sistema de detección de FOCOS
 *
 * Pipeline:
 * 1. Respuesta del usuario → Señales detectadas
 * 2. Señales → Clusters activados con gravedad
 * 3. Clusters acumulados → FOCOS prioritarios
 * 4. FOCOS → Preguntas de profundización relevantes
 */

// ============================================================
// MAPEO DE SEÑALES PARA PHASE 1
// ============================================================

const PHASE1_SIGNAL_MAP = {

  // 1.1 Tamaño del equipo - No detecta dolor directamente, pero contextualiza
  team_size: {
    '1-5': { signals: [], clusters: [], gravedad: 0, contexto: 'equipo_pequeño' },
    '6-15': { signals: [], clusters: [], gravedad: 0, contexto: 'equipo_mediano' },
    '16-30': { signals: ['equipo grande sin sistema'], clusters: ['A-VISIBILIDAD', 'F-REPORTES'], gravedad: 1, contexto: 'equipo_grande' },
    '30+': { signals: ['equipo muy grande sin control'], clusters: ['A-VISIBILIDAD', 'F-REPORTES', 'B-CENTRALIZACION'], gravedad: 2, contexto: 'equipo_muy_grande' }
  },

  // 1.2 Equipo de campo
  has_field_team: {
    'yes': { signals: ['equipo en calle'], clusters: ['A-VISIBILIDAD'], gravedad: 0, contexto: 'con_campo' },
    'no': { signals: [], clusters: [], gravedad: 0, contexto: 'sin_campo' },
    'both': { signals: ['equipo mixto'], clusters: ['A-VISIBILIDAD', 'H-CANALES'], gravedad: 1, contexto: 'mixto' }
  },

  // 1.3 Sector - Algunos sectores tienen dolores inherentes
  sector: {
    'pharma': { signals: ['regulación estricta', 'muestras médicas'], clusters: ['C-TRAZABILIDAD', 'C-COMPLIANCE'], gravedad: 1, contexto: 'pharma' },
    'distribution': { signals: ['cartera de clientes', 'crédito'], clusters: ['E-COBRANZA', 'B-DATOS'], gravedad: 1, contexto: 'distribucion' },
    'manufacturing': { signals: [], clusters: [], gravedad: 0, contexto: 'manufactura' },
    'services': { signals: [], clusters: [], gravedad: 0, contexto: 'servicios' },
    'retail': { signals: [], clusters: [], gravedad: 0, contexto: 'retail' },
    'other': { signals: [], clusters: [], gravedad: 0, contexto: 'otro' }
  },

  // 1.4 Tecnología actual (multi-select)
  current_tech: {
    'excel': { signals: ['usamos Excel', 'archivo compartido'], clusters: ['G-EXCEL', 'B-CENTRALIZACION'], gravedad: 1 },
    'crm': { signals: ['tenemos CRM'], clusters: [], gravedad: 0 }, // Puede tener problema de adopción
    'erp': { signals: ['ERP con módulo comercial'], clusters: [], gravedad: 0 },
    'informal': { signals: ['libretas', 'WhatsApp', 'todo informal'], clusters: ['B-CENTRALIZACION', 'A-REGISTRO', 'H-CANALES'], gravedad: 2 },
    'nothing': { signals: ['no hay nada centralizado', 'cada quien lo suyo'], clusters: ['B-CENTRALIZACION', 'A-VISIBILIDAD', 'G-FRAGMENTACION'], gravedad: 3 }
  },

  // 1.5 Motivación (multi-select) - Señales explícitas del usuario
  motivation: {
    'no_visibility': { signals: ['no tengo visibilidad', 'no sé qué pasa'], clusters: ['A-VISIBILIDAD', 'F-DASHBOARDS', 'A-REGISTRO'], gravedad: 3 },
    'no_adoption': { signals: ['el equipo no registra', 'no adoptan el sistema'], clusters: ['G-ADOPCION', 'A-REGISTRO', 'P-TIEMPO'], gravedad: 3 },
    'losing_sales': { signals: ['pierdo ventas', 'se van clientes'], clusters: ['D-SEGUIMIENTO', 'D-PIPELINE', 'B-CHURN'], gravedad: 3 },
    'compliance': { signals: ['problemas con auditorías', 'regulación'], clusters: ['C-COMPLIANCE', 'C-TRAZABILIDAD', 'L-REPORTES'], gravedad: 3 },
    'system_fails': { signals: ['el sistema no funciona', 'sistema obsoleto'], clusters: ['G-ADOPCION', 'G-OBSOLESCENCIA', 'G-INTEGRACION'], gravedad: 2 },
    'growth': { signals: ['quiero crecer', 'necesito orden'], clusters: ['K-PLANIFICACION', 'D-PIPELINE', 'F-DASHBOARDS'], gravedad: 1 }
  },

  // 1.6 Calidad de datos de clientes
  data_quality: {
    'updated': { signals: [], clusters: [], gravedad: 0 },
    'somewhat': { signals: ['datos viejos', 'hay que limpiar'], clusters: ['B-DATOS'], gravedad: 1 },
    'outdated': { signals: ['datos desactualizados', 'información vieja'], clusters: ['B-DATOS', 'B-CENTRALIZACION'], gravedad: 2 },
    'unknown': { signals: ['nadie revisa los datos', 'no sé el estado'], clusters: ['B-DATOS', 'B-CENTRALIZACION', 'A-VISIBILIDAD'], gravedad: 3 }
  },

  // 1.7 Pipeline de ventas (multi-select)
  sales_pipeline: {
    'system': { signals: ['pipeline en sistema'], clusters: [], gravedad: 0 },
    'excel': { signals: ['pipeline en Excel'], clusters: ['D-PIPELINE', 'G-EXCEL'], gravedad: 1 },
    'per_seller': { signals: ['cada vendedor lleva lo suyo', 'no hay visibilidad de deals'], clusters: ['D-PIPELINE', 'D-VISIBILIDAD', 'A-VISIBILIDAD'], gravedad: 2 },
    'memory': { signals: ['oportunidades en la cabeza', 'no hay registro'], clusters: ['D-PIPELINE', 'D-VISIBILIDAD', 'B-CENTRALIZACION'], gravedad: 3 },
    'none': { signals: ['sin seguimiento formal', 'no hay pipeline'], clusters: ['D-PIPELINE', 'D-SEGUIMIENTO', 'D-FORECAST'], gravedad: 3 }
  },

  // 1.8 Vende a crédito
  sells_credit: {
    'yes_controlled': { signals: ['crédito controlado'], clusters: [], gravedad: 0 },
    'yes_some_overdue': { signals: ['facturas vencidas', 'hay cartera'], clusters: ['E-COBRANZA'], gravedad: 1 },
    'yes_problem': { signals: ['cobranza es problema', 'cartera vencida grave'], clusters: ['E-COBRANZA', 'E-RIESGO', 'F-REPORTES'], gravedad: 3 },
    'no_cash': { signals: [], clusters: [], gravedad: 0 }
  },

  // 1.9 Tiempo de reportes
  report_time: {
    'minutes': { signals: ['reportes automáticos'], clusters: [], gravedad: 0 },
    'hours': { signals: ['armo reportes manualmente'], clusters: ['F-TIEMPO'], gravedad: 1 },
    'days': { signals: ['reportes toman días', 'junto info de varios lugares'], clusters: ['F-TIEMPO', 'F-REPORTES', 'B-CENTRALIZACION'], gravedad: 2 },
    'none': { signals: ['no genero reportes', 'sin reportes formales'], clusters: ['F-REPORTES', 'F-DASHBOARDS', 'A-VISIBILIDAD'], gravedad: 3 }
  }
};

// ============================================================
// DEFINICIÓN DE FOCOS (Situaciones Problemáticas)
// ============================================================

const FOCO_DEFINITIONS = {
  'VISIBILIDAD': {
    nombre: 'Sin visibilidad del equipo',
    descripcion: 'No sabes qué hace tu equipo en campo ni cómo van las actividades diarias',
    clusters: ['A-VISIBILIDAD', 'A-REGISTRO', 'A-UBICACION', 'A-COBERTURA', 'A-PRODUCTIVIDAD'],
    umbral: 5, // Puntos mínimos para activar este FOCO
    preguntas_profundizacion: ['field_team']
  },
  'DATOS': {
    nombre: 'Datos dispersos y desactualizados',
    descripcion: 'La información de clientes está fragmentada, desactualizada o es inaccesible',
    clusters: ['B-DATOS', 'B-CENTRALIZACION', 'B-HISTORIAL', 'B-SEGMENTACION', 'B-CHURN'],
    umbral: 4,
    preguntas_profundizacion: ['excel_user', 'general']
  },
  'COMPLIANCE': {
    nombre: 'Riesgo de compliance',
    descripcion: 'Vulnerabilidad ante auditorías por falta de trazabilidad y documentación',
    clusters: ['C-COMPLIANCE', 'C-TRAZABILIDAD', 'C-INVENTARIO', 'L-TRAZABILIDAD', 'L-REPORTES'],
    umbral: 3,
    preguntas_profundizacion: ['pharma']
  },
  'PIPELINE': {
    nombre: 'Pipeline invisible',
    descripcion: 'No tienes visibilidad de las oportunidades de venta ni puedes predecir el cierre',
    clusters: ['D-PIPELINE', 'D-VISIBILIDAD', 'D-SEGUIMIENTO', 'D-FORECAST', 'D-COTIZACIONES'],
    umbral: 4,
    preguntas_profundizacion: ['general']
  },
  'COBRANZA': {
    nombre: 'Cobranza problemática',
    descripcion: 'Tienes cartera vencida y poca visibilidad del estado de pagos',
    clusters: ['E-COBRANZA', 'E-RIESGO', 'E-BLOQUEO'],
    umbral: 3,
    preguntas_profundizacion: ['credit_sales']
  },
  'REPORTES': {
    nombre: 'Reportes manuales lentos',
    descripcion: 'Generar información para dirección toma demasiado tiempo',
    clusters: ['F-TIEMPO', 'F-REPORTES', 'F-DASHBOARDS', 'F-AUTOMATIZACION', 'F-INTEGRACION'],
    umbral: 3,
    preguntas_profundizacion: ['excel_user']
  },
  'ADOPCION': {
    nombre: 'Problema de adopción tecnológica',
    descripcion: 'El equipo no usa las herramientas o las usa mal',
    clusters: ['G-ADOPCION', 'G-EXCEL', 'G-FRAGMENTACION', 'G-OBSOLESCENCIA', 'G-INTEGRACION'],
    umbral: 4,
    preguntas_profundizacion: ['crm_adoption']
  }
};

// ============================================================
// CLASE ACUMULADOR DE CLUSTERS
// ============================================================

class ClusterAccumulator {
  constructor() {
    this.clusterScores = {};
    this.signalsDetected = [];
    this.contexto = {};
    this.focos = [];
  }

  /**
   * Procesa una respuesta de Phase 1
   * @param {string} question - Nombre de la pregunta (ej: 'team_size')
   * @param {string|array} value - Valor seleccionado
   */
  processPhase1Response(question, value) {
    const mapping = PHASE1_SIGNAL_MAP[question];
    if (!mapping) return;

    // Si es multi-select (array)
    const values = Array.isArray(value) ? value : [value];

    values.forEach(val => {
      const optionMapping = mapping[val];
      if (!optionMapping) return;

      // Guardar contexto
      if (optionMapping.contexto) {
        this.contexto[question] = optionMapping.contexto;
      }

      // Registrar señales
      optionMapping.signals.forEach(signal => {
        this.signalsDetected.push({
          signal,
          from: question,
          value: val
        });
      });

      // Acumular puntos por cluster
      optionMapping.clusters.forEach((cluster, index) => {
        // Mayor peso a clusters principales (primeros en la lista)
        const weight = optionMapping.gravedad * (3 - Math.min(index, 2));
        this.clusterScores[cluster] = (this.clusterScores[cluster] || 0) + weight;
      });
    });
  }

  /**
   * Procesa una respuesta de Phase 2 (ya tiene detecta y gravedad)
   * @param {object} response - { detects: [], gravedad: number }
   */
  processPhase2Response(response) {
    if (!response.detects) return;

    response.detects.forEach((cluster, index) => {
      const weight = (response.gravedad || 1) * (3 - Math.min(index, 2));
      this.clusterScores[cluster] = (this.clusterScores[cluster] || 0) + weight;
    });
  }

  /**
   * Procesa dolores detectados por investigación de empresa
   * @param {object} doloresProbables - { prioridad_alta: [], prioridad_media: [] }
   */
  processResearchDolores(doloresProbables) {
    if (!doloresProbables) return;

    (doloresProbables.prioridad_alta || []).forEach(cluster => {
      this.clusterScores[cluster] = (this.clusterScores[cluster] || 0) + 5;
    });

    (doloresProbables.prioridad_media || []).forEach(cluster => {
      this.clusterScores[cluster] = (this.clusterScores[cluster] || 0) + 2;
    });
  }

  /**
   * Calcula los FOCOS prioritarios basado en clusters acumulados
   * @returns {array} FOCOS ordenados por puntuación
   */
  calculateFocos() {
    const focoScores = {};

    // Para cada FOCO, sumar los puntos de sus clusters
    Object.entries(FOCO_DEFINITIONS).forEach(([focoId, foco]) => {
      let score = 0;
      let clustersActivos = [];

      foco.clusters.forEach(cluster => {
        if (this.clusterScores[cluster]) {
          score += this.clusterScores[cluster];
          clustersActivos.push(cluster);
        }
      });

      // Solo incluir si supera el umbral
      if (score >= foco.umbral) {
        focoScores[focoId] = {
          id: focoId,
          nombre: foco.nombre,
          descripcion: foco.descripcion,
          score,
          clustersActivos,
          preguntas_profundizacion: foco.preguntas_profundizacion
        };
      }
    });

    // Ordenar por score descendente
    this.focos = Object.values(focoScores)
      .sort((a, b) => b.score - a.score);

    return this.focos;
  }

  /**
   * Obtiene los clusters más relevantes para generar preguntas Phase 2
   * @param {number} limit - Número máximo de categorías
   * @returns {array} Categorías de preguntas a incluir
   */
  getQuestionCategories(limit = 5) {
    const categories = new Set();

    // De los FOCOS detectados, obtener categorías de preguntas
    this.focos.slice(0, 4).forEach(foco => {
      foco.preguntas_profundizacion.forEach(cat => categories.add(cat));
    });

    // Siempre incluir 'general'
    categories.add('general');

    return [...categories].slice(0, limit);
  }

  /**
   * Obtiene un resumen para debugging
   */
  getSummary() {
    const sortedClusters = Object.entries(this.clusterScores)
      .sort((a, b) => b[1] - a[1]);

    return {
      totalSignals: this.signalsDetected.length,
      contexto: this.contexto,
      topClusters: sortedClusters.slice(0, 10),
      focos: this.focos.map(f => ({ nombre: f.nombre, score: f.score })),
      questionCategories: this.getQuestionCategories()
    };
  }
}

// ============================================================
// FUNCIONES DE UTILIDAD
// ============================================================

/**
 * Procesa todas las respuestas de Phase 1 y calcula FOCOS
 * @param {object} phase1Responses - Respuestas de FormState.responses.phase1
 * @param {object} companyProfile - Perfil de investigación de empresa
 * @returns {ClusterAccumulator} Acumulador con FOCOS calculados
 */
function processAllPhase1(phase1Responses, companyProfile = null) {
  const accumulator = new ClusterAccumulator();

  // Procesar cada respuesta de Phase 1
  Object.entries(phase1Responses).forEach(([question, value]) => {
    accumulator.processPhase1Response(question, value);
  });

  // Procesar dolores de investigación si existen
  if (companyProfile?.dolores_probables) {
    accumulator.processResearchDolores(companyProfile.dolores_probables);
  }

  // Calcular FOCOS
  accumulator.calculateFocos();

  return accumulator;
}

/**
 * Selecciona preguntas de Phase 2 basadas en los FOCOS detectados
 * @param {ClusterAccumulator} accumulator - Acumulador con FOCOS
 * @param {object} questionBank - Banco de preguntas por categoría
 * @param {number} maxQuestions - Número máximo de preguntas
 * @returns {array} Preguntas seleccionadas
 */
function selectQuestionsFromFocos(accumulator, questionBank, maxQuestions = 5) {
  const categories = accumulator.getQuestionCategories();
  const selectedQuestions = [];
  const usedCategories = new Set();

  // Primera pasada: una pregunta por categoría prioritaria
  categories.forEach(category => {
    if (questionBank[category] && selectedQuestions.length < maxQuestions) {
      const categoryQuestions = questionBank[category];
      if (categoryQuestions.length > 0) {
        selectedQuestions.push(categoryQuestions[0]);
        usedCategories.add(category);
      }
    }
  });

  // Segunda pasada: completar con más preguntas de categorías activas
  if (selectedQuestions.length < maxQuestions) {
    categories.forEach(category => {
      if (questionBank[category]) {
        const categoryQuestions = questionBank[category];
        for (let i = 1; i < categoryQuestions.length && selectedQuestions.length < maxQuestions; i++) {
          // Evitar duplicados
          if (!selectedQuestions.includes(categoryQuestions[i])) {
            selectedQuestions.push(categoryQuestions[i]);
          }
        }
      }
    });
  }

  return selectedQuestions;
}

// Exportar para uso en form.js
if (typeof window !== 'undefined') {
  window.PHASE1_SIGNAL_MAP = PHASE1_SIGNAL_MAP;
  window.FOCO_DEFINITIONS = FOCO_DEFINITIONS;
  window.ClusterAccumulator = ClusterAccumulator;
  window.processAllPhase1 = processAllPhase1;
  window.selectQuestionsFromFocos = selectQuestionsFromFocos;
}

// Para Node.js (testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PHASE1_SIGNAL_MAP,
    FOCO_DEFINITIONS,
    ClusterAccumulator,
    processAllPhase1,
    selectQuestionsFromFocos
  };
}
