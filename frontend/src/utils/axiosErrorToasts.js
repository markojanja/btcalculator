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
  async (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    if (!error.response) {
      toast.error("Can't reach the server. Check your connection.", {
        toastId: "network-error",
      });
      return Promise.reject(error);
    }

    const { status } = error.response;
    let { data } = error.response;
    const url = error.config?.url ?? "";

    // The login page shows its own error message
    if (url.endsWith("/auth/login")) {
      return Promise.reject(error);
    }

    // 401 means "not logged in"; the app sends people to the login page for
    // that, so a toast would only confuse. Exception: password change uses
    // 401 for "current password incorrect".
    if (status === 401 && !url.endsWith("/auth/passwordchange")) {
      return Promise.reject(error);
    }

    // Requests made with responseType "blob" (file downloads) get their JSON
    // error body as a Blob too
    if (data instanceof Blob) {
      try {
        data = JSON.parse(await data.text());
      } catch {
        data = null;
      }
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
