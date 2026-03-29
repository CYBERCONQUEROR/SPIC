import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import registrationRouter from "./routes/registration.js";
import verificationRouter from "./routes/verification.js";
import contactRouter from "./routes/contact.js";

// Render sets the PORT env var for web services
const PORT = Number(process.env.PORT || process.env.API_PORT || 3001);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "2mb" }));

// ─── API routes ──────────────────────────────────────────────────────
app.use("/api/registrations", registrationRouter);
app.use("/api/verify", verificationRouter);
app.use("/api/contact", contactRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Frontend Static Files (Production) ──────────────────────────────
// This allows a single Render server to host both the API and the React App
const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));

// Catch-all route to serve index.html for React Router
app.use((req, res, next) => {
  if (req.method === "GET") {
    res.sendFile(path.resolve(distPath, "index.html"));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`[server] App (API + Web) running on port ${PORT}`);

  // ─── Render Keep-Alive (Heartbeat) ──────────────────────────────────
  // Pings the external URL every 14 mins to prevent free tier from sleeping
  const EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;
  if (EXTERNAL_URL) {
    console.log(`[heartbeat] Initializing keep-alive for ${EXTERNAL_URL}`);
    setInterval(async () => {
      try {
        console.log(`[heartbeat] Pinging health endpoint...`);
        const response = await fetch(`${EXTERNAL_URL}/api/health`);
        const data = await response.json();
        console.log(`[heartbeat] Status: ${data.status}`);
      } catch (error) {
        console.error(`[heartbeat] Ping failed:`, error instanceof Error ? error.message : error);
      }
    }, 14 * 60 * 1000); // 14 minutes
  } else {
    console.log(`[heartbeat] RENDER_EXTERNAL_URL not found, skip-pinging.`);
  }
});
