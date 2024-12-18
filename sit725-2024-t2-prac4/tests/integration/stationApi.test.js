import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../../src/app";

describe("Route API Integration", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("POST /api/routes/calculate", () => {
    it("should calculate route", async () => {
      const response = await request(app)
        .post("/api/routes/calculate")
        .send({
          start: { lat: -37.8136, lng: 144.9631 },
          end: { lat: -37.8236, lng: 144.9731 },
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("totalDistance");
    });
  });
});
