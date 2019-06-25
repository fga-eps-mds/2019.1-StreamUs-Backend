const express = require('express');
const Joi = require('joi');
const Database = require('arangojs');

const router = express.Router();
const db = new Database({ url: process.env.ARANGO_HOST });

db.useBasicAuth('root', process.env.ARANGO_ROOT_PASSWORD);
db.useDatabase(process.env.ARANGO_DATABASE);
const graph = db.graph('streamUs');

const objectValidate = Joi.object().keys({
  userId: Joi.string().required(),
  roomName: Joi.string().required(),
  permissions: Joi.string().required(),
});

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
router.post('/', async (req, res) => {
  Joi.validate(req.body, objectValidate, (err) => {
    if (err) {
      res.status(400).json(err.name);
      throw err;
    }
  });

  const { userId, roomName, permissions } = req.body;
  const user = await db.collection('User').document(userId);
  if (user) {
    const saveRoom = await graph.vertexCollection('Room').save({ name: roomName, permissions });
    await graph.edgeCollection('users_room').save({ type: 'owner' }, user._id, saveRoom._id);
    res.status(200).send(saveRoom);
  }
  res.status(404);
});

router.post('/adduser/:userKey/:roomKey/:newUserKey', async (req, res) => {
  const { userKey, roomKey, newUserKey } = req.params;
  const user = await db.collection('User').document(userKey);
  const newUser = await db.collection('User').document(newUserKey);
  const room = await db.collection('Room').document(roomKey);
  if (user && newUser && room) {
      const userOwner = await db.collection('users_room').document(user._id, room._id);
      if(userOwner.type == 'owner'){
          await graph.edgeCollection('users_room').save({ type: 'default' }, newUser._id, room._id);
          res.status(200)
      }
  }
  res.status(404);
});

router.delete('/delete/:user_key/:room_key', async (req, res) => {
  const { roomKey, userKey } = req.params;
  const { _id: userId } = await graph.vertexCollection('User').document(userKey);
  const { _id: roomId } = await graph.vertexCollection('Room').document(roomKey);
  if (userId && roomId) {
    const deleteRoom = await graph.vertexCollection('Room').remove(roomId);
    res.status(200).json({ Removed: deleteRoom });
  }
  res.status(404).json({ ERR: 'Error' });
});

module.exports = router;
