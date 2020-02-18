var jwt = require('jsonwebtoken');
require('dotenv').config({path: './.env'});
const secret = process.env['SECRET'];
const logging = process.env['LOGGING'];

var checkToken = function(req, res, next) {
        let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (token == null) {
            return res.json({
                success: false,
                message: 'Token not provided'
            });
        }
        if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
        }
    
        if (token) {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
            return res.json({
                success: false,
                message: 'Token is not valid'
            });
            } else {
            req.decoded = decoded;
            next();
            }
        });
        } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
        }
    };

module.exports = checkToken;