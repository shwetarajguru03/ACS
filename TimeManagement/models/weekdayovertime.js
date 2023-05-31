const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const weekdayovertimeSchema = mongoose.Schema({
    name:String,
    empid:String,
    department:String,
    overtimedate:String,
    totalot:String,
    selectedshift:String,
    compensation:String
     
    })

const Weekdayovertime = mongoose.model('Weekdayovertime',weekdayovertimeSchema)

module.exports= Weekdayovertime