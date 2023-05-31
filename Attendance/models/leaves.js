const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const leavesSchema = mongoose.Schema({
    employeename:String,
    leavetype:String,
    from:String,
    to:String,
    reason:String,
    id:String,
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
      }    
    })

const Leaves = mongoose.model('Leaves',leavesSchema)

module.exports= Leaves