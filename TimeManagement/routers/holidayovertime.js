const express = require('express')
const router = new express.Router()
const Holidayovertime = require('../models/holidayovertime')
const User = require('/ACS_backend/Attendance/models/user')
const moment = require('moment');


//***************************/
  
router.post('/holidayovertime', function (req, res) {
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

    // Calculate totalot for each user
    const holidayovertime = users.map(user => {
      // Calculate time duration between checkin and checkout
      const checkin = moment(req.body.checkin, 'HH:mm');
      const checkout = moment(req.body.checkout, 'HH:mm');
      const timeDiff = moment.duration(checkout.diff(checkin));

      // Subtract breaktime1 from the total time duration
    const breaktime1 = moment.duration(req.body.breaktime1, 'HH:mm');
    const totalot = moment.duration(timeDiff).subtract(breaktime1);
    const formattedTotalot = moment.utc(totalot.asMilliseconds()).format('HH:mm');

      return new Holidayovertime({
        name: user.name,
        empid: user.empid,
        department: user.department,
        requestdate: req.body.requestdate,
        checkin: req.body.checkin,
        checkout: req.body.checkout,
        totalot:formattedTotalot, 
        breaktime1: req.body.breaktime1,
        compensation1: req.body.compensation1

      });
    });

    // Save the new Schedule documents to the database
    Holidayovertime.insertMany(holidayovertime, function (err, holidayovertime) {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.status(201).json(holidayovertime);
    });
  });
});


 /*******************************/
router.get('/holidayovertime',(req,res)=>{
    Holidayovertime.find()
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



router.delete('/holidayovertime/:id', (req, res) => {
    const holidayovertimeId = req.params.id;
 
    Holidayovertime.findByIdAndDelete(holidayovertimeId, (err, deletedHolidayovertime) => {
      if (err) {
        console.log('Error deleting holidayovertime:', err);
        return res.status(500).send({ error: 'Could not delete holidayovertime' });
      }
  
      if (!deletedHolidayovertime) {
        return res.status(404).send({ error: 'holidayovertime not found' });
      }
  
      res.send({ message: 'holidayovertime deleted successfully', deletedHolidayovertime });
    });
  });


  
router.put('/holidayovertime/:id', async (req, res) => {
  const id = req.params.id;
  const {requestdate, checkin, checkout, breaktime1, compensation1} = req.body;
  try {
    const holidayovertime = await Holidayovertime.findByIdAndUpdate(
      id,
      {requestdate, checkin, checkout, breaktime1, compensation1 },
      { new: true }
    );
    if (!holidayovertime) {
      res.status(404).send('holidayovertime not found');
    } else {
      res.send(holidayovertime);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating holidayovertime');
  }
});

module.exports = router