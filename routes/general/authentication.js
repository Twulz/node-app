const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../database/user/userDB');
const { check, validationResult } = require('express-validator');

require('util');

const secret = process.env['SECRET'];
const logging = process.env['LOGGING'];

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
router.post('/:version(v\\d+)/login', [
  check('username').exists().escape().isEmail(),
  check('password').exists().escape()
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.statusCode = 400;
      return next('Authentication failed! Please check the request');
    }

    res.setHeader('content-type', 'application/json');

    if (req.body.username && req.body.password) {
      db.getHashedPassword(req.body.username)
        .then(dbhash => {
          bcrypt.compare(req.body.password, dbhash, async function (err, result) {
            if (err) {
              res.statusCode = 400;
              res.error = err;
              return next('Authentication failed! Please check the request');
            }
            if (result) {
              let userData = await db.getUserAuthData(req.body.username);
              if (userData.app_access) {
                let token = jwt.sign(
                  { user_id: userData.id },
                  secret,
                  { expiresIn: '24h' }
                );
                // return the JWT token for the future API calls
                res.cookie("token", JSON.stringify(token), {
                  secure: process.env.SECURE_COOKIE === "true", // https unavailable on localhost
                  httpOnly: true,
                  withCredentials: true,
                  maxAge: 8 * 60 * 60 * 1000,  // 8 hours
                  sameSite: "None",
                  path: "/",
                });
                res.statusCode = 200;
                res.json({
                  success: true,
                  response: 'Authentication successful!'
                });
              } else {
                res.statusCode = 401;
                return next('User is not authorised');
              }
            } else {
              res.statusCode = 401;
              return next('Incorrect username or password');
            }
          });
        })
        .catch(err => {
          res.statusCode = 500;
          return next('Authentication failed! Server Error');
        })
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
router.post('/:version(v\\d+)/register', [
  check('username').exists().escape().isEmail(),
  check('password').exists().escape()
], async (req, res, next) => {
  try {

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.statusCode = 400;
      return next('Registration failed! Please check the request');
    }

    if (req.body.username && req.body.password) {
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        db.registerUser(req.body.username, hash)
          .then(result => {
            if (result) {
              res.statusCode = 201;
              res.json({
                success: true,
                response: 'User created!'
              });
            } else if (result == null) {
              res.statusCode = 200;
              res.json({
                success: false,
                response: 'User already exists!'
              });
            } else {
              res.statusCode = 401;
              res.json({
                success: false,
                response: 'Registration failed!'
              });
            }
          })
          .catch(error => {
            console.log('error!');
            console.log(error);
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
