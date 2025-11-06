import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Récupérer les entrées de poids (30 derniers jours)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const weightEntries = await prisma.weightEntry.findMany({
            where: {
                userId: userId,
                createdAt: {
                    gte: thirtyDaysAgo
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Récupérer les workouts de l'utilisateur
        const workouts = await prisma.workout.findMany({
            where: {
                userId: userId
            },
            include: {
                dailyLogs: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        // Créer les données de poids pour le graphique
        const weightData = weightEntries.map((entry, index) => ({
            date: entry.createdAt.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
            }),
            weight: entry.weight,
            rawDate: entry.createdAt
        }));

        // Créer les données d'activités par jour
        const activityByDate = new Map<string, { completed: number; total: number; date: string }>();

        // Initialiser les 30 derniers jours
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const displayDate = date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
            });

            activityByDate.set(dateStr, {
                completed: 0,
                total: workouts.length,
                date: displayDate
            });
        }

        // Compter les activités complétées par jour
        workouts.forEach(workout => {
            workout.dailyLogs.forEach(log => {
                const dateStr = log.createdAt.toISOString().split('T')[0];
                const existing = activityByDate.get(dateStr);
                if (existing) {
                    existing.completed++;
                }
            });
        });

        const activityData = Array.from(activityByDate.values());

        // Créer les données du calendrier pour une année complète (365 derniers jours)
        const calendarData: Record<string, { completed: number; total: number }> = {};
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Remplir les données du calendrier pour les 365 derniers jours (jusqu'à aujourd'hui inclus)
        for (let i = 364; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Inclure seulement les jours jusqu'à aujourd'hui (pas de jours futurs)
            if (dateStr <= todayStr) {
                calendarData[dateStr] = {
                    completed: 0,
                    total: workouts.length
                };
            }
        }

        // Compter les activités complétées pour le calendrier
        workouts.forEach(workout => {
            workout.dailyLogs.forEach(log => {
                const dateStr = log.createdAt.toISOString().split('T')[0];
                if (calendarData[dateStr]) {
                    calendarData[dateStr].completed++;
                }
            });
        });

        // Calculer les statistiques générales

        // reduire sur le mois
        const monthlyActivities = workouts.filter(workout =>
            workout.dailyLogs.some(log => {
                return log.createdAt >= thirtyDaysAgo;
            })
        );


        const totalActivities = monthlyActivities.reduce((sum, workout) => {
            return sum + workout.dailyLogs.filter(log => log.createdAt >= thirtyDaysAgo).length;
        }, 0);

        // Calculer le taux de complétion basé sur les activités mensuelles
        const totalPossibleActivitiesMonth = monthlyActivities.length * 30; // Nombre de workouts * 30 jours
        const totalCompletedActivitiesMonth = monthlyActivities.reduce((sum, workout) => {
            return sum + workout.dailyLogs.filter(log => log.createdAt >= thirtyDaysAgo).length;
        }, 0);
        const completionRate = totalPossibleActivitiesMonth > 0
            ? Math.round((totalCompletedActivitiesMonth / totalPossibleActivitiesMonth) * 100)
            : 0;

        return NextResponse.json({
            weightData,
            activityData,
            calendarData,
            stats: {
                currentWeight: weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : null,
                startWeight: weightEntries.length > 0 ? weightEntries[0].weight : null,
                totalActivities,
                completionRate,
                totalWorkouts: workouts.length
            }
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}