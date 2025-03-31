import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UploadRouter from "./routes/uploadFiles.route.js";
import DownloadRouter from "./routes/downloadFiles.route.js";
import path from "path";
import url from "url";
import { createFolders } from "./utils/createFolders.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: process.env.CORS,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/downloads", express.static(path.join(__dirname, "downloads")));

createFolders();

app.use("/", UploadRouter);
app.use("/", DownloadRouter);

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
