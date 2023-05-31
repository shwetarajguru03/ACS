const mongoose = require ('mongoose')
mongoose.set('strictQuery', true);

const scheduleSchema = {
name:String,
empid:String,
email:String,
jobno:String,
department:String,
joiningdate:String,
selectedshift:String,
effectivedate:String,
shiftenddate:String,
week:String,
duration:String,
duration1:String
}

const Schedule = mongoose.model('schedule',scheduleSchema)
module.exports= Schedule 
