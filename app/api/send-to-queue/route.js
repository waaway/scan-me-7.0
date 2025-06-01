import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  const body = await req.json();

  const { type, filePath, caption, igName, duration } = body;

  if (!type || !filePath || !duration) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const result = await prisma.mediaQueue.create({
    data: { type, filePath, caption, igName, duration }
  });

  return NextResponse.json(result);
}
