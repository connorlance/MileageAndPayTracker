const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, "../Client/index.html");
  fs.readFile(filePath, (err, contents) => {
    if (err) {
      res.writeHead(500);
      res.end(err.message);
      return;
    }

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(contents);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
