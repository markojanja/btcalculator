import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const GuidesCard = ({ guide }) => {
  return (
    <Link to={`/guides/${guide.id}`}>
      <Card className={"w-1/3 text-left items-start justify-start mx-auto"}>
        <CardContent>
          <CardTitle className={"mb-2"}>
            <h3>{guide.title}</h3>
          </CardTitle>

          <p>Author: {guide.user?.username}</p>
          <p>Published:{guide.published ? "✅" : "❌"}</p>
          <p>Created: {new Date(guide.createdAt).toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GuidesCard;
