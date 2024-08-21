const query = require("../models/queries.js");

// Controller: index
const getIndex = (req, res) => {
  query.getCompanyNames((err, companyNames) => {
    if (err) {
      console.error("Error getting company names:", err);
      return;
    }
    renderIndex(companyNames);
  });
  const renderIndex = (companyNames) => {
    res.render("index", { companyNames });
  };
};

module.exports = {
  getIndex,
};
