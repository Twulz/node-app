const request = require('supertest');
const app = require('../index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

describe('SensorTest: POST /smartHome/sensor/:id SUCCESS', function() {

    let token = null;
    let sensorId = 1;
    let value = 500;

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
            .post('/smartHome/sensor/' + sensorId)
            .query({value: value})
            .set('Cookie', 'token='+token)
            .set({'Accept': 'application/json'})
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.statusCode).to.equal(201);
                expect(res.body.response).to.include('Success');
                done();
            })
    });
});
