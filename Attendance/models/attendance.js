const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const attendanceSchema = mongoose.Schema({
empid: Number,
building_ID: Number,
city_ID: Number,
readerno: String,
date: String,
time: String
})
        
    
const Attendance = mongoose.model('Attendance',attendanceSchema)

module.exports= Attendance
