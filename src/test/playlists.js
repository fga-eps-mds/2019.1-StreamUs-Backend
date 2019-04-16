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

describe("Testing /routes/playlists", async function() {
    // before(async function() {    
    //         const userSpotifyId = "21ghq47jneekpkayuvhq46ahq";
    //         const collection = graph.vertexCollection("User")
    //         try{
    //             const saveUser = await collection.save({userSpotifyId})
    //         } catch (e){
    //             console.log(e)
    //         }
    // });

    it("GET - user collaborative playlists", function(done) {
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

                _body.forEach(function(element) {
                    if(element.should.have.property('collaborative')){
                        expect(element.collaborative).to.equal(true);
                    }                   
                });
            }
        );
        done();
    });

    it("POST - set collaborative playlist in a room ", function(done) {
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

});