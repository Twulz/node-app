const request = require('supertest');
const app = require('../index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const db = require('../database/smartHome/smartHomeDB');
const testData = require('./data/smartHomeData');

const { expect } = chai;
chai.use(chaiHttp);

describe('SensorTest', function () {

  before(function () {
    return db.initSmartHome(testData);
  });

  describe('POST /smartHome/sensor/:id SUCCESS', function () {

    let token = null;
    let sensorId = 1;
    let value = 500;

    before(function () {
      return request(app)
        .post('/login')
        .send({ username: 'testuser@email.com', password: 'password' })
        .then(res => {
          token = res.header['set-cookie'][0];
          if (token != null) {
            token = token.slice(9, 153);
          }
        });
    });

    it('Respond with success', function () {
      return request(app)
        .post('/smartHome/sensor/' + sensorId)
        .query({ value: value })
        .set('Cookie', 'token=' + token)
        .set({ 'Accept': 'application/json' })
        .then(res => {
          expect(res).to.exist;
          expect(res.statusCode).to.equal(201);
          expect(res.body.response).to.include('Success');
        });
    });
  });

  after(function () {
    return db.destroySmartHome();
  });

});
