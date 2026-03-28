/**
 * APEX Routes
 * Research company (Tavily+Groq), generate questions (Claude), submit form
 */

const express = require('express');
const { neon } = require('@neondatabase/serverless');
const nodemailer = require('nodemailer');
const { fetchWithTimeout } = require('../lib/fetch-timeout');
const { PAIN_CATALOG, PAIN_CLUSTERS, CLUSTER_QUESTIONS } = require('../lib/pain-knowledge-base');

const router = express.Router();

// ── SITUACIONES (contexto para Claude) ─────────────────

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

// ── RESEARCH COMPANY ───────────────────────────────────

router.post('/research-company', async (req, res) => {
  try {
    const { companyName, website } = req.body;

    if (!companyName && !website) {
      return res.status(400).json({ error: 'Company name or website required' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

    const searchQuery = website || companyName;
    let webSearchResults = null;
    let searchExecuted = false;
    let tavilyAnswer = null;
    let tavilySources = [];

    function extractNameFromUrl(url) {
      try {
        const hostname = new URL(url).hostname.replace('www.', '');
        return hostname.split('.')[0].replace(/[-_]/g, ' ');
      } catch {
        return url;
      }
    }

    const isUrl = website && (website.startsWith('http') || website.includes('.'));
    const companyNameForSearch = companyName || (isUrl ? extractNameFromUrl(website) : searchQuery);

    // PASO 1: Búsqueda web con TAVILY
    if (TAVILY_API_KEY) {
      const extractPromise = isUrl ? (async () => {
        try {
          const extractResponse = await fetchWithTimeout(
            'https://api.tavily.com/extract',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TAVILY_API_KEY}`
              },
              body: JSON.stringify({
                urls: [website],
                extract_depth: 'basic',
                chunks_per_source: 3,
                format: 'text'
              })
            },
            12000
          );

          if (extractResponse.ok) {
            const extractData = await extractResponse.json();
            if (extractData.results && extractData.results.length > 0) {
              let content = extractData.results[0].raw_content;
              if (content && content.length > 3000) {
                content = content.substring(0, 3000) + '...';
              }
              return content;
            }
          }
          return null;
        } catch (err) {
          console.error('Tavily extract failed:', err.message);
          return null;
        }
      })() : Promise.resolve(null);

      const searchPromise = (async () => {
        try {
          const tavilyResponse = await fetchWithTimeout(
            'https://api.tavily.com/search',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                api_key: TAVILY_API_KEY,
                query: `"${companyNameForSearch}" qué hace servicios sector`,
                search_depth: 'advanced',
                include_answer: true,
                max_results: 5,
                exclude_domains: ['linguee.com', 'wordreference.com', 'bab.la', 'translate.google.com', 'deepl.com', 'reverso.net', 'fastercapital.com', 'edirectorio.net']
              })
            },
            12000
          );

          if (tavilyResponse.ok) return await tavilyResponse.json();
          return null;
        } catch (err) {
          console.error('Tavily search failed:', err.message);
          return null;
        }
      })();

      const [extractedContent, searchData] = await Promise.all([extractPromise, searchPromise]);

      if (searchData) {
        tavilyAnswer = searchData.answer || null;
        if (searchData.results && searchData.results.length > 0) {
          tavilySources = searchData.results.map(r => ({
            title: r.title, url: r.url, content: r.content
          }));
          webSearchResults = searchData.results.map(r => `${r.title}: ${r.content}`).join('\n\n');
          searchExecuted = true;
        }
      }

      if (extractedContent) {
        tavilySources.unshift({
          title: 'Sitio web de la empresa',
          url: website,
          content: extractedContent.substring(0, 300)
        });
        webSearchResults = (webSearchResults || '') + '\n\nCONTENIDO DIRECTO DEL SITIO WEB:\n' + extractedContent;
        searchExecuted = true;
      }
    }

    // PASO 2: Groq para estructurar
    const systemPrompt = `Eres un analista que detecta PROCESOS empresariales para un sistema CRM.

${webSearchResults ? `INFORMACIÓN ENCONTRADA EN BÚSQUEDA WEB:
${tavilyAnswer ? `RESUMEN: ${tavilyAnswer}\n\n` : ''}
DETALLES:
${webSearchResults}` : 'No hay información web disponible. El usuario deberá responder todas las preguntas.'}

Tu objetivo es determinar:
1. Qué información YA SABEMOS con certeza (basado en la búsqueda)
2. Qué información NO SABEMOS y debemos preguntar
3. Qué PROCESOS tiene la empresa para detectar sus dolores operativos

IMPORTANTE: Solo marca como "detectado" lo que esté EXPLÍCITAMENTE en la búsqueda.
NO asumas nada. Si no está claro, pon null y por_preguntar = true.

Responde SOLO con JSON válido, sin markdown.`;

    const userPrompt = `Analiza: "${companyNameForSearch}"${website ? ` (web: ${website})` : ''}

Genera este JSON:
{
  "empresa": {
    "nombre": "Nombre encontrado o el que buscamos",
    "sector": "pharma|distribution|clinica|manufacturing|retail|other|null",
    "descripcion_procesos": "Describe CÓMO TRABAJAN basado en la búsqueda (2-3 oraciones). Si no hay info, dejar vacío."
  },

  "detectado": {
    "tiene_equipo_campo": true|false|null,
    "sector": "pharma|distribution|clinica|manufacturing|retail|other|null",
    "es_regulado": true|false|null,
    "maneja_muestras": true|false|null,
    "tamaño_estimado": "1-5|6-15|16-30|30+|null",
    "usa_crm_o_sistema": true|false|null,
    "info_clientes_centralizada": true|false|null,
    "tiene_pipeline_ventas": true|false|null,
    "vende_a_credito": true|false|null,
    "tiene_cobranza_problematica": true|false|null,
    "tiene_dashboards_reportes": true|false|null,
    "confianza": 0.0-1.0,
    "es_clinica": true|false|null
  },

  "procesos_detectados": [
    "Proceso específico encontrado en la búsqueda"
  ],

  "dolores_probables": {
    "prioridad_alta": ["CODIGO-DOLOR"],
    "prioridad_media": ["CODIGO-DOLOR"],
    "razon": "Por qué estos dolores basado en lo encontrado"
  }
}

REGLAS ESTRICTAS:
- Solo marca detectado.X con valor si hay EVIDENCIA CLARA en la búsqueda
- Si NO hay información clara → detectado.X = null
- confianza = 0.8+ solo si hay información explícita
- confianza = 0.5 si es inferido del contexto
- confianza = 0.2 si no hay información

PISTAS PARA DETECTAR:
- sector=clinica: clínica médica, clínica estética, consultorio, centro de salud, dental, dermatología, medicina estética, spa médico, hospital, laboratorio clínico, fisioterapia, oftalmología, ginecología
- tiene_equipo_campo: vendedores, representantes, visitadores, reps en calle
- usa_crm_o_sistema: mencionan Salesforce, HubSpot, Zoho, SAP, sistema CRM
- info_clientes_centralizada: base de datos de clientes, CRM, sistema centralizado
- tiene_pipeline_ventas: embudo de ventas, pipeline, seguimiento de oportunidades
- vende_a_credito: plazos de pago, facturas, crédito a clientes, distribuidores
- tiene_cobranza_problematica: cartera vencida, cobranza, morosos
- tiene_dashboards_reportes: dashboards, reportes automáticos, BI, analytics

CÓDIGOS DE DOLOR:
A-VISIBILIDAD, A-REGISTRO, B-CENTRALIZACION, B-DATOS, C-TRAZABILIDAD, C-COMPLIANCE,
D-PIPELINE, D-SEGUIMIENTO, E-COBRANZA, F-REPORTES, F-TIEMPO, G-EXCEL, G-ADOPCION`;

    const groqResponse = await fetchWithTimeout(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      },
      15000
    );

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const data = await groqResponse.json();
    let content = data.choices[0]?.message?.content || '';
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '');

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON in response');

    const profile = JSON.parse(jsonMatch[0]);
    profile.detectado = profile.detectado || {};

    // Sanitizar nulls como string
    const det = profile.detectado;
    for (const key of Object.keys(det)) {
      if (det[key] === 'null' || det[key] === 'undefined') det[key] = null;
    }

    const isDetected = (val) => val !== null && val !== undefined;

    profile.por_preguntar = {
      tamaño_equipo: !isDetected(det.tamaño_estimado),
      tiene_equipo_campo: !isDetected(det.tiene_equipo_campo),
      sector: !isDetected(det.sector),
      tecnologia_actual: true,
      motivacion: true,
      data_quality: true,
      sales_pipeline: !isDetected(det.tiene_pipeline_ventas),
      sells_credit: !isDetected(det.vende_a_credito),
      report_time: !isDetected(det.tiene_dashboards_reportes)
    };

    if (!searchExecuted) {
      profile.por_preguntar = {
        tamaño_equipo: true, tiene_equipo_campo: true, sector: true,
        tecnologia_actual: true, motivacion: true, data_quality: true,
        sales_pipeline: true, sells_credit: true, report_time: true
      };
      profile.detectado.confianza = 0.1;
    }

    profile.fuente_informacion = searchExecuted ? 'tavily_web_search' : 'none';
    profile.tavily_answer = tavilyAnswer;
    profile.sources = tavilySources;

    console.log('Research complete:', {
      company: searchQuery,
      hadWebSearch: searchExecuted,
      confidence: profile.detectado.confianza
    });

    res.json({
      success: true,
      profile,
      searchedFor: searchQuery,
      hadWebSearch: searchExecuted,
      searchMethod: searchExecuted ? 'tavily' : 'none'
    });

  } catch (error) {
    console.error('Error researching company:', error);

    res.json({
      success: false,
      error: error.message,
      profile: {
        empresa: { nombre: '', sector: null, descripcion_procesos: '' },
        detectado: {
          tiene_equipo_campo: null, sector: null, es_regulado: null,
          maneja_muestras: null, tamaño_estimado: null, usa_crm_o_sistema: null,
          info_clientes_centralizada: null, tiene_pipeline_ventas: null,
          vende_a_credito: null, tiene_cobranza_problematica: null,
          tiene_dashboards_reportes: null, confianza: 0.1
        },
        por_preguntar: {
          tamaño_equipo: true, tiene_equipo_campo: true, sector: true,
          tecnologia_actual: true, motivacion: true, data_quality: true,
          sales_pipeline: true, sells_credit: true, report_time: true
        },
        procesos_detectados: [],
        dolores_probables: {
          prioridad_alta: [], prioridad_media: [],
          razon: 'Sin información - se harán todas las preguntas'
        },
        fuente_informacion: 'none'
      }
    });
  }
});

// ── GENERATE QUESTIONS ─────────────────────────────────

function getRelevantPains(categoryIds) {
  const relevantPains = {};
  const relevantClusters = {};
  const relevantQuestions = {};

  categoryIds.forEach(catId => {
    const prefix = catId;

    Object.entries(PAIN_CATALOG).forEach(([code, pain]) => {
      if (code.startsWith(prefix) && code.match(/^[A-Z]{1,2}\d/)) {
        relevantPains[code] = {
          title: pain.title,
          cluster: pain.cluster,
          signals: pain.signals,
          question_hint: pain.question_hint
        };
      }
    });

    Object.entries(PAIN_CLUSTERS).forEach(([clusterId, cluster]) => {
      if (cluster.category === catId || clusterId.startsWith(catId + '-')) {
        relevantClusters[clusterId] = {
          title: cluster.title,
          description: cluster.description
        };
      }
    });

    Object.entries(CLUSTER_QUESTIONS).forEach(([clusterId, questions]) => {
      if (clusterId.startsWith(catId + '-') || clusterId.startsWith(prefix + '-')) {
        relevantQuestions[clusterId] = questions;
      }
    });
  });

  return { relevantPains, relevantClusters, relevantQuestions };
}

router.post('/generate-questions', async (req, res) => {
  let parsedTipoNegocio = 'distribuidor';
  try {
    const ANTHROPIC_API_KEY = (process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY || '').trim();

    const { top4, rankOrder, tipoNegocio, researchProfile, phase1Responses } = req.body;
    parsedTipoNegocio = tipoNegocio || 'distribuidor';

    if (!top4 || top4.length === 0) {
      return res.status(400).json({ error: 'top4 is required' });
    }

    const allCategories = rankOrder || top4;
    const secondaryCategories = allCategories.filter(id => !top4.includes(id));
    const { relevantPains, relevantClusters, relevantQuestions } = getRelevantPains(allCategories);

    const painCount = Object.keys(relevantPains).length;
    const clusterCount = Object.keys(relevantClusters).length;
    console.log(`Filtered knowledge base: ${painCount} pains, ${clusterCount} clusters for categories: ${allCategories.join(', ')}`);

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

    const painsByCluster = {};
    Object.entries(relevantPains).forEach(([code, pain]) => {
      if (!painsByCluster[pain.cluster]) painsByCluster[pain.cluster] = [];
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

    let questionHintsContext = '\nPREGUNTAS DE REFERENCIA POR CLUSTER (úsalas como inspiración, NO las copies textualmente):\n';
    Object.entries(relevantQuestions).forEach(([clusterId, questions]) => {
      if (questions && questions.length > 0) {
        questionHintsContext += `  ${clusterId}: ${questions.slice(0, 2).join(' | ')}\n`;
      }
    });

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
          messages: [{ role: 'user', content: userPrompt }],
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
    let claudeContent = claudeData.content[0]?.text || '';
    claudeContent = claudeContent.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    const jsonMatch = claudeContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON in Claude response');

    let jsonStr = jsonMatch[0].replace(/,\s*]/g, ']').replace(/,\s*}/g, '}');
    const result = JSON.parse(jsonStr);

    if (!result.preguntas || !Array.isArray(result.preguntas)) {
      throw new Error('Invalid response structure: missing preguntas array');
    }

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

    res.json({
      success: true,
      questions: validQuestions,
      meta: { painCount, clusterCount, categoriesUsed: allCategories, model: 'claude-haiku-4-5-20251001' }
    });

  } catch (error) {
    console.error('Error generating questions:', error);
    res.json({
      success: false,
      error: error.message,
      questions: getFallbackQuestions(parsedTipoNegocio),
      meta: { fallback: true }
    });
  }
});

// ── SUBMIT FORM ────────────────────────────────────────

router.post('/submit-form', async (req, res) => {
  try {
    const formData = req.body;

    if (!formData.empresa?.email || !formData.empresa?.contacto) {
      return res.status(400).json({ error: 'Email y nombre de contacto son requeridos' });
    }

    // Guardar en Neon PostgreSQL
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const sql = neon(databaseUrl);

      await sql`
        INSERT INTO apex_submissions (
          id, empresa_nombre, empresa_contacto, empresa_email, empresa_whatsapp,
          empresa_tamano, empresa_sector, empresa_tiene_campo, empresa_tecnologia_actual,
          empresa_motivacion, empresa_calidad_datos, empresa_pipeline_ventas,
          empresa_vende_credito, empresa_tiempo_reportes, investigacion_empresa,
          tipo_negocio, respuestas_fase1, swipe_situaciones, rank_order,
          respuestas_fase2, preguntas_adaptativas, pains_detectados_inicial,
          confirmacion_pains, pains_finales, audio_transcripcion,
          audio_duracion_segundos, datos_uso, experiencias_sugeridas,
          plan_recomendado, raw_data
        ) VALUES (
          ${formData.id},
          ${formData.empresa?.nombre},
          ${formData.empresa?.contacto},
          ${formData.empresa?.email},
          ${formData.empresa?.whatsapp},
          ${formData.empresa?.tamaño},
          ${formData.empresa?.sector},
          ${formData.empresa?.tiene_campo},
          ${JSON.stringify(formData.empresa?.tecnologia_actual)},
          ${JSON.stringify(formData.empresa?.motivacion)},
          ${formData.empresa?.calidad_datos},
          ${JSON.stringify(formData.empresa?.pipeline_ventas)},
          ${formData.empresa?.vende_credito},
          ${formData.empresa?.tiempo_reportes},
          ${JSON.stringify(formData.investigacion_empresa)},
          ${formData.tipo_negocio},
          ${JSON.stringify(formData.respuestas_fase1)},
          ${JSON.stringify(formData.swipe_situaciones)},
          ${JSON.stringify(formData.rank_order)},
          ${JSON.stringify(formData.respuestas_fase2)},
          ${JSON.stringify(formData.preguntas_adaptativas)},
          ${JSON.stringify(formData.pains_detectados_inicial)},
          ${formData.confirmacion_pains},
          ${JSON.stringify(formData.pains_finales)},
          ${formData.audio?.transcripcion},
          ${formData.audio?.duracion_segundos},
          ${JSON.stringify(formData.datos_uso)},
          ${JSON.stringify(formData.experiencias_sugeridas)},
          ${formData.plan_recomendado},
          ${JSON.stringify(formData)}
        )
      `;
      console.log('Formulario guardado en Neon:', formData.id);
    }

    console.log('=== NUEVO FORMULARIO APEX ===');
    console.log('Empresa:', formData.empresa?.nombre, '| Contacto:', formData.empresa?.contacto);
    console.log('Pains:', formData.pains_finales?.map(p => p.title).join(', '));

    // Enviar emails
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass }
      });

      const contactName = formData.empresa?.contacto || 'Cliente';
      const contactEmail = formData.empresa?.email;
      const companyName = formData.empresa?.nombre || 'No especificada';
      const toUpper = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '-';
      const tipoNegocio = toUpper(formData.tipo_negocio);
      const sector = toUpper(formData.empresa?.sector);
      const painsHtml = (formData.pains_finales || []).map((p, i) => {
        const audioNote = p.transcription ? `<br><span style="color:#00d4aa;font-style:italic;">Audio: "${p.transcription}"</span>` : '';
        const actionLabel = p.action === 'accept' ? '<span style="color:#00d4aa;font-weight:bold;">SI</span>' : p.action === 'nuance' ? '<span style="color:#e6a817;font-weight:bold;">MATIZ</span>' : p.action === 'reject' ? '<span style="color:#e74c3c;font-weight:bold;">NO</span>' : p.action === 'custom' ? '<span style="color:#c471ed;font-weight:bold;">PROPIA</span>' : '';
        return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;">${i+1}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">${p.title || ''}${audioNote}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;">${p.description || ''}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${actionLabel}</td></tr>`;
      }).join('');
      const datosUso = formData.datos_uso || {};
      const audioText = formData.audio?.transcripcion || '';

      // Email a PRISMA
      try {
        await transporter.sendMail({
          from: `"APEX Formulario" <${smtpUser}>`,
          to: smtpUser,
          subject: `Nuevo formulario APEX: ${companyName} - ${contactName}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
              <h2 style="color:#1a1a2e;border-bottom:2px solid #00d4aa;padding-bottom:10px;">Nuevo Formulario APEX</h2>
              <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                <tr><td style="padding:6px 0;color:#666;width:140px;">Contacto:</td><td style="padding:6px 0;font-weight:600;">${contactName}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Email:</td><td style="padding:6px 0;"><a href="mailto:${contactEmail}">${contactEmail}</a></td></tr>
                <tr><td style="padding:6px 0;color:#666;">WhatsApp:</td><td style="padding:6px 0;">${formData.empresa?.whatsapp || 'No proporcionado'}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Empresa:</td><td style="padding:6px 0;font-weight:600;">${companyName}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Sector:</td><td style="padding:6px 0;font-weight:600;">${sector}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Tipo negocio:</td><td style="padding:6px 0;font-weight:600;">${tipoNegocio}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Equipo:</td><td style="padding:6px 0;">${datosUso.team_size || formData.empresa?.tamaño || '-'} personas</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Roles:</td><td style="padding:6px 0;">${(datosUso.roles || []).join(', ') || '-'}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Timeline:</td><td style="padding:6px 0;">${datosUso.timeline || '-'}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Sistema actual:</td><td style="padding:6px 0;">${datosUso.sistema_actual || 'No especificado'}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Plan recomendado:</td><td style="padding:6px 0;font-weight:600;color:#00d4aa;">${formData.plan_recomendado || '-'}</td></tr>
              </table>
              <h3 style="color:#1a1a2e;margin-top:24px;">Realidades detectadas</h3>
              <table style="width:100%;border-collapse:collapse;">
                <tr style="background:#f5f5f5;"><th style="padding:8px 12px;text-align:left;">#</th><th style="padding:8px 12px;text-align:left;">Realidad</th><th style="padding:8px 12px;text-align:left;">Detalle</th><th style="padding:8px 12px;text-align:center;">Respuesta</th></tr>
                ${painsHtml || '<tr><td colspan="3" style="padding:8px 12px;">Sin pains detectados</td></tr>'}
              </table>
              ${audioText ? `<h3 style="color:#1a1a2e;margin-top:24px;">Audio general del cliente</h3><p style="background:#f9f9f9;padding:12px;border-radius:8px;font-style:italic;">"${audioText}"</p>` : ''}
              <p style="margin-top:24px;font-size:12px;color:#999;">ID: ${formData.id} | ${formData.timestamp}</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Error enviando email notificacion:', emailError);
      }

      // Email al cliente
      const clientPainsHtml = (formData.pains_finales || []).map(p => {
        const actionText = p.action === 'accept' ? ' <span style="color:#00d4aa;">(confirmada)</span>' : p.action === 'nuance' ? ' <span style="color:#e6a817;">(con matices)</span>' : p.action === 'reject' ? ' <span style="color:#e74c3c;">(descartada)</span>' : p.action === 'custom' ? ' <span style="color:#c471ed;">(agregada por ti)</span>' : '';
        const audioLine = p.transcription ? `<br><span style="color:#888;font-size:13px;font-style:italic;">Tu comentario: "${p.transcription}"</span>` : '';
        return `<li style="margin:8px 0;"><strong>${p.title || ''}</strong>${actionText}${audioLine}</li>`;
      }).join('');

      try {
        await transporter.sendMail({
          from: `"PRISMA Consul" <${smtpUser}>`,
          to: contactEmail,
          subject: `${contactName}, hemos recibido tu formulario APEX`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
              <div style="text-align:center;padding:30px 0 20px;">
                <h1 style="color:#1a1a2e;margin:0;font-size:28px;letter-spacing:2px;">PRISMA CONSUL</h1>
                <p style="color:#00d4aa;margin:6px 0 0;font-size:14px;">APEX - Automatizacion de Procesos y Experiencias</p>
              </div>
              <h2 style="color:#1a1a2e;">Hola ${contactName.split(' ')[0]},</h2>
              <p>Hemos recibido tu formulario correctamente. Nuestro equipo ya esta analizando tus respuestas para preparar una propuesta personalizada.</p>
              <div style="background:#f0faf7;border-left:4px solid #00d4aa;padding:16px;margin:20px 0;border-radius:0 8px 8px 0;">
                <strong>Estas son las realidades que vamos a transformar:</strong>
                <ol style="margin:12px 0 0;padding-left:20px;">${clientPainsHtml}</ol>
              </div>
              ${audioText ? `<div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:20px 0;"><strong>Tu mensaje de audio:</strong><p style="font-style:italic;margin:8px 0 0;">"${audioText}"</p></div>` : ''}
              <p><strong>Proximos pasos:</strong></p>
              <ul style="padding-left:20px;">
                <li>En las proximas <strong>48 horas</strong> recibiras tu propuesta personalizada</li>
                <li>La propuesta incluira el alcance completo, el alcance inicial y la suscripcion recomendada</li>
              </ul>
              <p>Si tienes alguna duda, puedes escribirnos directamente:</p>
              <p><a href="mailto:info@prismaconsul.com" style="color:#00d4aa;">info@prismaconsul.com</a> | <a href="https://wa.me/34635855915" style="color:#00d4aa;">+34 635 855 915</a></p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
              <p style="font-size:12px;color:#999;text-align:center;">PRISMA Consul | prismaconsul.com</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Error enviando email confirmacion:', emailError);
      }
    }

    res.json({ success: true, message: 'Formulario recibido correctamente', id: formData.id });

  } catch (error) {
    console.error('Error processing form:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── FALLBACK QUESTIONS ─────────────────────────────────

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

module.exports = router;
