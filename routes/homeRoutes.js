const express = require("express");
const router = express.Router();
const customMiddleware = require("../middlewares/customMiddleware.js");
const homeControllers = require("../controllers/homeControllers");

//Route: index
router.get("/", homeControllers.getIndex);

//Route: daily info form
router.post("/dailyInfoForm", customMiddleware.validateDailyInfoForm, homeControllers.postDailyInfoForm);

module.exports = router;
