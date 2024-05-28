const express = require("express");
const favicon = require("serve-favicon");
const multer = require("multer");
const morgan = require("morgan");
const path = require("path");

const router = express.Router();

//favicon
const faviconPath = path.join(__dirname, "../public/favicon.ico");
router.use(favicon(faviconPath));

//Configure multer for handling form data
const upload = multer();
router.use(upload.none());

//logging
router.use(morgan("dev"));

//json
router.use(express.json());

module.exports = router;
