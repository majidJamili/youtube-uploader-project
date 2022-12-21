const express = require('express');
const router = express.Router();
const axios = require('axios'); 
const Site = require('../models/sites'); 


//GET SITE INDEX PAGE
// @GET /sites/ 
router.get('/',async (req, res) => {
    try {
        const sites = await Site.find({}).lean()
        console.log(process.env.GOOGLE_MAP_KEY)
        res.render('sites/index', {sites: sites})

    } catch (error) {
        console.error(error)
        return res.render('error/500')
        
    }

})


//GET ADD SITE FORM
// @GET /sites/add

router.get('/add', (req, res) => {
    res.render('sites/add')


})

//GET SITE SPECIFIC PAGE
// @GET /sites/:id


router.get('/:id',async (req, res) => {
    try {

        var site = await Site.findById(req.params.id).lean()

        if (!site) {
            return res.render('error/404')
        }
        res.render('sites/show', {site: site })

    } catch (error) {
        console.error(error)
        return res.render('error/500')
        
    }

})



//GET ADD FORM SITE: 



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


//GET Show add




//CREATE
router.post('/add', async(req, res) => {
    try {
        await Site.create(req.body.data)
        console.log('new site created successfully')


    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }


})


//DELETE SITE: 
//@ DELETE /sites/:id
router.delete('/:id', async(req,res)=>{
    try {
        var site = await Site.findById(req.params.id).lean()
        if(!site){
            res.render('error/404')
        }
        await Site.remove({_id: req.params.id})
        res.redirect('/dashboard')       
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

// SEARCH SITE: 
//@ GET /sites/search/:query

router.get('/search/:query', async(req,res)=>{

    try {
        console.log('query', req.query.query)
        const sites = await Site.find({title: new RegExp(req.query.query,'i')})
        .sort({ createdAt: 'desc'})
        .lean()
        console.log('sites',sites)
        res.render('sites/index', { sites })
    } catch (error) {
        console.log(error)
        res.render('error/404')
    }

})




module.exports = router; 