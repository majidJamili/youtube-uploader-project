require('dotenv').config()

const express = require('express');

const app = express(); 
const multer = require('multer');

const ejs = require('ejs');

//Google Authentication Requirements: 
const { google } = require('googleapis');
const OAuth2Data = require('./credentials.json');
const connectDB = require('./config/db') 
const Video = require('./models/videos'); 
const path = require('path')
const passport = require('passport')
const cookieSession = require('cookie-session')
const cookieParser = require("cookie-parser")
const exphbs = require('express-handlebars') 
const morgan = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const flash = require('connect-flash'); 




//Conncet to Database: 
connectDB()


//Global Middlewares: 
app.set('views', path.join(__dirname, '/views'))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, '/public')))
app.engine('.hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

//Multer Middleware: 
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "./videos");
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  });
//Session
const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(morgan('dev')); 


var upload = multer({
    storage:Storage,
}).single("file")


//Flash Middleware: 
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


//Routes:
app.use('/',require('./routes/index'));
app.use('/videos', require('./routes/videos'));
app.use('/playlists', require('./routes/playlists'));

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("YOUTUBE PROJECT IS LISTENING ON PORT 3000");
});