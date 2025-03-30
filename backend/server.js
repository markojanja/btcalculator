import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UploadRouter from "./routes/uploadFiles.route.js";

import { createFolders } from "./utils/createFolders.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

createFolders();

app.use("/", UploadRouter);

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
