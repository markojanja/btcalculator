import axios from "axios";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { CalendarDays, FileDown, Loader2, Pencil, UserRound } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BackLink, Page, PageLoading, Pill } from "../components/PageUI";

const GuideDetails = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [guide, setGuide] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const getGuide = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/guides/${id}`, {
          withCredentials: true,
        });
        setGuide(res.data);
      } catch {
        // the error toast (axios interceptor) shows what went wrong
      }
    };
    getGuide();
  }, [id]);

  const downloadPDF = async () => {
    try {
      setDownloading(true);
      const res = await axios.get(`${BACKEND_URL}/guides/${guide.id}/pdf`, {
        responseType: "blob",
        withCredentials: true,
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${guide.title.replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    } finally {
      setDownloading(false);
    }
  };

  if (!guide) return <PageLoading />;

  const clean = DOMPurify.sanitize(guide.description);

  return (
    <Page size="md">
      <BackLink to="/guides">Back to guides</BackLink>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          {!guide.published && <Pill>Draft</Pill>}
          <h1 className="text-3xl font-bold tracking-tight">{guide.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="size-4" />
              {guide.user?.username ?? "—"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {format(new Date(guide.createdAt), "d MMM yyyy")}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" disabled={downloading} onClick={downloadPDF}>
            {downloading ? <Loader2 className="animate-spin" /> : <FileDown />}
            {downloading ? "Preparing…" : "Download PDF"}
          </Button>
          {user?.id === guide.userId && (
            <Button variant="outline" asChild>
              <Link to={`/guides/${guide.id}/edit`}>
                <Pencil />
                Edit
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent>
          <div
            className="rte flex flex-col gap-4 text-left"
            dangerouslySetInnerHTML={{ __html: clean }}
          />
        </CardContent>
      </Card>
    </Page>
  );
};

export default GuideDetails;
