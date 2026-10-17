import axios from "axios";
import { toast } from "react-toastify";

// Every request goes through this client: base URL and session cookie are set once.
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// AuthProvider registers what to do when the session has expired.
let handleUnauthorized = () => {};
export const setUnauthorizedHandler = (handler) => {
  handleUnauthorized = handler;
};

api.interceptors.response.use(undefined, (error) => {
  const isAuthRequest = error.config?.url?.startsWith("/auth/");
  if (error.response?.status === 401 && !isAuthRequest) {
    handleUnauthorized();
  }
  return Promise.reject(error);
});

// The backend uses a few error shapes; this finds the human-readable one.
export const errorMessage = (error) => {
  const data = error?.response?.data;
  if (typeof data?.message === "string") return data.message;
  if (data?.message?.text) return data.message.text;
  if (data?.errors?.[0]?.message) return data.errors[0].message;
  return "Something went wrong. Please try again.";
};

export const isUnauthorized = (error) => error?.response?.status === 401;

export const notifyError = (error) => {
  // An expired session redirects to login; no need for a toast as well.
  if (isUnauthorized(error)) return;
  toast.error(errorMessage(error), { autoClose: 5000 });
};
