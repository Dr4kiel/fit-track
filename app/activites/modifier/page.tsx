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
import { useMemo } from "react"

type Activity = {
  id: string
  name: string
  type: "cardio" | "musculation" | "stretching" | "autre"
  sets: number
  repetitions: number
  unit: "minutes" | "répétitions" | "secondes"
}

const activityTypeIcons = {
  cardio: Timer,
  musculation: Dumbbell,
  stretching: Wind,
  autre: Dumbbell,
}

const activityTypeLabels = {
  cardio: "Course / Cardio",
  musculation: "Musculation",
  stretching: "Étirements",
  autre: "Autre",
}

export default function ModifierActivitesPage() {
  const [activities, setActivities] = React.useState<Activity[]>([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingActivity, setEditingActivity] = React.useState<Activity | null>(null)
  const [formData, setFormData] = React.useState<Omit<Activity, "id">>({
    name: "",
    type: "musculation",
    sets: 3,
    repetitions: 10,
    unit: "répétitions",
  })

  const handleOpenDialog = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity)
      setFormData({
        name: activity.name,
        type: activity.type,
        sets: activity.sets,
        repetitions: activity.repetitions,
        unit: activity.unit,
      })
    } else {
      setEditingActivity(null)
      setFormData({
        name: "",
        type: "musculation",
        sets: 3,
        repetitions: 10,
        unit: "répétitions",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSaveActivity = async () => {
    if (!formData.name.trim()) {
      alert("Veuillez entrer un nom d'activité")
      return
    }

    setSaving(true)
    try {
      if (editingActivity) {
        // Update existing activity
        const response = await fetch('/api/workout', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingActivity.id,
            ...formData,
          }),
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour')
        }

        const { workout } = await response.json()
        setActivities(activities.map((a) => (a.id === editingActivity.id ? workout : a)))
      } else {
        // Add new activity
        const response = await fetch('/api/workout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la création')
        }

        const { workout } = await response.json()
        setActivities([...activities, workout])
      }

      setIsDialogOpen(false)
      setEditingActivity(null)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'enregistrement de l\'activité')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteActivity = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      try {
        const response = await fetch(`/api/workout?id=${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression')
        }

        setActivities(activities.filter((a) => a.id !== id))
      } catch (error) {
        console.error('Erreur:', error)
        alert('Erreur lors de la suppression de l\'activité')
      }
    }
  }

  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/workout');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des activités');
        }
        const data = await response.json();
        if (data.workouts) {
          setActivities(data.workouts);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des activités:', error);
        alert('Erreur lors du chargement des activités');
      } finally {
        setLoading(false)
      }
    };

    fetchActivities();
  }, [])

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
                      <Label htmlFor="repetitions">Par série</Label>
                      <Input
                        id="repetitions"
                        type="number"
                        min="1"
                        value={formData.repetitions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            repetitions: Number.parseInt(e.target.value) || 1,
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
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                    Annuler
                  </Button>
                  <Button onClick={handleSaveActivity} disabled={saving}>
                    {saving ? "Enregistrement..." : editingActivity ? "Enregistrer" : "Ajouter"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Chargement des activités...</p>
              </CardContent>
            </Card>
          ) : activities.length === 0 ? (
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
                      <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>

                      {/* Activity Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold">{activity.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {activityTypeLabels[activity.type]} •{" "}
                          {activity.sets > 1
                            ? `${activity.sets} séries × ${activity.repetitions} ${activity.unit}`
                            : `${activity.repetitions} ${activity.unit}`}
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
