import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const FeaturesCard = ({ feature }) => {
  return (
    <Link to={`/features/${feature.id}`}>
      <Card
        className={
          "w-full lg:w-1/3 text-left items-start justify-start mx-auto"
        }
      >
        <CardContent>
          <CardTitle className={"mb-2"}>
            <h3>{feature.title}</h3>
          </CardTitle>
          <p>Author: {feature.user?.username}</p>
          <p>Released:{feature.released ? "✅" : "❌"}</p>
          <p>Published:{feature.published ? "✅" : "❌"}</p>
          <p>
            Release Date: {new Date(feature.releaseDate).toLocaleDateString()}
          </p>
          <p>
            Created Date: {new Date(feature.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FeaturesCard;
