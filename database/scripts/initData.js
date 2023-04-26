/**
 * Initialises the tables in the database if they don't exist and inserts initial data
 * Intended for creating a new production environment with sample data
 */
const init = require('../utils/init');
const initData = require('./data/initData');

init.init(initData);