import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_MESSAGES_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_MESSAGES_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_MESSAGES_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGES_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_MESSAGES_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGES_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGES_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGES_MEASUREMENT_ID,
};

const appName = "cfm-pulse-messages";
const app = getApps().find((app) => app.name === appName)
  ? getApp(appName)
  : initializeApp(firebaseConfig, appName);

export const messagesDatabase: Database = getDatabase(app);
export const messagesApp = app;
