// app/api/upload/route.js
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file found' }, { status: 400 });
  }

  const blob = await put(file.name, file, {
  access: 'public',
  token: process.env.BLOB_READ_WRITE_TOKEN,
});


  return NextResponse.json({ path: blob.url }); // ส่งกลับ URL ที่ใช้โชว์ไฟล์
}
