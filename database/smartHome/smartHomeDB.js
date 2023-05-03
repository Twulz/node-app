const sensors = require('./sensors');
const userDB = require('../user/userDB')

module.exports = {

  ...sensors,

  initSmartHome(data) {
    return sensors.destroySensorDatabase()
      .then(() => {
        return userDB.destroyUserDatabase();
      })
      .then(() => {
        return userDB.initUserDatabase(data);
      })
      .then(() => {
        return sensors.initSensorDatabase(data);
      })
      .catch(error => {
        console.log(error);
        process.exit(1);
      });
  },

  destroySmartHome() {
    return sensors.destroySensorDatabase()
      .then(() => {
        return userDB.destroyUserDatabase();
      })
      .catch(error => {
        console.log(error);
        process.exit(1);
      });
  },

}