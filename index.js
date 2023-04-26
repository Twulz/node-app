const express = require('express');
const logger = require('morgan');
const expressSanitizer = require('express-sanitizer');
const cors = require('cors');
const cookieParser = require('cookie-parser');

let app = express();

app.use(cors({
    origin: ["http://127.0.0.1:3000","http://localhost:3000"],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
    preflightContinue: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Set-Cookie"],
    exposedHeaders: ["Authorization", "X-Set-Cookie", "Content-Type"]
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSanitizer());
app.use(cookieParser());
app.use(logger('dev'));

app.use(require('./routes/general/authentication.js'));
app.use(require('./handlers/authHandler.js'));
app.use(require('./routes/general/generalRoute.js'));
app.use(require('./routes/smartHome/sensors.js'));
app.use(require('./routes/budget/budget.js'));

// 404, needs to be second last
app.use(function (req, res, next) {
    res.status(404);
    res.json({
        success: false,
        status: 404,
        error: "Not Found",
    });
});

// General error handler, needs to be defined AFTER all other routes
app.use(function (err, req, res, next) {
    res.setHeader('content-type', 'application/json');
    // If status code hasn't changed, default to 500 server error
    if (res.statusCode === 200) {
        res.statusCode = 500;
    }
    console.error(err);
	// Return an error code
    res.json({
        success: false,
        status: res.statusCode,
        error: new String(err),
    });
});

// Start the server
if(!module.parent){
    let port = process.env.PORT != null ? process.env.PORT : 4000;
    var server = app.listen(port, 'localhost', function() {
        console.log(`Server started on port ${port}...`);
    });
}

exports.closeServer = function() {
    server.close();
};

module.exports = app;
