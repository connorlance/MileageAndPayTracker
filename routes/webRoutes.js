const express = require("express");
const router = express.Router();
const webControllers = require("../controllers/webControllers");

// Route: index
router.get("/", webControllers.getIndex);

module.exports = router;
