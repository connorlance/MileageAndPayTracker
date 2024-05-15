//Import modules
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
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

//Route: index
app.get("/", (req, res) => {
  res.render("index");
});

//Middleware: daily info form input validation
const validateDailyInfoForm = [
  body("date").toDate().isISO8601(),
  body("mileageStart").toFloat().isNumeric(),
  body("mileageEnd").toFloat().isNumeric(),
  body("pay").toFloat().isNumeric(),
  body("company")
    .trim()
    .customSanitizer((value) => value.replace(/[<>&$%?.*;'"`\\/]/g, "")),
];

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

  /*Insert form data into database */
  query.insertDailyInfoForm(formData.date, formData.mileageStart, formData.mileageEnd, formData.pay, formData.company);
});

//Route: options
app.get("/options", (req, res) => {
  res.render("options");
});

//Route: 404
app.use((req, res) => {
  res.status(404).render("404");
});
