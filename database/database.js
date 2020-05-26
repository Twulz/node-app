const knex = require('knex');

const formatDate = (d) => moment(d).format('YYYY-MM-DD');

class Database {

    /**
     * Constructor of Database Object
     * @param { Object } config: Knex database configuration 
     */
    constructor(config) {
      this.knex = knex({
        client: 'mysql',
        connection: config
      })
    }

    /**
     * Creates all tables required for the Node-App
     * @returns { Promise } of string | Error
     * @example 'Success' | Error
     */
    createSchema() {
        return this.knex.schema
            .dropTableIfExists('budget')
            .dropTableIfExists('transaction')
            .dropTableIfExists('category')
            .dropTableIfExists('account')
            .dropTableIfExists('user')
            .createTable('user', tb => {
                tb.increments('user_id').primary()
                tb.string('username').notNullable().unique()
                tb.specificType('password', 'CHAR(60)').notNullable()
                tb.boolean('app_access').notNullable().defaultTo('false')
            })
            .createTable('account', tb => {
                tb.increments('account_id').primary()
                tb.string('account_name').notNullable()
                tb.boolean('active').notNullable().defaultTo('true')
                tb.integer('user_id').unsigned().notNullable()
                tb.foreign('user_id').references('user.user_id')
            })
            .createTable('category', tb => {
                tb.increments('category_id').primary()
                tb.string('category_name').notNullable()
                tb.integer('user_id').unsigned().notNullable()
                tb.foreign('user_id').references('user.user_id')
            })
            .createTable('transaction', tb => {
                tb.increments('transaction_id').primary()
                tb.date('date').notNullable()
                tb.string('notes')
                tb.decimal('amount',14,2).notNullable()
                tb.boolean('cleared').notNullable().defaultTo('false')
                tb.integer('user_id').unsigned().notNullable()
                tb.integer('payee_id').unsigned()
                tb.integer('category_id').unsigned().notNullable()
                tb.integer('account_id').unsigned().notNullable()
                tb.foreign('user_id').references('user.user_id')
                tb.foreign('payee_id').references('account.account_id')
                tb.foreign('category_id').references('category.category_id')
                tb.foreign('account_id').references('account.account_id')
            })
            .createTable('budget', tb => {
                tb.increments('budget_id').primary()
                tb.decimal('amount',14,2).notNullable().defaultTo(0)
                tb.date('date').notNullable()
                tb.integer('category_id').unsigned().notNullable()
                tb.foreign('category_id').references('category.category_id')
            })
            .then(() => 'Success')
            .catch((error) => { return new Error(error); });
    }

    /**
     * Destroys all tables used in the Node-App
     * @returns { Promise } of 'Success' | Error
     * @example 'Success' | Error
     */
    destroySchema() {
        return this.knex.schema
            .dropTableIfExists('budget')
            .dropTableIfExists('transaction')
            .dropTableIfExists('category')
            .dropTableIfExists('account')
            .dropTableIfExists('user')
            .then(() => 'Success')
            .catch((error) => { return new Error(error); });
    }

    /**
     * Creates database schema
     * @returns { Promise } of 'Success' | Error
     * @example 'Success' | Error
     */
    initEmptyDatabase() {
    return this.createSchema()
        .then(() => 'Success')
        .catch((error) => { 
            console.error(error);
            throw new Error(error); 
        });
    }

    /**
     * Creates database schema - enables insert of sample data for development
     * @returns { Promise } of 'Success' | Error
     * @example 'Success' | Error
     */
    initDatabase(data) {
        return this.createSchema()
            .then(() => this.knex.insert(data.user).into('user'))
            .then(() => 'Success')
            .catch((error) => { return new Error(error); });
    }

    /**
     * Deletes the given user from the database
     * @param { string } username: The username (email address) of the user
     * @returns { Promise } of 'Success' | Error
     */
    deleteUser(username) {
        return this.knex('user')
            .where({ 'username': username })
            .del()
            .then(() => 'Success')
            .catch((error) => { return new Error(error); });
    }

    /**
     * Registers a new user with the given username and password
     * @param { string } username: The username (email address) of the user
     * @param { CHAR(60) } password: A salted hash generated from the user's inputted password
     * @returns { Promise } of 'Success' | Error
     */
    registerUser(username, password) {
        return this.knex('user')
            .insert({ 
                'username': username,
                'password': password })
            .then(() => 'Success')
            .catch((error) => { return new Error(error); });
    }

    /**
     * Gets the salted hash representing the given username's password
     * @param { string } username: The username (email address) of the user
     * @returns { CHAR(60) } password: A salted hash generated from the user's inputted password
     */
    getHashedPassword(username) {
        return this.knex
            .select('password')
            .from('user')
            .where('username', username)
            .first()
            .then((result) => {
                if (result) {
                    return result.password;
                } else { 
                    return null; 
                }})
            .catch((error) => { return new Error(error); });
    }

    /**
     * Returns user details: id and app access
     * @param { string } username: The username (email address) of the user
     * @returns { object } userDetails: { user_id: integer, app_access: boolean }
     */
    getUserAuthData(username) {
        return this.knex
            .select('user_id', 'app_access')
            .from('user')
            .where('username', username)
            .first()
            .then((userDetails) => {
                if (userDetails) {
                    return userDetails;
                } else {
                    return null;
                }})
            .catch((error) => { return new Error(error); });
    }

    /**
     * Creates an account for the given user 
     * @param { string } account_name: The name of the account
     * @param { number } user_id: The user id of the user creating the account
     * @returns { Promise } of 'Success' | Error
     */
    createAccount(account_name, user_id) {
        return this.knex('account')
            .insert({ 
                'account_name': account_name,
                'user_id': user_id })
            .then(() => 'Success')
            .catch((error) => { return new Error(error); });
    }

    /**
     * Updates the given account with the given name and/or status
     * @param { number } account_id 
     * @param { string } account_name 
     * @param { boolean } active 
     * @returns { Promise } of 'Success' | Error
     */
    updateAccount(account_id, account_name, active) {
        return this.knex('account')
            .update({
                'account_name': account_name,
                'active': active
            })
            .where('account_id', account_id)
            .then(() => 'Success')
            .catch((error) => { return new Error(error); });
    }

    /**
     * Creates a category for the given user
     * @param { string } category_name 
     * @param { number } user_id 
     * @returns { Promise } of 'Success' | Error
     */
    createCategory(category_name, user_id) {
        return this.knex('category')
            .insert({ 
                'category_name': category_name,
                'user_id': user_id 
            })
            .then(() => 'Success')
            .catch((error) => { return new Error(error); });
    }

    /**
     * Update the given category to the given name
     * @param { number } category_id 
     * @param { string } category_name 
     * @returns { Promise } of 'Success' | Error
     */
    updateCategory(category_id, category_name) {
        return this.knex('category')
            .update({
                'category_name': category_name
            })
            .where('category_id', category_id)
            .then(() => 'Success')
            .catch((error) => { return new Error(error); });
    }

    /**
     * Create a transaction with the given parameters
     * @param { object } transaction
     * @param { number } user_id
     * @returns { Promise } of 'Success' | Error
     */
    createTransaction(transaction, user_id) {
        if (transaction.date == null) 
        return this.knex('transaction')
            .insert({
                'user_id': user_id,
                'account_id': transaction.account_id,
                'category_id': transaction.category_id,
                'payee_id': transaction.payee_id,
                'date': transaction.date,
                'amount': transaction.amount,
                'cleared': transaction.cleared,
                'notes': transaction.notes
            })
            .then(() => 'Success')
            .catch((error) => { return new Error(error); });
    }

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
        return this.knex('transaction')
            .update({
                'account_id': account_id,
                'category_id': category_id,
                'payee_id': payee_id,
                'date': date,
                'amount': amount,
                'cleared': cleared,
                'notes': notes
            })
            .where('transaction_id', transaction_id)
            .then(() => 'Success')
            .catch((error) => { return new Error(error); });
    }

    /**
     * Insert a month's budget amount for the given category.
     * @param { number } category_id 
     * @param { decimal } amount 
     * @param { date } date 
     */
    insertBudgetMonth(category_id, amount, date) {
        return this.knex('budget')
            .insert({
                'category_id': category_id,
                'amount': amount,
                'date': date
            })
            .then(() => 'Success')
            .catch((error) => { return new Error(error); });
    }

    /**
     * Update a month's budget amount for the given category
     * @param { number } budget_id 
     * @param { number } category_id 
     * @param { decimal } amount 
     * @param { date } date 
     */
    updateBudgetMonth(budget_id, category_id, amount, date) {
        return this.knex('budget')
            .update({
                'category_id': category_id,
                'amonut': amount,
                'date': date
            })
            .where('budget_id', budget_id)
            .then(() => 'Success')
            .catch((error) => { return new Error(error); });
    }

    /**
     * Get all the transactions for a given user
     * @param { number } user_id 
     */
    getAllTransactions(user_id) {
        let result = this.knex('transaction')
            .select(
                'transaction.date', 
                'transaction.amount', 
                'transaction.notes', 
                'transaction.cleared', 
                'category.category_id', 
                'category.category_name', 
                'transaction.account_id as fromaccount_id', 
                'fromaccount.account_name as fromaccount_name', 
                'transaction.payee_id', 
                'payee.account_name as payee_name' )
            .from('transaction')
            .where({ 'transaction.user_id': user_id })
            .innerJoin('category', 'transaction.category_id', 'category.category_id')
            .innerJoin('account as fromaccount', 'transaction.account_id', 'fromaccount.account_id')
            .leftJoin('account as payee', 'transaction.payee_id', 'payee.account_id')
            .catch((error) => { return new Error(error); });
        return result;
    }
    
}

module.exports = Database;