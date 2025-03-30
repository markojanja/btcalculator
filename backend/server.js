import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import url from "url";
import fs from "fs/promises";
import xlsx from "xlsx";
import multer from "multer";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage engine and multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();

app.use(
  cors({
    origin: process.env.CORS,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

let jsonData = [];
let swapTable = [];
const uploadsDir = path.join(__dirname, "uploads");
const downloadsDir = path.join(__dirname, "downloads");
// Ensure uploads and downloads directories exist
(async () => {
  await Promise.all([
    fs.mkdir(uploadsDir, { recursive: true }),
    fs.mkdir(downloadsDir, { recursive: true }),
  ]);
  console.log("Uploads and downloads folders are ready.");
})();

app.post("/", upload.fields([{ name: "jsonFile" }, { name: "xlsxFile" }]), async (req, res) => {
  let noMatch = [];

  try {
    const filename = req.files.jsonFile[0].originalname;
    const filePath = path.join(__dirname, "uploads", filename);

    // Read XLSX file for swapTable data
    const xlsFile = path.join(__dirname, "uploads", req.files.xlsxFile[0].originalname);
    const wb = xlsx.readFile(xlsFile);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const sheetData = xlsx.utils.sheet_to_json(sheet);
    swapTable = sheetData.map((row) => ({
      Symbol: row.Symbol,
      SwapLong: row["Long Value"] || "0.00000000",
      SwapShort: row["Short Value"] || "0.00000000",
    }));

    // Read the JSON file with UTF-16 LE encoding this is required by MT5
    let data = await fs.readFile(filePath, { encoding: "utf16le" });

    // Check for BOM and remove it if present
    if (data.charCodeAt(0) === 0xfeff) {
      data = data.slice(1); // Remove BOM
    }

    jsonData = JSON.parse(data);

    jsonData.Server[0].ConfigSymbols.forEach((item) => {
      const match = swapTable.find((row) => row.Symbol === item.Symbol);
      if (match) {
        item.SwapLong = Number(match.SwapLong).toFixed(9);
        item.SwapShort = Number(match.SwapShort).toFixed(9);
      } else {
        noMatch.push(item.Symbol);
      }
    });

    const jsonString = JSON.stringify(jsonData, null, 2);
    const filePathDownloads = path.join(__dirname, "downloads", `updated_${filename}`);

    // Write the file back with UTF-16 LE encoding and add BOM manually
    const utf16WithBOM = "\uFEFF" + jsonString; // Add BOM manually
    await fs.writeFile(filePathDownloads, utf16WithBOM, { encoding: "utf16le" });
    await fs.unlink(xlsFile);
    await fs.unlink(path.join(__dirname, "uploads", filename));

    res.json({
      message: "JSON updated and saved successfully!",
      noMatch: { message: "symbols not updated!", symbols: noMatch },
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: err.message || "Error processing file" });
  }
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
