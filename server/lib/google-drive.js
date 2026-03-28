/**
 * Google Drive Client
 * Service Account con domain-wide delegation impersonando info@prismaconsul.com
 */

const { google } = require('googleapis');

function getDriveClient() {
  const keyJson = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const auth = new google.auth.GoogleAuth({
    credentials: keyJson,
    scopes: ['https://www.googleapis.com/auth/drive'],
    clientOptions: { subject: 'info@prismaconsul.com' }
  });
  return google.drive({ version: 'v3', auth });
}

module.exports = { getDriveClient };
