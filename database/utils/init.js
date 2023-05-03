const homeDB = require('../smartHome/smartHomeDB');
const budgetDB = require('../budget/budgetDB');
const userDB = require('../user/userDB');

module.exports = {
  init(data) {
    return homeDB.destroySmartHome()
      .then(() => {
        return budgetDB.destroyBudgetDatabase();
      })
      .then(() => {
        return userDB.destroyUserDatabase();
      })
      .then(() => {
        return userDB.initUserDatabase(data);
      })
      .then(() => {
        return budgetDB.initBudgetTables(data);
      })
      .then(() => {
        return homeDB.initSensorDatabase(data);
      })
      .catch(error => {
        console.log(error);
      });
  },

  destroyAll() {
    return homeDB.destroySmartHome()
      .then(() => {
        return budgetDB.destroyBudgetDatabase()
      })
      .then(() => {
        return userDB.destroyUserDatabase();
      })
      .catch(error => {
        console.log(error);
      });
  }
}