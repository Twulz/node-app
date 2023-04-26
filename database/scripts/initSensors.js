/**
 * Initialises the tables in the database if they don't exist and inserts initial data
 * Intended for creating a new production environment with sample data
 */
const sensors = require('../smartHome/sensors');
const initData = require('./initData.js');

sensors.destroySensorDatabase()
  .then((result) => {
    console.log(result);
    return sensors.initSensorDatabase(initData);
  })
  .then((result) => {
    console.log(result);
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });