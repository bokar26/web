import { CardSharp as Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-sharp"
import { Clock, DollarSign } from "lucide-react"
import SectionHeading from "./SectionHeading"

interface QuickActionsProps {
  timeSaved: {
    total: number
    saved: number
    withoutSLA: number
  }
  costSaved: {
    total: number
    saved: number
    withoutSLA: number
  }
}

export function QuickActions({ timeSaved, costSaved }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Time Savings */}
      <Card className="dashboard-card hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <SectionHeading label="SLA" title="Time Savings" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Total time spent: {timeSaved.total}h</span>
            <span className="text-gray-600 dark:text-gray-400">Without SLA: {timeSaved.withoutSLA}h</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(timeSaved.saved / timeSaved.withoutSLA) * 100}%` }}
            />
          </div>
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Saved: {timeSaved.saved}h
          </div>
        </CardContent>
      </Card>

      {/* Cost Savings */}
      <Card className="dashboard-card hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <SectionHeading label="SLA" title="Cost Savings" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Total spend: ${costSaved.total.toLocaleString()}</span>
            <span className="text-gray-600 dark:text-gray-400">Without SLA: ${costSaved.withoutSLA.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(costSaved.saved / costSaved.withoutSLA) * 100}%` }}
            />
          </div>
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Saved: ${costSaved.saved.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
