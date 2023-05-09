var express = require('express');
var router = express.Router();

const logging = true;

/**
Hello World
@returns 
{ 
    success: { true | false },
    response: { String }
}
*/
router.get('/:version(v\\d+)/', async (req, res, next) => {
    try {
        res.setHeader('content-type', 'application/json');
        // if (logging) { console.log("GET request"); }
        res.statusCode = 200;
        res.json({
            success: true,
            response: "Hello World Success!"
        });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;