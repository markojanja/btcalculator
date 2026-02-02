import axios from "axios";
import DOMPurify from "dompurify";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";

const FeatureDetails = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const { user } = useAuth();
  const [feature, setFeature] = useState({});
  useEffect(() => {
    const getFeature = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/features/${id}`, {
          withCredentials: true,
        });
        console.log(response);
        setFeature(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFeature();
  }, []);

  const clean = DOMPurify.sanitize(feature.description);

  return (
    <div className="flex flex-col w-187.5 mx-auto gap-4">
      <div
        className={
          "flex justify-between items-center w-full bg-card shadow-sm p-4 rounded-md"
        }
      >
        <h2 className="text-2xl font-bold">{feature.title}</h2>
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <Link
            to={`/features/${feature.id}/edit`}
            className="border border-primary rounded-sm text-primary px-4 py-1.5 hover:bg-primary/20 transition-all duration-150"
          >
            Edit feature
          </Link>
        )}
      </div>
      <Card>
        <div
          className="flex flex-col overflow-y-scroll max-h-screen text-left p-4 gap-4 rte"
          id="feature-desc"
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </Card>

      <Card className={"text-left px-2 w-187.5"}>
        <CardContent className={"flex flex-col"}>
          <p>author:{feature.user?.username}</p>
          <p>published: {feature.published ? "✅" : "❌"}</p>
          <p>released: {feature.released ? "✅" : "❌"}</p>
          <p>
            release date: {new Date(feature.releaseDate).toLocaleDateString()}
          </p>
          <Link style={{ alignSelf: "flex-end" }} to={"/features"}>
            Back to features
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureDetails;
