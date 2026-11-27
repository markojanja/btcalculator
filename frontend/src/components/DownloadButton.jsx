import axios from "axios";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// downloadId comes from the upload response; the server stores the converted
// file under that random id, not under the uploaded file name.
const DownloadButton = ({ downloadId, jsonFile }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/downloads/${downloadId}`,
        {
          responseType: "blob",
          withCredentials: true,
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `updated_${jsonFile?.name ?? "symbols.json"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    }
  };
  return (
    <Button type="button" className="w-full" onClick={handleDownload}>
      <Download />
      Download converted file
    </Button>
  );
};

export default DownloadButton;
