var jwt = require('jsonwebtoken');
require('dotenv').config({path: './.env'});
const secret = process.env['SECRET'];
const logging = process.env['LOGGING'];

/**
Checks whether the request has a valid JWT token, returns error if not
@param { OBJECT }
    { req.headers['x-access-token'] || req.headers['authorization'] }
@returns { OBJECT } 
{ 
    success: { true | false },
    response: { String },
    token: { String }
}
*/
var checkToken = function(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.statusCode = 401;
                return next('Authentication failed! Credentials are invalid');
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.statusCode = 400;
        return next('Authentication failed! Please check the request');
    }
};

module.exports = checkToken;