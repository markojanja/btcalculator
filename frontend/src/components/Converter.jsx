import { useState } from "react";
import axios from "axios";
import CalculatorHeading from "./CalculatorHeading";
import Modal from "./Modal";
import DownloadButton from "./DownloadButton";
import { ImSpinner9 } from "react-icons/im";
import { converterHowTo } from "../utils/helpers";
import SymbolList from "./SymbolList";

const Converter = () => {
  const [jsonFile, setJsonFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [message, setMessage] = useState("");
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    <>
      {showModal && <Modal setShowModal={setShowModal} content={converterHowTo} />}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="converter">
          <CalculatorHeading
            title={"Excel to JSON Swap Converter"}
            editMode={false}
            setEditMode={null}
            visible={false}
            setShowModal={setShowModal}
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
          {success && (
            <>
              <p>{success}</p>
              <DownloadButton jsonFile={jsonFile} />
            </>
          )}
        </div>
        <div
          className="flex-col"
          style={{ alignItems: "center", position: "relative", padding: "2rem 0" }}
        >
          {loading && (
            <div className="loading-container">
              <ImSpinner9 className="spinner" size={36} />
            </div>
          )}
          {message && <h3 className="list-heading">{message}</h3>}
          {symbols.length > 0 && <SymbolList symbols={symbols} />}
        </div>
      </div>
    </>
  );
};

export default Converter;
