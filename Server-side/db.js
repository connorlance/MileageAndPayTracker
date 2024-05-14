import mysql from "mysql";

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "connor",
  password: "lance",
  database: "mileagepaycalculator",
});
