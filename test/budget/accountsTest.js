const request = require('supertest');
const app = require('../../index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const db = require('../../database/budget/budgetDB.js');
const testData = require('../data/budgetData.js');
const utils = require('../utils/utils.js');

const { expect } = chai;
chai.use(chaiHttp);

const path = '/budget';
const version = '/v1';

describe('Budget - Accounts', function () {

  let token = null;

  before(function () {
    return db.initBudgetDatabase(testData)
      .then(() => {
        return utils.getToken(request, app, version);
      })
      .then(recToken => {
        token = recToken;
      })
      .catch(err => { console.log(err) });
  });

  describe('GET /accounts/ SUCCESS', function () {

    it('Respond with success', function () {
      return request(app)
        .get(path+version+'/accounts')
        .set('Cookie', 'token=' + token)
        .set({ 'Accept': 'application/json' })
        .then(res => {
          expect(res).to.exist;
          expect(res.statusCode).to.equal(200);
          expect(res.body.accounts).to.exist;
        });
    });
  });

  describe('POST /account SUCCESS', function () {

    let body = {
      account: {
        name: 'Test Post'
      }
    };

    it('Respond with success', function () {
      return request(app)
        .post(path+version+'/account')
        .set('Cookie', 'token=' + token)
        .set({ 'Accept': 'application/json' })
        .send(body)
        .then(res => {
          expect(res).to.exist;
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
        });
    });
  });

  describe('PUT /account SUCCESS', function () {

    let body = {
      account: {
        id: 1,
        name: 'Test Post 2'
      }
    };

    it('Respond with success', function () {
      return request(app)
        .put(path+version+'/account')
        .set('Cookie', 'token=' + token)
        .set({ 'Accept': 'application/json' })
        .send(body)
        .then(res => {
          expect(res).to.exist;
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
        });
    });
  });

  describe('DELETE /account SUCCESS', function () {

    let body = {
      account: {
        id: 1
      }
    };

    it('Respond with success', function () {
      return request(app)
        .delete(path+version+'/account')
        .set('Cookie', 'token=' + token)
        .set({ 'Accept': 'application/json' })
        .send(body)
        .then(res => {
          expect(res).to.exist;
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
        });
    });
  });

  after(function () {
    return db.destroyBudgetDatabase();
  });

});