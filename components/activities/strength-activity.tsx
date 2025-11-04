"use client"
import { ActivityCard } from "./activity-card"
import { Dumbbell, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StrengthActivityProps {
  name: string
  sets: number
  reps: number
  weight?: number // in kg
  completed?: boolean
  onToggle?: () => void
  showStats?: boolean
  muscleGroup?: string
}

export function StrengthActivity({
  name,
  sets,
  reps,
  weight,
  completed = false,
  onToggle,
  showStats = false,
  muscleGroup,
}: StrengthActivityProps) {
  const details = weight
    ? `${sets} séries × ${reps} répétitions • ${weight} kg`
    : `${sets} séries × ${reps} répétitions`

  if (showStats) {
    return (
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">{name}</CardTitle>
              <p className="text-sm text-muted-foreground">{details}</p>
            </div>
            {muscleGroup && (
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-700">
                {muscleGroup}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-muted-foreground">Volume total: {sets * reps * (weight || 0)} kg</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ActivityCard
      name={name}
      icon={<Dumbbell className="h-6 w-6 text-blue-600" />}
      details={details}
      completed={completed}
      onToggle={onToggle}
      variant="strength"
    />
  )
}
