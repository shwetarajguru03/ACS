const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const latecomingreportSchema = mongoose.Schema({
empid: String,
name: String,
designation: String,
department:String,
date: String,
shiftcheckin: String,
intime: String,
shift:String
})
        
    
const Latecomingreport = mongoose.model('Latecomingreport',latecomingreportSchema)

module.exports= Latecomingreport