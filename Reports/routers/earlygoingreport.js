const express = require('express')
const router = new express.Router()
const Earlygoingreport = require('../models/earlygoingreport')
const { exitProcess } = require('yargs')


router.get('/earlygoingreport',(req,res)=>{
    Earlygoingreport.find()
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