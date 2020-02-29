const Database = require('./database');
const testData = require('./testData');
require('dotenv').config({path: './.env'});
const dbURL = process.env['DB_URL'];

const db = new Database(dbURL);

/**
 * Destroy any existing instance of the tables required for the node-app
 * @returns { Promise } of string | Error
 */
const destroy = async() => {
  await db.destroySchema();
  process.exit;
}

/**
 * Initialises the database with all of the tables required for the node-app
 * @returns { Promise } of string | Error
 */
const initialise = async () => {
  await db.initDatabase(testData);
  process.exit();
}

destroy();
initialise();