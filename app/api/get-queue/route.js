import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const items = await prisma.mediaQueue.findMany({
      where: {
        status: 'pending',
        NOT: { type: 'tip' },
      },
      orderBy: { createdAt: 'asc' },
      take: 1,
    });

    return NextResponse.json(items);
  } catch (err) {
    console.error('[GET QUEUE ERROR]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
