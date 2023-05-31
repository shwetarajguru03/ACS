const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const fs = require('fs')

  const multer = require('multer');
  const upload = multer({ dest: 'C:/ACS_backend/Attendance/Images' });
  
  
  router.post('/user', upload.single('file'), async (req, res) => {
    try {
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }
  
      // Get the original filename
      const originalFilename = req.file.originalname;
  
      // Generate the new filename as orderno.pdf
      const newFilename = req.body.empid + '.jpg';
  
      // Create the 'orderfiles' folder if it doesn't exist
      const folderPath = 'C:/ACS_backend/Attendance/Images';
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
  
      // Move the file to the desired folder with the new filename
      const newPath = `${folderPath}/${newFilename}`;
      fs.renameSync(req.file.path, newPath);
  
      // Create a new file document
      const user = new User({
            name: req.body.name,
            empid: req.body.empid,
            email: req.body.email,
            mobile: req.body.mobile,
            birthdate: req.body.birthdate,
            maritalstatus: req.body.maritalstatus,
            bloodgroup: req.body.bloodgroup,
            gender: req.body.gender,
            address: req.body.address,
            administrator: req.body.administrator,
            jobno: req.body.jobno,
            designation:req.body.designation,
            department: req.body.department,
            joiningdate: req.body.joiningdate,
            file:newFilename
          }); 
          const result = await user.save();
          res.status(200).json(result);
      } catch (err) {
          res.status(500).json({
              error: err.message
          });
      }
    });


//get api
router.get('/user',(req,res)=>{
    User.find()
    .then(result=>{
     res.status(200).json(result)
    
}).catch(err=>{
    console.log(err)
    res.status(500).json({
    error:err
    })
   })
})

//delete api
router.delete('/user/:id', (req, res) => {
    const userId = req.params.id;
 
    User.findByIdAndDelete(userId, (err, deletedUser) => {
      if (err) {
        console.log('Error deleting user:', err);
        return res.status(500).send({ error: 'Could not delete user' });
      }
  
      if (!deletedUser) {
        return res.status(404).send({ error: 'User not found' });
      }
  
      res.send({ message: 'User deleted successfully', deletedUser });
    });
  });


 // Route to delete multiple users by their ids
 router.delete('/user', (req, res) => {
  const userIds = req.body.userIds;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).send({ error: 'Invalid user IDs' });
  }

  let deletedUsers = [];

  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i];

    User.findByIdAndDelete(userId, (err, deletedUser) => {
      if (err) {
        console.log('Error deleting user:', err);
        return res.status(500).send({ error: 'Could not delete user' });
      }

      if (!deletedUser) {
        return res.status(404).send({ error: `User with ID ${userId} not found` });
      }

      deletedUsers.push(deletedUser);

      if (deletedUsers.length === userIds.length) {
        // All users have been deleted
        res.send({ message: 'Users deleted successfully', deletedUsers });
      }
    });
  }
});



//update api
router.put('/user/:id', async (req, res) => {
  const id = req.params.id;
  const {  name, empid, email,mobile,birthdate,maritalstatus,bloodgroup,gender,address,administrator,jobno,designation,department,joiningdate,file } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {  name, empid, email,mobile,birthdate,maritalstatus,bloodgroup,gender,address,administrator,jobno,designation,department,joiningdate,file },
      { new: true }
    );
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.send(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating user');
  }
});

//download api 
router.get('/user/download', async (req, res) => {
  try {
    // Fetch the data from the database
    const users = await User.find();

    // Convert the data to CSV format
    const fields = ['name', 'empid', 'email', 'mobile', 'birthdate', 'maritalstatus', 'bloodgroup', 'gender', 'address', 'administrator', 'jobno','designation', 'department', 'joiningdate'];
    const csv = [fields.join(',')].concat(users.map(item => fields.map(field => item[field]).join(','))).join('\n');

    // Set the response headers
    res.setHeader('Content-disposition', 'attachment; filename=users.csv');
    res.set('Content-Type', 'text/csv');

    // Send the CSV data to the client
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});


module.exports = router