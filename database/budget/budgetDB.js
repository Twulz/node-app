const init = require('./initBudgetDB');
const transactions = require('./transactions');
const accounts = require('./accounts');
const categories = require('./categories');
const initBudget = require('./initBudgetDB');
const userDB = require('../user/userDB');

module.exports = {
  ...init,
  ...transactions,
  ...accounts,
  ...categories,
  ...initBudget,

  initBudgetDatabase(data) {
    return initBudget.destroyBudgetTables()
      .then(() => {
        return userDB.destroyUserDatabase();
      })
      .then(result => {
        return (data && data.user) ? userDB.initUserDatabase(data) : result;
      })
      .then(result => {
        return (data && data.user) ? userDB.initUserDatabase(data) : result;
      })
      .catch(error => {
        console.log(error);
        process.exit(1);
      });
  },

  destroyBudgetDatabase() {
    return initBudget.destroyBudgetTables()
      .then(() => {
        return userDB.destroyUserDatabase();
      })
      .catch(error => {
        console.log(error);
        process.exit(1);
      });
  },
}