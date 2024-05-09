// Handles the post request from daily info form, parses the request body, inserts data into the database, and handles errors.
function handlePostRequest_DailyInfo(req, res) {
  if (req.method === "POST" && req.url === "/submitDailyInfo") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      const data = JSON.parse(body);
      const sql = "INSERT INTO mileage_and_pay (date, mileageStart, mileageEnd, pay, company) VALUES (?,?,?,?,?)";
      const values = [data.date, data.mileageStart, data.mileageEnd, data.pay, data.company];

      pool.query(sql, values, (error, results, fields) => {
        if (error) {
          console.error("Error inserting form data:", error);
          response.writeHead(500, { "Content-Type": "application/JSON" });
          response.end(JSON.stringify({ success: false, error: "Internal Server Error" }));
        } else {
          console.log("Form data inserted successfully:", results.insertId);
          response.writeHead(200, { "Content-type": "application/json" });
          response.end(JSON.stringify({ success: true }));
        }
      });
    });
  }
}
module.exports = handlePostRequest_DailyInfo;
