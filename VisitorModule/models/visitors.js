const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
// mongoose.Promise = global.Promise;

const visitorsSchema = mongoose.Schema({
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
        
    
const Visitors = mongoose.model('Visitors',visitorsSchema)

module.exports= Visitors