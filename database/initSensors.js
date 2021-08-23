const db = require('./database.js');
const initData = require('./initData.js');

db.destroySensorDatabase()
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