const express = require('express')
const router = new express.Router()
const Visitors = require('../models/visitors');
const History = require('../models/history')
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'C:/ACS_backend/VisitorModule/Visitorimages/')
  },
  filename: function(req, file, cb) {
    cb(null, req.body.vid + '.jpg')
  }
});

const upload = multer({ storage: storage });

router.post('/visitors', upload.single('file'), (req, res) => {
      const visitors = new Visitors({
        vname:req.body.vname ,
        vid:req.body.vid ,
        govtid:req.body.govtid ,
        emailError:req.body.emailError ,
        mobile:req.body.mobile ,
        birthdate:req.body.birthdate ,
        gender:req.body.gender,
        address:req.body.address,
        company:req.body.company,
        designation:req.body.designation,
        department:req.body.department,
        purpose:req.body.purpose,
        cardno:req.body.cardno,
        file:req.body.vid + '.jpg',
        checkindate:req.body.checkindate,
        checkintime:req.body.checkintime,
        checkouttime:req.body.checkouttime,
        gatepass:req.body.gatepass,
        items:req.body.items,
      });
      visitors.save()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Error saving visitor' });
      });
  });



router.get('/visitors',(req,res)=>{
    Visitors.find()
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


// single delete
// router.delete('/visitors/:id', (req, res) => {
//     const visitorsId = req.params.id;
 
//     Visitors.findByIdAndDelete(visitorsId, (err, deletedvisitor) => {
//       if (err) {
//         console.log('Error deleting visitor:', err);
//         return res.status(500).send({ error: 'Could not delete visitor' });
//       }
  
//       if (!deletedvisitor) {
//         return res.status(404).send({ error: 'visitor not found' });
//       }
  
//       res.send({ message: 'visitor deleted successfully', deletedvisitor });
//     });
//   });

// multiple delete 
// router.delete('/visitors', (req, res) => {
//   const visitorIds = req.body.visitorIds;

//   if (!visitorIds || !Array.isArray(visitorIds) || visitorIds.length === 0) {
//     return res.status(400).send({ error: 'Invalid user IDs' });
//   }

//   let deletedVisitors = [];

//   for (let i = 0; i < visitorIds.length; i++) {
//     const visitorId = visitorIds[i];

//     Visitors.findByIdAndDelete(visitorId, (err, deletedVisitor) => {
//       if (err) {
//         console.log('Error deleting user:', err);
//         return res.status(500).send({ error: 'Could not delete visitor' });
//       }

//       if (!deletedVisitor) {
//         return res.status(404).send({ error: `Visitors with ID ${visitorId} not found` });
//       }

//       deletedVisitors.push(deletedVisitor);

//       if (deletedVisitors.length === visitorIds.length) {
//         // All users have been deleted
//         res.send({ message: 'Visitors deleted successfully', deletedVisitors });
//       }
//     });
//   }
// });


// delete single visitor and move image , save to history
router.delete('/visitors/:vid', (req, res) => {
  const vid = req.params.vid;
  Visitors.findOneAndDelete({ vid })
    .then(result => {
      // Delete the image file
      const imagePath = `C:/ACS_backend/VisitorModule/Visitorimages/${vid}.jpg`;
      const imageHistoryPath = `C:/ACS_backend/VisitorModule/imagehistory/${vid}.jpg`;

      fs.rename(imagePath, imageHistoryPath, (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error moving image file to history' });
        } else {
          // Create a new instance of the History model
          const deletedVisitor = new History({
          vname:result.vname,
          vid: result.vid,
          govtid: result.govtid,
          emailError: result.emailError,
          mobile: result.mobile,
          birthdate: result.birthdate,
          gender:result.gender,
          address:result.address,
          company:result.company,
          designation:result.designation,
          department:result.department,
          purpose:result.purpose,
          cardno:result.cardno,
          file:result.file,
          checkindate:result.checkindate,
          checkintime:result.checkintime,
          checkouttime:result.checkouttime,
          gatepass:result.gatepass,
          items:result.items
            // Add other fields as needed
          });

          // Save the deleted visitor to the history collection
          History.create(deletedVisitor)
            .then(() => {
              res.status(200).json(result);
            })
            .catch(err => {
              console.error(err);
              res.status(500).json({ error: 'Error saving visitor to history collection' });
            });
        }
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error deleting visitor' });
    });
});

// delete multiple visitors and move image , save to history
router.delete('/visitors', (req, res) => {
  const visitorIds = req.body.visitorIds; // Assuming the visitorIds are sent in the request body as an array

  Visitors.find({ vid: { $in: visitorIds } })
    .then(results => {
      const deletePromises = results.map(result => {
        return new Promise((resolve, reject) => {
          const vid = result.vid;

          // Delete the image file
          const imagePath = `C:/ACS_backend/VisitorModule/Visitorimages/${vid}.jpg`;
          const imageHistoryPath = `C:/ACS_backend/VisitorModule/imagehistory/${vid}.jpg`;

          fs.rename(imagePath, imageHistoryPath, (err) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              // Create a new instance of the History model
              const deletedVisitor = new History(result);

              // Save the deleted visitor to the history collection
              deletedVisitor.save()
                .then(() => {
                  resolve();
                })
                .catch(err => {
                  console.error(err);
                  reject(err);
                });
            }
          });
        });
      });

      Promise.all(deletePromises)
        .then(() => {
          Visitors.deleteMany({ vid: { $in: visitorIds } })
            .then(() => {
              res.status(200).json({ message: 'Visitors deleted and saved to history successfully' });
            })
            .catch(err => {
              console.error(err);
              res.status(500).json({ error: 'Error deleting visitors' });
            });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Error moving image files or saving visitors to history' });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error finding visitors' });
    });
});

//update visitor
router.put('/visitor/:id', async (req, res) => {
  const id = req.params.id;
  const {vname ,vid ,govtid ,emailError ,mobile,birthdate ,gender,address,company,designation,department,purpose,cardno,file,checkindate,checkintime,checkouttime,gatepass,items} = req.body;
  try {
    const visitor = await Visitors.findByIdAndUpdate(
      id,
      {vname ,vid ,govtid ,emailError ,mobile,birthdate ,gender,address,company,designation,department,purpose,cardno,file,checkindate,checkintime,checkouttime,gatepass,items},
      { new: true }
    );
    if (!visitor) {
      res.status(404).send('Visitor not found');
    } else {
      res.send(visitor);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating visitor');
  }
});

//download api 
router.get('/visitor/download', async (req, res) => {
  try {
    // Fetch the data from the database
    const visitors = await Visitors.find();

    // Convert the data to CSV format
    const fields = ['vname', 'vid', 'govtid', 'emailError','mobile','gender','address','company','designation','department','purpose','status','cardno','file','checkindate','checkintime','checkouttime','gatepass' ];
    const csv = [fields.join(',')].concat(visitors.map(item => fields.map(field => item[field]).join(','))).join('\n');

    // Set the response headers
    res.setHeader('Content-disposition', 'attachment; filename=visitors.csv');
    res.set('Content-Type', 'text/csv');

    // Send the CSV data to the client
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router