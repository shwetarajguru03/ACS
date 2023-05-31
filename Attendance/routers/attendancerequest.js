const express = require('express')
const router = new express.Router()
const Attendancerequest = require('../models/attendancerequest')
const { exitProcess } = require('yargs')
const { request } = require('express')


router.post('/request',(req,res)=>{
    const attendancerequest = new Attendancerequest({
        id:req.body.id,
        name:req.body.name,
        email:req.body.email,
        date3:req.body.date3,
        query:req.body.query,
        reason:req.body.reason 
        })  
        attendancerequest.save()
    .then(result=>{
     res.status(200).json(result)
    }).catch(err=>{
       res.status(500).json({
        error:err
        })
     })
    })

//multiple post by id
router.post('/request', (req, res) => {
  const ids = req.body.ids;
  Attendancerequest.find({ _id: { $in: ids } })
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



// router.get('/request',(req,res)=>{
//     Attendancerequest.find()
//     .then(result=>{
//      res.status(200).json(result)
// }).catch(err=>{
//     console.log(err)
//     res.status(500).json({
//     error:err
//     })
//    })
// })



router.delete('/request/:id', (req, res) => {
    const requestId = req.params.id;
 
    Attendancerequest.findByIdAndDelete(requestId, (err, deletedrequest) => {
      if (err) {
        console.log('Error deleting request:', err);
        return res.status(500).send({ error: 'Could not delete request' });
      }
  
      if (!deletedrequest) {
        return res.status(404).send({ error: 'Request not found' });
      }
  
      res.send({ message: 'Request deleted successfully', deletedrequest });
    });
  });

  
//multiple delete 
  router.delete('/request', (req, res) => {
    const requestIds = req.body.requestIds;
  
    if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
      return res.status(400).send({ error: 'Invalid request IDs' });
    }
  
    let deletedRequests = [];
  
    for (let i = 0; i < requestIds.length; i++) {
      const requestId = requestIds[i];
  
      Attendancerequest.findByIdAndDelete(requestId, (err, deletedRequest) => {
        if (err) {
          console.log('Error deleting request:', err);
          return res.status(500).send({ error: 'Could not delete request' });
        }
  
        if (!deletedRequest) {
          return res.status(404).send({ error: `User with ID ${requestId} not found` });
        }
  
        deletedRequests.push(deletedRequest);
  
        if (deletedRequests.length === requestIds.length) {
         
          res.send({ message: 'Request deleted successfully', deletedRequests });
        }
      });
    }
  });
  


  // router.put('/request/:id', async (req, res) => {
  //   const id = req.params.id;
  //   const {  name, date3, email,query,reason } = req.body;
  //   try {
  //     const attendancerequest = await Attendancerequest.findByIdAndUpdate(
  //       id,
  //       {   name, date3, email,query,reason },
  //       { new: true }
  //     );
  //     if (! attendancerequest) {
  //       res.status(404).send(' Attendancerequest not found');
  //     } else {
  //       res.send( attendancerequest);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send('Error updating  attendancerequest');
  //   }
  // });



  router.post('/request', async (req, res) => {
    try {
      const { name, email, date3, query, reason } = req.body;
      const attendancerequest = new Attendancerequest({
        name,
        email,
        date3,
        query,
        reason,
        status: 'pending',
        comment
      });
      const savedAttendancerequest = await attendancerequest.save();
      res.json(savedAttendancerequest);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating Attendancerequest');
    }
  });

  router.get('/request', async (req, res) => {
    try {
      const attendancerequests = await Attendancerequest.find();
      res.json(attendancerequests);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving Attendancerequests');
    }
  });
  

  // router.put('/request/:id/approve', async (req, res) => {
  //   try {
  //     const updatedRequest = await Attendancerequest.findByIdAndUpdate(
  //       req.params.id,
  //       { $set: { status: 'approved' } },
  //       { new: true }
  //     );
  //     res.json(updatedRequest);
  //   } catch (err) {
  //     res.status(500).json({ message: err.message });
  //   }
  // });
  

  router.put('/request/:id', async (req, res) => {
    const id = req.params.id;
    const { name, date3, email, query, reason, status } = req.body;
    try {
      let updatedRequest = null;
      if (status && status === 'approved') {
        // Update status to 'approved'
        updatedRequest = await Attendancerequest.findByIdAndUpdate(
          id,
          { $set: { status: 'approved' } },
          { new: true }
        );
      } else {
        // Update attendance request fields
        const attendancerequest = new Attendancerequest({
            name,
            email,
            date3,
            query,
            reason,
        });
        updatedRequest = await attendancerequest.save();
      }
      if (!updatedRequest) {
        res.status(404).send('Attendancerequest not found');
      } else {
        res.send(updatedRequest);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating Attendancerequest');
    }
  });

  
module.exports = router