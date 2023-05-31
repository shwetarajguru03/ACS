const express = require('express')
const router = new express.Router()
const Payrollreport = require('../models/payrollreport')



router.get('/payrollreport',(req,res)=>{
    Payrollreport.find()
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