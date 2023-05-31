const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const absentreportSchema = mongoose.Schema({
empid: String,
name: String,
designation: String,
department:String,
date: String,
shift:String
})
        
    
const Absentreport = mongoose.model('Absentreport',absentreportSchema)

module.exports= Absentreport