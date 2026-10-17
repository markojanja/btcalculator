import bcrypt from "bcryptjs";
import passport from "../config/passport.js";
import prisma from "../db/prisma.js";

export const login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(400).json({ errors: [{ message: info.message }] });
    }

    if (!user.active) {
      return res.status(403).json({
        errors: [
          { message: "Your account is inactive. Please contact admin." },
        ],
      });
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

export const passwordChange = async (req, res, next) => {
  const userID = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    //get user

    const user = await prisma.user.findUnique({
      omit: { password: false },
      where: { id: userID },
    });
    // compare pwd

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password incorrect" });
    }
    //update pwd

    const SALT = 10;
    const newHashedPassword = await bcrypt.hash(newPassword, SALT);
    // update user

    await prisma.user.update({
      where: { id: userID },
      data: {
        password: newHashedPassword,
      },
    });

    req.logout((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Password changed but logout failed" });
      }

      req.session.destroy(() => {
        res.status(200).json({
          message: "Password changed. Please log in again.",
        });
      });
    });
  } catch (error) {
    next(error);
  }
};
