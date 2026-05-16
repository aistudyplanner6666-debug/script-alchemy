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
