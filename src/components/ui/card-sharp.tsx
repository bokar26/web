"use client";
import * as React from "react";
import {
  Card as BaseCard,
  CardHeader as BaseCardHeader,
  CardTitle as BaseCardTitle,
  CardDescription as BaseCardDescription,
  CardContent as BaseCardContent,
  CardFooter as BaseCardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Sharp, compact root <Card>
export const CardSharp = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCard>>(
  ({ className, ...props }, ref) => (
    <BaseCard
      ref={ref}
      className={cn("rounded-none border shadow-sm bg-card px-4 py-3", className)}
      {...props}
    />
  )
);
CardSharp.displayName = "CardSharp";

// Re-export the rest so imports keep working.
// These don't need sharp classes; rounding lives on the root.
export const CardHeader = BaseCardHeader;
export const CardTitle = BaseCardTitle;
export const CardDescription = BaseCardDescription;
export const CardContent = BaseCardContent;
export const CardFooter = BaseCardFooter;