const express = require("express");
const router = express.Router();
const customMiddleware = require("../middlewares/customMiddleware.js");
const homeControllers = require("../controllers/homeControllers");

//Route: index
router.get("/", homeControllers.getIndex);

//Route: interval sorted data
router.get("/sort/:type", homeControllers.getIntervalSortedData);

//Route: daily info form
router.post("/dailyInfoForm", customMiddleware.validateDailyInfoForm, homeControllers.postDailyInfoForm);

//Route: mileage_and_pay rows
router.get("/mapRows", homeControllers.getMapRows);

//Route: Delete MAP row by ID
router.delete("/deleteRow/:id", homeControllers.deleteRow);

module.exports = router;
