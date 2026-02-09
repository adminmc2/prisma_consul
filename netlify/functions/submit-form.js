/**
 * Netlify Function: Submit APEX Discovery Form
 * Guarda los datos del formulario en Neon PostgreSQL y envía emails via Gmail SMTP
 */

const { neon } = require('@neondatabase/serverless');
const nodemailer = require('nodemailer');

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
    if (!formData.empresa?.email || !formData.empresa?.contacto) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Email y nombre de contacto son requeridos' })
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
          empresa_calidad_datos,
          empresa_pipeline_ventas,
          empresa_vende_credito,
          empresa_tiempo_reportes,
          investigacion_empresa,
          tipo_negocio,
          respuestas_fase1,
          swipe_situaciones,
          rank_order,
          respuestas_fase2,
          preguntas_adaptativas,
          pains_detectados_inicial,
          confirmacion_pains,
          pains_finales,
          audio_transcripcion,
          audio_duracion_segundos,
          datos_uso,
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

    // Enviar emails via Gmail SMTP
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

      // 1) Email de notificación a PRISMA
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

              ${audioText ? `<h3 style="color:#1a1a2e;margin-top:24px;">Audio general del cliente</h3><p style="background:#f9f9f9;padding:12px;border-radius:8px;font-style:italic;">"${audioText}"</p><p style="font-size:12px;color:#999;">Duracion: ${formData.audio?.duracion_segundos || 0} segundos</p>` : ''}
              ${(formData.pains_finales || []).some(p => p.transcription) ? '' : (!audioText ? '<p style="margin-top:24px;color:#999;font-style:italic;">El cliente no grabo audio.</p>' : '')}

              <p style="margin-top:24px;font-size:12px;color:#999;">ID: ${formData.id} | ${formData.timestamp}</p>
            </div>
          `
        });
        console.log('Email de notificacion enviado a', smtpUser);
      } catch (emailError) {
        console.error('Error enviando email de notificacion:', emailError);
      }

      // 2) Email de confirmación al cliente
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
                <ol style="margin:12px 0 0;padding-left:20px;">
                  ${clientPainsHtml}
                </ol>
              </div>

              ${audioText ? `<div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:20px 0;"><strong>Tu mensaje de audio:</strong><p style="font-style:italic;margin:8px 0 0;">"${audioText}"</p></div>` : ''}

              <p><strong>Proximos pasos:</strong></p>
              <ul style="padding-left:20px;">
                <li>En las proximas <strong>48 horas</strong> recibiras tu propuesta personalizada</li>
                <li>La propuesta incluira el alcance completo, el alcance inicial y la suscripcion recomendada</li>
              </ul>

              <p>Si tienes alguna duda, puedes escribirnos directamente:</p>
              <p>
                <a href="mailto:info@prismaconsul.com" style="color:#00d4aa;">info@prismaconsul.com</a> |
                <a href="https://wa.me/34635855915" style="color:#00d4aa;">+34 635 855 915</a>
              </p>

              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
              <p style="font-size:12px;color:#999;text-align:center;">PRISMA Consul | prismaconsul.com</p>
            </div>
          `
        });
        console.log('Email de confirmacion enviado a', contactEmail);
      } catch (emailError) {
        console.error('Error enviando email de confirmacion:', emailError);
      }
    } else {
      console.warn('SMTP_USER/SMTP_PASS no configuradas - no se enviaron emails');
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
