// src/services/stationService.js
const Station = require("../models/Station");

class StationService {
  static async createStation(stationData) {
    try {
      console.log("Creating station with data:", stationData);
      // Create new station using the model
      const station = new Station(stationData);
      // Save and return the result
      const savedStation = await station.save();
      console.log("Station saved successfully:", savedStation);
      return savedStation;
    } catch (error) {
      console.error("Error in createStation:", error);
      throw new Error(`Error creating station: ${error.message}`);
    }
  }

  static async findNearbyStations(coordinates, maxDistance = 10000) {
    try {
      return await Station.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: coordinates,
            },
            $maxDistance: maxDistance,
          },
        },
      });
    } catch (error) {
      console.error("Error in findNearbyStations:", error);
      throw new Error(`Error finding nearby stations: ${error.message}`);
    }
  }

  static async updateStationStatus(stationId, status) {
    try {
      return await Station.findByIdAndUpdate(
        stationId,
        { status, lastUpdated: new Date() },
        { new: true }
      );
    } catch (error) {
      console.error("Error in updateStationStatus:", error);
      throw new Error(`Error updating station status: ${error.message}`);
    }
  }

  // Add method to clear test data
  static async clearTestData() {
    try {
      await Station.deleteMany({ name: /^Test/ });
      console.log("Test data cleared successfully");
    } catch (error) {
      console.error("Error clearing test data:", error);
      throw new Error(`Error clearing test data: ${error.message}`);
    }
  }
}

module.exports = StationService;
