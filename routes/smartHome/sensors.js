const express = require('express');
const router = express.Router();
const db = require('../../database/smartHome/sensors');
const { param, query, validationResult } = require('express-validator');
const logging = process.env['LOGGING'];

/**
Insert sensor data
@returns 
{ 
    success: { true | false },
    response: { String }
}
*/
router.post('/smartHome/sensor/:id', [
    param('id').exists().isInt(),
    query('value').exists().isDecimal()], async (req, res, next) => {
        try {
            const inputResult = validationResult(req);
            if (inputResult.isEmpty()) {
                res.setHeader('content-type', 'application/json');
                db.insertSensorData(req.params.id, req.query.value)
                    .then((result) => {
                        if (result instanceof Error) {
                            if (logging) console.log(result);
                            res.statusCode = 400;
                            return next('Insert Failed! Invalid data.');
                        } else {
                            res.statusCode = 201;
                            res.json({
                                success: true,
                                response: "Success: Added!"
                            });
                        }
                    });
            } else {
                if (logging) console.log(inputResult.errors);
                return next('Insert Failed! Invalid data supplied.');
            }
        } catch (err) {
            return next(err);
        }
});

module.exports = router;