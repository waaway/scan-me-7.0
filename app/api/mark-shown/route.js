import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { id } = await req.json();
    if (!id) throw new Error('Missing ID');

    await prisma.mediaQueue.update({
      where: { id: parseInt(id) },
      data: { status: 'shown' },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('[MARK SHOWN ERROR]', err);
    return new Response(JSON.stringify({ error: 'Failed to update status' }), { status: 500 });
  }
}
