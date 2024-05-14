const path = require("path");
const express = require("express");
const multer = require("multer");
const morgan = require("morgan");
const query = require("./queries.js");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../Client-side/views"));

const upload = multer();
app.use(upload.none());

app.listen(3000);
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/dailyInfoForm", (req, res) => {
  const formData = req.body;
  console.log(formData);
  console.log("Form data recieved succesfuly");

  query.insertDailyInfoForm(req.body.date, req.body.mileageStart, req.body.mileageEnd, req.body.pay, req.body.company, (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
    } else {
      console.log("Query results:", data);
    }
  });
});

app.get("/options", (req, res) => {
  res.render("options");
});
app.use((req, res) => {
  res.status(404).render("404");
});
