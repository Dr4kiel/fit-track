"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Area, AreaChart, ResponsiveContainer } from "recharts"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"

// Mock weight data (last 30 days)
const weightData = [
  { date: "1 Jan", weight: 75.5 },
  { date: "3 Jan", weight: 75.2 },
  { date: "5 Jan", weight: 75.0 },
  { date: "7 Jan", weight: 74.8 },
  { date: "9 Jan", weight: 74.5 },
  { date: "11 Jan", weight: 74.3 },
  { date: "13 Jan", weight: 74.2 },
  { date: "15 Jan", weight: 74.0 },
  { date: "17 Jan", weight: 73.8 },
  { date: "19 Jan", weight: 73.5 },
  { date: "21 Jan", weight: 73.3 },
  { date: "23 Jan", weight: 73.2 },
  { date: "25 Jan", weight: 73.0 },
  { date: "27 Jan", weight: 72.8 },
  { date: "29 Jan", weight: 72.5 },
  { date: "31 Jan", weight: 72.3 },
]

// Mock activity completion data (last 30 days)
const activityData = [
  { date: "1 Jan", completed: 3, total: 5 },
  { date: "3 Jan", completed: 5, total: 5 },
  { date: "5 Jan", completed: 4, total: 5 },
  { date: "7 Jan", completed: 5, total: 5 },
  { date: "9 Jan", completed: 2, total: 5 },
  { date: "11 Jan", completed: 5, total: 5 },
  { date: "13 Jan", completed: 5, total: 5 },
  { date: "15 Jan", completed: 4, total: 5 },
  { date: "17 Jan", completed: 5, total: 5 },
  { date: "19 Jan", completed: 3, total: 5 },
  { date: "21 Jan", completed: 5, total: 5 },
  { date: "23 Jan", completed: 5, total: 5 },
  { date: "25 Jan", completed: 4, total: 5 },
  { date: "27 Jan", completed: 5, total: 5 },
  { date: "29 Jan", completed: 5, total: 5 },
  { date: "31 Jan", completed: 3, total: 5 },
]

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

// Mock calendar data - dates with completion status
const calendarData = {
  "2025-01-01": { completed: 3, total: 5 },
  "2025-01-02": { completed: 5, total: 5 },
  "2025-01-03": { completed: 5, total: 5 },
  "2025-01-04": { completed: 4, total: 5 },
  "2025-01-05": { completed: 5, total: 5 },
  "2025-01-06": { completed: 2, total: 5 },
  "2025-01-07": { completed: 5, total: 5 },
  "2025-01-08": { completed: 5, total: 5 },
  "2025-01-09": { completed: 4, total: 5 },
  "2025-01-10": { completed: 5, total: 5 },
  "2025-01-11": { completed: 3, total: 5 },
  "2025-01-12": { completed: 5, total: 5 },
  "2025-01-13": { completed: 5, total: 5 },
  "2025-01-14": { completed: 4, total: 5 },
  "2025-01-15": { completed: 5, total: 5 },
  "2025-01-16": { completed: 5, total: 5 },
  "2025-01-17": { completed: 3, total: 5 },
  "2025-01-18": { completed: 5, total: 5 },
  "2025-01-19": { completed: 4, total: 5 },
  "2025-01-20": { completed: 5, total: 5 },
  "2025-01-21": { completed: 2, total: 5 },
  "2025-01-22": { completed: 5, total: 5 },
  "2025-01-23": { completed: 5, total: 5 },
  "2025-01-24": { completed: 4, total: 5 },
  "2025-01-25": { completed: 5, total: 5 },
  "2025-01-26": { completed: 3, total: 5 },
  "2025-01-27": { completed: 5, total: 5 },
  "2025-01-28": { completed: 5, total: 5 },
  "2025-01-29": { completed: 4, total: 5 },
  "2025-01-30": { completed: 5, total: 5 },
  "2025-01-31": { completed: 3, total: 5 },
  "2025-02-01": { completed: 5, total: 5 },
  "2025-02-02": { completed: 4, total: 5 },
  "2025-02-03": { completed: 2, total: 5 },
  "2025-02-04": { completed: 3, total: 5 }, // Today - incomplete
}

export default function StatutPage() {
  const currentWeight = weightData[weightData.length - 1].weight
  const startWeight = weightData[0].weight
  const weightChange = currentWeight - startWeight
  const totalActivities = activityData.reduce((sum, day) => sum + day.completed, 0)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const getDayClassName = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    const dayData = calendarData[dateStr]
    const today = new Date()
    const todayStr = today.toISOString().split("T")[0]
    const isToday = dateStr === todayStr
    const isPast = date < today && dateStr !== todayStr

    if (dayData) {
      const isComplete = dayData.completed === dayData.total

      if (isToday && !isComplete) {
        return "bg-orange-500 text-white hover:bg-orange-600"
      } else if (isComplete) {
        return "bg-green-500 text-white hover:bg-green-600"
      } else if (isPast) {
        return "bg-muted text-muted-foreground hover:bg-muted/80"
      }
    }

    return ""
  }

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
              <CardTitle className="text-3xl">{currentWeight} kg</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {weightChange > 0 ? "+" : ""}
                {weightChange.toFixed(1)} kg depuis le début
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
                {Math.round((totalActivities / (activityData.length * 5)) * 100)}%
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
                      domain={["dataMin - 1", "dataMax + 1"]}
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
            </CardContent>
          </Card>

          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Suivi des activités</CardTitle>
              <CardDescription>Nombre d'activités complétées par jour</CardDescription>
            </CardHeader>
            <CardContent>
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
                      domain={[0, 5]}
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
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Calendrier d'activités</CardTitle>
            <CardDescription>Visualisez votre historique de complétion</CardDescription>
            <div className="flex gap-4 mt-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-green-500" />
                <span className="text-muted-foreground">Complété</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-orange-500" />
                <span className="text-muted-foreground">Aujourd'hui (incomplet)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-muted" />
                <span className="text-muted-foreground">Incomplet</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              numberOfMonths={2}
              className="rounded-md border"
              modifiers={{
                completed: (date) => {
                  const dateStr = date.toISOString().split("T")[0]
                  const dayData = calendarData[dateStr]
                  return dayData ? dayData.completed === dayData.total : false
                },
                todayIncomplete: (date) => {
                  const dateStr = date.toISOString().split("T")[0]
                  const today = new Date().toISOString().split("T")[0]
                  const dayData = calendarData[dateStr]
                  return dateStr === today && dayData ? dayData.completed < dayData.total : false
                },
                incomplete: (date) => {
                  const dateStr = date.toISOString().split("T")[0]
                  const today = new Date()
                  const dayData = calendarData[dateStr]
                  return date < today && dayData ? dayData.completed < dayData.total : false
                },
              }}
              modifiersClassNames={{
                completed: "bg-green-500 text-white hover:bg-green-600",
                todayIncomplete: "bg-orange-500 text-white hover:bg-orange-600",
                incomplete: "bg-muted text-muted-foreground hover:bg-muted/80",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
