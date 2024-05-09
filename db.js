const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "connor",
  password: "lance",
  database: "connor",
});

module.exports = pool;
