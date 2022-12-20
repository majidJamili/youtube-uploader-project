const express = require('express');
const { appengine } = require('googleapis/build/src/apis/appengine');
const router = express.Router();
const axios = require('axios'); 
const Site = require('../models/sites'); 





router.get('/', (req, res) => {
    res.render('sites/add', {config: process.env.GOOGLE_MAP_KEY})

})

router.post('/getaddress', (req,res)=>{

    console.log(req.body)
    var config = {
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input="100 King St W, Toronto, ON M5X 1A9, Canada"&types=geocode&key=AIzaSyAqEC6E_t0LzLmtnminHw3Y99kHjmOZRl4',
        headers: { }
      };
    

      axios(config)
                            .then(function (response) {
                            console.log(JSON.stringify(response.data.predictions[0].place_id));
                            res.render('sites/add', {data: (response.data.predictions[0].place_id)})

                            })
                            .catch(function (error) {
                            console.log(error);
                            res.render('error/404')
                            });
      

})

//Show Edit Site:
//GET /sites/:id/edit
router.get('/:id/edit', async(req,res)=>{
    try {
        const id = req.params.id; 
        const site = await Site.findById(id).lean()
        if(!site){
            return res.render('error/404')
        }else{
            res.render('sites/edit', {site:site})
        }
    } catch (error) {
        console.error(error)
        return res.render('error/500')
        
    }

})



// Edit Sites:
// PUT: /edit
router.put('/edit', async(req, res) => {
    console.log(req.body);
    const id = req.body.id; 
    const data = req.body.data; 
    const video = await Site.findOneAndUpdate({_id: id}, data,{
        new: true,
        runValidators: true,
    })

})


//DELETE SITE: 
router.delete('/:id', async(req,res)=>{
    const id = req.params.id; 
    await Site.remove({id})
    const sites = await Site.find().lean()
    res.render('dashboard',{sites:sites})


})

module.exports = router; 