import { BrevoClient } from "@getbrevo/brevo";

export interface TicketEmailData {
  to: string;
  participantName: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  // Payload for QR generation
  registrationId: string;
  eventId: string;
  verificationToken: string;
}

export interface ContactEmailData {
  name: string;
  email: string;
  concern: string;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Build the HTML content for the ticket email (BharatSetu Style)
 */
function buildHtml(data: TicketEmailData): string {
  const formattedDate = new Date(data.eventDate).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const escapedName = escapeHtml(data.participantName);
  const escapedEvent = escapeHtml(data.eventName);

  // Create the QR content (same as stored in DB)
  const qrContent = JSON.stringify({
    registrationId: data.registrationId,
    eventId: data.eventId,
    verificationToken: data.verificationToken
  });

  // Use a reliable external QR generator API (solves the broken image issue)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrContent)}`;
  const logoUrl = "https://spic-rkgit.onrender.com/Gemini_Generated_Image_c51bomc51bomc51b-removebg-preview.png";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your SPIC Event Ticket</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.05);border:1px solid #e2e8f0;">
          
          <!-- Premium Header (BharatSetu Style) -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px; border-bottom: 4px solid #fbbf24;">
              <div style="margin-bottom: 24px;">
                <img src="${logoUrl}" alt="SPIC Logo" width="100" height="100" style="border-radius:50%; display: inline-block; object-fit: cover;">
              </div>
              <h1 style="margin:0; color:#ffffff; font-size:32px; font-weight:800; letter-spacing: -0.02em;">SPIC</h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:14px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em;">The Entrepreneur Cell of RKGIT</p>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; font-weight: 700;">Registration Confirmed!</h2>
              <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
                Dear <strong>${escapedName}</strong>,<br><br>
                Thank you for registering for <strong>${escapedEvent}</strong>. Your ticket is ready! Please keep this email handy for entry.
              </p>

              <!-- Event Detail Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 12px; padding: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Event Name</p>
                    <p style="margin: 0 0 16px; color: #0f172a; font-size: 18px; font-weight: 700;">${escapedEvent}</p>
                    
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="vertical-align: top;">
                          <p style="margin: 0 0 4px; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Date</p>
                          <p style="margin: 0; color: #1e293b; font-size: 15px; font-weight: 600;">${formattedDate}</p>
                        </td>
                        <td width="50%" style="vertical-align: top;">
                          <p style="margin: 0 0 4px; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Venue</p>
                          <p style="margin: 0; color: #1e293b; font-size: 15px; font-weight: 600;">Seminar Hall, D Block</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- QR Code Section -->
              <div style="text-align: center; margin-top: 40px; padding-top: 32px; border-top: 1px dashed #cbd5e1;">
                <p style="margin: 0 0 16px; color: #1e293b; font-size: 16px; font-weight: 700;">Your Entry QR Code</p>
                <div style="display:inline-block; padding: 12px; background: #ffffff; border: 2px solid #e2e8f0; border-radius: 16px;">
                  <img src="${qrImageUrl}" alt="Event Ticket QR" width="220" height="220" style="display: block;">
                </div>
                <p style="margin: 16px 0 0; color: #64748b; font-size: 13px;">Ticket ID: <span style="font-family: monospace; color: #1e293b;">${data.registrationId.slice(0, 8).toUpperCase()}</span></p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 8px; color: #64748b; font-size: 14px;">Looking forward to seeing you there!</p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                &copy; ${new Date().getFullYear()} SPIC — The Entrepreneur Cell of RKGIT
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendTicketEmail(
  data: TicketEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = process.env.BREVO_SMTP_KEY || "";
    if (!apiKey) {
      throw new Error("BREVO_SMTP_KEY is missing in .env");
    }

    const client = new BrevoClient({ apiKey });

    const senderEmail = process.env.BREVO_SENDER_EMAIL || "talukdarkrishnav9@gmail.com";

    console.log(`[email] Sending via Brevo v5 SDK to ${data.to}...`);

    await client.transactionalEmails.sendTransacEmail({
      subject: `Event Registration Confirmation – Your QR Ticket for ${data.eventName}`,
      htmlContent: buildHtml(data),
      sender: { name: "SPIC Events", email: senderEmail },
      to: [{ email: data.to, name: data.participantName }],
    });

    console.log(`[email] ✅ Brevo SDK sent successfully to ${data.to}`);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err.message || "Unknown error";
    console.error("[email] ❌ BREVO SDK FAILURE:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function sendContactEmail(
  data: ContactEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = process.env.BREVO_SMTP_KEY || "";
    if (!apiKey) throw new Error("BREVO_SMTP_KEY is missing in .env");

    const client = new BrevoClient({ apiKey });
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "talukdarkrishnav9@gmail.com";
    const officialEmail = "spic@rkgit.edu.in";

    await client.transactionalEmails.sendTransacEmail({
      subject: `New Website Inquiry from ${data.name}`,
      htmlContent: `
        <h3>New Website Inquiry</h3>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Concern:</strong></p>
        <p>${escapeHtml(data.concern).replace(/\n/g, "<br>")}</p>
      `,
      sender: { name: "SPIC Website", email: senderEmail },
      to: [{ email: officialEmail, name: "SPIC Team" }],
      replyTo: { email: data.email, name: data.name }
    });

    console.log(`[contact] Email sent safely for ${data.email}`);
    return { success: true };
  } catch (err: any) {
    console.error("[contact] FAILURE:", err.message);
    return { success: false, error: err.message };
  }
}
