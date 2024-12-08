// db.js (example structure)

const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'safemind',
});

module.exports = {
  query: (sql, values, callback) => {
    pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(sql, values, (err, results) => {
          connection.release(); // Release the connection back to the pool
          callback(err, results);
        });
      }
    });
  },
};
