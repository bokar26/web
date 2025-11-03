import { CardSharp as Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-sharp"
import { Badge } from "@/components/ui/badge"
import { Lightbulb } from "lucide-react"

interface SLASuggestionsProps {
  suggestions: Array<{
    title: string
    description: string
    impact: string
    type: 'optimization' | 'cost' | 'time'
  }>
}

export function SLASuggestions({ suggestions }: SLASuggestionsProps) {
  return (
    <Card className="dashboard-card hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="dashboard-card-title text-sm font-medium flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-emerald-500" />
          SLA suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="space-y-2">
            <p className="text-xs font-medium text-gray-900 dark:text-white">
              {suggestion.title}
            </p>
            <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-tight">
              {suggestion.description}
            </p>
            <div className="flex items-center">
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
              >
                {suggestion.impact}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
