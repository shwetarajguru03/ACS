const express = require('express')
const router = new express.Router()
const Leaves = require('../models/leaves')
const { exitProcess } = require('yargs')
const { request } = require('express')


router.post('/leaves',(req,res)=>{
   
    const leaves = new Leaves({
        employeename:req.body.employeename,
        leavetype:req.body.leavetype,
        from:req.body.from,
        to:req.body.to,
        reason:req.body.reason,
        id:req.body.id,
        status:req.body.status
        })  
    leaves.save()
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
  Leaves.find({ _id: { $in: ids } })
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

router.get('/leaves',(req,res)=>{
    Leaves.find()
    .then(result=>{
     res.status(200).json(result)
}).catch(err=>{
    console.log(err)
    res.status(500).json({
    error:err
    })
   })
})


router.delete('/leaves/:id', (req, res) => {
    const leavesId = req.params.id;
 
    User.findByIdAndDelete(leavesId, (err, deletedLeaves) => {
      if (err) {
        console.log('Error deleting leaves:', err);
        return res.status(500).send({ error: 'Could not delete leaves' });
      }
  
      if (!deletedLeaves) {
        return res.status(404).send({ error: 'leaves not found' });
      }
  
      res.send({ message: 'leaves deleted successfully', deletedLeaves });
    });
  });

//multiple delete 
router.delete('/leaves', (req, res) => {
  const leavesIds = req.body.leavesIds;

  if (!leavesIds || !Array.isArray(leavesIds) || leavesIds.length === 0) {
    return res.status(400).send({ error: 'Invalid resign IDs' });
  }

  let deletedLeaves = [];

  for (let i = 0; i < leavesIds.length; i++) {
    const leavesId = leavesIds[i];

    Leaves.findByIdAndDelete(leavesId, (err, deletedLeave) => {
      if (err) {
        console.log('Error deleting request:', err);
        return res.status(500).send({ error: 'Could not delete request' });
      }

      if (!deletedLeave) {
        return res.status(404).send({ error: `User with ID ${leavesId} not found` });
      }

      deletedLeaves.push(deletedLeave);

      if (deletedLeaves.length === leavesIds.length) {
       
        res.send({ message: 'Request deleted successfully', deletedLeaves });
      }
    });
  }
});




  // router.put('/leaves/:id', async (req, res) => {
  //   const id = req.params.id;
  //   const { employeename, leavetype, from,to,reason } = req.body;
  //   try {
  //     const leaves = await Leaves.findByIdAndUpdate(
  //       id,
  //       { employeename, leavetype, from,to,reason },
  //       { new: true }
  //     );
  //     if (!leaves) {
  //       res.status(404).send('Leaves not found');
  //     } else {
  //       res.send(leaves);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send('Error updating leaves');
  //   }
  // });
  

  router.put('/leaves/:id', async (req, res) => {
    const id = req.params.id;
    const { employeename, leavetype, from,to,reason, status } = req.body;
    try {
      let updatedLeaves = null;
      if (status && status === 'approved') {
        // Update status to 'approved'
        updatedLeaves = await Leaves.findByIdAndUpdate(
          id,
          { $set: { status: 'approved', employeename, leavetype, from,to,reason } },
          { new: true }
        );
      } else {
        // Update leave request fields
        updatedLeaves = await Leaves.findByIdAndUpdate(
          id,
          { employeename, leavetype, from,to,reason },
          { new: true }
        );
      }
      if (!updatedLeaves) {
        res.status(404).send('Leaves not found');
      } else {
        res.send(updatedLeaves);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating leaves');
    }
  });

module.exports = router