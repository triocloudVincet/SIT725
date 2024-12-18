import { jest } from "@jest/globals";
import RouteService from "../../src/services/routeService.js";
import Station from "../../src/models/Station.js";

jest.mock("../../src/models/Station.js");

describe("RouteService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("calculateRoute", () => {
    it("should calculate route between points", async () => {
      // Set up test data
      const start = { lat: -37.8136, lng: 144.9631 };
      const end = { lat: -37.8236, lng: 144.9731 };

      const mockStations = [
        {
          name: "Test Station",
          location: { coordinates: [144.9681, -37.8186] },
        },
      ];

      // Mock the Station.find method
      Station.find.mockResolvedValue(mockStations);

      // Calculate route
      const route = await RouteService.calculateRoute(start, end);

      // Verify the result
      expect(route).toHaveProperty("totalDistance");
      expect(route).toHaveProperty("totalTime");
      expect(route).toHaveProperty("chargingStops");
      expect(Array.isArray(route.chargingStops)).toBe(true);
    });

    it("should handle routes with no charging stops needed", async () => {
      const start = { lat: -37.8136, lng: 144.9631 };
      const end = { lat: -37.8236, lng: 144.9731 };

      // Mock empty stations result
      Station.find.mockResolvedValue([]);

      const route = await RouteService.calculateRoute(start, end);

      expect(route.chargingStops).toHaveLength(0);
    });

    it("should calculate correct distance", () => {
      const start = { lat: -37.8136, lng: 144.9631 };
      const end = { lat: -37.8236, lng: 144.9731 };

      const result = RouteService.calculateDistance(
        start.lat,
        start.lng,
        end.lat,
        end.lng
      );

      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThan(0);
    });

    it("should handle database errors", async () => {
      Station.find.mockRejectedValue(new Error("Database error"));

      const start = { lat: -37.8136, lng: 144.9631 };
      const end = { lat: -37.8236, lng: 144.9731 };

      await expect(async () => {
        await RouteService.calculateRoute(start, end);
      }).rejects.toThrow("Error calculating route: Database error");
    });
  });
});
