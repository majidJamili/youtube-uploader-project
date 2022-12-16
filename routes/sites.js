const express = require('express');
const { appengine } = require('googleapis/build/src/apis/appengine');
const router = express.Router();

router.get('/', (req, res) => {

    res.render('sites/add')
})

router.post('/add', (req, res) => {
    console.log(req.body.site); 
    res.send('form submission was successful')

})

module.exports = router; 