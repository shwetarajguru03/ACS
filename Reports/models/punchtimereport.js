const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const punchtimereportSchema = mongoose.Schema({
empid:String,
name:String,
date:String,
shift:String,
shiftstarttime:String,
shiftendtime:String,
intime:String,
outtime:String,
totaltime:String
})
        
    
const Punchtimereport = mongoose.model('Punchtimereport',punchtimereportSchema)

module.exports= Punchtimereport