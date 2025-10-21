"use client";

import dynamic from "next/dynamic";
import { VendorBreakdownClient } from "./VendorBreakdownClient";

// Dynamically import the chart component to prevent SSR issues
const VendorBreakdown = dynamic(() => Promise.resolve(VendorBreakdownClient), {
  ssr: false,
  loading: () => (
    <div className="h-[250px] flex items-center justify-center">
      <div className="text-ink-500 dark:text-ink-400">Loading chart...</div>
    </div>
  ),
});

export { VendorBreakdown };