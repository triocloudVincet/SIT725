// At the top of EVChargingApp.js
import React, { useState, useEffect } from "react";
import { api } from "../services/api";

// Import components - make sure paths are correct
import Navbar from "./Navigation/Navbar";
import TabSelector from "./Navigation/TabSelector";
import SearchPanel from "./Search/SearchPanel";
import RoutePlanner from "./Route/RoutePlanner";
import ErrorDisplay from "./common/ErrorDisplay";
const EVChargingApp = () => {
  // State management
  const [searchRadius, setSearchRadius] = useState(10);
  const [activeTab, setActiveTab] = useState("search");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stations, setStations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);

  // In EVChargingApp.js, add debug logging
  useEffect(() => {
    const fetchStations = async () => {
      if (!userLocation) {
        console.log("No user location available");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log("Fetching stations for location:", userLocation);
        const data = await api.getStations(
          searchRadius,
          userLocation.lat,
          userLocation.lng
        );
        console.log("Received stations:", data);
        if (!Array.isArray(data)) {
          console.error("Received invalid stations data:", data);
          return;
        }
        setStations(data);
      } catch (err) {
        console.error("Failed to fetch stations:", err);
        setError("Failed to fetch stations: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [searchRadius, userLocation]);

  // Set initial Melbourne location and test API connection
  useEffect(() => {
    const initializeApp = async () => {
      // Set default location (Melbourne CBD)
      setUserLocation({
        lat: -37.8183,
        lng: 144.9558,
      });

      // Test API connection
      try {
        const isConnected = await api.testConnection();
        console.log("API Connection:", isConnected ? "Success" : "Failed");
        if (!isConnected) {
          setError("Unable to connect to the server");
        }
      } catch (err) {
        console.error("API test failed:", err);
        setError("Server connection failed");
      }
    };

    initializeApp();
  }, []);

  // Fetch stations when radius or location changes
  useEffect(() => {
    const fetchStations = async () => {
      if (!userLocation) {
        console.log("No user location available");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log("Fetching stations for location:", userLocation);
        const data = await api.getStations(
          searchRadius,
          userLocation.lat,
          userLocation.lng
        );
        console.log("Received stations:", data);
        setStations(data);
      } catch (err) {
        console.error("Failed to fetch stations:", err);
        setError("Failed to fetch stations: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [searchRadius, userLocation]);

  // Route calculation handler
  const handleCalculateRoute = async () => {
    if (!startLocation || !endLocation) {
      setError("Please select both start and end locations on the map");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("Calculating route between:", {
        start: startLocation,
        end: endLocation,
      });

      const routeData = await api.calculateRoute(
        {
          lat: startLocation.lat,
          lng: startLocation.lng,
        },
        {
          lat: endLocation.lat,
          lng: endLocation.lng,
        }
      );

      console.log("Route calculation response:", routeData);
      setRoutes(Array.isArray(routeData) ? routeData : [routeData]);
      setError(null);
    } catch (err) {
      console.error("Route calculation error:", err);
      setError(err.message || "Failed to calculate route");
    } finally {
      setLoading(false);
    }
  };

  // Location change handlers
  const handleUserLocationChange = (latlng) => {
    console.log("User location changed:", latlng);
    setUserLocation({
      lat: latlng.lat,
      lng: latlng.lng,
    });
  };

  const handleStartLocationChange = (latlng) => {
    console.log("Start location changed:", latlng);
    setStartLocation({
      lat: latlng.lat,
      lng: latlng.lng,
    });
  };

  const handleEndLocationChange = (latlng) => {
    console.log("End location changed:", latlng);
    setEndLocation({
      lat: latlng.lat,
      lng: latlng.lng,
    });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navigation */}
      <Navbar />

      {/* Error Display */}
      <ErrorDisplay message={error} />

      {/* Main Content */}
      <main className='container mx-auto p-4'>
        {/* Tab Selection */}
        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Panels */}
        {activeTab === "search" ? (
          <SearchPanel
            userLocation={userLocation}
            searchRadius={searchRadius}
            stations={stations}
            loading={loading}
            onLocationChange={handleUserLocationChange}
            onRadiusChange={setSearchRadius}
          />
        ) : (
          // In EVChargingApp.js, update the RoutePlanner render:
          <RoutePlanner
            startLocation={startLocation}
            endLocation={endLocation}
            routes={routes}
            loading={loading}
            selectedRoute={selectedRoute}
            stations={stations} // Add this line
            onStartLocationChange={handleStartLocationChange}
            onEndLocationChange={handleEndLocationChange}
            onCalculateRoute={handleCalculateRoute}
            onRouteSelect={setSelectedRoute}
          />
        )}
      </main>
    </div>
  );
};

export default EVChargingApp;
