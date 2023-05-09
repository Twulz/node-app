const request = require('supertest');
const app = require('../index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const db = require('../database/user/userDB');
const testData = require('./data/authData');

const { expect } = chai;
chai.use(chaiHttp);

const version = '/v1';

describe('AuthTest', function () {

  before(function () {
    return db.initUserDatabase(testData);
  });

  describe('GET / SUCCESS', function () {

    let token = null;

    before(function () {
      request(app)
        .post(version+'/login')
        .send({ username: 'testuser@email.com', password: 'password' })
        .then(res => {
          token = res.header['set-cookie'][0];
          if (token != null) {
            token = token.slice(9, 153);
          }
        });
    });

    it('Respond with success', function () {
      request(app)
        .get(version+'/')
        .set('Cookie', 'token=' + token)
        .set({ 'Accept': 'application/json' })
        .then(res => {
          expect(res).to.exist;
          expect(res.statusCode).to.equal(200);
          expect(res.body.response).to.include('Success');
        });
    });
  });

  describe('GET / FAILURE: missing Token', function () {
    it('Respond with 400: check the request', function () {
      request(app)
        .get(version+'/')
        .set({ 'Accept': 'application/json' })
        .then(res => {
          expect(res).to.exist;
          expect(res.statusCode).to.equal(400);
          expect(res.body.error).to.include('check the request');
        });
    });
  });

  describe('GET / FAILURE: invalid Token', function () {
    it('Respond with 401: unauthorised', function () {
      request(app)
        .get(version+'/')
        .set('Cookie', 'token=totally_legit_token')
        .set({ 'Accept': 'application/json' })
        .then(res => {
          expect(res).to.exist;
          expect(res.statusCode).to.equal(401);
          expect(res.body.error).to.include('invalid');
        });
    });
  });

  describe('POST /login SUCCESS', function () {
    it('Respond with login token', function () {
      request(app)
        .post(version+'/login')
        .send({ username: "testuser@email.com", password: "password" })
        .then(res => {
          expect(res).to.exist;
          expect(res.statusCode).to.equal(200);
          expect(res.header['set-cookie'][0]).to.exist;
          expect(res.header['set-cookie'][0].startsWith('token=')).to.equal(true);
        });
    })
  });

  after(function () {
    return db.destroyUserDatabase();
  });
});