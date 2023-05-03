const init = require('../utils/init');

init.destroyAll()
  .then(() => {
    process.exit();
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });