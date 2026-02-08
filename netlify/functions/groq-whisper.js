/**
 * Netlify Function: Groq Whisper Transcription
 * Proxy seguro para transcripción de audio con Whisper
 *
 * Acepta JSON con audio en base64 (más confiable que multipart en netlify dev)
 */

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

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'GROQ_API_KEY not configured' }) };
  }

  try {
    const { audioBase64, mimeType, model, language } = JSON.parse(event.body);

    if (!audioBase64) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'audioBase64 is required' }) };
    }

    // Decodificar base64 a Buffer
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    console.log('Audio received:', audioBuffer.length, 'bytes, type:', mimeType);

    // Construir multipart form-data manualmente para Groq
    const boundary = '----FormBoundary' + Date.now();
    const ext = (mimeType || 'audio/webm').includes('mp4') ? 'mp4' : 'webm';

    const parts = [];
    // File part
    parts.push(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="audio.${ext}"\r\n` +
      `Content-Type: ${mimeType || 'audio/webm'}\r\n\r\n`
    );
    parts.push(audioBuffer);
    parts.push('\r\n');

    // Model part
    parts.push(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="model"\r\n\r\n` +
      `${model || 'whisper-large-v3-turbo'}\r\n`
    );

    // Language part
    parts.push(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="language"\r\n\r\n` +
      `${language || 'es'}\r\n`
    );

    parts.push(`--${boundary}--\r\n`);

    // Combinar todas las partes en un solo Buffer
    const bodyParts = parts.map(p => typeof p === 'string' ? Buffer.from(p) : p);
    const body = Buffer.concat(bodyParts);

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: body
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq Whisper error:', response.status, error);
      return { statusCode: response.status, headers, body: JSON.stringify({ error: `Whisper API error: ${error}` }) };
    }

    const data = await response.json();
    console.log('Transcription result:', data.text?.substring(0, 100));

    return { statusCode: 200, headers, body: JSON.stringify(data) };

  } catch (error) {
    console.error('Whisper function error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
