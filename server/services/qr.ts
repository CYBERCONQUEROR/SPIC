import QRCode from "qrcode";

export interface TicketPayload {
  registrationId: string;
  eventId: string;
  verificationToken: string;
}

/**
 * Generate a QR code data-URL (PNG base64) encoding the ticket payload.
 * The QR content is a JSON string so the scanner can parse it.
 */
export async function generateQrDataUrl(
  payload: TicketPayload
): Promise<string> {
  const content = JSON.stringify(payload);
  return QRCode.toDataURL(content, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 400,
    color: { dark: "#000000", light: "#ffffff" },
  });
}
