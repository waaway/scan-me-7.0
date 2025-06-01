// app/api/upload/route.js
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file found' }, { status: 400 });
    }

    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({ path: blob.url });
  } catch (err) {
    console.error('[UPLOAD ERROR]', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
