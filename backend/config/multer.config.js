import multer from "multer";

// Uploaded files stay in memory: nothing is written to disk under a name
// chosen by the browser, and nothing needs cleaning up afterwards.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB per file
    files: 2,
  },
});
