require('dotenv').config({path: './.env'});
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(logger('dev'));

app.use(require('./routes/general/authentication.js'));
app.use(require('./handlers/authHandler.js'));
app.use(require('./routes/general/generalRoute.js'));

// General error handler, needs to be defined AFTER all other routes
app.use(function (err, req, res, next) {
    // If status code hasn't changed, default to 500 server error
    if (res.statusCode === 200) {
        res.statusCode = 500;
        console.error(err);
	}
	// Return an error code
    res.json({
        success: false,
        status: res.statusCode,
        error: new String(err),
    })
});

// Start the server
if(!module.parent){
    var server = app.listen(process.env.PORT || 3000, 'localhost', function() {
        console.log('Server started on port 3000...');
    });
}

exports.closeServer = function() {
    server.close();
};

module.exports = app;
