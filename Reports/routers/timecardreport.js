const express = require('express')
const router = new express.Router()
const Timecardreport = require('../models/timecardreport')



router.get('/timecardreport',(req,res)=>{
    Timecardreport.find()
    .then(result=>{
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

module.exports = router