import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();

export function initFirebaseAdmin() {
  const saPath = process.env.FIREBASE_SERVICE_ACCOUNT || "./serviceAccountKey.json";
  const serviceAccount = JSON.parse(
    // if env variable content stored directly
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON || require("fs").readFileSync(saPath, "utf8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
  console.log("Firebase admin initialized");
}

export const db = getFirestore();