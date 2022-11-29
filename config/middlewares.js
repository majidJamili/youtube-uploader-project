const { google } = require('googleapis');


// YOUTUBE_CLIENT_ID = 506266451470-orukfnf1pu0c7p9dnu7h4134tf34u5ji.apps.googleusercontent.com
// YOUTUBE_PROJECT_ID = shiny-1579527715666
// YOUTUBE_AUTH_URI = https://accounts.google.com/o/oauth2/auth
// YOUTUBE_TOKEN_URI=https://oauth2.googleapis.com/token
// YOUTUBE_CLIENT_SECRET= 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
// YOUTUBE_REDIRECT_URL= http://localhost:3000/google/callback

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_URL = process.env.YOUTUBE_REDIRECT_URL;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

module.exports = oAuth2Client; 