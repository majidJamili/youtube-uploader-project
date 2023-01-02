const express = require('express');
const router = express.Router();
const Task = require('../models/tasks'); 
const Video = require('../models/videos'); 
const types =  ['Value-adding', 'Non-value-adding', 'Essential', 'Allowed Wait', 
'Transport','Waste']




//@ desc: GET Task add form
//@route: /lines/:lineId/tasks/add

router.get('/add', (req, res) => {
    const lineId = req.params.    
    res.render('tasks/add', {types:types})

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