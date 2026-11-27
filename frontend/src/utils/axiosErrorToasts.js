import axios from "axios";
import { toast } from "react-toastify";

// Shows the backend's error message as a toast for every failed axios request.
// The error is re-thrown, so each page's own catch/finally still runs.

const getMessage = (data) => {
  // errorHandler sends { message: { text } }, controllers send { message }
  if (typeof data?.message?.text === "string") return data.message.text;
  if (typeof data?.message === "string") return data.message;
  if (typeof data === "string" && data.length < 200) return data;
  return null;
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    if (!error.response) {
      toast.error("Can't reach the server. Check your connection.", {
        toastId: "network-error",
      });
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const url = error.config?.url ?? "";

    // /auth/status returns 401 on every page load when logged out, and the
    // login page shows its own error message
    if (url.endsWith("/auth/status") || url.endsWith("/auth/login")) {
      return Promise.reject(error);
    }

    const fallback =
      status === 403
        ? "You don't have permission to do this."
        : status === 404
          ? "Not found."
          : "Something went wrong. Please try again.";

    const message = getMessage(data) ?? fallback;

    // toastId stops the same message stacking up when several requests fail
    toast.error(message, { toastId: message });

    return Promise.reject(error);
  },
);
