const mongoose = require('mongoose'); 

const SiteSchema = new mongoose.Schema({
    title:{
        type:String, 
        require:true, 
        trim:true
    },
    geometry: {
        type: {
            type: String,
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    address:{
        type:String, 
        require:true
    },
    lat:{
        type:String, 
        require:true
    },
    long:{
        type:String, 
        require:true
    },
    suburb:{
        type:String, 
        require:true
    },
    state:{
        type:String, 
        require:true
    },
    country:{
        type:String, 
        require:true
    },
    zipcode:{
        type:String, 
        require:true
    },
    contact:{
        type:String, 
    },
    lines:{
        type:Array
    },
    createdAt:{
        type:Date, 
        default:Date.now
    }
})

module.exports= mongoose.model('Site', SiteSchema); 