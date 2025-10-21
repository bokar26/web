"use client";

import { CardSharp as Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-sharp";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricChartClientProps {
  title: string;
  data: { name: string; value: number }[];
  dataKey: string;
  currentValue: number;
  comparisonValue: number;
  unit?: string;
  trend?: "up" | "down";
}

export function MetricChartClient({
  title,
  data,
  dataKey,
  currentValue,
  comparisonValue,
  unit,
  trend,
}: MetricChartClientProps) {
  const isPositive = trend === "up";
  const isNegative = trend === "down";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-ink-600 dark:text-ink-300">
          {title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-ink-900 dark:text-ink-50 leading-tight">
            {currentValue}
            {unit && <span className="ml-1 text-sm font-medium text-ink-500">{unit}</span>}
          </span>
          {trend && (
            <div
              className={cn(
                "flex items-center text-xs font-semibold",
                isPositive && "text-emerald-600 dark:text-emerald-400",
                isNegative && "text-red-600 dark:text-red-400"
              )}
            >
              {trend === "up" ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {((currentValue - comparisonValue) / comparisonValue * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-48 pb-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-ink-200 dark:stroke-ink-700" />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="hsl(var(--emerald-500))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
