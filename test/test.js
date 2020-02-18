const request = require('supertest');
const app = require('../index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

describe('GET /', function() {
    it('Respond with fail', function(done) {
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                done();
            })
    });
});

describe('POST /', function() {
    it('Respond with fail', function(done) {
        request(app)
            .post('/')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                done();
            })
    });
});
