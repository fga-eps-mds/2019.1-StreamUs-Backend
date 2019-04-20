const Database = require('arangojs');
const should = require('should');
const request = require('request');
const chai = require('chai');

const { expect } = chai;
const db = new Database({ url: process.env.ARANGO_HOST });
db.useBasicAuth('root', process.env.ARANGO_ROOT_PASSWORD);
db.useDatabase(process.env.ARANGO_DATABASE);
const graph = db.graph('streamUs');
const urlBase = 'http://localhost:3000/api/v1/room';

let userId;
describe('Testing /routes/rooms', () => {
  
  it('POST - create ROOM - OK', (done) => {
    request.post(
      {
        url: `${urlBase}/`,
        form: { userId: '2463',roomName: 'Teste Sala Criada',permissions: 'public' },
      }, (error, response, body) => {
        let _body = {};
        try {
          _body = JSON.parse(body);
        } catch (e) {
          _body = {};
        }

        expect(response.statusCode).to.equal(201);
        expect(_body._key);
      },
    );
    done();
  });

  it('POST - create ROOM with invalid userID - FAIL', (done) => {
    request.post(
      {
        url: `${urlBase}/`,
        form: { userId: 'User2463',roomName: 'Teste INVALID USERID',permissions: 'public' },
      }, (error, response, body) => {
        let _body = {};
        try {
          _body = JSON.parse(body);
        } catch (e) {
          _body = {};
        }

        expect(response.statusCode).to.equal(404);
      },
    );
    done();
  });

  it('POST - create ROOM without name - FAIL', (done) => {
    request.post(
      {
        url: `${urlBase}/`,
        form: { userId: '2463', roomName: '' ,permissions: 'public' },
      }, (error, response, body) => {
        let _body = {};
        try {
          _body = JSON.parse(body);
        } catch (e) {
          _body = {};
        }

        expect(response.statusCode).to.equal(404);
      },
    );
    done();
  });

  it('POST - create ROOM without permissions - FAIL', (done) => {
    request.post(
      {
        url: `${urlBase}/`,
        form: { userId: '2463',roomName: 'Teste NO PERMISSION',permissions: '' },
      }, (error, response, body) => {
        let _body = {};
        try {
          _body = JSON.parse(body);
        } catch (e) {
          _body = {};
        }

        expect(response.statusCode).to.equal(404);
      },
    );
    done();
  });

});

