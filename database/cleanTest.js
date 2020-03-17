const Database = require('./database');
require('dotenv').config({path: './.env'});
const dbURL = process.env['DB_URL'];

const db = new Database(dbURL);

/**
 * To remove the test authentication user after testing
 * @returns { Promise } of string | Error
 */
const cleanup = async () => {
  await db.deleteUser('testuser@email.com');
  process.exit();
}

cleanup();