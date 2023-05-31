const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const holidayovertimeSchema = mongoose.Schema({
    name: String,
    empid: String,
    department: String,
    requestdate: Date,
    checkin: String,
    checkout: String,
    totalot: String,
    breaktime1: String,
    compensation1: String
    })

const Holidayovertime = mongoose.model('Holidayovertime',holidayovertimeSchema)

module.exports= Holidayovertime