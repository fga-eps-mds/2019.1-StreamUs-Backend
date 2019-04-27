const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const cors = require('cors');
const users = require('./routes/users');
const rooms = require('./routes/rooms');
const playlists = require('./routes/playlists');
const login = require('./routes/login');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(`${__dirname}/public`))
  .use(cors())
  .use(cookieParser());
app.use('/', login);
app.use('/api/v1/users', users);
app.use('/api/v1/room', rooms);
app.use('/api/v1/', users);
app.use('/api/v1/', playlists);

module.exports = app;
