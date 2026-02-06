/**
 * Netlify Function: Research Company
 * Busca información real sobre la empresa usando Groq Compound (búsqueda web nativa)
 * y genera un perfil detallado para personalizar las preguntas
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;

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

    // PASO 1: Búsqueda web con Groq Compound (con timeout de 12 segundos)
    try {
      console.log('Searching with Groq Compound for:', searchQuery);

      const compoundResponse = await fetchWithTimeout(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'groq/compound',
            messages: [
              {
                role: 'system',
                content: 'Busca información sobre esta empresa. Responde en español, conciso.'
              },
              {
                role: 'user',
                content: `Busca información sobre "${searchQuery}": qué hace, sector, si tiene equipo de campo, si maneja productos regulados.`
              }
            ],
            temperature: 0.2,
            max_tokens: 1000
          })
        },
        12000 // 12 segundos timeout
      );

      if (compoundResponse.ok) {
        const compoundData = await compoundResponse.json();
        webSearchResults = compoundData.choices[0]?.message?.content;
        if (webSearchResults) {
          searchExecuted = true;
          console.log('Groq Compound search successful');
        }
      } else {
        console.error('Groq Compound error:', compoundResponse.status);
      }
    } catch (compoundError) {
      console.error('Groq Compound search failed (timeout or error):', compoundError.message);
      // Continuar sin búsqueda web
    }

    // PASO 2: Usar Groq para estructurar la información
    const systemPrompt = `Eres un analista de negocios. Crea un perfil estructurado de empresa.
${webSearchResults ? `INFORMACIÓN WEB:\n${webSearchResults}\n\nUsa esta información REAL.` : 'No hay información web. Infiere del nombre.'}
Responde SOLO con JSON válido.`;

    const userPrompt = `Perfil para: "${searchQuery}"

JSON requerido:
{
  "empresa": {
    "nombre": "string",
    "sector": "pharma|distribution|manufacturing|services|retail|other",
    "descripcion": "2-3 oraciones",
    "modelo_negocio": "B2B|B2C|mixto",
    "tamaño_estimado": "startup|pyme|mediana|grande",
    "tiene_equipo_campo": boolean,
    "tiene_muestras_medicas": boolean,
    "regulado": boolean,
    "productos_servicios": ["array"],
    "clientes_objetivo": "string"
  },
  "contexto": {
    "actividades_principales": ["array"],
    "clientes_tipicos": "string",
    "retos_sector": ["array"],
    "tecnologia_probable": ["array"]
  },
  "dolores_probables": {
    "prioridad_alta": ["CODIGO-DOLOR"],
    "prioridad_media": ["CODIGO-DOLOR"],
    "señales_detectadas": ["array"]
  },
  "preguntas_sugeridas": [
    {"pregunta": "Pregunta específica", "objetivo": "Qué detectar", "categoria_dolor": "CODIGO"}
  ],
  "confianza": 0.0-1.0
}

CÓDIGOS: A-VISIBILIDAD, A-REGISTRO, B-DATOS, B-CENTRALIZACION, C-INVENTARIO, C-COMPLIANCE, D-PIPELINE, D-SEGUIMIENTO, F-REPORTES, G-EXCEL, H-CANALES, K-PLANIFICACION, L-TRAZABILIDAD, P-TIEMPO

Si pharma: incluir C-INVENTARIO, C-COMPLIANCE. Si equipo campo: incluir A-VISIBILIDAD, A-REGISTRO.`;

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
          temperature: 0.5,
          max_tokens: 2000
        })
      },
      15000 // 15 segundos timeout
    );

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const data = await groqResponse.json();
    let content = data.choices[0]?.message?.content || '';

    // Limpiar markdown si existe
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '');

    // Parsear JSON de la respuesta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in response');
    }

    const companyProfile = JSON.parse(jsonMatch[0]);

    // Ajustar confianza basada en si tuvimos búsqueda web exitosa
    if (searchExecuted && webSearchResults) {
      companyProfile.confianza = Math.max(companyProfile.confianza || 0.7, 0.75);
      companyProfile.fuente_informacion = 'groq_compound_web_search';
    } else {
      companyProfile.confianza = Math.min(companyProfile.confianza || 0.4, 0.5);
      companyProfile.fuente_informacion = 'inferencia';
    }

    console.log('Research complete:', {
      company: searchQuery,
      hadWebSearch: searchExecuted,
      confidence: companyProfile.confianza
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        profile: companyProfile,
        searchedFor: searchQuery,
        hadWebSearch: searchExecuted,
        searchMethod: searchExecuted ? 'groq_compound' : 'none'
      })
    };

  } catch (error) {
    console.error('Error researching company:', error);

    // Devolver perfil por defecto si falla
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        profile: {
          empresa: {
            nombre: '',
            sector: 'other',
            descripcion: '',
            modelo_negocio: 'B2B',
            tamaño_estimado: 'pyme',
            tiene_equipo_campo: true,
            tiene_muestras_medicas: false,
            regulado: false,
            productos_servicios: [],
            clientes_objetivo: ''
          },
          contexto: {
            actividades_principales: [],
            clientes_tipicos: '',
            retos_sector: [],
            tecnologia_probable: []
          },
          dolores_probables: {
            prioridad_alta: ['A-VISIBILIDAD', 'D-PIPELINE'],
            prioridad_media: ['F-REPORTES', 'B-DATOS'],
            señales_detectadas: []
          },
          preguntas_sugeridas: [],
          confianza: 0.2,
          fuente_informacion: 'default'
        }
      })
    };
  }
};
