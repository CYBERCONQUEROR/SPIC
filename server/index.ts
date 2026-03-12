import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import registrationRouter from "./routes/registration.js";
import verificationRouter from "./routes/verification.js";

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

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Frontend Static Files (Production) ──────────────────────────────
// This allows a single Render server to host both the API and the React App
const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));

// Catch-all route to serve index.html for React Router
app.get("*", (_req, res) => {
  res.sendFile(path.resolve(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`[server] App (API + Web) running on port ${PORT}`);
});
