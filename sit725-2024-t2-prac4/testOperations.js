// testOperations.js
const connectDB = require("./src/database/connection");
const StationService = require("./src/services/stationService");

async function testDatabaseOperations() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Connected to database successfully");

    // Clear any existing test data
    console.log("Clearing existing test data...");
    await StationService.clearTestData();

    // Test data
    const stationData = {
      name: "Test EV Station",
      address: "123 Test Street, Test City",
      location: {
        type: "Point",
        coordinates: [144.9631, -37.8136], // Melbourne coordinates
      },
      ports: [
        {
          type: "Type 2",
          power: 22,
          status: "Available",
        },
      ],
      pricing: {
        perKwh: 0.35,
        parkingFee: 2.0,
      },
    };

    console.log(
      "\nCreating test station with data:",
      JSON.stringify(stationData, null, 2)
    );
    const newStation = await StationService.createStation(stationData);
    console.log("\nCreated test station:", JSON.stringify(newStation, null, 2));

    console.log("\nFinding nearby stations...");
    const nearbyStations = await StationService.findNearbyStations([
      144.9631, -37.8136,
    ]);
    console.log(`Found ${nearbyStations.length} nearby stations`);

    console.log("\nUpdating station status...");
    const updatedStation = await StationService.updateStationStatus(
      newStation._id,
      "Occupied"
    );
    console.log("Updated station status:", updatedStation.status);

    // Clean up
    console.log("\nCleaning up test data...");
    await StationService.clearTestData();

    console.log("\nAll database operations completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("\nTest failed:", error);
    // Try to clean up even if test fails
    try {
      await StationService.clearTestData();
    } catch (cleanupError) {
      console.error("Error during cleanup:", cleanupError);
    }
    process.exit(1);
  }
}

testDatabaseOperations();
