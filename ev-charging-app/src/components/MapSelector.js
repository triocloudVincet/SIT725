import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  Popup,
} from "react-leaflet";
import { Battery, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Create an EV charging station icon
const evStationIcon = L.divIcon({
  className: "custom-ev-marker",
  html: `
        <div style="
            background-color: white;
            border: 2px solid #2563eb;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#2563eb">
                <path d="M19 7h-1V6h-2v1h-1a2 2 0 00-2 2v10a2 2 0 002 2h4a2 2 0 002-2V9a2 2 0 00-2-2zm-6-5H5a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2zm-1 14H6v-2h6v2zm0-4H6v-2h6v2zm0-4H6V6h6v2z"/>
            </svg>
        </div>
        `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Selected location marker icon
const locationIcon = L.divIcon({
  className: "custom-location-marker",
  html: `
        <div style="
            background-color: white;
            border: 2px solid #dc2626;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="#dc2626">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
        </div>
    `,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const MapController = ({ center, zoom }) => {
  const map = useMap();

  React.useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);

  return null;
};

const MapSelector = ({ position, onLocationChange, stations = [] }) => {
  const defaultPosition = position || [-37.8183, 144.9558];
  const defaultZoom = 14;

  return (
    <div style={{ height: "400px", width: "100%", marginBottom: "1rem" }}>
      <MapContainer
        center={defaultPosition}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapController center={position} zoom={defaultZoom} />

        {/* Selected location */}
        {position && (
          <Marker position={position} icon={locationIcon}>
            <Popup>Selected Location</Popup>
          </Marker>
        )}

        {/* Charging stations */}
        {stations.map((station) => {
          const stationPosition = station.location?.coordinates
            ? [station.location.coordinates[1], station.location.coordinates[0]]
            : null;

          if (!stationPosition) return null;

          return (
            <Marker
              key={station._id}
              position={stationPosition}
              icon={evStationIcon}
            >
              <Popup>
                <div className='p-2 min-w-[200px]'>
                  <h3 className='font-bold text-lg mb-1'>{station.name}</h3>
                  <p className='text-sm text-gray-600 mb-2 flex items-center gap-1'>
                    <MapPin size={14} />
                    {station.address}
                  </p>
                  <div className='flex flex-wrap gap-1 mb-2'>
                    {station.ports.map((port, idx) => (
                      <span
                        key={idx}
                        className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1'
                      >
                        <Battery size={12} />
                        {port.type} - {port.power}kW
                      </span>
                    ))}
                  </div>
                  <div className='text-sm text-gray-700 flex items-center gap-1'>
                    <span className='font-medium'>
                      ${station.pricing.perKwh}/kWh
                    </span>
                    {station.pricing.parkingFee > 0 && (
                      <span>+ ${station.pricing.parkingFee}/hr parking</span>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Map click handler */}
        <MapEvents onLocationChange={onLocationChange} />
      </MapContainer>
    </div>
  );
};

const MapEvents = ({ onLocationChange }) => {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng);
    },
  });
  return null;
};

export default MapSelector;
