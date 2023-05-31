const express = require('express')
const router = new express.Router()
const UnknownPerson = require('../models/unknownperson')


router.get('/unknownperson',(req,res)=>{
    UnknownPerson.find()
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