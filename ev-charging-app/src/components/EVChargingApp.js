import React, { useState } from "react";
import { Clock, Battery, DollarSign, MapPin } from "lucide-react";

const EVChargingApp = () => {
  const [searchRadius, setSearchRadius] = useState(10);
  const [activeTab, setActiveTab] = useState("search");
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Mock data for stations
  const stations = [
    {
      id: 1,
      name: "Central EV Station",
      address: "123 Main Street",
      distance: 2.5,
      availability: "Available",
      ports: ["Type 2", "CCS", "CHAdeMO"],
      pricing: {
        perKwh: 0.35,
        parkingFee: 2.0,
      },
      powerOutput: "50kW DC, 22kW AC",
      currentWaitTime: "No wait",
    },
    {
      id: 2,
      name: "Quick Charge Hub",
      address: "456 Oak Avenue",
      distance: 5.1,
      availability: "2 spots available",
      ports: ["Type 2", "CCS"],
      pricing: {
        perKwh: 0.4,
        parkingFee: 0,
      },
      powerOutput: "150kW DC",
      currentWaitTime: "15 mins",
    },
  ];

  // Mock data for route planning
  const routes = [
    {
      id: 1,
      totalDistance: "350 km",
      totalTime: "4h 15min",
      chargingStops: [
        {
          station: "Central EV Station",
          arrivalCharge: "20%",
          chargingTime: "25 mins",
          departureCharge: "80%",
        },
        {
          station: "Quick Charge Hub",
          arrivalCharge: "15%",
          chargingTime: "30 mins",
          departureCharge: "85%",
        },
      ],
    },
    {
      id: 2,
      totalDistance: "355 km",
      totalTime: "4h 30min",
      chargingStops: [
        {
          station: "Highway Express Charger",
          arrivalCharge: "25%",
          chargingTime: "35 mins",
          departureCharge: "90%",
        },
      ],
    },
  ];

  const StationCard = ({ station }) => (
    <div className='border rounded-lg p-4 hover:border-blue-500 transition-all'>
      <div className='flex justify-between items-start'>
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>{station.name}</h3>
            <span className='text-blue-600 font-medium'>
              {station.distance}km away
            </span>
          </div>
          <p className='text-gray-600 flex items-center gap-1'>
            <MapPin size={16} />
            {station.address}
          </p>

          {/* Availability and Wait Time */}
          <div className='mt-2 flex items-center gap-2'>
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                station.availability.includes("Available")
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {station.availability}
            </span>
            <span className='text-sm text-gray-600'>
              Wait: {station.currentWaitTime}
            </span>
          </div>

          {/* Charging Ports */}
          <div className='mt-3'>
            <div className='flex flex-wrap gap-2'>
              {station.ports.map((port, idx) => (
                <span
                  key={idx}
                  className='px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-1'
                >
                  <Battery size={14} />
                  {port}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing Information */}
          <div className='mt-3 text-sm text-gray-600'>
            <div className='flex items-center gap-1'>
              <DollarSign size={14} />
              <span>${station.pricing.perKwh}/kWh</span>
              {station.pricing.parkingFee > 0 && (
                <span className='ml-2'>
                  + ${station.pricing.parkingFee}/hr parking
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const RouteOption = ({ route, isSelected, onSelect }) => (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? "border-blue-500 bg-blue-50" : "hover:border-blue-300"
      }`}
      onClick={() => onSelect(route)}
    >
      <div className='flex justify-between items-start'>
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-lg font-semibold'>Route Option</h3>
            <div className='flex items-center gap-2 text-gray-600'>
              <Clock size={16} />
              {route.totalTime}
            </div>
          </div>

          {/* Charging Stops */}
          <div className='space-y-3'>
            {route.chargingStops.map((stop, idx) => (
              <div key={idx} className='bg-white rounded p-3 border'>
                <div className='flex justify-between items-center'>
                  <span className='font-medium'>{stop.station}</span>
                  <span className='text-sm text-gray-600'>
                    Charge time: {stop.chargingTime}
                  </span>
                </div>
                <div className='mt-2 flex items-center gap-4 text-sm text-gray-600'>
                  <span>Arrival: {stop.arrivalCharge}</span>
                  <span>→</span>
                  <span>Departure: {stop.departureCharge}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Journey Summary */}
          <div className='mt-3 pt-3 border-t flex justify-between text-sm text-gray-600'>
            <span>Total Distance: {route.totalDistance}</span>
            <span>Total Time: {route.totalTime}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navigation */}
      <nav className='bg-blue-600 p-4'>
        <div className='container mx-auto flex items-center justify-between'>
          <h1 className='text-white text-2xl font-bold'>Locate a Socket</h1>
          <div className='flex space-x-4'>
            <button className='text-white hover:text-blue-200'>Login</button>
            <button className='bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50'>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='container mx-auto p-4'>
        {/* Tabs */}
        <div className='flex mb-6 bg-white rounded-lg shadow-sm'>
          <button
            className={`flex-1 py-3 ${
              activeTab === "search"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("search")}
          >
            Find Stations
          </button>
          <button
            className={`flex-1 py-3 ${
              activeTab === "route"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("route")}
          >
            Plan Route
          </button>
        </div>

        {/* Search Panel */}
        {activeTab === "search" && (
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='mb-6'>
              <label className='block text-gray-700 mb-2'>
                Search Radius ({searchRadius}km)
              </label>
              <input
                type='range'
                min='1'
                max='50'
                value={searchRadius}
                onChange={(e) => setSearchRadius(e.target.value)}
                className='w-full'
              />
            </div>

            {/* Station List */}
            <div className='space-y-4'>
              {stations.map((station) => (
                <StationCard key={station.id} station={station} />
              ))}
            </div>
          </div>
        )}

        {/* Route Planning Panel */}
        {activeTab === "route" && (
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='space-y-4'>
              <div>
                <label className='block text-gray-700 mb-2'>
                  Start Location
                </label>
                <input
                  type='text'
                  className='w-full p-2 border rounded-lg'
                  placeholder='Enter start location'
                />
              </div>
              <div>
                <label className='block text-gray-700 mb-2'>Destination</label>
                <input
                  type='text'
                  className='w-full p-2 border rounded-lg'
                  placeholder='Enter destination'
                />
              </div>
              <button className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mb-6'>
                Calculate Routes
              </button>

              {/* Route Options */}
              <div className='space-y-4'>
                {routes.map((route) => (
                  <RouteOption
                    key={route.id}
                    route={route}
                    isSelected={selectedRoute?.id === route.id}
                    onSelect={setSelectedRoute}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EVChargingApp;
