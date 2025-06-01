'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Tip_Song.module.css';
import { IoIosArrowRoundBack } from "react-icons/io";

export default function TipSinger() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('กรุณาใส่จำนวนเงินที่ต้องการทิป');
      return;
    }

    try {
      const res = await fetch('/api/send-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          igName: name.trim(),
          message: message.trim(),
        }),
      });

      if (!res.ok) throw new Error('ส่งข้อมูลล้มเหลว');

      alert('✅ ให้ทิปสำเร็จ!');
      router.push('/');
    } catch (err) {
      console.error('Error:', err);
      alert('❌ เกิดข้อผิดพลาดในการให้ทิป');
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => router.back()}>
        <IoIosArrowRoundBack />
      </button>

      <h1 className={styles.title}>ทิปนักร้อง</h1>

      <input
        type="text"
        inputMode="decimal"
        placeholder="ใส่จำนวนเงิน (฿)"
        className={styles.amountInput}
        value={amount}
        onChange={(e) => {
          const value = e.target.value;
          const regex = /^(?!0\d)(?!\.)(\d+)(\.\d{0,2})?$/;
          if (value === '' || regex.test(value)) {
            setAmount(value);
          }
        }}
      />

      <input
        type="text"
        placeholder="ชื่อผู้ให้ทิป (ไม่บังคับ)"
        className={styles.nameInput}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className={styles.messageBox}
        placeholder="ฝากข้อความถึงนักร้อง (ไม่บังคับ)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button className={styles.tipButton} onClick={handleSubmit}>
        ยืนยันการทิป
      </button>
    </div>
  );
}
