// File: server.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Store port numbers to try
const ports = [3000, 3001, 3002, 8080, 8081];
let currentPortIndex = 0;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.json());

// GET method for addition
app.get("/add/:num1/:num2", (req, res) => {
  const num1 = parseFloat(req.params.num1);
  const num2 = parseFloat(req.params.num2);

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: "Invalid numbers provided" });
  }

  const result = num1 + num2;
  res.json({ result: result });
});

// POST method for calculator operations
app.post("/calculate", (req, res) => {
  const { operation, num1, num2 } = req.body;

  if (!operation || isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  let result;
  switch (operation) {
    case "add":
      result = num1 + num2;
      break;
    case "subtract":
      result = num1 - num2;
      break;
    case "multiply":
      result = num1 * num2;
      break;
    case "divide":
      if (num2 === 0) {
        return res.status(400).json({ error: "Cannot divide by zero" });
      }
      result = num1 / num2;
      break;
    default:
      return res.status(400).json({ error: "Invalid operation" });
  }

  res.json({ result: result });
});

// Basic route for testing
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Function to try starting the server on different ports
function tryPort() {
  if (currentPortIndex >= ports.length) {
    console.error("No available ports found");
    process.exit(1);
    return;
  }

  const port = ports[currentPortIndex];
  app
    .listen(port)
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${port} is busy, trying next port...`);
        currentPortIndex++;
        tryPort();
      } else {
        console.error("Other error occurred:", err);
      }
    })
    .on("listening", () => {
      console.log(`Calculator server running at http://localhost:${port}`);
    });
}

// Start the server
tryPort();
