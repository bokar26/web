"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { shippingPlans } from "@/lib/mockData";
import { MapPin, Ship, Clock, DollarSign, TrendingDown, CheckCircle, Play, FileText, Download, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { features } from "@/lib/features";
import { ActionBar } from "@/components/dashboard/ActionBar";
import { SummaryHeader } from "@/components/dashboard/SummaryHeader";
import { FloatingActionBar } from "@/components/dashboard/FloatingActionBar";
import { ShippingKPIs } from "@/features/shipping-plans-exec/components/ShippingKPIs";
import { ExecutionConsole } from "@/features/shipping-plans-exec/components/ExecutionConsole";
import { ShipmentDrawer } from "@/features/shipping-plans-exec/components/ShipmentDrawer";
import { applyPlan } from "@/features/shipping-plans-exec/actions/applyPlan";
import { createRFQ } from "@/features/shipping-plans-exec/actions/createRFQ";
import { listShipments } from "@/features/shipping-plans-exec/data/shipments";
import { TOAST_MESSAGES } from "@/features/shipping-plans-exec/constants";

export default function ShippingPlansPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<typeof shippingPlans[0] | null>(null);
  const [showExecutionConsole, setShowExecutionConsole] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isCreatingRFQ, setIsCreatingRFQ] = useState(false);
  const [kpiData, setKpiData] = useState({ totalShipments: 0, totalPlannedCost: 0 });
  // Track applied shipments: planId -> shipmentId
  const [appliedShipmentIds, setAppliedShipmentIds] = useState<Map<string, string>>(new Map());

  // Helper function to open drawer for a shipment
  const openDrawerFor = (id: string) => {
    setSelectedShipmentId(id);
    setIsDrawerOpen(true);
    // Update URL with replace to avoid history entry
    const params = new URLSearchParams(searchParams.toString());
    params.set('shipmentId', id);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Helper function to close drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedShipmentId(null);
    // Remove shipmentId from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('shipmentId');
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  // Handle URL deep-linking on page load
  useEffect(() => {
    if (features.shippingPlansExec && user?.id) {
      const shipmentIdParam = searchParams.get('shipmentId');
      if (shipmentIdParam) {
        setSelectedShipmentId(shipmentIdParam);
        setIsDrawerOpen(true);
      }
    }
  }, [searchParams, user?.id]);

  const handleApplyPlan = async (plan: typeof shippingPlans[0]) => {
    handleApplyPlans([plan]);
  };

  const handleApplyPlans = async (plans: typeof shippingPlans) => {
    if (!user?.id) {
      toast.error("Please sign in to apply plans");
      return;
    }

    setIsApplying(true);
    const toastId = toast.loading("Applying plan...");

    try {
      // Convert plan data to PlanPayload format
      const planPayloads = plans.map((plan) => ({
        planId: String(plan.id),
        origin: plan.origin,
        destination: plan.destination,
        carrier: plan.carrier,
        recommendedETA: plan.recommendedETA,
        recommendedCost: plan.recommendedCost,
        recommendedRoute: plan.recommendedRoute,
      }));

      const result = await applyPlan({
        plans: planPayloads,
        ownerUserId: user.id,
      });

      const count = result.shipments.length;
      toast.success(`✅ ${count} route${count !== 1 ? 's' : ''} optimized successfully. View changes →`, { id: toastId });
      
      // Store shipment IDs for each plan
      const newMap = new Map(appliedShipmentIds)
      result.shipments.forEach((s) => {
        newMap.set(s.planId, s.id)
      })
      setAppliedShipmentIds(newMap)
      
      // Refresh KPIs
      window.dispatchEvent(new Event('shipping-kpis-refresh'));
      
      setShowExecutionConsole(true);
    } catch (error) {
      console.error('[shipping/page] Failed to apply plan:', error)
      toast.error(
        error instanceof Error ? error.message : TOAST_MESSAGES.PLAN_APPLY_ERROR,
        { id: toastId }
      );
    } finally {
      setIsApplying(false);
    }
  };

  const handleCardClick = (plan: typeof shippingPlans[0]) => {
    setSelectedPlan(plan);
  };

  const handleCardTitleClick = async (plan: typeof shippingPlans[0], e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If feature enabled, try to open drawer with shipment if it exists
    if (features.shippingPlansExec && user?.id) {
      try {
        // Check if we have a stored shipment ID for this plan
        let shipmentId = appliedShipmentIds.get(String(plan.id));
        
        if (!shipmentId) {
          // Otherwise, query by plan_id
          const shipments = await listShipments(user.id, { limit: 100 });
          const matchingShipment = shipments.find((s) => s.plan_id === String(plan.id));
          if (matchingShipment) {
            shipmentId = matchingShipment.id;
            // Store in map for future use
            setAppliedShipmentIds(new Map(appliedShipmentIds.set(String(plan.id), shipmentId)));
          }
        }
        
        if (shipmentId) {
          openDrawerFor(shipmentId);
        } else {
          toast.info("Apply plan to create a shipment");
        }
      } catch (error) {
        console.error("[shipping/page] Failed to load shipment:", error);
        toast.error("Failed to load shipment");
      }
    }
  };

  const handleDrawerClose = (open: boolean) => {
    if (!open) {
      closeDrawer();
    } else {
      setIsDrawerOpen(true);
    }
  };

  // Calculate summary metrics
  const calculateCostSaved = () => {
    return shippingPlans.reduce((sum, plan) => sum + plan.savings, 0);
  };

  const handleSimulateAllRoutes = () => {
    toast.info("Simulating all routes...");
    // Placeholder - would call simulation action
  };

  const handleApplyRecommendedPlan = () => {
    if (shippingPlans.length > 0) {
      handleApplyPlan(shippingPlans[0]);
    }
  };

  const handleCreateRFQForAll = async () => {
    if (!user?.id) {
      toast.error("Please sign in to create RFQ");
      return;
    }

    const appliedShipmentIdsList = Array.from(appliedShipmentIds.values());
    if (appliedShipmentIdsList.length === 0) {
      toast.error("Please apply plans first to create RFQs");
      return;
    }

    setIsCreatingRFQ(true);
    const toastId = toast.loading("Creating RFQs...");

    try {
      // Get providers using browser client
      const { createBrowserClient } = await import('@/lib/supabase/client');
      const supabase = createBrowserClient();
      const { data: providersResult } = await supabase
        .from('freight_forwarders')
        .select('id')
        .eq('ff_type', 'Freight Forwarder')
        .limit(10);

      const providerIds = (providersResult || []).slice(0, 3).map((p: any) => p.id);

      if (providerIds.length === 0) {
        toast.error("No providers available", { id: toastId });
        return;
      }

      const result = await createRFQ({
        shipmentIds: appliedShipmentIdsList,
        providerIds,
        ownerUserId: user.id,
      });

      toast.success(`RFQ created for ${result.quotes.length} provider(s)`, { id: toastId });
      window.dispatchEvent(new Event('shipping-kpis-refresh'));
    } catch (error) {
      console.error("[shipping/page] Failed to create RFQ:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create RFQ", { id: toastId });
    } finally {
      setIsCreatingRFQ(false);
    }
  };

  const handleExportReport = () => {
    toast.info("Export feature coming soon");
  };

  // Listen for KPI updates
  useEffect(() => {
    const handleKPIRefresh = async () => {
      if (user?.id && features.shippingPlansExec) {
        try {
          const { getShipmentKPIs } = await import('@/features/shipping-plans-exec/actions/getKPIs');
          const data = await getShipmentKPIs();
          setKpiData({ totalShipments: data.totalShipments, totalPlannedCost: data.totalPlannedCost });
        } catch (error) {
          console.error('[shipping/page] Failed to load KPIs:', error);
        }
      }
    };

    window.addEventListener('shipping-kpis-refresh', handleKPIRefresh);
    handleKPIRefresh(); // Initial load

    return () => {
      window.removeEventListener('shipping-kpis-refresh', handleKPIRefresh);
    };
  }, [user?.id]);

  const handleCreateRFQ = async (plan: typeof shippingPlans[0]) => {
    if (!user?.id) {
      toast.error("Please sign in to create RFQ");
      return;
    }

    // Find shipment for this plan
    let shipmentId = appliedShipmentIds.get(String(plan.id))
    if (!shipmentId) {
      // Query by plan_id
      try {
        const shipments = await listShipments(user.id, { limit: 100 })
        const matchingShipment = shipments.find((s) => s.plan_id === String(plan.id))
        if (!matchingShipment) {
          toast.error("Please apply the plan first to create an RFQ");
          return
        }
        shipmentId = matchingShipment.id
      } catch (error) {
        console.error("[shipping/page] Failed to find shipment:", error)
        toast.error("Failed to find shipment. Please apply the plan first.");
        return
      }
    }

    setIsCreatingRFQ(true)
    const toastId = toast.loading("Creating RFQ...")

    try {
      // For Phase-1: use placeholder provider IDs (in production, would show selector)
      // Query freight_forwarders for provider list
      const { searchForwarders } = await import("@/app/(protected)/dashboard/search/logistics/actions")
      const providersResult = await searchForwarders({
        q: undefined,
        country: undefined,
        ff_type: undefined,
        limit: 10,
        offset: 0,
      })
      
      // Use first 3 providers as placeholder (in production, would show modal selector)
      const providerIds = providersResult.data.slice(0, 3).map((p) => p.id)

      if (providerIds.length === 0) {
        toast.error("No providers available. Please add freight forwarders first.", { id: toastId })
        return
      }

      const result = await createRFQ({
        shipmentIds: [shipmentId],
        providerIds,
        ownerUserId: user.id,
      })

      toast.success(`RFQ created for ${result.quotes.length} provider(s)`, { id: toastId })
      
      // Refresh KPIs
      window.dispatchEvent(new Event('shipping-kpis-refresh'))
    } catch (error) {
      console.error("[shipping/page] Failed to create RFQ:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to create RFQ",
        { id: toastId }
      )
    } finally {
      setIsCreatingRFQ(false)
    }
  };

  const handleMapPinClick = async (plan: typeof shippingPlans[0]) => {
    await handleCardClick(plan);
    if (features.shippingPlansExec) {
      setIsDrawerOpen(true);
    }
  };

  return (
    <div className="dashboard-bg min-h-screen p-6">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
        {/* Header row with actions */}
        {features.shippingPlansExec && (
          <div className="flex items-center justify-between gap-3 pt-2 md:pt-3">
            <div></div>
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <Button
                variant="outline"
                onClick={handleSimulateAllRoutes}
                className="h-10"
                title="Run simulation for all current and recommended shipping routes"
              >
                <Play className="w-4 h-4 mr-2" />
                Simulate All Routes
              </Button>
              <Button
                variant="default"
                onClick={handleApplyRecommendedPlan}
                disabled={isApplying || shippingPlans.length === 0}
                className="h-10"
                title="Apply the top recommended route optimization"
              >
                <Zap className="w-4 h-4 mr-2" />
                Apply Recommended Plan
              </Button>
              <Button
                variant="default"
                onClick={() => handleApplyPlans(shippingPlans)}
                disabled={isApplying}
                className="h-10"
                title="Apply all recommended route optimizations"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Apply All Plans
              </Button>
              <Button
                variant="secondary"
                onClick={handleCreateRFQForAll}
                disabled={isCreatingRFQ || appliedShipmentIds.size === 0}
                className="h-10"
                title="Send RFQ to freight forwarders for selected shipments"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create RFQ{appliedShipmentIds.size > 0 ? ` (${appliedShipmentIds.size})` : ''}
              </Button>
              <Button
                variant="ghost"
                onClick={handleExportReport}
                className="h-10"
                title="Export shipping plans summary report"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        )}

        {features.shippingPlansExec && (
          <div>
            <ShippingKPIs />
          </div>
        )}

        {/* Summary Header */}
        {features.shippingPlansExec && (
          <div>
            <SummaryHeader
            metrics={[
              {
                label: 'Total Shipments',
                value: kpiData.totalShipments,
                onClick: () => setShowExecutionConsole(true),
                icon: <Ship className="w-4 h-4" />,
              },
              {
                label: 'Cost Saved',
                value: `$${calculateCostSaved().toLocaleString()}`,
                onClick: () => setShowExecutionConsole(true),
                icon: <DollarSign className="w-4 h-4" />,
              },
              {
                label: 'Routes Optimized',
                value: appliedShipmentIds.size,
                onClick: () => setShowExecutionConsole(true),
                icon: <CheckCircle className="w-4 h-4" />,
              },
            ]}
          />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Map */}
        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Route Map</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-white">
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
                  onClick={() => handleMapPinClick(plan)}
                >
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        </Card>

        {/* Route Comparison Table */}
        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Route Comparison</h3>
              {features.shippingPlansExec ? (
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleApplyPlans(shippingPlans)}
                  disabled={isApplying}
                >
                  {isApplying ? "Applying..." : "Apply All Plans"}
                </Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Apply All Plans
                </Button>
              )}
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
                  <div 
                    className="flex items-center space-x-2 cursor-pointer hover:text-blue-300 transition-colors"
                    onClick={(e) => features.shippingPlansExec ? handleCardTitleClick(plan, e) : undefined}
                    title={features.shippingPlansExec && !appliedShipmentIds.has(String(plan.id)) ? "Apply plan to create a shipment" : undefined}
                  >
                    <Ship className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">
                      {plan.origin.name} → {plan.destination.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-white">{plan.carrier}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-600 dark:text-white" />
                      <span className="text-gray-900 dark:text-white">ETA</span>
                    </div>
                    <div className="text-white font-medium">{plan.currentETA}</div>
                    <div className="text-green-400 text-xs">
                      → {plan.recommendedETA} ({plan.timeSaved}d saved)
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-600 dark:text-white" />
                      <span className="text-gray-900 dark:text-white">Cost</span>
                    </div>
                    <div className="text-white font-medium">${plan.currentCost}</div>
                    <div className="text-green-400 text-xs flex items-center">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      → ${plan.recommendedCost} (${plan.savings} saved)
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="text-xs text-gray-600 dark:text-white mb-2">
                    Recommended: {plan.recommendedRoute}
                  </div>
                  {features.shippingPlansExec && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Simulate action
                        }}
                      >
                        Simulate
                      </Button>
                      <Button 
                        size="sm"
                        className="text-xs bg-green-600 hover:bg-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyPlan(plan);
                        }}
                        disabled={isApplying}
                      >
                        Apply
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateRFQ(plan);
                        }}
                        disabled={isCreatingRFQ || !appliedShipmentIds.has(String(plan.id))}
                        title={!appliedShipmentIds.has(String(plan.id)) ? "Apply plan first" : undefined}
                      >
                        {isCreatingRFQ ? "Creating..." : "Create RFQ"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        </Card>
        </div>

        {features.shippingPlansExec && showExecutionConsole && (
          <div className="mt-6">
            <ExecutionConsole shipmentId={selectedShipmentId} onClose={() => setShowExecutionConsole(false)} />
          </div>
        )}

      {features.shippingPlansExec && (
        <ShipmentDrawer
          open={isDrawerOpen}
          onOpenChange={handleDrawerClose}
          shipmentId={selectedShipmentId}
        />
      )}

      {/* Selected Plan Details */}
      {selectedPlan && (
        <Card className="dashboard-card mt-6">
          <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Plan Details</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="text-gray-900 dark:text-white border-gray-600">
                Simulate Alternative
              </Button>
              {features.shippingPlansExec && selectedPlan ? (
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleApplyPlan(selectedPlan)}
                  disabled={isApplying}
                >
                  {isApplying ? "Applying..." : "Apply Plan"}
                </Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Apply Plan
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Current Route</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-white">Origin:</span>
                  <span className="text-white">{selectedPlan.origin.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-white">Destination:</span>
                  <span className="text-white">{selectedPlan.destination.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-white">Carrier:</span>
                  <span className="text-white">{selectedPlan.carrier}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-white">ETA:</span>
                  <span className="text-white">{selectedPlan.currentETA}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-white">Cost:</span>
                  <span className="text-white">${selectedPlan.currentCost}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Recommended Route</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-white">Route:</span>
                  <span className="text-white">{selectedPlan.recommendedRoute}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-white">ETA:</span>
                  <span className="text-green-400">{selectedPlan.recommendedETA}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-white">Cost:</span>
                  <span className="text-green-400">${selectedPlan.recommendedCost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-white">Time Saved:</span>
                  <span className="text-green-400">{selectedPlan.timeSaved} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-white">Cost Saved:</span>
                  <span className="text-green-400">${selectedPlan.savings}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Impact</h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-green-900/20 border border-green-500/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Cost Reduction</span>
                  </div>
                  <div className="text-lg font-bold text-green-400">${selectedPlan.savings}</div>
                  <div className="text-xs text-gray-600 dark:text-white">per shipment</div>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Time Savings</span>
                  </div>
                  <div className="text-lg font-bold text-blue-400">{selectedPlan.timeSaved} days</div>
                  <div className="text-xs text-gray-600 dark:text-white">faster delivery</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        </Card>
        )}

        {features.shippingPlansExec && (
          <ShipmentDrawer
            open={isDrawerOpen}
            onOpenChange={handleDrawerClose}
            shipmentId={selectedShipmentId}
          />
        )}

        {/* Floating Action Bar */}
        {features.shippingPlansExec && (
          <FloatingActionBar
          actions={[
            {
              label: 'Apply All',
              onClick: () => handleApplyPlans(shippingPlans),
              icon: <CheckCircle className="w-4 h-4" />,
              disabled: isApplying,
              tooltip: 'Apply all recommended plans',
            },
            {
              label: 'Generate RFQs',
              onClick: handleCreateRFQForAll,
              icon: <FileText className="w-4 h-4" />,
              disabled: isCreatingRFQ || appliedShipmentIds.size === 0,
              tooltip: 'Create RFQs for all applied shipments',
            },
            {
              label: 'Export Summary',
              onClick: handleExportReport,
              icon: <Download className="w-4 h-4" />,
              tooltip: 'Export shipping plans summary',
            },
          ]}
          position="bottom-right"
        />
        )}
      </div>
    </div>
  );
}
