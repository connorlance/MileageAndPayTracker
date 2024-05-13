const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  //set the server filepath based on teh requested url
  let filePath = "./Client/";
  switch (req.url) {
    case "/":
      filePath += "index.html";
      res.statusCode = 200;
      break;
    case "/styles.css":
      filePath += "/styles.css";
      res.statusCode = 200;
      break;
    case "/script.js":
      filePath += "/script.js";
      res.statusCode = 200;
      break;
    default:
      filePath += "404.html";
      res.statusCode = 404;
      break;
  }

  //set the content type based on requested url extension.
  const contentType = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
  };

  const extension = path.extname(filePath);
  const contentTypeHeader = contentType[extension] || "text/html";
  res.setHeader("Content-Type", contentTypeHeader);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.end(data);
    }
  });
});

server.listen(3000, "localhost", () => {
  console.log("listening for requests on port 3000");
});
