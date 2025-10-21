"use client";

import dynamic from "next/dynamic";
import { MetricChartClient } from "./MetricChartClient";

// Dynamically import the chart component to prevent SSR issues
const MetricChart = dynamic(() => Promise.resolve(MetricChartClient), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] flex items-center justify-center">
      <div className="text-ink-500 dark:text-ink-400">Loading chart...</div>
    </div>
  ),
});

export { MetricChart };