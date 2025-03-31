import axios from "axios";

const DownloadButton = ({ jsonFile }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleDownload = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/downloads/updated_${jsonFile.name}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `updated_${jsonFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  return (
    <button style={{ minWidth: "190px" }} onClick={handleDownload}>
      Download
    </button>
  );
};

export default DownloadButton;
