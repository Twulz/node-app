const Ajv = require('ajv');
const express = require('express');
const router = express.Router();
const db = require('../../database/database');

// JSON Schemas
const { transactionSchema } = require('./schemas/transaction.json');
const accountSchema = require('./schemas/account.json');
const categorySchema = require('./schemas/category.json');

require('dotenv').config({path: './.env'});

const logging = true;
const dbURL = process.env['DB_URL'];

const ajv = Ajv({allErrors: true});

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
                    success: true
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

router.get('/budget/accounts/', async (req, res, next) => {
    try {

        res.setHeader('content-type', 'application/json');
        let accounts = await db.getAllAccounts(req.decoded.user_id);
        res.statusCode = 200;
        res.json({
            success: true,
            accounts: accounts
        });
    } catch (error) {
        return next(error);
    }
});

router.post('/budget/account', async (req, res, next) => {
    try {
        res.setHeader('content-type', 'application/json');
        if (ajv.validate(accountSchema.accountCreateSchema, req.body.account)) {
            res.statusCode = 200;
            let result = await db.createAccount(req.body.account.name, req.decoded.user_id);
            if (result instanceof Error) {
                return next(result);
            } 
            else {
                res.json({
                    success: true
                });
            }
        }
        else {
            res.statusCode = 400;
            return next('Request does not match schema');
        }
    }
    catch (error) {
        return next(error);
    }
});

router.put('/budget/account', async (req, res, next) => {
    try {
        res.setHeader('content-type', 'application/json');
        if (ajv.validate(accountSchema, req.body.account)) {
            if (req.body.account.active === null) {
                req.body.account.active = true
            }
            res.statusCode = 200;
            let result = await db.updateAccount(req.body.account, req.decoded.user_id);
            if (result instanceof Error) {
                return next(result);
            } 
            else {
                res.json({
                    success: true
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

router.delete('/budget/account', async (req, res, next) => {
    try {
        res.setHeader('content-type', 'application/json');
        if (ajv.validate(accountSchema.accountDeleteSchema, req.body.account)) {
            res.statusCode = 200;
            let result = await db.deleteAccount(req.body.account.id, req.decoded.user_id);
            if (result instanceof Error) {
                res.json({
                    success: false
                });
            } 
            else {
                res.json({
                    success: true
                });
            }
        }
        else {
            res.statusCode = 400;
            return next('Request does not match schema');
        }
    }
    catch (error) {
        return next(error);
    }
});

router.get('/budget/categories/', async (req, res, next) => {
    try {

        res.setHeader('content-type', 'application/json');
        let categories = await db.getAllCategories(req.decoded.user_id);
        res.statusCode = 200;
        res.json({
            success: true,
            categories: categories
        });
    } catch (error) {
        return next(error);
    }
});

router.post('/budget/category', async (req, res, next) => {
    try {
        res.setHeader('content-type', 'application/json');
        if (ajv.validate(categorySchema.categoryCreateSchema, req.body.category)) {
            res.statusCode = 200;
            let result = await db.createCategory(req.body.category.name, req.decoded.user_id);
            if (result instanceof Error) {
                return next(result);
            } 
            else {
                res.json({
                    success: true
                });
            }
        }
        else {
            res.statusCode = 400;
            return next('Request does not match schema');
        }
    }
    catch (error) {
        return next(error);
    }
});

module.exports = router;