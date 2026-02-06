/**
 * Netlify Function: Submit APEX Discovery Form
 * Guarda los datos del formulario en Neon PostgreSQL y envía notificaciones
 */

const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const formData = JSON.parse(event.body);

    // Validar datos requeridos
    if (!formData.empresa?.email || !formData.empresa?.nombre) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Email y nombre de empresa son requeridos' })
      };
    }

    // Conectar a Neon PostgreSQL
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('DATABASE_URL not configured');
    } else {
      const sql = neon(databaseUrl);

      // Insertar en la base de datos
      await sql`
        INSERT INTO apex_submissions (
          id,
          empresa_nombre,
          empresa_contacto,
          empresa_email,
          empresa_whatsapp,
          empresa_tamano,
          empresa_sector,
          empresa_tiene_campo,
          empresa_tecnologia_actual,
          empresa_motivacion,
          respuestas_fase1,
          respuestas_fase2,
          pains_detectados_inicial,
          confirmacion_pains,
          pains_finales,
          audio_transcripcion,
          audio_duracion_segundos,
          experiencias_sugeridas,
          plan_recomendado,
          raw_data
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
          ${formData.empresa?.motivacion},
          ${JSON.stringify(formData.respuestas_fase1)},
          ${JSON.stringify(formData.respuestas_fase2)},
          ${JSON.stringify(formData.pains_detectados_inicial)},
          ${formData.confirmacion_pains},
          ${JSON.stringify(formData.pains_finales)},
          ${formData.audio?.transcripcion},
          ${formData.audio?.duracion_segundos},
          ${JSON.stringify(formData.experiencias_sugeridas)},
          ${formData.plan_recomendado},
          ${JSON.stringify(formData)}
        )
      `;

      console.log('✅ Formulario guardado en Neon:', formData.id);
    }

    // Log para debugging
    console.log('=== NUEVO FORMULARIO APEX ===');
    console.log('ID:', formData.id);
    console.log('Empresa:', formData.empresa?.nombre);
    console.log('Contacto:', formData.empresa?.contacto);
    console.log('Email:', formData.empresa?.email);
    console.log('Pains finales:', formData.pains_finales?.map(p => p.title).join(', '));
    console.log('Plan recomendado:', formData.plan_recomendado);
    console.log('=============================');

    // Opcional: Enviar a webhook de Slack/Discord/Email
    const webhookUrl = process.env.FORM_WEBHOOK_URL;
    if (webhookUrl) {
      const webhookPayload = {
        text: `🆕 *Nuevo formulario APEX*\n` +
              `*Empresa:* ${formData.empresa?.nombre}\n` +
              `*Contacto:* ${formData.empresa?.contacto}\n` +
              `*Email:* ${formData.empresa?.email}\n` +
              `*WhatsApp:* ${formData.empresa?.whatsapp || 'No proporcionado'}\n` +
              `*Sector:* ${formData.empresa?.sector}\n` +
              `*Tamaño:* ${formData.empresa?.tamaño}\n` +
              `*Dolores:*\n${formData.pains_finales?.map((p, i) => `  ${i+1}. ${p.title}`).join('\n')}\n` +
              `*Plan recomendado:* ${formData.plan_recomendado}`
      };

      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        });
      } catch (webhookError) {
        console.error('Error sending webhook:', webhookError);
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Formulario recibido correctamente',
        id: formData.id
      })
    };

  } catch (error) {
    console.error('Error processing form:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
