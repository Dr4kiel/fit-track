'use client'
import { WorkoutCard } from "@/components/dashboard/workout_card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Activity, CheckCircle2, Circle, Dumbbell, Timer } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

type Activity = {
  id: number
  name: string
  type: "cardio" | "musculation" | "stretching"
  sets: number
  repetitions: number
  unit: string
  completed: boolean
  dailyLogs: Array<any>
}

export default function DashboardPage() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isDailyWeight, setIsDailyWeight] = useState(true);
  const [weight, setWeight] = useState<number | "">("");


  useMemo(() => {
    const fetchWeightEntry = async () => {
      try {
        const response = await fetch('/api/weightentry/today');
        const data = await response.json();
        if (response.status === 200 && data.weightEntry) {
          setIsDailyWeight(true);
        } else {
          setIsDailyWeight(false);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des entrées de poids:', error);
      }
    };

    fetchWeightEntry();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/workout');
      const data = await response.json();
      if (data.workouts)
        setActivities(data.workouts);
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  function handleWeightSubmit() {
    const submitWeight = async () => {
      try {
        const response = await fetch('/api/weightentry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ weight }),
        });
        if (response.status === 201) {
          setIsDailyWeight(true);
        } else {
          console.error('Erreur lors de l\'enregistrement du poids');
        }
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du poids:', error);
      }
    };

    submitWeight();
  }

  const completedCount = activities.filter(activity => activity.dailyLogs && activity.dailyLogs.length > 0).length
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
          {totalCount > 0 && (
            <Card className="bg-primary/70 text-primary-foreground shadow-lg border-0 relative overflow-hidden">
              {/* Background pattern effect */}
              <div className="absolute inset-0 bg-primary/70 opacity-95">
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6" />
                      Progrès du jour
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/80 text-base mt-1">
                      {completedCount} sur {totalCount} activités complétées
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{Math.round(progressPercentage)}%</div>
                    <div className="text-sm text-primary-foreground/70">complété</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="relative">
                    <Progress
                      value={progressPercentage}
                      className="h-4 bg-accent-foreground border border-primary-foreground/30"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-foreground mix-blend-difference">
                        {completedCount}/{totalCount}
                      </span>
                    </div>
                  </div>

                  {/* Visual Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-primary-foreground/10 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center justify-center mb-1">
                        <CheckCircle2 className="h-5 w-5 text-green-300" />
                      </div>
                      <div className="text-xl font-bold">{completedCount}</div>
                      <div className="text-xs text-primary-foreground/70">Terminées</div>
                    </div>

                    <div className="text-center p-3 bg-primary-foreground/10 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center justify-center mb-1">
                        <Circle className="h-5 w-5 text-orange-300" />
                      </div>
                      <div className="text-xl font-bold">{totalCount - completedCount}</div>
                      <div className="text-xs text-primary-foreground/70">Restantes</div>
                    </div>

                    <div className="text-center p-3 bg-primary-foreground/10 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center justify-center mb-1">
                        <Activity className="h-5 w-5 text-blue-300" />
                      </div>
                      <div className="text-xl font-bold">{totalCount}</div>
                      <div className="text-xs text-primary-foreground/70">Total</div>
                    </div>
                  </div>

                  {/* Motivational Message */}
                  {progressPercentage === 100 ? (
                    <div className="text-center p-3 bg-green-500/20 rounded-lg border border-green-400/30">
                      <div className="text-lg font-semibold text-green-100">🎉 Félicitations !</div>
                      <div className="text-sm text-green-200">Toutes vos activités sont terminées aujourd'hui !</div>
                    </div>
                  ) : progressPercentage >= 75 ? (
                    <div className="text-center p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                      <div className="text-sm font-medium text-yellow-100">Excellent travail ! Plus que {totalCount - completedCount} activité{totalCount - completedCount > 1 ? 's' : ''} !</div>
                    </div>
                  ) : progressPercentage >= 50 ? (
                    <div className="text-center p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                      <div className="text-sm font-medium text-blue-100">Bon rythme ! Continuez comme ça !</div>
                    </div>
                  ) : progressPercentage > 0 ? (
                    <div className="text-center p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
                      <div className="text-sm font-medium text-purple-100">C'est parti ! Chaque effort compte !</div>
                    </div>
                  ) : (
                    <div className="text-center p-3 bg-gray-500/20 rounded-lg border border-gray-400/30">
                      <div className="text-sm font-medium text-gray-100">Commencez votre journée d'entraînement !</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Weight Reminder */}
          {!isDailyWeight && (
            <Card className="mt-6 border border-yellow-400 bg-yellow-50">
              <CardContent>
                <div className="flex items-center gap-4">
                  <Activity className="h-6 w-6 text-yellow-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">N'oubliez pas d'enregistrer votre poids aujourd'hui !</h3>
                    <p className="text-yellow-700">Suivre votre poids quotidiennement vous aide à rester sur la bonne voie.</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Input type="number" id="weight" step={0.01} placeholder="Entrez votre poids en kg" className="mt-2 max-w-xs" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
                      <span>Kg</span>
                    </div>
                    <Button className="mt-2" onClick={handleWeightSubmit}>Enregistrer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Activités du jour</h2>

          {/* if activities are empty */}
          {activities.length === 0 && (
            <p className="text-muted-foreground">Aucune activité programmée pour aujourd'hui.</p>
          )}

          {activities.map((activity) => {
            return (
              <WorkoutCard key={activity.id} activity={activity} refresh={fetchActivities} />
            )
          })}
        </div>
      </div>
    </div>
  )
}
