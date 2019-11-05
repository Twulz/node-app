var express = require('express');
var router = express.Router();

const logging = true;

// Respond with "hello world" for requests to root "/"}
router.get('/', async (req, res, next) => {
    try {
        res.setHeader('content-type', 'application/json');
        // if (logging) { console.log("GET request"); }
        res.statusCode = 200;
        res.send(JSON.stringify({"status": 200, "error": null, "response": "Hello World! New Server3 Success!"}));
    } catch (err) {
        return next(err);
    }
});

module.exports = router;