const express = require('express');
const router = express.Router({mergeParams:true});
const Site = require('../models/sites'); 
const {ensureAuth}=require('../middlewares'); 
const Line = require('../models/lines');



//desc Show add page
//route @ GET /sites/:siteId/lines/add

router.get('/add', async(req,res)=>{

    try {
        console.log(req.params)
        const siteId = req.params.siteId; 
        const site = await Site.findById(siteId).lean();    
        res.render('lines/add', {site:site})

        
    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }
})

//Create Line
//@ POST /sites/:siteId/lines/add
router.post('/add',ensureAuth, async(req,res)=>{
    try {
        const siteId = req.params.siteId; 
        const site = await Site.findById(siteId); 
        req.body.user = req.user.id; 
        req.body.site = siteId; 
        const line = new Line(req.body); 
        site.lines.push(line); 
        await site.save()
        await line.save()
        req.flash('success', `A new line is successfully created at ${site.title} site`)
        res.redirect(`/sites/${siteId}`)
        

        
    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }
})


//@desc Show a Production Line
//@route GET: /sites/:siteId/lines/:lineId

router.get('/:id',ensureAuth, async(req,res)=>{

    try {
        const lineId = req.params.id; 
        // const line = await Line.findById(lineId); 
        const siteId = req.params.siteId;
        const site = await Site.findById(siteId)
                        .populate({path:'lines', match:{_id: lineId}})
                        .populate({path:'user'})
                        .sort({createdAt:'desc'})
                        .lean()
   

        res.render('lines/show', {site:site, name: req.user.firstName, img: req.user.image})

        
    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }
})



//@desc Delete Line
//@route DELETE /sites/:siteId/lines/:id

router.delete('/:id',ensureAuth, async(req,res)=>{
    try {
        const deletedId = req.params.id;
        const line = await Line.findById(deletedId)

        if (!line) {
            res.render('error/404')
                        
        }

        if (line.user != req.user.id){
            res.redirect('/dashboard')
        }else{
            const siteId = req.params.siteId; 
            const lineId = req.params.id;

            await Site.findByIdAndUpdate(siteId,{$pull:{lines:lineId}})
            await Line.deleteOne({_id: req.params.id})
            res.redirect(`/sites/${siteId}`)
        }



    } catch (error) {
        console.error(error)
        return res.render('error/500')
        
    }
})



//@desc Show Index/Line Dashboard
//@route GET:/site/:siteId/lines

router.get('/', async(req,res)=>{
    try {
        const siteId = req.params.siteId; 
        const site = await Site.findById(siteId)
        .populate({path:'lines'})
        .populate({path:'user'})
        .sort({createdAt:'desc'})
        .lean()



        res.render('lines/index',{site:site, name: req.user.firstName, img: req.user.image})


        
    } catch (error) {
        console.error(error)
        res.render('error/404')
    }

})

//@ desc Show Lines Edit Page: 
//@ route GET:/sites/siteId/lines/:lineId/edit

router.get('/:id/edit',ensureAuth, async(req,res)=>{
    try {
        const lineId = req.params.id;
        const siteId = req.params.siteId; 
        const line = await Line.findById(lineId).lean();
        const site = await Site.findById(siteId).lean(); 

        if (!line && line.user != req.user.id) {
            res.render('error/404')           
        }else{
            res.render('lines/edit', {line : line, site:site})
        }
        
    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }

})

// @des Update Line: 
// @route PUT: /sites/:siteId/lines/:id/edit

router.put('/:id/edit',ensureAuth, async(req,res)=>{
    try {
        const lineId = req.params.id; 
        var  line = await Line.findById(lineId).lean(); 
        if (!line && line.user != req.user.id) {
            res.render('error/404')           
        }else{
            const siteId = req.params.siteId; 

            var site = await Site.findById(siteId); 
            var editLine = await Line.findOneAndUpdate({_id: req.params.id}, req.body,{
                new: true,
                runValidators: true,
            })
            req.flash('success', `${editLine.title} is successfully updated...!`)
            res.redirect(`/sites/${site._id}/lines`)
        }
        
    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }

})










// @desc Search in sites: 
//@route GET: /sites/:siteId/lines/search/:query

router.get('/search/:query',ensureAuth, async(req,res)=>{

    try {
        const siteId = req.params.siteId; 
        const site = await Site.findById(siteId)
        .populate({path:'lines', match:{title: new RegExp(req.query.query,'i')}})
        .populate({path:'user'})
        .sort({createdAt:'desc'})
        .lean()
        res.render('lines/index',{site:site, name: req.user.firstName, img: req.user.image})

    } catch (error) {
        console.log(error)
        res.render('error/404')
    }

})





module.exports = router; 
