import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import url from "url";
import xlsx from "xlsx";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DOWNLOADS_DIR = path.join(__dirname, "..", "downloads");
const MAX_AGE_MS = 60 * 60 * 1000; // converted files are kept for 1 hour

const badRequest = (res, message) => res.status(400).json({ message });

// Delete converted files older than MAX_AGE_MS. Failures are ignored: a file
// left behind is harmless and will be retried on the next upload.
const removeOldDownloads = async () => {
  try {
    const names = await fs.readdir(DOWNLOADS_DIR);
    await Promise.all(
      names.map(async (name) => {
        const file = path.join(DOWNLOADS_DIR, name);
        const { mtimeMs } = await fs.stat(file);
        if (Date.now() - mtimeMs > MAX_AGE_MS) await fs.unlink(file);
      }),
    );
  } catch {
    // ignore
  }
};

export const uploadFiles = async (req, res, next) => {
  const jsonUpload = req.files?.jsonFile?.[0];
  const xlsxUpload = req.files?.xlsxFile?.[0];

  if (!jsonUpload || !xlsxUpload) {
    return badRequest(res, "Please upload both the JSON and the Excel file.");
  }

  try {
    // Swap table from the first sheet of the Excel file
    let sheetData;
    try {
      const wb = xlsx.read(xlsxUpload.buffer, { type: "buffer" });
      sheetData = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    } catch {
      return badRequest(res, "The Excel file could not be read.");
    }
    const swapTable = sheetData.map((row) => ({
      Symbol: row.Symbol,
      SwapLong: row["Long Value"] || "0.00000000",
      SwapShort: row["Short Value"] || "0.00000000",
    }));

    // MT5 exports JSON as UTF-16 LE, usually with a BOM
    let text = jsonUpload.buffer.toString("utf16le");
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

    let jsonData;
    try {
      jsonData = JSON.parse(text);
    } catch {
      return badRequest(
        res,
        "The JSON file could not be read. Is it an MT5 export (UTF-16)?",
      );
    }

    const symbols = jsonData?.Server?.[0]?.ConfigSymbols;
    if (!Array.isArray(symbols)) {
      return badRequest(res, "The JSON file has no Server[0].ConfigSymbols list.");
    }

    const noMatch = [];
    symbols.forEach((item) => {
      const match = swapTable.find((row) => row.Symbol === item.Symbol);
      if (match) {
        item.SwapLong = Number(match.SwapLong).toFixed(9);
        item.SwapShort = Number(match.SwapShort).toFixed(9);
      } else {
        noMatch.push(item.Symbol);
      }
    });

    // Save under a random id, never under the uploaded file name
    await removeOldDownloads();
    const downloadId = crypto.randomUUID();
    const utf16WithBOM = "﻿" + JSON.stringify(jsonData, null, 2);
    await fs.writeFile(path.join(DOWNLOADS_DIR, `${downloadId}.json`), utf16WithBOM, {
      encoding: "utf16le",
    });

    return res.status(200).json({
      message: "JSON updated and saved successfully!",
      noMatch: { message: "symbols not updated!", symbols: noMatch },
      downloadId,
    });
  } catch (err) {
    next(err);
  }
};
