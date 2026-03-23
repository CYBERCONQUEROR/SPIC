import nodemailer from "nodemailer";

export interface TicketEmailData {
  to: string;
  participantName: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  qrDataUrl: string; // base64 data-URL
}

/**
 * Build the Gmail SMTP transporter with BYPASS for Render's IPv6 issues
 */
function buildTransport() {
  // CRITICAL: We hardcode a known stable IPv4 address for smtp.gmail.com 
  // to completely bypass Render's broken IPv6/DNS stack that causes ENETUNREACH.
  const host = "142.251.4.108"; 
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.replace(/\s/g, "");
  const port = 465; // SSL

  if (!user || !pass) {
    console.error("[email] Gmail credentials missing in .env!");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: true, // Port 465 is always secure
    auth: {
      user,
      pass,
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
    tls: {
      // Required for SSL validation since we're connecting via IP
      servername: "smtp.gmail.com",
      rejectUnauthorized: false
    }
  } as any);
}

function buildHtml(data: TicketEmailData): string {
  const formattedDate = new Date(data.eventDate).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#18181b;padding:24px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">SPIC — Event Ticket</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;font-size:16px;color:#18181b;">
              Hi <strong>${escapeHtml(data.participantName)}</strong>,
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#3f3f46;line-height:1.6;">
              You have successfully registered for the event. Here are your details:
            </p>

            <!-- Event Details -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;border-radius:6px;padding:20px;margin-bottom:24px;">
              <tr><td>
                <p style="margin:0 0 8px;font-size:13px;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;">Event</p>
                <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#18181b;">${escapeHtml(data.eventName)}</p>
                <p style="margin:0 0 8px;font-size:13px;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;">Date</p>
                <p style="margin:0 0 16px;font-size:15px;color:#18181b;">${formattedDate}</p>
                <p style="margin:0 0 8px;font-size:13px;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;">Venue</p>
                <p style="margin:0;font-size:15px;color:#18181b;">Seminar Hall , D Block</p>
              </td></tr>
            </table>

            <!-- QR Code -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td align="center">
                <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#18181b;">Your Entry QR Ticket</p>
                <img src="cid:qr-ticket" alt="QR Ticket" width="240" height="240" style="display:block;border:1px solid #e4e4e7;border-radius:6px;" />
              </td></tr>
            </table>

            <p style="margin:0 0 8px;font-size:14px;color:#3f3f46;line-height:1.6;text-align:center;">
              Please present this QR code at the event entrance for scanning.
            </p>
            <p style="margin:0;font-size:13px;color:#71717a;text-align:center;">
              Do not share this ticket — it can only be used once.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;background:#f4f4f5;border-top:1px solid #e4e4e7;">
            <p style="margin:0;font-size:12px;color:#a1a1aa;text-align:center;">
              &copy; ${new Date().getFullYear()} SPIC — Student Platform for Innovation &amp; Collaboration, RKGIT
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendTicketEmail(
  data: TicketEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    const transport = buildTransport();

    console.log(`[email] Reverting to Gmail: Sending to ${data.to} via IPv4 Bypass Mode...`);

    // Extract raw base64 from data-URL
    const base64 = data.qrDataUrl.split(',')[1] || data.qrDataUrl;

    await transport.sendMail({
      from: `"SPIC Events" <${process.env.SMTP_USER}>`,
      to: data.to,
      subject: `Event Registration Confirmation – Your QR Ticket for ${data.eventName}`,
      html: buildHtml(data),
      attachments: [
        {
          filename: "qr-ticket.png",
          content: Buffer.from(base64, "base64"),
          cid: "qr-ticket",
        },
      ],
    });

    console.log(`[email] ✅ Gmail sent successfully to ${data.to}`);
    return { success: true };
  } catch (err: any) {
    console.error("[email] ❌ GMAIL FAILURE sending ticket:", err.message);
    return { success: false, error: err.message };
  }
}
