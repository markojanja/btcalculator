import { Button } from "@/components/ui/button";
import { api, notifyError } from "../lib/api";
import { saveBlob } from "../lib/download";

// Downloads the converter's output for the uploaded file `fileName`.
const DownloadButton = ({ fileName }) => {
  const handleDownload = async () => {
    try {
      const response = await api.get(`/downloads/updated_${fileName}`, {
        responseType: "blob",
      });
      saveBlob(response.data, `updated_${fileName}`);
    } catch (error) {
      notifyError(error);
    }
  };

  return <Button onClick={handleDownload}>Download</Button>;
};

export default DownloadButton;
