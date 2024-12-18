import express from "express";
import Station from "../models/Station.js";

const router = express.Router();

router.post("/calculate", async (req, res) => {
  try {
    const { start, end } = req.body;

    console.log("Route calculation request:", { start, end });

    // Find stations near the route
    const stations = await Station.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [start.lng, start.lat],
          },
          $maxDistance: 50000, // 50km radius from start point
        },
      },
    });

    // Calculate route distance (using Haversine formula)
    const totalDistance = calculateDistance(
      start.lat,
      start.lng,
      end.lat,
      end.lng
    );

    // Calculate estimated driving time (assuming average speed of 60km/h)
    const drivingHours = totalDistance / 60;
    const drivingMinutes = Math.round((drivingHours % 1) * 60);
    const totalTime = `${Math.floor(drivingHours)}h ${drivingMinutes}min`;

    // Select charging stops based on distance
    const chargingStops = [];
    if (totalDistance > 200) {
      // If route is longer than 200km
      // Add charging stops every ~150km
      const numberOfStops = Math.floor(totalDistance / 150);
      for (let i = 0; i < numberOfStops && i < stations.length; i++) {
        chargingStops.push({
          station: stations[i].name,
          location: stations[i].location,
          arrivalCharge: "25%",
          chargingTime: "30 mins",
          departureCharge: "80%",
        });
      }
    }

    const route = {
      id: Date.now(),
      totalDistance: `${Math.round(totalDistance)} km`,
      totalTime: totalTime,
      chargingStops: chargingStops,
      startLocation: start,
      endLocation: end,
    };

    console.log("Calculated route:", route);
    res.json(route);
  } catch (error) {
    console.error("Route calculation error:", error);
    res.status(500).json({
      error: "Error calculating route",
      details: error.message,
    });
  }
});

// Helper function to calculate distance in kilometers
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
