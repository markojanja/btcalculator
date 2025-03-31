import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadFiles = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "..", "downloads", `updated_${filename}`);

  res.download(filePath, filename, (err) => {
    if (err) {
      res.status(500).send("Error downloading the file");
    }
  });
};
