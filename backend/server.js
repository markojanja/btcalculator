import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import path from "path";
import url from "url";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./db/prisma.js";
import UploadRouter from "./routes/uploadFiles.route.js";
import DownloadRouter from "./routes/downloadFiles.route.js";
import LoginRouter from "./routes/auth.route.js";
import TasksRouter from "./routes/tasks.route.js";
import { createFolders } from "./utils/createFolders.js";

import { isAuth } from "./middleware/isAuth.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // Check for expired sessions every 2 minutes
      dbRecordIdIsSessionId: true, // Make sure the session ID is used as the record ID
    }),
    cookie: {
      maxAge: 7 * 60 * 60 * 1000, // 7hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.CORS,
    credentials: true,
  })
);

// this line is required by render
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use(cookieParser());
app.use("/downloads", express.static(path.join(__dirname, "downloads")));

createFolders();

app.use("/", LoginRouter);

app.use("/", isAuth, UploadRouter);
app.use("/", isAuth, DownloadRouter);
app.use("/", isAuth, TasksRouter);

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
