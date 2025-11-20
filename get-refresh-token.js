const { google } = require('googleapis');
const fs = require('fs');

// Load credentials
const credentials = require('./credentials.json'); // path to your downloaded JSON

const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// Generate auth URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/drive'],
});

console.log('Authorize this app by visiting this url:', authUrl);