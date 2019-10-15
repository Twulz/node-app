const request = require('supertest');
const app = require('../index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

describe('GET /', function() {
    it('Respond with success', function(done) {
        chai
            .request(app)
            .get('/')
            .set({'Accept': 'application/json'})
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.response).to.include('Success');
                done();
            })
    });
});

describe('POST /', function() {
    it('Respond with fail', function(done) {
        chai
            .request(app)
            .post('/')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(404);
                done();
            })
    });
});
