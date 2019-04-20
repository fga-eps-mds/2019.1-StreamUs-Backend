const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const rooms = require('./routes/rooms')
const playlists = require('./routes/playlists');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/users', users);
app.use('/api/v1/room', rooms)
app.use('/api/v1/', users);
app.use('/api/v1/', playlists);

module.exports = app;
