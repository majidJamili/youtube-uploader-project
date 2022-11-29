const passport = require('passport');

const GoogleStartegy = require('passport-google-oauth2').Strategy;


passport.use(new GoogleStartegy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        //console.log(profile);
        return done(null, profile);
    }
));
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

