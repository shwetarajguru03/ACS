const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const unknownPersonSchema = mongoose.Schema({
    empid: String,
    name: { type: String, default: 'Unknown' },
    date: String,
    time: String
  });


  const UnknownPerson = mongoose.model('Unknownperson',unknownPersonSchema)

module.exports= UnknownPerson