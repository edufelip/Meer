import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth.token";
const REFRESH_KEY = "auth.refreshToken";
const GUEST_KEY = "auth.guest";

// Simple in-memory cache to avoid hitting AsyncStorage on every request
let accessTokenCache: string | null = null;
let refreshTokenCache: string | null = null;
let guestModeCache: boolean | null = null;

export function setTokenCache(token?: string | null, refreshToken?: string | null) {
  if (token !== undefined) accessTokenCache = token;
  if (refreshToken !== undefined) refreshTokenCache = refreshToken;
}

export function getAccessTokenSync() {
  return accessTokenCache;
}

export function getRefreshTokenSync() {
  return refreshTokenCache;
}

export function getGuestModeSync() {
  return guestModeCache;
}

export async function saveTokens(token: string, refreshToken?: string) {
  setTokenCache(token, refreshToken ?? null);
  const ops = [AsyncStorage.setItem(TOKEN_KEY, token)];
  if (refreshToken) ops.push(AsyncStorage.setItem(REFRESH_KEY, refreshToken));
  await Promise.all(ops);
}

export async function getTokens() {
  if (accessTokenCache || refreshTokenCache) {
    return { token: accessTokenCache ?? undefined, refreshToken: refreshTokenCache ?? undefined };
  }

  const [token, refreshToken] = await Promise.all([
    AsyncStorage.getItem(TOKEN_KEY),
    AsyncStorage.getItem(REFRESH_KEY)
  ]);

  setTokenCache(token, refreshToken);
  return { token: token ?? undefined, refreshToken: refreshToken ?? undefined };
}

export async function getGuestMode() {
  if (guestModeCache !== null) return guestModeCache;
  const raw = await AsyncStorage.getItem(GUEST_KEY);
  const enabled = raw === "1";
  guestModeCache = enabled;
  return enabled;
}

export async function setGuestMode(enabled: boolean) {
  guestModeCache = enabled;
  if (enabled) {
    await AsyncStorage.setItem(GUEST_KEY, "1");
  } else {
    await AsyncStorage.removeItem(GUEST_KEY);
  }
}

export async function clearTokens() {
  setTokenCache(null, null);
  await Promise.all([AsyncStorage.removeItem(TOKEN_KEY), AsyncStorage.removeItem(REFRESH_KEY)]);
}
