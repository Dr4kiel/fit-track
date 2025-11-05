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

        // get daily weight entry for the logged in user
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weightEntry = await prisma.weightEntry.findFirst({
            where: {
                userId: session.user.id,
                createdAt: {
                    gte: today,
                },
            }
        });

        if (!weightEntry) {
            return NextResponse.json(
                { error: 'Aucune entrée de poids pour aujourd\'hui' },
                { status: 404 }
            );
        }

        return NextResponse.json({ weightEntry });
    } catch (error) {
        console.error('Erreur lors de la vérification de session:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}