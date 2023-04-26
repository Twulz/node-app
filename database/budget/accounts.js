const dbUtils = require('../utils/utils');

module.exports = {

  /**
   * Get all the transactions for a given user
   * @param { number } user_id 
   */
  getAllAccounts(user_id) {

    let q_getAccounts = `
      SELECT 
          id, 
          name, 
          active
      FROM account
      WHERE user_id = ${user_id}`;

    return dbUtils.runQuery(q_getAccounts)
      .then((result) => {
        return result
      })
      .catch((error) => new Error(error));
  },

  /**
   * Creates an account for the given user 
   * @param { string } account_name: The name of the account
   * @param { number } user_id: The user id of the user creating the account
   * @returns { Promise } of 'Success' | Error
   */
  createAccount(account_name, user_id) {

    let q_insertAccount = `INSERT INTO account (name, user_id) VALUES ("` + account_name + `",` + user_id + `) OUTPUT INSERTED.Id;`;

    return dbUtils.runQuery(q_insertAccount)
      .then((result) => result)
      .catch((error) => new Error(error));

  },

  /**
   * Updates the given account with the given name and/or status
   * @param { object } account
   * @param { number } user_id
   * @returns { Promise } of 'Success' | Error
   */
  updateAccount(account, user_id) {

    let q_updateAccount = `UPDATE account SET name = "${account.name}", active = ${account.active} WHERE id = ${account.id} AND user_id = ${user_id};`;

    return dbUtils.runQuery(q_updateAccount)
      .then(() => 'Success')
      .catch((error) => new Error(error));

  },

  /**
   * Deletes the given account for the given user 
   * @param { number } account_id 
   * @returns { Promise } of 'Success' | Error
   */
  deleteAccount(account_id, user_id) {

    let q_deleteAccount = `DELETE FROM account WHERE id = ${account_id} AND user_id = ${user_id};`;

    return dbUtils.runQuery(q_deleteAccount)
      .then(() => 'Success')
      .catch((error) => new Error(error));

  }

}