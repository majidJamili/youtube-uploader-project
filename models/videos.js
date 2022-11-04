const mongoose = require('mongoose'); 


const videosSchema = new mongoose.Schema({
    title: {
        type:String,
    },
    genre:{
        type:String
    },
    youtube_video_url:{
        type:String
    },
    description:{
        type:String
    }
})

const Prodcut = mongoose.model('Video', videosSchema); 
module.exports = Prodcut; 