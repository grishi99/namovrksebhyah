const { google } = require('googleapis');
const fs = require('fs');

const credentials = require('./credentials.json');
const { client_secret, client_id, redirect_uris } = credentials.installed;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// Paste the code here after running first script
const code = '4/0ATX87lM_KZw-X_wIBqg2WqyG6Zf9RUCXk3XtBq2D7uEyVL27tiboFSomA_iiVcrq0V1afw&'; // Replace YOUR_CODE_HERE with the actual code from the browser

oAuth2Client.getToken(code, (err, token) => {
  if (err) return console.error('Error retrieving access token', err);
  console.log('Refresh token:', token.refresh_token);
  // Save this refresh token in your .env file!
});