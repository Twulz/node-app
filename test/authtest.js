const request = require('supertest');
const app = require('../index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

describe('GET / SUCCESS', function() {

    var token = null;

    before(function(done) {
        request(app)
            .post('/login')
            .send({ username: 'testuser@email.com', password: 'password' })
            .end(function(err, res) {
                token = res.body.token; // Or something
                done();
            });
      });

    it('Respond with success', function(done) {
        request(app)
            .get('/')
            .set("Authorization", "Bearer " + token) 
            .set({'Accept': 'application/json'})
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.response).to.include('Success');
                done();
            })
    });
});

describe('GET / FAILURE: missing Token', function() {
    it('Respond with 400: check the request', function(done) {
        request(app)
            .get('/')
            .set({'Accept': 'application/json'})
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.statusCode).to.equal(400);
                expect(res.body.error).to.include('check the request');
                done();
            })
    });
});

describe('GET / FAILURE: invalid Token', function() {
    it('Respond with 401: unorthorized', function(done) {
        request(app)
            .get('/')
            .set("Authorization", "Bearer totally_legit_token") 
            .set({'Accept': 'application/json'})
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.statusCode).to.equal(401);
                expect(res.body.error).to.include('invalid');
                done();
            })
    });
});

describe('POST /login SUCCESS', function() {
    it('Respond with login token', function(done) {
        request(app)
            .post('/login')
            // TODO: need to properly implement knex to create more valid test data!
            .send({ username: "testuser@email.com", password: "password" })
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.token).to.exist;
                done();
            });
    })
});