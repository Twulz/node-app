/**
 * Initialises the tables in the database if they don't exist.
 * Intended for creating new tables on deployment to production (no data insert)
 */

const db = require('./database.js');

db.initUserDatabase()
  .then((result) => {
    console.log(result);
    return db.initBudgetDatabase();
  })
  .then((result) => {
    console.log(result);
    return db.initSensorDatabase();
  })
  .then((result) => {
    console.log(result);
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });