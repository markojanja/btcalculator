import { useState } from "react";
import axios from "axios";

const Converter = () => {
  const [jsonFile, setJsonFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [message, setMessage] = useState("");
  const [symbols, setSymbols] = useState([]);

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
    // Log FormData contents

    console.log(formData);

    try {
      const response = await axios.post("http://localhost:3000/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      setSuccess(response.data.message);
      setMessage(response.data.noMatch.message);
      setSymbols(response.data.noMatch.symbols);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <>
      <div className="converter">
        <div className="input-group flex-col">
          <label>Upload valid JSON</label>
          <input type="file" name="jsonFile" accept=".json" onChange={handleFileChange} />
        </div>
        <div className="input-group flex-col">
          <label>Upload valid Excel</label>
          <input type="file" name="excelFile" accept=".xlsx" onChange={handleFileChange} />
        </div>
        <button onClick={handleUpload}>Upload and Update</button>
        {success && <p>{success}</p>}
      </div>
      <div className="flex-col" style={{ alignItems: "center" }}>
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
    </>
  );
};

export default Converter;
