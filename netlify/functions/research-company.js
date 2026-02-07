/**
 * Netlify Function: Research Company
 * Busca PROCESOS de la empresa (no productos) para personalizar el formulario APEX
 *
 * OBJETIVO: Detectar qué preguntas ya están respondidas para no repetirlas
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

    // PASO 1: Búsqueda web enfocada en PROCESOS (no productos)
    try {
      console.log('Searching PROCESSES for:', searchQuery);

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
                content: `Eres un investigador de PROCESOS empresariales.
NO te interesa qué PRODUCTOS vende la empresa.
Te interesa CÓMO TRABAJAN: sus procesos comerciales, operativos, de ventas.
Responde en español, conciso.`
              },
              {
                role: 'user',
                content: `Investiga los PROCESOS de "${searchQuery}":

1. ¿Tiene vendedores o representantes que visitan clientes en campo?
2. ¿En qué sector opera? (farmacéutico, distribución, servicios, etc.)
3. ¿Es una empresa regulada? (necesita cumplir normativas como COFEPRIS, FDA)
4. ¿Cómo es su proceso de ventas? (visitas, teléfono, digital)
5. ¿Maneja muestras, demos o material que entrega a clientes?
6. ¿Qué tamaño aproximado tiene? (empleados, alcance)

NO me digas qué productos venden. Solo cómo OPERAN.`
              }
            ],
            temperature: 0.2,
            max_tokens: 1000
          })
        },
        12000
      );

      if (compoundResponse.ok) {
        const compoundData = await compoundResponse.json();
        webSearchResults = compoundData.choices[0]?.message?.content;
        if (webSearchResults) {
          searchExecuted = true;
          console.log('Process search successful');
        }
      }
    } catch (compoundError) {
      console.error('Search failed:', compoundError.message);
    }

    // PASO 2: Estructurar información detectada vs por preguntar
    const systemPrompt = `Eres un analista que detecta PROCESOS empresariales para un sistema CRM.

${webSearchResults ? `INFORMACIÓN ENCONTRADA:\n${webSearchResults}` : 'No hay información web. Infiere del nombre.'}

Tu objetivo es determinar:
1. Qué información YA SABEMOS (no preguntar de nuevo)
2. Qué información DEBEMOS PREGUNTAR
3. Qué PROCESOS tiene la empresa para detectar sus dolores operativos

Responde SOLO con JSON válido, sin markdown.`;

    const userPrompt = `Analiza: "${searchQuery}"

Genera este JSON:
{
  "empresa": {
    "nombre": "${searchQuery}",
    "sector": "pharma|distribution|manufacturing|services|retail|other",
    "descripcion_procesos": "Describe CÓMO TRABAJAN, no qué venden (2-3 oraciones)"
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
    "Descripción de proceso 1 que tienen",
    "Descripción de proceso 2 que tienen"
  ],

  "dolores_probables": {
    "prioridad_alta": ["A-VISIBILIDAD", "C-INVENTARIO"],
    "prioridad_media": ["F-REPORTES", "G-EXCEL"],
    "razon": "Por qué estos dolores basado en sus procesos"
  },

  "preguntas_procesos": [
    {
      "pregunta": "¿Cómo sabe tu equipo a quién visitar cada día?",
      "detecta_dolor": "A-COBERTURA",
      "contexto": "Porque detectamos que tienen visitadores"
    },
    {
      "pregunta": "¿Cómo controlas las muestras que entrega tu equipo?",
      "detecta_dolor": "C-TRAZABILIDAD",
      "contexto": "Porque es pharma y maneja muestras"
    }
  ]
}

REGLAS:
- "detectado" = información que YA SABEMOS con confianza
- "por_preguntar" = true si NO lo sabemos y debemos preguntar
- Si detectado.X tiene valor, por_preguntar.X debe ser false
- Las preguntas_procesos deben ser sobre CÓMO TRABAJAN, no sobre productos
- Enfócate en detectar DOLORES OPERATIVOS

CÓDIGOS DE DOLOR:
A-VISIBILIDAD: No saber qué hace el equipo
A-REGISTRO: No registran o registran tarde
A-COBERTURA: No siguen plan de visitas
B-CENTRALIZACION: Datos dispersos
C-INVENTARIO: Sin control de muestras/stock
C-TRAZABILIDAD: Sin seguimiento de entregas
C-COMPLIANCE: Problemas regulatorios
D-PIPELINE: Sin visibilidad de ventas
D-SEGUIMIENTO: Oportunidades perdidas
F-REPORTES: Reportes manuales
G-EXCEL: Dependencia de Excel
G-ADOPCION: CRM que nadie usa
H-CANALES: Todo por WhatsApp
P-TIEMPO: Mucho tiempo en admin`;

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
          temperature: 0.4,
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

    // Si detectamos algo con confianza, no preguntar
    if (profile.detectado.tiene_equipo_campo !== null && profile.detectado.confianza > 0.6) {
      profile.por_preguntar.tiene_equipo_campo = false;
    }
    if (profile.detectado.sector && profile.detectado.sector !== 'other' && profile.detectado.confianza > 0.6) {
      profile.por_preguntar.sector = false;
    }

    // Siempre preguntar tecnología y motivación (no se pueden inferir)
    profile.por_preguntar.tecnologia_actual = true;
    profile.por_preguntar.motivacion = true;

    profile.fuente_informacion = searchExecuted ? 'groq_compound_web_search' : 'inferencia';

    console.log('Research complete:', {
      company: searchQuery,
      hadWebSearch: searchExecuted,
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
        hadWebSearch: searchExecuted
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
          empresa: { nombre: '', sector: 'other', descripcion_procesos: '' },
          detectado: {
            tiene_equipo_campo: null,
            sector: null,
            es_regulado: null,
            maneja_muestras: null,
            tamaño_estimado: null,
            confianza: 0.2
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
            prioridad_alta: ['A-VISIBILIDAD', 'D-PIPELINE'],
            prioridad_media: ['F-REPORTES', 'G-EXCEL'],
            razon: 'Valores por defecto'
          },
          preguntas_procesos: [],
          fuente_informacion: 'default'
        }
      })
    };
  }
};
