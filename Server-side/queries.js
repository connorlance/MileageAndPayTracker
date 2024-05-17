const pool = require("./db_connection.js");

function insert_mileage_and_pay(date, mileageStart, mileageEnd, pay, company, callback) {
  const total_miles = mileageEnd - mileageStart;

  pool.query(
    "INSERT INTO mileage_and_pay (mileage_start, mileage_end, total_miles, pay, company, date) VALUES (?,?,?,?,?,CAST(? AS DATETIME))",
    [mileageStart, mileageEnd, total_miles, pay, company, date],
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

function insert_total_avg_calculation(period, start_date, end_date, total_miles, total_pay, avg_per_mile, callback) {
  pool.query(
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
    }
  );
}

function update_total_avg_calculation(period, start_date, total_miles, total_pay, avg_per_mile, callback) {
  pool.query(
    "UPDATE total_avg_calculation SET total_miles = ?, total_pay = ?, avg_per_mile = ? WHERE period = ? AND start_date = ?",
    [total_miles, total_pay, avg_per_mile, period, start_date],
    (err, data) => {
      if (err) {
        console.error("Error update_total_avg_calculation query:", err);
      } else {
        console.log("update_total_avg_calculation Query results:", data);
      }
      if (callback) {
        callback(err, data);
      }
    }
  );
}

function daily_total_avg_calculation() {
  pool.query("SELECT MAX(date) AS max_date FROM mileage_and_pay", (err, results) => {
    if (err) {
      console.error("Error getting max date:", err);
    } else {
      const maxDate = results[0].max_date;
      console.log("Max date:", maxDate);

      pool.query("SELECT * FROM mileage_and_pay WHERE date = ?", [maxDate], (error, innerResults) => {
        if (error) {
          console.error("Error executing inner query:", error);
          throw error;
        }

        console.log("Inner query results:", innerResults);

        if (innerResults.length > 0) {
          console.log("Results length first reached");
          let period = "daily";
          let startDate = innerResults[0].date;
          let endDate = startDate;
          let totalMiles = 0;
          let totalPay = 0;

          innerResults.forEach((row) => {
            console.log("for each reached.");
            totalMiles += row.total_miles; // Assuming total_miles is the correct property name
            totalPay += parseFloat(row.pay); // Convert pay to a number before adding
          });

          let avgPerMile = totalPay / totalMiles;
          console.log("Avg per mile:", avgPerMile);

          if (innerResults.length === 1) {
            console.log("Insert reached");
            insert_total_avg_calculation(period, startDate, endDate, totalMiles, totalPay, avgPerMile);
          } else {
            console.log("Update reached");
            update_total_avg_calculation(period, startDate, totalMiles, totalPay, avgPerMile);
          }
        } else {
          console.log("No results found for the date:", maxDate);
        }
      });
    }
  });
}

function weekly_total_avg_calculation() {}

function monthly_total_avg_calculation() {}

function yearly_total_avg_calculation() {}

module.exports = {
  insert_mileage_and_pay,
  insert_per_company_total_avg_calculation,
  insert_total_avg_calculation,
  daily_total_avg_calculation,
};
