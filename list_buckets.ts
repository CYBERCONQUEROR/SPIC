import { getServiceAccount } from "./server/db.js";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import "dotenv/config";

async function check() {
  try {
    const sa = getServiceAccount();
    initializeApp({ credential: cert(sa) });
    const [buckets] = await getStorage().getBuckets();
    console.log("SUCCESS! Available buckets:", buckets.map(b => b.name));
  } catch (err) {
    console.error("FAILED to list buckets:", err);
  }
}
check();
