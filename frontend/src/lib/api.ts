import axios from "axios";

export const TOKEN_KEY = "erp_token";

// export const api = axios.create({ baseURL: "" }); // paths already start with /api
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? "" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Expired or invalid token: clear it and go back to login.
    if (err.response?.status === 401 && !err.config?.url?.includes("/api/auth/login")) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (!err.response) return "Cannot reach the server. Is the backend running?";
  }
  return "Something went wrong. Please try again.";
}
