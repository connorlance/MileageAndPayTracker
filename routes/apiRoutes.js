const express = require("express");
const router = express.Router();
const customMiddleware = require("../middlewares/customMiddleware.js");
const apiControllers = require("../controllers/apiControllers");

// Route: interval sorted data
router.get("/sort/:type", apiControllers.getIntervalSortedData);

// Route: daily info form
router.post("/dailyInfoForm", customMiddleware.validateDailyInfoForm, apiControllers.postDailyInfoForm);

// Route: mileage_and_pay rows
router.get("/mapRows", apiControllers.getMapRows);

// Route: Update Map Rows Sort Buttons
router.get("/mapRowsButtons", apiControllers.getMapRowsButtons);

// Route: Delete MAP row by ID
router.delete("/deleteRow/:id", apiControllers.deleteRow);

// Route: company Insert form
router.post("/createCompany", customMiddleware.validateTrimLetters("insertCompany"), apiControllers.createCompany);

// Route: send company names to the client
router.get("/companyNames", apiControllers.getCompanyNames);

// Route: remove company name
router.delete("/removeCompany", customMiddleware.validateTrimLetters("companyName"), apiControllers.removeCompany);

module.exports = router;
