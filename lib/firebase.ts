// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDV7DmpgQ-9L1ET2kfD0Py3Z4p-Q3xiRuo",
  authDomain: "on-mission-hub.firebaseapp.com",
  projectId: "on-mission-hub",
  storageBucket: "on-mission-hub.firebasestorage.app",
  messagingSenderId: "982300317498",
  appId: "1:982300317498:web:1ff2df35bb697b90be6203",
  measurementId: "G-XYWN774HSD"
};

// 1. Initialize Firebase (Singleton pattern to prevent re-initialization errors)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. EXPORT the services so other files can use them
export const db = getFirestore(app);
export const auth = getAuth(app);