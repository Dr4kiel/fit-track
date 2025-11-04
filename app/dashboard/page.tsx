import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Dumbbell, Timer } from "lucide-react"

// Mock data for activities
const activities = [
  {
    id: 1,
    name: "Course matinale",
    type: "cardio",
    sets: 1,
    reps: 30,
    unit: "minutes",
    completed: false,
    icon: Timer,
  },
  {
    id: 2,
    name: "Pompes",
    type: "musculation",
    sets: 3,
    reps: 15,
    unit: "répétitions",
    completed: true,
    icon: Dumbbell,
  },
  {
    id: 3,
    name: "Squats",
    type: "musculation",
    sets: 3,
    reps: 20,
    unit: "répétitions",
    completed: true,
    icon: Dumbbell,
  },
  {
    id: 4,
    name: "Planche",
    type: "musculation",
    sets: 3,
    reps: 60,
    unit: "secondes",
    completed: false,
    icon: Timer,
  },
  {
    id: 5,
    name: "Étirements",
    type: "stretching",
    sets: 1,
    reps: 15,
    unit: "minutes",
    completed: false,
    icon: Timer,
  },
]

export default function DashboardPage() {
  const completedCount = activities.filter((a) => a.completed).length
  const totalCount = activities.length
  const progressPercentage = (completedCount / totalCount) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-balance">Tableau de bord</h1>
            <p className="text-muted-foreground mt-2">Suivez vos activités quotidiennes</p>
          </div>

          {/* Overall Progress Card */}
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Progrès du jour</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                {completedCount} sur {totalCount} activités complétées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-3 bg-primary-foreground/20" />
                <p className="text-sm text-right font-medium">{Math.round(progressPercentage)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Activités du jour</h2>

          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <Card
                key={activity.id}
                className={`transition-all ${
                  activity.completed ? "bg-muted/50 border-primary/20" : "hover:border-primary/50"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Completion Status */}
                    <button
                      className="flex-shrink-0"
                      aria-label={activity.completed ? "Marquer comme non complété" : "Marquer comme complété"}
                    >
                      {activity.completed ? (
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                      ) : (
                        <Circle className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>

                    {/* Activity Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg font-semibold ${
                          activity.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {activity.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {activity.sets > 1
                          ? `${activity.sets} séries × ${activity.reps} ${activity.unit}`
                          : `${activity.reps} ${activity.unit}`}
                      </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex-shrink-0 text-right">
                      {activity.completed ? (
                        <span className="text-sm font-medium text-primary">Terminé</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">À faire</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
