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

module.exports = {
  getIndex,
  postDailyInfoForm,
};
