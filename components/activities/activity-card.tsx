"use client"

import type * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CheckCircle2, Circle } from "lucide-react"

interface ActivityCardProps {
  name: string
  icon: React.ReactNode
  details: string
  completed?: boolean
  onToggle?: () => void
  variant?: "cardio" | "strength" | "stretching" | "default"
  className?: string
}

const variantStyles = {
  cardio: "border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40",
  strength: "border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40",
  stretching: "border-green-500/20 bg-green-500/5 hover:border-green-500/40",
  default: "hover:border-primary/50",
}

export function ActivityCard({
  name,
  icon,
  details,
  completed = false,
  onToggle,
  variant = "default",
  className,
}: ActivityCardProps) {
  return (
    <Card
      className={cn("transition-all", completed && "bg-muted/50 border-primary/20", variantStyles[variant], className)}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Completion Status */}
          {onToggle && (
            <button
              className="flex-shrink-0"
              onClick={onToggle}
              aria-label={completed ? "Marquer comme non complété" : "Marquer comme complété"}
            >
              {completed ? (
                <CheckCircle2 className="h-8 w-8 text-primary" />
              ) : (
                <Circle className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </button>
          )}

          {/* Activity Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>

          {/* Activity Details */}
          <div className="flex-1 min-w-0">
            <h3 className={cn("text-lg font-semibold", completed && "line-through text-muted-foreground")}>{name}</h3>
            <p className="text-sm text-muted-foreground">{details}</p>
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0 text-right">
            {completed ? (
              <span className="text-sm font-medium text-primary">Terminé</span>
            ) : (
              <span className="text-sm text-muted-foreground">À faire</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
