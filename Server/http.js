const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();

app.listen(3000);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Client/index.html"));
});
app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "../Client/styles.css"));
});
app.get("/script.js", (req, res) => {
  res.sendFile(path.join(__dirname, "../Client/script.js"));
});
