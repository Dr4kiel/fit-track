import { CheckCircle2, Circle, Dumbbell, Icon, Timer, Wind } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useEffect, useMemo, useState } from "react";

type Activity = {
    id: number
    name: string
    type: "cardio" | "musculation" | "stretching"
    sets: number
    repetitions: number
    unit: string
}

const icons = {
    cardio: Timer,
    musculation: Dumbbell,
    stretching: Wind,
    autre: Dumbbell,
}

export function WorkoutCard({ activity }: { activity: Activity }) {

    const fetchCompletionStatus = async (): Promise<boolean> => {
        try {
            const response = await fetch(`/api/workout/${activity.id}/complete`);
            const data = await response.json();
            if (response.status === 200) {
                return data.completed;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du statut de complétion:', error);
        }
        return false;
    };

    const [completed, setCompleted] = useState(false);

    const Icon = icons[activity.type];

    const handleCompletedChange = (newCompleted: boolean) => {
        setCompleted(newCompleted);
        updateCompletionStatus(newCompleted);
    }

    const updateCompletionStatus = async (newCompleted: boolean) => {

        try {
            fetch(`/api/workout/${activity.id}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: newCompleted }),
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut de complétion:', error);
        }
    }

    useMemo(() => {
        const fetchStatus = async () => {
            const status = await fetchCompletionStatus();
            setCompleted(status);
        };
        fetchStatus();
    }, [activity.id]);

    return (
        <Card
            key={activity.id}
            className={`transition-all ${completed ? "bg-muted/50 border-primary/20" : "hover:border-primary/50"
                }`}
        >
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    {/* Completion Status */}
                    <button
                        className="shrink-0"
                        aria-label={completed ? "Marquer comme non complété" : "Marquer comme complété"}
                        onClick={() => handleCompletedChange(!completed)}
                    >
                        {completed ? (
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                        ) : (
                            <Circle className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" />
                        )}
                    </button>

                    {/* Activity Icon */}
                    <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>

                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                        <h3
                            className={`text-lg font-semibold ${completed ? "line-through text-muted-foreground" : ""
                                }`}
                        >
                            {activity.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {activity.sets > 1
                                ? `${activity.sets} séries × ${activity.repetitions} ${activity.unit}`
                                : `${activity.repetitions} ${activity.unit}`}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="shrink-0 text-right">
                        {completed ? (
                            <span className="text-sm font-medium text-primary">Terminé</span>
                        ) : (
                            <span className="text-sm text-muted-foreground">À faire</span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}