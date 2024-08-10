const express = require("express");
const router = express.Router();
const webControllers = require("../controllers/webControllers");

// Route: index
router.get("/", webControllers.getIndex);

// Route: options
router.get("/options", webControllers.getOptions);

module.exports = router;
