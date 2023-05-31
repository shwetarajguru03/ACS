const express=require('express')
const cors = require('cors');
const app=express()
app.use(cors())
const http = require('http');
const server = http.createServer(app);
const loginRouter = require('./Attendance/routers/login')
const empdataRouter = require('./Reports/routers/empdata.js')
const attendancerequestRouter = require('./Attendance/routers/attendancerequest')
const userRouter = require('./Attendance/routers/user')
const leavesRouter = require('./Attendance/routers/leaves')
const resignRouter = require('./Attendance/routers/resign')
const holidayRouter = require('./Attendance/routers/holiday')
const attendanceRouter = require('./Attendance/routers/attendance')
const unknownpersonRouter = require('./Attendance/routers/unknownperson')
const userhistoryRouter = require('./Attendance/routers/userhistory')
const machinestatusRouter = require('./MachineStatus/routers/machinestatus')
const visitorsRouter = require('./VisitorModule/routers/visitors')
const historyRouter = require('./VisitorModule/routers/history.js')
const scheduleRouter = require('./TimeManagement/routers/schedule')
const weekdayovertimeRouter = require('./TimeManagement/routers/weekdayovertime.js')
const holidayovertimeRouter = require('./TimeManagement/routers/holidayovertime.js')
const earlygoingreportRouter = require('./Reports/routers/earlygoingreport.js')
const LatecomingreportRouter = require('./Reports/routers/latecomingreport.js')
const AbsentreportRouter = require('./Reports/routers/absentreport.js')
const Payrollreport = require('./Reports/routers/payrollreport.js')
const Punchtimereport = require('./Reports/routers/punchtimereport.js')
const TimecardreportRouter = require('./Reports/routers/timecardreport.js')
const AnnouncementRouter = require('./Navbar/routers/announcement')
const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
const bodyParser = require('body-parser')
const path = require('path')
const publicPath = path.join(__dirname,'public')
const moment = require("moment");
const fs = require("fs");
const csv = require('csv-parser');
const cron = require('node-cron');
const db = mongoose.connection;
require('dotenv').config();
const multer = require ('multer')


mongoose.connect('mongodb://attendancemongodb2:0LWjdwwdIWMINVeZX0qnPbCiTvKtqHQbMQby0JA4r0WQ5IeggVMDpXqPWPBENsqHMIRX2AbUDd1dACDbACi43g==@attendancemongodb2.mongo.cosmos.azure.com:10255/attendancemongodb?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@attendancemongodb2@')
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to database!');
});

 // Code for new empdata collection
const Attendance = require('./Attendance/models/attendance'); 
const User = require('./Attendance/models/user'); 
const Empdata = require('./Reports/models/empdata.js'); 
const UnknownPerson = require('./Attendance/models/unknownperson');
const Schedule = require('./TimeManagement/models/schedule.js')
const Holidayovertime = require('./TimeManagement/models/holidayovertime')
const Weekdayovertime = require('./TimeManagement/models/weekdayovertime');
const { time } = require('console');
// Run function every day at midnight 
// cron.schedule('*/10 * * * * *', async  () => {
cron.schedule('0 0 * * *', async() => {
  try {
    const empdata = await Attendance.find();
    const promises = empdata.map(async (attendance) => {
      const user = await User.findOne({ empid: attendance.empid });
      const name = user ? user.name : '';
      const attendanceDate = moment(attendance.date, 'DD-MM-YYYY');
      const formattedDate = attendanceDate.format('YYYY-MM-DD');
      return {
      empid: attendance.empid,
      name: name,
      date: formattedDate,
      intime: attendance.readerno === '1' ? attendance.time : null,
      outtime: attendance.readerno === '2' ? attendance.time : null

      };
    });
    
    const empdataWithNames = await Promise.all(promises);
    const empdataWithIntimeAndOuttime = {};

    for (let i = 0; i < empdataWithNames.length; i++) {
      const attendance = empdataWithNames[i];
      const key = `${attendance.empid}_${attendance.name}_${attendance.date}`;

      if (!empdataWithIntimeAndOuttime[key]) {
        empdataWithIntimeAndOuttime[key] = {
          empid: attendance.empid,
          name: attendance.name,
          date: attendance.date,
          intime: attendance.intime,
          outtime: attendance.outtime,
          totaltime: null,
          selectedshift: null,
          totalot: null
        };
      } else {
        empdataWithIntimeAndOuttime[key].intime = attendance.intime || empdataWithIntimeAndOuttime[key].intime;
        empdataWithIntimeAndOuttime[key].outtime = attendance.outtime || empdataWithIntimeAndOuttime[key].outtime;
      }
    }

    const selectedShift = await Schedule.findOne();

  const empdataWithTotaltime = await Promise.all(
  Object.values(empdataWithIntimeAndOuttime).map(async (attendance) => {
    const intime = attendance.intime ? new Date(`1970-01-01T${attendance.intime}.000Z`) : null;
    const outtime = attendance.outtime ? new Date(`1970-01-01T${attendance.outtime}.000Z`) : null;
    const totaltimeInMs = intime && outtime ? outtime.getTime() - intime.getTime() : null;
    const totaltimeInHours = totaltimeInMs ? (totaltimeInMs / (1000 * 60 * 60)).toFixed(2) : null;

        let totalot = null;
    
        // Fetch weekdayOvertime and holidayOvertime for each employee
        const weekdayOvertime = await Weekdayovertime.findOne({ empid: attendance.empid, name: attendance.name });
        const holidayOvertime = await Holidayovertime.findOne({ empid: attendance.empid, name: attendance.name });
    
        if (weekdayOvertime) {
          totalot = weekdayOvertime.totalot;
        } else if (holidayOvertime) {
          totalot = holidayOvertime.totalot;
        }
    
        return {
          empid: attendance.empid,
          name: attendance.name,
          date: attendance.date,
          intime: attendance.intime,
          outtime: attendance.outtime,
          totaltime: totaltimeInHours,
          selectedshift: selectedShift ? selectedShift.selectedshift : null,
          totalot: totalot
        };
      })
    );

    const result = await Empdata.insertMany(empdataWithTotaltime);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});


// Code for Unknownperson collection
cron.schedule('0 0 * * *', async() => {
  // cron.schedule('*/10 * * * * *', async  () => {
const findUnknownPerson = async () => {
  try {
    const attendance = await Attendance.find({ empid: '19231', readerno: '2' });
    if (attendance.length > 0) {
      const unknownPersons = attendance.map((a) => ({
        empid: '19231',
        name: 'Unknown',
        date: a.date,
        time: a.time,
      }));
      const result = await UnknownPerson.insertMany(unknownPersons);
      console.log(result);
    } else {
      console.log('No unknown person found in attendance collection');
    }
  } catch (err) {
    console.error(err);
  }
};

findUnknownPerson();
})
 

app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/Visitorimages', express.static(path.join(__dirname, '..', 'Visitorimages')));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.json())
app.use(loginRouter)
app.use(empdataRouter)
app.use(attendancerequestRouter)
app.use(userRouter)
app.use(leavesRouter)
app.use(resignRouter)
app.use(holidayRouter)
app.use(attendanceRouter)
app.use(unknownpersonRouter)
app.use(machinestatusRouter)
app.use(visitorsRouter)
app.use(scheduleRouter)
app.use(weekdayovertimeRouter)
app.use(holidayovertimeRouter)
app.use(historyRouter)
app.use(earlygoingreportRouter)
app.use(LatecomingreportRouter)
app.use(AbsentreportRouter)
app.use(Payrollreport)
app.use(Punchtimereport)
app.use(TimecardreportRouter)
app.use(AnnouncementRouter)
app.use(userhistoryRouter)
moment()
app.use(express.static(publicPath))



// Connect to your MongoDB database
// mongoose.connect('mongodb://127.0.0.1:27017/ERP', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('connected to database!');
// });



//Port 5000
const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log('Server is up on port'+ ' ' +port)
})