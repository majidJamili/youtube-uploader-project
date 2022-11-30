const express = require('express');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const router = express.Router();
const oAuth2Client = require('../config/middlewares'); 
const { google } = require('googleapis');


var isAuthenticated = false;
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/youtubepartner',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtube']


// const url = [];
// router.get('/', (req, res) => {
//     res.render('login', { layout: 'login', url: url })
// })
router.get('/',(req,res)=>{
    if(!isAuthenticated){
        var url = oAuth2Client.generateAuthUrl({
            access_type:"offline",
            scope:SCOPES
        })
        res.render('login', { layout: 'login', url: url })
    }else{
        var oauth2 = google.oauth2({
            auth:oAuth2Client,
            version:"v2"
        });
        oauth2.userinfo.get(function(err,response){
            if (err) {
                console.log(err);
            }else{
                userName = response.data.name;
                pic = response.data.picture;
                res.render('studio/show', {
                    name:response.data.name,
                    pic:response.data.picture,
                    success:false
                });
            }
        });
    }
});


router.get('/google/callback', (req, res) => {
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
                isAuthenticated = true;
                res.redirect("/");
            }
        });
    }
});










//Playlist Insert: upload a video to another playlist: 
//POST //playlist/add/:id
router.post('/addtoplaylist', async(req,res)=>{
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });
    youtube.playlistItems.insert({

        resource: {
            kind: "youtube#playlistItem",
        
            snippet: {
              playlistId: "PLGpckAHc3_soUXPDyY7uEpoybBfz28Kmg",
              resourceId: {
                  videoId: "ukoDQLiDvWM",
                  kind: 'youtube#video',
              }
            }
        },
        part: "snippet",
        function(err, data, res) {
            if (err) {
                console.log(err);
                res.end("Something went wrong");
            } else if (data) {
                console.log(data);
                res.redirect('/')
            }
        }
    })
    res.redirect('/')
})











// router.get('/uploadvideo', (req,res)=>{

// })

// router.post('/uploadvideo', async(req,res)=>{

// })


router.get('/logout', (req, res) => {
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
module.exports = router; 
