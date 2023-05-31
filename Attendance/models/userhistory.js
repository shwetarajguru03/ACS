const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const userhistorySchema = mongoose.Schema({
    name: String,
    empid: String,
    email: String,
    mobile: String,
    birthdate: String,
    maritalstatus: String,
    bloodgroup: String,
    gender: String,
    address: String,
    administrator:String,
    jobno: String,
    designation:String,
    department: String,
    joiningdate: String,
    file:String
    

    })

const Userhistory = mongoose.model('Userhistory',userhistorySchema)

module.exports= Userhistory