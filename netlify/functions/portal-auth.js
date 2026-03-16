/**
 * API: Portal Authentication
 * Valida email + contraseña contra tabla portal_users en Neon PostgreSQL
 * Devuelve JWT con expiración de 24h
 */

const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Email y contraseña son requeridos' })
      };
    }

    const secret = process.env.PORTAL_SECRET;
    const databaseUrl = process.env.DATABASE_URL;

    if (!secret || !databaseUrl) {
      console.error('PORTAL_SECRET or DATABASE_URL not configured');
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Error de configuración del servidor' })
      };
    }

    const sql = neon(databaseUrl);

    // Buscar usuario por email
    const users = await sql`
      SELECT id, email, password_hash, nombre, empresa, rfc, direccion, ciudad, cp, telefono, contacto_principal, cargo, sector
      FROM portal_users
      WHERE LOWER(email) = LOWER(${email})
    `;

    if (!users.length) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Credenciales incorrectas' })
      };
    }

    const user = users[0];

    // Verificar contraseña
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Credenciales incorrectas' })
      };
    }

    // Actualizar last_login
    await sql`UPDATE portal_users SET last_login = NOW() WHERE id = ${user.id}`;

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombre },
      secret,
      { expiresIn: '24h' }
    );

    // Datos de empresa para el sidebar
    const empresa = {
      nombre: user.empresa,
      rfc: user.rfc,
      direccion: user.direccion,
      ciudad: user.ciudad,
      cp: user.cp,
      telefono: user.telefono,
      contacto_principal: user.contacto_principal,
      cargo: user.cargo,
      sector: user.sector
    };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ token, email: user.email, nombre: user.nombre, empresa })
    };

  } catch (error) {
    console.error('Portal auth error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
