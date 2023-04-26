const dbUtils = require('../utils/utils');

module.exports = {

  destroyBudgetDatabase() {

    let q_dropTableBudget = `DROP TABLE IF EXISTS budget;`;
    let q_dropTableTransaction = `DROP TABLE IF EXISTS transaction;`;
    let q_dropTableCategory = `DROP TABLE IF EXISTS category;`;
    let q_dropTableAccount = `DROP TABLE IF EXISTS account;`;

    return dbUtils.runQuery(q_dropTableBudget + q_dropTableTransaction + q_dropTableCategory + q_dropTableAccount)
      .then(() => '---destroyBudgetDatabase Drop Success')
      .catch((error) => new Error(error));
  },

  initBudgetDatabase() {

    let q_createTableAccount = `
      CREATE TABLE IF NOT EXISTS account (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        active BOOLEAN NOT NULL DEFAULT 1,
        user_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES user(id)
      );`
    let q_createTableCategory = `
      CREATE TABLE IF NOT EXISTS category (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        active BOOLEAN NOT NULL DEFAULT 1,
        user_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES user(id)
      );`
    let q_createTableTransaction = `
      CREATE TABLE IF NOT EXISTS transaction (
        id INT NOT NULL AUTO_INCREMENT,
        date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        notes VARCHAR(255),
        amount DECIMAL(19,2) NOT NULL,
        cleared BOOLEAN NOT NULL DEFAULT 0,
        user_id INT NOT NULL,
        payee_id INT,
        category_id INT NOT NULL,
        account_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES user(id),
        FOREIGN KEY (payee_id) REFERENCES account(id),
        FOREIGN KEY (category_id) REFERENCES category(id),
        FOREIGN KEY (account_id) REFERENCES account(id)
      );`
    let q_createTableBudget = `
      CREATE TABLE IF NOT EXISTS budget (
        id INT NOT NULL AUTO_INCREMENT,
        amount DECIMAL(19,2) NOT NULL DEFAULT 0,
        date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        category_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (category_id) REFERENCES category(id)
      );`
    let createQuery =
      q_createTableAccount +
      q_createTableCategory +
      q_createTableTransaction +
      q_createTableBudget;

    return dbUtils.runQuery(createQuery)
      .then(() => '---initBudgetDatabase Create Success')
      .catch((error) => new Error(error));

  },
}