const db = require('./database.js');
const initData = require('./initData');

db.destroySensorDatabase()
  .then((result) => {
    console.log(result);
    return db.destroyBudgetDatabase();
  })
  .then((result) => {
    console.log(result);
    return db.destroyUserDatabase();
  })
  .then ((result) => {
    console.log(result);
    return db.initUserDatabase();
  })
  .then((result) => {
    console.log(result);
    return db.initBudgetDatabase();
  })
  .then((result) => {
    console.log(result);
    return db.initSensorDatabase(initData);
  })
  .then((result) => {
    console.log(result);
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });