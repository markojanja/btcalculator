import { useState } from "react";
import axios from "axios";

const Converter = () => {
  const [jsonFile, setJsonIFle] = useState(null);
  const [excelFile, setExcelFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.name === "jsonFile") {
      setJsonIFle(e.target.value);
    }
    if (e.target.name === "excelFile") {
      setExcelFile(e.target.value);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("jsonFile", jsonFile);
    formData.append("xlsxFile", excelFile);

    try {
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data.jsonData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="converter">
      <div className="input-group flex-col">
        <label>Upload valid json</label>
        <input type="file" name="jsonFile" accept=".json" onChange={handleFileChange} />
      </div>
      <div className="input-group flex-col">
        <label>Upload valid excel</label>
        <input type="file" name="excelFile" accept=".json" onChange={handleFileChange} />
      </div>
      <button onClick={handleUpload}>Upload and Update</button>
    </div>
  );
};

export default Converter;
