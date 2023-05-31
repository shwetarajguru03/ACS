const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

const machineStatusSchema = {
    machineid:String,
    machinename:String,
    machineip:String,
    machineport:String,
    location:String,
    floor:String,
    doorno:String,
    configdate:String,
    id:String,
    status:String,
    health:String
  };

const MachineStatus = mongoose.model('MachineStatus',machineStatusSchema)

module.exports= MachineStatus



// const mongoose = require('mongoose');
// mongoose.set('strictQuery', true);

// const machineStatusSchema = new mongoose.Schema({
//   machineid: String,
//   machinename: String,
//   machineip: String,
//   machineport: String,
//   location: String,
//   floor: String,
//   doorno: String,
//   configdate: String,
//   id: String,
//   status: {
//     type: String,
//     enum: ['off', 'on'],
//     default: 'off'
//   },
//   health: {
//     type: String,
//     default: 'poor'
//   }
// });

// machineStatusSchema.pre('save', function (next) {
//   if (this.status === 'on') {
//     this.health = 'good';
//   } else if (this.status === 'off') {
//     this.health = 'poor';
//   }
//   next();
// });

// const MachineStatus = mongoose.model('MachineStatus', machineStatusSchema);

// module.exports = MachineStatus;
