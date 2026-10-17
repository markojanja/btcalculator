// dd/mm/yyyy, the format used across tables and cards.
export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

export const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("en-GB") : "";

// "SUPPORT" -> "Support", "IN_PROGRESS" -> "In progress"
export const humanize = (value = "") =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace(/_/g, " ");

export const formatPipValue = (value) => {
  return Math.abs(value - Math.round(value)) < 1e-5
    ? Math.round(value)
    : Number(value.toFixed(5));
};
