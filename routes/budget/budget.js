const Ajv = require('ajv');
const express = require('express');
const router = express.Router();
const db = require('../../database/database');

// JSON Schemas
const transactionSchema = require('./schemas/transaction.json');

require('dotenv').config({path: './.env'});

const logging = true;
const dbURL = process.env['DB_URL'];

const ajv = Ajv({allErrors: true});

/**
Hello World
@returns 
{ 
    success: { true | false },
    response: { String }
}
*/
router.get('/budget/transactions/', async (req, res, next) => {
    try {

        res.setHeader('content-type', 'application/json');
        let transactions = await db.getAllTransactions(req.decoded.user_id);
        res.statusCode = 200;
        res.json({
            success: true,
            transactions: transactions
        });
    } catch (error) {
        return next(error);
    }
});

router.post('/budget/transaction', async (req, res, next) => {
    try {
        res.setHeader('content-type', 'application/json');
        if (ajv.validate(transactionSchema, req.body.transaction)) {
            res.statusCode = 200;
            let transId = await db.createTransaction(req.body.transaction, req.decoded.user_id);
            if (transId instanceof Error) {
                return next(transId);
            } 
            else {
                res.json({
                    success: true,
                    transaction_id: transId
                });
            }
        }
        else {
            res.statusCode = 400;
            console.log(ajv.errors);
            return next('Request does not match schema');
        }
    }
    catch (error) {
        return next(error);
    }
});

module.exports = router;