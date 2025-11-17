import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Firebase configuration from environment variables
const readEnv = (key: string, fallback: string) => {
  const viteValue = (import.meta.env as Record<string, string | undefined>)[`VITE_${key}`];
  const reactAppValue = (import.meta.env as Record<string, string | undefined>)[`REACT_APP_${key}`];
  return viteValue || reactAppValue || fallback;
};

const firebaseConfig = {
  apiKey: readEnv("FIREBASE_API_KEY", "mock-api-key"),
  authDomain: readEnv("FIREBASE_AUTH_DOMAIN", "mock-auth-domain"),
  projectId: readEnv("FIREBASE_PROJECT_ID", "mock-project-id"),
  storageBucket: readEnv("FIREBASE_STORAGE_BUCKET", "mock-storage-bucket"),
  messagingSenderId: readEnv("FIREBASE_MESSAGING_SENDER_ID", "mock-messaging-sender-id"),
  appId: readEnv("FIREBASE_APP_ID", "mock-app-id"),
  measurementId: readEnv("FIREBASE_MEASUREMENT_ID", "mock-measurement-id"),
};

// Debug: Log Firebase config status (only in development)
if (import.meta.env.DEV) {
  const hasRealConfig = firebaseConfig.apiKey !== "mock-api-key";
  console.log("🔥 Firebase Config:", {
    hasRealConfig,
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
  });
}

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;