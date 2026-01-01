import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_ARTICLES_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_ARTICLES_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_ARTICLES_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_ARTICLES_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_ARTICLES_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_ARTICLES_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_ARTICLES_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_ARTICLES_MEASUREMENT_ID,
};

const appName = "cfm-pulse-articles";
const app = getApps().find((app) => app.name === appName)
  ? getApp(appName)
  : initializeApp(firebaseConfig, appName);

export const articlesDatabase: Database = getDatabase(app);
export const articlesApp = app;
