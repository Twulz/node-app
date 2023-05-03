const dbUtils = require('../utils/utils');

/* Converts an array of JSON user data into values that can be inserted */
function user_JSONtoValueString(data) {

  let values = '';

  for (let i = 0; i < data.length; i++) {
      if (i != 0) values += ",";
      values += "(\"";
      values += data[i].username + "\",\"";
      values += data[i].password + "\"";
      if (data[i].app_access) values += "," + data[i].app_access
      values += ")";
  }

  return values;

}

module.exports = {

  /** 
   * Creates the user table in the database
   * @param { object } data: JSON data to insert into the database
   * @returns { Promise } of 'Success' | Error
   */
  destroyUserDatabase() {

    let q_dropTableUser = `DROP TABLE IF EXISTS user;`;

    return dbUtils.runQuery(q_dropTableUser)
      .then(result => {
        console.log('---destroyUserDatabase Drop Success');
        return result;
      })
      .catch(error => new Error(error));

  },

  /** 
   * Creates the user table in the database
   * @param { object } data: JSON data to insert into the database
   * @returns { Promise } of 'Success' | Error
   */
  initUserDatabase(data) {

    let q_createTableUser = `
      CREATE TABLE IF NOT EXISTS user (
        id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(60) NOT NULL,
        app_access BOOLEAN NOT NULL DEFAULT 0,
        PRIMARY KEY (id)
      );`;
    let q_insertUser_full = '';
    if (data && data.user) q_insertUser_full = `INSERT INTO user (username, password, app_access) VALUES ` + user_JSONtoValueString(data.user);

    return dbUtils.runQuery(q_createTableUser)
      .then(result => {
        console.log('---initUserDatabase Create Success');
        return (data && data.user) ? dbUtils.runQuery(q_insertUser_full) : result;
      })
      .then(result => {
        console.log('---initUserDatabase Insert Success');
        return result;
      })
      .catch(error => new Error(error));

  },

  /**
   * Registers a new user with the given username and password
   * @param { string } username: The username (email address) of the user
   * @param { CHAR(60) } password: A salted hash generated from the user's inputted password
   * @returns { Promise } of 'Success' | Error
   */
  registerUser(username, password) {

    let q_insertUser = `INSERT INTO user (username, password) VALUES ("` + username + `","` + password + `");`;

    return dbUtils.runQuery(q_insertUser)
      .then(() => 'Success')
      .catch(error => new Error(error));

  },

  /** 
   * Deletes the given user from the database
   * @param { string } username: The username (email address) of the user
   * @returns { Promise } of 'Success' | Error
   */
  deleteUser(username) {

    let q_deleteUser = `DELETE FROM user WHERE username = "` + username + `"`;

    return dbUtils.runQuery(q_deleteUser)
      .then(() => 'Success')
      .catch(error => new Error(error));

  },

  /**
   * Gets the salted hash representing the given username's password
   * @param { string } username: The username (email address) of the user
   * @returns { CHAR(60) } password: A salted hash generated from the user's inputted password
   */
  getHashedPassword(username) {

    let query = `SELECT password FROM user WHERE username = "` + username + `"`;

    return dbUtils.runQuery(query)
      .then(result => {
        if (result[0]) {
          return result[0].password;
        } else {
          return null;
        }
      })
      .catch(error => new Error(error));

  },

  /**
   * Returns user details: id and app access
   * @param { string } username: The username (email address) of the user
   * @returns { object } userDetails: { user_id: integer, app_access: boolean }
   */
  getUserAuthData(username) {

    let query = `SELECT id, app_access FROM user WHERE username = "` + username + `"`;

    return dbUtils.runQuery(query)
      .then(result => {
        if (result[0]) {
          return result[0];
        } else {
          throw new Error('User not found');
        }
      })
      .catch(error => new Error(error));

  },
}