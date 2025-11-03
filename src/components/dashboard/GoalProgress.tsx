import { CardSharp as Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-sharp"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Edit3 } from "lucide-react"

interface GoalProgressProps {
  title: string
  progress: number
  target: number
  percentOfGoal: number
  onEditDashboard?: () => void
}

export function GoalProgress({ title, progress, target, percentOfGoal, onEditDashboard }: GoalProgressProps) {
  return (
    <Card className="dashboard-card hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="dashboard-card-title text-sm font-medium">
          Goal
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onEditDashboard}
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Edit dashboard
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Progress: +{progress}%</span>
              <span className="text-gray-600 dark:text-gray-400">{percentOfGoal}% of goal</span>
            </div>
            <Progress value={percentOfGoal} className="h-1.5 bg-gray-200 dark:bg-gray-700">
              <div 
                className="h-full bg-emerald-500 dark:bg-emerald-500 transition-all duration-300"
                style={{ width: `${percentOfGoal}%` }}
              />
            </Progress>
            <div className="text-right text-xs text-gray-500 dark:text-gray-400">
              Target: +{target}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
