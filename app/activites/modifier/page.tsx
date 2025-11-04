"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil, Trash2, Plus, Dumbbell, Timer, Wind } from "lucide-react"

type Activity = {
  id: number
  name: string
  type: "cardio" | "musculation" | "stretching" | "autre"
  sets: number
  reps: number
  unit: "minutes" | "répétitions" | "secondes"
}

const activityTypeIcons = {
  cardio: Timer,
  musculation: Dumbbell,
  stretching: Wind,
  autre: Timer,
}

const activityTypeLabels = {
  cardio: "Course / Cardio",
  musculation: "Musculation",
  stretching: "Étirements",
  autre: "Autre",
}

export default function ModifierActivitesPage() {
  const [activities, setActivities] = React.useState<Activity[]>([
    {
      id: 1,
      name: "Course matinale",
      type: "cardio",
      sets: 1,
      reps: 30,
      unit: "minutes",
    },
    {
      id: 2,
      name: "Pompes",
      type: "musculation",
      sets: 3,
      reps: 15,
      unit: "répétitions",
    },
    {
      id: 3,
      name: "Squats",
      type: "musculation",
      sets: 3,
      reps: 20,
      unit: "répétitions",
    },
    {
      id: 4,
      name: "Planche",
      type: "musculation",
      sets: 3,
      reps: 60,
      unit: "secondes",
    },
    {
      id: 5,
      name: "Étirements",
      type: "stretching",
      sets: 1,
      reps: 15,
      unit: "minutes",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingActivity, setEditingActivity] = React.useState<Activity | null>(null)
  const [formData, setFormData] = React.useState<Omit<Activity, "id">>({
    name: "",
    type: "musculation",
    sets: 3,
    reps: 10,
    unit: "répétitions",
  })

  const handleOpenDialog = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity)
      setFormData({
        name: activity.name,
        type: activity.type,
        sets: activity.sets,
        reps: activity.reps,
        unit: activity.unit,
      })
    } else {
      setEditingActivity(null)
      setFormData({
        name: "",
        type: "musculation",
        sets: 3,
        reps: 10,
        unit: "répétitions",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSaveActivity = () => {
    if (!formData.name.trim()) {
      alert("Veuillez entrer un nom d'activité")
      return
    }

    if (editingActivity) {
      // Update existing activity
      setActivities(activities.map((a) => (a.id === editingActivity.id ? { ...formData, id: a.id } : a)))
    } else {
      // Add new activity
      const newActivity: Activity = {
        ...formData,
        id: Math.max(...activities.map((a) => a.id), 0) + 1,
      }
      setActivities([...activities, newActivity])
    }

    setIsDialogOpen(false)
    setEditingActivity(null)
  }

  const handleDeleteActivity = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      setActivities(activities.filter((a) => a.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-balance">Modifier les activités</h1>
              <p className="text-muted-foreground mt-2">Gérez votre liste d'activités quotidiennes</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4" />
                  Ajouter une activité
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingActivity ? "Modifier l'activité" : "Nouvelle activité"}</DialogTitle>
                  <DialogDescription>
                    {editingActivity
                      ? "Modifiez les détails de votre activité"
                      : "Ajoutez une nouvelle activité à votre routine"}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nom de l'activité</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Course matinale"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="type">Type d'activité</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: Activity["type"]) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger id="type" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardio">Course / Cardio</SelectItem>
                        <SelectItem value="musculation">Musculation</SelectItem>
                        <SelectItem value="stretching">Étirements</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="sets">Nombre de séries</Label>
                      <Input
                        id="sets"
                        type="number"
                        min="1"
                        value={formData.sets}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sets: Number.parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="reps">Par série</Label>
                      <Input
                        id="reps"
                        type="number"
                        min="1"
                        value={formData.reps}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reps: Number.parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unité</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value: Activity["unit"]) => setFormData({ ...formData, unit: value })}
                    >
                      <SelectTrigger id="unit" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="répétitions">Répétitions</SelectItem>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="secondes">Secondes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSaveActivity}>{editingActivity ? "Enregistrer" : "Ajouter"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {activities.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Aucune activité. Commencez par en ajouter une !</p>
              </CardContent>
            </Card>
          ) : (
            activities.map((activity) => {
              const Icon = activityTypeIcons[activity.type]
              return (
                <Card key={activity.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Activity Icon */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>

                      {/* Activity Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold">{activity.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {activityTypeLabels[activity.type]} •{" "}
                          {activity.sets > 1
                            ? `${activity.sets} séries × ${activity.reps} ${activity.unit}`
                            : `${activity.reps} ${activity.unit}`}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleOpenDialog(activity)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteActivity(activity.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
