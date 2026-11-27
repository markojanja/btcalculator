import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "../db/prisma.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
        omit: { password: false },
      });
      if (!user) {
        return done(null, false, { message: "Invalid credentials." });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Invalid credentials." });
      }
      const { password: passwordHash, ...safeUser } = user;
      return done(null, safeUser);
    } catch (error) {
      return done(error);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Runs on every request (and socket handshake) that has a session.
passport.deserializeUser(async (id, done) => {
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  } catch (error) {
    return done(error);
  }

  // Deleted or deactivated users are treated as logged out from their next
  // request on, not only at their next login.
  if (!user || !user.active) {
    return done(null, false);
  }
  return done(null, user);
});

export default passport;
