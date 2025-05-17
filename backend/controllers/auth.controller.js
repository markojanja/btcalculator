import passport from "../config/passport.js";

export const login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
    }

    if (!user) {
      return res.status(400).json({ errors: [{ message: info.message }] });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: "login ok", user: user });
    });
  })(req, res, next);
};

export const logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");

      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
};
export const status = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ user: req.user });
  }
  res.status(401).json({ user: null });
};
