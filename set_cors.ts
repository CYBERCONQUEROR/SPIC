import { getServiceAccount } from "./server/db.ts";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import "dotenv/config";

async function run() {
  const serviceAccount = getServiceAccount();
  const app = initializeApp({
    credential: cert(serviceAccount)
  });

  const [buckets] = await getStorage(app).getBuckets();
  console.log("Available buckets:", buckets.map(b => b.name));

  const bucketName = buckets[0]?.name || "spic-19d60.appspot.com";
  const bucket = getStorage(app).bucket(bucketName);
  
  const corsConfiguration = [
    {
      origin: ["*"],
      method: ["GET", "PUT", "POST", "DELETE", "OPTIONS", "HEAD"],
      maxAgeSeconds: 3600,
      responseHeader: ["*"]
    }
  ];

  console.log(`Setting CORS for ${bucketName}...`);
  try {
    await bucket.setCorsConfiguration(corsConfiguration);
    console.log("CORS configured successfully!");
  } catch (err) {
    console.error("Error setting CORS:", err);
  }
}

run();
