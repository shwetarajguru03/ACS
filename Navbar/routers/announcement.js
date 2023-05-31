const express = require('express')
const router = new express.Router()
const Announcement = require('/ACS_backend/Navbar/models/announcement')
const User = require('/ACS_backend/Attendance/models/user')

router.post('/announcement', async (req, res) => {
  try {
      const announcement = new Announcement({
        announcement: req.body.announcement,
        
      });

      const result = await announcement.save();
      res.status(200).json(result);
  } catch (err) {
      res.status(500).json({
          error: err.message
      });
  }
});



// router.get('/announcement',(req,res)=>{
//     Announcement.find()
//     .then(result=>{
//      res.status(200).json(
//     result
//     )
// }).catch(err=>{
//     console.log(err)
//     res.status(500).json({
//     error:err
//     })
//    })
// })

// router.get('/announcements', async (req, res) => {
//   try {
//     const announcements = await Announcement.find().populate('User').exec();
//     const populatedAnnouncements = announcements.map((announcement) => {
//       return {
//         announcement: announcement.announcement,
//         userName:User.name,
//         department:User.department,
//       };
//     });
//     res.json(populatedAnnouncements);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });


router.delete('/announcement/:id', (req, res) => {
    const announcementId = req.params.id;
 
    Announcement.findByIdAndDelete(announcementId, (err, deletedAnnouncement) => {
      if (err) {
        console.log('Error deleting announcement:', err);
        return res.status(500).send({ error: 'Could not delete announcement' });
      }
  
      if (!deletedAnnouncement) {
        return res.status(404).send({ error: 'announcement not found' });
      }
  
      res.send({ message: 'announcement deleted successfully', deletedAnnouncement});
    });
  });


  


router.put('/announcement/:id', async (req, res) => {
  const id = req.params.id;
  const {announcement } = req.body;
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      id,
      {announcement },
      { new: true }
    );
    if (!announcement) {
      res.status(404).send('Announcement not found');
    } else {
      res.send(announcement);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating announcement');
  }
});

module.exports = router