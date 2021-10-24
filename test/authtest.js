const request = require('supertest');
const app = require('../index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

describe('AuthTest: GET / SUCCESS', function() {

    let token = null;

    before(function(done) {
        request(app)
            .post('/login')
            .send({ username: 'testuser@email.com', password: 'password' })
            .end(function(err, res) {
                token = res.header['set-cookie'][0];
                if (token != null) {
                    token = token.slice(9, 153);
                }
                done();
            });
    });


       
    it('Respond with success', function(done) {
        request(app)
            .get('/')
            .set('Cookie', 'token='+token)
            .set({'Accept': 'application/json'})
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.response).to.include('Success');
                done();
            })
    });
});

describe('AuthTest: GET / FAILURE: missing Token', function() {
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

describe('AuthTest: GET / FAILURE: invalid Token', function() {
    it('Respond with 401: unauthorised', function(done) {
        request(app)
            .get('/')
            .set('Cookie', 'token=totally_legit_token')
            .set({'Accept': 'application/json'})
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.statusCode).to.equal(401);
                expect(res.body.error).to.include('invalid');
                done();
            })
    });
});

describe('AuthTest: POST /login SUCCESS', function() {
    it('Respond with login token', function(done) {
        request(app)
            .post('/login')
            .send({ username: "testuser@email.com", password: "password" })
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.header['set-cookie'][0]).to.exist;
                expect(res.header['set-cookie'][0].startsWith('token=')).to.equal(true);
                done();
            });
    })
});