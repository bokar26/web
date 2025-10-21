"use client";

import { useState } from "react";
import { GlassCard } from "./atoms/GlassCard";
import { StatusPin } from "./atoms/StatusPin";
import { mapPins } from "@/lib/mockData";
import { MapPin, ZoomIn, ZoomOut } from "lucide-react";

export function SupplyMap() {
  const [selectedPin, setSelectedPin] = useState<typeof mapPins[0] | null>(null);
  const [zoom, setZoom] = useState(1);

  const handlePinClick = (pin: typeof mapPins[0]) => {
    setSelectedPin(pin);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'green';
      case 'amber':
        return 'amber';
      case 'red':
        return 'red';
      default:
        return 'green';
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Global Supply Map</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-400">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '300px' }}>
        {/* Simplified world map representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-600 text-sm">Interactive Map View</div>
        </div>

        {/* Map pins positioned absolutely */}
        {mapPins.map((pin) => (
          <div
            key={pin.id}
            className="absolute cursor-pointer"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              transform: `scale(${zoom})`
            }}
            onClick={() => handlePinClick(pin)}
          >
            <StatusPin
              status={getStatusColor(pin.status)}
              size="md"
              title={pin.name}
            />
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
        <div className="flex items-center space-x-2">
          <StatusPin status="green" size="sm" />
          <span className="text-gray-400">Operational</span>
        </div>
        <div className="flex items-center space-x-2">
          <StatusPin status="amber" size="sm" />
          <span className="text-gray-400">Watch</span>
        </div>
        <div className="flex items-center space-x-2">
          <StatusPin status="red" size="sm" />
          <span className="text-gray-400">Breach</span>
        </div>
      </div>

      {selectedPin && (
        <div className="mt-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <h4 className="text-sm font-semibold text-white">{selectedPin.name}</h4>
          </div>
          <p className="text-sm text-gray-300">{selectedPin.details}</p>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <span>Status: {selectedPin.status}</span>
            <span>Lat: {selectedPin.lat}, Lng: {selectedPin.lng}</span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
