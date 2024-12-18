import mongoose from "mongoose";
import dotenv from "dotenv";
import Station from "./src/models/Station.js";

dotenv.config();

// Melbourne and surrounding areas EV charging stations
const melbourneStations = [
  {
    name: "Melbourne CBD ChargeHub",
    address: "200 Spencer Street, Melbourne CBD",
    location: {
      type: "Point",
      coordinates: [144.9558, -37.8183], // Melbourne CBD
    },
    status: "Available",
    ports: [
      { type: "Type 2", power: 22, status: "Available" },
      { type: "CCS", power: 50, status: "Available" },
    ],
    pricing: {
      perKwh: 0.35,
      parkingFee: 2.0,
    },
  },
  {
    name: "South Melbourne Market",
    address: "322-326 Coventry St, South Melbourne",
    location: {
      type: "Point",
      coordinates: [144.9589, -37.8307], // South Melbourne
    },
    status: "Available",
    ports: [
      { type: "Type 2", power: 22, status: "Available" },
      { type: "CCS", power: 150, status: "Available" },
    ],
    pricing: {
      perKwh: 0.4,
      parkingFee: 0,
    },
  },
  {
    name: "St Kilda Beach Station",
    address: "The Esplanade, St Kilda",
    location: {
      type: "Point",
      coordinates: [144.968, -37.8675], // St Kilda
    },
    status: "Available",
    ports: [
      { type: "Type 2", power: 11, status: "Available" },
      { type: "CCS", power: 50, status: "Available" },
    ],
    pricing: {
      perKwh: 0.38,
      parkingFee: 1.5,
    },
  },
  {
    name: "Richmond Fast Charger",
    address: "Swan Street, Richmond",
    location: {
      type: "Point",
      coordinates: [144.9977, -37.8235], // Richmond
    },
    status: "Available",
    ports: [
      { type: "CCS", power: 350, status: "Available" },
      { type: "CHAdeMO", power: 50, status: "Available" },
    ],
    pricing: {
      perKwh: 0.45,
      parkingFee: 3.0,
    },
  },
  {
    name: "Docklands Waterfront",
    address: "Harbour Esplanade, Docklands",
    location: {
      type: "Point",
      coordinates: [144.9462, -37.8183], // Docklands
    },
    status: "Available",
    ports: [
      { type: "Type 2", power: 22, status: "Available" },
      { type: "CCS", power: 150, status: "Available" },
    ],
    pricing: {
      perKwh: 0.42,
      parkingFee: 2.5,
    },
  },
  {
    name: "Crown Casino Complex",
    address: "8 Whiteman Street, Southbank",
    location: {
      type: "Point",
      coordinates: [144.9571, -37.8223], // Crown Casino
    },
    status: "Available",
    ports: [
      { type: "Type 2", power: 22, status: "Available" },
      { type: "CCS", power: 50, status: "Available" },
    ],
    pricing: {
      perKwh: 0.37,
      parkingFee: 2.0,
    },
  },
];

async function setupDatabase() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully");

    // Drop existing collection and indexes
    console.log("Dropping existing collection...");
    await Station.collection.drop().catch((err) => {
      if (err.code !== 26) console.error("Drop error:", err);
    });
    console.log("Collection dropped");

    // Create geospatial index
    console.log("Creating geospatial index...");
    await Station.collection.createIndex({ location: "2dsphere" });
    console.log("Geospatial index created");

    // Insert test stations
    console.log("Inserting Melbourne stations...");
    const insertedStations = await Station.insertMany(melbourneStations);
    console.log(`Inserted ${insertedStations.length} stations successfully`);

    // Test geospatial query
    console.log("\nTesting geospatial query...");
    const melbourneCBD = [144.9558, -37.8183]; // Melbourne CBD coordinates
    const nearbyStations = await Station.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: melbourneCBD,
          },
          $maxDistance: 5000, // 5km radius
        },
      },
    });

    // Log results
    console.log(
      `Found ${nearbyStations.length} stations within 5km of Melbourne CBD:`
    );
    nearbyStations.forEach((station) => {
      const distance = calculateDistance(
        melbourneCBD[1],
        melbourneCBD[0],
        station.location.coordinates[1],
        station.location.coordinates[0]
      );
      console.log(`- ${station.name} (${distance.toFixed(2)}km away)`);
    });

    console.log("\nDatabase setup completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
}

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

setupDatabase();
