import React from 'react';
import { MapPin, Phone, Truck } from 'lucide-react';
import { Location } from '../types';

interface LocationSelectorProps {
  locations: Location[];
  selectedLocation: Location | null;
  onSelectLocation: (location: Location) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
        <MapPin size={24} className="mr-2 text-[#FF8C00]" />
        Selecciona tu sede preferida
      </h2>
      <p className="text-gray-600 mb-6">
        Elige la sede más cercana a tu ubicación para un mejor servicio de domicilio
      </p>
      
      <div className="grid grid-cols-1 gap-4">
        {locations.map((location) => (
          <div
            key={location.id}
            onClick={() => onSelectLocation(location)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedLocation?.id === location.id
                ? 'border-[#FF8C00] bg-orange-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {location.name}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-2 text-[#FF8C00]" />
                    <span className="text-sm">{location.address}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Phone size={16} className="mr-2 text-[#FF8C00]" />
                    <span className="text-sm">{location.phone}</span>
                  </div>
                  
                  <div className="flex items-start text-gray-600">
                    <Truck size={16} className="mr-2 text-[#FF8C00] mt-0.5" />
                    <div className="text-sm">
                      <span className="font-medium">Zonas de entrega:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {location.deliveryZones.map((zone, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                          >
                            {zone}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedLocation?.id === location.id && (
                <div className="ml-4">
                  <div className="w-6 h-6 bg-[#FF8C00] rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {selectedLocation && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-green-800">
                Sede seleccionada: {selectedLocation.name}
              </p>
              <p className="text-sm text-green-600">
                Tu pedido será procesado por esta sede
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;