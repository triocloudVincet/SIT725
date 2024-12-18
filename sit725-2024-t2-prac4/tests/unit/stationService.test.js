import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Station from "../../src/models/Station.js";

describe("Station Tests", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Station.deleteMany({});
  });

  test("create & save station successfully", async () => {
    const validStation = {
      name: "Melbourne CBD ChargeHub",
      address: "200 Spencer Street, Melbourne CBD",
      location: {
        type: "Point",
        coordinates: [144.9558, -37.8183],
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
    };

    const station = new Station(validStation);
    const savedStation = await station.save();

    expect(savedStation._id).toBeDefined();
    expect(savedStation.name).toBe(validStation.name);
    expect(savedStation.location.coordinates).toEqual(
      expect.arrayContaining([144.9558, -37.8183])
    );
  });

  test("find nearby stations", async () => {
    const testStation = {
      name: "Test Station",
      address: "Test Address",
      location: {
        type: "Point",
        coordinates: [144.9558, -37.8183],
      },
      status: "Available",
      ports: [{ type: "Type 2", power: 22, status: "Available" }],
      pricing: {
        perKwh: 0.35,
        parkingFee: 0,
      },
    };

    await Station.create(testStation);

    const nearbyStations = await Station.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [144.9558, -37.8183],
          },
          $maxDistance: 5000,
        },
      },
    });

    expect(nearbyStations).toHaveLength(1);
    expect(nearbyStations[0].name).toBe("Test Station");
  });

  test("invalid station data", async () => {
    const invalidStation = {
      name: "Invalid Station",
      // Missing required fields
    };

    let error;
    try {
      const station = new Station(invalidStation);
      await station.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");
  });
});
