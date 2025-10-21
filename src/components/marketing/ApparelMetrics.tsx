import { Card, CardContent } from "@/components/ui/card"
import { Clock, DollarSign, CheckCircle, TrendingDown } from "lucide-react"

const metrics = [
  {
    icon: TrendingDown,
    title: "Cash Conversion Cycle (CCC)",
    value: "66",
    unit: "days",
    formula: "CCC = DIO + DSO − DPO",
    description: "Shorten your cash cycle to reinvest faster in what sells.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900",
  },
  {
    icon: DollarSign,
    title: "Landed Costs",
    value: "$6.42",
    unit: "per unit",
    description: "Know your all-in cost—product, freight, and duties—before you commit.",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900",
  },
  {
    icon: Clock,
    title: "Shipping Time",
    value: "25",
    unit: "days",
    description: "Cut door-to-door days with predictive logistics and better routing.",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900",
  },
  {
    icon: CheckCircle,
    title: "On-Time Delivery",
    value: "96",
    unit: "%",
    description: "Improve supplier reliability and launch on time every season.",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900",
  },
]

export function ApparelMetrics() {
  return (
    <section className="section-tight">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 dark:text-ink-50 mb-3">
            The metrics that matter
          </h2>
          <p className="text-lg sm:text-xl text-ink-600 dark:text-ink-300 max-w-3xl mx-auto">
            Reduce landed cost, shorten cycle times, and increase on-time deliveries — verified in your data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-200 border-ink-200 dark:border-ink-700 hover:border-emerald-200 bg-white dark:bg-ink-800/50"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${metric.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-ink-900 dark:text-ink-50 mb-2">
                    {metric.title}
                  </h3>
                  
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-ink-900 dark:text-ink-50">
                      {metric.value}
                    </span>
                    <span className="text-sm text-ink-600 dark:text-ink-300 ml-1">
                      {metric.unit}
                    </span>
                  </div>

                  {metric.formula && (
                    <p className="text-xs text-ink-500 dark:text-ink-400 mb-3 font-mono bg-ink-50 dark:bg-ink-800 px-2 py-1 rounded">
                      {metric.formula}
                    </p>
                  )}
                  
                  <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
