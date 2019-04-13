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
  