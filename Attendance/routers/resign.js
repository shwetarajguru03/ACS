const express = require('express')
const router = new express.Router()
const { exitProcess } = require('yargs')
const { request } = require('express')
const Resign = require('../models/resign')


router.post('/resign',(req,res)=>{
   
    const resign = new Resign({
    firstname:req.body.firstname,
    middlename:req.body.middlename,
    lastname:req.body.lastname,
    email:req.body.email,
    num:req.body.num,
    date3:req.body.date3,
    lastpost:req.body.lastpost,
    comments:req.body.comments,
    date4:req.body.date4,
    id:req.body.id,
    status:req.body.status
        })  
    resign.save()
    .then(result=>{
     res.status(200).json(
        result
     )
    }).catch(err=>{
       res.status(500).json({
        error:err
        })
     })
})


//multiple post by id
router.post('/request', (req, res) => {
  const ids = req.body.ids;
  Resign.find({ _id: { $in: ids } })
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

router.get('/resign',(req,res)=>{
    Resign.find()
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


router.delete('/resign/:id', (req, res) => {
    const resignId = req.params.id;
 
    User.findByIdAndDelete(resignId, (err, deletedResign) => {
      if (err) {
        console.log('Error deleting resign:', err);
        return res.status(500).send({ error: 'Could not delete resign' });
      }
  
      if (!deletedResign) {
        return res.status(404).send({ error: 'resign not found' });
      }
  
      res.send({ message: 'resign deleted successfully', deletedResign });
    });
  });


//multiple delete 
router.delete('/resign', (req, res) => {
  const resignIds = req.body.resignIds;

  if (!resignIds || !Array.isArray(resignIds) || resignIds.length === 0) {
    return res.status(400).send({ error: 'Invalid resign IDs' });
  }

  let deletedResigns = [];

  for (let i = 0; i < resignIds.length; i++) {
    const resignId = resignIds[i];

    Resign.findByIdAndDelete(resignId, (err, deletedResign) => {
      if (err) {
        console.log('Error deleting request:', err);
        return res.status(500).send({ error: 'Could not delete request' });
      }

      if (!deletedResign) {
        return res.status(404).send({ error: `User with ID ${resignId} not found` });
      }

      deletedResigns.push(deletedResign);

      if (deletedResigns.length === resignIds.length) {
       
        res.send({ message: 'Request deleted successfully', deletedResigns });
      }
    });
  }
});



  // router.put('/resign/:id', async (req, res) => {
  //   const id = req.params.id;
  //   const { occasion, middlename, lastname,email,num ,date3,lastpost,comments,date4} = req.body;
  //   try {
  //     const resign = await Resign.findByIdAndUpdate(
  //       id,
  //       {occasion, middlename, lastname,email,num ,date3,lastpost,comments,date4},
  //       { new: true }
  //     );
  //     if (!resign) {
  //       res.status(404).send('Resign not found');
  //     } else {
  //       res.send(resign);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send('Error updating resign');
  //   }
  // });


  router.put('/resign/:id', async (req, res) => {
    const id = req.params.id;
    const { occasion, middlename, lastname,email,num ,date3,lastpost,comments,date4, status } = req.body;
    try {
      let updatedResign = null;
      if (status && status === 'approved') {
        // Update status to 'approved'
        updatedResign = await Resign.findByIdAndUpdate(
          id,
          { $set: { status: 'approved', occasion, middlename, lastname,email,num ,date3,lastpost,comments,date4 } },
          { new: true }
        );
      } else {
        // Update resignation request fields
        updatedResign = await Resign.findByIdAndUpdate(
          id,
          { occasion, middlename, lastname,email,num ,date3,lastpost,comments,date4 },
          { new: true }
        );
      }
      if (!updatedResign) {
        res.status(404).send('Resign not found');
      } else {
        res.send(updatedResign);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating resign');
    }
  });


module.exports = router