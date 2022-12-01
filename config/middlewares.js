const { google } = require('googleapis');
const multer = require('multer');

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_URL = process.env.YOUTUBE_REDIRECT_URL;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

module.exports = oAuth2Client; 




module.exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
        return res.redirect('/login');
    }
    next();
}

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "./videos");
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  });

module.exports.upload = multer({
    storage:Storage,
}).single("file")
