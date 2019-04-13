var express = require('express');
var router = express.Router();
const request = require('request');
var SpotifyWebApi = require('spotify-web-api-node');

var accessToken = '';
var userId;
var name;
var description;
spotifyApi.setAccessToken(accessToken);

spotifyApi.getMe()
      .then(function(data) {
        userId = data.body.id
      }, function(err) {
        console.log('Something went wrong! - getMe', err);
});

var playlists = {};

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
router.post('/', function(req, res) {
    var id = req.param.id;
});

router.get('/post', function(req, res, next) {
    request.post('http://localhost:3000/api/v1/playlists/post', {form:{id:userId, name:'New Playlist', description:'New Playlist´s description'}})
    res.redirect('/')
});

//Cria uma playlist colaborativa com um nome(obrigatório) e descrição(opcional)
router.post('/post', function(req, res) {
    spotifyApi.createPlaylist(req.body.id, req.body.name, { 'public' : false, 'collaborative' : true, 'description' : req.body.description })
      .then(function(data) {
        console.log('Playlist created!')
      }, function(err) {
        console.log('Something went wrong! - createPlaylist', err);
    });
});

module.exports = router;