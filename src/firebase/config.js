import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "web-application-ad62e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "web-application-ad62e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "web-application-ad62e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "28562787874",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:28562787874:web:56dfd4de79a27ac865847b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-PMMJ4W9N21"
};

export const isPlaceholderKey =
  !firebaseConfig.apiKey ||
  firebaseConfig.apiKey.includes("DummyKey") ||
  firebaseConfig.apiKey === "YOUR_FIREBASE_API_KEY";

if (isPlaceholderKey) {
  console.warn(
    "[Firebase] Warning: VITE_FIREBASE_API_KEY in .env is set to a placeholder. Authentication and Firebase API calls will fail until a valid key is provided from Firebase Console."
  );
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional Analytics (check support in browser)
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics error in non-supported environments
  });
}

export default app;
