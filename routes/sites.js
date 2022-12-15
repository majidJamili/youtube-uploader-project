const express = require('express');
const { appengine } = require('googleapis/build/src/apis/appengine');
const router = express.Router();

router.get('/', (req, res) => {

    res.render('sites/add')
})

router.post('/', (req, res) => {

})

module.exports = router; 