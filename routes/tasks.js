const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('you got access to tasks')

})

router.post('/add', (req, res) => {
    console.log(req.body.responses);
})




module.exports = router; 