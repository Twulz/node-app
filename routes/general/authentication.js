const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Database = require('../../database/database');

const { check, oneOf, validationResult } = require('express-validator');

require('dotenv').config({path: './.env'});
require('util');

const secret = process.env['SECRET'];
const logging = process.env['LOGGING'];
const dbURL = process.env['DB_URL'];

const db = new Database(dbURL);
const saltRounds = 10;

/**
Allows a user to log in to the system - is issued a JWT token
@body 
{
    username: { string },
    password: { string }
}
@returns 
{ 
    success: { true | false },
    response: { String },
    token: { String }
}
*/
router.post('/login', async(req, res, next) => {
    try {
        res.setHeader('content-type', 'application/json');

        if (req.body.username && req.body.password) {
            var dbhash = await db.getUserAuthData(req.body.username);
            bcrypt.compare(req.body.password, dbhash, function(err, result) {
                if (result) {
                    let token = jwt.sign(
                        {username: req.body.username},
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
            });
        } else {
            res.statusCode = 400;
            return next('Authentication failed! Please check the request');
        }
    } catch (err) {
        return next(err);
    }
});

/**
Allows a user to register a username and password into the system.
@body 
{
    username: { string },
    password: { string }
}
@returns 
{ 
    success: { true | false },
    response: { String }
}
*/
router.post('/register', async(req, res, next) => {
    try {
        if (req.body.username && req.body.password) {
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                db.registerUser(req.body.username, hash);
                res.statusCode = 201;
                res.json({
                    success: true,
                    response: 'User created!'
                });
            });
        } else {
            res.statusCode = 400;
            return next('Registration failed! Please check the request');
        }
    } catch (err) {
        return next(err);
    }

});
  
module.exports = router;
