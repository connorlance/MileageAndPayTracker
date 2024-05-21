const express = require("express");
const router = express.Router();
const customMiddleware = require("../middlewares/customMiddleware.js");
const optionsControllers = require("../controllers/optionsControllers");

//Route: options
router.get("/options", optionsControllers.getOptions);

// Route: company Insert form
router.post("/createCompany", customMiddleware.validateTrimLetters("insertCompany"), optionsControllers.createCompany);

// Route: send company names to the client
router.get("/companyNames", optionsControllers.getCompanyNames);

//Route: remove company name
router.delete("/removeCompany", customMiddleware.validateTrimLetters("companyName"), optionsControllers.removeCompany);

module.exports = router;
