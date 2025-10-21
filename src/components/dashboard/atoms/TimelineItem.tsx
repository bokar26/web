"use client";

import { cn } from "@/lib/utils";

interface TimelineItemProps {
  icon: string;
  text: string;
  timestamp: string;
  type?: "shipment" | "breach" | "sync" | "info";
  className?: string;
}

export function TimelineItem({ 
  icon, 
  text, 
  timestamp, 
  type = "info",
  className 
}: TimelineItemProps) {
  const typeClasses = {
    shipment: "text-blue-400",
    breach: "text-red-400", 
    sync: "text-green-400",
    info: "text-gray-400"
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  return (
    <div className={cn("timeline-item", className)}>
      <div className="flex items-start space-x-3">
        <div className={cn("text-lg", typeClasses[type])}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium">
            {text}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatTimestamp(timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}
