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
  userId: Joi.string().regex(/User\/[0-9]+$/).required(),
  name: Joi.string().required(),
  description: Joi.string()
})


let accessToken = '';
let userId;
let name;
let description;
// spotifyApi.setAccessToken(accessToken);

// spotifyApi.getMe()
//       .then(function(data) {
//         userId = data.body.id
//       }, function(err) {
//         console.log('Something went wrong! - getMe', err);
// });

let playlists = {};

//Retorna um JSON com as playlists colaborativas do usuário
router.get('/', function(req, res, next) {
    spotifyApi.getUserPlaylists(userId)
  .then(function(data) {
    playlists = data.body.items
    playlists.toString()
    var filtered = playlists.filter(function (i,n){
        if(i.collaborative == true){
            return true;
        }
        return false;
    });
    res.json(filtered)
  },function(err) {
    console.log('Something went wrong!', err);
  });
});

//Seleciona uma playlist colaborativa
// router.post('/', function(req, res) {
//    var id = req.param.id;
// });

router.get('/post', function(req, res, next) {
    request.post('http://localhost:3000/api/v1/playlists/post', {form:{userId, name:'New Playlist', description:'New Playlist´s description'}})
    res.redirect('/')
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
        const {href: url, name, description} = data
        const savePlaylist = await graph.vertexCollection("Playlist").save({url, name, description})
        await graph.edgeCollection("users_playlist").save({type: "owner"},
        userId, savePlaylist._id)
        await graph.edgeCollection("room_playlist").save({}, room_key, savePlaylist._id)
        res.status(200).json(savePlaylist)
      }, err => {
        res.status(404).json(err)
    });
  }
});

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