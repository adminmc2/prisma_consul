/**
 * Netlify Function: Research Company
 * Busca PROCESOS de la empresa usando Tavily API para personalizar el formulario APEX
 *
 * OBJETIVO: Detectar qué preguntas ya están respondidas para no repetirlas
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

// Helper para fetch con timeout
async function fetchWithTimeout(url, options, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

exports.handler = async (event) => {
  // CORS headers
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
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { companyName, website } = JSON.parse(event.body);

    if (!companyName && !website) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Company name or website required' })
      };
    }

    const searchQuery = website || companyName;
    let webSearchResults = null;
    let searchExecuted = false;
    let tavilyAnswer = null;
    let tavilySources = [];

    // Extraer nombre legible del dominio (ej: "https://clinicaarmc.com" → "clinicaarmc")
    function extractNameFromUrl(url) {
      try {
        const hostname = new URL(url).hostname.replace('www.', '');
        const name = hostname.split('.')[0]; // "clinicaarmc"
        // Separar camelCase o palabras pegadas comunes
        return name.replace(/[-_]/g, ' ');
      } catch {
        return url;
      }
    }

    const isUrl = website && (website.startsWith('http') || website.includes('.'));
    const companyNameForSearch = companyName || (isUrl ? extractNameFromUrl(website) : searchQuery);

    // PASO 1: Búsqueda web con TAVILY
    console.log('TAVILY_API_KEY configured:', !!TAVILY_API_KEY);
    if (TAVILY_API_KEY) {

      // Ejecutar Extract (si es URL) y Search EN PARALELO para ahorrar tiempo
      const searchTerm = companyNameForSearch;
      console.log('Starting Tavily calls in parallel. Extract URL:', isUrl ? website : 'N/A', '| Search term:', searchTerm);

      // Promesa de Extract (solo si hay URL)
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
              console.log('Extract successful, got', content?.length, 'chars');
              return content;
            }
          } else {
            console.error('Tavily extract error:', extractResponse.status);
          }
          return null;
        } catch (err) {
          console.error('Tavily extract failed:', err.message);
          return null;
        }
      })() : Promise.resolve(null);

      // Promesa de Search
      const searchPromise = (async () => {
        try {
          const tavilyResponse = await fetchWithTimeout(
            'https://api.tavily.com/search',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                api_key: TAVILY_API_KEY,
                query: `"${searchTerm}" qué hace servicios sector`,
                search_depth: 'advanced',
                include_answer: true,
                max_results: 5,
                exclude_domains: ['linguee.com', 'wordreference.com', 'bab.la', 'translate.google.com', 'deepl.com', 'reverso.net', 'fastercapital.com', 'edirectorio.net']
              })
            },
            12000
          );

          if (tavilyResponse.ok) {
            const tavilyData = await tavilyResponse.json();
            console.log('Tavily search successful, found', tavilyData.results?.length || 0, 'results');
            return tavilyData;
          } else {
            console.error('Tavily search error:', tavilyResponse.status);
          }
          return null;
        } catch (err) {
          console.error('Tavily search failed:', err.message);
          return null;
        }
      })();

      // Esperar ambas en paralelo
      const [extractedContent, searchData] = await Promise.all([extractPromise, searchPromise]);

      // Procesar resultados de Search
      if (searchData) {
        tavilyAnswer = searchData.answer || null;

        if (searchData.results && searchData.results.length > 0) {
          tavilySources = searchData.results.map(r => ({
            title: r.title,
            url: r.url,
            content: r.content
          }));

          webSearchResults = searchData.results
            .map(r => `${r.title}: ${r.content}`)
            .join('\n\n');

          searchExecuted = true;
        }
      }

      // Procesar resultados de Extract
      if (extractedContent) {
        tavilySources.unshift({
          title: 'Sitio web de la empresa',
          url: website,
          content: extractedContent.substring(0, 300)
        });

        webSearchResults = (webSearchResults || '') +
          '\n\nCONTENIDO DIRECTO DEL SITIO WEB:\n' + extractedContent;
        searchExecuted = true;
      }

    } else {
      console.log('No TAVILY_API_KEY configured');
    }

    // PASO 2: Usar Groq para estructurar la información
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

    "confianza": 0.0-1.0
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

    // Limpiar markdown
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '');

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in response');
    }

    const profile = JSON.parse(jsonMatch[0]);

    // Asegurar estructura correcta
    profile.detectado = profile.detectado || {};

    // LÓGICA DE SALTO: Si detectado.X tiene valor concreto → NO preguntar
    // Si detectado.X es null → SÍ preguntar
    const det = profile.detectado;

    // Helper para verificar si un valor está detectado
    const isDetected = (val) => val !== null && val !== undefined;

    profile.por_preguntar = {
      // 1.1 Tamaño: preguntar si no se detectó
      tamaño_equipo: !isDetected(det.tamaño_estimado),

      // 1.2 Equipo campo: preguntar si no se detectó
      tiene_equipo_campo: !isDetected(det.tiene_equipo_campo),

      // 1.3 Sector: preguntar si no se detectó
      sector: !isDetected(det.sector),

      // 1.4 Tecnología: SIEMPRE preguntar (preferencias del usuario)
      tecnologia_actual: true,

      // 1.5 Motivación: SIEMPRE preguntar (es subjetivo)
      motivacion: true,

      // 1.6 Calidad de datos: SIEMPRE preguntar (subjetivo, no detectable)
      data_quality: true,

      // 1.7 Pipeline ventas: preguntar si no detectamos que tienen pipeline
      sales_pipeline: !isDetected(det.tiene_pipeline_ventas),

      // 1.8 Crédito: preguntar si no detectamos si venden a crédito
      // PERO si es distribución/pharma, probablemente sí venden a crédito
      sells_credit: !isDetected(det.vende_a_credito),

      // 1.9 Reportes: preguntar si no detectamos dashboards
      report_time: !isDetected(det.tiene_dashboards_reportes)
    };

    // Si NO hubo búsqueda exitosa, preguntar TODO
    if (!searchExecuted) {
      profile.por_preguntar = {
        tamaño_equipo: true,
        tiene_equipo_campo: true,
        sector: true,
        tecnologia_actual: true,
        motivacion: true,
        data_quality: true,
        sales_pipeline: true,
        sells_credit: true,
        report_time: true
      };
      profile.detectado.confianza = 0.1;
    }

    profile.fuente_informacion = searchExecuted ? 'tavily_web_search' : 'none';
    profile.tavily_answer = tavilyAnswer;
    profile.sources = tavilySources;

    console.log('Research complete:', {
      company: searchQuery,
      hadWebSearch: searchExecuted,
      confidence: profile.detectado.confianza,
      detected: profile.detectado,
      toAsk: profile.por_preguntar
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        profile,
        searchedFor: searchQuery,
        hadWebSearch: searchExecuted,
        searchMethod: searchExecuted ? 'tavily' : 'none'
      })
    };

  } catch (error) {
    console.error('Error researching company:', error);

    // Perfil por defecto - preguntar todo (9 preguntas)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        profile: {
          empresa: { nombre: '', sector: null, descripcion_procesos: '' },
          detectado: {
            tiene_equipo_campo: null,
            sector: null,
            es_regulado: null,
            maneja_muestras: null,
            tamaño_estimado: null,
            usa_crm_o_sistema: null,
            info_clientes_centralizada: null,
            tiene_pipeline_ventas: null,
            vende_a_credito: null,
            tiene_cobranza_problematica: null,
            tiene_dashboards_reportes: null,
            confianza: 0.1
          },
          por_preguntar: {
            tamaño_equipo: true,
            tiene_equipo_campo: true,
            sector: true,
            tecnologia_actual: true,
            motivacion: true,
            data_quality: true,
            sales_pipeline: true,
            sells_credit: true,
            report_time: true
          },
          procesos_detectados: [],
          dolores_probables: {
            prioridad_alta: [],
            prioridad_media: [],
            razon: 'Sin información - se harán todas las preguntas'
          },
          fuente_informacion: 'none'
        }
      })
    };
  }
};
