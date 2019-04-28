const express = require('express');
const request = require('request');
const querystring = require('querystring');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const router = express.Router();


const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';


router.get('/login', (req, res) => {
  // geração de string para cookie
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // a aplicação requerendo autorização
  const scope = 'user-read-private user-read-email';
  res.redirect(`https://accounts.spotify.com/authorize?${
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      state,
    })}`);
});

router.get('/callback', (req, res) => {
  // a aplicação faz requisição para atualizar e para tokens de acesso
  // depois da checagem do status da resposta

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(`/#${
      querystring.stringify({
        error: 'state_mismatch',
      })}`);
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const { access_token: accessToken } = body;
        const { refresh_token: refreshToken } = body;
        //   console.log(access_token)

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: `Bearer ${accessToken}` },
          json: true,
        };

        // usa o token de acesso para acessar a API do Spotify
        request.get(options);
        // podemos também passar o token para o navegador para realizar requisições a partir dele
        res.redirect(`/#${
          querystring.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
          })}`);
      } else {
        res.redirect(`/#${
          querystring.stringify({
            error: 'invalid_token',
          })}`);
      }
    });
  }
});


router.get('/refresh_token', (req, res) => {
  // requisição de acesso pelo novo token

  const { refresh_token: refreshToken } = req.query;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}` },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const { access_token: accessToken } = body;
      res.send({
        access_token: accessToken,
      });
    }
  });
});

module.exports = router;
