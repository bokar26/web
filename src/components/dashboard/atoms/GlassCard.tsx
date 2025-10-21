"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "dark" | "light";
  glow?: "green" | "red" | "amber" | "none";
  hover?: boolean;
}

export function GlassCard({ 
  children, 
  className, 
  variant = "dark", 
  glow = "none",
  hover = true 
}: GlassCardProps) {
  const baseClasses = "glass-card dashboard-transition";
  const variantClasses = variant === "light" ? "glass-card-light" : "";
  const glowClasses = glow !== "none" ? `gradient-${glow}-glow` : "";
  const hoverClasses = hover ? "hover:transform hover:-translate-y-0.5" : "";

  return (
    <div className={cn(
      baseClasses,
      variantClasses,
      glowClasses,
      hoverClasses,
      className
    )}>
      {children}
    </div>
  );
}
