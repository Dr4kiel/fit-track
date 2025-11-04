"use client"
import { ActivityCard } from "./activity-card"
import { Wind, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StretchingActivityProps {
  name: string
  duration: number // in minutes
  intensity?: "faible" | "modérée" | "élevée"
  completed?: boolean
  onToggle?: () => void
  showStats?: boolean
  focusArea?: string
}

const intensityColors = {
  faible: "text-green-600",
  modérée: "text-yellow-600",
  élevée: "text-red-600",
}

const intensityBgColors = {
  faible: "bg-green-500/10",
  modérée: "bg-yellow-500/10",
  élevée: "bg-red-500/10",
}

export function StretchingActivity({
  name,
  duration,
  intensity = "modérée",
  completed = false,
  onToggle,
  showStats = false,
  focusArea,
}: StretchingActivityProps) {
  const details = `${duration} minutes${intensity ? ` • Intensité ${intensity}` : ""}`

  if (showStats) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Wind className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">{name}</CardTitle>
              <p className="text-sm text-muted-foreground">{details}</p>
            </div>
            <Heart className="h-5 w-5 text-green-600" />
          </div>
        </CardHeader>
        {focusArea && (
          <CardContent>
            <div className="flex items-center gap-2">
              <div
                className={`px-2 py-1 rounded-md text-xs font-medium ${intensityBgColors[intensity]} ${intensityColors[intensity]}`}
              >
                {focusArea}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <ActivityCard
      name={name}
      icon={<Wind className="h-6 w-6 text-green-600" />}
      details={details}
      completed={completed}
      onToggle={onToggle}
      variant="stretching"
    />
  )
}
