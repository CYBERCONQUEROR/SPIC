import nodemailer from "nodemailer";

export interface TicketEmailData {
  to: string;
  participantName: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  qrDataUrl: string; // base64 data-URL
}

function buildTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.error("[email] SMTP credentials missing!");
  }

  // Common fix for Render: Force IPv4 and use Port 587
  // Many cloud providers block IPv6 SMTP or Port 465
  const smtpConfig: any = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Port 587 uses STARTTLS
    auth: {
      user: user,
      pass: pass,
    },
    // Force IPv4 to avoid ENETUNREACH or timeouts on IPv6
    family: 4,
    // Increase timeouts significantly for cloud environments
    connectionTimeout: 60000, 
    greetingTimeout: 30000,
    socketTimeout: 60000,
    // Add pool for better performance
    pool: true,
    maxConnections: 3,
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
      minVersion: "TLSv1.2"
    }
  };

  return nodemailer.createTransport(smtpConfig);
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
                <p style="margin:0;font-size:15px;color:#18181b;">${escapeHtml(data.eventVenue)}</p>
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

    // Test the connection before attempting to send
    try {
      await transport.verify();
      console.log("[email] SMTP connection verified successfully");
    } catch (verifyErr: any) {
      console.error("[email] SMTP Verification failed:", verifyErr.message);
      // Continue anyway, but we've logged the issue
    }

    // Log info for debugging in Render (password masked)
    console.log(`[email] Attempting to send email to ${data.to} via ${process.env.SMTP_HOST ?? "smtp.gmail.com"} as ${process.env.SMTP_USER || "MISSING_USER"}`);

    // Extract raw base64 from data-URL for CID attachment
    // Ensure we handle potential whitespace or encoding issues
    const base64 = data.qrDataUrl.split(',')[1] || data.qrDataUrl;
    console.log(`[email] QR base64 extracted, length: ${base64.length} chars`);

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

    return { success: true };
  } catch (err: any) {
    console.error("[email] ❌ CRITICAL FAILURE sending ticket:");
    console.error("   - Message:", err.message);
    console.error("   - Code:", err.code);
    
    // Check for common Render/Gmail issues
    if (err.code === 'EENVELOPE') {
      console.error("   - Diagnosis: The recipient email address is invalid.");
    } else if (err.code === 'EAUTH' || err.message.includes('535')) {
      console.error("   - Diagnosis: Authentication Failed! Verify your Gmail App Password.");
    } else if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
      console.error("   - Diagnosis: Connection Blocked! Render's server might be restricted from Gmail's port 465.");
    }
    
    if (err.response) {
      console.error("   - Server Response:", err.response);
    }
    
    return { success: false, error: err.message };
  }
}
