const express = require("express");

const router = express.Router();

//Route: index
router.get("/", (req, res) => {
  res.render("index");
});

//Route: options
router.get("/options", (req, res) => {
  res.render("options");
});

module.exports = router;
