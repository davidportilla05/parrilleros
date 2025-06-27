import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Icono personalizado para el marcador
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface LocationPickerProps {
  onSelectLocation: (lat: number, lng: number) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onSelectLocation }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onSelectLocation(e.latlng.lat, e.latlng.lng);
      },
    });

    return position === null ? null : (
      <Marker position={position} icon={markerIcon} />
    );
  };

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden mt-4">
      <MapContainer
        center={{ lat: 1.2136, lng: -77.2811 }} // Por ejemplo: Pasto, Colombia
        zoom={14}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
