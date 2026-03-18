import { clearToken, getToken } from "./auth";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://travel-together-backend.onrender.com";

const buildUrl = (path) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}/api${normalized}`;
};

const isFormData = (body) =>
  typeof FormData !== "undefined" && body instanceof FormData;

export const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !isFormData(options.body) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearToken();
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = data?.message || "Request failed.";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};
