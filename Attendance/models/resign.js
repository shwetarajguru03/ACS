const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

const resignSchema = mongoose.Schema({
    firstname: String,
    middlename: String,
    lastname: String,
    email: String,
    num: String,
    date3: String,
    lastpost: String,
    comments: String,
    date4: String,
    id: String,
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending'
    }
  });
  
  const Resign = mongoose.model('Resign', resignSchema);
  
  module.exports = Resign;
  