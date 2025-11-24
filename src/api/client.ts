import axios from "axios";
import { API_BASE_URL } from "../network/config";
import { navigationRef } from "../app/navigation/navigationRef";
import { clearTokens, getTokens, saveTokens } from "../storage/authStorage";

const rawApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
type PendingRequest = {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
  originalRequest: any;
};
const pendingQueue: PendingRequest[] = [];

const flushQueue = (error: unknown, token: string | null) => {
  while (pendingQueue.length) {
    const pending = pendingQueue.shift();
    if (!pending) continue;
    if (token) {
      pending.originalRequest.headers = {
        ...pending.originalRequest.headers,
        Authorization: `Bearer ${token}`
      };
      api(pending.originalRequest).then(pending.resolve).catch(pending.reject);
    } else {
      pending.reject(error);
    }
  }
};

api.interceptors.request.use(
  async (config) => {
    const { token } = await getTokens();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }

    console.log(
      `[API][REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      {
        params: config.params,
        data: config.data,
        headers: config.headers
      }
    );
    return config;
  },
  (error) => {
    console.log("[API][REQUEST][ERROR]", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API][RESPONSE] ${response.status} ${response.config.url}`, { data: response.data });
    return response;
  },
  async (error) => {
    if (error.response) {
      console.log(
        `[API][RESPONSE][ERROR] ${error.response.status} ${error.config?.url}`,
        { data: error.response.data }
      );

      if (error.response.status === 401) {
        const originalRequest = error.config;

        if (originalRequest?._retry) {
          // Already retried; fail hard
          await clearTokens();
          if (navigationRef.isReady()) navigationRef.navigate("login");
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        // If a refresh is already in-flight, queue this request
        if (isRefreshing && refreshPromise) {
          return new Promise((resolve, reject) => {
            pendingQueue.push({ resolve, reject, originalRequest });
          });
        }

        // Start refresh
        isRefreshing = true;
        refreshPromise = (async () => {
          const { refreshToken } = await getTokens();
          if (!refreshToken) return null;
          const refreshed = await rawApi.post<{ token: string; refreshToken?: string }>(
            "/auth/refresh",
            { refreshToken }
          );
          await saveTokens(refreshed.data.token, refreshed.data.refreshToken);
          return refreshed.data.token;
        })();

        try {
          const newToken = await refreshPromise;
          isRefreshing = false;
          refreshPromise = null;

          if (!newToken) {
            await clearTokens();
            flushQueue(error, null);
            if (navigationRef.isReady()) navigationRef.navigate("login");
            return Promise.reject(error);
          }

          // Retry the original request
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`
          };

          // Process queued requests
          flushQueue(null, newToken);

          return api(originalRequest);
        } catch (refreshErr) {
          isRefreshing = false;
          refreshPromise = null;
          await clearTokens();
          flushQueue(refreshErr, null);
          if (navigationRef.isReady()) navigationRef.navigate("login");
          return Promise.reject(refreshErr);
        }
      }
    } else {
      console.log("[API][RESPONSE][ERROR]", error.message);
    }
    return Promise.reject(error);
  }
);
