import { 
  kpis, 
  cccTrendData, 
  shipTimeTrendData, 
  additionalMetrics, 
  currentGoal, 
  vendorBreakdownData, 
  slaSuggestions,
  heatmapData,
  slaHealthData,
  atRiskEntities,
  mapPins,
  costCompositionData,
  inventoryForecastData,
  activityTimeline,
  secondaryMetrics
} from "@/lib/mockData"
import { DashboardContent } from "@/components/dashboard/DashboardContent"

export const metadata = {
  title: "Supply Center",
}

export default function SupplyCenterPage() {
  return (
    <DashboardContent
      kpis={kpis}
      cccTrendData={cccTrendData}
      shipTimeTrendData={shipTimeTrendData}
      additionalMetrics={additionalMetrics}
      currentGoal={currentGoal}
      vendorBreakdownData={vendorBreakdownData}
      slaSuggestions={slaSuggestions}
      heatmapData={heatmapData}
    />
  );
}
