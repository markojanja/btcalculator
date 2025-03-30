import { useState } from "react";
import axios from "axios";
import CalculatorHeading from "./CalculatorHeading";

const Converter = () => {
  const [jsonFile, setJsonFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [message, setMessage] = useState("");
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleFileChange = (e) => {
    if (e.target.name === "jsonFile") {
      setJsonFile(e.target.files[0]); // Use `files[0]`
    }
    if (e.target.name === "excelFile") {
      setExcelFile(e.target.files[0]); // Use `files[0]`
    }
  };

  const handleUpload = async () => {
    if (!jsonFile || !excelFile) {
      alert("Please select both files before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("jsonFile", jsonFile);
    formData.append("xlsxFile", excelFile);
    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(response.data.message);
      setMessage(response.data.noMatch.message);
      setSymbols(response.data.noMatch.symbols);
      setLoading(false);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="converter">
        <CalculatorHeading
          title={"Excel to JSON Swap Converter"}
          editMode={false}
          setEditMode={null}
          visible={false}
          setShowModal={console.log("Hello")}
        />

        <div className="input-group flex-col">
          <label>Upload valid JSON</label>
          <input type="file" name="jsonFile" accept=".json" onChange={handleFileChange} />
        </div>
        <div className="input-group flex-col">
          <label>Upload valid Excel</label>
          <input type="file" name="excelFile" accept=".xlsx" onChange={handleFileChange} />
        </div>
        <button onClick={handleUpload} style={{ minWidth: "190px" }}>
          {loading ? "Loading..." : "Upload and Update"}
        </button>
        {success && <p>{success}</p>}
      </div>
      <div
        className="flex-col"
        style={{ alignItems: "center", position: "relative", padding: "2rem 0" }}
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: "50",
              background: "oklch(0.21 0.034 264.665)",
            }}
          >
            <h3>Loading ...</h3>
          </div>
        )}
        {message && (
          <h3 style={{ textAlign: "left", width: "30%", margin: "0 auto" }}>{message}</h3>
        )}
        {symbols.length > 0 && (
          <ul className="flex-col" style={{ textAlign: "left", width: "30%", margin: "0 auto" }}>
            {symbols.map((symbol) => (
              <li key={symbol}>{symbol}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Converter;
