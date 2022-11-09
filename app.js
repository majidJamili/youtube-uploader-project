if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//Google Side of things:


const express = require('express'); 
const app = express(); 
const path = require('path'); 
const mongoose = require('mongoose'); 
const methodOverride = require('method-override');
const multer = require('multer');

const fs = require('fs');

//Get Database data:
const Video = require('./models/videos'); 

//Google Authentication Requirements: 
const { google } = require('googleapis');
const OAuth2Data = require('./credentials.json');
const { response } = require('express');
const { title } = require('process');
const { render } = require('ejs');



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
app.use(methodOverride('_method'))
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



//Initialisation:

var isAuthenticated = false;
const SCOPES ="https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile";

//Routes:
app.get('/',(req,res)=>{
    if(!isAuthenticated){
        var url = oAuth2Client.generateAuthUrl({
            access_type:"offline",
            scope:SCOPES
        })
        //console.log(url)
        res.render('home.ejs',{url:url})
    }else{
        var oauth2 = google.oauth2({
            auth:oAuth2Client,
            version:"v2"
        });
        oauth2.userinfo.get(function(err,response){
            if (err) {
                console.log(err);                
            }else{
                //console.log(response.data);
                userName = response.data.name;
                pic = response.data.picture; 
                res.render('users/userinfo.ejs',{
                    name:response.data.name,
                    pic:response.data.picture,
                    success:false
                });
            }
        });
    }
});


app.get('/google/callback', (req, res) => {
    const code = req.query.code;
    if(code){
        oAuth2Client.getToken(code, function(err, tokens){
            if(err){
                console.log("Error during Authentiacation"); 
                console.log(tokens); 
            }else{
                console.log("Successful Authentiacation"); 
                //console.log(tokens); 
                oAuth2Client.setCredentials(tokens); 
                isAuthenticated =true; 
                res.redirect("/");
            }
        });
    }
});


app.post('/upload',(req,res)=>{
    upload(req,res,function(err){
        if (err) {
            console.log(err);
            return res.end('Something went wrong')            
        }else{
            const title = req.body.video.title;
            const description = req.body.video.description;
            const tags = req.body.video.tags; 
            const youtube = google.youtube({
                version:'v3',
                auth:oAuth2Client
            })
            youtube.videos.insert(
                {
                    resource:{
                        snippet: {
                            title:title,
                            description:description,
                            tags:tags
                        },
                        status: {
                            privacyStatus: "private",
                          }
                        },
                        part: "snippet,status",
                        media: {
                            body: fs.createReadStream(req.file.path)
                          },
                },
                (err,data)=>{
                    if(err) throw err

                    fs.unlinkSync(req.file.path);
                    userName = response.data.name;
                    pic = response.data.picture; 
                    console.log(`video id: ${data.id}`); 
                    res.render('users/userinfo.ejs',{
                        name:response.data.name,
                        pic:response.data.picture,
                        success:false
                    });
                }
            )

        }
    })
})


app.get('/uploadvideo', (req,res)=>{

})

app.post('/uploadvideo', async(req,res)=>{

})


app.get('/logout', (req, res) => {
    isAuthenticated = false;
    res.redirect('/')

})



// app.get('/videos', async(req,res)=>{
//     const videos = await Video.find({});
//     res.render('videos/index.ejs',{videos});
// })
// app.get('/video/:id', async(req,res)=>{
//     const {id} = req.params; 
//     const videoFound = await Video.findById(id);
//     res.render('videos/show',{videoFound});
    
// })
// app.get('/video/:id/edit',async(req,res)=>{
//     const {id} = req.params; 
//     const video = await Video.findById(id);
//     res.render('videos/edit.ejs',{video});    
// })

// app.put('/videos/:id',async(req,res)=>{
//     const { id } = req.params; 

//     const video = await Video.findByIdAndUpdate(id,req.body.video,
//          { runValidators: false, new: true });
//     res.redirect(`/video/${video._id}`);
// })

// app.delete('/videos/:id',async(req,res)=>{
//     const {id} = req.params; 
//     const deletedVideo = await Video.findByIdAndDelete(id); 
//     res.redirect('/videoindex'); 

// })


app.listen(3000, ()=>{
    console.log("YOUTUBE PROJECT IS LISTENING ON PORT 3000");
});