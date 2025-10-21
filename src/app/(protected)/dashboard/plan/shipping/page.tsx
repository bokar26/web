"use client";

import { useState } from "react";
import { GlassCard } from "@/components/dashboard/atoms/GlassCard";
import { shippingPlans } from "@/lib/mockData";
import { MapPin, Ship, Clock, DollarSign, TrendingDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShippingPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<typeof shippingPlans[0] | null>(null);

  return (
    <div className="dashboard-bg min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Shipping Plans</h1>
        <p className="text-gray-300">Optimize routes and reduce shipping costs with AI-powered recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Map */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Route Map</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Current</span>
              <div className="w-3 h-3 rounded-full bg-green-500 ml-4"></div>
              <span>Recommended</span>
            </div>
          </div>
          
          <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '400px' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-600 text-sm">Interactive Route Map</div>
            </div>
            
            {/* Map pins for routes */}
            {shippingPlans.map((plan) => (
              <div key={plan.id} className="absolute">
                <div
                  className="absolute cursor-pointer"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                  }}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Route Comparison Table */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Route Comparison</h3>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Apply All Plans
            </Button>
          </div>

          <div className="space-y-4">
            {shippingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedPlan?.id === plan.id 
                    ? 'bg-gray-700 border-green-500' 
                    : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Ship className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">
                      {plan.origin.name} → {plan.destination.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{plan.carrier}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">ETA</span>
                    </div>
                    <div className="text-white font-medium">{plan.currentETA}</div>
                    <div className="text-green-400 text-xs">
                      → {plan.recommendedETA} ({plan.timeSaved}d saved)
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">Cost</span>
                    </div>
                    <div className="text-white font-medium">${plan.currentCost}</div>
                    <div className="text-green-400 text-xs flex items-center">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      → ${plan.recommendedCost} (${plan.savings} saved)
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="text-xs text-gray-400">
                    Recommended: {plan.recommendedRoute}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Selected Plan Details */}
      {selectedPlan && (
        <GlassCard className="p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Plan Details</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="text-gray-300 border-gray-600">
                Simulate Alternative
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Apply Plan
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-300">Current Route</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Origin:</span>
                  <span className="text-white">{selectedPlan.origin.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Destination:</span>
                  <span className="text-white">{selectedPlan.destination.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Carrier:</span>
                  <span className="text-white">{selectedPlan.carrier}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">ETA:</span>
                  <span className="text-white">{selectedPlan.currentETA}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cost:</span>
                  <span className="text-white">${selectedPlan.currentCost}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-300">Recommended Route</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Route:</span>
                  <span className="text-white">{selectedPlan.recommendedRoute}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">ETA:</span>
                  <span className="text-green-400">{selectedPlan.recommendedETA}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cost:</span>
                  <span className="text-green-400">${selectedPlan.recommendedCost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Time Saved:</span>
                  <span className="text-green-400">{selectedPlan.timeSaved} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cost Saved:</span>
                  <span className="text-green-400">${selectedPlan.savings}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-300">Impact</h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-green-900/20 border border-green-500/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Cost Reduction</span>
                  </div>
                  <div className="text-lg font-bold text-green-400">${selectedPlan.savings}</div>
                  <div className="text-xs text-gray-400">per shipment</div>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Time Savings</span>
                  </div>
                  <div className="text-lg font-bold text-blue-400">{selectedPlan.timeSaved} days</div>
                  <div className="text-xs text-gray-400">faster delivery</div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
