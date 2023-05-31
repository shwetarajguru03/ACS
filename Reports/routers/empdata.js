const express = require('express')
const router = new express.Router()
const Empdata = require('/ACS_backend/Reports/models/empdata')
const { exitProcess } = require('yargs')


router.get('/empdata',(req,res)=>{
    Empdata.find()
    .then(result=>{
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})


router.get('/empdata/monthly', async (req, res) => {
  try {
    const today = new Date();
    const month = req.query.month ? parseInt(req.query.month) : today.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : today.getFullYear();
    const empid = req.query.empid ? req.query.empid : "";

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    let query = {
      date: {
        $gte: startDate,
        $lte: endDate
      }
    };

    if (empid) {
      query.empid = empid;
    }

    const data = await Empdata.find(query);

    const modifiedData = data.map(item => {
      const newItem = {...item._doc}; // create a new object
      const date = new Date(item.date);
      newItem.date = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`; // format the date as "YYYY-MM-DD"
      return newItem;
    });

    res.status(200).json(modifiedData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Server error'
    });
  }
});

//get empdata daily
router.get('/empdata/daily', async (req, res) => {
  try {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const query = {
      date: {
        $gte: startDate,
        $lte: endDate
      }
    };

    const data = await Empdata.find(query);

    const modifiedData = data.map(item => {
      const newItem = { ...item._doc }; // create a new object
      const date = new Date(item.date);
      newItem.date = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`; // format the date as "YYYY-MM-DD"
      return newItem;
    });

    res.status(200).json(modifiedData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Server error'
    });
  }
});



//get data by id
router.get('/empdata/:empid', (req, res) => {
  const empid = req.params.empid;
  Empdata.find({ empid: empid })
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



// router.delete('/empdata/:id', (req, res) => {
//     const empdataId = req.params.id;
 
//     Empdata.findByIdAndDelete(empdataId, (err, deletedEmpdata) => {
//       if (err) {
//         console.log('Error deleting empdata:', err);
//         return res.status(500).send({ error: 'Could not delete empdata' });
//       }
  
//       if (!deletedEmpdata) {
//         return res.status(404).send({ error: 'empdata not found' });
//       }
  
//       res.send({ message: 'empdata deleted successfully', deletedEmpdata});
//     });
//   });


//Download data api csv file format
router.get('/download', async (req, res) => {
  try {
    // Fetch the data from the database
    const empdata = await Empdata.find();

    // Convert the data to CSV format
    const fields = ['empid', 'name', 'date', 'intime', 'outtime', 'totaltime','selectedshift','totalot'];
    const csv = [fields.join(',')].concat(empdata.map(item => fields.map(field => item[field]).join(','))).join('\n');

    // Set the response headers
    res.setHeader('Content-disposition', 'attachment; filename=empdata.csv');
    res.set('Content-Type', 'text/csv');

    // Send the CSV data to the client
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});


module.exports = router