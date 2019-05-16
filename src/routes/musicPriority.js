const express = require('express');
const Database = require('arangojs');

const router = express.Router();
const Joi = require('joi');
const SpotifyWebApi = require('spotify-web-api-node');

db.useBasicAuth('root', process.env.ARANGO_ROOT_PASSWORD);
db.useDatabase(process.env.ARANGO_DATABASE);

const objectRequestPut = Joi.object().keys({
  range_start: Joi.number().integer().required(),
  range_length: Joi.number().integer(),
  insert_before: Joi.number().integer().required
});

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',
  redirectUri: `${process.env.HOST_API || ''}/playlists/callback`, //verificar isso
});

spotifyApi
  .authorizationCodeGrant(authorizationCode)
  .then(function (data) {

    spotifyApi.setAccessToken(data['access_token'])
  })


router.put('/playlists/:playlistId', async (req, res) => {
  Joi.validate(req.body, objectRequestPut, (err) => {
    if (err) {
      res.status(400).json(err);
      throw err;
    }
  });
  const { playlistId } = req.params;
  const { range_start, range_length, insert_before } = req.body;
  spotifyApi.getPlaylist(playlistId)
    .then(
      async (data) => {
        spotifyApi.reorderTracksInPlaylist(playlistId, range_start, range_length, insert_before)
          .then(function (data) {
            console.log('Tracks reordered in playlist!');
          }, function (err) {
            console.log('Something went wrong!', err);
          });
      })
  //continuar a partir daqui
  // falando sobre o metodo put https://developer.spotify.com/console/put-playlist-tracks/  --  https://developer.spotify.com/console/put-playlist-tracks/
  //exemplo replace trackshttps://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/add-remove-replace-tracks-in-a-playlist.js





})

