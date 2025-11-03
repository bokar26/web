import { CardSharp as Card, CardContent } from "@/components/ui/card-sharp"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: number
  unit: string
  deltaPct: number
  trend: 'up' | 'down'
}

export function KpiCard({ title, value, unit, deltaPct, trend }: KpiCardProps) {
  const isPositive = trend === 'up' ? deltaPct > 0 : deltaPct < 0

  return (
    <Card className="dashboard-card hover:shadow-lg transition-shadow">
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-white">
              {title}
            </p>
            <div className="flex items-baseline mt-1">
            <p className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
              {value}
            </p>
            <p className="ml-1 text-sm text-gray-500 dark:text-white">
              {unit}
            </p>
            </div>
          </div>
          <div className={cn(
            "flex items-center text-xs font-medium",
            isPositive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          )}>
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(deltaPct)}%
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
