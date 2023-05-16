const dbUtils = require('../utils/utils');

module.exports = {

  /**
   * Create a transaction with the given parameters
   * @param { object } transaction
   * @param { number } user_id
   * @returns { Promise } of 'Success' | Error
   */
  createTransaction(transaction, user_id) {

    let date = transaction.date == null ? new Date().toISOString().slice(0, 19).replace('T', ' ') : transaction.date;
    let notes = transaction.notes == null ? '' : transaction.notes;

    let q_insertTransaction = `INSERT INTO transaction (user_id, account_id, category_id, payee_id, date, amount, cleared, notes) VALUES (` +
      user_id + `,` +
      transaction.account_id + `,` +
      transaction.category_id + `,` +
      (transaction.payee_id == null ? 'NULL,' : + transaction.payee_id + `,`) +
      `"${date}",` +
      transaction.amount + `,` +
      (transaction.cleared == null ? 'TRUE,' : transaction.cleared + `,`) +
      `"${notes}");`;

    return dbUtils.runQuery(q_insertTransaction)
      .catch(error => new Error(error));

  },

  /**
   * Create transactions with the given parameters
   * @param { object } transactions
   * @returns { Promise } of 'Success' | Error
   */
  createTransactions(transactions) {

    let q_insertTransaction = `INSERT INTO transaction (user_id, account_id, category_id, payee_id, date, amount, cleared, notes) VALUES `;

    transactions.forEach((transaction, index) => {
      q_insertTransaction += `(
        ${transaction.user_id},
        ${transaction.account_id},
        ${transaction.category_id},
        ${transaction.payee_id == null ? 'NULL' : transaction.payee_id},
        "${transaction.date}",
        ${transaction.amount},
        ${transaction.cleared == null ? 'TRUE' : transaction.cleared},
        "${transaction.notes}"
      )`;
      q_insertTransaction += index == transactions.length-1 ? ";" : ",";
    });      

    return dbUtils.runQuery(q_insertTransaction)
      .catch(error => new Error(error));

  },

  /**
   * Update a transaction with the given parameters
   * @param { number } transaction_id 
   * @param { number } account_id 
   * @param { number } category_id 
   * @param { number } payee_id 
   * @param { date } date 
   * @param { decimal } amount 
   * @param { boolean } cleared 
   * @param { string } notes 
   */
  updateTransaction(transaction_id, account_id, category_id, payee_id, date, amount, cleared, notes) {

    let q_updateTransaction = `UPDATE transaction LET account_id=` + account_id + `,category_id=` + category_id + `,payee_id=` + payee_id + `,date=` + date
      + `,amount=` + amount + `,cleared=` + cleared + `,notes="` + notes + `" WHERE id=` + transaction_id + `;`;

    return dbUtils.runQuery(q_updateTransaction)
      .catch(error => new Error(error));

  },

  /**
   * Insert a month's budget amount for the given category.
   * @param { number } category_id 
   * @param { decimal } amount 
   * @param { date } date 
   */
  insertBudgetMonth (category_id, amount, date) {

    let q_insertBudgetMonth = `INSERT INTO budget (category_id, amount, date) VALUES (` + category_id + `,` + amount + `,` + date + `);`;

    return dbUtils.runQuery(q_insertBudgetMonth)
      .catch(error => new Error(error));

  },

  /**
   * Update a month's budget amount for the given category
   * @param { number } budget_id 
   * @param { number } category_id 
   * @param { decimal } amount 
   * @param { date } date 
   */
  updateBudgetMonth(budget_id, category_id, amount, date) {

    let q_updateBudgetMonth = `UPDATE budget SET category_id=` + category_id + `,amount=` + amount + `,date=` + date + ` WHERE id=` + budget_id;

    return dbUtils.runQuery(q_updateBudgetMonth)
      .catch(error => new Error(error));

  },

  /**
   * Get all the transactions for a given user
   * @param { number } user_id 
   */
  getAllTransactions(user_id) {

    let q_getTransactions =
      `SELECT 
        date, 
        amount, 
        notes, 
        cleared, 
        category.name AS category_name, 
        account.name AS account_name, 
        payee.name AS payee_name 
      FROM transaction 
      INNER JOIN category ON transaction.category_id = category.id 
      INNER JOIN account ON transaction.account_id = account.id 
      LEFT JOIN account AS payee ON transaction.payee_id = payee.id 
      WHERE transaction.user_id = ${user_id}
      ORDER BY date DESC`;

    return dbUtils.runQuery(q_getTransactions)
      .catch(error => new Error(error));
  },

}