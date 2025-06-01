// ✅ app/api/qrcode/route.js
import { createRequire } from 'module';
import qrcode from 'qrcode';

const require = createRequire(import.meta.url);
const generatePayload = require('promptpay-qr');

export async function POST(request) {
  try {
    const { phoneNumber, amount } = await request.json();

    if (!phoneNumber || !amount) throw new Error('Missing phoneNumber or amount');

    const payload = generatePayload(phoneNumber, {
      amount: parseFloat(amount),
    });

    const qrImageDataUrl = await qrcode.toDataURL(payload);

    return new Response(JSON.stringify({ qr: qrImageDataUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ API Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
