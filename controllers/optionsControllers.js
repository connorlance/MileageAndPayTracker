const query = require("../models/queries.js");
const { validationResult } = require("express-validator");

//Controller: options
const getOptions = (req, res) => {
  res.render("options");
};

//Controller: company Insert form
const createCompany = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { insertCompany } = req.body;

  query.create_per_company_total_avg_calculation(insertCompany, (err, data) => {
    if (err) {
      console.error("Error creating company:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json({ success: true });
  });
};

//Controller: send company names to the client
const getCompanyNames = (req, res) => {
  query.getCompanyNames((err, companyNames) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ companyNames });
    }
  });
};

//Controller: remove company name
const removeCompany = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { companyName } = req.body;

  query.removeCompany(companyName, (err, data) => {
    if (err) {
      console.error("Error removing company:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json({ success: true });
  });
};

module.exports = {
  getOptions,
  createCompany,
  getCompanyNames,
  removeCompany,
};
