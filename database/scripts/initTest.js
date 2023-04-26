/**
 * Initialises the tables in the database if they don't exist and inserts initial data
 * Intended for recreating a test environment
 */
const init = require('../utils/init');
const testData = require('./data/testData');

init.init(testData);