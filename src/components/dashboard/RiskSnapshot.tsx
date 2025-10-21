"use client";

import { useState } from "react";
import { GlassCard } from "./atoms/GlassCard";
import { atRiskEntities } from "@/lib/mockData";
import { ChevronRight, AlertTriangle, Truck, Building, Package } from "lucide-react";

export function RiskSnapshot() {
  const [selectedEntity, setSelectedEntity] = useState<typeof atRiskEntities[0] | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'supplier':
        return <Building className="w-4 h-4" />;
      case 'shipment':
        return <Truck className="w-4 h-4" />;
      case 'factory':
        return <Building className="w-4 h-4" />;
      case 'carrier':
        return <Truck className="w-4 h-4" />;
      case 'warehouse':
        return <Package className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-amber-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Risk & Breach Snapshot</h3>
        <div className="text-sm text-gray-400">
          {atRiskEntities.length} active risks
        </div>
      </div>

      <div className="space-y-3">
        {atRiskEntities.map((entity) => (
          <div
            key={entity.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer transition-colors"
            onClick={() => setSelectedEntity(entity)}
          >
            <div className="flex items-center space-x-3">
              <div className={getSeverityColor(entity.severity)}>
                {getIcon(entity.type)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{entity.name}</p>
                <p className="text-xs text-gray-400">{entity.reason}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`risk-dot ${entity.severity}`} />
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {selectedEntity && (
        <div className="mt-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
          <h4 className="text-sm font-semibold text-white mb-2">Risk Details</h4>
          <p className="text-sm text-gray-300 mb-2">{selectedEntity.reason}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Type: {selectedEntity.type}</span>
            <span className={`font-medium ${getSeverityColor(selectedEntity.severity)}`}>
              {selectedEntity.severity.toUpperCase()} RISK
            </span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
