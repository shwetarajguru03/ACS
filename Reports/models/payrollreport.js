const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const payrollreportSchema = mongoose.Schema({
empid: String,
name: String,
designation: String,
department:String,
workingdays: String,
totaltime:String
})
        
    
const Payrollreport = mongoose.model('Payrollreport',payrollreportSchema)

module.exports= Payrollreport