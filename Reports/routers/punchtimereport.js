const express = require('express')
const router = new express.Router()
const Punchtimereport = require('../models/punchtimereport')
const { exitProcess } = require('yargs')


router.get('/punchtimereport',(req,res)=>{
    Punchtimereport.find()
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