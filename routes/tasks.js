const express = require('express');
const router = express.Router();
const Task = require('../models/tasks'); 
const BSON = require('bson'); 

router.get('/', (req, res) => {
    res.send('you got access to tasks')

})

router.post('/add', async(req, res) => {
    var passData = req.body; 
    try {
            await Task.insertMany(passData)
        } catch (err) {
            console.log(err)            
        }
})




module.exports = router; 