const express = require('express')
const router = new express.Router()
const MachineStatus = require('../models/machinestatus')
const { exitProcess } = require('yargs')
const { request } = require('express')


router.post('/machinestatus', (req, res) => {
  const { powerState } = req.body;
  let status, health;

  if (powerState === 'on') {
    status = 'on';
    health = 'good';
  } else {
    status = 'off';
    health = 'poor';
  }

  const machinestatus = new MachineStatus({
    machineid: req.body.machineid,
    machinename: req.body.machinename,
    machineip: req.body.machineip,
    machineport: req.body.machineport,
    location: req.body.location,
    floor: req.body.floor,
    doorno: req.body.doorno,
    configdate: req.body.configdate,
    id: req.body.id,
    status: status,
    health: health
  });

  machinestatus.save()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});


//multiple post by id
router.post('/request', (req, res) => {
  const ids = req.body.ids;
  MachineStatus.find({ _id: { $in: ids } })
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

router.get('/machinestatus',(req,res)=>{
    MachineStatus.find()
    .then(result=>{
     res.status(200).json(result)
}).catch(err=>{
    console.log(err)
    res.status(500).json({
    error:err
    })
   })
})


// router.delete('/machinestatus/:id', (req, res) => {
//     const machinestatusId = req.params.id;
 
//     MachineStatus.findByIdAndDelete(machinestatusId, (err, deletedMachineStatus) => {
//       if (err) {
//         console.log('Error deleting machinestatus:', err);
//         return res.status(500).send({ error: 'Could not delete machinestatus' });
//       }
  
//       if (!deletedMachineStatus) {
//         return res.status(404).send({ error: 'machinestatus not found' });
//       }
  
//       res.send({ message: 'machinestatus deleted successfully', deletedMachineStatus });
//     });
//   });

//multiple delete 
router.delete('/machinestatus', (req, res) => {
  const machineIds = req.body.machineIds;

  if (!machineIds || !Array.isArray(machineIds) || machineIds.length === 0) {
    return res.status(400).send({ error: 'Invalid resign IDs' });
  }

  let deletedMachines = [];

  for (let i = 0; i < machineIds.length; i++) {
    const machineId = machineIds[i];

    MachineStatus.findByIdAndDelete(machineId, (err, deletedMachine) => {
      if (err) {
        console.log('Error deleting request:', err);
        return res.status(500).send({ error: 'Could not delete request' });
      }
      if (!deletedMachine) {
        return res.status(404).send({ error: `Machine with ID ${machineId} not found` });
      }
      deletedMachines.push(deletedMachine);
      if (deletedMachines.length === machineIds.length) {
        res.send({ message: 'Request deleted successfully', deletedMachines });
      }
    });
  }
});




  router.put('/machinestatus/:id', async (req, res) => {
    const id = req.params.id;
    const { employeename, leavetype, from,to,reason } = req.body;
    try {
      const machinestatus = await MachineStatus.findByIdAndUpdate(
        id,
        { employeename, leavetype, from,to,reason },
        { new: true }
      );
      if (!machinestatus) {
        res.status(404).send('machinestatus not found');
      } else {
        res.send(machinestatus);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating machinestatus');
    }
  });
  

  

module.exports = router