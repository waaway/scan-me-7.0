import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, igName, message } = body;

    const caption = `คุณ ${igName?.trim() || 'ผู้ไม่ประสงค์ออกนาม'} ให้ทิปนักร้อง ${amount} บาท` +
                    (message ? ` " ${message} "` : '');

    const newTip = await prisma.mediaQueue.create({
      data: {
        type: 'tip',
        caption,
        igName: igName || null,
        amount: parseFloat(amount),
        duration: 10,
        filePath: '',
        status: 'pending',
      },
    });

    return NextResponse.json({ success: true, id: newTip.id });
  } catch (err) {
    console.error('[SEND TIP ERROR]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
