import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { serverConfig } from "../env.js";

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: applicationDefault(),
      projectId: serverConfig.firebaseProjectId,
    });

export const firebaseAdminAuth = getAuth(app);
export const firestore = getFirestore(app);
