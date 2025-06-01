'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaVideo } from 'react-icons/fa';
import { AiFillPicture } from 'react-icons/ai';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import styles from '../styles/Home.module.css';

function Page() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.glowRing}></div>

      <h1 className={styles.title}>Fair Fae</h1>

        <button className={styles.customButton} onClick={() => router.push('/Picture')}>
          <AiFillPicture className={styles.icon} />
          ส่งรูปขึ้นจอ
        </button>

        <button className={styles.customButton} onClick={() => router.push('/Video')}>
          <FaVideo className={styles.icon} />
          ส่งวิดีโอขึ้นจอ
        </button>

        <button className={styles.customButton} onClick={() => router.push('/Tip_Song')}>
          <RiMoneyDollarCircleFill className={styles.icon} />
          ทิปนักร้อง
        </button>

        
      </div>

      
  );
}

export default Page;
