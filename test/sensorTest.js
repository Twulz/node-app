const request = require('supertest');
const app = require('../index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const db = require('../database/smartHome/smartHomeDB');
const testData = require('./data/smartHomeData');
const utils = require('./utils/utils');

const { expect } = chai;
chai.use(chaiHttp);

const path = '/smartHome';
const version = '/v1';

describe('SensorTest', function () {

  let token = null;

  before(function () {
    return db.initSmartHome(testData)
      .then(() => {
        return utils.getToken(request, app, version);
      })
      .then(recToken => {
        token = recToken;
      })
      .catch(err => { console.log(err) });
  });

  describe('POST /sensor/:id SUCCESS', function () {

    let sensorId = 1;
    let value = 500;

    it('Respond with success', function () {
      return request(app)
        .post(path+version+'/sensor/' + sensorId)
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
