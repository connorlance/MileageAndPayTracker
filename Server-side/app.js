const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../Client-side/views"));
app.use(express.static(path.join(__dirname, "../public")));
app.listen(3000);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/options", (req, res) => {
  res.render("options");
});

app.use((req, res) => {
  res.status(404).render("404");
});
