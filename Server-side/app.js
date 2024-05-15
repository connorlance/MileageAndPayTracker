//Import modules
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const moment = require("moment-timezone");
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

//Middleware: daily info form input validation
const validateForm = [
  body("date").toDate().isISO8601(),
  body("mileageStart").toFloat().isNumeric(),
  body("mileageEnd").toFloat().isNumeric(),
  body("pay").toFloat().isNumeric(),
  body("company")
    .trim()
    .customSanitizer((value) => value.replace(/[<>&$%?.*;'"`\\/]/g, "")),
];

//Route: index
app.get("/", (req, res) => {
  res.render("index");
});

//Route: daily info form
app.post("/dailyInfoForm", validateForm, (req, res) => {
  /*Check for validation errors*/
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  /*Process form data */
  const formData = req.body;
  formData.date = moment.utc(formData.date).format("YYYY-MM-DD");
  console.log(formData);

  /*Insert form data into database */
  query.insert_mileage_and_pay(formData.date, formData.mileageStart, formData.mileageEnd, formData.pay, formData.company);

  query.daily_total_avg_calculation();
});

//Route: options
app.get("/options", (req, res) => {
  res.render("options");
});

//Route: 404
app.use((req, res) => {
  res.status(404).render("404");
});
