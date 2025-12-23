const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!baseUrl) {
  throw new Error("Missing EXPO_PUBLIC_API_BASE_URL environment variable");
}

// normalize by stripping trailing slash so callers can safely append paths
export const API_BASE_URL = baseUrl.replace(/\/$/, "");
export const DEFAULT_TIMEOUT_MS = 10_000;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

export const IS_LOCAL_API_BASE_URL = (() => {
  try {
    const host = new URL(API_BASE_URL).hostname.toLowerCase();
    return LOCAL_HOSTS.has(host);
  } catch {
    return false;
  }
})();
