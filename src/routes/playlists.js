const express = require('express');
const Database = require('arangojs');

const router = express.Router();
const Joi = require('joi');
const SpotifyWebApi = require('spotify-web-api-node');

const db = new Database({ url: process.env.ARANGO_HOST });
db.useBasicAuth('root', process.env.ARANGO_ROOT_PASSWORD);
db.useDatabase(process.env.ARANGO_DATABASE);
const graph = db.graph('streamUs');
const objectRequestPost = Joi.object().keys({
  userId: Joi.string()
    .regex(/User\/[0-9a-z]+$/)
    .required(),
  name: Joi.string().required(),
  description: Joi.string(),
});

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',
  redirectUri: `${process.env.HOST_API || ''}/playlists/callback`,
});

const accessToken = process.env.ACCESS_TOKEN || '';
spotifyApi.setAccessToken(accessToken);

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
// Retorna um JSON com as playlists colaborativas do usuário
router.get('/user/:userKey/playlists', async (req, res) => {
  const { userKey } = req.params;
  const { userSpotifyId } = await graph.vertexCollection('User').document(userKey);
  spotifyApi.getUserPlaylists(userSpotifyId).then(
    (data) => {
      const playlists = data.body.items;
      playlists.toString();
      const collabPlaylists = playlists.filter((i) => {
        if (i.collaborative === true) {
          return true;
        }
        return false;
      });
      res.status(200).json(collabPlaylists);
    },
    (err) => {
      res.status(404).json(err);
    },
  );
});

// Seleciona uma playlist colaborativa
router.post('/user/:userKey/room/:roomKey/playlist/:playlistId', async (req, res) => {
  const { roomKey, userKey, playlistId } = req.params;
  const userId = graph.vertexCollection('User').document({ _key: userKey });
  spotifyApi.getPlaylist(playlistId).then(
    async (data) => {
      const { href: url, name, description } = data.body;
      const savePlaylist = await graph
        .vertexCollection('Playlist')
        .save({ url, name, description });
      await graph
        .edgeCollection('users_playlist')
        .save({ type: 'owner' }, userId, savePlaylist._id);
      await graph.edgeCollection('room_playlist').save({}, roomKey, savePlaylist._id);
      res.status(200).json(savePlaylist);
    },
    (err) => {
      res.status(404).json(err);
    },
  );
});

// Cria uma playlist colaborativa com um nome(obrigatório) e descrição(opcional)
router.post('/user/:userKey/room/:roomKey/playlists', async (req, res) => {
  Joi.validate(req.body, objectRequestPost, (err) => {
    if (err) {
      res.status(400).json(err);
      throw err;
    }
  });
  const { roomKey, userKey } = req.params;
  const { userId, name, description } = req.body;
  const { userSpotifyId } = await graph.vertexCollection('User').document(userKey);
  if (userSpotifyId) {
    spotifyApi
      .createPlaylist(userSpotifyId, name, { public: false, collaborative: true, description })
      .then(
        async (data) => {
          const { href: url, name: nameSpotify, description: descriptionSpotify } = data.body;
          const savePlaylist = await graph
            .vertexCollection('Playlist')
            .save({ url, nameSpotify, descriptionSpotify });
          await graph
            .edgeCollection('users_playlist')
            .save({ type: 'owner' }, userId, savePlaylist._id);
          await graph.edgeCollection('room_playlist').save({}, roomKey, savePlaylist._id);
          res.status(201).json(savePlaylist);
        },
        (err) => {
          res.status(404).json(err);
        },
      );
  }
});

// Deleta uma playlist colaborativa
router.delete('/user/:userKey/room/:roomKey/playlist/:playlistKey', async (req, res) => {
  const { playlistKey, roomKey, userKey } = req.params;
  const { _id: userId } = await graph.vertexCollection('User').document(userKey);
  const { _id: roomId } = await graph.vertexCollection('Room').document(roomKey);
  const { _id: playlistId } = await graph.vertexCollection('Playlist').document(playlistKey);
  if (userId && roomId && playlistId) {
    const deletePlaylist = await graph.vertexCollection('Playlist').remove(playlistId);
    res.status(200).json({ Removed: deletePlaylist });
  }
  res.status(404).json({ ERR: 'Error' });
});

module.exports = router;
