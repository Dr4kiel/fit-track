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

  useEffect(() => {
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
          {totalCount > 0 && (
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
              <WorkoutCard key={activity.id} activity={activity} />
            )
          })}
        </div>
      </div>
    </div>
  )
}
