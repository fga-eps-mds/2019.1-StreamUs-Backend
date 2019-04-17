const Database = require('arangojs');
const should = require('should');
const request = require('request');
const chai = require('chai');
const expect = chai.expect;
const db = new Database({url: process.env.ARANGO_HOST});
db.useBasicAuth('root', process.env.ARANGO_ROOT_PASSWORD);
db.useDatabase(process.env.ARANGO_DATABASE);
const graph = db.graph('streamUs');
const urlBase = "http://localhost:3000/api/v1/user";

describe("Testing /routes/playlists", function() {
    // before(async function() {    
    //         const userSpotifyId = "21ghq47jneekpkayuvhq46ahq";
    //         const collection = graph.vertexCollection("User")
    //         try{
    //             const saveUser = await collection.save({userSpotifyId})
    //         } catch (e){
    //             console.log(e)
    //         }
    // });

    it("GET - get user collaborative playlists - OK", function(done) {
        request.get(
            {
                url : urlBase + "/9115/playlists",
            }, function(error, response, body) {
                let _body = {};
                try{
                    _body = JSON.parse(body);
                }
                catch(e){
                    _body = {};
                }

                expect(response.statusCode).to.equal(200);

                _body.map(function(element) {
                    if(element.should.have.property('collaborative')){
                        expect(element.collaborative).to.equal(true);
                    }                   
                });
            }
        );
        done();
    });

    it("GET - get user collaborative playlists - FAIL", function(done) {
        request.get(
            {
                url : urlBase + "/9115X/playlists",
            }, function(error, response, body) {
                let _body = {};
                try{
                    _body = JSON.parse(body);
                }
                catch(e){
                    _body = {};
                }

                expect(response.statusCode).to.equal(404);
            }
        );
        done();
    });

    it("POST - create collaborative playlist in a room - OK", function(done) {
        request.post(
            {
                url : urlBase + "/9115/room/9178/playlists",
                form:{userId:'User/21ghq47jneekpkayuvhq46ahq', name:'New Playlist', description:'New description.'}
            }, function(error, response, body) {
                let _body = {};
                try{
                    _body = JSON.parse(body);
                }
                catch(e){
                    _body = {};
                }

                expect(response.statusCode).to.equal(201);
                expect(_body._key);
            }
        );
        done();
    });

    it("POST - create collaborative playlist in a room - FAIL", function(done) {
        request.post(
            {
                url : urlBase + "/9115X/room/9178/playlists",
                form:{userId:'User/21ghq47jneekpkayuvhq46ahq', name:'New Playlist', description:'New description.'}
            }, function(error, response, body) {
                let _body = {};
                try{
                    _body = JSON.parse(body);
                }
                catch(e){
                    _body = {};
                }

                expect(response.statusCode).to.equal(404);
            }
        );
        done();
    });

    it("POST - create collaborative playlist in a room - FAIL", function(done) {
        request.post(
            {
                url : urlBase + "/9115/room/9178/playlists",
                form:{userId:'User21ghq47jneekpkayuvhq46ahq', name:'New Playlist', description:'New description.'}
            }, function(error, response, body) {
                let _body = {};
                try{
                    _body = JSON.parse(body);
                }
                catch(e){
                    _body = {};
                }

                expect(response.statusCode).to.equal(400);
            }
        );
        done();
    });

    it("POST - set collaborative playlist in a room - OK", function(done) {
        request.post(
            {
                url : urlBase + "/9115/room/9178/playlist/6Psi2To1yK56okWDCU6Fh6",
            }, function(error, response, body) {
                let _body = {};
                try{
                    _body = JSON.parse(body);
                }
                catch(e){
                    _body = {};
                }

                expect(response.statusCode).to.equal(200);
                expect(_body._key);
            }
        );
        done();
    });    

    it("POST - set collaborative playlist in a room - FAIL", function(done) {
        request.post(
            {
                url : urlBase + "/9115/room/9178/playlist/",
            }, function(error, response, body) {
                let _body = {};
                try{
                    _body = JSON.parse(body);
                }
                catch(e){
                    _body = {};
                }

                expect(response.statusCode).to.equal(404);
            }
        );
        done();
    }); 

    it("DELETE - delete collaborative playlist in a room - OK", function(done) {
        request.delete(
            {
                url : urlBase + "/9115/room/9178/playlist/144730",
            }, function(error, response, body) {
                let _body = {};
                try{
                    _body = JSON.parse(body);
                }
                catch(e){
                    _body = {};
                }

                expect(response.statusCode).to.equal(200);

                expect(_body.Removed);
            }
        );
        done();
    });
    
    it("DELETE - delete collaborative playlist in a room - FAIL", function(done) {
        request.delete(
            {
                url : urlBase + "/9115X/room/9178X/playlist/146119X",
            }, function(error, response, body) {
                let _body = {};
                try{
                    _body = JSON.parse(body);
                }
                catch(e){
                    _body = {};
                }

                expect(response.statusCode).to.equal(404);

                expect(_body.Removed);
            }
        );
        done();
    });

});