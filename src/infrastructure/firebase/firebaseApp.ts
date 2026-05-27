import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

type FirebaseRuntime = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredFirebaseEnv = {
  VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  VITE_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
  VITE_FIREBASE_APP_ID: firebaseConfig.appId,
};

function getMissingFirebaseEnv(): string[] {
  return Object.entries(requiredFirebaseEnv)
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

export function getFirebaseConfigError(): Error | null {
  const missing = getMissingFirebaseEnv();

  if (missing.length === 0) {
    return null;
  }

  return new Error(`Firebase no está configurado. Faltan variables de entorno: ${missing.join(", ")}.`);
}

export function getFirebaseRuntime(): FirebaseRuntime | null {
  if (getFirebaseConfigError()) {
    return null;
  }

  const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

  return {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
}
