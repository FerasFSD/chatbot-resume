import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID, // 🚨 Korrigiert von "PROJEKT_ID" → "PROJECT_ID"
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET, // 🚨 "REACT_" → "REACT_APP_"
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // 👈 Nur nötig, wenn du Analytics wirklich verwendest