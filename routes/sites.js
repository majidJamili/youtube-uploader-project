const express = require('express');
const { appengine } = require('googleapis/build/src/apis/appengine');
const router = express.Router();
const axios = require('axios'); 





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

router.post('/add', (req, res) => {
    console.log(req.body.site); 
    res.send('form submission was successful')

})

module.exports = router; 