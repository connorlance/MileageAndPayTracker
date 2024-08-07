const query = require("../models/queries.js");
const { validationResult } = require("express-validator");
const moment = require("moment");

//Controller: index
const getIndex = (req, res) => {
  query.getCompanyNames((err, companyNames) => {
    if (err) {
      console.error("Error getting company names:", err);
      return;
    }
    renderIndex(companyNames);
  });
  const renderIndex = (companyNames) => {
    res.render("index", { companyNames });
  };
};

//Controller: get interval sorted data
const getIntervalSortedData = (req, res) => {
  const type = req.params.type;

  const queryMap = {
    daily: query.getDailyData,
    weekly: query.getWeeklyData,
    monthly: query.getMonthlyData,
    yearly: query.getYearlyData,
  };

  const getDataFunction = queryMap[type];

  if (!getDataFunction) {
    return res.status(400).send("Invalid type parameter");
  }

  getDataFunction((err, data) => {
    if (err) {
      console.error(`Error fetching ${type} data:`, err);
      return res.status(500).send("Internal Server Error");
    }
    console.log(`Fetched data for ${type}:`, data);
    res.render("partials/intervalSortedData", { data, type });
  });
};

//Controller: daily info form
const postDailyInfoForm = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const formData = req.body;

  let dateWithOffset = moment.utc(formData.date).format();
  query.insert_mileage_and_pay(dateWithOffset, formData.mileageStart, formData.mileageEnd, formData.pay, formData.company, (err, data) => {
    if (err) {
      console.error("Error inserting mileage and pay:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    query.calculateTotalAvg();
    res.status(200).json({ success: true });
  });
};

// Controller: mileage_and_pay rows
const getMapRows = (req, res) => {
  const company = req.query.company || "all";

  if (company === "all") {
    query.getAllMapRows((err, results) => {
      if (err) {
        console.error("Error fetching all map rows:", err);
        return res.status(500).send("Internal Server Error");
      }
      console.log("Fetched all map rows:", results);
      if (results.length === 0) {
        console.log("No rows returned for 'All' query");
      }
      res.render("partials/mapRows", { data: results });
    });
  } else {
    query.getMapRowsByCompany(company, (err, results) => {
      if (err) {
        console.error("Error fetching map rows by company:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.render("partials/mapRows", { data: results });
    });
  }
};

module.exports = {
  getIndex,
  getIntervalSortedData,
  postDailyInfoForm,
  getMapRows,
};
