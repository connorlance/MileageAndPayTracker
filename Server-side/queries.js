const pool = require("./db_connection.js");

function insertDailyInfoForm(date, mileageStart, mileageEnd, pay, company, callback) {
  pool.query("INSERT INTO mileage_and_pay (date, mileage_start, mileage_end, pay, company) VALUES (?, ?, ?, ?, ?)", [date, mileageStart, mileageEnd, pay, company], callback);
}

module.exports = {
  insertDailyInfoForm,
};
