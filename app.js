require('dotenv').config()

const express = require('express');

const app = express(); 
const multer = require('multer');
const fs = require('fs');
const ejs = require('ejs');

//Google Authentication Requirements: 
const BSON = require('bson'); 
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
const axios = require('axios'); 

//Conncet to Database: 
connectDB()


// Handlebars Helpers
const {
  json,
  section,
  toUpperCase,
  formatDate,
  bold,
  editIcon
} = require('./helpers/hbs')


app.engine('.hbs', exphbs.engine({ helpers:{json, section, toUpperCase, formatDate,bold, editIcon}, defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs');


app.use(session({ secret: 'myflashmessagesession',
                            resave:false, 
                            saveUninitialized:false,
                            // cookie: { maxAge: 60000 }, 
                            store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI}),

                          }
                                           ));
app.use(flash());

app.set('views', path.join(__dirname, '/views'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
// app.use(session(sessionConfig))

//Set Views:
app.set('views', path.join(__dirname, '/views'));
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


//Multer File Uploader: 
var upload = multer({
    storage:Storage,
}).single("file")
//Passport Middlewares and Access Files: 
app.use(passport.initialize());
app.use(passport.session());
require('./passport')(passport); 


//Local Access Information, inclusing: Flash Msgs, Secretes, and User Information: 

app.use((req, res, next) => {
  res.locals.success = req.flash('success') || null
  res.locals.error = req.flash('error') || null
  res.locals.warning = req.flash('warning') || null
  res.locals.GOOGLE_MAP_SECRETES = process.env.GOOGLE_MAP_KEY || null
  res.locals.user = req.user || null
  next();
})



//Routes:
app.use('/',require('./routes/index'));
app.use('/auth', require('./routes/authentication'));
app.use('/videos', require('./routes/videos'));
app.use('/playlists', require('./routes/playlists'));
app.use('/tasks', require('./routes/tasks'));
app.use('/sites', require('./routes/sites'));
app.use('/sites/:siteId/lines', require('./routes/lines'));
app.use('/lines/:lineId/wc', require('./routes/workcenters'));




const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`YOUTUBE PROJECT IS LISTENING ON PORT ${PORT}`);
});