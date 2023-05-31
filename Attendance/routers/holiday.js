const express = require('express')
const router = new express.Router()
const Holiday = require('../models/holiday')

// router.post('/holiday', async (req, res) => {
//   try {
//       const holiday = new Holiday({
//           srno: req.body.srno,
//           occasion: req.body.occasion,
//           day: req.body.day,
//           date: req.body.date
//       });

//       const result = await holiday.save();

//       // Emit notification event
//       const io = notification.getIO();
//       io.emit('notification', 'New holiday added');

//       res.status(200).json(result);
//   } catch (err) {
//       res.status(500).json({
//           error: err.message
//       });
//   }
// });

// router.get('/holiday', async (req, res) => {
//   try {
//     const holidays = await Holiday.find();
//     res.status(200).json(holidays);
//   } catch (err) {
//     res.status(500).json({
//       error: err.message
//     });
//   }
// });

// router.delete('/holiday/:id', async (req, res) => {
//   try {
//     const holidayId = req.params.id;
//     const deletedHoliday = await Holiday.findByIdAndDelete(holidayId);

//     if (!deletedHoliday) {
//       return res.status(404).send({ error: 'Holiday not found' });
//     }

//     // Emit notification event
//     const io = notification.getIO();
//     io.emit('notification', 'Holiday deleted');

//     res.send({ message: 'Holiday deleted successfully', deletedHoliday });
//   } catch (err) {
//     console.log('Error deleting holiday:', err);}
//     res.status(500).send({ message: 'holiday deleted successfully', deletedHoliday });
//         });

        
// // Update a holiday
// router.put('/holiday/:id', async (req, res) => {
//   const id = req.params.id;
//   const { srno, occasion, day, date } = req.body;

//   try {
//     const holiday = await Holiday.findByIdAndUpdate(
//       id,
//       { srno, occasion, day, date },
//       { new: true }
//     );

//     if (!holiday) {
//       res.status(404).send('Holiday not found');
//     } else {
//       // Emit update request event to all clients
//       const io = getIO();
//       io.emit('update request', holiday);

//       res.send(holiday);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error updating holiday');
//   }
// });


router.post('/holiday', async (req, res) => {
  try {
      const holiday = new Holiday({
          srno: req.body.srno,
          occasion: req.body.occasion,
          day: req.body.day,
          date: req.body.date
      });

      const result = await holiday.save();
      res.status(200).json(result);
  } catch (err) {
      res.status(500).json({
          error: err.message
      });
  }
});



router.get('/holiday',(req,res)=>{
    Holiday.find()
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



router.delete('/holiday/:id', (req, res) => {
    const holidayId = req.params.id;
 
    Holiday.findByIdAndDelete(holidayId, (err, deletedHoliday) => {
      if (err) {
        console.log('Error deleting holiday:', err);
        return res.status(500).send({ error: 'Could not delete holiday' });
      }
  
      if (!deletedHoliday) {
        return res.status(404).send({ error: 'holiday not found' });
      }
  
      res.send({ message: 'holiday deleted successfully', deletedHoliday });
    });
  });


router.put('/holiday/:id', async (req, res) => {
  const id = req.params.id;
  const {srno, occasion, day, date } = req.body;
  try {
    const holiday = await Holiday.findByIdAndUpdate(
      id,
      {srno, occasion, day, date },
      { new: true }
    );
    if (!holiday) {
      res.status(404).send('Holiday not found');
    } else {
      res.send(holiday);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating holiday');
  }
});

module.exports = router