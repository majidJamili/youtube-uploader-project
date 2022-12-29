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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    site:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Site'
    },    

    createdAt:{
        type:Date, 
        default:Date.now
    }
})

module.exports= mongoose.model('Line', LineSchema); 