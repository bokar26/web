"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GaugeChartProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  showValue?: boolean;
  label?: string;
}

export function GaugeChart({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  color = "#10b981",
  className,
  showValue = true,
  label
}: GaugeChartProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const duration = 1000;
    const startTime = performance.now();
    const startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedValue(startValue + (endValue - startValue) * easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((animatedValue / max) * 100, 100);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("gauge-container", className)}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {showValue && (
        <div className="gauge-text">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.round(animatedValue)}%
            </div>
            {label && (
              <div className="text-xs text-gray-400 mt-1">
                {label}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
