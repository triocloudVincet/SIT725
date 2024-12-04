import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationMarker = ({ position, onLocationChange }) => {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapSelector = ({ position, onLocationChange }) => {
  const defaultPosition = position || [-37.8183, 144.9558]; // Melbourne CBD

  return (
    <div style={{ height: "300px", width: "100%", marginBottom: "1rem" }}>
      <MapContainer
        center={defaultPosition}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker
          position={position}
          onLocationChange={onLocationChange}
        />
      </MapContainer>
    </div>
  );
};

export default MapSelector;
