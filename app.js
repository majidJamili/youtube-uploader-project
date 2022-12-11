require('dotenv').config()

const express = require('express');

const app = express(); 
const multer = require('multer');
const fs = require('fs');
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


// Handlebars Helpers
const {
  json,
  section,
} = require('./helpers/hbs')


app.engine('.hbs', exphbs.engine({ helpers:{json, section}, defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs');


app.use(session({ secret: 'myflashmessagesession',
                            resave:false, 
                            saveUninitialized:true,
                            cookie: { maxAge: 60000 }}
                                           ));
app.use(flash());

app.set('views', path.join(__dirname, '/views'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: false }));
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

var upload = multer({
    storage:Storage,
}).single("file")

app.use((req, res, next) => {
  res.locals.success = req.flash('success') || null
  res.locals.error = req.flash('error') || null
  res.locals.warning = req.flash('warning') || null
  next();
})



//Routes:
app.use('/',require('./routes/index'));
app.use('/videos', require('./routes/videos'));
app.use('/playlists', require('./routes/playlists'));
app.use('/tasks', require('./routes/tasks'));




const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("YOUTUBE PROJECT IS LISTENING ON PORT 3000");
});