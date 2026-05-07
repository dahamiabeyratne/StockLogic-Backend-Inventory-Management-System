const mysql = require('mysql2');

// We create a pool for better performance and resource management
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Anuththara123',
  database: 'stocklogic_db',
  waitForConnections: true,
  connectionLimit: 10
});

// We export the promise-based version so we can use modern 'async/await' syntax
module.exports = pool.promise();