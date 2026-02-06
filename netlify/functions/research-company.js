/**
 * Netlify Function: Research Company
 * Busca información sobre la empresa en la web usando Groq
 * para generar preguntas más personalizadas
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;

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

    // Construir contexto de búsqueda
    const searchContext = website || companyName;

    // Usar Groq con web search para investigar la empresa
    const systemPrompt = `Eres un analista de negocios experto. Tu tarea es analizar una empresa y generar un perfil detallado para entender sus dolores potenciales.

IMPORTANTE: Debes inferir información basándote en:
- El nombre de la empresa y su dominio web
- Patrones típicos del sector
- Señales del modelo de negocio

Responde SOLO con JSON válido, sin texto adicional.`;

    const userPrompt = `Analiza esta empresa: "${searchContext}"

Genera un perfil en este formato JSON exacto:
{
  "empresa": {
    "nombre": "Nombre oficial de la empresa",
    "sector": "pharma|distribution|manufacturing|services|retail|other",
    "descripcion": "Breve descripción del negocio (1-2 oraciones)",
    "modelo_negocio": "B2B|B2C|B2B2C|mixto",
    "tamaño_estimado": "startup|pyme|mediana|grande",
    "tiene_equipo_campo": true/false,
    "tiene_muestras_medicas": true/false,
    "regulado": true/false
  },
  "contexto": {
    "actividades_principales": ["actividad1", "actividad2"],
    "clientes_tipicos": "Descripción de sus clientes típicos",
    "retos_sector": ["reto1", "reto2", "reto3"]
  },
  "dolores_probables": {
    "prioridad_alta": ["código dolor ej: A-VISIBILIDAD", "D-PIPELINE"],
    "prioridad_media": ["B-DATOS", "F-REPORTES"],
    "señales_detectadas": ["señal que indica dolor 1", "señal 2"]
  },
  "preguntas_sugeridas": [
    {
      "pregunta": "Pregunta específica para esta empresa",
      "objetivo": "Qué dolor intenta detectar",
      "categoria_dolor": "A-VISIBILIDAD"
    }
  ],
  "confianza": 0.0-1.0
}

IMPORTANTE:
- Si no encuentras información específica, infiere basándote en el nombre/dominio
- El sector "pharma" incluye: laboratorios, dispositivos médicos, visitadores médicos
- Si tiene equipo de campo, los dolores de visibilidad (A) son críticos
- Si es pharma, los dolores de muestras (C) y compliance (L) son críticos
- Usa los códigos de dolor exactos del catálogo APEX (A-VISIBILIDAD, B-DATOS, C-INVENTARIO, etc.)`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parsear JSON de la respuesta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in response');
    }

    const companyProfile = JSON.parse(jsonMatch[0]);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        profile: companyProfile,
        searchedFor: searchContext
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
            regulado: false
          },
          contexto: {
            actividades_principales: [],
            clientes_tipicos: '',
            retos_sector: []
          },
          dolores_probables: {
            prioridad_alta: ['A-VISIBILIDAD', 'D-PIPELINE'],
            prioridad_media: ['F-REPORTES', 'B-DATOS'],
            señales_detectadas: []
          },
          preguntas_sugeridas: [],
          confianza: 0.3
        }
      })
    };
  }
};
