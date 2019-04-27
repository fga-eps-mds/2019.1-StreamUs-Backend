const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const cors = require('cors');
const uuid = require('uuid/v4');
const redis = require('redis');
const rooms = require('./routes/rooms');
const playlists = require('./routes/playlists');
const login = require('./routes/login');

const redisClient = redis.createClient({ host: process.env.REDIS_HOST || 'localhost', port: 6379 });
const app = express();

redisClient.on('error', (err) => {
  throw err;
});
app.use(
  session({
    genid: () => uuid(),
    secret: process.env.SECRET_REDIS || 'test',
    saveUninitialized: true,
    resave: true,
    store: new RedisStore({
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379,
      client: redisClient,
      ttl: 86400,
    }),
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors()).use(cookieParser());
app.use(login);
app.use(rooms);
app.use(playlists);

module.exports = app;
