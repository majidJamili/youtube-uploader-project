const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const oAuth2Client = require('../config/middlewares');
const { google } = require('googleapis');

//Upload a Video: 
//POST: /videos/upload
router.post('/upload', (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.end('Something went wrong')
        } else {
            const title = req.body.video.title;
            const description = req.body.video.description;
            const tags = req.body.video.tags;
            const youtube = google.youtube({
                version: 'v3',
                auth: oAuth2Client
            })
            youtube.videos.insert(
                {
                    resource: {
                        snippet: {
                            title: title,
                            description: description,
                            tags: tags
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
                function (err, data, res) {
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
