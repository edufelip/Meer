const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!baseUrl) {
  throw new Error("Missing EXPO_PUBLIC_API_BASE_URL environment variable");
}

// normalize by stripping trailing slash so callers can safely append paths
export const API_BASE_URL = baseUrl.replace(/\/$/, "");
export const DEFAULT_TIMEOUT_MS = 10_000;
