//Import modules
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const moment = require("moment");
const query = require("./queries.js");

//Create express app
const app = express();

//Configure view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../Client-side/views"));

//Configure multer for handling form data
const upload = multer();
app.use(upload.none());

//Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

//Start server
app.listen(3000);

//Middleware: logging
app.use(morgan("dev"));

//Middleware: json
app.use(express.json());

//Middleware: daily info form input validation
const validateDailyInfoForm = [
  body("date").toDate().isISO8601(),
  body("mileageStart").toFloat().isNumeric(),
  body("mileageEnd").toFloat().isNumeric(),
  body("pay").toFloat().isNumeric(),
  body("company")
    .trim()
    .customSanitizer((value) => value.replace(/[<>&$%?.*;'"`\\/]/g, "")),
  body("insertCompany")
    .trim()
    .matches(/^[a-zA-Z\s]*$/, "i"),
];

const validateTrimLetters = (fieldName) => [
  body(fieldName)
    .trim()
    .matches(/^[a-zA-Z\s]*$/, "i"),
];

//Route: index
app.get("/", (req, res) => {
  res.render("index");
});

//Route: daily info form
app.post("/dailyInfoForm", validateDailyInfoForm, (req, res) => {
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

//Route: options
app.get("/options", (req, res) => {
  res.render("options");
});

// Route: company Insert form
app.post("/createCompany", validateTrimLetters("insertCompany"), (req, res) => {
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
app.get("/companyNames", (req, res) => {
  query.getCompanyNames((err, companyNames) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ companyNames });
    }
  });
});

//Route: remove company name
app.delete("/removeCompany", validateTrimLetters("companyName"), (req, res) => {
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

//Route: 404
app.use((req, res) => {
  res.status(404).render("404");
});
