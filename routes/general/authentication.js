var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
require('dotenv').config({path: './.env'});
const secret = process.env['SECRET'];
const logging = process.env['LOGGING'];

router.post('/login', async(req, res, next) => {
    try {
        let username = req.body.username;
        let password = req.body.password;
        // For the given username fetch user from DB
        let mockedUsername = 'admin';
        let mockedPassword = 'password';

        res.setHeader('content-type', 'application/json');

        if (username && password) {
            if (username === mockedUsername && password === mockedPassword) {
            let token = jwt.sign(
                {username: username},
                secret,
                { expiresIn: '24h' }
            );
            // return the JWT token for the future API calls
            res.statusCode = 200;
            res.json({
                success: true,
                response: 'Authentication successful!',
                token: token
            });
            } else {
                res.statusCode = 401;
                err = 'Incorrect username or password';
                return next(err);
            }
        } else {
            res.statusCode = 400;
            return next('Authentication failed! Please check the request');
        }
    } catch (err) {
        return next(err);
    }
});
  
module.exports = router;
