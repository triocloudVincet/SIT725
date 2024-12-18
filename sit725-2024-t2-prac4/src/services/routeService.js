import Station from "../models/Station.js";

class RouteService {
  async calculateRoute(start, end) {
    try {
      // Find stations near the route
      const stations = await Station.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [start.lng, start.lat],
            },
            $maxDistance: 50000, // 50km radius
          },
        },
      });

      // Calculate total distance
      const totalDistance = this.calculateDistance(
        start.lat,
        start.lng,
        end.lat,
        end.lng
      );

      // Calculate estimated time (assuming average speed of 60km/h)
      const totalTime = `${Math.floor(totalDistance / 60)}h ${Math.round(
        ((totalDistance % 60) / 60) * 60
      )}min`;

      // Determine charging stops
      const chargingStops = this.determineChargingStops(
        stations,
        totalDistance
      );

      return {
        totalDistance: `${Math.round(totalDistance)} km`,
        totalTime,
        chargingStops,
      };
    } catch (error) {
      throw new Error(`Error calculating route: ${error.message}`);
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  determineChargingStops(stations, totalDistance) {
    // Add charging stops every ~150km
    const numberOfStops = Math.floor(totalDistance / 150);
    return stations.slice(0, numberOfStops).map((station) => ({
      station: station.name,
      location: station.location,
      arrivalCharge: "25%",
      chargingTime: "30 mins",
      departureCharge: "80%",
    }));
  }
}

export default new RouteService();
