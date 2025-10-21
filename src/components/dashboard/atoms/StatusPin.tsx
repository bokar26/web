"use client";

import { cn } from "@/lib/utils";

interface StatusPinProps {
  status: "green" | "amber" | "red";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  title?: string;
}

export function StatusPin({ 
  status, 
  size = "md", 
  className, 
  onClick,
  title 
}: StatusPinProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3", 
    lg: "w-4 h-4"
  };

  const statusClasses = {
    green: "bg-green-500",
    amber: "bg-amber-500",
    red: "bg-red-500"
  };

  return (
    <div
      className={cn(
        "map-pin",
        sizeClasses[size],
        statusClasses[status],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      title={title}
    />
  );
}
