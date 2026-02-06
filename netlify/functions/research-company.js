/**
 * Netlify Function: Research Company
 * Busca información real sobre la empresa usando búsqueda web
 * y genera un perfil detallado para personalizar las preguntas
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

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

    // PASO 1: Búsqueda web real con Perplexity (si está configurado)
    if (PERPLEXITY_API_KEY) {
      try {
        console.log('Searching with Perplexity for:', searchQuery);

        const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: 'Eres un investigador de empresas. Busca información actual y real sobre la empresa. Responde en español con información concreta y verificable.'
              },
              {
                role: 'user',
                content: `Investiga la empresa "${searchQuery}". Necesito saber:
1. ¿Qué hace esta empresa? (productos/servicios)
2. ¿En qué sector opera? (farmacéutico, distribución, manufactura, servicios, retail)
3. ¿Quiénes son sus clientes típicos? (B2B, B2C, médicos, hospitales, etc.)
4. ¿Tiene equipo de ventas en campo o visitadores?
5. ¿Maneja productos regulados o muestras médicas?
6. ¿Cuáles son los principales retos de su industria?
7. ¿Qué tecnología o sistemas usan típicamente empresas similares?

Si es una empresa farmacéutica, laboratorio o de dispositivos médicos, indica específicamente si tiene visitadores médicos y si maneja muestras.`
              }
            ],
            temperature: 0.2,
            max_tokens: 1500
          })
        });

        if (perplexityResponse.ok) {
          const perplexityData = await perplexityResponse.json();
          webSearchResults = perplexityData.choices[0].message.content;
          console.log('Perplexity search successful');
        } else {
          console.error('Perplexity error:', await perplexityResponse.text());
        }
      } catch (perplexityError) {
        console.error('Perplexity search failed:', perplexityError.message);
      }
    }

    // PASO 2: Usar Groq para estructurar la información
    const systemPrompt = `Eres un analista de negocios experto. Tu tarea es crear un perfil estructurado de una empresa para entender sus dolores operativos potenciales.

${webSearchResults ? `
INFORMACIÓN ENCONTRADA EN BÚSQUEDA WEB:
${webSearchResults}

Usa esta información REAL para crear el perfil. NO inventes datos que no estén en la búsqueda.
` : `
No hay información de búsqueda web disponible. Infiere basándote en el nombre/dominio de la empresa, pero indica baja confianza.
`}

Responde SOLO con JSON válido, sin texto adicional ni markdown.`;

    const userPrompt = `Crea un perfil estructurado para: "${searchQuery}"

Formato JSON requerido:
{
  "empresa": {
    "nombre": "Nombre de la empresa",
    "sector": "pharma|distribution|manufacturing|services|retail|other",
    "descripcion": "Descripción del negocio basada en información real (2-3 oraciones)",
    "modelo_negocio": "B2B|B2C|B2B2C|mixto",
    "tamaño_estimado": "startup|pyme|mediana|grande",
    "tiene_equipo_campo": true/false,
    "tiene_muestras_medicas": true/false,
    "regulado": true/false,
    "productos_servicios": ["producto1", "producto2"],
    "clientes_objetivo": "Descripción de clientes"
  },
  "contexto": {
    "actividades_principales": ["actividad1", "actividad2", "actividad3"],
    "clientes_tipicos": "Descripción detallada de sus clientes típicos",
    "retos_sector": ["reto específico 1", "reto específico 2", "reto específico 3"],
    "tecnologia_probable": ["tecnología que probablemente usan"]
  },
  "dolores_probables": {
    "prioridad_alta": ["CODIGO-DOLOR1", "CODIGO-DOLOR2"],
    "prioridad_media": ["CODIGO-DOLOR3", "CODIGO-DOLOR4"],
    "señales_detectadas": ["señal específica del sector", "otra señal"]
  },
  "preguntas_sugeridas": [
    {
      "pregunta": "Pregunta muy específica para esta empresa basada en lo que sabemos",
      "objetivo": "Qué queremos detectar",
      "categoria_dolor": "CODIGO-DOLOR"
    },
    {
      "pregunta": "Segunda pregunta específica",
      "objetivo": "Objetivo",
      "categoria_dolor": "CODIGO-DOLOR"
    },
    {
      "pregunta": "Tercera pregunta específica",
      "objetivo": "Objetivo",
      "categoria_dolor": "CODIGO-DOLOR"
    }
  ],
  "confianza": 0.0-1.0,
  "fuente_informacion": "web_search|inferencia"
}

CÓDIGOS DE DOLOR DISPONIBLES:
- A-VISIBILIDAD: No saber qué hace el equipo en campo
- A-REGISTRO: El equipo no registra información
- A-CONOCIMIENTO: Información solo en cabeza de personas
- B-DATOS: Datos dispersos o duplicados
- B-CENTRALIZACION: Sin base de datos central
- C-INVENTARIO: Descontrol de muestras/inventario
- C-COMPLIANCE: Problemas de cumplimiento normativo
- D-PIPELINE: Sin visibilidad del embudo de ventas
- D-SEGUIMIENTO: Oportunidades que se pierden
- D-FORECAST: No poder predecir ventas
- E-CONVERSION: Baja conversión de leads
- F-REPORTES: Reportes manuales que toman mucho tiempo
- F-DASHBOARDS: Sin métricas en tiempo real
- G-ADOPCION: El equipo no usa las herramientas
- G-EXCEL: Dependencia excesiva de Excel
- H-CANALES: Comunicación fragmentada (WhatsApp, email)
- K-PLANIFICACION: Sin planificación de rutas/territorios
- L-TRAZABILIDAD: Sin historial de interacciones
- P-TIEMPO: Mucho tiempo en tareas administrativas

IMPORTANTE:
- Si es sector pharma/dispositivos médicos: SIEMPRE incluir C-INVENTARIO, C-COMPLIANCE, L-TRAZABILIDAD
- Si tiene equipo de campo: SIEMPRE incluir A-VISIBILIDAD, A-REGISTRO, K-PLANIFICACION
- Las preguntas deben ser MUY ESPECÍFICAS para esta empresa, NO genéricas`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
        max_tokens: 2500
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const data = await groqResponse.json();
    const content = data.choices[0].message.content;

    // Parsear JSON de la respuesta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in response');
    }

    const companyProfile = JSON.parse(jsonMatch[0]);

    // Ajustar confianza basada en si tuvimos búsqueda web
    if (webSearchResults) {
      companyProfile.confianza = Math.max(companyProfile.confianza || 0.7, 0.7);
      companyProfile.fuente_informacion = 'web_search';
    } else {
      companyProfile.confianza = Math.min(companyProfile.confianza || 0.4, 0.5);
      companyProfile.fuente_informacion = 'inferencia';
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        profile: companyProfile,
        searchedFor: searchQuery,
        hadWebSearch: !!webSearchResults
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
