const db = require('./database.js');

db.deleteUser('testuser@email.com')
  .then((result) => {
    console.log(result);
    process.exit();
  })
  .catch((error) => new Error(error));

// TODO: add delete the sensor test data.