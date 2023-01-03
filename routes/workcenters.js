const express = require('express'); 
const router = express.Router({mergeParams:true})
const Line = require('../models/lines'); 
const Workcenter = require('../models/workcenters'); 
const {ensureAuth} = require('../middlewares'); 
const { route } = require('./sites');

// @desc: show workcenter add form: 
// @route: GET /lines/:lineId/wc/add
router.get('/add', ensureAuth, async(req,res)=>{
    try {
        const lineId = req.params.lineId;
     
        const line = await Line.findById(lineId).lean(); 

        res.render('workcenters/add',{line:line})
        
    } catch (error) {
        console.log(error)
        res.render('error/404', {errorDesc:error})
        
    }

})

// @desc: create workcenter 
// @route: POST /lines/:lineId/wc/add
router.post('/add', ensureAuth, async(req,res)=>{
    try {
        const line = await Line.findById(req.params.lineId).populate('site');
        req.body.wc.user = req.user.id; 
        const wc = new Workcenter(req.body.wc); 
        line.workcenters.push(wc); 
        await wc.save();
        await line.save();
        console.log('line id', line.site)
        res.redirect(`/sites/${line.site._id}/lines/${line._id}`)

    } catch (error) {
        console.log(error)
        res.render('error/404', {errorDesc:error})
        
    }

})




module.exports = router; 