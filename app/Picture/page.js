'use client';
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Picture.module.css';
import { IoIosArrowRoundBack } from "react-icons/io";
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';
import imageCompression from 'browser-image-compression';
import { FaInstagram } from "react-icons/fa";

const timeOptions = [
  { time: 15, price: 49 },
  { time: 30, price: 59 },
  { time: 45, price: 79 },
];

const captions = [
  'โสดแล้วแซ่บ มาจีบได้ ดื่มเก่งด้วย!',
  'อย่ามองนาน เดี๋ยวหลงรักไม่รู้ตัว',
  'เหล้ามีรสขม แต่คนตรงนี้มีรสหวาน',
  'หน้าไม่หวาน แต่นั่งด้วยแล้วมันส์แน่นอน',
  'ไม่ได้เจ้าชู้ แค่ดูเฟรนด์ลี่เวลาเมา',
  'เปิดใจง่ายเหมือนเปิดขวดเลยล่ะคืนนี้',
  'คนดีๆ มีอยู่ในร้านเหล้า...เชื่อสิ!',
  'โต๊ะข้างๆ ว่างนะ แต่ว่าใจเราว่างกว่า',
  'มองได้ แต่อย่าหายไปไหนนะ',
  'ถ้าเธอกล้า เราก็พร้อมชนแก้ว',
  'ดื่มไม่เก่ง แต่รักจริงนะบอกเลย',
  'เบียร์เย็นๆ ยังไม่เท่าไหล่เธอที่อบอุ่น',
  'สเปคไม่ตายตัว แต่อยู่ในร้านนี้แน่นอน',
  'มองตาแล้วจะรู้ว่า “จองโต๊ะ” หรือ “จองใจ”',
  'คืนนี้ไม่อยากเมา แต่อยากมีคนคุย',
  'อยากได้คนคุมร้าน หรือคนคุมใจดีล่ะ?',
  'สั่งเหล้าได้จากบาร์ แต่สั่งใจได้จากเรา',
  'ตามมา Follow IG เราได้ที่',
  'ส่อง IG เราสิ แล้วจะติดใจ 😉',
  'อยากรู้จักกันมากขึ้น? Follow IG เลย',
  'IG นี้มีแต่เรื่องสนุก!',
  'สายปาร์ตี้ แวะมาส่อง IG เราหน่อย',
  'เปิดวาร์ปมาที่',
  'My IG - Follow for good vibes!',
  'คืนนี้ใครโสด ชนแก้ว! 🥂',
  'ทักทายกันได้นะ ไม่กัด! 😊',
  'หาเพื่อนชนแก้ว/คุยเล่น',
  'โต๊ะนี้ยังว่าง...รอคนข้างๆ มา Follow',
  'มองจอแล้วยิ้มให้หน่อยสิ 😉',
  'ทีมงานคุณภาพ (โต๊ะนี้) พร้อมบวก!',
  'คนน่ารักมักจะขึ้นจอนี้',
  'ขึ้นจอสักหน่อย เผื่อมีคนแอบปิ๊ง!',
  'ชนแก้วออนไลน์ผ่านสตอรี่กัน',
  'แวะมาทักทายชาวแก๊งค์หน่อย'
];

export default function PicturePage() {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCaption, setSelectedCaption] = useState('');
  const [igName, setIgName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('กรุณาเลือกเฉพาะไฟล์รูปภาพ');
      return;
    }

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setPreviewUrl(null);
        setCroppedImage(null);
      };
      reader.readAsDataURL(compressed);
    } catch (err) {
      console.error('Image compression error:', err);
      alert('เกิดข้อผิดพลาดในการบีบอัดรูปภาพ');
    }
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(cropped);
      setPreviewUrl(cropped);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleSendToTV = async () => {
  if (!croppedImage) {
    alert('❌ กรุณาครอบรูปภาพก่อน');
    return;
  }
  if (selectedTime === null) {
    alert('❌ กรุณาเลือกเวลาที่ต้องการแสดงรูป');
    return;
  }
  if (!selectedCaption) {
    alert('❌ กรุณาเลือกข้อความแคปชั่น');
    return;
  }
  if (!igName.trim()) {
    alert('กรุณาใส่ชื่อ Instagram');
    return;
  }

  try {
    // ✅ เปลี่ยนเป็น FormData เพื่อส่งไฟล์ base64 เป็น Blob
    const blob = await (await fetch(croppedImage)).blob();
    const file = new File([blob], 'image.png', { type: blob.type });

    const formData = new FormData();
    formData.append('file', file);

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const { path } = await uploadRes.json();

    const res = await fetch('/api/send-to-queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'image',
        filePath: path,
        caption: selectedCaption,
        igName,
        duration: selectedTime,
      })
    });

    if (res.ok) {
      alert('✅ ส่งรูปภาพไปยัง TV สำเร็จแล้ว!');
    } else {
      alert('❌ การส่งล้มเหลว');
    }
  } catch (err) {
    console.error('[ERROR] ส่งรูปภาพ:', err);
    alert('❌ เกิดข้อผิดพลาดในการส่งรูปภาพ');
  }
};


  return (
    <div className={styles.container} style={{ overflow: 'hidden' }}>
      {!imageSrc && (
        <>
          <button onClick={() => router.back()} className={styles.backButton}>
            <IoIosArrowRoundBack />
          </button>
          <h1 className={styles.title}>ส่งรูปขึ้นจอ</h1>

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

          {!previewUrl && (
            <div className={styles.uploadBox}>
              <label htmlFor="uploadInput">
                <div className={styles.placeholder}>เลือกรูปภาพจากเครื่อง</div>
              </label>
              <input
                id="uploadInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {previewUrl && (
            <div className={styles.uploadBox}>
              <label htmlFor="uploadInput">
                <img src={previewUrl} alt="preview" className={styles.previewImg} />
              </label>
              <input
                id="uploadInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          )}

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
            ยืนยันและส่งรูปไปยัง TV
          </button>
        </>
      )}

      {imageSrc && (
        <div className={styles.cropSection}>
          <div className={styles.cropWrapper}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={9 / 16}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <button onClick={showCroppedImage} className={styles.paymentButton}>
            ยืนยันรูปที่ครอบ
          </button>
        </div>
      )}
    </div>
  );
}
