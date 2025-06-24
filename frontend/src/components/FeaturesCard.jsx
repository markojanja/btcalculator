import "./FeaturesCard.css";
import { Link } from "react-router-dom";

const FeaturesCard = ({ feature }) => {
  return (
    <div className="features-card">
      <Link to={`/features/${feature.id}`}>
        <h3>{feature.title}</h3>
        <p>Author: {feature.user?.username}</p>
        <p>Released:{feature.released ? "✅" : "❌"}</p>
        <p>📅 {new Date(feature.releaseDate).toLocaleDateString()}</p>
        <p>Published:{feature.published ? "✅" : "❌"}</p>
        <p>Created: {new Date(feature.createdAt).toLocaleDateString()}</p>
      </Link>
    </div>
  );
};

export default FeaturesCard;
