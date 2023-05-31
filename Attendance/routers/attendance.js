const express = require('express')
const router = new express.Router()
const Attendance = require('../models/attendance')


router.get('/attendance',(req,res)=>{
    Attendance.find()
    .then(result=>{
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

//get data by id
// router.get('/attendance/:empid', async (req, res) => {
//     const empid = req.params.empid;
//     try {
//       const attendanceData = await Attendance.find({ empid:empid });
//       res.json(attendanceData);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Server Error');
//     }
//   });
  
router.get('/attendance/:empid', (req, res) => {
  const empid = req.params.empid;
  Attendance.find({ empid: empid })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}); 
module.exports = router