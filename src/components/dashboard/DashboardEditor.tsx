"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardSharp as Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-sharp";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Eye, EyeOff } from "lucide-react";
import { CardConfig, LayoutState, saveLayout } from "@/lib/dashboard-config";

interface DashboardEditorProps {
  layout: LayoutState;
  onLayoutChange: (layout: LayoutState) => void;
  onClose: () => void;
}

export function DashboardEditor({ layout, onLayoutChange, onClose }: DashboardEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [localLayout, setLocalLayout] = useState<LayoutState>(layout);
  
  useEffect(() => {
    const run = () => setMounted(true);
    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (callback: () => void) => void }).requestIdleCallback(run);
    } else {
      setTimeout(run, 100);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-4 z-50 bg-white dark:bg-gray-950 border rounded shadow-lg flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading editor...</div>
      </div>
    );
  }

  const handleToggleVisibility = (key: string) => {
    const newLayout = localLayout.map(card => 
      card.key === key ? { ...card, visible: !card.visible } : card
    );
    setLocalLayout(newLayout);
  };

  const handleSave = () => {
    saveLayout(localLayout);
    onLayoutChange(localLayout);
    onClose();
  };

  const cardLabels: Record<string, string> = {
    goal: "Goal Progress",
    timeSavings: "Time Savings",
    costSavings: "Cost Savings",
    kpiRevenue: "Revenue KPI",
    kpiCommission: "Commission KPI",
    kpiOpenOrders: "Open Orders KPI",
    kpiTimeSaved: "Time Saved KPI",
    cccTrend: "CCC Trend Chart",
    shipTrend: "Shipping Trend Chart",
    vendorRegion: "Vendor Breakdown",
    suggestions: "SLA Suggestions",
    heatmap: "Activity Heatmap",
  };

  return (
    <Card className="fixed inset-4 z-50 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Edit Dashboard</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {localLayout.map((card) => (
            <div key={card.key} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded">
              <GripVertical className="h-4 w-4 text-gray-400" />
              <Checkbox
                id={card.key}
                checked={card.visible}
                onCheckedChange={() => handleToggleVisibility(card.key)}
              />
              <label htmlFor={card.key} className="flex-1 text-sm font-medium">
                {cardLabels[card.key] || card.key}
              </label>
              {card.visible ? (
                <Eye className="h-4 w-4 text-gray-400" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
