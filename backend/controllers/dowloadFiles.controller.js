import path from "path";
import { DOWNLOADS_DIR } from "./uploadFiles.controller.js";

// Only ids created by uploadFiles (random UUIDs) are accepted, so the path
// can never point outside the downloads folder.
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const downloadFiles = (req, res, next) => {
  const { id } = req.params;

  if (!UUID_PATTERN.test(id)) {
    return res.status(400).json({ message: "Invalid download id." });
  }

  const filePath = path.join(DOWNLOADS_DIR, `${id}.json`);

  res.download(filePath, "updated.json", (err) => {
    if (!err) return;
    if (err.code === "ENOENT" && !res.headersSent) {
      return res.status(404).json({
        message: "This file has expired. Please upload the files again.",
      });
    }
    next(err);
  });
};
