import { useState } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import DownloadButton from "../components/DownloadButton";
import { ImSpinner9 } from "react-icons/im";
import { converterHowTo } from "../utils/helpers";
import SymbolList from "../components/SymbolList";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field";
import { FaRegQuestionCircle } from "react-icons/fa";

import FileInput from "../components/FileInput";

const Converter = () => {
  const [jsonFile, setJsonFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [message, setMessage] = useState("");
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // const handleFileChange = (e) => {
  //   if (e.target.name === "jsonFile") {
  //     setJsonFile(e.target.files[0]); // Use `files[0]`
  //   }
  //   if (e.target.name === "excelFile") {
  //     setExcelFile(e.target.files[0]); // Use `files[0]`
  //   }
  // };

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
        withCredentials: true,
      });

      setSuccess(response.data.message);
      setMessage(response.data.noMatch.message);
      setSymbols(response.data.noMatch.symbols);
      setLoading(false);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full h-screen gap-4">
      {showModal && (
        <Modal setShowModal={setShowModal} content={converterHowTo} />
      )}
      <Card className={`w-1/3 p-4`}>
        <CardHeader>
          <div className="flex gap-1">
            <h3 className="text-lg font-bold">Excel to JSON Swap converter</h3>
            <div
              className="flex items-center justify-center mt-1"
              onClick={handleToggleModal}
            >
              <FaRegQuestionCircle style={{ cursor: "pointer" }} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <FieldGroup>
            <Field>
              <Label>Upload valid JSON</Label>
              <FileInput
                label="Upload valid JSON"
                accept=".json"
                fileName={jsonFile?.name}
                onChange={(e) => setJsonFile(e.target.files[0])}
              />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <Label>Upload valid Excel</Label>
              <FileInput
                label="Upload valid Excel"
                accept=".xlsx"
                fileName={excelFile?.name}
                onChange={(e) => setExcelFile(e.target.files[0])}
              />
            </Field>
            <FieldSeparator />
          </FieldGroup>
          <Button onClick={handleUpload}>
            {loading ? "Loading..." : "Upload and Update"}
          </Button>
          {success && (
            <>
              <p>{success}</p>
              <DownloadButton jsonFile={jsonFile} />
            </>
          )}
        </CardContent>
        <div
          className="flex-col"
          style={{
            alignItems: "center",
            position: "relative",
            padding: "2rem 0",
          }}
        >
          {loading && (
            <div className="loading-container">
              <ImSpinner9 className="spinner" size={36} />
            </div>
          )}
          {message && <h3 className="list-heading">{message}</h3>}
          {symbols.length > 0 && <SymbolList symbols={symbols} />}
        </div>
      </Card>
    </div>
  );
};

export default Converter;
