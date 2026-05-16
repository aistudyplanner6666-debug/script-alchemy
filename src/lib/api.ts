// Central API client. All HTTP calls to the backend go through here.
// Base URL is read from VITE_API_BASE_URL (see .env).

import type { Mood, Script } from "./mockScript";
import { generateMockScript } from "./mockScript";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

const TOKEN_KEY = "cinescript-token";

export const tokenStore = {
  get: () => {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  set: (t: string) => { try { localStorage.setItem(TOKEN_KEY, t); } catch {} },
  clear: () => { try { localStorage.removeItem(TOKEN_KEY); } catch {} },
};

export interface ApiUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) throw new ApiError("API base URL not configured", 0);
  const token = tokenStore.get();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new ApiError(data?.message || res.statusText || "Request failed", res.status);
  }
  return data as T;
}

/* ============================================================
 *  AUTH ENDPOINTS
 * ============================================================ */

export const authApi = {
  // POST /auth/signup { name, email, password } -> { token, user }
  signup: (payload: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // POST /auth/login { email, password } -> { token, user }
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // GET /auth/me -> { user }
  me: () => request<{ user: ApiUser }>("/auth/me"),

  // POST /auth/logout
  logout: () => request<{ ok: true }>("/auth/logout", { method: "POST" }),
};

/* ============================================================
 *  FORGOT PASSWORD — 3-phase flow (with mock fallback)
 *
 *  Phase 1: POST /auth/forgot-password { email }
 *           -> { ok, message }       (sends 6-digit OTP to email)
 *  Phase 2: POST /auth/verify-otp    { email, otp }
 *           -> { resetToken }        (short-lived token, ~10 min)
 *  Phase 3: POST /auth/reset-password { resetToken, password }
 *           -> { ok }
 *
 *  When VITE_API_BASE_URL is empty (or backend errors), we mock
 *  the flow in-memory so the UI is fully testable. The mock OTP
 *  is logged to the browser console AND surfaced in the response
 *  as `devOtp` so you can complete the flow without an inbox.
 * ============================================================ */

interface MockOtpRecord { otp: string; expiresAt: number; }
const mockOtpStore = new Map<string, MockOtpRecord>();
const mockResetTokens = new Map<string, { email: string; expiresAt: number }>();

function genOtp() { return Math.floor(100000 + Math.random() * 900000).toString(); }
function genToken() { return crypto.randomUUID().replace(/-/g, ""); }

export const passwordApi = {
  // PHASE 1
  forgotPassword: async (email: string): Promise<{ ok: true; message: string; devOtp?: string }> => {
    if (!API_BASE_URL) {
      const otp = genOtp();
      mockOtpStore.set(email.toLowerCase(), { otp, expiresAt: Date.now() + 10 * 60_000 });
      // eslint-disable-next-line no-console
      console.info(`[mock] OTP for ${email}: ${otp}`);
      await new Promise((r) => setTimeout(r, 700));
      return { ok: true, message: "OTP sent to your email", devOtp: otp };
    }
    try {
      return await request("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    } catch {
      const otp = genOtp();
      mockOtpStore.set(email.toLowerCase(), { otp, expiresAt: Date.now() + 10 * 60_000 });
      // eslint-disable-next-line no-console
      console.info(`[mock fallback] OTP for ${email}: ${otp}`);
      return { ok: true, message: "OTP sent (mock)", devOtp: otp };
    }
  },

  // PHASE 2
  verifyOtp: async (email: string, otp: string): Promise<{ resetToken: string }> => {
    const tryMock = (): { resetToken: string } => {
      const record = mockOtpStore.get(email.toLowerCase());
      if (!record) throw new ApiError("Please request a new OTP", 400);
      if (Date.now() > record.expiresAt) throw new ApiError("OTP expired", 400);
      if (record.otp !== otp.trim()) throw new ApiError("Incorrect OTP", 400);
      const token = genToken();
      mockResetTokens.set(token, { email: email.toLowerCase(), expiresAt: Date.now() + 10 * 60_000 });
      mockOtpStore.delete(email.toLowerCase());
      return { resetToken: token };
    };
    if (!API_BASE_URL) {
      await new Promise((r) => setTimeout(r, 500));
      return tryMock();
    }
    try {
      return await request<{ resetToken: string }>("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });
    } catch (e) {
      // only fallback if backend is unreachable (network error)
      if (e instanceof ApiError && e.status !== 0) throw e;
      return tryMock();
    }
  },

  // PHASE 3
  resetPassword: async (resetToken: string, password: string): Promise<{ ok: true }> => {
    const tryMock = (): { ok: true } => {
      const record = mockResetTokens.get(resetToken);
      if (!record) throw new ApiError("Invalid or expired reset link", 400);
      if (Date.now() > record.expiresAt) throw new ApiError("Reset link expired", 400);
      mockResetTokens.delete(resetToken);
      return { ok: true };
    };
    if (!API_BASE_URL) {
      await new Promise((r) => setTimeout(r, 600));
      return tryMock();
    }
    try {
      return await request<{ ok: true }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ resetToken, password }),
      });
    } catch (e) {
      if (e instanceof ApiError && e.status !== 0) throw e;
      return tryMock();
    }
  },
};


/* ============================================================
 *  SCRIPT ENDPOINTS
 *  Falls back to mock generation if VITE_API_BASE_URL is empty
 *  or the backend is unreachable — keeps the demo working.
 * ============================================================ */

export const scriptApi = {
  // POST /scripts/generate { situation, mood } -> Script
  generate: async (situation: string, mood: Mood): Promise<Script> => {
    if (!API_BASE_URL) {
      await new Promise((r) => setTimeout(r, 800));
      return generateMockScript(situation, mood);
    }
    try {
      return await request<Script>("/scripts/generate", {
        method: "POST",
        body: JSON.stringify({ situation, mood }),
      });
    } catch {
      // graceful fallback so the UI still works without a backend
      return generateMockScript(situation, mood);
    }
  },

  // GET /scripts -> Script[]
  list: () => request<Script[]>("/scripts"),

  // GET /scripts/:id -> Script
  get: (id: string) => request<Script>(`/scripts/${id}`),

  // DELETE /scripts/:id
  remove: (id: string) => request<{ ok: true }>(`/scripts/${id}`, { method: "DELETE" }),
};
