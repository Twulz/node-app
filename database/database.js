/**
 * All database functions
 */

const { query } = require('express');
let mysql = require('mysql');
require('dotenv').config({path: './.env'});
const dbURL = process.env['DB_URL'];
let pool = mysql.createPool(dbURL);

/* Converts the mysql pool query function into a Promise function */
function runQuery(query) {

    return new Promise(function (resolve, reject) {
        pool.getConnection((error, connection) => {
            if (error) reject(error);
            connection.query(query, (error, result) => {
                if (error) reject(error);
                else {
                    connection.release();
                    resolve(result);
                }
            });
        });
    });
    
}

function runQueryValues(query, values) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((error, connection) => {
            if (error) reject(error);
            let sql = connection.query(query, [values], (error, result) => {
                console.log(sql.query);
                if (error) reject(error);
                else resolve(result);
            })
        })
    })
}

/* converts an array of JSON user data into values that can be inserted */
function sensorType_JSONtoValueString(data) {
    
    let values = '';

    for (let i=0; i< data.length; i++) {
        if (i!=0) values += ",";
        values += "(\"";
        values += data[i].name + "\"";
        values += ")";
    }
    return values;

}

/* converts an array of JSON user data into values that can be inserted */
function sensor_JSONtoValueString(data) {
    
    let values = '';

    for (let i=0; i< data.length; i++) {
        if (i!=0) values += ",";
        values += "(\"";
        values += data[i].name + "\",";
        values += data[i].sensor_type_id;
        values += ")";
    }

    return values;

}

/* converts an array of JSON user data into values that can be inserted */
function user_JSONtoValueString(data) {
    
    let values = '';

    for (let i=0; i< data.length; i++) {
        if (i!=0) values += ",";
        values += "(\"";
        values += data[i].username + "\",\"";
        values += data[i].password + "\"";
        if (data[i].app_access) values += "," + data[i].app_access
        values += ")";
    }

    return values;

}

let db = module.exports = {

    /****************************************************************
     * AUTH FUNCTIONS
     */

    /** 
     * Creates the user table in the database
     * @param { object } data: JSON data to insert into the database
     * @returns { Promise } of 'Success' | Error
     */
    destroyUserDatabase: () => {

        let q_dropTableUser = `DROP TABLE IF EXISTS user;`;

        return runQuery(q_dropTableUser)
            .then(() => '---destroyUserDatabase Drop Success')
            .catch((error) => new Error(error));

    },

    /** 
     * Creates the user table in the database
     * @param { object } data: JSON data to insert into the database
     * @returns { Promise } of 'Success' | Error
     */
    initUserDatabase: (data) => {

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

        return runQuery(q_createTableUser)
            .then((result) => {
                console.log('---initUserDatabase Create Success');
                // Insert given data
                if (data && data.user) return runQuery(q_insertUser_full);
            })
            .then(() => '---initUserDatabase Insert Success')
            .catch((error) => new Error(error));

    },

    /**
     * Registers a new user with the given username and password
     * @param { string } username: The username (email address) of the user
     * @param { CHAR(60) } password: A salted hash generated from the user's inputted password
     * @returns { Promise } of 'Success' | Error
     */
    registerUser: (username, password) => {

        let q_insertUser = `INSERT INTO user (username, password) VALUES ("` + username + `","` + password + `");`;

        return runQuery(q_insertUser)
            .then((result) => 'Success')
            .catch((error) => new Error(error));

    },

    /** 
     * Deletes the given user from the database
     * @param { string } username: The username (email address) of the user
     * @returns { Promise } of 'Success' | Error
     */
    deleteUser: (username) => {

        let q_deleteUser = `DELETE FROM user WHERE username = "` + username + `"`;

        return runQuery(q_deleteUser)
            .then((result) => 'Success')
            .catch((error) => new Error(error));

    },

    /**
     * Gets the salted hash representing the given username's password
     * @param { string } username: The username (email address) of the user
     * @returns { CHAR(60) } password: A salted hash generated from the user's inputted password
     */
    getHashedPassword: (username) => {

        let query = `SELECT password FROM user WHERE username = "` + username + `"`;

        return runQuery(query)
            .then((result) => {
                if (result[0]) {
                    return result[0].password;
                } else { 
                    return null; 
                }})
            .catch((error) => new Error(error));

    },

    /**
     * Returns user details: id and app access
     * @param { string } username: The username (email address) of the user
     * @returns { object } userDetails: { user_id: integer, app_access: boolean }
     */
    getUserAuthData: (username) => {

        let query = `SELECT id, app_access FROM user WHERE username = "` + username + `"`;

        return runQuery(query)
            .then((result) => {
                if (result[0]) {
                    return result[0];
                } else {
                    throw new Error('User not found');
                }
            })
            .catch((error) => new Error(error));

    },

    /****************************************************************
     * BUDGET FUNCTIONS
     */

    destroyBudgetDatabase: () => {

        let q_dropTableBudget = `DROP TABLE IF EXISTS budget;`;
        let q_dropTableTransaction = `DROP TABLE IF EXISTS transaction;`;
        let q_dropTableCategory = `DROP TABLE IF EXISTS category;`;
        let q_dropTableAccount = `DROP TABLE IF EXISTS account;`;

        return runQuery(q_dropTableBudget + q_dropTableTransaction + q_dropTableCategory + q_dropTableAccount)
            .then(() => '---destroyBudgetDatabase Drop Success')
            .catch((error) => new Error(error));
    },

    initBudgetDatabase: () => {

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

        return runQuery(createQuery)
            .then(() => '---initBudgetDatabase Create Success')
            .catch((error) => new Error(error));

    },

    /**
     * Creates an account for the given user 
     * @param { string } account_name: The name of the account
     * @param { number } user_id: The user id of the user creating the account
     * @returns { Promise } of 'Success' | Error
     */
    createAccount: (account_name, user_id) => {

        let q_insertAccount = `INSERT INTO account (name, user_id) VALUES ("` + account_name + `",` + user_id + `);`;

        return runQuery(q_insertAccount)
            .then(() => 'Success')
            .catch((error) => new Error(error));

    },

    /**
     * Updates the given account with the given name and/or status
     * @param { number } account_id 
     * @param { string } account_name 
     * @param { boolean } active 
     * @returns { Promise } of 'Success' | Error
     */
    updateAccount(account_id, account_name, active) {

        let q_updateAccount = `UPDATE account SET name = "` + account_name + `", active = ` + active ` WHERE id = ` + account_id + `;`;

        return runQuery(q_updateAccount)
            .then(() => 'Success')
            .catch((error) => new Error(error));

    },

    /**
     * Creates a category for the given user
     * @param { string } category_name 
     * @param { number } user_id 
     * @returns { Promise } of 'Success' | Error
     */
    createCategory: (category_name, user_id) => {

        let q_insertCategory = `INSERT INTO category SET name = "` + category_name + `" WHERE id = ` + user_id + `;`;

        return runQuery(q_insertCategory)
            .then(() => 'Success')
            .catch((error) => new Error(error));

    },

    /**
     * Update the given category to the given name
     * @param { number } category_id 
     * @param { string } category_name 
     * @returns { Promise } of 'Success' | Error
     */
    updateCategory: (category_id, category_name) => {

        let q_updateCategory = `UPDATE category SET name = "` + category_name + `" WHERE id = ` + category_id + `;`;

        return runQuery(q_updateCategory)
            .then(() => 'Success')
            .catch((error) => new Error(error));

    },

    /**
     * Create a transaction with the given parameters
     * @param { object } transaction
     * @param { number } user_id
     * @returns { Promise } of 'Success' | Error
     */
    createTransaction: (transaction, user_id) => {

        let q_insertTransaction = `INSERT INTO transaction (user_id, account_id, category_id, payee_id, date, amount, cleared, notes) VALUES (` +
            transaction.user_id + `,` +
            transaction.account_id + `,` +
            transaction.category_id + `,` +
            transaction.payee_id + `,` +
            transaction.date + `,` +
            transaction.amount + `,` +
            transaction.cleared + `,"` +
            transaction.notes + `");`;
    
        return runQuery(q_insertTransaction)
            .then(() => 'Success')
            .catch((error) => new Error(error));

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

        return runQuery(q_updateTransaction)
            .then(() => 'Success')
            .catch((error) => new Error(error));

    },

    /**
     * Insert a month's budget amount for the given category.
     * @param { number } category_id 
     * @param { decimal } amount 
     * @param { date } date 
     */
    insertBudgetMonth: (category_id, amount, date) => {

        let q_insertBudgetMonth = `INSERT INTO budget (category_id, amount, date) VALUES (` + category_id + `,` + amount + `,` + date + `);`;

        return runQuery(q_insertBudgetMonth)
            .then(() => 'Success')
            .catch((error) => new Error(error));

    },

    /**
     * Update a month's budget amount for the given category
     * @param { number } budget_id 
     * @param { number } category_id 
     * @param { decimal } amount 
     * @param { date } date 
     */
    updateBudgetMonth: (budget_id, category_id, amount, date) => {

        let q_updateBudgetMonth = `UPDATE budget SET category_id=` + category_id + `,amount=` + amount + `,date=` + date + ` WHERE id=` + budget_id;

        return runQuery(q_updateBudgetMonth)
            .then(() => 'Success')
            .catch((error) => new Error(error));
        
    },

    /**
     * Get all the transactions for a given user
     * @param { number } user_id 
     */
    getAllTransactions: (user_id) => {

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
            LEFT JOIN account AS payee ON transaction.payee_id = account.id 
            WHERE transaction.user_id = ${user_id}`;
        console.log(user_id);
        console.log(q_getTransactions);

        return runQuery(q_getTransactions)
            .then((result) => {
                console.log(result);
                return result
            })
            .catch((error) => new Error(error));
    },

    /****************************************************************
     * SENSOR FUNCTIONS
     */

    destroySensorDatabase: () => {

        let q_dropTableSensorData = 'DROP TABLE IF EXISTS sensor_data;';
        let q_dropTableSensor = 'DROP TABLE IF EXISTS sensor;';
        let q_dropTableSensorType = 'DROP TABLE IF EXISTS sensor_type;';

        return runQuery(q_dropTableSensorData + q_dropTableSensor + q_dropTableSensorType)
            .then(() => '---destroySensorDatabase Drop Success')
            .catch((error) => new Error(error));

    },

    initSensorDatabase: (data) => {

        let q_createSensorTypeTable = `
            CREATE TABLE IF NOT EXISTS sensor_type (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                PRIMARY KEY (id)
            );`;
        let q_createSensorTable = `
            CREATE TABLE IF NOT EXISTS sensor (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                sensor_type_id INT NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (sensor_type_id) REFERENCES sensor_type(id)
            );`;
        let q_createSensorDataTable = `
            CREATE TABLE IF NOT EXISTS sensor_data (
                id INT NOT NULL AUTO_INCREMENT,
                created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                sensor_id INT NOT NULL,
                value INT NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (sensor_id) REFERENCES sensor(id)
            );`;

        let q_insertSensorType = `INSERT INTO sensor_type (name) VALUES `;
        let q_insertSensor = `INSERT INTO sensor (name, sensor_type_id) VALUES `;

        let insertSensorTypeQuery = '';
        let insertSensorQuery = '';

        if (data && data.sensor_type) insertSensorTypeQuery = q_insertSensorType + sensorType_JSONtoValueString(data.sensor_type);
        if (data && data.sensor) insertSensorQuery = q_insertSensor + sensor_JSONtoValueString(data.sensor);
        
        return runQuery(q_createSensorTypeTable + q_createSensorTable + q_createSensorDataTable)
            .then((result) => {
                console.log('---initSensorDatabase Create Success');
                if (data && data.sensor_type) return runQuery(insertSensorTypeQuery);
            })
            .then((result) => {
                console.log('---initSensorDatabase Insert Sensor Type Success');
                if (data && data.sensor) return runQuery(insertSensorQuery);
            })
            .then((result) => {
                console.log('---initSensorDatabase Insert Sensor Success');
            })
            .then(() => 'Success')
            .catch((error) => new Error(error));

    },

    insertSensorType: (name) => {

        let query = `INSERT INTO sensor_type (name) VALUES('` + name + `');`;

        return runQuery(query)
            .then(() => 'Success')
            .catch((error) => new Error(error));

    },

    insertSensor: (name, sensor_type_id) => {

        let query = `INSERT INTO sensor (name, sensor_type_id) VALUES('` + name + `', ` + sensor_type_id + `);`;

        return runQuery(query)
            .then(() => 'Success')
            .catch((error) => new Error(error));

    },

    insertSensorData: (sensor_id, value) => {

        let query = `INSERT INTO sensor_data (sensor_id, value) VALUES (` + sensor_id + ',' + value + ');';

        return runQuery(query)
            .then(() => 'Success')
            .catch((error) => new Error(error));

    },

    cleanInit: (data) => {
        db.destroySensorDatabase()
            .then((result) => {
                console.log(result);
                return db.destroyBudgetDatabase()
            })
            .then((result) => {
                console.log(result);
                return db.destroyUserDatabase();
            })
            .then ((result) => {
                console.log(result);
                return db.initUserDatabase(data);
            })
            .then((result) => {
                console.log(result);
                return db.initBudgetDatabase()
            })
            .then((result) => {
                console.log(result);
                return db.initSensorDatabase(data);
            })
            .then((result) => {
                console.log(result);
                process.exit();
            })
            .catch((error) => {
                console.log(error);
                process.exit(1);
            });
    }

}