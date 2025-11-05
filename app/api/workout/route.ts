import { NextRequest, NextResponse } from 'next/server';
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

        // get workouts for the logged in user
        const workouts = await prisma.workout.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                dailyLogs: {
                    where: {
                        createdAt: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        }
                    }
                }
            }
        });

        return NextResponse.json({ workouts });
    } catch (error) {
        console.error('Erreur lors de la vérification de session:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, type, sets, repetitions, unit } = body;

        if (!name || !type || !sets || !repetitions || !unit) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            );
        }

        const workout = await prisma.workout.create({
            data: {
                name,
                type,
                sets: parseInt(sets),
                repetitions: parseInt(repetitions),
                unit,
                userId: session.user.id
            }
        });

        return NextResponse.json({ workout });
    } catch (error) {
        console.error('Erreur lors de la création du workout:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, name, type, sets, repetitions, unit } = body;

        if (!id || !name || !type || !sets || !repetitions || !unit) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            );
        }

        // Vérifier que le workout appartient à l'utilisateur
        const existingWorkout = await prisma.workout.findFirst({
            where: {
                id,
                userId: session.user.id
            }
        });

        if (!existingWorkout) {
            return NextResponse.json(
                { error: 'Workout non trouvé' },
                { status: 404 }
            );
        }

        const workout = await prisma.workout.update({
            where: { id },
            data: {
                name,
                type,
                sets: parseInt(sets),
                repetitions: parseInt(repetitions),
                unit
            }
        });

        return NextResponse.json({ workout });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du workout:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID requis' },
                { status: 400 }
            );
        }

        // Vérifier que le workout appartient à l'utilisateur
        const existingWorkout = await prisma.workout.findFirst({
            where: {
                id,
                userId: session.user.id
            }
        });

        if (!existingWorkout) {
            return NextResponse.json(
                { error: 'Workout non trouvé' },
                { status: 404 }
            );
        }

        await prisma.workout.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur lors de la suppression du workout:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}