const express = require('express')
const router = express.Router()
const Joi = require('joi')
Database = require('arangojs')
const db = new Database({url:process.env.ARANGO_HOST})
db.useBasicAuth('root', process.env.ARANGO_ROOT_PASSWORD) 
db.useDatabase(process.env.ARANGO_DATABASE)
const graph = db.graph('streamUs');
const objectValidate = Joi.object().keys({
    userId : Joi.string().required(),
    roomName : Joi.string().required(),
    permissions : Joi.string().required()
})

router.post('/', async (req, res) => {
    Joi.validate(req.body, objectValidate, (err, value) => {
        if(err) {
            res.status(400).json(err.name)
            throw err
        }
    })
    const {userId, roomName, permissions} = req.body
    const user = await db.collection("User").document(userId)
    if(user){
        const saveRoom = await graph.vertexCollection("Room").save({name : roomName, permissions})
        await graph.edgeCollection("users_room").save({
            type : "owner"
        },
        user._id, saveRoom._id)
        res.status(200).send(saveRoom)
    }        
    res.status(404)    
        
})
module.exports = router

