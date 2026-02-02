import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import useAuth from "../hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";

const GuideDetails = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [guide, setGuide] = useState({});
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const getGuide = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/guides/${id}`, {
          withCredentials: true,
        });
        setGuide(res.data);
        console.log(res.data.userId, user.id);
      } catch (error) {
        console.log(error);
      }
    };
    getGuide();
  }, []);

  const clean = DOMPurify.sanitize(guide.description);

  return (
    <div className="flex flex-col w-187.5 mx-auto gap-4">
      <div
        className={
          "flex justify-between items-center w-full bg-card shadow-sm p-4 rounded-md"
        }
      >
        <h2 className="text-2xl font-bold">{guide.title}</h2>
        {user?.id === guide.userId && (
          <Link
            to={`/guides/${guide.id}/edit`}
            className="border border-primary rounded-sm text-primary px-4 py-1.5 hover:bg-primary/20 transition-all duration-150"
          >
            Edit Guide
          </Link>
        )}
      </div>
      <Card>
        <div
          className="flex flex-col overflow-y-scroll max-h-screen text-left p-4 gap-4 rte"
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </Card>
      <Card className={"text-left px-2 w-187.5"}>
        <CardContent className={"flex flex-col"}>
          <p>author:{guide.user?.username}</p>
          <p>published: {guide.published ? "✅" : "❌"}</p>
          <p>created: {new Date(guide.createdAt).toLocaleDateString()}</p>

          <Link className="self-end" to={"/guides"}>
            Back to guides
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuideDetails;
