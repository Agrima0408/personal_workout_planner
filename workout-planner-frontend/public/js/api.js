// Centralized API client. Every protected request gets the JWT automatically.
import { API_BASE_URL } from "./config.js";
import { getToken, clearAuth } from "./auth.js";

export class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors || null; // { field: message } from backend validation
  }
}

/**
 * Normalizes API response list whether it is a raw JSON array
 * or a Spring Data Page object ({ content: [...], totalElements: N }).
 */
export function normalizeList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  return [];
}

/**
 * Extracts total count from either raw array or Spring Page-style response.
 */
export function extractTotal(data) {
  if (!data) return 0;
  if (typeof data.totalElements === "number") return data.totalElements;
  if (Array.isArray(data)) return data.length;
  if (data && Array.isArray(data.content)) return data.content.length;
  return 0;
}

async function request(method, path, { body, auth = true } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const base = (API_BASE_URL || "/api").replace(/\/$/, "");

  let res;
  try {
    res = await fetch(base + cleanPath, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Cannot reach the server. Check that the backend is running.", 0);
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!res.ok) {
    if (res.status === 401 && auth) {
      clearAuth();
      location.hash = "#/login";
      throw new ApiError("Session expired. Please log in again.", 401);
    }
    const msg = (data && data.message) || (typeof data === "string" && data) || `Request failed (${res.status})`;
    throw new ApiError(msg, res.status, data && data.errors);
  }
  return data;
}

export const api = {
  get: (p) => request("GET", p),
  post: (p, body) => request("POST", p, { body }),
  del: (p) => request("DELETE", p),
  login: (userEmail, userPassword) =>
    request("POST", "/auth/login", { body: { userEmail, userPassword }, auth: false }),
};
