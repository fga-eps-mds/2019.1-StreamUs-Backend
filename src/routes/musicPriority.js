const express = require('express');
const Database = require('arangojs');

const router = express.Router();
const Joi = require('joi');
const SpotifyWebApi = require('spotify-web-api-node');
const db = new Database({ url: process.env.ARANGO_HOST });

db.useBasicAuth('root', process.env.ARANGO_ROOT_PASSWORD);
db.useDatabase(process.env.ARANGO_DATABASE);

const objectRequestPut = Joi.object().keys({
range_start: Joi.number().integer().required(),
range_length: Joi.number().integer(),
insert_before: Joi.number().integer().required()
});

const spotifyApi = new SpotifyWebApi({
clientId: process.env.CLIENT_ID || '',
clientSecret: process.env.CLIENT_SECRET || '',
redirectUri: `${process.env.HOST_API || ''}/playlists/callback`, //verificar isso
});

const accessToken = process.env.ACCESS_TOKEN || '';
spotifyApi.setAccessToken(accessToken);

//Salvar e ou atualizar no BD
router.put('/playlists/:playlistId', async (req, res) => {
Joi.validate(req.body, objectRequestPut, (err) => {
    if (err) {
        res.status(400).json(err);
        throw err;
    }
});

//Playlist
const { playlistId } = req.params;
const { 
    range_start,//posicao da musica
    range_length,//quantas musicas que serão reordenadas
    insert_before //posicao que as músicas serão inseridas
        } = req.body;
//começo da playlist
spotifyApi.getPlaylist(playlistId)
    .then(
        async (data) => {
            spotifyApi.reorderTracksInPlaylist(playlistId, range_start, insert_before, range_length)
                .then(function (data) {
                    console.log('Foi reordenada a playlist!');
                }, function (err) {
                    console.log('Houve um erro na reordenação da playlist!', err);
                });
        })
})

module.exports = router
