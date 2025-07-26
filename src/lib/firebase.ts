import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "raita-sahayak",
  "appId": "1:868540522043:web:f79733e21e5f903964861e",
  "storageBucket": "raita-sahayak.firebasestorage.app",
  "apiKey": "AIzaSyAGzCwapCVZCh-SV5WqYws2_wsfeyKWd3U",
  "authDomain": "raita-sahayak.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "868540522043"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);

export { app, auth };