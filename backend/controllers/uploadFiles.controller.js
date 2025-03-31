import fs from "fs/promises";
import xlsx from "xlsx";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let jsonData = [];
let swapTable = [];

export const uploadFiles = async (req, res) => {
  let noMatch = [];

  try {
    const filename = req.files.jsonFile[0].originalname;
    const filePath = path.join(__dirname, "..", "uploads", filename);

    // Read XLSX file for swapTable data
    const xlsFile = path.join(__dirname, "..", "uploads", req.files.xlsxFile[0].originalname);
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
    const filePathDownloads = path.join(__dirname, "..", "downloads", `updated_${filename}`);

    // Write the file back with UTF-16 LE encoding and add BOM manually
    const utf16WithBOM = "\uFEFF" + jsonString; // Add BOM manually
    await fs.writeFile(filePathDownloads, utf16WithBOM, { encoding: "utf16le" });
    // Remove uploaded files
    await fs.unlink(xlsFile);
    await fs.unlink(path.join(__dirname, "..", "uploads", filename));

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://btcalculator.onrender.com"
        : `http://localhost:${3000}`;

    const downloadUrl = `${baseUrl}/downloads/${"updated_" + filename}`;

    res.json({
      message: "JSON updated and saved successfully!",
      noMatch: { message: "symbols not updated!", symbols: noMatch },
      downloadUrl,
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: err.message || "Error processing file" });
  }
};
