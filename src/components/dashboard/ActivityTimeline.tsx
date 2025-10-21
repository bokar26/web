"use client";

import { GlassCard } from "./atoms/GlassCard";
import { TimelineItem } from "./atoms/TimelineItem";
import { activityTimeline } from "@/lib/mockData";
import { Activity, RefreshCw } from "lucide-react";

export function ActivityTimeline() {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Activity Timeline</span>
        </h3>
        <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1 max-h-80 overflow-y-auto">
        {activityTimeline.map((item) => (
          <TimelineItem
            key={item.id}
            icon={item.icon}
            text={item.text}
            timestamp={item.timestamp}
            type={item.type}
          />
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 text-center">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </GlassCard>
  );
}
