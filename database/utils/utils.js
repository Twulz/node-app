let mysql = require('mysql');
if (process.env['NODE_ENV'] !== 'production') {
  require('dotenv').config({ path: './.env' });
}
const dbURL = process.env['NODE_ENV'] === 'test' ? process.env['DB_TEST_URL'] : process.env['DB_URL'];
let pool = mysql.createPool(dbURL);

module.exports = {

  /* Converts the mysql pool query function into a Promise function */
  runQuery(query) {
    return new Promise(function (resolve, reject) {
      pool.getConnection((error, connection) => {
        if (error) reject(error);
        connection.query(query, (error, result) => {
          pool.releaseConnection(connection);
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    });
  },

  /* Converts the mysql pool query function into a Promise function, including passing values */
  runQueryValues(query, values) {
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
  },
}