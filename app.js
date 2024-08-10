//Import modules
const express = require("express");
const path = require("path");

const defaultMiddlewareRouter = require("./middlewares/defaultMiddleware");

const webRoutes = require("./routes/webRoutes");
const apiRoutes = require("./routes/apiRoutes");

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

//Web routes
app.use(webRoutes);

//API routes
app.use(apiRoutes);

//Route: 404
app.use((req, res) => {
  res.status(404).render("404");
});
