const Ajv = require('ajv');
const express = require('express');
const router = express.Router();
const db = require('../../database/budget/budgetDB');

// JSON Schemas
const { transactionSchema } = require('./schemas/transaction.json');
const accountSchema = require('./schemas/account.json');
const categorySchema = require('./schemas/category.json');

const ajv = Ajv({ allErrors: true });

router.get('/budget/:version(v\\d+)/transactions/', async (req, res, next) => {
  res.setHeader('content-type', 'application/json');
  db.getAllTransactions(req.decoded.user_id)
    .then(transactions => {
      res.statusCode = 200;
      res.json({
        success: true,
        transactions: transactions
      });
    })
    .catch(err => next(err));
});

router.post('/budget/:version(v\\d+)/transaction', async (req, res, next) => {
  res.setHeader('content-type', 'application/json');
  if (ajv.validate(transactionSchema, req.body.transaction)) {
    db.createTransaction(req.body.transaction, req.decoded.user_id)
      .then(transId => {
        res.statusCode = 200;
        res.json({
          success: true,
          transId: transId
        });
      })
      .catch(error => next(error));
  }
  else {
    res.statusCode = 400;
    console.log(ajv.errors);
    return next('Request does not match schema');
  }
});

router.get('/budget/:version(v\\d+)/accounts/', async (req, res, next) => {
  res.setHeader('content-type', 'application/json');
  db.getAllAccounts(req.decoded.user_id)
    .then(accounts => {
      res.statusCode = 200;
      res.json({
        success: true,
        accounts: accounts
      });
    })
    .catch(error => next(error));
});

router.post('/budget/:version(v\\d+)/account', async (req, res, next) => {
  res.setHeader('content-type', 'application/json');
  if (ajv.validate(accountSchema.accountCreateSchema, req.body.account)) {
    db.createAccount(req.body.account.name, req.decoded.user_id)
      .then(result => {
        res.statusCode = 200;
        res.json({
          success: true
        });
      })
      .catch(error => next(error));
  }
  else {
    res.statusCode = 400;
    return next('Request does not match schema');
  }
});

router.put('/budget/:version(v\\d+)/account', async (req, res, next) => {
  res.setHeader('content-type', 'application/json');
  if (ajv.validate(accountSchema, req.body.account)) {
    if (req.body.account.active === null) {
      req.body.account.active = true
    }
    db.updateAccount(req.body.account, req.decoded.user_id)
      .then(result => {
        res.statusCode = 200;
        res.json({
          success: true
        });
      })
      .catch(err => next(err));
  }
  else {
    res.statusCode = 400;
    console.log(ajv.errors);
    return next('Request does not match schema');
  }
});

router.delete('/budget/:version(v\\d+)/account', async (req, res, next) => {
  res.setHeader('content-type', 'application/json');
  if (ajv.validate(accountSchema.accountDeleteSchema, req.body.account)) {
    db.deleteAccount(req.body.account.id, req.decoded.user_id)
      .then(result => {
        res.statusCode = 200;
        res.json({
          success: true
        });
      })
      .catch(error => next(error));
  }
  else {
    res.statusCode = 400;
    return next('Request does not match schema');
  }
});

router.get('/budget/:version(v\\d+)/categories/', async (req, res, next) => {
  res.setHeader('content-type', 'application/json');
  db.getAllCategories(req.decoded.user_id)
    .then(categories => {
      res.statusCode = 200;
      res.json({
        success: true,
        categories: categories
      });
    })
    .catch(error => next(error));
});

router.post('/budget/:version(v\\d+)/category', async (req, res, next) => {
    res.setHeader('content-type', 'application/json');
    if (ajv.validate(categorySchema.categoryCreateSchema, req.body.category)) {
      db.createCategory(req.body.category.name, req.decoded.user_id)
        .then(result => {
          res.statusCode = 200;
          res.json({
            success: true
          });
        })
        .catch(error => next(error) );
    }
    else {
      res.statusCode = 400;
      return next('Request does not match schema');
    }
});

module.exports = router;