import React from "react";
import MapSelector from "../Map/MapSelector";
import RouteOption from "./RouteOption";

const RoutePlanner = ({
  startLocation,
  endLocation,
  routes,
  loading,
  selectedRoute,
  stations, // Add stations prop
  onStartLocationChange,
  onEndLocationChange,
  onCalculateRoute,
  onRouteSelect,
}) => (
  <div className='bg-white rounded-lg shadow-lg p-6'>
    <div className='space-y-4'>
      <div>
        <label className='block text-gray-700 mb-2'>Start Location</label>
        <MapSelector
          position={
            startLocation ? [startLocation.lat, startLocation.lng] : null
          }
          onLocationChange={onStartLocationChange}
          stations={stations} // Pass stations to MapSelector
        />
      </div>
      <div>
        <label className='block text-gray-700 mb-2'>Destination</label>
        <MapSelector
          position={endLocation ? [endLocation.lat, endLocation.lng] : null}
          onLocationChange={onEndLocationChange}
          stations={stations} // Pass stations to MapSelector
        />
      </div>

      <button
        className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mb-6'
        onClick={onCalculateRoute}
        disabled={loading || !startLocation || !endLocation}
      >
        {loading ? (
          <span className='flex items-center justify-center'>
            <span className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
            Calculating...
          </span>
        ) : (
          "Calculate Routes"
        )}
      </button>

      {/* Route Options */}
      <div className='space-y-4'>
        {routes.map((route) => (
          <RouteOption
            key={route._id || route.id}
            route={route}
            isSelected={selectedRoute?._id === route._id}
            onSelect={onRouteSelect}
          />
        ))}
      </div>
    </div>
  </div>
);

export default RoutePlanner;
