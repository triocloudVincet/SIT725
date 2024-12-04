const API_URL = "http://localhost:5001/api";

export const api = {
  async getStations(radius, lat, lng) {
    try {
      console.log("API Call - Fetching stations with params:", {
        radius,
        lat,
        lng,
      });

      const response = await fetch(
        `${API_URL}/stations/search?latitude=${lat}&longitude=${lng}&radius=${radius}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch stations");
      }

      const data = await response.json();
      console.log("API Response - Stations:", data);
      return data;
    } catch (error) {
      console.error("Error fetching stations:", error);
      throw error;
    }
  },

  async calculateRoute(startLocation, endLocation) {
    try {
      console.log("API Call - Calculate route:", {
        startLocation,
        endLocation,
      });

      const response = await fetch(`${API_URL}/routes/calculate`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: startLocation,
          end: endLocation,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to calculate route");
      }

      const data = await response.json();
      console.log("API Response - Route:", data);
      return data;
    } catch (error) {
      console.error("Error calculating route:", error);
      throw error;
    }
  },

  async testConnection() {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      console.log("API health check:", data);
      return true;
    } catch (error) {
      console.error("API health check failed:", error);
      return false;
    }
  },
};
