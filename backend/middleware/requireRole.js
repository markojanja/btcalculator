import { Role } from "@prisma/client";

const VALID_ROLES = Object.values(Role);

const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

export const requireRole = (...allowed) => {
  if (allowed.length === 0) {
    throw new Error("requireRole() needs at least one role");
  }

  const unknown = allowed.filter((role) => !VALID_ROLES.includes(role));
  if (unknown.length) {
    throw new Error(`requireRole(): unknown role(s) ${unknown.join(", ")}`);
  }

  return (req, res, next) => {
    if (!req.user) {
      return next(httpError(401, "Unauthorized. Please sign in."));
    }
    if (!allowed.includes(req.user.role)) {
      return next(httpError(403, "You don't have permission to do this."));
    }
    return next();
  };
};

export const staffOnly = requireRole(Role.ADMIN, Role.MANAGER);
export const adminOnly = requireRole(Role.ADMIN);
