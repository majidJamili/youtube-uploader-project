if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//Google Side of things:


const express = require('express');

const app = express(); 
const path = require('path'); 

const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const multer = require('multer');
const fs = require('fs');
const session = require('express-session'); 

//Get Database data:
const Video = require('./models/videos'); 
const Task = require('./models/tasks');


//Google Authentication Requirements: 
const { google } = require('googleapis');
const OAuth2Data = require('./credentials.json');
var title, description;
var tags = [];
var isAuthenticated = false;
var authed = false;
const { getDuration } = require('./side-functions');



//Conncet to Database: 
mongoose.connect('mongodb://localhost:27017/youtubeUploader',{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log('Mongo Connection Started')
    })
    .catch(err=>{
        console.log('Oh NO Mongo Connection Error!!')
        console.log(err)
    }); 



//Set Views:
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
    
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

//Video Uploading part:
// 1. Handle Authentication:

const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

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


app.use(session({
    secret: 'somethingsecretgoeshere',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.set('view engine', 'ejs');
var isAuthenticated = false;

const SCOPES =
    "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube";



/////////////////////////////////////////////////////////////////////////  






app.set("view engine", "ejs");

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./videos");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});



var upload = multer({
    storage: Storage,
}).single("file"); //Field name and max count



// app.get('/google/callback', (req, res) => {
//     const code = req.query.code;
//     if(code){
//         oAuth2Client.getToken(code, function(err, tokens){
//             if(err){
//                 console.log("Error during Authentiacation"); 
//                 console.log(tokens); 
//             }else{
//                 console.log("Successful Authentiacation"); 
//                 //console.log(tokens); 
//                 oAuth2Client.setCredentials(tokens); 
//                 isAuthenticated =true; 
//                 res.redirect("/");
//             }
//         });
//     }
// });




app.get("/", (req, res) => {
    if (!authed) {
        // Generate an OAuth URL and redirect there
        var url = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: SCOPES,
        });
        //console.log(url);
        res.render("home", { url: url });
    } else {
        var oauth2 = google.oauth2({
            auth: oAuth2Client,
            version: "v2",
        });
        oauth2.userinfo.get(function (err, response) {
            if (err) {
                console.log(err);
            } else {
                //console.log(response.data);
                name = response.data.name;
                pic = response.data.picture;
                res.render("users/userinfo.ejs", {
                    name: response.data.name,
                    pic: response.data.picture,
                    success: false,
                });
            }
        });
    }
});

app.post("/createplaylist", async (req, res) => {
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });
    youtube.playlists.insert({
        part: 'id,snippet',
        resource: {
            snippet: {
                title: "TEST PLAYLIST001",
                description: "Description this is a test playlist",
            }
        },
        function(err, data, res) {
            if (err) {
                console.log(err);
                res.end("Something went wrong");
            } else if (data) {
                res.end(data);
                console.log(data);
            }


        }


    })
    res.redirect("/");



})

app.post("/upload", (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.end("Something went wrong");
        } else {
            //console.log(req.file.path);
            title = req.body.title;
            description = req.body.description;
            tags = req.body.tags;

            const youtube = google.youtube({ version: "v3", auth: oAuth2Client });
            youtube.videos.insert(
                {
                    resource: {
                        // Video title and description
                        snippet: {
                            title: title,
                            description: description,
                            tags: tags
                        },
                    // I don't want to spam my subscribers
                        status: {
                            privacyStatus: "public",
                        },
                    },
                // This is for the callback function
                    part: "snippet,status",

                    // Create the readable stream to upload the video
                    media: {
                        body: fs.createReadStream(req.file.path)
                    },
                },
                async (err, data) => {
                    if(err) throw err
                    const youtube_video_url = data.data.id;
                    console.log('Youtube Video ID:');
                    console.log(youtube_video_url);
                    // const youtube_video_url = `https://www.youtube.com/embed/${youtube_Id}`;

                    const { title, description, tags } = req.body;
                    const tasks = [];

                    const newVideo = new Video({
                        title, youtube_video_url,
                        tags, description, tasks
                    })
                    console.log(newVideo);
                    await newVideo.save();
                    fs.unlinkSync(req.file.path);
                    res.render("users/userinfo.ejs", { name: name, pic: pic, success: true });
                }
            );
        }
    });
});

app.get("/logout", (req, res) => {
    authed = false;
    res.redirect("/");
});

app.get("/google/callback", function (req, res) {
    const code = req.query.code;
    if (code) {
        // Get an access token based on our OAuth code
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log("Error authenticating");
                console.log(err);
            } else {
                console.log("Successfully authenticated");
                //console.log(tokens);
                oAuth2Client.setCredentials(tokens);

                authed = true;
                res.redirect("/");
            }
        });
    }
});






app.get('/logout', (req, res) => {
    authed = false;
    res.redirect('/')

})



app.get('/videos', async (req, res) => {
    const videos = await Video.find({});
    res.render('videos/index.ejs', { videos });
})
app.get('/video/:id', async (req, res) => {
    const { id } = req.params;
    const videoFound = await Video.findById(id).populate('tasks');
    res.render('videos/show', { videoFound });

})
app.get('/video/:id/edit', async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    res.render('videos/edit.ejs', { video });
})

app.put('/videos/:id', async (req, res) => {
    const { id } = req.params;

    const video = await Video.findByIdAndUpdate(id, req.body.video,
        { runValidators: false, new: true });
    res.redirect(`/video/${video._id}`);
})

app.delete('/videos/:id', async (req, res) => {
    const { id } = req.params;
    const deletedVideo = await Video.findByIdAndDelete(id);
    res.redirect('/videos');
})


app.post('/video/:id/task/add', async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    const { title, types, startTime, endTime } = req.body;
    const time = getDuration(startTime, endTime);
    const task = new Task({ title, types, time });
    video.tasks.push(task);
    task.video = video;
    await task.save();
    await video.save();
    res.redirect(`/video/${video._id}`);

})



app.listen(3000, ()=>{
    console.log("YOUTUBE PROJECT IS LISTENING ON PORT 3000");
});