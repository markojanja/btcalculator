import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import url from "url";
import fs from "fs/promises"; // Use the Promises API for cleaner async handling
import xlsx from "xlsx";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

let jsonData = [];
let swapTable = [];

app.get("/", async (req, res) => {
  console.log(req.body);

  try {
    const filename = "FTT-MT5.json"; // Ensure the correct file name is here
    const filePath = path.join(__dirname, "testdata", filename);

    // Read XLSX file for swapTable data
    const xlsFile = path.join(__dirname, "testdata", "lsg.xlsx");
    const wb = xlsx.readFile(xlsFile);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const sheetData = xlsx.utils.sheet_to_json(sheet);
    swapTable = sheetData.map((row) => ({
      Symbol: row.Symbol,
      SwapLong: row["Long Value"] || "0.00000000",
      SwapShort: row["Short Value"] || "0.00000000",
    }));

    // Read the JSON file with UTF-16 LE encoding
    let data = await fs.readFile(filePath, { encoding: "utf16le" });
    // console.log("Raw file content before processing:", data); // Debugging read content

    // Check for BOM and remove it if present
    if (data.charCodeAt(0) === 0xfeff) {
      // console.log("BOM detected and removed.");
      data = data.slice(1); // Remove BOM
    } else {
      // console.log("No BOM detected.");
    }

    // Parse the JSON content
    jsonData = JSON.parse(data);
    // console.log("Parsed JSON:", jsonData); // Debugging parsed data

    // Update JSON data with swapTable information
    jsonData.Server[0].ConfigSymbols.forEach((item) => {
      const match = swapTable.find((row) => row.Symbol === item.Symbol);
      if (match) {
        item.SwapLong = match.SwapLong;
        item.SwapShort = match.SwapShort;
      }
    });

    // console.log("Updated JSON:", jsonData); // Debugging updated data

    // Convert updated JSON back to string
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Write the file back with UTF-16 LE encoding and add BOM manually
    const utf16WithBOM = "\uFEFF" + jsonString; // Add BOM manually
    await fs.writeFile(filePath, utf16WithBOM, { encoding: "utf16le" });

    // console.log("File successfully written as UTF-16 LE.");

    res.json({ message: "JSON updated and saved successfully!" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: err.message || "Error processing file" });
  }
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
