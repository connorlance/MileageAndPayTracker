const pool = require("./db_connection.js");

function insert_mileage_and_pay(date, mileageStart, mileageEnd, pay, company, callback) {
  const total_miles = mileageEnd - mileageStart;

  pool.query(
    "INSERT INTO mileage_and_pay (date, mileage_start, mileage_end, total_miles, pay, company) VALUES (?, ?, ?, ?, ?, ?)",
    [date, mileageStart, mileageEnd, total_miles, pay, company],
    (err, data) => {
      if (err) {
        console.error("Error insert_mileage_and_pay query:", err);
      } else {
        console.log("insert_mileage_and_pay Query results:", data);
      }
      if (callback) {
        callback(err, data);
      }
    }
  );
}

function insert_per_company_total_avg_calculation(company, period, start_date, end_date, total_miles, total_pay, avg_per_mile, callback) {
  "INSERT INTO total_avg_calculation (company, period, start_date, end_date, total_miles, total_pay, avg_per_mile) VALUES (?, ?, ?, ?, ?, ?)",
    [company, period, start_date, end_date, total_miles, total_pay, avg_per_mile],
    (err, data) => {
      if (err) {
        console.error("Error insert_per_company_total_avg_calculation query:", err);
      } else {
        console.log("insert_per_company_total_avg_calculation Query results:", data);
      }
      if (callback) {
        callback(err, data);
      }
    };
}

function insert_total_avg_calculation(period, start_date, end_date, total_miles, total_pay, avg_per_mile, callback) {
  "INSERT INTO total_avg_calculation (period, start_date, end_date, total_miles, total_pay, avg_per_mile) VALUES (?, ?, ?, ?, ?, ?)",
    [period, start_date, end_date, total_miles, total_pay, avg_per_mile],
    (err, data) => {
      if (err) {
        console.error("Error insert_total_avg_calculation query:", err);
      } else {
        console.log("insert_total_avg_calculation Query results:", data);
      }
      if (callback) {
        callback(err, data);
      }
    };
}

module.exports = {
  insert_mileage_and_pay,
  insert_per_company_total_avg_calculation,
  insert_total_avg_calculation,
};
