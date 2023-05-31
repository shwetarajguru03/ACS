const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const holidaySchema = mongoose.Schema({
    srno:Number,
    occasion:String,
    day:String,
    date:String
     
    })

const Holiday = mongoose.model('Holiday',holidaySchema)

module.exports= Holiday