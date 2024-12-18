// testDB.js
const connectDB = require("./src/database/connection");

async function testConnection() {
  try {
    await connectDB();
    console.log("Database connection successful!");
    process.exit(0);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

testConnection();
