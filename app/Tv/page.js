'use client';
import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/Tv.module.css';

const qrMessages = [
  'แสกนไอจีขึ้นจอ',
  'อยากโชว์ชื่อ? แสกนเลย!',
  'ให้โลกเห็น IG คุณ!',
  '📱 แค่แสกน ชื่อคุณก็ขึ้นจอ!',
  'จุดไฟบนจอด้วยไอจีคุณ!',
  'แสดงความเป็นตัวคุณบนจอนี้!'
];

export default function TvPage() {
  const [mediaQueue, setMediaQueue] = useState([]);
  const [tipQueue, setTipQueue] = useState([]);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [currentTip, setCurrentTip] = useState(null);
  const [qrText, setQrText] = useState(qrMessages[0]);
  const [idleIndex, setIdleIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef();
  const qrIndex = useRef(0);


  const idleVideos = [
    '/SinghaBeer.mp4',
    '/Chang-Cold-Brew-Cool-Club.mp4',
    '/Stella Artois x David Beckham ｜ A Taste Worth More.mp4',
    '/Corona Beer commercial Inspired by DANIEL SCHIFFER.mp4',
    '/Heineken 0.0 ｜ No Reason Needed ｜ When Working.mp4',
  ];

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!currentMedia) {
        const res = await fetch('/api/get-queue');
        const data = await res.json();
        if (data.length > 0) setMediaQueue(data);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentMedia]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!currentTip) {
        const res = await fetch('/api/get-tip');
        const data = await res.json();
        if (data.length > 0) setTipQueue(data);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentTip]);

  useEffect(() => {
    if (!currentMedia && mediaQueue.length > 0) {
      setCurrentMedia(mediaQueue[0]);
      setMediaQueue((prev) => prev.slice(1));
    }
  }, [mediaQueue, currentMedia]);

  useEffect(() => {
    if (!currentTip && tipQueue.length > 0) {
      setCurrentTip(tipQueue[0]);
      setTipQueue((prev) => prev.slice(1));
    }
  }, [tipQueue, currentTip]);

  useEffect(() => {
    if (!currentMedia) return;
    if (currentMedia.type === 'image') {
      const timer = setTimeout(async () => {
        await markAsShown(currentMedia.id);
        setCurrentMedia(null);
      }, currentMedia.duration * 1000);
      return () => clearTimeout(timer);
    }

    if (currentMedia.type === 'video') {
      const video = videoRef.current;
      if (!video) return;
      let elapsed = 0;
      const limit = currentMedia.duration;

      const onEnd = () => {
        elapsed += video.duration;
        if (elapsed < limit) {
          video.currentTime = 0;
          video.play();
        } else {
          cleanup();
        }
      };

      const cleanup = async () => {
        video.pause();
        video.removeEventListener('ended', onEnd);
        await markAsShown(currentMedia.id);
        setCurrentMedia(null);
      };

      video.currentTime = 0;
      video.muted = true;
      video.play().catch(console.warn);
      video.addEventListener('ended', onEnd);

      const timeout = setTimeout(cleanup, limit * 1000 + 500);
      return () => {
        video.removeEventListener('ended', onEnd);
        clearTimeout(timeout);
      };
    }
  }, [currentMedia]);

  useEffect(() => {
    if (!currentTip) return;
    const timer = setTimeout(async () => {
      await markAsShown(currentTip.id);
      setCurrentTip(null);
    }, currentTip.duration * 3 * 1000);
    return () => clearTimeout(timer);
  }, [currentTip]);

  useEffect(() => {
    const interval = setInterval(() => {
      qrIndex.current = (qrIndex.current + 1) % qrMessages.length;
      setQrText(qrMessages[qrIndex.current]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const markAsShown = async (id) => {
    await fetch('/api/mark-shown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  };

return (
  <div className={styles.container}>
    {/* วิดีโอ fullscreen เฉพาะตอนไม่มี media */}
    {!currentMedia && (
      <video
        key={idleIndex}
        ref={videoRef}
        autoPlay
        muted={isMuted}
        onEnded={() => setIdleIndex((prev) => (prev + 1) % idleVideos.length)}
        controls={false}
        className={styles.fullscreenVideo}
      >
        <source src={idleVideos[idleIndex]} type="video/mp4" />
      </video>
    )}

    {/* layout เมื่อมี media */}
    {currentMedia && (
      <div className={styles.layout}>
        <div className={styles.mediaBox}>
          {currentMedia.type === 'image' ? (
            <img src={currentMedia.filePath} className={styles.media} />
          ) : (
            <video
              ref={videoRef}
              src={currentMedia.filePath}
              className={styles.media}
              autoPlay
              muted
              playsInline
              controls={false}
            />
          )}
        </div>
        <div className={styles.infoBox}>
          {currentMedia.igName && <div className={styles.igName}>IG: {currentMedia.igName}</div>}
          {currentMedia.caption && <div className={styles.caption}>{currentMedia.caption}</div>}
        </div>
      </div>
    )}

    {/* QR code (โชว์ตลอดไม่ว่าจะมี media หรือไม่) */}
    <div className={styles.qrBox}>
      <div className={styles.qrBackground}></div>
      <div className={styles.qrContent}>
        <div className={`${styles.qrText} ${styles.typewriter}`}>{qrText}</div>
        <img src="/qr.png" className={styles.qrImage} alt="qr" />
      </div>
    </div>

    {/* Tip overlay */}
    {currentTip && (
      <div className={styles.tipBanner}>
        <div
          className={styles.tipText}
          style={{
            animationDuration: `${currentTip.duration}s`,
            animationIterationCount: 3,
          }}
        >
          <img src="/coin.png" className={styles.coinImage} alt="coin" />
          {currentTip.caption}
        </div>
      </div>
    )}
  </div>
);
}
