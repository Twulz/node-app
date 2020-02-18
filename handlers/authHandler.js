var jwt = require('jsonwebtoken');
require('dotenv').config({path: './.env'});
const secret = process.env['SECRET'];
const logging = process.env['LOGGING'];

var checkToken = function(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return next('Token is invalid');
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.statusCode = 400;
        return next('Auth token is not supplied');
    }
};

module.exports = checkToken;