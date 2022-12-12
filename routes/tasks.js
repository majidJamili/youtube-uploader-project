const express = require('express');
const router = express.Router();
const Task = require('../models/tasks'); 
const Video = require('../models/videos'); 

const BSON = require('bson'); 

router.get('/', (req, res) => {
    res.send('you got access to tasks')

})

router.post('/add', async(req, res) => {
    var id = req.body.id; 
    const video = await Video.findById(id); 
    if(!video){
        res.render('error/404')
    }   
    var bodyDB = req.body.data; 
    for (let task of bodyDB){
        task.video = video
        
    }
    try {
            await Task.insertMany(bodyDB)
        } catch (err) {
            console.log(err) 
            res.render('error/500')           
        }
})




module.exports = router; 