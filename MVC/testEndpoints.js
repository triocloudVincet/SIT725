import fetch from "node-fetch";

async function testEndpoints() {
  try {
    // Test station search endpoint
    console.log("\nTesting station search...");
    const searchResponse = await fetch(
      "http://localhost:5001/api/stations/search?latitude=-37.8136&longitude=144.9631&radius=10"
    );

    if (!searchResponse.ok) {
      throw new Error(`HTTP error! status: ${searchResponse.status}`);
    }

    const stations = await searchResponse.json();
    console.log(`Found ${stations.length} stations nearby`);
    console.log("First station:", stations[0]?.name);

    // Test route calculation
    console.log("\nTesting route calculation...");
    const routeResponse = await fetch(
      "http://localhost:5001/api/routes/calculate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: { address: "Melbourne CBD" },
          end: { address: "Brighton" },
        }),
      }
    );

    if (!routeResponse.ok) {
      throw new Error(`HTTP error! status: ${routeResponse.status}`);
    }

    const route = await routeResponse.json();
    console.log("Route calculation:", route);

    console.log("\nAll endpoint tests completed successfully");
  } catch (error) {
    console.error("Error testing endpoints:", error);
    console.error("Error details:", error.message);
  }
}

// Run the tests
testEndpoints();
