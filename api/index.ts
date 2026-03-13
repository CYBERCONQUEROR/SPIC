import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import registrationRouter from "../server/routes/registration.js";
import verificationRouter from "../server/routes/verification.js";

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

// For Vercel, we export the express app
export default app;
