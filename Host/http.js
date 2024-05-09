const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws"); // Import WebSocket library
const handlePostRequest_DailyInfo = require("./insertDailyInfo");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    const indexPath = path.join(__dirname, "../Client/index.html");
    fs.readFile(indexPath, (err, data) => {
      if (err) {
        console.error("Error reading index.html:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else if (req.method === "GET" && req.url === "/script.js") {
    const scriptPath = path.join(__dirname, "../Client/script.js");
    fs.readFile(scriptPath, (err, data) => {
      if (err) {
        console.error("Error reading script.js:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(data);
      }
    });
  } else if (req.method === "GET" && req.url === "/styles.css") {
    const stylePath = path.join(__dirname, "../Client/styles.css");
    fs.readFile(stylePath, (err, data) => {
      if (err) {
        console.error("Error reading styles.css:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
      }
    });
  } else if (req.method === "POST" && req.url === "/submitDailyInfo") {
    handlePostRequest_DailyInfo(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("404 Not Found");
  }
});

const wss = new WebSocket.Server({ server }); // Create a WebSocket server

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  // WebSocket message event handling
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    // You can handle WebSocket messages here
    ws.send("Received: " + message); // Echo the received message back to the client
  });

  // WebSocket close event handling
  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
