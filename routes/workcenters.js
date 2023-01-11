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
        req.body.wc.line = await Line.findById(req.params.lineId); 
        
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


// @desc: Get edit workcenter form
// @route: GET /lines/:lineId/wc/:wcId/edit
router.get('/:wcId/edit', ensureAuth, async(req,res)=>{
    try {
        const siteId = req.params.siteId; 
        const wcId = req.params.wcId;
        const wc = await Workcenter.findOne({_id: wcId,}).lean()
        const lineId = req.params.lineId;     
        const line = await Line.findById(lineId).lean(); 
        console.log('wc: ', wc)
        if (!wc) {
            res.render('error/404')            
        }
        if (wc.user != req.user.id) {
            req.flash('error', 'Need to log in...')
            res.redirect('/dashboard')
        }else{
            res.render('workcenters/edit',{line: line, wc:wc})
        }        
    } catch (error) {
        console.log(error)
        res.render('error/404', {errorDesc:error})        
    }

})



module.exports = router; 