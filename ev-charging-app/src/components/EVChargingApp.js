import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useSocket } from "../context/SocketProvider";
import Navbar from "./Navigation/Navbar";
import TabSelector from "./Navigation/TabSelector";
import SearchPanel from "./Search/SearchPanel";
import RoutePlanner from "./Route/RoutePlanner";
import ErrorDisplay from "./common/ErrorDisplay";

const EVChargingApp = () => {
  const socket = useSocket();
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

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("chargingStatus", (data) => {
      setStations((prevStations) =>
        prevStations.map((station) =>
          station._id === data.stationId
            ? { ...station, status: data.status }
            : station
        )
      );
    });

    socket.on("error", (error) => {
      setError("Socket error: " + error.message);
    });

    return () => {
      socket.off("connect");
      socket.off("chargingStatus");
      socket.off("error");
    };
  }, [socket]);

  useEffect(() => {
    const initializeApp = async () => {
      setUserLocation({
        lat: -37.8183,
        lng: 144.9558,
      });

      try {
        const isConnected = await api.testConnection();
        if (!isConnected) {
          setError("Unable to connect to the server");
        }
      } catch (err) {
        setError("Server connection failed");
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const fetchStations = async () => {
      if (!userLocation) return;

      setLoading(true);
      try {
        const data = await api.getStations(
          searchRadius,
          userLocation.lat,
          userLocation.lng
        );
        setStations(data);
      } catch (err) {
        setError("Failed to fetch stations: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [searchRadius, userLocation]);

  const handleUserLocationChange = (latlng) => {
    setUserLocation({
      lat: latlng.lat,
      lng: latlng.lng,
    });
  };

  const handleStartLocationChange = (latlng) => {
    setStartLocation({
      lat: latlng.lat,
      lng: latlng.lng,
    });
  };

  const handleEndLocationChange = (latlng) => {
    setEndLocation({
      lat: latlng.lat,
      lng: latlng.lng,
    });
  };

  const handleCalculateRoute = async () => {
    if (!startLocation || !endLocation) {
      setError("Please select both start and end locations");
      return;
    }

    setLoading(true);
    try {
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
      setRoutes(Array.isArray(routeData) ? routeData : [routeData]);
    } catch (err) {
      setError(err.message || "Failed to calculate route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <ErrorDisplay message={error} />

      <main className='container mx-auto p-4'>
        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

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
          <RoutePlanner
            startLocation={startLocation}
            endLocation={endLocation}
            routes={routes}
            loading={loading}
            selectedRoute={selectedRoute}
            stations={stations}
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
