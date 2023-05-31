const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const timecardreportSchema = mongoose.Schema({
empid: String,
name: String,
date: String,
intime:String,
outtime:String,
timehrs:String,
totaltime:String
})
        
    
const Timecardreport = mongoose.model('Timecardreport',timecardreportSchema)

module.exports= Timecardreport