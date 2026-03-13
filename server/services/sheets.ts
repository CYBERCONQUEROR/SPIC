import { google } from "googleapis";
import { getServiceAccount } from "../db.js";

// Re-use the same Firebase service account for Google Sheets access
const serviceAccount = getServiceAccount() as any;
const privateKey = serviceAccount.private_key?.replace(/\\n/g, "\n");

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: privateKey,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

/**
 * Append a check-in row to the configured Google Sheet.
 * Columns: Registration ID | Name | Email | Phone | Roll Number | Year | Event | Event Date | Venue | Attendance Timestamp
 */
export async function appendAttendanceRow(data: {
  participantName: string;
  participantEmail: string;
  phone: string | null;
  rollNumber: string | null;
  year: string | null;
  eventName: string;
  eventDate: string;
  eventVenue: string;
}): Promise<{ success: boolean; error?: string }> {
  const sheetId = process.env.GOOGLE_SHEET_ID?.trim();

  if (!sheetId) {
    console.warn("[sheets] GOOGLE_SHEET_ID not set or empty \u2014 skipping attendance log.");
    return { success: false, error: "GOOGLE_SHEET_ID not configured." };
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            data.participantName,
            data.participantEmail,
            data.phone ?? "",
            data.rollNumber ?? "",
            data.year ?? "",
            data.eventName,
            data.eventDate,
            // Removed eventVenue and timestamp as per requirement
          ],
        ],
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("[sheets] Failed to append row:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Append a registration row to the configured Google Sheet.
 * Columns: Registration ID | Name | Email | Phone | Roll Number | Year | Branch | Event | Event Date | Venue | Timestamp
 */
export async function appendRegistrationRow(data: {
  id: string;
  participantName: string;
  participantEmail: string;
  phone: string | null;
  rollNumber: string | null;
  year: string | null;
  branch: string | null;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  createdAt: string;
}): Promise<{ success: boolean; error?: string }> {
  const sheetId = process.env.GOOGLE_SHEET_ID?.trim();

  if (!sheetId) {
    console.warn("[sheets] GOOGLE_SHEET_ID not set or empty \u2014 skipping registration log.");
    return { success: false, error: "GOOGLE_SHEET_ID not configured." };
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            data.participantName,
            data.branch ?? "",
            data.year ?? "",
            data.rollNumber ?? "",
            data.phone ?? "",
          ],
        ],
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("[sheets] Failed to append registration row:", err.message);
    return { success: false, error: err.message };
  }
}
