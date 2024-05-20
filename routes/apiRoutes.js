const query = require("../models/queries.js");
const { validationResult } = require("express-validator");
const moment = require("moment");
const customMiddleware = require("../middlewares/customMiddleware");

const express = require("express");
const router = express.Router();

//Route: daily info form
router.post("/dailyInfoForm", customMiddleware.validateDailyInfoForm, (req, res) => {
  /*Check for validation errors*/
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  /*Process form data */
  const formData = req.body;
  console.log(formData);
  console.log("Received date:", formData.date);

  /*Insert form data into database */
  let dateWithOffset = moment.utc(formData.date).format();
  query.insert_mileage_and_pay(dateWithOffset, formData.mileageStart, formData.mileageEnd, formData.pay, formData.company, (err, data) => {
    if (err) {
      console.error("Error inserting mileage and pay:", err);
    } else {
      query.calculateTotalAvg();
    }
  });
});

// Route: company Insert form
router.post("/createCompany", customMiddleware.validateTrimLetters("insertCompany"), (req, res) => {
  /* Check for validation errors */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  /* Process form data */
  const { insertCompany } = req.body;

  /* Insert form data into database */
  query.create_per_company_total_avg_calculation(insertCompany, (err, data) => {
    if (err) {
      console.error("Error creating company:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json({ success: true });
  });
});

// Route: send company names to the client
router.get("/companyNames", (req, res) => {
  query.getCompanyNames((err, companyNames) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ companyNames });
    }
  });
});

//Route: remove company name
router.delete("/removeCompany", customMiddleware.validateTrimLetters("companyName"), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  /* Process form data */
  const { companyName } = req.body;
  console.log(companyName);

  query.removeCompany(companyName, (err, data) => {
    if (err) {
      console.error("Error removing company:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json({ success: true });
  });
});

module.exports = router;
