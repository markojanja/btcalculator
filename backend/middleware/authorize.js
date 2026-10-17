export const STAFF_ROLES = ["ADMIN", "MANAGER"];

export const isStaff = (user) => STAFF_ROLES.includes(user?.role);

export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (roles.includes(req.user?.role)) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden." });
  };

export const requireStaff = requireRole(...STAFF_ROLES);
