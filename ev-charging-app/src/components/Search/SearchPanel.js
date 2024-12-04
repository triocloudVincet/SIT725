import React from "react";
import MapSelector from "../Map/MapSelector";
import StationCard from "./StationCard";

const SearchPanel = ({
  userLocation,
  searchRadius,
  stations,
  loading,
  onLocationChange,
  onRadiusChange,
}) => {
  console.log("Stations in SearchPanel:", stations); // Debug log

  return (
    <div className='bg-white rounded-lg shadow-lg p-6'>
      <div className='mb-6'>
        <label className='block text-gray-700 mb-2'>Select Location</label>
        <MapSelector
          position={userLocation ? [userLocation.lat, userLocation.lng] : null}
          onLocationChange={onLocationChange}
          stations={stations}
        />
      </div>

      <div className='mb-6'>
        <label className='block text-gray-700 mb-2'>
          Search Radius ({searchRadius}km)
        </label>
        <input
          type='range'
          min='1'
          max='50'
          value={searchRadius}
          onChange={(e) => onRadiusChange(e.target.value)}
          className='w-full'
        />
      </div>

      {loading ? (
        <div className='text-center py-4'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
        </div>
      ) : (
        <div className='space-y-4'>
          {stations.map((station) => (
            <StationCard key={station._id} station={station} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
