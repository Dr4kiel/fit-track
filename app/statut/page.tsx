"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Area, AreaChart, ResponsiveContainer, Legend } from "recharts"
import HeatMap from '@uiw/react-heat-map'
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Types pour les données de l'API
interface WeightEntry {
  date: string;
  weight: number;
  rawDate: Date;
  trend?: number;
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
    color: "hsl(217, 91%, 60%)", // Bleu
  },
  trend: {
    label: "Tendance",
    color: "hsl(142, 76%, 36%)", // Vert
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
  const [isMobile, setIsMobile] = useState(false)

  // Hook pour détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance mb-2">Statut du compte</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Suivez votre progression et vos statistiques</p>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
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
          <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 mb-8">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48 sm:w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[250px] sm:h-[300px] w-full" />
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance mb-2">Statut du compte</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Suivez votre progression et vos statistiques</p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-destructive text-sm sm:text-base">Erreur: {error}</p>
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

  // Fonction pour calculer la tendance linéaire
  const calculateTrend = (data: WeightEntry[]): WeightEntry[] => {
    if (data.length < 2) {
      // Si pas assez de données, on retourne les données sans tendance
      return data.map(point => ({ ...point, trend: point.weight }))
    }

    const n = data.length
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0

    data.forEach((point, index) => {
      sumX += index
      sumY += point.weight
      sumXY += index * point.weight
      sumXX += index * index
    })

    const denominator = n * sumXX - sumX * sumX

    // Éviter la division par zéro
    if (denominator === 0) {
      return data.map(point => ({ ...point, trend: point.weight }))
    }

    const slope = (n * sumXY - sumX * sumY) / denominator
    const intercept = (sumY - slope * sumX) / n

    return data.map((point, index) => ({
      ...point,
      trend: Number((slope * index + intercept).toFixed(2))
    }))
  }

  // Calculer les données avec tendance
  const weightDataWithTrend = calculateTrend(weightData)

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

    return heatmapData
  }

  const heatmapData = prepareHeatmapData()

  // Dates de début et fin pour la heatmap (responsive)
  const getHeatmapDates = () => {
    const endDate = new Date()
    const startDate = new Date()

    // Sur mobile/tablette, afficher 3 mois, sinon 1 an
    if (isMobile) {
      startDate.setMonth(startDate.getMonth() - 3)
    } else {
      startDate.setFullYear(startDate.getFullYear() - 1)
    }

    return { startDate, endDate }
  }

  const { startDate, endDate } = getHeatmapDates()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance mb-2">Statut du compte</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Suivez votre progression et vos statistiques</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Poids actuel</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">
                {currentWeight ? `${currentWeight} kg` : 'N/A'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {currentWeight && startWeight ? (
                  <span className={`flex items-center gap-1 ${weightChange > 0 ? 'text-red-500' : weightChange < 0 ? 'text-green-500' : 'text-muted-foreground'
                    }`}>
                    {weightChange > 0 && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 6.414V13a1 1 0 11-2 0V6.414L7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" clipRule="evenodd" />
                      </svg>
                    )}
                    {weightChange < 0 && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 17a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L9 13.586V7a1 1 0 112 0v6.586l1.293-1.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 17z" clipRule="evenodd" />
                      </svg>
                    )}
                    {weightChange > 0 ? "+" : ""}
                    {weightChange.toFixed(1)} kg depuis le début
                  </span>
                ) : (
                  <span className="text-muted-foreground">Aucune donnée de poids</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Activités complétées</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">{totalActivities}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Taux de complétion</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">
                {stats.completionRate}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Moyenne mensuelle</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 mb-8">
          {/* Weight Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Suivi du poids</CardTitle>
              <CardDescription className="text-sm">Évolution de votre poids sur les 30 derniers jours avec courbe de tendance</CardDescription>
            </CardHeader>
            <CardContent>
              {weightData.length > 0 ? (
                <ChartContainer config={weightChartConfig} className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weightDataWithTrend}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        tickFormatter={(value) => value.split(" ")[0]}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        domain={weightData.length > 1 ? ["dataMin - 1", "dataMax + 1"] : undefined}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="line"
                        wrapperStyle={{ paddingBottom: "20px" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="hsl(217, 91%, 60%)"
                        strokeWidth={2}
                        dot={{ fill: "hsl(217, 91%, 60%)", r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Poids (kg)"
                      />
                      <Line
                        type="monotone"
                        dataKey="trend"
                        stroke="hsl(142, 76%, 36%)"
                        strokeWidth={3}
                        strokeDasharray="8 4"
                        dot={false}
                        activeDot={{ r: 5, fill: "hsl(142, 76%, 36%)" }}
                        opacity={0.8}
                        name="Tendance"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground text-sm text-center">Aucune donnée de poids disponible</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Suivi des activités</CardTitle>
              <CardDescription className="text-sm">Nombre d'activités complétées par jour</CardDescription>
            </CardHeader>
            <CardContent>
              {activityData.length > 0 ? (
                <ChartContainer config={activityChartConfig} className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={activityData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        tickFormatter={(value) => value.split(" ")[0]}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
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
                <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground text-sm text-center">Aucune donnée d'activité disponible</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity HeatMap */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Historique d'activités</CardTitle>
            <CardDescription className="text-sm">
              Visualisez votre régularité d'activité sur {isMobile ? 'les 3 derniers mois' : 'l\'année écoulée'}
            </CardDescription>
            <div className="flex gap-2 sm:gap-4 mt-4 text-xs sm:text-sm flex-wrap items-center">
              <span className="text-muted-foreground">Moins</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm bg-slate-200" title="0% - Aucune activité" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm bg-green-200" title="1-49% - Faible complétion" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm bg-green-400" title="50-74% - Complétion modérée" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm bg-green-600" title="75-99% - Bonne complétion" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm bg-green-800" title="100% - Complétion excellente" />
              </div>
              <span className="text-muted-foreground">Plus</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`w-full flex justify-center ${isMobile ? '' : 'overflow-x-auto'} pb-4`}>
              <div className={isMobile ? 'w-full max-w-sm flex justify-center' : 'min-w-[800px] flex justify-center'}>
                {heatmapData.length > 0 ? (
                  <HeatMap
                    value={heatmapData}
                    startDate={startDate}
                    endDate={endDate}
                    width={isMobile ? 320 : 800}
                    rectProps={{
                      rx: 2,
                    }}
                    panelColors={{
                      0: '#f1f5f9',   // slate-100 - Aucune activité
                      1: '#bbf7d0',   // green-200 - Faible activité  
                      2: '#86efac',   // green-300 - Activité modérée
                      3: '#4ade80',   // green-400 - Bonne activité
                      4: '#15803d'    // green-600 - Activité excellente
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
                  <div className="h-40 w-full flex items-center justify-center">
                    <p className="text-muted-foreground text-sm text-center">Aucune donnée d'activité disponible</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
