const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
// mongoose.Promise = global.Promise;

const empdataSchema = mongoose.Schema({
empid: String,
name: String,
date: String,
intime: String,
outtime: String,
totaltime: String,
selectedshift:String,
totalot:String
})
        
    
const Empdata = mongoose.model('Empdata',empdataSchema)

module.exports= Empdata


