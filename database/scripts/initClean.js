/**
 * Initialises the tables in the database if they don't exist.
 * Intended for creating new tables on deployment to production (no data insert)
 */
const init = require('../utils/init');

init.init()
  .then(() => {
    process.exit();
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  })