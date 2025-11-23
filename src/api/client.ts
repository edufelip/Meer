import axios from "axios";
import { API_BASE_URL } from "../network/config";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

api.interceptors.request.use(
  async (config) => {
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
  (error) => {
    if (error.response) {
      console.log(
        `[API][RESPONSE][ERROR] ${error.response.status} ${error.config?.url}`,
        { data: error.response.data }
      );
    } else {
      console.log("[API][RESPONSE][ERROR]", error.message);
    }
    return Promise.reject(error);
  }
);
