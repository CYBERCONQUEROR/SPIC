import "dotenv/config";
import express from "express";
import cors from "cors";
import registrationRouter from "./routes/registration.js";
import verificationRouter from "./routes/verification.js";

const PORT = Number(process.env.API_PORT ?? 8081);

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

app.listen(PORT, () => {
  console.log(`[server] API running on http://localhost:${PORT}`);
});
