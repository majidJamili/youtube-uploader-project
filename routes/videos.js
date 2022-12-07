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
const { findByIdAndDelete } = require('../models/videos');
const youtube = google.youtube({ version: 'v3', auth: oAuth2Client})

//Get upload form
//GET /videos/upload
router.get('/upload', (req, res) => {
    res.render('studio/add', {layout: 'main.hbs'}); 
})

//Render all videos:
// GET /videos/index

router.get('/index', async (req, res) => {
    const videos = await Video.find().lean()
    res.render('studio/index', { videos })
})


//Render Studio:
// GET /videos/studio

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const video = await Video.findById(id).lean()
    res.render('studio/studio', { video })
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

                            await Video.create({'title':title, 'status': status, 'youtube_video_url': data.data.id, 'description':description, 'tasks':[] })
                            //res.redirect('/videos/upload')
                            console.log('Video added to DB successfully')                                                

                    }
                }
            )
            req.flash('success', 'Video Uploaded Successfully')
            res.redirect('/videos/index')

            
        }
    })




})
// Edit Videos: 
// PUT: /videos/:id/edit
router.put('/:id/edit', async (req, res) => {

    try {
            const id = req.params.id
            const video = await  Video.findById(id).lean()
            if(!video){
                return res.render('error/404')
            }
            const title = req.body.title;
            const description = req.body.description; 
            const tags = req.body.tags; 
            const status = req.body.status; 
            youtube.videos.update({
                                resource: {
                                    kind: "youtube#video",
                                    id: video.youtube_video_url,
                                    snippet: {
                                        title: title,
                                        description: "Video Description is Updated for the fifth time...!",
                                        tags:tags,
                                        categoryId: "1"
                                    },
                                    status: {
                                        privacyStatus: status,
                                    }
                                },
                                part: "snippet,status",
                            },
                            async function (err, data, res) {
                                if (err) {
                                    console.log(err);
                                } else if (data) {
                             
                                const videoUpdated = await Video.findByIdAndUpdate(id,req.body, {        
                                    new: true,
                                    runValidators: true});
                                console.log(data.data.id, 'is updated successfully');                           
                                }
                            }
                        )
                        req.flash('success', `${video.title} is successfully updated... !!!`)
                        res.redirect('/videos/index')    
    } catch (error) {
        console.error(error)
        return res.render('error/500')        
    }
})


//Delete Vides
//DELETE /videos/:id/delete
router.delete('/:id/delete', async (req, res) => {
    try {
        const id = req.params.id
        const isModal = !!req.body.modal
        const video = await Video.findById(id).lean()
        if(!video){
            return res.render('error/404')
        }
        const youtube = google.youtube({ version: "v3", auth: oAuth2Client });
        youtube.videos.delete(
            {
                id: video.youtube_video_url,
            },
            async function (err, data, res) {
                if (err) {
                    console.log(err);
                    //res.end("Something went wrong");
                } else if (data) {
                    const delvideo = await Video.findByIdAndDelete(id)
                    console.log(video.youtube_video_url, 'is successfully deleted')

                }
            }   
        )
        req.flash('error',`${video.title} is successfully deleted`)
        res.redirect('/')        
    } catch (error) {
        console.error(error)
        return res.render('error/500')       
    }
})

module.exports = router; 
