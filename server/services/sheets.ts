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
 * Update attendance status in the existing registration row.
 * Searches for rollNumber in Column D and updates Column F to 'Present' and Column G to timestamp.
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
    console.warn("[sheets] GOOGLE_SHEET_ID not set or empty — skipping attendance update.");
    return { success: false, error: "GOOGLE_SHEET_ID not configured." };
  }

  if (!data.rollNumber) {
    return { success: false, error: "Roll number required to find existing row." };
  }

  try {
    // 1. Fetch Roll Numbers from Column D to find the row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1!D:D",
    });

    const rows = response.data.values || [];
    const rollNumberToMatch = data.rollNumber.trim();
    
    // Find row index (0-based, but we need 1-based for Sheets API)
    // We match the trimmed roll number
    const rowIndex = rows.findIndex(row => row[0]?.toString().trim() === rollNumberToMatch);

    if (rowIndex === -1) {
      console.warn(`[sheets] Roll number ${rollNumberToMatch} not found in sheet.`);
      return { success: false, error: "Row not found in Sheet." };
    }

    // 2. Update Column H (Present) for that specific row
    const updateRange = `Sheet1!H${rowIndex + 1}:H${rowIndex + 1}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          ["Present"],
        ],
      },
    });

    console.log(`[sheets] Marked attendance for ${data.participantName} at row ${rowIndex + 1}`);
    return { success: true };
  } catch (err: any) {
    console.error("[sheets] Failed to update attendance:", err.message);
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
      range: "Sheet1!A:H",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            data.participantName,
            data.branch ?? "",
            data.year ?? "",
            data.rollNumber ? data.rollNumber.toString().trim() : "",
            data.phone ?? "",
            "", // Column F: TeamName
            "", // Column G: PPT Link
            "Absent", // Column H: Attendance
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

/**
 * Append a Team registration row to the Google Sheet.
 * Columns: Team Name | Member 1 Name | Member 1 Email | Member 1 Roll | Member 1 Year | Member 1 Branch | Member 1 Phone | ... Member 2 ... Member 3 ... Member 4 ... | PPT Link | Attendance (Absent) | Timestamp
 */
export async function appendTeamRegistrationRow(data: {
  teamName: string;
  members: any[];
  pptLink: string;
}): Promise<{ success: boolean; error?: string }> {
  const sheetId = process.env.GOOGLE_SHEET_ID?.trim();

  if (!sheetId) {
    console.warn("[sheets] GOOGLE_SHEET_ID not set or empty.");
    return { success: false, error: "GOOGLE_SHEET_ID not configured." };
  }

  try {
    const rowsToAppend = data.members.map((member, index) => {
      if (index === 0) {
        return [
          member.name || "",
          member.branch || "",
          member.year || "",
          member.rollNumber || "",
          member.phone || "",
          data.teamName || "",
          data.pptLink || "",
          "Absent"
        ];
      } else {
        return [
          member.name || "",
          member.branch || "",
          member.year || "",
          member.rollNumber || "",
          member.phone || "",
          "", // blank team name
          "", // blank ppt link
          "Absent" // Attendance
        ];
      }
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:H",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: rowsToAppend,
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("[sheets] Failed to append team registration:", err.message);
    return { success: false, error: err.message };
  }
}


