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

describe('Budget - Transactions', function () {

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

  describe('GET /transactions/ SUCCESS', function () {

    it('Respond with success', function () {
      return request(app)
        .get(path+version+'/transactions')
        .set('Cookie', 'token=' + token)
        .set({ 'Accept': 'application/json' })
        .then(res => {
          expect(res).to.exist;
          expect(res.statusCode).to.equal(200);
          expect(res.body.transactions).to.exist;
        });
    });
  });

  describe('POST /transaction/ SUCCESS', function () {

    let body = {
      transaction: {
        account_id: 1,
        category_id: 1,
        payee_id: null,
        date: "2023-05-02 00:00:00",
        amount: 10.53,
        cleared: true,
        notes: "Test"
      }
    };

    it('Respond with success', function () {
      return request(app)
        .post(path+version+'/transaction')
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