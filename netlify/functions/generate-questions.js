/**
 * Netlify Function: Generate Questions
 * Genera preguntas de profundización usando Claude API + base de conocimiento de dolores
 *
 * ARQUITECTURA SERVER-SIDE RAG:
 * 1. Recibe del frontend: top4, rankOrder, tipoNegocio, perfil research
 * 2. Carga pain-knowledge-base.js en servidor (require)
 * 3. Filtra pains relevantes por categorías seleccionadas
 * 4. Envía contexto reducido a Claude para generar preguntas inteligentes
 * 5. Devuelve preguntas estructuradas al frontend
 */

// Se lee dentro del handler para que netlify dev la inyecte a tiempo
let ANTHROPIC_API_KEY;

// Cargar base de conocimiento (server-side, nunca expuesta al frontend)
const { PAIN_CATALOG, PAIN_CLUSTERS, CLUSTER_QUESTIONS } = require('./lib/pain-knowledge-base.js');

// Mapeo de situaciones para dar contexto a Claude
const SITUACIONES = {
  // Distribuidores
  'A': { titulo: 'No sé qué hace mi equipo de campo', descripcion: 'Sin visibilidad de actividades, rutas ni resultados del equipo en la calle.' },
  'B': { titulo: 'Mi base de clientes está desordenada', descripcion: 'Datos dispersos, desactualizados o cada vendedor tiene su propia lista.' },
  'C': { titulo: 'Las muestras médicas no tienen control', descripcion: 'Sin trazabilidad de muestras, lotes ni entregas para auditorías.' },
  'D': { titulo: 'Las oportunidades de venta se pierden', descripcion: 'Sin pipeline visible, cotizaciones no registradas, negociaciones sin seguimiento.' },
  'E': { titulo: 'La cobranza es un dolor de cabeza', descripcion: 'Facturas vencidas sin seguimiento, sin alertas automáticas.' },
  'F': { titulo: 'Los reportes me quitan el día', descripcion: 'Generar reportes toma horas porque hay que buscar y consolidar datos de varios lugares.' },
  'G': { titulo: 'La tecnología actual no funciona', descripcion: 'Excel, WhatsApp o CRM que nadie adopta. Información fragmentada.' },
  'H': { titulo: 'La comunicación interna falla', descripcion: 'Mensajes importantes se pierden, sin canal oficial, coordinación complicada.' },
  'I': { titulo: 'Los clientes se quejan del servicio', descripcion: 'Sin seguimiento a promesas, tardanza en responder, clientes desatendidos.' },
  'J': { titulo: 'El marketing no se mide', descripcion: 'Campañas sin ROI, sin atribución de resultados.' },
  'K': { titulo: 'Planeamos a ciegas', descripcion: 'Sin datos para decisiones estratégicas, planes por intuición.' },
  'L': { titulo: 'Las auditorías me asustan', descripcion: 'Documentos dispersos, firmas sin digitalizar, trazabilidad incompleta.' },
  'M': { titulo: 'Capacitar al equipo es difícil', descripcion: 'Nuevos tardan mucho, sin material, rotación obliga a empezar de cero.' },
  'N': { titulo: 'Los eventos no dan resultados', descripcion: 'Congresos sin captura de leads ni medición de impacto.' },
  'O': { titulo: 'No sé qué hace la competencia', descripcion: 'Desconoces estrategias, productos y movimientos de competidores.' },
  'P': { titulo: 'Trabajo manual que debería ser automático', descripcion: 'Tareas repetitivas: recordatorios, reportes, asignaciones, seguimientos.' },
  // Clínicas
  'CA': { titulo: 'No controlo las citas', descripcion: 'Citas por WhatsApp/teléfono, cancelaciones sin aviso, huecos en agenda.' },
  'CB': { titulo: 'Los pacientes no vuelven', descripcion: 'Sin seguimiento post-tratamiento, sin recordatorio de revisiones.' },
  'CC': { titulo: 'Los historiales son un caos', descripcion: 'Expedientes en papel, fotos en el móvil del doctor, información dispersa.' },
  'CD': { titulo: 'No sé qué tratamientos son rentables', descripcion: 'Sin medición de margen por servicio, costos reales desconocidos.' },
  'CE': { titulo: 'La facturación me quita tiempo', descripcion: 'Facturas manuales, errores de cobro, pagos pendientes sin seguimiento.' },
  'CF': { titulo: 'El stock de insumos falla', descripcion: 'Falta material el día del procedimiento, sin alertas de inventario.' },
  'CG': { titulo: 'No tengo presencia digital', descripcion: 'Sin web profesional, redes descuidadas, no atrae pacientes nuevos.' },
  'CH': { titulo: 'La comunicación con el paciente falla', descripcion: 'Sin confirmación automática de citas, sin preparación pre-consulta.' },
  'CI': { titulo: 'Las quejas me sorprenden', descripcion: 'Sin medición de satisfacción, quejas aparecen en Google Reviews.' },
  'CJ': { titulo: 'El equipo no sigue protocolos', descripcion: 'Cada profesional diferente, sin checklists ni estándares documentados.' },
  'CK': { titulo: 'No cumplo con normativa', descripcion: 'Consentimientos sin firmar, datos sin proteger, documentación incompleta.' },
  'CL': { titulo: 'Capacitar al personal es difícil', descripcion: 'Rotación alta, sin manual de procedimientos, cada nuevo empieza de cero.' },
  'CM': { titulo: 'Los reportes me cuestan horas', descripcion: 'Consolidar datos de ocupación, facturación y pacientes es manual.' },
  'CN': { titulo: 'No aprovecho los datos de pacientes', descripcion: 'Sin segmentación, sin campañas de reactivación, sin personalización.' },
  'CO': { titulo: 'La tecnología no me ayuda', descripcion: 'Software viejo o genérico, Excel para todo, WhatsApp como único canal.' },
  'CP': { titulo: 'Hago todo manual pudiendo automatizar', descripcion: 'Recordatorios, confirmaciones, seguimientos... todo a mano o no se hace.' }
};

// Helper para fetch con timeout
async function fetchWithTimeout(url, options, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Filtra pains relevantes de la base de conocimiento según categorías seleccionadas
 * Solo envía a Claude los pains que importan (~30-60 en vez de 500+)
 */
function getRelevantPains(categoryIds) {
  const relevantPains = {};
  const relevantClusters = {};
  const relevantQuestions = {};

  categoryIds.forEach(catId => {
    // Para categorías de distribuidor (A-P): buscar pains con código que empiece con esa letra
    // Para categorías de clínica (CA-CP): buscar por el prefijo de 2 letras
    const prefix = catId.length === 1 ? catId : catId;

    // Filtrar pains del catálogo
    Object.entries(PAIN_CATALOG).forEach(([code, pain]) => {
      // A01 empieza con A, CA01 empieza con CA
      if (code.startsWith(prefix) && code.match(/^[A-Z]{1,2}\d/)) {
        relevantPains[code] = {
          title: pain.title,
          cluster: pain.cluster,
          signals: pain.signals,
          question_hint: pain.question_hint
        };
      }
    });

    // Filtrar clusters relacionados
    Object.entries(PAIN_CLUSTERS).forEach(([clusterId, cluster]) => {
      if (cluster.category === catId || clusterId.startsWith(catId + '-')) {
        relevantClusters[clusterId] = {
          title: cluster.title,
          description: cluster.description
        };
      }
    });

    // Filtrar preguntas de cluster
    Object.entries(CLUSTER_QUESTIONS).forEach(([clusterId, questions]) => {
      if (clusterId.startsWith(catId + '-') || clusterId.startsWith(prefix + '-')) {
        relevantQuestions[clusterId] = questions;
      }
    });
  });

  return { relevantPains, relevantClusters, relevantQuestions };
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let parsedTipoNegocio = 'distribuidor';
  try {
    // CLAUDE_API_KEY porque la extensión Neon de Netlify sobrescribe ANTHROPIC_API_KEY con un JWT
    ANTHROPIC_API_KEY = (process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY || '').trim();
    console.log('API key available:', !!ANTHROPIC_API_KEY, '| length:', ANTHROPIC_API_KEY?.length, '| valid:', ANTHROPIC_API_KEY?.startsWith('sk-ant-'));

    const {
      top4,           // ['A', 'D', 'F', 'G'] - los 4 IDs más importantes
      rankOrder,      // ['A', 'D', 'F', 'G', 'B', 'E'] - TODOS en orden
      tipoNegocio,    // 'distribuidor' | 'clinica'
      researchProfile, // perfil de research-company (puede ser null)
      phase1Responses  // respuestas de fase 1 (puede ser null)
    } = JSON.parse(event.body);
    parsedTipoNegocio = tipoNegocio || 'distribuidor';

    if (!top4 || top4.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'top4 is required' })
      };
    }

    // Todas las categorías seleccionadas (top4 + secundarias)
    const allCategories = rankOrder || top4;
    const secondaryCategories = allCategories.filter(id => !top4.includes(id));

    // --- PASO 1: Filtrar base de conocimiento (RAG server-side) ---
    const { relevantPains, relevantClusters, relevantQuestions } = getRelevantPains(allCategories);

    const painCount = Object.keys(relevantPains).length;
    const clusterCount = Object.keys(relevantClusters).length;
    console.log(`Filtered knowledge base: ${painCount} pains, ${clusterCount} clusters for categories: ${allCategories.join(', ')}`);

    // --- PASO 2: Construir contexto de situaciones ---
    const top4Context = top4.map((id, i) => {
      const sit = SITUACIONES[id];
      return `${i + 1}. [${id}] ${sit?.titulo || id}: ${sit?.descripcion || ''}`;
    }).join('\n');

    const secondaryContext = secondaryCategories.length > 0
      ? secondaryCategories.map(id => {
          const sit = SITUACIONES[id];
          return `- [${id}] ${sit?.titulo || id}`;
        }).join('\n')
      : 'Ninguna';

    // --- PASO 3: Contexto de research (si existe) ---
    let researchContext = '';
    if (researchProfile) {
      const empresa = researchProfile.empresa || {};
      const detectado = researchProfile.detectado || {};
      researchContext = `
INFORMACIÓN CONOCIDA DE LA EMPRESA (investigación previa):
- Nombre: ${empresa.nombre || 'Desconocido'}
- Sector: ${empresa.sector || detectado.sector || 'No determinado'}
- Descripción: ${empresa.descripcion_procesos || 'No disponible'}
- Tiene equipo campo: ${detectado.tiene_equipo_campo ?? 'No sabemos'}
- Usa CRM/sistema: ${detectado.usa_crm_o_sistema ?? 'No sabemos'}
- Vende a crédito: ${detectado.vende_a_credito ?? 'No sabemos'}
- Tiene dashboards: ${detectado.tiene_dashboards_reportes ?? 'No sabemos'}
- Confianza de datos: ${detectado.confianza || 0}

IMPORTANTE: NO repitas preguntas sobre información que ya sabemos. Si ya sabemos que tienen equipo de campo, no preguntes "¿tienes equipo de campo?". Usa lo que sabemos para hacer preguntas MÁS PROFUNDAS.`;
    }

    // --- PASO 4: Formatear pains relevantes como contexto ---
    // Agrupar pains por cluster para dar contexto más rico
    const painsByCluster = {};
    Object.entries(relevantPains).forEach(([code, pain]) => {
      if (!painsByCluster[pain.cluster]) {
        painsByCluster[pain.cluster] = [];
      }
      painsByCluster[pain.cluster].push({ code, ...pain });
    });

    let painContext = 'DOLORES CONOCIDOS POR CATEGORÍA (base de conocimiento interna):\n';
    Object.entries(painsByCluster).forEach(([clusterId, pains]) => {
      const cluster = relevantClusters[clusterId];
      painContext += `\n[${clusterId}] ${cluster?.title || clusterId}: ${cluster?.description || ''}\n`;
      pains.slice(0, 5).forEach(p => {
        painContext += `  - ${p.code}: "${p.title}" → señales: ${(p.signals || []).slice(0, 3).join(', ')}\n`;
      });
    });

    // Incluir preguntas de referencia de la base de conocimiento
    let questionHintsContext = '\nPREGUNTAS DE REFERENCIA POR CLUSTER (úsalas como inspiración, NO las copies textualmente):\n';
    Object.entries(relevantQuestions).forEach(([clusterId, questions]) => {
      if (questions && questions.length > 0) {
        questionHintsContext += `  ${clusterId}: ${questions.slice(0, 2).join(' | ')}\n`;
      }
    });

    // --- PASO 5: Prompt para Claude ---
    const esClinica = tipoNegocio === 'clinica';

    const systemPrompt = `Eres un consultor experto en diagnóstico empresarial para ${esClinica ? 'clínicas y centros de salud' : 'empresas con equipo comercial y de campo'}.

Tu trabajo es generar preguntas de profundización que revelen la DINÁMICA REAL de cómo opera la empresa. No preguntas genéricas — preguntas que descubran procesos, fricciones y relaciones entre problemas.

PRINCIPIOS DE LAS PREGUNTAS:
1. DINÁMICAS, NO ESTÁTICAS: No preguntes "¿tienes X?". Pregunta "¿qué pasa cuando...?", "¿cómo resuelves...?", "¿quién decide...?"
2. CRUZAN CATEGORÍAS: Una buena pregunta toca 2-3 situaciones. Ej: si tiene problemas de visibilidad (A) Y reportes (F), pregunta "Cuando dirección te pide resultados del equipo, ¿de dónde sacas los datos?"
3. REVELAN PROCESOS: Descubre cómo fluye la información, quién toma decisiones, dónde se atasca el trabajo
4. NO REPITEN: Si la investigación ya reveló algo, no lo preguntes — profundiza desde ahí
5. CONTEXTUALES: Usa el sector y tipo de empresa para hacer preguntas específicas, no genéricas
6. CONVERSACIONALES: Tono directo, como si estuvieras en una reunión. Nada de "¿podría indicar...?" — más bien "¿Qué pasa cuando...?"

REGLAS DE FORMATO:
- Genera entre 5 y 8 preguntas
- Cada pregunta debe tener exactamente 4 opciones de respuesta
- Las opciones van de MEJOR situación (gravedad 0) a PEOR situación (gravedad 3)
- Cada opción debe indicar qué clusters de dolor detecta (usa los códigos de la base de conocimiento)
- La primera opción SIEMPRE debe ser la situación ideal (gravedad 0, detecta: [])
- Las opciones deben ser realistas y mutuamente excluyentes

DISTRIBUCIÓN:
- Al menos 3 preguntas sobre el TOP 4 (los focos principales)
- Al menos 1 pregunta que CRUCE categorías (toque 2+ situaciones)
- Al menos 1 pregunta sobre las categorías secundarias (si existen)
- Las preguntas deben cubrir diferentes clusters, no repetir el mismo dolor`;

    const userPrompt = `${researchContext}

TIPO DE NEGOCIO: ${esClinica ? 'Clínica / Centro de salud' : 'Distribuidor / Empresa con equipo comercial'}

4 FOCOS PRINCIPALES (en orden de importancia):
${top4Context}

CATEGORÍAS SECUNDARIAS (también les afectan):
${secondaryContext}

${painContext}
${questionHintsContext}

Genera las preguntas de profundización en este formato JSON exacto:

{
  "preguntas": [
    {
      "texto": "¿Pregunta aquí?",
      "hint": "Contexto corto para el usuario (1 línea)",
      "profundiza_en": "Nombre corto del tema",
      "cruza_categorias": ["A", "F"],
      "opciones": [
        { "texto": "Mejor escenario", "detecta": [], "gravedad": 0 },
        { "texto": "Escenario leve", "detecta": ["CLUSTER-ID"], "gravedad": 1 },
        { "texto": "Escenario medio", "detecta": ["CLUSTER-ID", "CLUSTER-ID2"], "gravedad": 2 },
        { "texto": "Peor escenario", "detecta": ["CLUSTER-ID", "CLUSTER-ID2", "CLUSTER-ID3"], "gravedad": 3 }
      ]
    }
  ]
}

Responde SOLO con el JSON, sin markdown ni explicaciones.`;

    // --- PASO 6: Llamar a Claude API ---
    console.log('Calling Claude API...');
    const claudeResponse = await fetchWithTimeout(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4000,
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt,
          temperature: 0.7
        })
      },
      55000
    );

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('Claude API error:', claudeResponse.status, errorText);
      throw new Error(`Claude API error: ${claudeResponse.status}`);
    }

    const claudeData = await claudeResponse.json();
    let content = claudeData.content[0]?.text || '';

    // Limpiar markdown si viene envuelto
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in Claude response');
    }

    // Limpiar trailing commas que Claude a veces genera (,] o ,})
    let jsonStr = jsonMatch[0]
      .replace(/,\s*]/g, ']')
      .replace(/,\s*}/g, '}');

    const result = JSON.parse(jsonStr);

    if (!result.preguntas || !Array.isArray(result.preguntas)) {
      throw new Error('Invalid response structure: missing preguntas array');
    }

    // Validar y sanitizar cada pregunta
    const validQuestions = result.preguntas.filter(q => {
      return q.texto && q.opciones && Array.isArray(q.opciones) && q.opciones.length >= 3;
    }).map(q => ({
      texto: q.texto,
      hint: q.hint || '',
      profundiza_en: q.profundiza_en || '',
      cruza_categorias: q.cruza_categorias || [],
      opciones: q.opciones.map(opt => ({
        texto: opt.texto,
        detecta: Array.isArray(opt.detecta) ? opt.detecta : [],
        gravedad: typeof opt.gravedad === 'number' ? opt.gravedad : 0
      }))
    }));

    console.log(`Generated ${validQuestions.length} valid questions`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        questions: validQuestions,
        meta: {
          painCount,
          clusterCount,
          categoriesUsed: allCategories,
          model: 'claude-haiku-4-5-20251001'
        }
      })
    };

  } catch (error) {
    console.error('Error generating questions:', error);

    // Devolver preguntas fallback genéricas
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        questions: getFallbackQuestions(parsedTipoNegocio),
        meta: { fallback: true }
      })
    };
  }
};

/**
 * Preguntas fallback si Claude falla
 */
function getFallbackQuestions(tipoNegocio) {
  if (tipoNegocio === 'clinica') {
    return [
      {
        texto: '¿Cómo gestionas las citas de tu clínica?',
        hint: 'Agenda, reservas, canales de entrada',
        profundiza_en: 'Control de agenda',
        cruza_categorias: ['CA'],
        opciones: [
          { texto: 'Sistema digital centralizado con reservas online', detecta: [], gravedad: 0 },
          { texto: 'Excel o Google Calendar, funciona más o menos', detecta: ['CA01'], gravedad: 1 },
          { texto: 'Libreta o WhatsApp, a veces se cruzan citas', detecta: ['CA01', 'CA04', 'CA05'], gravedad: 2 },
          { texto: 'Cada doctor lleva su propia agenda y es un caos', detecta: ['CA01', 'CA04', 'CA05', 'CA10'], gravedad: 3 }
        ]
      },
      {
        texto: '¿Qué pasa cuando un paciente no vuelve después de su tratamiento?',
        hint: 'Seguimiento, retención, reactivación',
        profundiza_en: 'Retención de pacientes',
        cruza_categorias: ['CB'],
        opciones: [
          { texto: 'Le contactamos automáticamente para seguimiento', detecta: [], gravedad: 0 },
          { texto: 'A veces llamamos, pero no siempre', detecta: ['CB01'], gravedad: 1 },
          { texto: 'No hacemos seguimiento, esperamos que vuelva', detecta: ['CB01', 'CB02'], gravedad: 2 },
          { texto: 'Ni sabemos quiénes dejaron de venir', detecta: ['CB01', 'CB02', 'CB06'], gravedad: 3 }
        ]
      },
      {
        texto: '¿Dónde están los expedientes e historiales de tus pacientes?',
        hint: 'Expedientes, fotos clínicas, notas',
        profundiza_en: 'Historiales clínicos',
        cruza_categorias: ['CC'],
        opciones: [
          { texto: 'Todo digital en un solo sistema', detecta: [], gravedad: 0 },
          { texto: 'Digital pero repartido en varios sitios', detecta: ['CC03'], gravedad: 1 },
          { texto: 'Mezcla de papel y digital, las fotos en el móvil del doctor', detecta: ['CC01', 'CC02', 'CC03'], gravedad: 2 },
          { texto: 'Papel, carpetas, y cada doctor guarda lo suyo', detecta: ['CC01', 'CC02', 'CC03', 'CC08'], gravedad: 3 }
        ]
      },
      {
        texto: '¿Sabes cuáles de tus tratamientos son realmente rentables?',
        hint: 'Márgenes, costos, pricing',
        profundiza_en: 'Rentabilidad',
        cruza_categorias: ['CD'],
        opciones: [
          { texto: 'Sí, tengo análisis de margen por servicio', detecta: [], gravedad: 0 },
          { texto: 'Más o menos, pero no con datos exactos', detecta: ['CD01'], gravedad: 1 },
          { texto: 'No realmente, cobro lo que cobran los demás', detecta: ['CD01', 'CD05'], gravedad: 2 },
          { texto: 'Ni idea, sospecho que algunos me cuestan más de lo que cobro', detecta: ['CD01', 'CD03', 'CD05'], gravedad: 3 }
        ]
      },
      {
        texto: '¿Cómo confirmas las citas con tus pacientes?',
        hint: 'Recordatorios, confirmaciones, no-shows',
        profundiza_en: 'Comunicación con pacientes',
        cruza_categorias: ['CH', 'CA'],
        opciones: [
          { texto: 'Recordatorios automáticos por SMS/WhatsApp', detecta: [], gravedad: 0 },
          { texto: 'La recepcionista llama uno por uno', detecta: ['CH01', 'CH04'], gravedad: 1 },
          { texto: 'A veces confirmamos, a veces no da tiempo', detecta: ['CH01', 'CH04', 'CA02'], gravedad: 2 },
          { texto: 'No confirmamos, muchos no se presentan', detecta: ['CH01', 'CH04', 'CA02', 'CA10'], gravedad: 3 }
        ]
      }
    ];
  }

  return [
    {
      texto: '¿Cómo te enteras de lo que hizo tu equipo hoy?',
      hint: 'Visitas, llamadas, reuniones realizadas',
      profundiza_en: 'Visibilidad',
      cruza_categorias: ['A'],
      opciones: [
        { texto: 'Tengo un dashboard en tiempo real', detecta: [], gravedad: 0 },
        { texto: 'Me mandan WhatsApp o correo', detecta: ['A-VISIBILIDAD'], gravedad: 1 },
        { texto: 'Les pregunto uno por uno', detecta: ['A-VISIBILIDAD', 'A-REGISTRO'], gravedad: 2 },
        { texto: 'No sé hasta que me dicen', detecta: ['A-VISIBILIDAD', 'A-REGISTRO', 'G-ADOPCION'], gravedad: 3 }
      ]
    },
    {
      texto: '¿Dónde vive la información de tus clientes?',
      hint: 'Datos de contacto, historial, preferencias',
      profundiza_en: 'Centralización',
      cruza_categorias: ['B'],
      opciones: [
        { texto: 'En un sistema centralizado que todos usan', detecta: [], gravedad: 0 },
        { texto: 'En Excel, pero hay una versión "oficial"', detecta: ['G-EXCEL'], gravedad: 1 },
        { texto: 'Cada vendedor tiene su propia lista', detecta: ['B-CENTRALIZACION'], gravedad: 2 },
        { texto: 'Dispersa en varios lugares', detecta: ['B-CENTRALIZACION', 'B-DATOS'], gravedad: 3 }
      ]
    },
    {
      texto: '¿Cómo das seguimiento a oportunidades de venta?',
      hint: 'Prospectos, cotizaciones, negociaciones',
      profundiza_en: 'Pipeline',
      cruza_categorias: ['D'],
      opciones: [
        { texto: 'Pipeline en sistema con etapas claras', detecta: [], gravedad: 0 },
        { texto: 'Lista en Excel que actualizo', detecta: ['D-PIPELINE'], gravedad: 1 },
        { texto: 'Cada vendedor tiene su método', detecta: ['D-PIPELINE', 'D-SEGUIMIENTO'], gravedad: 2 },
        { texto: 'Se nos pierden oportunidades', detecta: ['D-PIPELINE', 'D-SEGUIMIENTO', 'D-VISIBILIDAD'], gravedad: 3 }
      ]
    },
    {
      texto: '¿Cuánto tardas en generar un reporte para dirección?',
      hint: 'Ventas, visitas, resultados del mes',
      profundiza_en: 'Reportes',
      cruza_categorias: ['F'],
      opciones: [
        { texto: 'Minutos, está automatizado', detecta: [], gravedad: 0 },
        { texto: 'Un par de horas', detecta: ['F-TIEMPO'], gravedad: 1 },
        { texto: 'Me toma casi todo el día', detecta: ['F-TIEMPO', 'F-AUTOMATIZACION'], gravedad: 2 },
        { texto: 'Días, junto info de todos lados', detecta: ['F-TIEMPO', 'F-AUTOMATIZACION', 'F-DASHBOARDS'], gravedad: 3 }
      ]
    },
    {
      texto: '¿Qué pasa cuando un vendedor se va de la empresa?',
      hint: 'Clientes, historial, conocimiento',
      profundiza_en: 'Continuidad',
      cruza_categorias: ['B'],
      opciones: [
        { texto: 'Todo queda en el sistema', detecta: [], gravedad: 0 },
        { texto: 'Hay que pedirle que entregue sus archivos', detecta: ['B-CENTRALIZACION'], gravedad: 1 },
        { texto: 'Se pierde algo de información', detecta: ['B-CENTRALIZACION', 'B-DATOS'], gravedad: 2 },
        { texto: 'Se lleva todo en la cabeza', detecta: ['B-CENTRALIZACION', 'B-DATOS', 'A-CONOCIMIENTO'], gravedad: 3 }
      ]
    }
  ];
}
