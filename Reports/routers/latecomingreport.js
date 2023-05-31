const express = require('express')
const router = new express.Router()
const Latecomingreport = require('../models/latecomingreport')
const { exitProcess } = require('yargs')


router.get('/latecomingreport',(req,res)=>{
    Latecomingreport.find()
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