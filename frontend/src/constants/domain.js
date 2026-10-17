// Mirrors the enums in backend/prisma/schema.prisma.

export const ROLES = ["ADMIN", "MANAGER", "SUPPORT"];
export const STAFF_ROLES = ["ADMIN", "MANAGER"];

export const isStaff = (user) => STAFF_ROLES.includes(user?.role);

export const TASK_STATUSES = [
  "TODO",
  "IN_PROGRESS",
  "CS_TICKET",
  "IT_TICKET",
  "COMPLETED",
];
// Agents complete tasks by dragging them on the board, not from the form.
export const OPEN_TASK_STATUSES = TASK_STATUSES.filter(
  (status) => status !== "COMPLETED",
);

export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

export const CLIENT_STATUSES = ["ONBOARDING", "ACTIVE", "SUSPENDED", "INACTIVE"];
export const SERVERS = ["live1", "live2", "live5", "live7"];
export const PLATFORMS = ["MT4", "MT5", "MT4SA", "MT5SA", "MTT", "cTrader", "ARK"];
