const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const announcementSchema = mongoose.Schema({
announcement:String

})


const Announcement = mongoose.model('Announcement',announcementSchema)

module.exports= Announcement