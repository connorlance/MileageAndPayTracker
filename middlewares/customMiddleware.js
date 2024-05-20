const { body } = require("express-validator");

// Middleware for validating the daily info form input
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

// Middleware for trimming and validating only letters for a field
const validateTrimLetters = (fieldName) => [
  body(fieldName)
    .trim()
    .matches(/^[a-zA-Z\s]*$/, "i"),
];

module.exports = {
  validateDailyInfoForm,
  validateTrimLetters,
};
