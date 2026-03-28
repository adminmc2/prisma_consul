/**
 * AI Routes
 * Groq LLM chat proxy + Whisper audio transcription
 */

const express = require('express');

const router = express.Router();

// ── GROQ CHAT ──────────────────────────────────────────

router.post('/groq-chat', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  try {
    const { messages, model, temperature, max_tokens } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'llama-3.3-70b-versatile',
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 1500
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error: `Groq API error: ${error}` });
    }

    res.json(await response.json());

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GROQ WHISPER (audio transcription) ─────────────────

router.post('/groq-whisper', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  try {
    const { audioBase64, mimeType, model, language } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required' });
    }

    const audioBuffer = Buffer.from(audioBase64, 'base64');
    console.log('Audio received:', audioBuffer.length, 'bytes, type:', mimeType);

    // Construir multipart form-data para Groq
    const boundary = '----FormBoundary' + Date.now();
    const ext = (mimeType || 'audio/webm').includes('mp4') ? 'mp4' : 'webm';

    const parts = [];
    parts.push(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="audio.${ext}"\r\n` +
      `Content-Type: ${mimeType || 'audio/webm'}\r\n\r\n`
    );
    parts.push(audioBuffer);
    parts.push('\r\n');
    parts.push(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="model"\r\n\r\n` +
      `${model || 'whisper-large-v3-turbo'}\r\n`
    );
    parts.push(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="language"\r\n\r\n` +
      `${language || 'es'}\r\n`
    );
    parts.push(`--${boundary}--\r\n`);

    const body = Buffer.concat(parts.map(p => typeof p === 'string' ? Buffer.from(p) : p));

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq Whisper error:', response.status, error);
      return res.status(response.status).json({ error: `Whisper API error: ${error}` });
    }

    const data = await response.json();
    console.log('Transcription result:', data.text?.substring(0, 100));
    res.json(data);

  } catch (error) {
    console.error('Whisper function error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
