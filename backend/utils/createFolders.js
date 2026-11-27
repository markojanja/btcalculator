import path from "path";
import url from "url";
import fs from "fs/promises";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createFolders = async () => {
  // Uploads are kept in memory (see multer.config.js); only converted files
  // are written to disk.
  const downloadsDir = path.join(__dirname, "..", "downloads");
  await fs.mkdir(downloadsDir, { recursive: true });
};
