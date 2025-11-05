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

        // get workouts for the logged in user
        const workouts = await prisma.workout.findMany({
            where: {
                userId: session.user.id
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