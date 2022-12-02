const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {upload} = require('../config/middlewares');
const oAuth2Client= require('../config/middlewares');
const fs = require('fs');
const Video = require('../models/videos'); 


const { google } = require('googleapis');
const { nextTick } = require('process');
const flash = require('flash');
const youtube = google.youtube({ version: 'v3', auth: oAuth2Client})

//Get upload form
//GET /videos/upload
router.get('/upload', (req, res) => {
    req.flash('warning', 'We are ready for uploading...')
    res.render('studio/add', {layout: 'main.hbs'}); 
})

//Render all videos:
// GET /videos/index

router.get('/index', async (req, res) => {
    const videos = await Video.find().lean()
    res.render('studio/index', { videos })
})







//Upload a Video: 
//POST: /videos/upload
router.post('/upload', async(req, res) => {    


    upload(req,res, function(err){
        if(err){
            console.log(err); 
            return res.send('Something went wrong'); 
        }else{
            const title = req.body.video.title;
            const description = req.body.video.description; 
            const tags = req.body.video.tags; 
            const status = req.body.video.status; 
            youtube.videos.insert({
                    resource: {
                        snippet: {
                            title: title,
                            description: "description",
                            tags: tags
                        },
                        status: {
                            privacyStatus: status,
                        }
                    },
                    part: "snippet,status",
                    media: {
                        body: fs.createReadStream(req.file.path)
                    },
                },
                async function  (err, data, res) {
                    if (err) {
                        console.log(err);
                        // res.render('error/404');
                        next(); 
                    } else if (data) {
                        try {
                            await Video.create({'title':title, 'status': status, 'youtube_video_url': data.data.id, 'description':description, 'tasks':[] })
                            res.redirect('/videos/upload')
                            console.log('Video added to DB successfully')                                                       
                        } catch (error) {      
                            console.log(error)  
                            res.render('error/404')                    
                        }
                    }
                }
            )
             res.redirect('/videos/upload')

            
        }
    })




})
// Edit Videos: 
// PUT: /videos/:id/edit
router.put('/:id/edit', async (req, res) => {
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

    youtube.videos.update(
        {
            resource: {
                kind: "youtube#video",
                id: "PldGZ9jD5qA",
                snippet: {
                    title: "UPDATED TEST REV008",
                    description: "Video Description is Updated for the fifth time...!",
                    categoryId: "1"
                },
            },
            part: "snippet",


        },
        function (err, data, res) {
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
//DELETE /videos/:id/delete
router.delete('/:id/delete', async (req, res) => {
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });
    youtube.videos.delete(
        {
            id: "YPUN0l3VicU",
        },
        function (err, data, res) {
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


module.exports = router; 
