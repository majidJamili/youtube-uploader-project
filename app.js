const express = require('express'); 
const app = express(); 
const path = require('path'); 
const mongoose = require('mongoose'); 
const methodOverride = require('method-override');



const Video = require('./models/videos'); 


mongoose.connect('mongodb://localhost:27017/youtubeUploader',{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log('Mongo Connection Started')
    })
    .catch(err=>{
        console.log('Oh NO Mongo Connection Error!!')
        console.log(err)
    }); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
    
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get('/',(req,res)=>{
    res.render('home.ejs'); 
})

app.get('/uploadvideo', (req,res)=>{
    res.render('videos/add.ejs');
})


app.post('/uploadvideo', async(req,res)=>{
    const newVideo = new Video(req.body.video);
    await newVideo.save(); 
    res.redirect('/videos')

})

app.get('/videos', async(req,res)=>{
    const videos = await Video.find({});
    res.render('videos/index.ejs',{videos});
})
app.get('/video/:id', async(req,res)=>{
    const {id} = req.params; 
    const videoFound = await Video.findById(id);
    res.render('videos/show',{videoFound});
    
})
app.get('/video/:id/edit',async(req,res)=>{
    const {id} = req.params; 
    const video = await Video.findById(id);
    res.render('videos/edit.ejs',{video});    
})

app.put('/videos/:id',async(req,res)=>{
    const {id} = req.params; 
    console.log(req.body.video);

    const video = await Video.findByIdAndUpdate(id,req.body.video,
         { runValidators: false, new: true });
    res.redirect(`/video/${video._id}`);
})

app.delete('/videos/:id',async(req,res)=>{
    const {id} = req.params; 
    const deletedVideo = await Video.findByIdAndDelete(id); 
    res.redirect('/videoindex'); 

})


app.listen(3000, ()=>{
    console.log("YOUTUBE PROJECT IS LISTENING ON PORT 3000")
})