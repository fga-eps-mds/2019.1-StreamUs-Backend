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

router.get('/post', function(req, res, next) {
    request.post('http://localhost:3000/api/v1/playlists/', {form:{id:userId, name:'New Playlist', description:'New Playlist´s description'}})
    res.redirect('/')
});

router.post('/', function(req, res) {
    spotifyApi.createPlaylist(req.body.id, req.body.name, { 'public' : false, 'collaborative' : true, 'description' : req.body.description })
      .then(function(data) {
        console.log('Playlist created!')
      }, function(err) {
        console.log('Something went wrong! - createPlaylist', err);
    });
});

module.exports = router;