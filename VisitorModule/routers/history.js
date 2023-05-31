const express = require('express')
const router = new express.Router()
const History = require('../models/history')

router.get('/history',(req,res)=>{
    History.find()
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