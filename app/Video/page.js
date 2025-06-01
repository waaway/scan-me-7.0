'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Picture.module.css';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaInstagram } from 'react-icons/fa';

const timeOptions = [
  { time: 15, price: 49 },
  { time: 30, price: 59 },
  { time: 50, price: 79 },
];

const captions = [
  'คืนนี้ใครโสด ชนแก้ว! 🥂',
  'ทักทายกันได้นะ ไม่กัด! 😊',
  'เปิดวาร์ปมาที่',
  'My IG - Follow for good vibes!',
  'แวะมาทักทายชาวแก๊งค์หน่อย',
];

export default function VideoPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCaption, setSelectedCaption] = useState('');
  const [igName, setIgName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('video/')) {
      alert('กรุณาเลือกเฉพาะไฟล์วิดีโอ');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSendToTV = async () => {
    if (!selectedFile) {
      alert('❌ กรุณาเลือกไฟล์วิดีโอ');
      return;
    }
    if (selectedTime === null) {
      alert('❌ กรุณาเลือกเวลา');
      return;
    }
    if (!selectedCaption) {
      alert('❌ กรุณาเลือกแคปชั่น');
      return;
    }
    if (!igName) {
      alert('❌ กรุณากรอก IG');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadRes.json();
      const path = uploadResult.path;

      const res = await fetch('/api/send-to-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'video',
          filePath: path,
          caption: selectedCaption,
          igName,
          duration: selectedTime,
        })
      });

      if (res.ok) {
        alert('✅ ส่งวิดีโอไปยัง TV แล้ว!');
        setSelectedFile(null);
        setPreviewUrl(null);
        setSelectedTime(null);
        setSelectedCaption('');
        setIgName('');
      } else {
        alert('❌ การส่งล้มเหลว');
      }
    } catch (err) {
      console.error('[ERROR] ส่งวิดีโอ:', err);
      alert('❌ เกิดข้อผิดพลาดในการส่งวิดีโอ');
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        <IoIosArrowRoundBack />
      </button>

      <h1 className={styles.title}>ส่งวิดีโอขึ้นจอ</h1>

      <div className={styles.timeOptions}>
        {timeOptions.map((opt) => (
          <button
            key={opt.time}
            className={`${styles.timeButton} ${selectedTime === opt.time ? styles.active : ''}`}
            onClick={() => setSelectedTime(opt.time)}
          >
            <span className={styles.time}>{opt.time} วินาที</span>
            <span className={styles.price}>{opt.price}฿</span>
          </button>
        ))}
      </div>

      <div className={styles.uploadBox}>
        {previewUrl ? (
          <video className={styles.previewImg} src={previewUrl} controls />
        ) : (
          <label htmlFor="uploadVideo">
            <div className={styles.placeholder}>เลือกรูปวิดีโอจากเครื่อง</div>
          </label>
        )}
        <input
          id="uploadVideo"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className={styles.igWrapper}>
        <FaInstagram className={styles.igIcon} />
        <input
          type="text"
          placeholder="Instagram"
          className={styles.igInput}
          value={igName}
          onChange={(e) => setIgName(e.target.value)}
        />
      </div>

      <select
        value={selectedCaption}
        onChange={(e) => setSelectedCaption(e.target.value)}
        className={styles.captionSelect}
      >
        <option value="" disabled hidden>เลือกข้อความ</option>
        {captions.map((cap, idx) => (
          <option key={idx} value={cap}>{cap}</option>
        ))}
      </select>

      <button className={styles.paymentButton} onClick={handleSendToTV}>
        ยืนยันและส่งวิดีโอไปยัง TV
      </button>
    </div>
  );
}
