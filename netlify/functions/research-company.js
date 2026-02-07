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

    // PASO 1: Búsqueda web con TAVILY
    if (TAVILY_API_KEY) {
      try {
        console.log('Searching with Tavily for:', searchQuery);

        const tavilyResponse = await fetchWithTimeout(
          'https://api.tavily.com/search',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              api_key: TAVILY_API_KEY,
              query: `${searchQuery} empresa qué hace cómo opera equipo ventas distribuidores`,
              search_depth: 'advanced',
              include_answer: true,
              max_results: 5
            })
          },
          20000
        );

        if (tavilyResponse.ok) {
          const tavilyData = await tavilyResponse.json();

          // Obtener respuesta resumida
          tavilyAnswer = tavilyData.answer || null;

          // Combinar contenido de las fuentes
          if (tavilyData.results && tavilyData.results.length > 0) {
            tavilySources = tavilyData.results.map(r => ({
              title: r.title,
              url: r.url,
              content: r.content
            }));

            // Construir texto de resultados
            webSearchResults = tavilyData.results
              .map(r => `${r.title}: ${r.content}`)
              .join('\n\n');

            searchExecuted = true;
            console.log('Tavily search successful, found', tavilyData.results.length, 'results');
          }
        } else {
          console.error('Tavily error:', tavilyResponse.status);
        }
      } catch (tavilyError) {
        console.error('Tavily search failed:', tavilyError.message);
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

    const userPrompt = `Analiza: "${searchQuery}"

Genera este JSON:
{
  "empresa": {
    "nombre": "Nombre encontrado o el que buscamos",
    "sector": "pharma|distribution|manufacturing|services|retail|other|null",
    "descripcion_procesos": "Describe CÓMO TRABAJAN basado en la búsqueda (2-3 oraciones). Si no hay info, dejar vacío."
  },

  "detectado": {
    "tiene_equipo_campo": true|false|null,
    "sector": "pharma|distribution|...|null",
    "es_regulado": true|false|null,
    "maneja_muestras": true|false|null,
    "tamaño_estimado": "1-5|6-15|16-30|30+|null",
    "confianza": 0.0-1.0
  },

  "por_preguntar": {
    "tamaño_equipo": true|false,
    "tiene_equipo_campo": true|false,
    "sector": true|false,
    "tecnologia_actual": true,
    "motivacion": true
  },

  "procesos_detectados": [
    "Proceso específico encontrado en la búsqueda"
  ],

  "dolores_probables": {
    "prioridad_alta": ["CODIGO-DOLOR"],
    "prioridad_media": ["CODIGO-DOLOR"],
    "razon": "Por qué estos dolores basado en lo encontrado"
  },

  "preguntas_procesos": [
    {
      "pregunta": "Pregunta específica sobre sus procesos",
      "detecta_dolor": "CODIGO-DOLOR",
      "contexto": "Por qué preguntamos esto"
    }
  ]
}

REGLAS:
- Si la búsqueda NO encontró información clara sobre algo → detectado.X = null y por_preguntar.X = true
- Solo marca detectado.X con valor si hay EVIDENCIA CLARA en la búsqueda
- confianza = 0.8+ solo si hay información explícita
- confianza = 0.5 si es inferido
- confianza = 0.2 si no hay información

CÓDIGOS DE DOLOR:
A-VISIBILIDAD, A-REGISTRO, A-COBERTURA, B-CENTRALIZACION, C-INVENTARIO, C-TRAZABILIDAD,
C-COMPLIANCE, D-PIPELINE, D-SEGUIMIENTO, F-REPORTES, G-EXCEL, G-ADOPCION, H-CANALES, P-TIEMPO`;

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
    profile.por_preguntar = profile.por_preguntar || {
      tamaño_equipo: true,
      tiene_equipo_campo: true,
      sector: true,
      tecnologia_actual: true,
      motivacion: true
    };

    // Si NO hubo búsqueda exitosa, preguntar TODO
    if (!searchExecuted) {
      profile.por_preguntar = {
        tamaño_equipo: true,
        tiene_equipo_campo: true,
        sector: true,
        tecnologia_actual: true,
        motivacion: true
      };
      profile.detectado.confianza = 0.1;
    }

    // Siempre preguntar tecnología y motivación (no se pueden inferir)
    profile.por_preguntar.tecnologia_actual = true;
    profile.por_preguntar.motivacion = true;

    // Solo saltar preguntas si hay alta confianza
    if (profile.detectado.confianza < 0.6) {
      profile.por_preguntar.tiene_equipo_campo = true;
      profile.por_preguntar.sector = true;
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

    // Perfil por defecto - preguntar todo
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
            confianza: 0.1
          },
          por_preguntar: {
            tamaño_equipo: true,
            tiene_equipo_campo: true,
            sector: true,
            tecnologia_actual: true,
            motivacion: true
          },
          procesos_detectados: [],
          dolores_probables: {
            prioridad_alta: [],
            prioridad_media: [],
            razon: 'Sin información - se harán todas las preguntas'
          },
          preguntas_procesos: [],
          fuente_informacion: 'none'
        }
      })
    };
  }
};
