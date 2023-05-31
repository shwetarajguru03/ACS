const express = require('express')
const router = new express.Router()
const Weekdayovertime = require('../models/weekdayovertime')
const User = require('/ACS_backend/Attendance/models/user')

router.post('/weekdayovertime', function (req, res) {
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
      const weekdayovertime = users.map(user => new Weekdayovertime({
        name: user.name,
        empid: user.empid,
        department: user.department,
        overtimedate: req.body.overtimedate,
        totalot: req.body.totalot,
        selectedshift: req.body.selectedshift,
        compensation: req.body.compensation
      }));
      // Save the new Schedule documents to the database
      Weekdayovertime.insertMany(weekdayovertime, function (err, weekdayovertime) {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
        res.status(201).json(weekdayovertime);
      });
    });
  });
  

// router.post('/weekdayovertime', async (req, res) => {
//   try {
//       const weekdayovertime = new Weekdayovertime({
//         overtimedate: req.body.overtimedate,
//         totalot: req.body.totalot,
//         breaktime: req.body.breaktime,
//         selectedshift: req.body.selectedshift,
//         compensation: req.body.compensation

//       });

//       const result = await weekdayovertime.save();
//       res.status(200).json(result);
//   } catch (err) {
//       res.status(500).json({
//           error: err.message
//       });
//   }
// });



router.get('/weekdayovertime',(req,res)=>{
    Weekdayovertime.find()
    .then(result=>{
     res.status(200).json(
    result
    )
}).catch(err=>{
    console.log(err)
    res.status(500).json({
    error:err
    })
   })
})



router.delete('/weekdayovertime/:id', (req, res) => {
    const weekdayovertimeId = req.params.id;
 
    Weekdayovertime.findByIdAndDelete(weekdayovertimeId, (err, deletedWeekdayovertime) => {
      if (err) {
        console.log('Error deleting weekdayovertime:', err);
        return res.status(500).send({ error: 'Could not delete weekdayovertime' });
      }
  
      if (!deletedWeekdayovertime) {
        return res.status(404).send({ error: 'weekdayovertime not found' });
      }
  
      res.send({ message: 'weekdayovertime deleted successfully', deletedWeekdayovertime });
    });
  });


  


router.put('/weekdayovertime/:id', async (req, res) => {
  const id = req.params.id;
  const {overtimedate, totalot, breaktime, selectedshift, compensation} = req.body;
  try {
    const weekdayovertime = await Weekdayovertime.findByIdAndUpdate(
      id,
      {overtimedate, totalot, breaktime, selectedshift, compensation },
      { new: true }
    );
    if (!weekdayovertime) {
      res.status(404).send('Weekdayovertime not found');
    } else {
      res.send(weekdayovertime);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating weekdayovertime');
  }
});

module.exports = router