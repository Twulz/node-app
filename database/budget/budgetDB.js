const init = require('./initBudgetDB');
const transactions = require('./transactions');
const accounts = require('./accounts');
const categories = require('./categories');

module.exports = {
  ...init,
  ...transactions,
  ...accounts,
  ...categories
}