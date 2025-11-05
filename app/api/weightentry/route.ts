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

        // get weight entries for the logged in user
        const weightEntries = await prisma.weightEntry.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(weightEntries, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la vérification de session:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }
        const { weight } = await request.json();
        if (typeof weight !== 'number' || weight <= 0) {
            return NextResponse.json(
                { error: 'Poids invalide' },
                { status: 400 }
            );
        }
        const newWeightEntry = await prisma.weightEntry.create({
            data: {
                userId: session.user.id,
                weight: weight,
            },
        });
        return NextResponse.json(newWeightEntry, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de la création de l\'entrée de poids:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}