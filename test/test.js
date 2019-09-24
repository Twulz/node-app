var request = require('supertest');
var app = require('../index.js');

describe('GET /', function() {
    it('respond with hello world - deployment success', function(done) {
        // navigate to root and check the response is "hello world"
        request(app).get('/').expect('Hello world! Deployment success!', done);
    });
});
