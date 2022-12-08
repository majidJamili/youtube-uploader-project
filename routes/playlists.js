const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const oAuth2Client = require('../config/middlewares');
const { google } = require('googleapis');
const Video = require('../models/videos');


// Get Playlist Items
//@GET: /playlists/:wsId/list


router.get('/list', async(req,res)=>{
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });  
        youtube.playlistItems.list({
          "part": ["snippet"],
          "playlistId": "PLGpckAHc3_sqcRVwer1QqNsn1uqulAZn1"
        }).then(function(response) {
                    console.log("Response", response.data.items[0].snippet.resourceId.videoId);
        },
        function(err) { console.error("Execute error", err); });
})




// Create Playlist
//Posts /playlists/create
router.post("/create", async (req, res) => {
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

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
//PUT playlists/:id/edit

router.put('/:id/edit', async (req, res) => {
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

    youtube.playlists.update(
        {
            resource: {
                kind: "youtube#playlist",
                id: "PLGpckAHc3_srn_lle8HgpwCX3dhisGmed",
                snippet: {
                    title: "PLAYLIST NAME IS UPDATED REV001",
                    description: "THIS PLAYLIST DESCRIPTION IS CHANGED",

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
// Delete Playlist
// DELETE playlists/:id/delete
router.delete('/:id/delete', (req, res) => {
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

    youtube.playlists.delete(
        {
            id: "PLGpckAHc3_sr1-MK4wohuJojZuWeBEPZc",
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

module.exports = router; 
