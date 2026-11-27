import axios from "axios";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarDays, Pencil, UserRound } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BackLink, Page, PageLoading, Pill } from "../components/PageUI";

const FeatureDetails = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const { user } = useAuth();
  const [feature, setFeature] = useState(null);
  const canEdit = user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    const getFeature = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/features/${id}`, {
          withCredentials: true,
        });
        setFeature(response.data);
      } catch {
        // the error toast (axios interceptor) shows what went wrong
      }
    };
    getFeature();
  }, [id]);

  if (!feature) return <PageLoading />;

  const clean = DOMPurify.sanitize(feature.description);

  return (
    <Page size="md">
      <BackLink to="/features">Back to features</BackLink>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <Pill tone={feature.released ? "green" : "amber"}>
              {feature.released ? "Released" : "Upcoming"}
            </Pill>
            {!feature.published && <Pill>Draft</Pill>}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{feature.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="size-4" />
              {feature.user?.username ?? "—"}
            </span>
            {feature.releaseDate && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                {feature.released ? "Released" : "Planned for"}{" "}
                {format(new Date(feature.releaseDate), "d MMM yyyy")}
              </span>
            )}
          </div>
        </div>
        {canEdit && (
          <Button variant="outline" asChild>
            <Link to={`/features/${feature.id}/edit`}>
              <Pencil />
              Edit
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardContent>
          <div
            className="rte flex flex-col gap-4 text-left"
            id="feature-desc"
            dangerouslySetInnerHTML={{ __html: clean }}
          />
        </CardContent>
      </Card>
    </Page>
  );
};

export default FeatureDetails;
