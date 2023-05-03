const request = require('supertest');
const app = require('../index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const db = require('../database/budget/budgetDB');
const testData = require('./data/budgetData');

const { expect } = chai;
chai.use(chaiHttp);

describe('BudgetTest', function () {

  before(function () {
    return db.initBudgetDatabase(testData);
  });

  describe('GET /budget/transactions/ SUCCESS', function () {

    let token = null;

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
        .get('/budget/transactions/')
        .set('Cookie', 'token=' + token)
        .set({ 'Accept': 'application/json' })
        .then(res => {
          expect(res).to.exist;
          expect(res.statusCode).to.equal(200);
          expect(res.body.transactions).to.exist;
        });
    });
  });

  after(function () {
    return db.destroyBudgetDatabase();
  });

});