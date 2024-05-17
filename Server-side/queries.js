const pool = require("./db_connection.js");
const moment = require("moment");

//INSERT ROW INTO 'mileage_and_pay'
function insert_mileage_and_pay(date, mileage_start, mileage_end, pay, company, callback) {
  const total_miles = mileage_end - mileage_start;

  pool.query(
    "INSERT INTO mileage_and_pay (mileage_start, mileage_end, total_miles, pay, company, date) VALUES (?,?,?,?,?,CAST(? AS DATETIME))",
    [mileage_start, mileage_end, total_miles, pay, company, date],
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

// CALCULATE DAILY
function daily_total_avg_calculation() {
  pool.query("SELECT MAX(date) AS max_date FROM mileage_and_pay", (err, results) => {
    if (err) {
      console.error("Error getting max date:", err);
    } else {
      const max_date = results[0].max_date;

      pool.query("SELECT * FROM mileage_and_pay WHERE date = ?", [max_date], (error, innerResults) => {
        if (error) {
          console.error("Error executing inner query:", error);
          throw error;
        }

        if (innerResults.length > 0) {
          let period = "daily";
          let start_date = innerResults[0].date;
          let end_date = start_date;
          let total_miles = 0;
          let total_pay = 0;

          innerResults.forEach((row) => {
            total_miles += row.total_miles;
            total_pay += parseFloat(row.pay);
          });

          let avg_per_mile = total_miles !== 0 ? total_pay / total_miles : 0;

          if (innerResults.length === 1) {
            insert_total_avg_calculation(period, start_date, end_date, total_miles, total_pay, avg_per_mile);
          } else {
            total_pay;
            update_total_avg_calculation(period, start_date, total_miles, total_pay, avg_per_mile);
          }
        } else {
          console.log("No results found for the date:", max_date);
        }
      });
    }
  });
}

//CALCULATE WEEKLY
function weekly_total_avg_calculation() {
  pool.query("SELECT MAX(date) AS max_date FROM mileage_and_pay", (err, results) => {
    if (err) {
      console.error("Error getting max date:", err);
    } else {
      const max_date = results[0].max_date;
      const start_date = moment(max_date).startOf("week").toDate();
      const end_date = moment(max_date).endOf("week").toDate();

      pool.query("SELECT * FROM mileage_and_pay WHERE date BETWEEN ? AND ?", [start_date, end_date], (err, innerResults) => {
        if (err) {
          console.error("Error fetching weekly data from database:", err);
        } else {
          if (innerResults.length > 0) {
            let period = "weekly";
            let total_miles = 0;
            let total_pay = 0;

            innerResults.forEach((row) => {
              total_miles += row.total_miles;
              console.log("here is total miles", total_miles);
              total_pay += parseFloat(row.pay);
            });

            let avg_per_mile = total_miles !== 0 ? total_pay / total_miles : 0;

            if (innerResults.length === 1) {
              insert_total_avg_calculation(period, start_date, end_date, total_miles, total_pay, avg_per_mile);
            } else {
              update_total_avg_calculation(period, start_date, total_miles, total_pay, avg_per_mile);
            }
          } else {
            console.log("No results found for the week starting from:", start_date);
          }
        }
      });
    }
  });
}

//CALCULATE MONTHLY
function monthly_total_avg_calculation() {}

//CALCULATE YEARLY
function yearly_total_avg_calculation() {}

//INSERT ROW INTO 'total_avg_calculation'
function insert_total_avg_calculation(period, start_date, end_date, total_miles, total_pay, avg_per_mile) {
  pool.query(
    "INSERT INTO total_avg_calculation (period, start_date, end_date, total_miles, total_pay, avg_per_mile) VALUES (?, ?, ?, ?, ?, ?)",
    [period, start_date, end_date, total_miles, total_pay, avg_per_mile],
    (err, data) => {
      if (err) {
        console.error("Error insert_total_avg_calculation query:", err);
      } else {
        console.log("insert_total_avg_calculation Query results:", data);
      }
    }
  );
}

//UPDATE ROW IN 'total_avg_calculation'
function update_total_avg_calculation(period, start_date, total_miles, total_pay, avg_per_mile) {
  pool.query(
    "UPDATE total_avg_calculation SET total_miles = ?, total_pay = ?, avg_per_mile = ? WHERE period = ? AND start_date = ?",
    [total_miles, total_pay, avg_per_mile, period, start_date],
    (err, data) => {
      if (err) {
        console.error("Error update_total_avg_calculation query:", err);
      } else {
        console.log("update_total_avg_calculation Query results:", data);
      }
    }
  );
}

//NOT COMPLETE
function insert_per_company_total_avg_calculation(company, period, start_date, end_date, total_miles, total_pay, avg_per_mile, callback) {
  pool.query(
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
    }
  );
}

module.exports = {
  insert_mileage_and_pay,
  insert_per_company_total_avg_calculation,
  insert_total_avg_calculation,
  daily_total_avg_calculation,
  weekly_total_avg_calculation,
};
