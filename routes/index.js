const express = require('express');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const router = express.Router();
const oAuth2Client = require('../config/middlewares'); 
const { google } = require('googleapis');


const app = express(); 


var isAuthenticated = false;
const SCOPES ="https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile";

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
                res.end(data);
                console.log(data);
            }
        }
    })
    res.end()
})



router.get('/uploadvideo', (req,res)=>{

})

router.post('/uploadvideo', async(req,res)=>{

})


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
