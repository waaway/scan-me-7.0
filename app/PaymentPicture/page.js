'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentPicturePage() {
  const [qr, setQr] = useState(null);
  const searchParams = useSearchParams();
  const price = searchParams.get('price') || 0;

  useEffect(() => {
    const generateQr = async () => {
      const res = await fetch('/api/qrcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: '0995932846',
          amount: price
        })
      });
      const data = await res.json();
      setQr(data.qr);
    };
    generateQr();
  }, [price]);

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h2>📱 สแกนจ่ายผ่านพร้อมเพย์</h2>
      {qr ? <img src={qr} alt="PromptPay QR Code" style={{ width: '250px', marginTop: '20px' }} /> : <p>กำลังโหลด QR...</p>}
      <p style={{ marginTop: '20px' }}>ยอดเงิน: {price} บาท</p>
    </div>
  );
}