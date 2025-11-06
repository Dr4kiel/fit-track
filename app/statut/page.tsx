"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Area, AreaChart, ResponsiveContainer } from "recharts"
import HeatMap from '@uiw/react-heat-map'
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Types pour les données de l'API
interface WeightEntry {
  date: string;
  weight: number;
  rawDate: Date;
}

interface ActivityEntry {
  date: string;
  completed: number;
  total: number;
}

interface CalendarData {
  [key: string]: {
    completed: number;
    total: number;
  };
}

interface Stats {
  currentWeight: number | null;
  startWeight: number | null;
  totalActivities: number;
  completionRate: number;
  totalWorkouts: number;
}

interface StatsData {
  weightData: WeightEntry[];
  activityData: ActivityEntry[];
  calendarData: CalendarData;
  stats: Stats;
}

// Type pour les données de la heatmap
interface HeatMapValue {
  date: string;
  count: number;
}

const weightChartConfig = {
  weight: {
    label: "Poids (kg)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const activityChartConfig = {
  completed: {
    label: "Activités complétées",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function StatutPage() {
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des statistiques')
        }
        const data = await response.json()
        setStatsData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-balance mb-2">Statut du compte</h1>
            <p className="text-muted-foreground">Suivez votre progression et vos statistiques</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[300px] w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-balance mb-2">Statut du compte</h1>
            <p className="text-muted-foreground">Suivez votre progression et vos statistiques</p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-destructive">Erreur: {error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!statsData) return null

  const { weightData, activityData, calendarData, stats } = statsData
  const currentWeight = stats.currentWeight
  const startWeight = stats.startWeight
  const weightChange = currentWeight && startWeight ? currentWeight - startWeight : 0
  const totalActivities = stats.totalActivities

  console.log('Données des statistiques:', stats)

  // Préparer les données pour la HeatMap
  const prepareHeatmapData = (): HeatMapValue[] => {
    if (!calendarData || typeof calendarData !== 'object') {
      return []
    }

    const heatmapData: HeatMapValue[] = []
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    // Générer 365 jours de données (d'il y a un an à aujourd'hui)
    Object.entries(calendarData).forEach(([dateStr, data]: [string, { completed: number; total: number }]) => {
      if (dateStr <= todayStr) {
        // Convertir de "2025-11-06" vers "2025/11/6" pour la heatmap
        const date = new Date(dateStr)
        const heatmapDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`

        if (data.completed <= 0)
          return;

        // Calculer l'intensité basée sur le pourcentage de complétion
        let intensity = 0
        if (data.total > 0) {
          const completionRate = data.completed / data.total
          if (completionRate >= 1) intensity = 4      // 100% = excellente
          else if (completionRate >= 0.75) intensity = 3  // 75-99% = bonne
          else if (completionRate >= 0.5) intensity = 2   // 50-74% = modérée
          else if (completionRate > 0) intensity = 1      // 1-49% = faible
          // 0% reste à 0 = aucune
        }

        heatmapData.push({
          date: heatmapDate,
          count: intensity
        })
      }
    })

    console.log('Données de la heatmap:', heatmapData)

    return heatmapData
  }

  const heatmapData = prepareHeatmapData()

  // Dates de début et fin pour la heatmap
  const startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - 1)
  const endDate = new Date()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance mb-2">Statut du compte</h1>
          <p className="text-muted-foreground">Suivez votre progression et vos statistiques</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Poids actuel</CardDescription>
              <CardTitle className="text-3xl">
                {currentWeight ? `${currentWeight} kg` : 'N/A'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {currentWeight && startWeight ? (
                  <>
                    {weightChange > 0 ? "+" : ""}
                    {weightChange.toFixed(1)} kg depuis le début
                  </>
                ) : (
                  'Aucune donnée de poids'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Activités complétées</CardDescription>
              <CardTitle className="text-3xl">{totalActivities}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Taux de complétion</CardDescription>
              <CardTitle className="text-3xl">
                {stats.completionRate}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Moyenne mensuelle</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Weight Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Suivi du poids</CardTitle>
              <CardDescription>Évolution de votre poids sur les 30 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              {weightData.length > 0 ? (
                <ChartContainer config={weightChartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weightData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(value) => value.split(" ")[0]}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        domain={weightData.length > 1 ? ["dataMin - 1", "dataMax + 1"] : undefined}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="var(--color-weight)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-weight)", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Aucune donnée de poids disponible</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Suivi des activités</CardTitle>
              <CardDescription>Nombre d'activités complétées par jour</CardDescription>
            </CardHeader>
            <CardContent>
              {activityData.length > 0 ? (
                <ChartContainer config={activityChartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={activityData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(value) => value.split(" ")[0]}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        domain={[0, Math.max(...activityData.map(d => d.total), 1)]}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stroke="var(--color-completed)"
                        fill="var(--color-completed)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Aucune donnée d'activité disponible</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity HeatMap */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Historique d'activités</CardTitle>
            <CardDescription>Visualisez votre régularité d'activité sur l'année écoulée</CardDescription>
            <div className="flex gap-4 mt-4 text-sm flex-wrap items-center">
              <span className="text-muted-foreground mr-2">Moins</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-slate-200" title="0% - Aucune activité" />
                <div className="w-3 h-3 rounded-sm bg-green-200" title="1-49% - Faible complétion" />
                <div className="w-3 h-3 rounded-sm bg-green-400" title="50-74% - Complétion modérée" />
                <div className="w-3 h-3 rounded-sm bg-green-600" title="75-99% - Bonne complétion" />
                <div className="w-3 h-3 rounded-sm bg-green-800" title="100% - Complétion excellente" />
              </div>
              <span className="text-muted-foreground ml-2">Plus</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              {heatmapData.length > 0 ? (
                <HeatMap
                  value={heatmapData}
                  startDate={startDate}
                  endDate={endDate}
                  width="100%"
                  rectProps={{
                    rx: 2,
                  }}
                  panelColors={{
                    0: '#f1f5f9',   // slate-100 - Aucune activité
                    1: '#bbf7d0',   // green-200 - Faible activité  
                    2: '#86efac',   // green-300 - Activité modérée
                    3: '#4ade80',   // green-400 - Bonne activité
                    4: '#22c55e'    // green-500 - Activité excellente
                  }}
                  rectRender={(props, data) => {
                    // Convertir le format de date de "2025/11/6" vers "2025-11-06" pour retrouver les données
                    const [year, month, day] = data.date.split('/')
                    const dateKey = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
                    const dayData = calendarData[dateKey]
                    let tooltip = `${data.date}: `

                    if (dayData) {
                      tooltip += `${dayData.completed}/${dayData.total} activités complétées`
                      if (dayData.total > 0) {
                        const percentage = Math.round((dayData.completed / dayData.total) * 100)
                        tooltip += ` (${percentage}%)`
                      }
                    } else {
                      tooltip += 'Aucune activité'
                    }

                    return (
                      <rect
                        {...props}
                        style={{
                          ...props.style,
                          cursor: 'pointer'
                        }}
                      >
                        <title>{tooltip}</title>
                      </rect>
                    )
                  }}
                />
              ) : (
                <div className="h-40 flex items-center justify-center">
                  <p className="text-muted-foreground">Aucune donnée d'activité disponible</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
