const express = require("express");
const multer = require("multer");
const morgan = require("morgan");

const router = express.Router();

//Configure multer for handling form data
const upload = multer();
router.use(upload.none());

//logging
router.use(morgan("dev"));

//json
router.use(express.json());

module.exports = router;
