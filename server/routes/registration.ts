import { Router, type Request, type Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getDb, REGISTRATIONS } from "../db.js";
import { generateToken } from "../services/token.js";
import { generateQrDataUrl } from "../services/qr.js";
import { sendTicketEmail } from "../services/email.js";
import { appendRegistrationRow } from "../services/sheets.js";

const router = Router();

// ─── Register for an event ───────────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  const { eventId, eventName, eventDate, eventVenue, name, email, phone, rollNumber, year, branch } =
    req.body;

  if (!eventId || !eventName || !eventDate || !eventVenue || !name || !email || !rollNumber || !year || !branch) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }

  const emailLower = (email as string).trim().toLowerCase();
  const db = getDb();

  // Prevent duplicate registration
  const duplicateCheck = await db
    .collection(REGISTRATIONS)
    .where("eventId", "==", eventId)
    .where("participantEmail", "==", emailLower)
    .limit(1)
    .get();

  if (!duplicateCheck.empty) {
    // If getting 409, it means the registration already exists in Firebase
    res.status(409).json({ 
      error: "You are already registered for this event with this email. Please use a different email or check your existing ticket." 
    });
    return;
  }

  const id = uuidv4();
  const verificationToken = generateToken();

  let qrDataUrl: string;
  try {
    qrDataUrl = await generateQrDataUrl({
      registrationId: id,
      eventId,
      verificationToken,
    });
  } catch (err: any) {
    console.error("[register] QR generation failed:", err.message);
    res.status(500).json({ error: "Failed to generate ticket." });
    return;
  }

  const registration = {
    eventId,
    eventName,
    eventDate,
    eventVenue,
    participantName: name.trim(),
    participantEmail: emailLower,
    phone: phone?.trim() ?? null,
    rollNumber: rollNumber.trim(),
    year: year.trim(),
    branch: branch.trim(),
    verificationToken,
    qrDataUrl,
    emailStatus: "pending",
    checkedIn: false,
    checkedInAt: null,
    createdAt: new Date().toISOString(),
  };

  await db.collection(REGISTRATIONS).doc(id).set(registration);

  // Save to Google Sheets (non-blocking)
  appendRegistrationRow({
    id,
    participantName: registration.participantName,
    participantEmail: registration.participantEmail,
    phone: registration.phone,
    rollNumber: registration.rollNumber,
    year: registration.year,
    branch: registration.branch,
    eventName: registration.eventName,
    eventDate: registration.eventDate,
    eventVenue: registration.eventVenue,
    createdAt: registration.createdAt,
  }).catch((err) => {
    console.error(`[register] Failed to append registration to sheets for ${id}:`, err);
  });

  // Send email (non-blocking)
  sendTicketEmail({
    to: emailLower,
    participantName: name.trim(),
    eventName,
    eventDate,
    eventVenue,
    qrDataUrl,
  }).then(({ success, error }) => {
    const status = success ? "sent" : "failed";
    db.collection(REGISTRATIONS).doc(id).update({ emailStatus: status });
    if (!success) {
      console.error(`[register] Email failed for ${id}:`, error);
    }
  });

  res.status(201).json({
    id,
    ...registration,
  });
});

// ─── List registrations by email ────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Email query parameter is required." });
    return;
  }

  const emailStr = (email as string).trim().toLowerCase();
  const db = getDb();
  const snapshot = await db
    .collection(REGISTRATIONS)
    .where("participantEmail", "==", emailStr)
    .orderBy("createdAt", "desc")
    .get();

  const rows = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      eventId: data.eventId,
      eventName: data.eventName,
      eventDate: data.eventDate,
      eventVenue: data.eventVenue,
      participantName: data.participantName,
      participantEmail: data.participantEmail,
      qrDataUrl: data.qrDataUrl,
      emailStatus: data.emailStatus,
      checkedIn: data.checkedIn,
      createdAt: data.createdAt,
    };
  });

  res.json(rows);
});

// ─── Get single registration ────────────────────────────────────────
router.get("/:id", async (req: Request, res: Response) => {
  const db = getDb();
  const doc = await db.collection(REGISTRATIONS).doc(req.params.id as string).get();

  if (!doc.exists) {
    res.status(404).json({ error: "Registration not found." });
    return;
  }

  res.json({ id: doc.id, ...doc.data() });
});

// ─── Retry failed email ─────────────────────────────────────────────
router.post("/:id/resend", async (req: Request, res: Response) => {
  const db = getDb();
  const doc = await db.collection(REGISTRATIONS).doc(req.params.id as string).get();

  if (!doc.exists) {
    res.status(404).json({ error: "Registration not found." });
    return;
  }

  const row = doc.data()!;

  const result = await sendTicketEmail({
    to: row.participantEmail,
    participantName: row.participantName,
    eventName: row.eventName,
    eventDate: row.eventDate,
    eventVenue: row.eventVenue,
    qrDataUrl: row.qrDataUrl,
  });

  const status = result.success ? "sent" : "failed";
  await db.collection(REGISTRATIONS).doc(doc.id).update({ emailStatus: status });

  if (result.success) {
    res.json({ message: "Email resent successfully." });
  } else {
    res.status(500).json({ error: "Email delivery failed.", detail: result.error });
  }
});

export default router;
