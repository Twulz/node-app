const sensorDB = require('../smartHome/sensors');
const budgetDB = require('../budget/budgetDB');
const userDB = require('../user/userDB');

module.exports = {
  init(data) {
    sensorDB.destroySensorDatabase()
      .then((result) => {
        console.log(result);
        return budgetDB.destroyBudgetDatabase()
      })
      .then((result) => {
        console.log(result);
        return userDB.destroyUserDatabase();
      })
      .then((result) => {
        console.log(result);
        return userDB.initUserDatabase(data);
      })
      .then((result) => {
        console.log(result);
        return budgetDB.initBudgetDatabase()
      })
      .then((result) => {
        console.log(result);
        return sensorDB.initSensorDatabase(data);
      })
      .then((result) => {
        console.log(result);
        process.exit();
      })
      .catch((error) => {
        console.log(error);
        process.exit(1);
      });
  },

  cleanInit() {
    sensorDB.destroySensorDatabase()
      .then((result) => {
        console.log(result);
        return budgetDB.destroyBudgetDatabase()
      })
      .then((result) => {
        console.log(result);
        return userDB.destroyUserDatabase();
      })
      .then((result) => {
        console.log(result);
        return userDB.initUserDatabase();
      })
      .then((result) => {
        console.log(result);
        return budgetDB.initBudgetDatabase()
      })
      .then((result) => {
        console.log(result);
        return sensorDB.initSensorDatabase();
      })
      .then((result) => {
        console.log(result);
        process.exit();
      })
      .catch((error) => {
        console.log(error);
        process.exit(1);
      });
  }
}