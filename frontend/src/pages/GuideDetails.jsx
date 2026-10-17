import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, notifyError } from "../lib/api";
import { useGuide } from "../api/guides";
import useAuth from "../hooks/useAuth";
import { isStaff } from "../constants/domain";
import { formatDate } from "../lib/format";
import { saveBlob } from "../lib/download";
import DetailLayout from "../components/DetailLayout";
import Loading from "../components/Loading";

const GuideDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: guide, isLoading } = useGuide(id);
  const [downloading, setDownloading] = useState(false);

  if (isLoading || !guide) return <Loading />;

  // Matches the backend rule: the author or staff can edit a guide.
  const canEdit = user?.id === guide.userId || isStaff(user);

  const downloadPDF = async () => {
    try {
      setDownloading(true);
      const res = await api.get(`/guides/${guide.id}/pdf`, {
        responseType: "blob",
      });
      saveBlob(res.data, `${guide.title.replace(/\s+/g, "-")}.pdf`);
    } catch (error) {
      notifyError(error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <DetailLayout
      title={guide.title}
      html={guide.description}
      actions={
        <>
          <Button disabled={downloading} onClick={downloadPDF}>
            {downloading ? "Downloading" : "Download PDF"}
          </Button>
          {canEdit && (
            <Link
              to={`/guides/${guide.id}/edit`}
              aria-label="Edit guide"
              className="border border-primary rounded-sm text-primary px-3.5 py-1.5 hover:bg-primary/20 transition-all duration-150 text-sm"
            >
              <Pencil />
            </Link>
          )}
        </>
      }
      details={
        <>
          <p>author: {guide.user?.username}</p>
          <p>published: {guide.published ? "✅" : "❌"}</p>
          <p>created: {formatDate(guide.createdAt)}</p>
        </>
      }
      backTo="/guides"
      backLabel="Back to guides"
    />
  );
};

export default GuideDetails;
