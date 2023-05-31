const express = require('express')
const router = new express.Router()
const Login = require('../models/login')
const bcrypt = require('bcryptjs')
const { exitProcess } = require('yargs')
const jwt = require('jsonwebtoken')

//SignUp Code

router.post('/signup',(req,res)=>{
  bcrypt.hash(req.body.password,10,(err,hash)=>{
  if(err) {
  return res.status(500).json({
  error:err
  })
  } else { 
  const login = new Login({
  email:req.body.email,
  password:hash,
  firstname:req.body.firstname,
  lastname:req.body.lastname,
  mobile:req.body.mobile,
  department:req.body.department,
  joiningdate:req.body.joiningdate,
  status:req.body.status
      })  
  login.save()
  .then(result=>{
   res.status(200).json(result)
  }).catch(err=>{
     res.status(500).json({
      error:err
              })
          })
      }
  })
})

router.get('/signup',(req,res)=>{
    Login.find()
    .then(result=>{
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

//single delete
router.delete('/signup/:id', (req, res) => {
    const signupId = req.params.id;
 
Login.findByIdAndDelete(signupId, (err, deletedSignup) => {
      if (err) {
        console.log('Error deleting signup:', err);
        return res.status(500).send({ error: 'Could not delete signup' });
      }
  
      if (!deletedSignup) {
        return res.status(404).send({ error: 'Signup not found' });
      }
  
      res.send({ message: 'Signup deleted successfully', deletedSignup });
    });
  });


  
//multiple delete
  router.delete('/signup', (req, res) => {
    const signupIds = req.body.signupIds;

    if (!signupIds || !Array.isArray(signupIds) || signupIds.length === 0) {
      return res.status(400).send({ error: 'Invalid user IDs' });
    }
    
    let deletedSignups = [];
  
    for (let i = 0; i < signupIds.length; i++) {
      const signupId = signupIds[i];
  
      Login.findByIdAndDelete(signupId, (err, deletedSignup) => {
        if (err) {
          console.log('Error deleting user:', err);
          return res.status(500).send({ error: 'Could not delete user' });
        }
  
        if (!deletedSignup) {
          return res.status(404).send({ error: `User with ID ${signupId} not found` });
        }
  
        deletedSignups.push(deletedSignup);
  
        if (deletedSignups.length === signupIds.length) {
          // All users have been deleted
          res.send({ message: 'Users deleted successfully', deletedSignups });
        }
      });
    }
  });
  

// update signup 
  router.put('/signup/:id', async (req, res) => {
    const id = req.params.id;
    
    const { firstname, lastname, mobile ,address,department,joiningdate, status } = req.body;
    
    try {
      let updatedSignup = null;
      if (status && status === 'approved') {
        // Update status to 'approved'
        updatedSignup = await Login.findByIdAndUpdate(
          id,
          { $set: { status: 'approved', firstname, lastname, mobile ,address,department,joiningdate } },
          { new: true }
        );
      } else {
        // Update signup fields
        updatedSignup = await Login.findByIdAndUpdate(
          id,
          { firstname, lastname, mobile ,address,department,joiningdate },
          { new: true }
        );
      }
      
      if (!updatedSignup) {
        res.status(404).send('Signup not found');
      } else {
        res.send(updatedSignup);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating signup');
    }
});

  



//Login Code
router.post('/login',(req,res)=>{
    Login.find({email:req.body.email})
    .exec()
    .then(login=>{
        if(login.length<1){
            return res.status(401).json({
                msg:'user not exist'
            })
        }
        bcrypt.compare(req.body.password,login[0].password,(err,result)=>{
            if(!result){
                return res.status(401).json({
                    msg:'Wrong PASSWORD'
                })
            }
            if(result){
            const token =jwt.sign({
                email:login[0].email
            },'Thisisdummytext',{expiresIn:"7 days"})
            res.status(200).json({
                email:login[0].email,
                token:token
            })
            }
        })
    }).catch(err=>{
        res.status(500).json({
            err:err
        })
    })
})



router.get('/login',(req,res)=>{
    Login.find()
    .then(result=>{
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

router.delete('/login',(req,res)=>{
    Login.deleteOne({_id:'63c7c5834d5964c577c78303'})
    .then(()=>{
        res.status(200).json()
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

router.put('/login/:id', async (req, res) => {
    const id = req.params.id;
    
   const { firstname, lastname, mobile ,address,department,joiningdate } = req.body;
    try {
      const login = await Login.findByIdAndUpdate(
        id,
        { firstname, lastname, mobile ,address,department,joiningdate },
        { new: true }
      );
      if (!login) {
        res.status(404).send('Login not found');
      } else {
        res.send(login);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating login');
    }
  });


  
// Log Out api only logout not delete user
router.post('/logout', (req, res) => {
  // Clear the cookie containing the JWT token
  res.clearCookie('token');
  res.status(200).json({
    message: 'Logged out successfully'
  });
});

  

// Forgot password API
// router.post('/forgot-password', (req, res) => {
//   const email = req.body.email;
//   Login.findOne({ email: email })
//     .then((user) => {
//       if (!user) {
//         return res.status(404).json({ msg: 'User not found' });
//       }

//       // Generate a random password reset token
//       const resetToken = crypto.randomBytes(20).toString('hex');

//       // Store the token in the user's document in the database
//       user.resetPasswordToken = resetToken;
//       user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
//       user.save()
//         .then(() => {
//           // Send the password reset email to the user
//           // ...
//           // Return a success message to the user
//           res.status(200).json({ msg: 'A password reset email has been sent to your email address' });
//         })
//         .catch((err) => {
//           res.status(500).json({ msg: err.message });
//         });
//     })
//     .catch((err) => {
//       res.status(500).json({ msg: err.message });
//     });
// });

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by id
    const user = await Login.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update the user's password
    user.password = hashedPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router