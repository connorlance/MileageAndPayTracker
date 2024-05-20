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

//CALCULATE DAILY, WEEKLY, MONTHLY, YEARLY
function calculateTotalAvg() {
  const periods = ["daily", "weekly", "monthly", "yearly"];

  const periodMap = {
    daily: { unit: "day", format: "YYYY-MM-DD" },
    weekly: { unit: "week", format: "YYYY-MM-DD" },
    monthly: { unit: "month", format: "YYYY-MM" },
    yearly: { unit: "year", format: "YYYY" },
  };

  const max_date_query = "SELECT MAX(date) AS max_date FROM mileage_and_pay";

  pool.query(max_date_query, (err, results) => {
    if (err) {
      console.error("Error getting max date:", err);
      return;
    }

    const max_date = moment(results[0].max_date);

    periods.forEach((period) => {
      const { unit, format } = periodMap[period];
      const start_date = moment(max_date).startOf(unit).toDate();
      const end_date = moment(max_date).endOf(unit).toDate();

      const query = "SELECT * FROM mileage_and_pay WHERE date BETWEEN ? AND ?";
      pool.query(query, [start_date, end_date], (err, innerResults) => {
        if (err) {
          console.error(`Error fetching ${period} data from database:`, err);
          return;
        }

        if (innerResults.length > 0) {
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
            update_total_avg_calculation(period, start_date, total_miles, total_pay, avg_per_mile);
          }
        } else {
          console.log(`No results found for the ${period} period.`);
        }
      });
    });
  });
}

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

//create new per_company_total_avg_calculation table
function create_per_company_total_avg_calculation(companyName, callback) {
  const tableName = `${companyName}_total_avg_calculation`;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      ID int(11) NOT NULL AUTO_INCREMENT,
      period enum('daily','weekly','monthly','yearly') NOT NULL,
      start_date date NOT NULL,
      end_date date NOT NULL,
      total_miles int(11) NOT NULL,
      total_pay decimal(10,2) NOT NULL,
      avg_per_mile decimal(10,2) NOT NULL,
      PRIMARY KEY (ID)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `;

  // Insert company name into company_names table
  const insertCompanyQuery = `
    INSERT IGNORE INTO company_names (company_name) VALUES (?);
  `;

  pool.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
      callback(err, false);
    } else {
      console.log(`Table ${tableName} created successfully.`);
      // Execute the insert company query
      pool.query(insertCompanyQuery, [companyName], (err, result) => {
        if (err) {
          console.error("Error inserting company name:", err);
          callback(err, false);
        } else {
          console.log(`Company ${companyName} inserted into company_names table.`);
          callback(null, true);
        }
      });
    }
  });
}

// Function to get company names from the company_names table
function getCompanyNames(callback) {
  const query = "SELECT company_name FROM company_names";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching company names:", err);
      callback(err, null);
    } else {
      const companyNames = results.map((row) => row.company_name);
      callback(null, companyNames);
    }
  });
}

// Function to remove company table and company name from company_names table
function removeCompany(companyName, callback) {
  console.log(companyName);
  const tableName = `${companyName}_total_avg_calculation`;

  const dropTableQuery = `
    DROP TABLE IF EXISTS ${tableName};
  `;

  const deleteCompanyQuery = `
    DELETE FROM company_names WHERE company_name = '${companyName}';
  `;

  pool.query(dropTableQuery, (err, data) => {
    if (err) {
      console.error("Error dropping table:", err);
      callback(err, false);
    } else {
      console.log(`Table ${tableName} dropped successfully.`);
      // Execute delete company query
      pool.query(deleteCompanyQuery, (err, data) => {
        if (err) {
          console.error("Error deleting company:", err);
          callback(err, false);
        } else {
          console.log(`Company ${companyName} deleted from company_names table.`);
          callback(null, true);
        }
      });
    }
  });
}

module.exports = {
  insert_mileage_and_pay,
  calculateTotalAvg,
  insert_total_avg_calculation,
  create_per_company_total_avg_calculation,
  getCompanyNames,
  removeCompany,
};
