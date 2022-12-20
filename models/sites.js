const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const SiteSchema = new mongoose.Schema({
    title:{
        type:String, 
        require:true, 
        trim:true
    },
    coordinates: {
            type: Array,
            required: true
    },
    
    google_place_id:{
        type:String, 
        require:true
    },
    address:{
        type:String, 
        require:true
    },
    
    contact:{
        type:String, 
    },
    lines:[{
        type: Schema.Types.ObjectId,
        ref: 'Line'
    }], 
    createdAt:{
        type:Date, 
        default:Date.now
    }
})

module.exports= mongoose.model('Site', SiteSchema); 