"use client";

import { CardSharp as Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-sharp";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Mainland China", value: 400 },
  { name: "Bangladesh", value: 300 },
  { name: "Vietnam", value: 300 },
  { name: "India", value: 200 },
  { name: "Other", value: 100 },
];

const COLORS = ["#047857", "#10B981", "#6EE7B7", "#A7F3D0", "#D1FAE5"]; // Emerald shades

export function VendorBreakdownClient() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-ink-900 dark:text-ink-50">
          Vendor Regional Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
