const mongoose = require('mongoose'); 

const LineSchema = new mongoose.Schema({
    title:{
        type:String, 
        require:true, 
        trim:true
    },

    body:{
        type:String, 
        require:true
    },
    status:{
        type:String, 
    },
    processTime:{
        type:Number
    },
    takt:{
        type:Number
    },
    products:{
        type:Array
    },
    workcenters:{
        type:Array
    },
    videos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    site:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Site'
    },  
    youtube_playlist_channel_id:{
        type:String
    },
    youtube_playlist_id:{
        type:String
    },
    createdAt:{
        type:Date, 
        default:Date.now
    }
})

module.exports= mongoose.model('Line', LineSchema); 