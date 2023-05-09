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
      .then(result => {
        return result
      })
      .catch(error => new Error(error));
  },

  /**
   * Creates an account for the given user 
   * @param { string } account_name: The name of the account
   * @param { number } user_id: The user id of the user creating the account
   * @returns { Promise } of 'Success' | Error
   */
  createAccount(account_name, user_id) {

    let q_insertAccount = `INSERT INTO account (name, user_id) VALUES ("` + account_name + `",` + user_id + `);`;

    return dbUtils.runQuery(q_insertAccount)
      .catch(error => new Error(error));

  },

  /**
   * Creates an account for the given user 
   * @param { object } account: Account data in the form
   * let accounts = [
   *  [name1, user_id1], 
   *  [name2, user_id2]
   *];
   * @returns { Promise } of 'Success' | Error
   */
  createAccounts(accounts) {

    let q_insertAccounts = `INSERT INTO account (name, user_id) VALUES ?;`;
    let values = [];
    accounts.forEach(account => {
      values.push([
        account.name,
        account.user_id
      ]);
    });

    return dbUtils.runQueryValues(q_insertAccounts, values)
      .catch(error => new Error(error));

  },

  /**
   * Updates the given account with the given name and/or status
   * @param { object } account
   * @param { number } user_id
   * @returns { Promise } of 'Success' | Error
   */
  updateAccount(account, user_id) {

    let q_updateAccount = `UPDATE account SET`;
    if (account.name) {
      q_updateAccount += ` name = "${account.name}"`
    }
    if (account.active) {
      q_updateAccount += (q_updateAccount.slice(-1)==`"`) ? ', ' : '';
      q_updateAccount += ` active = ${account.active}`
    }

    q_updateAccount += ` WHERE id = ${account.id} AND user_id = ${user_id};`;

    return dbUtils.runQuery(q_updateAccount)
      .catch(error => new Error(error));

  },

  /**
   * Deletes the given account for the given user 
   * @param { number } account_id 
   * @returns { Promise } of 'Success' | Error
   */
  deleteAccount(account_id, user_id) {

    let q_deleteAccount = `DELETE FROM account WHERE id = ${account_id} AND user_id = ${user_id};`;

    return dbUtils.runQuery(q_deleteAccount)
      .catch(error => new Error(error));

  }

}