const express = require('express')
const router = express.Router()

const { addRoom } = require('../database/dbServices')

router.post('/', async (req, res) => {
    try{
        const sala = await addRoom(req.body)
        res.json({nome_sala : req.body.sala})
    }catch(e){
        res.json(e.message)
    }
})

module.exports = router