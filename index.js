// Importing node framework
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const logging = true;

let app = express();
app.use(bodyParser.json());
app.use(logger('dev'));

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
		status: res.statusCode,
        error: new String(err),
    })
});

// Start the server
var server = app.listen(process.env.PORT || 3000, function() {
    console.log('Server started on port 3000...');
});

exports.closeServer = function() {
    server.close();
};

module.exports = app;
