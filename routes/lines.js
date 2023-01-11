const express = require('express');
const router = express.Router({mergeParams:true});
const {ensureAuth, ensureGuest}=require('../middlewares'); 
const {google}= require('googleapis'); 
const oAuth2Client = require('../config/middlewares'); 
const {upload} = require('../config/middlewares');
const youtube = google.youtube({ version: 'v3', auth: oAuth2Client})
const fs = require('fs');

const Line = require('../models/lines');
const Site = require('../models/sites');
const Video = require('../models/videos'); 
const workcenters = require('../models/workcenters');
const { json } = require('../helpers/hbs');







//@desc Get Upload a Video to a Line
//@route GET: /sites/:siteId/lines/:lineId/upload
router.get('/:id/upload',ensureAuth,async(req,res)=>{
    var siteId = req.params.siteId; 
    var lineId = req.params.id;
    var line = await Line.findById(lineId).lean() 


    var site = await Site.findById(siteId)
                    .populate({path:'lines'})
                    .populate({path:'user'})
                    .lean()
    res.render('lines/upload', {site:site, line:line})

})
//@desc Get Upload a Video to a Line
//@route GET: /sites/:siteId/lines/:lineId/upload
router.post('/:id/upload',ensureAuth,async(req,res)=>{

    try {
        upload(req,res, async function(err){
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
                            // id: "",
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
                         
                           
                        } else if (data) {
                            var lineId = req.params.id;            
                            const line = await Line.findById(lineId);    
                            const video = new Video({'title':title, 'status': status, 'youtube_video_url': data.data.id, 'description':description, 'tasks':[] })
                            line.videos.push(video); 
                                await line.save()
                                await video.save()
                            
                            youtube.playlistItems.insert({
                                resource: {
                                    kind: "youtube#playlistItem",                                
                                    snippet: {
                                    playlistId: line.youtube_playlist_id,
                                    resourceId: {
                                        videoId: video.youtube_video_url,
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
                        }
                    }                
                )


                // youtube.playlistItems.insert({

                //     resource: {
                //         kind: "youtube#playlistItem",
                    
                //         snippet: {
                //           playlistId: "PLGpckAHc3_soUXPDyY7uEpoybBfz28Kmg",
                //           resourceId: {
                //               videoId: "ukoDQLiDvWM",
                //               kind: 'youtube#video',
                //           }
                //         }
                //     },
                //     part: "snippet",
                //     function(err, data, res) {
                //         if (err) {
                //             console.log(err);
                //             res.end("Something went wrong");
                //         } else if (data) {
                //             console.log(data);
                //             res.redirect('/')
                //         }
                //     }
                // }) 
                req.flash('success', 'New Video Successfully Uploaded')               
                res.redirect(`/dashboard`)
                
            }
        })
                 
        
    } catch (error) {
        console.error(error)
        res.render('error/500', {errorDesc:error})
        
    }

   
       

    


})


//desc Show add page
//route @ GET /sites/:siteId/lines/add

router.get('/add', async(req,res)=>{

    try {
        console.log(req.params)
        const siteId = req.params.siteId; 
        const site = await Site.findById(siteId).lean();    
        res.render('lines/add', {site:site})

        
    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }
})





//Create Line
//@ POST /sites/:siteId/lines/add
router.post('/add', async(req,res)=>{
    try {

        const youtube = google.youtube({version:'v3', auth:oAuth2Client})
        const title = req.body.title;
        const siteId = req.params.siteId; 
        const privacyStatus = req.body.privacyStatus; 

        console.log('body of data',req.body)

        youtube.playlists.insert(
            {
                resource:{
                    // status: {
                    //     privacyStatus: 'public',
                    // },
                    snippet: {
                        title:title,
                        description:`A playlist consists of all ${title} Manufacturing Line videos`,
                    },
                    },
                    part: "id,snippet",
    
            },
            async function(err, data, res) {
                if (err) {
                    console.log(err);

  
                } else if (data) {
                    const siteId = req.params.siteId; 
                    const site = await Site.findById(siteId); 
                    req.body.user = req.user.id; 
                    req.body.site = siteId;
                    req.body.youtube_playlist_id = data.data.id;
                    req.body.youtube_playlist_channel_id = data.data.snippet.channelId; 

                    const line = new Line(req.body); 
                    site.lines.push(line); 
                    await site.save()
                    await line.save()



                }
            }
        )
        req.flash('success', `A new line is being successfully created at site`) 
        res.redirect(`/sites/${siteId}`); 




        
    } catch (error) {
        console.error(error)
        res.render('error/500', {errorDesc:error})
        
    }
})


//@desc Show a Production Line
//@route GET: /sites/:siteId/lines/:lineId

router.get('/:id',ensureAuth, async(req,res)=>{

    try {
        const lineId = req.params.id; 
        const line = await Line.findById(lineId)
                    .populate({path:'workcenters'})
                    .populate({path:'user'})
                    .sort({createdAt:'desc'})
                    .lean(); 

        const siteId = req.params.siteId;

        
        const site = await Site.findById(siteId)
                        .populate({path:'lines', match:{_id: lineId}})
                        .populate({path:'user'})
                        .sort({createdAt:'desc'})
                        .lean()

        res.render('lines/show', {layout: "line",
                                                line:line,
                                                lineCreator: line.user,
                                                workcenters: line.workcenters,
                                                site:site,
                                                loggedUser: req.user, 
                                                name: req.user.firstName, 
                                                img: req.user.image})

        
    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }
})



//@desc Delete Line
//@route DELETE /sites/:siteId/lines/:id

router.delete('/:id',ensureAuth, async(req,res)=>{
    try {
        const deletedId = req.params.id;
        const line = await Line.findById(deletedId)

        if (!line) {
            res.render('error/404')
                        
        }

        if (line.user != req.user.id){
            res.redirect('/dashboard')
        }else{
            const siteId = req.params.siteId; 
            const lineId = req.params.id;
            const line = await Line.findById(lineId).lean()
            const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

            youtube.playlists.delete(
                {
                    id: line.youtube_playlist_id,
                },
                async function (err, data, res) {
                    if (err) {
                        console.log(err);
                        res.end("Something went wrong");
                    } else if (data) {
                        await Site.findByIdAndUpdate(siteId,{$pull:{lines:lineId}})
                        await Line.deleteOne({_id: req.params.id})
        
                        console.log('deletion data:', data.data);
                    }
                }
            )
            res.redirect(`/sites/${siteId}`)

        }



    } catch (error) {
        console.error(error)
        return res.render('error/500')
        
    }
})



//@desc Show Index/Line Dashboard
//@route GET:/site/:siteId/lines

router.get('/', async(req,res)=>{
    try {
        const siteId = req.params.siteId; 
        const site = await Site.findById(siteId)
        .populate({path:'lines'})
        .populate({path:'user'})
        .sort({createdAt:'desc'})
        .lean()



        res.render('lines/index',{site:site, name: req.user.firstName, img: req.user.image})


        
    } catch (error) {
        console.error(error)
        res.render('error/404')
    }

})

//@ desc Show Lines Edit Page: 
//@ route GET:/sites/siteId/lines/:lineId/edit

router.get('/:id/edit',ensureAuth, async(req,res)=>{
    try {
        const lineId = req.params.id;
        const siteId = req.params.siteId; 
        const line = await Line.findById(lineId).lean();
        const site = await Site.findById(siteId).lean(); 

        if (!line && line.user != req.user.id) {
            res.render('error/404')           
        }else{
            res.render('lines/edit', {line : line, site:site})
        }
        
    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }

})

// @desc Update Line: 
// @route PUT: /sites/:siteId/lines/:id/edit

router.put('/:id/edit',ensureAuth, async(req,res)=>{
    try {
        const lineId = req.params.id; 
        var  line = await Line.findById(lineId).lean(); 
        if (!line && line.user != req.user.id) {
            res.render('error/404')           
        }else{
            const siteId = req.params.siteId;
            var site = await Site.findById(siteId);
            var newTitle = req.body.title;

            const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

            youtube.playlists.update(
                {
                    resource: {
                        kind: "youtube#playlist",
                        id: line.youtube_playlist_id,
                        snippet: {
                            title: newTitle,
                            description: "THIS PLAYLIST DESCRIPTION IS CHANGED",
        
                        },
                    },
                    part: "snippet",
        
                },
                async function (err, data, res) {
                    if (err) {
                        console.log(err);
                       
                    } else if (data) {
        
                        console.log('edited data response: ',data.data);
                        var editLine = await Line.findOneAndUpdate({_id: req.params.id}, req.body,{
                            new: true,
                            runValidators: true,
                        })

                    }
                }
        
            )
            req.flash('success', `${line.title} is successfully updated...!`)
            res.redirect(`/sites/${site._id}/lines`)
        }

        
    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }

})









//@desc Search in sites: 
//@route GET: /sites/:siteId/lines/search/:query

router.get('/search/:query',ensureAuth, async(req,res)=>{

    try {
        const siteId = req.params.siteId; 
        const site = await Site.findById(siteId)
        .populate({path:'lines', match:{title: new RegExp(req.query.query,'i')}})
        .populate({path:'user'})
        .sort({createdAt:'desc'})
        .lean()
        res.render('lines/index',{site:site, name: req.user.firstName, img: req.user.image})

    } catch (error) {
        console.log(error)
        res.render('error/404')
    }

})





module.exports = router; 
