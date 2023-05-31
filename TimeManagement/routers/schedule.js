const express = require('express')
const router = new express.Router()
const Schedule = require('../models/schedule')
const User = require('/ACS_backend/Attendance/models/user')

router.post('/schedules', function (req, res) {
    const selectedUsers = req.body.selectedUsers; // an array of selected user IDs
    
    // Fetch the user documents from the User collection based on selectedUsers
    User.find({ _id: { $in: selectedUsers } }, 'name empid email jobno department joiningdate', function (err, users) {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
  
      if (!users || users.length === 0) {
        return res.status(404).send('No users found');
      }
  
      // Create an array of Schedule documents using data from the User documents and req.body
      const schedules = users.map(user => new Schedule({
        name: user.name,
        empid: user.empid,
        email: user.email,
        jobno: user.jobno,
        department: user.department,
        joiningdate: user.joiningdate,
        selectedshift: req.body.selectedshift,
        effectivedate: req.body.effectivedate,
        shiftenddate: req.body.shiftenddate,
        week: req.body.week,
        duration: req.body.duration,
        duration1: req.body.duration1
      }));
  
      // Save the new Schedule documents to the database
      Schedule.insertMany(schedules, function (err, schedules) {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
        res.status(201).json(schedules);
      });
    });
  });
  


    //get schedule
    router.get('/schedules',(req,res)=>{
        Schedule.find()
        .then(result=>{
         res.status(200).json(result)
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
        error:err
        })
       })
    })


    //multiple delete 
router.delete('/schedules', (req, res) => {
    const scheduleIds = req.body.scheduleIds;
  
    if (!scheduleIds || !Array.isArray(scheduleIds) || scheduleIds.length === 0) {
      return res.status(400).send({ error: 'Invalid resign IDs' });
    }
  
    let deletedSchedules = [];
  
    for (let i = 0; i < scheduleIds.length; i++) {
      const scheduleId = scheduleIds[i];
  
      Schedule.findByIdAndDelete(scheduleId, (err, deletedSchedule) => {
        if (err) {
          console.log('Error deleting request:', err);
          return res.status(500).send({ error: 'Could not delete request' });
        }
  
        if (!deletedSchedules) {
          return res.status(404).send({ error: `User with ID ${scheduleId} not found` });
        }
  
        deletedSchedule.push(deletedSchedule);
  
        if (deletedSchedule.length === scheduleIds.length) {
         
          res.send({ message: 'Request deleted successfully', deletedSchedule });
        }
      });
    }
  });
    
// update schedule
router.put('/schedules/:id', async (req, res) => {
    const id = req.params.id;
    const { name, empid, email,jobno,department,joiningdate,selectedshift,effectivedate,shiftenddate,week,duration,duration1 } = req.body;
    try {
      const schedule = await Schedule.findByIdAndUpdate(
        id,
        { name, empid, email,jobno,department,joiningdate,selectedshift,effectivedate,shiftenddate,week,duration,duration1 },
        { new: true }
      );
      if (!schedule) {
        res.status(404).send('schedule not found');
      } else {
        res.send(schedule);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating schedule');
    }
  });
  
  module.exports = router