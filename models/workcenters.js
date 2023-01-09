const mongoose = require('mongoose'); 

const WorkcenterSchema = new mongoose.Schema({
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
    products:[{
        type:Array
    }],
    line:[{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Line'
    }],    
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    sequence:{
        type:Number
    },
    createdAt:{
        type:Date, 
        default:Date.now
    }
})

module.exports= mongoose.model('Workcenter', WorkcenterSchema); 