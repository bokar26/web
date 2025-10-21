"use client";

import { useMemo } from "react";

interface TrendHeatmapProps {
  data: { date: string; value: number }[];
}

export function TrendHeatmap({ data }: TrendHeatmapProps) {
  const today = new Date();
  const days = 210; // ~7 months
  
  const map = useMemo(() => new Map(data.map(d => [d.date, d.value])), [data]);
  
  const cells = useMemo(() => {
    return Array.from({ length: days }, (_, i) => {
      const dt = new Date();
      dt.setDate(today.getDate() - (days - 1 - i));
      const key = dt.toISOString().slice(0, 10);
      const val = map.get(key) ?? 0;
      
      // Bucket values into intensity levels
      const bucket = val === 0 ? 0 : val > 200 ? 4 : val > 120 ? 3 : val > 60 ? 2 : 1;
      
      return { key, dt, val, bucket };
    });
  }, [days, map, today]);

  return (
    <div className="space-y-2">
      <div 
        className="grid gap-[1.5px]" 
        style={{ gridTemplateColumns: "repeat(30, 12px)", gridAutoFlow: "row" }}
      >
        {cells.map(c => (
          <div
            key={c.key}
            title={`${c.val} activities on ${c.dt.toDateString()}`}
            className={[
              "h-3 w-3 transition-colors hover:ring-1 hover:ring-emerald-500",
              c.bucket === 0 && "bg-gray-100 dark:bg-gray-800",
              c.bucket === 1 && "bg-emerald-100 dark:bg-emerald-900/50",
              c.bucket === 2 && "bg-emerald-200 dark:bg-emerald-800/60",
              c.bucket === 3 && "bg-emerald-300 dark:bg-emerald-700/70",
              c.bucket === 4 && "bg-emerald-400 dark:bg-emerald-600/80",
            ].filter(Boolean).join(" ")}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
        <span>Activity trends (last ~7 months)</span>
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800" />
            <div className="w-3 h-3 bg-emerald-100 dark:bg-emerald-900/50" />
            <div className="w-3 h-3 bg-emerald-200 dark:bg-emerald-800/60" />
            <div className="w-3 h-3 bg-emerald-300 dark:bg-emerald-700/70" />
            <div className="w-3 h-3 bg-emerald-400 dark:bg-emerald-600/80" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
