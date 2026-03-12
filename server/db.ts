import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db: Firestore;

export function getServiceAccount(): ServiceAccount {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
    } catch (err) {
      throw new Error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON env var.");
    }
  }

  const keyPath = path.join(__dirname, "firebase-service-account.json");
  if (!existsSync(keyPath)) {
    throw new Error("Firebase Service Account credentials not found. Set FIREBASE_SERVICE_ACCOUNT_JSON env var.");
  }
  return JSON.parse(readFileSync(keyPath, "utf-8")) as ServiceAccount;
}

export function getDb(): Firestore {
  if (!db) {
    const serviceAccount = getServiceAccount();
    initializeApp({ credential: cert(serviceAccount) });
    db = getFirestore();
  }
  return db;
}

export const REGISTRATIONS = "registrations";
