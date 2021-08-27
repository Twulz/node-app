/**
 * Initialises the tables in the database if they don't exist and inserts initial data
 * Intended for recreating a test environment
 */

const db = require('./database.js');
const initData = require('./initData');

db.cleanInit(initData);