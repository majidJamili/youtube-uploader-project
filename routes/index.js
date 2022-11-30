const express = require('express');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const router = express.Router();
const oAuth2Client = require('../config/middlewares'); 
const { google } = require('googleapis');
const path = require('path')



const app = express(); 


var isAuthenticated = false;
//const SCOPES = "https://www.googleapis.com/youtube/v3/playlistItems https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtube"
const SCOPES = [
                             'https://www.googleapis.com/auth/youtube.upload',
                              'https://www.googleapis.com/auth/userinfo.profile',
                               'https://www.googleapis.com/auth/youtubepartner', 
                               'https://www.googleapis.com/auth/youtube.force-ssl',
                                'https://www.googleapis.com/auth/youtube']

router.get('/',(req,res)=>{
    if(!isAuthenticated){
        var url = oAuth2Client.generateAuthUrl({
            access_type:"offline",
            scope:SCOPES
        })
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
                isAuthenticated =true; 
                res.redirect("/");
            }
        });
    }
});


router.post('/upload',(req,res)=>{
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
                function(err, data, res) {
                    if (err) {
                        console.log(err);
                        res.end("Something went wrong");
                    } else if (data) {
                        res.end(data);
                        console.log(data);
                    }
                }
            )

        }
    })
    res.redirect('/')
})


// Create Playlist
//@Posts 
router.post("/createplaylist", async (req, res) => {
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });
    console.log(req.body.title);

    youtube.playlists.insert({
        part: 'id,snippet',
        resource: {
            snippet: {
                title: req.body.title,
                description: "Description this is a test playlist",
            }
        },
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
})

//Edit Playlist
//@PUT Playlist with predefined name

router.put('/editplaylist', async (req, res) => {
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

    youtube.playlists.update(
        {
            resource:{
                kind: "youtube#playlist",
                id: "PLGpckAHc3_srn_lle8HgpwCX3dhisGmed",
                snippet: {
                    title:"PLAYLIST NAME IS UPDATED REV001",
                    description:"THIS PLAYLIST DESCRIPTION IS CHANGED",

                    },
                },
                part: "snippet",

        },
        function(err, data, res) {
            if (err) {
                console.log(err);
                res.end("Something went wrong");
            } else if (data) {
                
                console.log(data.data.id);
            }
        }
       
    )
    res.redirect('/')
})
// Delete Playlist
router.delete('/deleteplaylist',(req,res)=>{
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

    youtube.playlists.delete(
        {
             id: "PLGpckAHc3_sr1-MK4wohuJojZuWeBEPZc",
        },
        function(err, data, res) {
            if (err) {
                console.log(err);
                res.end("Something went wrong");
            } else if (data) {
                
                console.log(data.data.id);
            }
        }       
    )
    res.redirect('/')
})



//Create Videos
// POST videos/upload


router.post('/upload',async(req,res)=>{
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
                            privacyStatus: "public",
                          }
                        },
                        part: "snippet,status",
                        media: {
                            body: fs.createReadStream(req.file.path)
                          },
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
            )

        }
    })
    res.redirect('/')
})



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
                videoId: "PldGZ9jD5qA",
                kind: 'youtube#playlistItem',
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

})







// Edit Videos: 
// PUT @/video/:id/edit

router.put('/editvideo', async (req, res) => {
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

    youtube.videos.update(
        {
            resource:{
                kind: "youtube#video",
                id: "PldGZ9jD5qA",
                snippet: {
                    title:"UPDATED TEST REV008",
                    description:"Video Description is Updated for the fifth time...!",
                    categoryId: "1"
                    },
                },
                part: "snippet",
 

        },
        function(err, data, res) {
            if (err) {
                console.log(err);
                res.end("Something went wrong");
            } else if (data) {
                
                console.log(data.data.id);
            }
        }
       
    )
    res.redirect('/')
})

//Delete Vides
//DELETE @/video/:id/delete
router.delete('/deletevideos', async (req, res) => {
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });
    youtube.videos.delete(
        {
            id: "YPUN0l3VicU",
        },
        function(err, data, res) {
            if (err) {
                console.log(err);
                res.end("Something went wrong");
            } else if (data) {
                
                console.log(data);
            }
        }
       
    )
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
