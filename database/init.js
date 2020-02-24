const Database = require('./database');
//const sample = require('./sample');
require('dotenv').config({path: './.env'});
const dbURL = process.env['DB_URL'];

const db = new Database(dbURL);

/**
Initialises the database with all of the tables required for the node-app
@returns { Promise } of string | Error
*/
const initialise = async () => {
  await db.initDatabase();
  process.exit();
}

initialise();