import axios from "axios";
import { clearToken, getToken } from "./auth";

const normalizeBase = (base) => base.replace(/\/+$/, "");

const resolveBaseUrl = () => {
  const rawBase =
    process.env.REACT_APP_API_URL ||
    "https://travel-together-backend.onrender.com";
  const base = normalizeBase(rawBase);

  return base.endsWith("/api") ? base : `${base}/api`;
};

const API = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 15000,
});

API.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearToken();
    }

    return Promise.reject(error);
  },
);

export default API;
