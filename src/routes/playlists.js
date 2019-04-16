const express = require('express');
const Database = require('arangojs')
const router = express.Router();
const request = require('request');
const Joi = require('joi')
const SpotifyWebApi = require('spotify-web-api-node');
const db = new Database({url: process.env.ARANGO_HOST})
db.useBasicAuth("root", process.env.ARANGO_ROOT_PASSWORD);
db.useDatabase(process.env.ARANGO_DATABASE)
const graph = db.graph("streamUs")
const objectRequestPost = Joi.object().keys({
  userId: Joi.string().regex(/User\/[0-9a-z]+$/).required(),
  name: Joi.string().required(),
  description: Joi.string()
})

let spotifyApi = new SpotifyWebApi({
  clientId: 'b18ddb0dc6224de5b46fab81d1a3b4b1',
  clientSecret: '48a0faabc20b47ffac34d84dd0eaa1c5',
  redirectUri: 'http://localhost:3000/api/v1/playlists/callbacks'
});

let accessToken = 'BQAfsqUnfSJW4TOAXi8uUtitr82kI1ZAol-Dfj8c3XbpweFjJsi5gdN3j5XfvZ_Jd1jGfMvqpfKceFnwcBlOATO3YbMrcD6KNWIPng_Tz6NO6mTbBy7A0PdVej4l46vTVMseMXgfifCDtvSKsIRzz6Va6-H_LbRXvjr-2oxtOUlO5JuX_-s9RzmTKdNkbeVO7gbx-K8PRCXCBqU77ro7rSWTSBYxfq58kOK2pkN2l1iORNuK_XbavCZsJg';
spotifyApi.setAccessToken(accessToken);

//Retorna um JSON com as playlists colaborativas do usuário
router.get('/user/:user_key/playlists', async (req, res, next) => {
    const {user_key} = req.params
    const {userSpotifyId} = await graph.vertexCollection("User").document(user_key)
    spotifyApi.getUserPlaylists(userSpotifyId).then( data => {
    let playlists = data.body.items
    playlists.toString()
    let collabPlaylists = playlists.filter((i,n) => {
        if(i.collaborative == true){
            return true;
        }
        return false;
    });
    res.status(200).json(collabPlaylists)
  },function(err) {
    res.status(404).json(err)
  });
});

//Seleciona uma playlist colaborativa
router.post('/user/:user_key/room/:room_key/playlist/:playlist_id', async (req, res) => {
    const {room_key, user_key, playlist_id} = req.params
    spotifyApi.getPlaylist(playlist_id).then( async data => {
        const {href: url, name, description} = data.body
        const savePlaylist = await graph.vertexCollection("Playlist").save({url, name, description})
        //await graph.edgeCollection("users_playlist").save({type: "owner"},
        //userId, savePlaylist._id)
        //await graph.edgeCollection("room_playlist").save({}, room_key, savePlaylist._id)
        res.status(200).json(savePlaylist)
    }, function(err) {
        res.status(404).json(err)
    });
});

//Cria uma playlist colaborativa com um nome(obrigatório) e descrição(opcional)
router.post('/user/:user_key/room/:room_key/playlists', async (req, res) => {
  Joi.validate(req.body, objectRequestPost, (err, value) => {
    if(err) {
      res.json(err)
      throw err
    }
  })
  const {room_key, user_key} = req.params
  const {userId, name, description} = req.body
  const {userSpotifyId} = await graph.vertexCollection("User").document(user_key)
  if(userSpotifyId) {
    spotifyApi.createPlaylist(userSpotifyId, name, { 'public' : false, 'collaborative' : true, 'description' : description })
      .then(async data => {
        const {href: url, name, description} = data.body
        const savePlaylist = await graph.vertexCollection("Playlist").save({url, name, description})
        // await graph.edgeCollection("users_playlist").save({type: "owner"}, userId, savePlaylist._id)
        // await graph.edgeCollection("room_playlist").save({}, room_key, savePlaylist._id)
        res.status(201).json(savePlaylist)        
      }, err => {
        res.status(404).json(err)
    });
  }
});

//Deleta uma playlist colaborativa 
router.delete('/user/:user_key/room/:room_key/playlist/:playlist_key', async (req, res) => {
  const {playlist_key, room_key, user_key} = req.params
  const {_id: userId} = await graph.vertexCollection("User").document(user_key)
  const {_id: roomId} = await graph.vertexCollection("Room").document(room_key)
  const {_id: playlistId} = await graph.vertexCollection("Playlist").document(playlist_key)
  if(userId && roomId && playlistId) {
    const deletePlaylist = await graph.vertexCollection("Playlist").remove(playlistId)
    res.status(200).json({Removed: deletePlaylist})
  }
  res.status(404).json({ERR: "Error"})
});


module.exports = router;