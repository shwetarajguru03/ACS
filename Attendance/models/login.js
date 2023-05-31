const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const loginSchema = mongoose.Schema({
    email:{
        type:String,required: true
    },
    password:{
        type:String,required: true
    },
    firstname:{
        type:String,required: true
    },
    lastname:{
        type:String,required: true
    },
    mobile:{
        type:String,required: true
    },
    department:{
        type:String,required: true
    },
    joiningdate:{
        type:String,required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
    } ,
    resetPasswordToken: String,
    resetPasswordExpires: Date
    
    })

const Login = mongoose.model('Login',loginSchema)

module.exports= Login