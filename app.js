//Import modules
const express = require("express");
const path = require("path");

const defaultMiddlewareRouter = require("./middlewares/defaultMiddleware");

const homeRoutes = require("./routes/homeRoutes");
const optionsRoutes = require("./routes/optionsRoutes");

//Create express app
const app = express();

//Configure view engine and views directory
app.set("view engine", "ejs");

//Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

//Start server
app.listen(3000);

// Use the default middleware router
app.use("/", defaultMiddlewareRouter);

//main routes
app.use(homeRoutes);

//api routes
app.use(optionsRoutes);

//Route: 404
app.use((req, res) => {
  res.status(404).render("404");
});
