import { getServiceAccount } from "./server/db.ts";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import "dotenv/config";

async function run() {
  const serviceAccount = getServiceAccount();
  const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "spic-19d60.firebasestorage.app"
  });

  const bucket = getStorage(app).bucket();
  const corsConfiguration = [
    {
      origin: ["*"],
      method: ["GET", "PUT", "POST", "DELETE", "OPTIONS", "HEAD"],
      maxAgeSeconds: 3600,
      responseHeader: ["*"]
    }
  ];

  console.log("Setting CORS for spic-19d60.firebasestorage.app...");
  try {
    await bucket.setCorsConfiguration(corsConfiguration);
    console.log("CORS configured successfully!");
  } catch (err) {
    console.error("Error setting CORS:", err);
  }
}

run();
