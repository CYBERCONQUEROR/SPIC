import { Router, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const router = Router();

// Multer: store file on disk
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".ppt" || ext === ".pptx") {
      cb(null, true);
    } else {
      cb(new Error("Only .ppt and .pptx files are accepted."));
    }
  },
});

// ─── Upload PPT file ──────────────────────────────────────────────────
router.post("/ppt", upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }

  try {
    // Build a public URL for the uploaded file
    const host = req.headers.host || "localhost:3001";
    const protocol = req.protocol || "http";
    const publicUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    console.log(`[upload] PPT saved: ${req.file.filename} (${(req.file.size / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`[upload] Accessible at: ${publicUrl}`);

    res.json({ url: publicUrl });
  } catch (err: any) {
    console.error("[upload] Failed:", err.message);
    res.status(500).json({ error: "Upload failed: " + err.message });
  }
});

export default router;
