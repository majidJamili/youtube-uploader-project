const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const videosSchema = new Schema({
    title: {
        type: String
    },
    tags: {
        type:String
    },
    youtube_video_url:{
        type:String
    },
    description:{
        type:String
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }]
})

const Prodcut = mongoose.model('Video', videosSchema); 
module.exports = Prodcut; 