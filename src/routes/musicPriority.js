const express = require('express');
const Database = require('arangojs');

const router = express.Router();
const Joi = require('joi');
const SpotifyWebApi = require('spotify-web-api-node');

db.useBasicAuth('root', process.env.ARANGO_ROOT_PASSWORD);
db.useDatabase(process.env.ARANGO_DATABASE);

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || '',
    redirectUri: `${process.env.HOST_API || ''}/playlists/callback`, //verificar isso
  });
  
  const accessToken = process.env.ACCESS_TOKEN || '';
  spotifyApi.setAccessToken(accessToken);

const {range_start, range_length, insert_before} = req.body

router.put('/playlists/:playlistId',async (req,res) => {
    const playlistId = req.params;
    spotifyApi.getPlaylist(playlistId)
    //continuar a partir daqui
    // falando sobre o metodo put https://developer.spotify.com/console/put-playlist-tracks/  --  https://developer.spotify.com/console/put-playlist-tracks/
    //exemplo replace trackshttps://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/add-remove-replace-tracks-in-a-playlist.js





}) 

