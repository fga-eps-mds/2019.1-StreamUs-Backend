const express = require('express'); 
const request = require('request'); 
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

var client_id = 'be628abe9b224f61b5777fb3d0d6a636'; 
var client_secret = 'df77974aade94da8a62a76af55ad9825'; 
var redirect_uri = 'http://localhost:8888/callback/'; 


var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  
var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());


   app.get('/login', function(req, res) {
    //geração de string para cookie
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    // a aplicação requerendo autorização
    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
  });
    
