import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return new Response(JSON.stringify({ error: 'ไม่พบไฟล์' }), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop();
    const fileName = `vid_${Date.now()}.${ext}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

    // ✅ สร้างโฟลเดอร์ถ้ายังไม่มี
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, buffer);

    return new Response(JSON.stringify({ path: `/uploads/${fileName}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[UPLOAD ERROR]', err);
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
