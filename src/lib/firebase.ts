import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

let databaseInstance: Database | null = null;

export function getDatabaseInstance(): Database | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (databaseInstance) {
    return databaseInstance;
  }

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  };

  if (!firebaseConfig.projectId || !firebaseConfig.databaseURL) {
    return null;
  }

  try {
    const app =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    databaseInstance = getDatabase(app);
    return databaseInstance;
  } catch {
    return null;
  }
}
