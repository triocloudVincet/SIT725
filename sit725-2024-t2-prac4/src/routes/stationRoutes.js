import express from "express";
import Station from "../models/Station.js";

const router = express.Router();

// Get all stations (for testing)
router.get("/", async (req, res) => {
  try {
    const stations = await Station.find({});
    console.log(`Found ${stations.length} stations`);
    res.json(stations);
  } catch (error) {
    console.error("Error fetching stations:", error);
    res.status(500).json({ error: error.message });
  }
});

// Search stations by location with detailed error handling
router.get("/search", async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    // Validate inputs
    if (!latitude || !longitude) {
      return res.status(400).json({
        error: "Missing required parameters",
        required: ["latitude", "longitude"],
        received: { latitude, longitude },
      });
    }

    console.log("Searching with parameters:", { latitude, longitude, radius });

    // Convert radius from km to meters
    const radiusInMeters = parseInt(radius) * 1000;

    const stations = await Station.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: radiusInMeters,
        },
      },
    });

    console.log(`Found ${stations.length} stations within ${radius}km`);

    // Calculate distances
    const stationsWithDistance = stations.map((station) => {
      const stationObj = station.toObject();
      stationObj.distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        station.location.coordinates[1],
        station.location.coordinates[0]
      );
      return stationObj;
    });

    res.json(stationsWithDistance);
  } catch (error) {
    console.error("Station search error:", error);
    res.status(500).json({
      error: "Error searching stations",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

export default router;
