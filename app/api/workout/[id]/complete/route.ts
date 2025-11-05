import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust import if needed

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: workoutId } = await params;

    // fetch if a DailyLog entry exists for today for the given workoutId
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logEntry = await prisma.dailyLog.findFirst({
        where: {
            workoutId: workoutId,
            createdAt: {
                gte: today,
                lt: new Date(today.getTime() + 86400000), // Add 1 day
            },
        },
    });

    if (logEntry) {
        return NextResponse.json({ completed: true }, { status: 200 });
    }

    return NextResponse.json({ completed: false }, { status: 200 });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: workoutId } = await params;
    const body = await request.json();
    const { completed } = body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (completed) {
        // Create a DailyLog entry for today
        await prisma.dailyLog.create({
            data: {
                workoutId: workoutId,
            },
        });
        return NextResponse.json({ message: 'Workout marked as completed' }, { status: 200 });
    } else {
        // Delete the DailyLog entry for today
        await prisma.dailyLog.deleteMany({
            where: {
                workoutId: workoutId,
                createdAt: {
                    gte: today,
                    lt: new Date(today.getTime() + 86400000), // Add 1 day
                },
            },
        });
        return NextResponse.json({ message: 'Workout marked as not completed' }, { status: 200 });
    }
}