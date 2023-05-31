const express = require('express')
const router = new express.Router()
const Userhistory = require('../models/userhistory')

router.get('/userhistory',(req,res)=>{
    Userhistory.find()
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


module.exports = router