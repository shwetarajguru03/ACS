const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const attendancerequestSchema = mongoose.Schema({
    id:String,
    name:String,
    email:String,
    date3:String,
    query:String,
    reason:String,
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
    } ,
    comment:String   
});


const Attendancerequest = mongoose.model('Attendancerequest',attendancerequestSchema)

module.exports= Attendancerequest