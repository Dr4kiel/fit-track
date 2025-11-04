"use client"
import { ActivityCard } from "./activity-card"
import { Timer, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface CardioActivityProps {
  name: string
  duration: number // in minutes
  distance?: number // in km
  completed?: boolean
  onToggle?: () => void
  showStats?: boolean
  currentProgress?: number // percentage
}

export function CardioActivity({
  name,
  duration,
  distance,
  completed = false,
  onToggle,
  showStats = false,
  currentProgress = 0,
}: CardioActivityProps) {
  const details = distance ? `${duration} minutes • ${distance} km` : `${duration} minutes`

  if (showStats) {
    return (
      <Card className="border-orange-500/20 bg-orange-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Timer className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">{name}</CardTitle>
              <p className="text-sm text-muted-foreground">{details}</p>
            </div>
            <Zap className="h-5 w-5 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{currentProgress}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ActivityCard
      name={name}
      icon={<Timer className="h-6 w-6 text-orange-600" />}
      details={details}
      completed={completed}
      onToggle={onToggle}
      variant="cardio"
    />
  )
}
