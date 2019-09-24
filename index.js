// Importing node framework
var express = require('express');

var app = express();

// Respond with "hello world" for requests to root "/"
app.get('/', function(req, res) {
    res.send('Hello world! Deployment success!');
});

// Listen to port 3000 by default
app.listen(process.env.PORT || 3000);

module.exports = app;
