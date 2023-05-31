const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const userSchema = mongoose.Schema({
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

const User = mongoose.model('User',userSchema)

module.exports= User