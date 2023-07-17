

const mongoose=require('mongoose');
const taskSchema= new mongoose.Schema({
    title:{
        type:String
    },
    description: String,
    status:{
        type:Boolean,
        default:false
        
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('Task',taskSchema);








// const mongoose=require('mongoose');
// const taskSchema= new mongoose.Schema({
//     title:{
//         type:String
//     },
//     description: String,
//     status:{
//         type:String,
//         enum:['pending','in progress','completed'],
//         default:'pending'
//     },
//     user:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref:'User'
//     },
//     timestamp:{
//         type:Date,
//         default:Date.now
//     }
// })

// module.exports=mongoose.model('Task',taskSchema);