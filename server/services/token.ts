import crypto from "crypto";

/** Generate a cryptographically secure random token (hex string). */
export function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}
