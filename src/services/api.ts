const BASE = import.meta.env.DEV
  ? "/api"                                    // Vite dev proxy → localhost:3001
  : "https://spic-rkgit.onrender.com/api";    // Production → Render backend

export interface RegistrationPayload {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  name: string;
  email: string;
  phone?: string;
  rollNumber: string;
  year: string;
  branch: string;
}

export interface Registration {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  participantName: string;
  participantEmail: string;
  qrDataUrl: string;
  emailStatus: "pending" | "sent" | "failed";
  checkedIn: boolean;
  createdAt: string;
}

export interface VerifyPayload {
  registrationId: string;
  eventId: string;
  verificationToken: string;
}

export interface VerifyResult {
  valid: boolean;
  participantName?: string;
  participantEmail?: string;
  eventName?: string;
  error?: string;
}

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data as T;
}

export const api = {
  register(payload: RegistrationPayload) {
    return request<Registration>("/registrations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getRegistrations(email: string) {
    return request<Registration[]>(
      `/registrations?email=${encodeURIComponent(email)}`
    );
  },

  getRegistration(id: string) {
    return request<Registration>(`/registrations/${encodeURIComponent(id)}`);
  },

  resendEmail(id: string) {
    return request<{ message: string }>(
      `/registrations/${encodeURIComponent(id)}/resend`,
      { method: "POST" }
    );
  },

  verify(payload: VerifyPayload) {
    return request<VerifyResult>("/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  contact(payload: { name: string; email: string; concern: string }) {
    return request<{ message: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
