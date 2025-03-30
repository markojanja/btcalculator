import path from "path";
import url from "url";
import fs from "fs/promises";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createFolders = async () => {
  const uploadsDir = path.join(__dirname, "..", "uploads");
  const downloadsDir = path.join(__dirname, "..", "downloads");

  await Promise.all([
    fs.mkdir(uploadsDir, { recursive: true }),
    fs.mkdir(downloadsDir, { recursive: true }),
  ]);
  console.log("Uploads and downloads folders are ready.");
};
