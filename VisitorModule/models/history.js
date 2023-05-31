const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

const historySchema = mongoose.Schema({
    vname: String,
    vid: String,
    govtid: String,
    emailError: String,
    mobile: String,
    birthdate: String,
    gender:String,
    address:String,
    company:String,
    designation:String,
    department:String,
    purpose:String,
    cardno:String,
    file:String,
    checkindate:String,
    checkintime:String,
    checkouttime:String,
    gatepass:String,
    items:String
})
        
    
const History = mongoose.model('History',historySchema)

module.exports= History