import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore'; // ✅ เพิ่มบรรทัดนี้

const firebaseConfig = {
  apiKey: "AIzaSyCs0u0ZXKItSo_i889RXQsAbgnRuEkTBTi",
  authDomain: "fairfaepresent.firebaseapp.com",
  projectId: "fairfaepresent",
  storageBucket: "fairfaepresent.appspot.com",
  messagingSenderId: "459875953269",
  appId: "1:459875953269:web:7f4320bf3886f4c1f0263c",
  measurementId: "G-PYDM8LP58N"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app); // ✅ เพิ่มบรรทัดนี้

export { db }; // ✅ export เพื่อใช้ใน API route
