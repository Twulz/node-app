const knex = require('knex');

const formatDate = (d) => moment(d).format('YYYY-MM-DD');

class Database {

    /**
    Constructor of Database Object
    @param { Object } config: Knex database configuration 
    */
    constructor(config) {
      this.knex = knex({
        client: 'mysql',
        connection: config
      })
    }

    /**
    Creates all tables required for the Node-App
    @returns { Promise } of string | Error
    @example 'Success' | Error
    */
    createSchema() {
        return this.knex.schema
            .dropTableIfExists('authentication')
            .createTable('authentication', tb => {
                tb.increments('auth_id')
                tb.string('username').notNullable()
                tb.specificType('password', 'CHAR(60)').notNullable()
                tb.boolean('app_access').notNullable().defaultTo('false')
            })
            .then(() => 'Success')
    }

    /**
    Destroys all tables used in the Node-App
    @returns { Promise } of 'Success' | Error
    @example 'Success' | Error
    */
    destroySchema() {
        return this.knex.schema
          .dropTableIfExists('authentication')
          .then(() => 'Success')
    }

    /**
    Creates database schema - TODO: enables insert of sample data for development
    @returns { Promise } of 'Success' | Error
    @example 'Success' | Error
    */
    initDatabase() {
        return this.createSchema()
            .then(() => 'Success')
    }

    /**
    Registers a new user with the given username and password
    @param { string } username: The username (email address) of the user
    @param { CHAR(60) } password: A salted hash generated from the user's inputted password
    @returns { Promise } of 'Success' | Error
    */
    registerUser(username, password) {
        return this.knex('authentication')
            .insert({ 
                'username': username,
                'password': password })
            .then(() => 'Success')
    }

    /**
    Gets the salted hash representing the given username's password
    @param { string } username: The username (email address) of the user
    @returns { CHAR(60) } password: A salted hash generated from the user's inputted password
    */
    getUserAuthData(username) {
        return this.knex
            .select('password')
            .from('authentication')
            .where('username', username)
            .first()
            .then((result) => {return result.password})
    }
}

module.exports = Database;