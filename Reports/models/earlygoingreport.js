const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const earlygoingreportSchema = mongoose.Schema({
empid: String,
name: String,
designation: String,
department:String,
date: String,
shiftcheckout: String,
outtime: String,
shift:String
})
        
    
const Earlygoingreport = mongoose.model('Earlygoingreport',earlygoingreportSchema)

module.exports= Earlygoingreport
